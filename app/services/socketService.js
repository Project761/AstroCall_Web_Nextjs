// app/services/socketService.js
// Single WebSocket owner — mirrors legacy React MenuContext HandleUser/HandleAstro logic.

import { getWsUrlCandidates } from "../lib/wsUrl";

// Legacy React MenuContext timings (HandleUser / HandleAstro)
const PING_INTERVAL_MS = 3000;
const PONG_CHECK_INTERVAL_MS = 2000;
const PONG_TIMEOUT_MS = 7000;
const RECONNECT_DELAY_MS = 2000;
const CONNECT_TIMEOUT_MS = 15000;
const MAX_PENDING = 20;
const MAX_RECONNECT_ATTEMPTS = 30;

const LOG = {
  user: (msg, extra) => console.log(`[WS:USER] ${msg}`, extra ?? ""),
  astro: (msg, extra) => console.log(`[WS:ASTRO] ${msg}`, extra ?? ""),
  warn: (msg, extra) => console.warn(`[WS] ${msg}`, extra ?? ""),
};

const isHidden = () =>
  typeof document !== "undefined" && document.visibilityState === "hidden";

const parseWsMessage = (raw) => {
  const text = String(raw ?? "");
  return JSON.parse(text.replace(/\\/g, "\\\\"));
};

class SocketService {
  constructor() {
    this.userSocket = null;
    this.astroSocket = null;

    this.userPingInterval = null;
    this.astroPingInterval = null;
    this.userPongChecker = null;
    this.astroPongChecker = null;
    this.userReconnectInterval = null;
    this.astroReconnectInterval = null;

    this.userReconnectAttempts = 0;
    this.astroReconnectAttempts = 0;

    this.userLastPong = Date.now();
    this.astroLastPong = Date.now();

    this.userListeners = new Set();
    this.astroListeners = new Set();
    this.onUserMessage = null;
    this.onAstroMessage = null;

    this._activeUserId = null;
    this._activeAstroId = null;

    this._userUrlIndex = 0;
    this._userUrlList = [];
    this._userConnectOpened = false;
    this._astroUrlIndex = 0;
    this._astroUrlList = [];
    this._astroConnectOpened = false;

    this._userConnectTimeout = null;
    this._astroConnectTimeout = null;
    this._userIntentionalClose = false;
    this._astroIntentionalClose = false;

    this._pendingUserMessages = [];
    this._pendingAstroMessages = [];

    this._visibilityUserId = null;
    this._visibilityAstroId = null;
    this._visibilityHandler = null;
    this._visibilityBound = false;

    // Legacy: userInitializedRef / hasInitializedConnection — connect once per session
    this._userSessionInitialized = false;
    this._astroSessionInitialized = false;
  }

  getWsUrlCandidates = () => getWsUrlCandidates();

  /* ─── ensure (idempotent — same guards as legacy HandleUser/HandleAstro) ─── */

  ensureUserConnected = (userId, source = "unknown") => {
    if (!userId || typeof window === "undefined") return false;
    const id = String(userId);
    const state = this.userSocket?.readyState;

    if (state === WebSocket.OPEN && this._activeUserId === id) {
      this.setupVisibilityHandler(id, undefined);
      return true;
    }

    if (state === WebSocket.CONNECTING && this._activeUserId === id) {
      LOG.user(`ensure skipped — CONNECTING source=${source}`);
      this.setupVisibilityHandler(id, undefined);
      return false;
    }

    if (this._userSessionInitialized && this._activeUserId === id && state === WebSocket.OPEN) {
      return true;
    }

    LOG.user(`ensure → connect source=${source}`, { userId: id });
    this.connectUser(id, source);
    this.setupVisibilityHandler(id, undefined);
    return false;
  };

  ensureAstroConnected = (astroId, source = "unknown") => {
    if (!astroId || typeof window === "undefined") return false;
    const id = String(astroId);
    const state = this.astroSocket?.readyState;

    if (state === WebSocket.OPEN && this._activeAstroId === id) {
      this.setupVisibilityHandler(undefined, id);
      return true;
    }

    if (state === WebSocket.CONNECTING && this._activeAstroId === id) {
      LOG.astro(`ensure skipped — CONNECTING source=${source}`);
      this.setupVisibilityHandler(undefined, id);
      return false;
    }

    LOG.astro(`ensure → connect source=${source}`, { astroId: id });
    this.connectAstro(id, source);
    this.setupVisibilityHandler(undefined, id);
    return false;
  };

  isUserConnected = () => this.userSocket?.readyState === WebSocket.OPEN;
  isAstroConnected = () => this.astroSocket?.readyState === WebSocket.OPEN;

  safeSend = (socket, data) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  };

  sendUser = (data) => {
    if (this.safeSend(this.userSocket, data)) return true;
    if (this._pendingUserMessages.length < MAX_PENDING) {
      this._pendingUserMessages.push(data);
    }
    if (this._activeUserId) {
      this.ensureUserConnected(this._activeUserId, "sendUser");
    }
    return false;
  };

  sendAstro = (data) => {
    if (this.safeSend(this.astroSocket, data)) return true;
    if (this._pendingAstroMessages.length < MAX_PENDING) {
      this._pendingAstroMessages.push(data);
    }
    if (this._activeAstroId) {
      this.ensureAstroConnected(this._activeAstroId, "sendAstro");
    }
    return false;
  };

  _flushPendingUser = () => {
    while (this._pendingUserMessages.length && this.isUserConnected()) {
      this.safeSend(this.userSocket, this._pendingUserMessages.shift());
    }
  };

  _flushPendingAstro = () => {
    while (this._pendingAstroMessages.length && this.isAstroConnected()) {
      this.safeSend(this.astroSocket, this._pendingAstroMessages.shift());
    }
  };

  notifyUserListeners = (data) => {
    this.userListeners.forEach((cb) => {
      try { cb(data); } catch (e) { console.error("User listener error:", e); }
    });
    this.onUserMessage?.(data);
  };

  notifyAstroListeners = (data) => {
    this.astroListeners.forEach((cb) => {
      try { cb(data); } catch (e) { console.error("Astro listener error:", e); }
    });
    this.onAstroMessage?.(data);
  };

  addUserListener = (cb) => {
    if (typeof cb !== "function") return () => {};
    this.userListeners.add(cb);
    return () => this.userListeners.delete(cb);
  };

  addAstroListener = (cb) => {
    if (typeof cb !== "function") return () => {};
    this.astroListeners.add(cb);
    return () => this.astroListeners.delete(cb);
  };

  setUserListener = (cb) => { this.onUserMessage = cb; };
  setAstroListener = (cb) => { this.onAstroMessage = cb; };

  /* ─── detach old socket without triggering reconnect (fixes code=1000 loop) ─── */

  _detachUserSocket = () => {
    this.clearUserIntervals();
    if (!this.userSocket) return;
    const old = this.userSocket;
    old.onopen = null;
    old.onmessage = null;
    old.onerror = null;
    old.onclose = null;
    if (old.readyState === WebSocket.OPEN || old.readyState === WebSocket.CONNECTING) {
      old.close();
    }
    if (this.userSocket === old) this.userSocket = null;
  };

  _detachAstroSocket = () => {
    this.clearAstroIntervals();
    if (!this.astroSocket) return;
    const old = this.astroSocket;
    old.onopen = null;
    old.onmessage = null;
    old.onerror = null;
    old.onclose = null;
    if (old.readyState === WebSocket.OPEN || old.readyState === WebSocket.CONNECTING) {
      old.close();
    }
    if (this.astroSocket === old) this.astroSocket = null;
  };

  connectUser = (userId, source = "connectUser") => {
    if (!userId || typeof window === "undefined") return;
    const id = String(userId);
    const state = this.userSocket?.readyState;

    if (this._activeUserId === id && state === WebSocket.OPEN) {
      LOG.user(`connect skipped — already OPEN source=${source}`);
      return;
    }

    if (this._activeUserId === id && state === WebSocket.CONNECTING) {
      LOG.user(`connect skipped — already CONNECTING source=${source}`);
      return;
    }

    this._clearUserConnectTimeout();
    if (this.userReconnectInterval) {
      clearInterval(this.userReconnectInterval);
      this.userReconnectInterval = null;
    }

    this._detachUserSocket();

    this._activeUserId = id;
    this._userUrlList = this.getWsUrlCandidates();
    this._userUrlIndex = 0;
    this._userConnectOpened = false;
    this._userSessionInitialized = true;
    this._openUserSocket(id);
  };

  _openUserSocket = (userId) => {
    if (this._userUrlIndex >= this._userUrlList.length) {
      LOG.warn("All USER websocket URLs failed");
      this._userUrlIndex = 0;
      if (!this.userReconnectInterval) this.reconnectUser(userId);
      return;
    }

    const wsUrl = this._userUrlList[this._userUrlIndex];
    LOG.user(`connecting ${wsUrl} (${this._userUrlIndex + 1}/${this._userUrlList.length})`);

    const socket = new WebSocket(wsUrl);
    this.userSocket = socket;

    this._userConnectTimeout = setTimeout(() => {
      if (socket.readyState === WebSocket.CONNECTING) {
        LOG.user("connect timeout → next URL");
        this._tryNextUserUrl(userId, socket);
      }
    }, CONNECT_TIMEOUT_MS);

    socket.onopen = () => {
      if (this.userSocket !== socket) return;
      this._clearUserConnectTimeout();
      this._userConnectOpened = true;
      this._userIntentionalClose = false;
      LOG.user("connected", wsUrl);
      this.userReconnectAttempts = 0;
      this.userLastPong = Date.now();

      this.safeSend(socket, {
        UserId: `WU${userId}`,
        OnlineType: "1",
        Status: "Online",
      });

      this.startUserPing(userId);
      this.startUserPongCheck(userId);
      this._flushPendingUser();

      if (this.userReconnectInterval) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
      }
    };

    socket.onmessage = (event) => {
      if (this.userSocket !== socket) return;
      try {
        const parsed = parseWsMessage(event.data);
        if (parsed?.Type === "pong") {
          this.userLastPong = Date.now();
          return;
        }
        if (parsed?.messageId) {
          this.safeSend(socket, { Type: "ACK", messageId: parsed.messageId });
        }
        this.notifyUserListeners(parsed);
      } catch (e) {
        console.error("❌ User parse error", e);
      }
    };

    socket.onclose = (event) => {
      if (this.userSocket !== socket) return;
      this._clearUserConnectTimeout();
      this.userSocket = null;

      if (this._userIntentionalClose) {
        this._userIntentionalClose = false;
        LOG.user("closed (intentional)");
        return;
      }

      if (!this._userConnectOpened && this._userUrlIndex + 1 < this._userUrlList.length) {
        this._tryNextUserUrl(userId, socket);
        return;
      }

      LOG.user(`disconnected code=${event?.code ?? "?"} reason=${event?.reason || "none"}`);
      this.clearUserIntervals();

      if (this._activeUserId !== String(userId)) return;

      if (isHidden()) {
        LOG.user("tab hidden → reconnect paused until visible");
        return;
      }

      if (!this.userReconnectInterval) {
        this.reconnectUser(userId);
      }
    };

    socket.onerror = () => {
      if (this.userSocket !== socket) return;
      LOG.warn("USER socket error", wsUrl);
    };
  };

  _tryNextUserUrl = (userId, staleSocket) => {
    this._clearUserConnectTimeout();
    if (staleSocket) {
      staleSocket.onclose = null;
      staleSocket.onerror = null;
      if (staleSocket.readyState !== WebSocket.CLOSED) staleSocket.close();
    }
    if (this.userSocket === staleSocket) this.userSocket = null;
    this._userUrlIndex += 1;
    this._openUserSocket(userId);
  };

  reconnectUser = (userId) => {
    if (this.userReconnectInterval) return;
    LOG.user("reconnect scheduler started (2s interval — legacy)");

    this.userReconnectInterval = setInterval(() => {
      if (isHidden()) return;

      if (this.userReconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
        LOG.warn("USER max reconnect attempts");
        return;
      }

      if (this.isUserConnected()) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
        this.userReconnectAttempts = 0;
        return;
      }

      if (this.userSocket?.readyState === WebSocket.CONNECTING) return;

      if (!localStorage.getItem("UserLoginId")) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
        return;
      }

      this.userReconnectAttempts += 1;
      LOG.user(`reconnect attempt ${this.userReconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      this._userUrlIndex = 0;
      this._userConnectOpened = false;
      this._openUserSocket(userId);
    }, RECONNECT_DELAY_MS);
  };

  startUserPing = (userId) => {
    if (this.userPingInterval) clearInterval(this.userPingInterval);
    this.userPingInterval = setInterval(() => {
      if (this.isUserConnected()) {
        this.safeSend(this.userSocket, { UserId: `WU${userId}`, Type: "ping" });
      }
    }, PING_INTERVAL_MS);
  };

  startUserPongCheck = (userId) => {
    this.userLastPong = Date.now();
    if (this.userPongChecker) clearInterval(this.userPongChecker);

    this.userPongChecker = setInterval(() => {
      if (!this.isUserConnected()) return;
      if (isHidden()) {
        this.userLastPong = Date.now();
        return;
      }
      const diff = Date.now() - this.userLastPong;
      if (diff > PONG_TIMEOUT_MS) {
        LOG.user(`no pong for ${PONG_TIMEOUT_MS / 1000}s → reconnect`);
        const s = this.userSocket;
        if (s) {
          s.onclose = null;
          s.close();
          if (this.userSocket === s) this.userSocket = null;
        }
        this.clearUserIntervals();
        if (!this.userReconnectInterval) this.reconnectUser(userId);
      }
    }, PONG_CHECK_INTERVAL_MS);
  };

  clearUserIntervals = () => {
    if (this.userPingInterval) clearInterval(this.userPingInterval);
    if (this.userPongChecker) clearInterval(this.userPongChecker);
    this.userPingInterval = null;
    this.userPongChecker = null;
  };

  /* ─── astro socket (same pattern) ─── */

  connectAstro = (astroId, source = "connectAstro") => {
    if (!astroId || typeof window === "undefined") return;
    const id = String(astroId);
    const state = this.astroSocket?.readyState;

    if (this._activeAstroId === id && state === WebSocket.OPEN) {
      LOG.astro(`connect skipped — already OPEN source=${source}`);
      return;
    }

    if (this._activeAstroId === id && state === WebSocket.CONNECTING) {
      LOG.astro(`connect skipped — already CONNECTING source=${source}`);
      return;
    }

    this._clearAstroConnectTimeout();
    if (this.astroReconnectInterval) {
      clearInterval(this.astroReconnectInterval);
      this.astroReconnectInterval = null;
    }

    this._detachAstroSocket();

    this._activeAstroId = id;
    this._astroUrlList = this.getWsUrlCandidates();
    this._astroUrlIndex = 0;
    this._astroConnectOpened = false;
    this._astroSessionInitialized = true;
    this._openAstroSocket(id);
  };

  _openAstroSocket = (astroId) => {
    if (this._astroUrlIndex >= this._astroUrlList.length) {
      LOG.warn("All ASTRO websocket URLs failed");
      this._astroUrlIndex = 0;
      if (!this.astroReconnectInterval) this.reconnectAstro(astroId);
      return;
    }

    const wsUrl = this._astroUrlList[this._astroUrlIndex];
    LOG.astro(`connecting ${wsUrl} (${this._astroUrlIndex + 1}/${this._astroUrlList.length})`);

    const socket = new WebSocket(wsUrl);
    this.astroSocket = socket;

    this._astroConnectTimeout = setTimeout(() => {
      if (socket.readyState === WebSocket.CONNECTING) {
        LOG.astro("connect timeout → next URL");
        this._tryNextAstroUrl(astroId, socket);
      }
    }, CONNECT_TIMEOUT_MS);

    socket.onopen = () => {
      if (this.astroSocket !== socket) return;
      this._clearAstroConnectTimeout();
      this._astroConnectOpened = true;
      this._astroIntentionalClose = false;
      LOG.astro("connected", wsUrl);
      this.astroReconnectAttempts = 0;
      this.astroLastPong = Date.now();

      this.safeSend(socket, {
        UserId: `WA${astroId}`,
        OnlineType: "0",
        Status: "Online",
      });

      this.startAstroPing(astroId);
      this.startAstroPongCheck(astroId);
      this._flushPendingAstro();

      if (this.astroReconnectInterval) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
      }
    };

    socket.onmessage = (event) => {
      if (this.astroSocket !== socket) return;
      try {
        const parsed = parseWsMessage(event.data);
        if (parsed?.Type === "pong") {
          this.astroLastPong = Date.now();
          return;
        }
        if (parsed?.messageId) {
          this.safeSend(socket, { Type: "ACK", messageId: parsed.messageId });
        }
        this.notifyAstroListeners(parsed);
      } catch (e) {
        console.error("❌ Astro parse error", e);
      }
    };

    socket.onclose = (event) => {
      if (this.astroSocket !== socket) return;
      this._clearAstroConnectTimeout();
      this.astroSocket = null;

      if (this._astroIntentionalClose) {
        this._astroIntentionalClose = false;
        LOG.astro("closed (intentional)");
        return;
      }

      if (!this._astroConnectOpened && this._astroUrlIndex + 1 < this._astroUrlList.length) {
        this._tryNextAstroUrl(astroId, socket);
        return;
      }

      LOG.astro(`disconnected code=${event?.code ?? "?"} reason=${event?.reason || "none"}`);
      this.clearAstroIntervals();

      if (this._activeAstroId !== String(astroId)) return;

      if (isHidden()) {
        LOG.astro("tab hidden → reconnect paused until visible");
        return;
      }

      if (!this.astroReconnectInterval) {
        this.reconnectAstro(astroId);
      }
    };

    socket.onerror = () => {
      if (this.astroSocket !== socket) return;
      LOG.warn("ASTRO socket error", wsUrl);
    };
  };

  _tryNextAstroUrl = (astroId, staleSocket) => {
    this._clearAstroConnectTimeout();
    if (staleSocket) {
      staleSocket.onclose = null;
      staleSocket.onerror = null;
      if (staleSocket.readyState !== WebSocket.CLOSED) staleSocket.close();
    }
    if (this.astroSocket === staleSocket) this.astroSocket = null;
    this._astroUrlIndex += 1;
    this._openAstroSocket(astroId);
  };

  reconnectAstro = (astroId) => {
    if (this.astroReconnectInterval) return;
    LOG.astro("reconnect scheduler started (2s interval — legacy)");

    this.astroReconnectInterval = setInterval(() => {
      if (isHidden()) return;

      if (this.astroReconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
        return;
      }

      if (this.isAstroConnected()) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
        this.astroReconnectAttempts = 0;
        return;
      }

      if (this.astroSocket?.readyState === WebSocket.CONNECTING) return;

      if (!localStorage.getItem("AstroLoginId")) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
        return;
      }

      this.astroReconnectAttempts += 1;
      LOG.astro(`reconnect attempt ${this.astroReconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      this._astroUrlIndex = 0;
      this._astroConnectOpened = false;
      this._openAstroSocket(astroId);
    }, RECONNECT_DELAY_MS);
  };

  startAstroPing = (astroId) => {
    if (this.astroPingInterval) clearInterval(this.astroPingInterval);
    this.astroPingInterval = setInterval(() => {
      if (this.isAstroConnected()) {
        this.safeSend(this.astroSocket, { UserId: `WA${astroId}`, Type: "ping" });
      }
    }, PING_INTERVAL_MS);
  };

  startAstroPongCheck = (astroId) => {
    this.astroLastPong = Date.now();
    if (this.astroPongChecker) clearInterval(this.astroPongChecker);

    this.astroPongChecker = setInterval(() => {
      if (!this.isAstroConnected()) return;
      if (isHidden()) {
        this.astroLastPong = Date.now();
        return;
      }
      const diff = Date.now() - this.astroLastPong;
      if (diff > PONG_TIMEOUT_MS) {
        LOG.astro(`no pong for ${PONG_TIMEOUT_MS / 1000}s → reconnect`);
        const s = this.astroSocket;
        if (s) {
          s.onclose = null;
          s.close();
          if (this.astroSocket === s) this.astroSocket = null;
        }
        this.clearAstroIntervals();
        if (!this.astroReconnectInterval) this.reconnectAstro(astroId);
      }
    }, PONG_CHECK_INTERVAL_MS);
  };

  clearAstroIntervals = () => {
    if (this.astroPingInterval) clearInterval(this.astroPingInterval);
    if (this.astroPongChecker) clearInterval(this.astroPongChecker);
    this.astroPingInterval = null;
    this.astroPongChecker = null;
  };

  /* ─── visibility: legacy behavior — refresh ping only if OPEN, reconnect if CLOSED ─── */

  setupVisibilityHandler = (userId, astroId) => {
    if (userId != null && userId !== "") this._visibilityUserId = String(userId);
    if (astroId != null && astroId !== "") this._visibilityAstroId = String(astroId);
    if (!this._visibilityBound) this._bindVisibilityHandlers();
  };

  _onTabVisible = () => {
    if (this._visibilityUserId) {
      if (this.isUserConnected()) {
        LOG.user("tab visible — already connected, refreshing ping");
        this.safeSend(this.userSocket, {
          UserId: `WU${this._visibilityUserId}`,
          Type: "ping",
        });
        this.userLastPong = Date.now();
      } else if (
        !this.userSocket ||
        this.userSocket.readyState === WebSocket.CLOSED
      ) {
        if (this.userReconnectInterval) {
          clearInterval(this.userReconnectInterval);
          this.userReconnectInterval = null;
        }
        this.userReconnectAttempts = 0;
        LOG.user("tab visible — socket closed, reconnecting");
        this.ensureUserConnected(this._visibilityUserId, "visibility-visible");
      }
    }

    if (this._visibilityAstroId) {
      if (this.isAstroConnected()) {
        LOG.astro("tab visible — already connected, refreshing ping");
        this.safeSend(this.astroSocket, {
          UserId: `WA${this._visibilityAstroId}`,
          Type: "ping",
        });
        this.astroLastPong = Date.now();
      } else if (
        !this.astroSocket ||
        this.astroSocket.readyState === WebSocket.CLOSED
      ) {
        if (this.astroReconnectInterval) {
          clearInterval(this.astroReconnectInterval);
          this.astroReconnectInterval = null;
        }
        this.astroReconnectAttempts = 0;
        LOG.astro("tab visible — socket closed, reconnecting");
        this.ensureAstroConnected(this._visibilityAstroId, "visibility-visible");
      }
    }
  };

  _bindVisibilityHandlers = () => {
    if (this._visibilityBound) return;
    this._visibilityBound = true;

    this._visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        this._onTabVisible();
      }
    };

    document.addEventListener("visibilitychange", this._visibilityHandler);
  };

  removeVisibilityHandler = () => {
    if (this._visibilityHandler) {
      document.removeEventListener("visibilitychange", this._visibilityHandler);
    }
    this._visibilityHandler = null;
    this._visibilityBound = false;
    this._visibilityUserId = null;
    this._visibilityAstroId = null;
  };

  _clearUserConnectTimeout = () => {
    if (this._userConnectTimeout) {
      clearTimeout(this._userConnectTimeout);
      this._userConnectTimeout = null;
    }
  };

  _clearAstroConnectTimeout = () => {
    if (this._astroConnectTimeout) {
      clearTimeout(this._astroConnectTimeout);
      this._astroConnectTimeout = null;
    }
  };

  disconnectUser = (clearActiveId = true) => {
    LOG.user("disconnectUser", { clearActiveId });
    this._clearUserConnectTimeout();
    if (this.userReconnectInterval) {
      clearInterval(this.userReconnectInterval);
      this.userReconnectInterval = null;
    }
    this._userIntentionalClose = true;
    this._detachUserSocket();
    this.userReconnectAttempts = 0;
    this._userSessionInitialized = false;
    this._pendingUserMessages = [];
    if (clearActiveId) this._activeUserId = null;
  };

  disconnectAstro = (clearActiveId = true) => {
    LOG.astro("disconnectAstro", { clearActiveId });
    this._clearAstroConnectTimeout();
    if (this.astroReconnectInterval) {
      clearInterval(this.astroReconnectInterval);
      this.astroReconnectInterval = null;
    }
    this._astroIntentionalClose = true;
    this._detachAstroSocket();
    this.astroReconnectAttempts = 0;
    this._astroSessionInitialized = false;
    this._pendingAstroMessages = [];
    if (clearActiveId) this._activeAstroId = null;
  };

  disconnectAll = () => {
    LOG.user("disconnectAll");
    this.removeVisibilityHandler();
    this.disconnectUser();
    this.disconnectAstro();
  };
}

const socketService = new SocketService();
export default socketService;
