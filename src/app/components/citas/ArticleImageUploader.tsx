import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

const ARTICLE_IMAGE_ASPECT = 2 / 1;
const OUTPUT_WIDTH = 1600;
const OUTPUT_HEIGHT = 800;

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}

async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo preparar la imagen.");
  }

  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo recortar la imagen."));
    }, "image/webp", 0.92);
  });
}

interface ArticleImageUploaderProps {
  articleId: string;
  value: string;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
  onMessage: (message: string) => void;
}

export function ArticleImageUploader({ articleId, value, onUploaded, onError, onMessage }: ArticleImageUploaderProps) {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const selectFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onError("Selecciona una imagen valida.");
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const closeCropper = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceUrl(null);
    setCroppedAreaPixels(null);
  };

  const uploadCroppedImage = async () => {
    if (!sourceUrl || !croppedAreaPixels) return;

    setUploading(true);
    onError("");
    onMessage("");

    try {
      const blob = await getCroppedBlob(sourceUrl, croppedAreaPixels);
      const formData = new FormData();
      formData.append("image", blob, "article-image.webp");
      formData.append("articleId", articleId || "nuevo-articulo");

      const response = await fetch("/api/uploads/article-image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "No se pudo subir la imagen.");
        return;
      }

      onUploaded(result.url);
      onMessage("Imagen subida y aplicada al articulo.");
      closeCropper();
    } catch {
      onError("No se pudo procesar la imagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e5e0d8] bg-[#fafaf8] p-4">
      <div className="aspect-[2/1] overflow-hidden rounded-xl border border-[#e5e0d8] bg-white">
        {value ? (
          <img src={value} alt="Imagen del articulo" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#5a6b5a] font-['Inter']">
            Sin imagen
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer rounded-xl bg-[#1a2e1a] px-4 py-2 text-sm text-white font-['Inter'] hover:bg-[#2d5a27]">
          Elegir imagen
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
        </label>
        <span className="text-xs text-[#5a6b5a] font-['Inter']">Recorte fijo 2:1, salida 1600 x 800</span>
      </div>

      {sourceUrl && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e0d8] px-5 py-4">
              <div>
                <p className="font-semibold text-[#1a2e1a] font-['Inter']">Ajustar imagen del articulo</p>
                <p className="text-xs text-[#5a6b5a] font-['Inter']">Mueve y acerca la imagen para encuadrarla en 2:1.</p>
              </div>
              <button type="button" onClick={closeCropper} className="rounded-xl px-3 py-2 text-sm text-[#5a6b5a] hover:bg-[#f5f2ec]">
                Cerrar
              </button>
            </div>

            <div className="relative h-[58vh] min-h-[360px] bg-[#111]">
              <Cropper
                image={sourceUrl}
                crop={crop}
                zoom={zoom}
                aspect={ARTICLE_IMAGE_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={false}
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-[#e5e0d8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex flex-1 items-center gap-3 text-sm text-[#5a6b5a] font-['Inter']">
                Zoom
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="w-full"
                />
              </label>
              <button
                type="button"
                onClick={uploadCroppedImage}
                disabled={uploading}
                className="rounded-xl bg-[#1a2e1a] px-5 py-3 text-sm font-semibold text-white font-['Inter'] hover:bg-[#2d5a27] disabled:opacity-60"
              >
                {uploading ? "Subiendo..." : "Usar esta imagen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
