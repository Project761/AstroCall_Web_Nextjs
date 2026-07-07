// app/services/socketService.js

import { getWsUrlCandidates } from "../lib/wsUrl";
const CONNECT_TIMEOUT_MS = 15000;
const PONG_TIMEOUT_MS = 20000;
class SocketService {
  constructor() {
    this.userSocket = null;
    this.astroSocket = null;

    this.userPingInterval = null;
    this.astroPingInterval = null;

    this.userReconnectInterval = null;
    this.astroReconnectInterval = null;

    this.userReconnectAttempts = 0;
    this.astroReconnectAttempts = 0;
    this.maxReconnectAttempts = 30; 

    this.userLastPong = Date.now();
    this.astroLastPong = Date.now();

    this.userPongChecker = null;
    this.astroPongChecker = null;

    this.userListeners = new Set();
    this.astroListeners = new Set();

    this.onUserMessage = null;
    this.onAstroMessage = null;

    this._activeUserId = null;
    this._activeAstroId = null;

    this._visibilityHandler = null;
    this._pageshowHandler = null;
    this._onlineHandler = null;
    this._focusHandler = null;
    this._userConnectTimeout = null;
    this._astroConnectTimeout = null;
    this._userUrlIndex = 0;
    this._userUrlList = [];
    this._userConnectOpened = false;
    this._visibilityUserId = null;
    this._visibilityAstroId = null;
  }

  getWsUrl = () => getWsUrlCandidates()[0];

  getWsUrlCandidates = () => getWsUrlCandidates();

  safeSend = (socket, data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
      return true;
    }
    console.warn("⚠️ Socket not connected");
    return false;
  };

  notifyUserListeners = (data) => {
    this.userListeners.forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error("User listener error:", e);
      }
    });
    this.onUserMessage?.(data);
  };

  notifyAstroListeners = (data) => {
    this.astroListeners.forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error("Astro listener error:", e);
      }
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

  setUserListener = (cb) => {
    this.onUserMessage = cb;
  };

  setAstroListener = (cb) => {
    this.onAstroMessage = cb;
  };

  _closeUserSocket = () => {
    this.clearUserIntervals();

    if (this.userSocket) {
      this.userSocket.onclose = null;
      this.userSocket.close();
      this.userSocket = null;
    }
  };

  _closeAstroSocket = () => {
    this.clearAstroIntervals();

    if (this.astroSocket) {
      this.astroSocket.onclose = null;
      this.astroSocket.close();
      this.astroSocket = null;
    }
  };

  connectUser = (userId) => {
    if (!userId || typeof window === "undefined") return;

    const state = this.userSocket?.readyState;
    if (this._activeUserId === String(userId) && state === WebSocket.OPEN) {
      return;
    }

    this._clearUserConnectTimeout();
    this._closeUserSocket();

    this._activeUserId = String(userId);
    this._userUrlList = this.getWsUrlCandidates();
    this._userUrlIndex = 0;
    this._userConnectOpened = false;
    this._openUserSocket(userId);
  };

  _openUserSocket = (userId) => {
    if (this._userUrlIndex >= this._userUrlList.length) {
      console.error("❌ All USER websocket URLs failed, will retry...");
      this._userUrlIndex = 0;
      if (!this.userReconnectInterval) {
        this.reconnectUser(userId);
      }
      return;
    }

    const wsUrl = this._userUrlList[this._userUrlIndex];
    console.log(
      "🔌 Connecting USER websocket:",
      wsUrl,
      `(${this._userUrlIndex + 1}/${this._userUrlList.length})`
    );

    this.userSocket = new WebSocket(wsUrl);

    this._userConnectTimeout = setTimeout(() => {
      if (this.userSocket?.readyState === WebSocket.CONNECTING) {
        console.warn("⏱️ USER websocket connect timeout → trying next URL");
        this._tryNextUserUrl(userId);
      }
    }, CONNECT_TIMEOUT_MS);

    this.userSocket.onopen = () => {
      this._clearUserConnectTimeout();
      this._userConnectOpened = true;
      console.log("🟢 USER CONNECTED via", wsUrl);
      this.userReconnectAttempts = 0;
      this.userLastPong = Date.now();

      this.safeSend(this.userSocket, {
        UserId: `WU${userId}`,
        OnlineType: "1",
        Status: "Online",
      });

      this.startUserPing(userId);
      this.startUserPongCheck(userId);

      if (this.userReconnectInterval) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
      }
    };
    this.userSocket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.Type === "pong") {
          this.userLastPong = Date.now();
          return;
        }

        if (parsed?.messageId) {
          this.safeSend(this.userSocket, {
            Type: "ACK",
            messageId: parsed.messageId,
          });
        }

        this.notifyUserListeners(parsed);
      } catch (e) {
        console.error("❌ User parse error", e);
      }
    };

    this.userSocket.onclose = (event) => {
      this._clearUserConnectTimeout();
      console.log("🔴 USER DISCONNECTED", event?.code || "");

      if (!this._userConnectOpened && this._userUrlIndex + 1 < this._userUrlList.length) {
        this._tryNextUserUrl(userId);
        return;
      }

      this.clearUserIntervals();
      if (this._activeUserId === String(userId)) {
        this.reconnectUser(userId);
      }
    };

    this.userSocket.onerror = () => {
      console.warn("❌ USER SOCKET ERROR on", wsUrl);
    };
  };

  _tryNextUserUrl = (userId) => {
    this._clearUserConnectTimeout();
    if (this.userSocket) {
      this.userSocket.onclose = null;
      this.userSocket.onerror = null;
      this.userSocket.close();
      this.userSocket = null;
    }
    this._userUrlIndex += 1;
    this._openUserSocket(userId);
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
  startUserPing = (userId) => {
    if (this.userPingInterval) clearInterval(this.userPingInterval);

    this.userPingInterval = setInterval(() => {
      if (this.userSocket?.readyState === WebSocket.OPEN) {
        this.safeSend(this.userSocket, {
          UserId: `WU${userId}`,
          Type: "ping",
        });
      }
    }, 5000);
  };

  startUserPongCheck = () => {
    this.userLastPong = Date.now();
    if (this.userPongChecker) clearInterval(this.userPongChecker);

    this.userPongChecker = setInterval(() => {
      if (Date.now() - this.userLastPong > PONG_TIMEOUT_MS) {
        console.warn("❌ USER no pong → reconnect");
        this.userSocket?.close();
      }
    }, 5000);  };

  clearUserIntervals = () => {
    if (this.userPingInterval) clearInterval(this.userPingInterval);
    if (this.userPongChecker) clearInterval(this.userPongChecker);
    this.userPingInterval = null;
    this.userPongChecker = null;
  };

  reconnectUser = (userId) => {
    if (this.userReconnectInterval) return;

    this.userReconnectInterval = setInterval(() => {
      if (this.userReconnectAttempts >= this.maxReconnectAttempts) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
        console.warn("❌ USER reconnect max attempts reached");
        return;
      }

      this.userReconnectAttempts += 1;
      console.log("🔄 Reconnecting USER...");
      this.connectUser(userId);

      if (this.userSocket?.readyState === WebSocket.OPEN) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
        this.userReconnectAttempts = 0;
      }
    }, 2000);
  };

  sendUser = (data) => {
    this.safeSend(this.userSocket, data);
  };

  connectAstro = (astroId) => {
    if (!astroId || typeof window === "undefined") return;

    const state = this.astroSocket?.readyState;
    if (this._activeAstroId === String(astroId) && state === WebSocket.OPEN) {
      return;
    }

    if (state === WebSocket.CONNECTING) {
      this._closeAstroSocket();
    }

    this._clearAstroConnectTimeout();
    this._closeAstroSocket();

    this._activeAstroId = String(astroId);
    const wsUrl = this.getWsUrl();
    console.log("🔌 Connecting ASTRO websocket:", wsUrl);

    this.astroSocket = new WebSocket(wsUrl);

    this._astroConnectTimeout = setTimeout(() => {
      if (this.astroSocket?.readyState === WebSocket.CONNECTING) {
        console.warn("⏱️ ASTRO websocket connect timeout");
        this._closeAstroSocket();
        this.reconnectAstro(astroId);
      }
    }, CONNECT_TIMEOUT_MS);

    this.astroSocket.onopen = () => {
      this._clearAstroConnectTimeout();
      console.log("🟢 ASTRO CONNECTED");
      this.astroReconnectAttempts = 0;
      this.astroLastPong = Date.now();
      this.safeSend(this.astroSocket, {
        UserId: `WA${astroId}`,
        OnlineType: "0",
        Status: "Online",
      });

      this.startAstroPing(astroId);
      this.startAstroPongCheck(astroId);

      if (this.astroReconnectInterval) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
      }
    };

    this.astroSocket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.Type === "pong") {
          this.astroLastPong = Date.now();
          return;
        }

        if (parsed?.messageId) {
          this.safeSend(this.astroSocket, {
            Type: "ACK",
            messageId: parsed.messageId,
          });
        }

        this.notifyAstroListeners(parsed);
      } catch (e) {
        console.error("❌ Astro parse error", e);
      }
    };

    this.astroSocket.onclose = (event) => {
      this._clearAstroConnectTimeout();
      console.log("🔴 ASTRO DISCONNECTED", event?.code || "");
      this.clearAstroIntervals();
      if (this._activeAstroId === String(astroId)) {
        this.reconnectAstro(astroId);
      }
    };

    this.astroSocket.onerror = (event) => {
      console.warn("❌ ASTRO SOCKET ERROR", event?.type || "");
    };
  };
  startAstroPing = (astroId) => {
    if (this.astroPingInterval) clearInterval(this.astroPingInterval);

    this.astroPingInterval = setInterval(() => {
      if (this.astroSocket?.readyState === WebSocket.OPEN) {
        this.safeSend(this.astroSocket, {
          UserId: `WA${astroId}`,
          Type: "ping",
        });
      }
    }, 5000);
  };

  startAstroPongCheck = () => {
    this.astroLastPong = Date.now();
    if (this.astroPongChecker) clearInterval(this.astroPongChecker);

    this.astroPongChecker = setInterval(() => {
      if (Date.now() - this.astroLastPong > PONG_TIMEOUT_MS) {
        console.warn("❌ ASTRO no pong → reconnect");
        this.astroSocket?.close();
      }
    }, 5000);  };

  clearAstroIntervals = () => {
    if (this.astroPingInterval) clearInterval(this.astroPingInterval);
    if (this.astroPongChecker) clearInterval(this.astroPongChecker);
    this.astroPingInterval = null;
    this.astroPongChecker = null;
  };

  reconnectAstro = (astroId) => {
    if (this.astroReconnectInterval) return;

    this.astroReconnectInterval = setInterval(() => {
      if (this.astroReconnectAttempts >= this.maxReconnectAttempts) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
        console.warn("❌ ASTRO reconnect max attempts reached");
        return;
      }

      this.astroReconnectAttempts += 1;
      console.log("🔄 Reconnecting ASTRO...");
      this.connectAstro(astroId);

      if (this.astroSocket?.readyState === WebSocket.OPEN) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
        this.astroReconnectAttempts = 0;
      }
    }, 2000);
  };

  sendAstro = (data) => {
    this.safeSend(this.astroSocket, data);
  };

  setupVisibilityHandler = (userId, astroId) => {
    this.removeVisibilityHandler();

    this._visibilityUserId = userId ? String(userId) : null;
    this._visibilityAstroId = astroId ? String(astroId) : null;

    const reconnectIfNeeded = () => {
      if (
        this._visibilityUserId &&
        (!this.userSocket || this.userSocket.readyState !== WebSocket.OPEN)
      ) {
        console.log("🔄 Reconnecting USER socket");
        this.connectUser(this._visibilityUserId);
      }

      if (
        this._visibilityAstroId &&
        (!this.astroSocket || this.astroSocket.readyState !== WebSocket.OPEN)
      ) {
        console.log("🔄 Reconnecting ASTRO socket");
        this.connectAstro(this._visibilityAstroId);
      }
    };

    this._visibilityHandler = () => {
      if (document.visibilityState === "visible") reconnectIfNeeded();
    };

    this._pageshowHandler = () => reconnectIfNeeded();

    this._onlineHandler = () => reconnectIfNeeded();

    this._focusHandler = () => reconnectIfNeeded();

    document.addEventListener("visibilitychange", this._visibilityHandler);
    window.addEventListener("pageshow", this._pageshowHandler);
    window.addEventListener("online", this._onlineHandler);
    window.addEventListener("focus", this._focusHandler);
  };

  removeVisibilityHandler = () => {
    if (this._visibilityHandler) {
      document.removeEventListener("visibilitychange", this._visibilityHandler);
      this._visibilityHandler = null;
    }
    if (this._pageshowHandler) {
      window.removeEventListener("pageshow", this._pageshowHandler);
      this._pageshowHandler = null;
    }
    if (this._onlineHandler) {
      window.removeEventListener("online", this._onlineHandler);
      this._onlineHandler = null;
    }
    if (this._focusHandler) {
      window.removeEventListener("focus", this._focusHandler);
      this._focusHandler = null;
    }    this._visibilityUserId = null;
    this._visibilityAstroId = null;
  };

  disconnectUser = (clearActiveId = true) => {
    this._clearUserConnectTimeout();
    this._closeUserSocket();
    if (this.userReconnectInterval) {
      clearInterval(this.userReconnectInterval);
      this.userReconnectInterval = null;
    }

    this.userReconnectAttempts = 0;
    if (clearActiveId) this._activeUserId = null;
  };

  disconnectAstro = (clearActiveId = true) => {
    this._clearAstroConnectTimeout();
    this._closeAstroSocket();
    if (this.astroReconnectInterval) {
      clearInterval(this.astroReconnectInterval);
      this.astroReconnectInterval = null;
    }

    this.astroReconnectAttempts = 0;
    if (clearActiveId) this._activeAstroId = null;
  };

  disconnectAll = () => {
    this.removeVisibilityHandler();
    this.disconnectUser();
    this.disconnectAstro();
  };
}

const socketService = new SocketService();
export default socketService;
