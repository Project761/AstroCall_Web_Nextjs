const PRODUCTION_WS_URL = "wss://websocket.astrocall.live/api/Chat";
const DEV_WS_URL = "ws://astrocallapi.com/api/Chat";

export { PRODUCTION_WS_URL, DEV_WS_URL };

export function getWsUrlCandidates() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_WS_URL) {
    return [process.env.NEXT_PUBLIC_WS_URL];
  }

  if (typeof window === "undefined") return [PRODUCTION_WS_URL];

  const { protocol, hostname } = window.location;
  const isProdHost =
    hostname === "astrocall.live" ||
    hostname === "www.astrocall.live" ||
    hostname.endsWith(".astrocall.live");

  if (protocol === "https:" || isProdHost) {
    return [PRODUCTION_WS_URL];
  }

  // Legacy React app used only dev URL on localhost — no immediate prod fallback
  return [DEV_WS_URL];
}

export function resolveWsUrl() {
  return getWsUrlCandidates()[0];
}

export function getStoredUserId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("UserLoginId") || "";
}

export function getStoredAstroId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("AstroLoginId") || "";
}

export function hasUserAuthSession() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("LoginTokenData") && getStoredUserId());
}

export function hasAstroAuthSession() {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("LoginTokenData");
  const astroId = getStoredAstroId();
  if (!token || !astroId) return false;
  try {
    const data = JSON.parse(token);
    // User accounts use Astro === "0"; astrologer accounts have a real Astro id
    const isUserAccount = data?.Astro === "0" || data?.Astro === 0;
    return !isUserAccount && Boolean(astroId);
  } catch {
    return Boolean(astroId);
  }
}

export const USER_SESSION_EVENT = "astrocall:user-session";

export function notifyUserSessionChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(USER_SESSION_EVENT));
}
