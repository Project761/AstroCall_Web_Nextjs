"use client";

import { useEffect } from "react";
import socketService from "@/app/services/socketService";
import {
  USER_SESSION_EVENT,
  getStoredUserId,
  getStoredAstroId,
  hasUserAuthSession,
  hasAstroAuthSession,
} from "@/app/lib/wsUrl";

/**
 * Single owner for WebSocket connections.
 * - Does NOT disconnect on unmount (singleton service survives route changes).
 * - Does NOT poll every N seconds (was causing background reconnect loops).
 * - Reconnect on login/session change and when tab becomes visible (socketService).
 */
export default function SocketBootstrap() {
  useEffect(() => {
    const sync = (source = "SocketBootstrap") => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        console.log(`[WS] sync skipped (tab hidden) source=${source}`);
        return;
      }

      const userId = getStoredUserId();
      const astroId = getStoredAstroId();

      if (hasUserAuthSession() && userId) {
        socketService.ensureUserConnected(userId, source);
      }

      if (hasAstroAuthSession() && astroId) {
        socketService.ensureAstroConnected(astroId, source);
      }
    };

    sync("initial-mount");

    const onSession = () => sync("USER_SESSION_EVENT");
    window.addEventListener(USER_SESSION_EVENT, onSession);
    window.addEventListener("storage", onSession);

    return () => {
      window.removeEventListener(USER_SESSION_EVENT, onSession);
      window.removeEventListener("storage", onSession);
      // Intentionally do NOT disconnect — socket is app-wide singleton
    };
  }, []);

  return null;
}
