"use client";

class AgoraRTMService {
  client = null;
  channel = null;

  isLoggedIn = false;
  isChannelJoined = false;

  messageQueue = [];
  isInitializing = false;
  initSessionId = 0;

  messageHandler = null;
  connectionHandler = null;
  tokenExpiredHandler = null;

  lastInitConfig = null;
  onReconnect = null;
  onTokenRenew = null;

  async init({ appId, uid, channelName, token, onMessage, onReady , onError, onTokenRenew }) {
    if (!uid || !channelName || !token) {
      console.error("❌ Missing RTM params");
      onError?.(new Error("Missing RTM params"));
      return false;
    }

    if (this.isInitializing) {
      console.warn("⏳ RTM already initializing...");
      return false;
    }

    this.isInitializing = true;
    const sessionId = ++this.initSessionId;
    this.lastInitConfig = { appId, uid, channelName, token, onMessage, onReady, onError };
    this.onTokenRenew = onTokenRenew;

    try {
      await this.cleanup();

      if (sessionId !== this.initSessionId) return false;

      const AgoraRTM = (await import("agora-rtm-sdk")).default;
      if (!AgoraRTM?.createInstance) {
        throw new Error("AgoraRTM load failed");
      }

      this.client = AgoraRTM.createInstance(appId);

      this.connectionHandler = async (state) => {
        if (state === "DISCONNECTED" || state === "ABORTED") {
          this.isLoggedIn = false;
          this.isChannelJoined = false;
          if (this.lastInitConfig && sessionId === this.initSessionId) {
            this.onReconnect?.();
          }
        }
      };
      this.client.on("ConnectionStateChanged", this.connectionHandler);

      this.tokenExpiredHandler = async () => {
        console.warn("⚠️ RTM Token expired — attempting renewal");
        try {
          const newToken = await this.onTokenRenew?.();
          if (newToken && this.client) {
            await this.client.renewToken(newToken);
            if (this.lastInitConfig) this.lastInitConfig.token = newToken;
          }
        } catch (e) {
          console.error("Token renewal failed:", e);
          onError?.(e);
        }
      };
      this.client.on("TokenExpired", this.tokenExpiredHandler);

      await this.client.login({ uid, token });
      if (sessionId !== this.initSessionId) return false;

      this.isLoggedIn = true;
      this.channel = this.client.createChannel(channelName);
      await this.channel.join();
      if (sessionId !== this.initSessionId) return false;

      this.isChannelJoined = true;

      this.messageHandler = ({ text }, senderId) => {
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { type: "chat", text, Message: text };
        }
        if (typeof parsed === "string" || typeof parsed === "number") {
          parsed = { type: "chat", text: String(parsed), Message: String(parsed) };
        }
        onMessage?.(parsed, senderId);
      };
      this.channel.on("ChannelMessage", this.messageHandler);

      this.flushQueue();
      onReady?.();
      return true;
    } catch (err) {
      console.error("❌ RTM INIT ERROR:", err);
      await this.cleanup();
      onError?.(err);
      return false;
    } finally {
      if (sessionId === this.initSessionId) {
        this.isInitializing = false;
      }
    }
  }

  flushQueue() {
    if (!this.isChannelJoined || !this.channel || this.messageQueue.length === 0) return;

    const queue = [...this.messageQueue];
    this.messageQueue = [];

    queue.forEach((msg) => {
      const payload =
        typeof msg === "string" ? { type: "chat", text: msg, Message: msg } : msg;
      try {
        this.channel.sendMessage({ text: JSON.stringify(payload) });
      } catch {
        this.messageQueue.push(payload);
      }
    });
  }

  sendMessage(data) {
    const payload =
      typeof data === "string"
        ? { type: "chat", text: data, Message: data }
        : {
            type: "chat",
            text: data?.text || data?.Message || "",
            Message: data?.Message || data?.text || "",
            ...data,
          };

    if (!payload.text && !payload.Message) return false;

    if (!this.isChannelJoined || !this.channel) {
      if (this.messageQueue.length < 50) {
        this.messageQueue.push(payload);
      }
      return false;
    }

    try {
      this.channel.sendMessage({ text: JSON.stringify(payload) });
      return true;
    } catch (err) {
      if (this.messageQueue.length < 50) {
        this.messageQueue.push(payload);
      }
      return false;
    }
  }

  async cleanup() {
    if (this.channel && this.messageHandler) {
      try {
        this.channel.off("ChannelMessage", this.messageHandler);
      } catch (e) {
        /* ignore */
      }
    }

    if (this.client) {
      if (this.connectionHandler) {
        try {
          this.client.off("ConnectionStateChanged", this.connectionHandler);
        } catch (e) {
          /* ignore */
        }
      }
      if (this.tokenExpiredHandler) {
        try {
          this.client.off("TokenExpired", this.tokenExpiredHandler);
        } catch (e) {
          /* ignore */
        }
      }
    }

    try {
      await this.channel?.leave();
    } catch (e) {
      /* ignore */
    }
    try {
      await this.client?.logout();
    } catch (e) {
      /* ignore */
    }

    this.client = null;
    this.channel = null;
    this.messageHandler = null;
    this.connectionHandler = null;
    this.tokenExpiredHandler = null;
    this.isLoggedIn = false;
    this.isChannelJoined = false;
  }

  async leave() {
    this.initSessionId += 1;
    this.messageQueue = [];
    this.isInitializing = false;
    this.lastInitConfig = null;
    await this.cleanup();
  }

  async reconnect() {
    if (!this.lastInitConfig || this.isInitializing) return false;
    const cfg = this.lastInitConfig;
    return this.init(cfg);
  }
}

export default new AgoraRTMService();
