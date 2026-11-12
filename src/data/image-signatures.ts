export function matchesImageSignature(bytes: Uint8Array, type: string): boolean {
  const startsWith = (signature: number[]) =>
    bytes.length >= signature.length && signature.every((byte, index) => bytes[index] === byte);
  const textAt = (start: number, end: number) =>
    bytes.length >= end ? String.fromCharCode(...bytes.slice(start, end)) : "";

  if (type === "image/jpeg") return startsWith([0xff, 0xd8, 0xff]);
  if (type === "image/png") return startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "image/gif") return ["GIF87a", "GIF89a"].includes(textAt(0, 6));
  if (type === "image/webp") return textAt(0, 4) === "RIFF" && textAt(8, 12) === "WEBP";
  if (type === "image/avif") {
    if (textAt(4, 8) !== "ftyp") return false;
    const boxSize = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0);
    if (boxSize < 16 || boxSize > bytes.length) return false;
    if (["avif", "avis"].includes(textAt(8, 12))) return true;
    for (let offset = 16; offset + 4 <= boxSize; offset += 4) {
      if (["avif", "avis"].includes(textAt(offset, offset + 4))) return true;
    }
  }
  return false;
}
