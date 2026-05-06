"use client";

class AgoraRTMService {
  client = null;
  channel = null;

  isLoggedIn = false;
  isChannelJoined = false;

  messageQueue = [];
  isInitializing = false;

  async init({ appId, uid, channelName, token, onMessage, onReady }) {
    try {
      if (!uid || !channelName || !token) {
        console.error("❌ Missing RTM params");
        return;
      }

      // 🔥 Prevent multiple parallel init
      if (this.isInitializing) {
        console.warn("⏳ RTM already initializing...");
        return;
      }
      this.isInitializing = true;

      // console.log("🟡 INIT START");
      // console.log("UID:", uid);
      // console.log("CHANNEL:", channelName);

      // ✅ STEP 1: CLEAN OLD SESSION
      if (this.client) {
        // console.log("♻️ Cleaning old session...");
        try {
          await this.channel?.leave();
          await this.client.logout();
        } catch (e) {
          console.warn("Cleanup error:", e);
        }

        this.client = null;
        this.channel = null;
        this.isLoggedIn = false;
        this.isChannelJoined = false;
      }

      // ✅ STEP 2: LOAD SDK
      const AgoraRTM = (await import("agora-rtm-sdk")).default;

      if (!AgoraRTM?.createInstance) {
        console.error("❌ AgoraRTM load failed");
        this.isInitializing = false;
        return;
      }

      // ✅ STEP 3: CREATE CLIENT
      this.client = AgoraRTM.createInstance(appId);

      // ✅ STEP 4: LOGIN
      // console.log("👉 LOGIN START");
      await this.client.login({ uid, token });

      this.isLoggedIn = true;
      // console.log("✅ LOGIN SUCCESS");

      // ✅ EVENTS
      this.client.on("ConnectionStateChanged", (state, reason) => {
        // console.log("🔄 RTM STATE:", state, reason);

        if (state === "DISCONNECTED" || state === "ABORTED") {
          // console.warn("🔴 Disconnected");
          this.isLoggedIn = false;
          this.isChannelJoined = false;
        }
      });

      this.client.on("TokenExpired", () => {
        console.warn("⚠️ Token expired");
      });

      // ✅ STEP 5: CREATE CHANNEL
      // console.log("👉 CREATE CHANNEL");
      this.channel = this.client.createChannel(channelName);

      // ✅ STEP 6: JOIN CHANNEL
      // console.log("👉 JOIN CHANNEL");
      await this.channel.join();

      this.isChannelJoined = true;
      // console.log("✅ CHANNEL JOIN SUCCESS");

      // ✅ READY
      onReady && onReady();

      // ✅ FLUSH QUEUE
      if (this.messageQueue.length > 0) {
        // console.log("📤 Sending queued messages:", this.messageQueue.length);

        this.messageQueue.forEach((msg) => {
          this.channel.sendMessage({
            text: JSON.stringify(msg),
          });
        });

        this.messageQueue = [];
      }

      // ✅ LISTENER
      this.channel.on("ChannelMessage", ({ text }, senderId) => {
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { text };
        }

        onMessage && onMessage(parsed, senderId);
      });

    } catch (err) {
      // console.error("❌ RTM INIT ERROR:", err);

      this.client = null;
      this.channel = null;
      this.isLoggedIn = false;
      this.isChannelJoined = false;
    } finally {
      this.isInitializing = false;
    }
  }

  // ✅ SEND MESSAGE
  sendMessage(data) {
    if (!this.isChannelJoined || !this.channel) {
      // console.warn("⏳ Queueing message (RTM not ready)");
      this.messageQueue.push(data);
      return;
    }

    try {
      this.channel.sendMessage({
        text: JSON.stringify(data),
      });
    } catch (err) {
      // console.error("❌ Send failed, queueing:", err);
      this.messageQueue.push(data);
    }
  }

  // ✅ LEAVE
  async leave() {
    try {
      await this.channel?.leave();
      await this.client?.logout();
    } catch (e) {
      // console.warn("Leave error:", e);
    }

    this.client = null;
    this.channel = null;
    this.isLoggedIn = false;
    this.isChannelJoined = false;
    this.messageQueue = [];
    this.isInitializing = false;

    // console.log("👋 RTM CLEANED");
  }
}

export default new AgoraRTMService();