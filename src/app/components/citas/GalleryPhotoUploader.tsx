import { useEffect, useRef, useState } from "react";
import { Camera, LoaderCircle, Upload, X } from "lucide-react";
import { GALLERY_PHOTO_TYPES, validateGalleryPhoto } from "../../../data/gallery-photos";

export type UploadedPhotoFile = {
  url: string;
  fileName: string;
};

type Props = {
  value?: string;
  allowMultiple?: boolean;
  disabled: boolean;
  onUploaded?: (url: string) => void;
  onUploadedMany?: (items: UploadedPhotoFile[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  onError: (message: string) => void;
};

function verifyImageDecodes(objectUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("El archivo no es una fotografía válida o está dañado."));
    image.src = objectUrl;
  });
}

export function GalleryPhotoUploader({
  value = "",
  allowMultiple = false,
  disabled,
  onUploaded,
  onUploadedMany,
  onUploadingChange,
  onError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const preview = localPreview || value;
  const busy = disabled || uploading;

  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    },
    [localPreview],
  );

  const uploadSingleFile = async (file: File): Promise<UploadedPhotoFile> => {
    const validationError = validateGalleryPhoto(file.type, file.size, file.name);
    if (validationError) throw new Error(`${file.name}: ${validationError}`);

    const objectUrl = URL.createObjectURL(file);
    if (!allowMultiple) setLocalPreview(objectUrl);

    try {
      await verifyImageDecodes(objectUrl);
      const formData = new FormData();
      formData.append("photo", file);
      const response = await fetch("/api/uploads/gallery-photo", {
        method: "POST",
        body: formData,
      });
      if (response.status === 413) {
        throw new Error(`${file.name}: Cada fotografía no debe superar 4 MB.`);
      }
      const result = await response.json();
      if (!response.ok || !result.url) {
        throw new Error(result.error || `No se pudo subir ${file.name}.`);
      }
      return { url: result.url, fileName: file.name };
    } finally {
      if (allowMultiple) URL.revokeObjectURL(objectUrl);
    }
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || busy) return;
    onError("");

    const files = allowMultiple ? Array.from(fileList) : [fileList[0]];
    setUploading(true);
    onUploadingChange(true);

    const uploaded: UploadedPhotoFile[] = [];
    const errors: string[] = [];

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgressText(
          files.length > 1
            ? `Subiendo fotografía ${index + 1} de ${files.length}…`
            : "Subiendo fotografía…",
        );
        try {
          const item = await uploadSingleFile(file);
          uploaded.push(item);
        } catch (err) {
          errors.push(err instanceof Error ? err.message : `No se pudo subir ${file.name}.`);
        }
      }

      if (uploaded.length > 0) {
        if (allowMultiple && onUploadedMany) {
          onUploadedMany(uploaded);
        } else if (onUploaded) {
          onUploaded(uploaded[0].url);
        }
      }
      if (errors.length > 0) {
        onError(errors.join(" "));
      }
    } finally {
      setUploading(false);
      setProgressText("");
      onUploadingChange(false);
      setLocalPreview(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e5e0d8] bg-[#fafaf8] p-4" aria-busy={uploading}>
      <div
        className={`relative flex h-56 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:h-64 ${
          dragging ? "border-[#2d5a27] bg-[#edf1e8]" : "border-[#d7dcd1] bg-white"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        {!allowMultiple && preview && failedUrl !== preview ? (
          <img
            src={preview}
            alt="Vista previa de la fotografía"
            onError={() => setFailedUrl(preview)}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="px-5 text-center text-[#5a6b5a]">
            <Camera className="mx-auto mb-3 h-9 w-9 text-[#8aaf7e]" aria-hidden="true" />
            <p className="text-sm font-medium text-[#1a2e1a]">
              {allowMultiple
                ? "Arrastra aquí una o varias fotografías del evento"
                : preview
                  ? "No se pudo mostrar la fotografía. Sube otro archivo."
                  : "Arrastra aquí la fotografía"}
            </p>
            <p className="mt-1.5 text-xs text-[#5a6b5a]">
              Se admiten únicamente fotografías (JPG, PNG, WEBP o AVIF). No se permiten videos ni documentos.
            </p>
          </div>
        )}
        {uploading && (
          <div
            role="status"
            className="absolute inset-0 flex items-center justify-center gap-2 bg-white/90 text-sm font-medium text-[#1a2e1a]"
          >
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            {progressText || "Subiendo fotografía…"}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        aria-label="Seleccionar fotografías del evento"
        accept={GALLERY_PHOTO_TYPES.join(",")}
        multiple={allowMultiple}
        disabled={busy}
        className="hidden"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1a2e1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2d5a27] disabled:opacity-60"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {allowMultiple ? "Subir fotografías" : value ? "Cambiar fotografía" : "Subir fotografía"}
        </button>
        {!allowMultiple && value && onUploaded && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onUploaded("")}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-[#5a6b5a] hover:bg-[#e5e0d8] disabled:opacity-60"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Quitar
          </button>
        )}
        <span className="text-xs text-[#5a6b5a]">Solo fotografías JPG, PNG, WEBP o AVIF · Máximo 4 MB c/u</span>
      </div>
    </div>
  );
}
