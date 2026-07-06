const PRODUCTION_WS_URL = "wss://websocket.astrocall.live/api/Chat";
const DEV_WS_URL = "ws://astrocallapi.com/api/Chat";

export { PRODUCTION_WS_URL, DEV_WS_URL };

export function resolveWsUrl() {
  return getWsUrlCandidates()[0];
}

/** Ordered list — mobile tries each until one connects */
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

  // HTTPS / production domain — secure websocket only (Android blocks ws:// on https)
  if (protocol === "https:" || isProdHost) {
    return [PRODUCTION_WS_URL];
  }

  // HTTP dev (localhost, LAN IP on phone) — insecure ws works
  return [DEV_WS_URL, PRODUCTION_WS_URL];
}

export function getStoredUserId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("UserLoginId") || "";
}

export function hasUserAuthSession() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("LoginTokenData") && getStoredUserId());
}

export const USER_SESSION_EVENT = "astrocall:user-session";

export function notifyUserSessionChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(USER_SESSION_EVENT));
}
