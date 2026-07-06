/** Normalize API/CDN image paths to absolute HTTPS URLs for next/image. */
export function toCdnUrl(path) {
  if (!path) return "";
  const value = String(path).trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value.replace(/\\/g, "/")}`;
}

export function toCdnSrcOrFallback(path, fallback = "/images/profile pic.webp") {
  return path ? toCdnUrl(path) : fallback;
}
