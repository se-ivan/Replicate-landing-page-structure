// Only allow site-relative paths and http(s) URLs.
export function safeSiteOrHttpUrl(value?: string | null): string | null {
  const url = value?.trim();
  if (!url) return null;
  if (/^\/(?!\/)/.test(url) && !/[\\\s]/.test(url)) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}
