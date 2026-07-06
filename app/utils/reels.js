/** Shared helpers for reels list + watch pages */

export function toReelMediaUrl(input) {
  if (input == null || input === "") return "";
  const cleaned = String(input).trim().replace(/\\/g, "/");
  const isProd =
    typeof window !== "undefined" && window.location.origin === "https://astrocall.live";
  const protocol = isProd ? "https://" : "http://";

  if (/^https?:\/\//i.test(cleaned)) {
    if (!isProd && cleaned.includes("liveapi.astrocall.live")) {
      return cleaned.replace(/^https:\/\//i, "http://");
    }
    return cleaned;
  }
  return `${protocol}${cleaned.replace(/^\/+/, "")}`;
}

export function isReelImageUrl(url) {
  return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url || "");
}

export function formatReelCount(n) {
  if (n === null || n === undefined || n === "") return "0";
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(Math.floor(num));
}

/** Coerce API values (number/object) to display string */
export function toDisplayText(value, fallback = "") {
  if (value == null || value === "") return fallback;
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "object") {
    const nested =
      value?.DisplayName ||
      value?.Name ||
      value?.name ||
      value?.Title;
    if (nested != null) return toDisplayText(nested, fallback);
  }
  return fallback;
}


export function reelInitial(name) {
  const s = toDisplayText(name, "A");
  const ch = s.charAt(0);
  return ch ? ch.toUpperCase() : "A";
}

export function reelTitle(reel) {
  return toDisplayText(reel?.Title, "Astrology Reel");
}

export function reelIsLive(reel) {
  return reel?.IsLive === "1" || reel?.IsLive === 1 || reel?.IsLive === true;
}

/** Thumbnail missing or same as video — no separate image poster */
export function hasReelImageThumbnail(reel) {
  const video = toReelMediaUrl(reel?.VideoUrl);
  const thumb = toReelMediaUrl(reel?.ThumbnailUrl);
  if (!thumb) return false;
  if (!isReelImageUrl(thumb)) return false;
  if (video && thumb === video) return false;
  return true;
}

export function reelPosterAndVideo(reel) {
  const video = toReelMediaUrl(reel?.VideoUrl);
  const thumb = toReelMediaUrl(reel?.ThumbnailUrl);
  const poster = hasReelImageThumbnail(reel) ? thumb : "";
  const playable = video || thumb;
  return { video, thumb, poster, playable };
}

/** Normalize API media URLs for next/image (supports http/https remotePatterns) */
export function isAstrocallRemoteMedia(url) {
  return /^https?:\/\/(liveapi|api)\.astrocall\.live/i.test(String(url || ""));
}
