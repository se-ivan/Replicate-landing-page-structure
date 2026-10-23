import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import { NEWS_IMAGE_TYPES, validateNewsImage } from "../../../data/news-images";

type Props = {
  value: string;
  disabled: boolean;
  onUploaded: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  onError: (message: string) => void;
};

export function NewsImageUploader({ value, disabled, onUploaded, onUploadingChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const preview = localPreview || value;
  const busy = disabled || uploading;

  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);

  const upload = async (file?: File) => {
    if (!file || busy) return;
    onError("");
    const error = validateNewsImage(file.type, file.size);
    if (error) { onError(error); return; }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    onUploadingChange(true);

    try {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("La imagen no se puede abrir. Selecciona otro archivo."));
        image.src = objectUrl;
      });
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/uploads/news-image", { method: "POST", body: formData });
      if (response.status === 413) throw new Error("La imagen no debe superar 4 MB.");
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "No se pudo subir la imagen.");
      onUploaded(result.url);
    } catch (error) {
      onError(error instanceof Error ? error.message : "No se pudo subir la imagen. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
      onUploadingChange(false);
      setLocalPreview(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e5e0d8] bg-[#fafaf8] p-4" aria-busy={uploading}>
      <div
        className={`relative flex h-64 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors sm:h-80 ${dragging ? "border-[#2d5a27] bg-[#edf1e8]" : "border-[#d7dcd1] bg-white"}`}
        onDragOver={(event) => { event.preventDefault(); if (!busy) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files[0]); }}
      >
        {preview && failedUrl !== preview ? (
          <img src={preview} alt="Vista previa del anuncio" onError={() => setFailedUrl(preview)} className="h-full w-full object-contain p-2" />
        ) : (
          <div className="px-5 text-center text-[#5a6b5a]">
            <ImagePlus className="mx-auto mb-3 h-9 w-9 text-[#8aaf7e]" aria-hidden="true" />
            <p className="text-sm">{preview ? "No se pudo mostrar la imagen. Revisa el enlace o sube otro archivo." : "Arrastra aquí tu imagen o cartel"}</p>
            <p className="mt-2 text-xs">Se mostrará completo, en su proporción original.</p>
          </div>
        )}
        {uploading && <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 bg-white/85 text-sm font-medium text-[#1a2e1a]"><LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />Subiendo imagen…</div>}
      </div>
      <input ref={inputRef} type="file" aria-label="Seleccionar imagen o cartel" accept={NEWS_IMAGE_TYPES.join(",")} disabled={busy} className="hidden" onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-[#1a2e1a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2d5a27] disabled:opacity-60"><Upload className="h-4 w-4" aria-hidden="true" />{value ? "Cambiar imagen" : "Subir imagen o cartel"}</button>
        {value && <button type="button" disabled={busy} onClick={() => onUploaded("")} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-[#5a6b5a] hover:bg-[#e5e0d8] disabled:opacity-60"><X className="h-4 w-4" aria-hidden="true" />Quitar</button>}
        <span className="text-xs text-[#5a6b5a]">JPG, PNG, WEBP, GIF o AVIF · Máximo 4 MB</span>
      </div>
    </div>
  );
}
