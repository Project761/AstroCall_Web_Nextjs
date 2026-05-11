// app/services/socketService.js

class SocketService {
  constructor() {
    this.WS_URL =
      typeof window !== "undefined" &&
        window.location.origin === "https://astrocall.live"
        ? "wss://websocket.astrocall.live/api/Chat"
        : "ws://astrocallapi.com/api/Chat";

    this.userSocket = null;
    this.astroSocket = null;

    this.userPingInterval = null;
    this.astroPingInterval = null;

    this.userReconnectInterval = null;
    this.astroReconnectInterval = null;

    this.userLastPong = Date.now();
    this.astroLastPong = Date.now();

    this.userPongChecker = null;
    this.astroPongChecker = null;

    this.onUserMessage = null;
    this.onAstroMessage = null;
  }

  // =========================
  // ✅ SAFE SEND (FIXED)
  // =========================
  safeSend = (socket, data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("⚠️ Socket not connected");
    }
  };

  // =========================
  // ✅ USER SOCKET
  // =========================
  connectUser = (userId) => {
    if (!userId || typeof window === "undefined") return;

    if (
      this.userSocket &&
      (this.userSocket.readyState === WebSocket.OPEN ||
        this.userSocket.readyState === WebSocket.CONNECTING)
    ) {
      // console.log("⏳ User WS already active");
      return;
    }

    this.userSocket = new WebSocket(this.WS_URL);

    this.userSocket.onopen = () => {
      console.log("🟢 USER CONNECTED");

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
          }, console.log({
            Type: "ACK",
            messageId: parsed.messageId,
          }, 'test'));
        }

        this.onUserMessage?.(parsed);
      } catch (e) {
        console.error("❌ User parse error", e);
      }
    };

    this.userSocket.onclose = () => {
      console.log("🔴 USER DISCONNECTED");
      this.clearUserIntervals();
      this.reconnectUser(userId);
    };

    this.userSocket.onerror = () => {
      console.log("❌ USER SOCKET ERROR");
    };
  };

  startUserPing = (userId) => {
    this.clearUserIntervals();

    this.userPingInterval = setInterval(() => {
      this.safeSend(this.userSocket, {
        UserId: `WU${userId}`,
        Type: "ping",
      });
    }, 3000);
  };

  startUserPongCheck = (userId) => {
    this.userLastPong = Date.now();

    this.userPongChecker = setInterval(() => {
      if (Date.now() - this.userLastPong > 7000) {
        console.warn("❌ USER no pong → reconnect");
        this.userSocket?.close();
      }
    }, 2000);
  };

  clearUserIntervals = () => {
    if (this.userPingInterval) clearInterval(this.userPingInterval);
    if (this.userPongChecker) clearInterval(this.userPongChecker);

    this.userPingInterval = null;
    this.userPongChecker = null;
  };

  reconnectUser = (userId) => {
    if (this.userReconnectInterval) return;

    this.userReconnectInterval = setInterval(() => {
      console.log("🔄 Reconnecting USER...");
      this.connectUser(userId);

      if (this.userSocket?.readyState === WebSocket.OPEN) {
        clearInterval(this.userReconnectInterval);
        this.userReconnectInterval = null;
      }
    }, 2000);
  };

  sendUser = (data) => {
    this.safeSend(this.userSocket, data);
  };

  // =========================
  // ✅ ASTRO SOCKET
  // =========================
  connectAstro = (astroId) => {
    if (!astroId || typeof window === "undefined") return;

    if (
      this.astroSocket &&
      (this.astroSocket.readyState === WebSocket.OPEN ||
        this.astroSocket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("⏳ Astro WS already active");
      return;
    }

    this.astroSocket = new WebSocket(this.WS_URL);

    this.astroSocket.onopen = () => {
      console.log("🟢 ASTRO CONNECTED");

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

        this.onAstroMessage?.(parsed);
      } catch (e) {
        console.error("❌ Astro parse error", e);
      }
    };

    this.astroSocket.onclose = () => {
      console.log("🔴 ASTRO DISCONNECTED");
      this.clearAstroIntervals();
      this.reconnectAstro(astroId);
    };

    this.astroSocket.onerror = () => {
      console.log("❌ ASTRO SOCKET ERROR");
    };
  };

  startAstroPing = (astroId) => {
    this.clearAstroIntervals();

    this.astroPingInterval = setInterval(() => {
      this.safeSend(this.astroSocket, {
        UserId: `WA${astroId}`,
        Type: "ping",
      });
    }, 3000);
  };

  startAstroPongCheck = (astroId) => {
    this.astroLastPong = Date.now();

    this.astroPongChecker = setInterval(() => {
      if (Date.now() - this.astroLastPong > 7000) {
        console.warn("❌ ASTRO no pong → reconnect");
        this.astroSocket?.close();
      }
    }, 2000);
  };

  clearAstroIntervals = () => {
    if (this.astroPingInterval) clearInterval(this.astroPingInterval);
    if (this.astroPongChecker) clearInterval(this.astroPongChecker);

    this.astroPingInterval = null;
    this.astroPongChecker = null;
  };

  reconnectAstro = (astroId) => {
    if (this.astroReconnectInterval) return;

    this.astroReconnectInterval = setInterval(() => {
      console.log("🔄 Reconnecting ASTRO...");
      this.connectAstro(astroId);

      if (this.astroSocket?.readyState === WebSocket.OPEN) {
        clearInterval(this.astroReconnectInterval);
        this.astroReconnectInterval = null;
      }
    }, 2000);
  };

  sendAstro = (data) => {
    this.safeSend(this.astroSocket, data);
  };

  // =========================
  // ✅ LISTENERS
  // =========================
  setUserListener = (cb) => {
    this.onUserMessage = cb;
  };

  setAstroListener = (cb) => {
    this.onAstroMessage = cb;
  };

  // =========================
  // ✅ DISCONNECT
  // =========================
  disconnectAll = () => {
    this.clearUserIntervals();
    this.clearAstroIntervals();

    this.userSocket?.close();
    this.astroSocket?.close();

    this.userSocket = null;
    this.astroSocket = null;

    // console.log("🔌 All sockets disconnected");
  };
}

const socketService = new SocketService();
export default socketService;