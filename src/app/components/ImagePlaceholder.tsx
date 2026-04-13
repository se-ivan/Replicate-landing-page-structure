import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
  src?: string;
  alt?: string;
}

export function ImagePlaceholder({ label, className = "", src, alt }: ImagePlaceholderProps) {
  if (src) {
    return <img src={src} alt={alt || label || ""} className={`object-cover ${className}`} />;
  }

  return (
    <div className={`bg-[#2a3a2a] flex flex-col items-center justify-center gap-2 ${className}`}>
      <ImageIcon className="w-10 h-10 text-white/40" />
      {label && <span className="text-white/50 text-sm text-center px-2">{label}</span>}
    </div>
  );
}
