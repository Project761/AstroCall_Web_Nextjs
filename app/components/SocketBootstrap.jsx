"use client";

import { useEffect } from "react";
import socketService from "@/app/services/socketService";
import {
  USER_SESSION_EVENT,
  getStoredUserId,
  hasUserAuthSession,
  notifyUserSessionChange,
} from "@/app/lib/wsUrl";

function ensureConnected() {
  const userId = getStoredUserId();
  if (!userId || !hasUserAuthSession()) return false;

  const state = socketService.userSocket?.readyState;
  if (state === WebSocket.OPEN) return true;

  socketService.connectUser(userId);
  socketService.setupVisibilityHandler(userId, null);
  return true;
}

/** Android-safe socket init — localStorage based, not React state */
export default function SocketBootstrap() {
  useEffect(() => {
    ensureConnected();

    const onSession = () => ensureConnected();
    const onVisible = () => {
      if (document.visibilityState === "visible") ensureConnected();
    };

    window.addEventListener(USER_SESSION_EVENT, onSession);
    window.addEventListener("storage", onSession);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onSession);
    window.addEventListener("focus", onSession);

    // Android fallback — poll until connected after login
    const poll = setInterval(() => {
      if (!hasUserAuthSession()) return;
      const state = socketService.userSocket?.readyState;
      if (state !== WebSocket.OPEN && state !== WebSocket.CONNECTING) {
        ensureConnected();
      }
    }, 2500);

    return () => {
      window.removeEventListener(USER_SESSION_EVENT, onSession);
      window.removeEventListener("storage", onSession);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onSession);
      window.removeEventListener("focus", onSession);
      clearInterval(poll);
    };
  }, []);

  return null;
}

export { ensureConnected, notifyUserSessionChange };
