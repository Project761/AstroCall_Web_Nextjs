"use client";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import socketService from "@/app/services/socketService";
import agoraRTM from "@/app/services/agoraRTMService";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import ChatKundliPopUp from "@/app/components/ChatKundliPopUp";
import { postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { sanitizeHtml } from "@/app/lib/sanitizeHtml";
import { format } from "date-fns";
import {
  ArrowLeft, Phone, MoreVertical, BadgeCheck, Wallet, Clock, Timer, Power,
  AlertTriangle, Paperclip, Smile, Send, FileText, Camera, ImageIcon, Star, Gift, Lock, CheckCheck,
} from "lucide-react";
import Image from "next/image";

const readSessionStorage = (key, fallback = "") => {
  if (typeof window === "undefined") return fallback;
  return sessionStorage.getItem(key) || fallback;
};

const readLocalStorage = (key, fallback = "") => {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) || fallback;
};

const getMessageBody = (item) => String(item?.message ?? item?.text ?? "").trim();

const normalizeRtmPayload = (msg) => {
  if (msg == null) return "";
  if (typeof msg === "string" || typeof msg === "number") return String(msg).trim();
  if (typeof msg === "object") {
    return String(msg.text ?? msg.Message ?? msg.message ?? "").trim();
  }
  return "";
};

const isSystemRtmPayload = (msg) => {
  if (!msg || typeof msg !== "object") return false;
  if (msg.Status === "getCltime" || msg.Message === "Time") return true;
  if (msg.Type === "ping" || msg.Type === "pong" || msg.Type === "ACK") return true;
  if (msg.type && !["chat", "userDetails"].includes(msg.type)) return true;
  return false;
};

const buildMessageKey = (item) => {
  if (item?.id) return `id:${item.id}`;
  const body = getMessageBody(item);
  const ts = item?.timestamp || item?.createdAt || "";
  return `${item?.isMine ? "me" : "them"}|${body}|${ts}`;
};

const sortMessages = (list) =>
  [...(list || [])].sort(
    (a, b) => new Date(a.timestamp || a.createdAt || 0) - new Date(b.timestamp || b.createdAt || 0)
  );

const dedupeMessages = (list) => {
  const seen = new Set();
  return sortMessages(list).filter((item) => {
    const body = getMessageBody(item);
    if (!body) return false;
    const key = buildMessageKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const QUICK_EMOJIS = ["😊", "🙏", "❤️", "👍", "😂", "🙂"];

export default function ChatUI({ role = "user", layoutMode = "overlay" }) {
  const router = useRouter();
  const params = useSearchParams();

  const { popupData, UserCheckEndedChat, setUserCheckEndedChat, loginAstrologerData, astroParsedData, astroCheckEndedChat, setAstroCheckEndedChat, userCalculateTime, AstroCalculateTime, setPopupData, loginUserData } = useMenuContext();



  const [chatCompletedState, setChatCompletedState] = useState("");
  const [rtmStatus, setRtmStatus] = useState("idle");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const HISTORY_PAGE_SIZE = 40;

  const isChatCompletedFromStorage =
    chatCompletedState === "Chat Completed" ||
    readSessionStorage("UserChatCompleted") === "Chat Completed" ||
    readSessionStorage("AstroChatCompleted") === "Chat Completed";

  useEffect(() => {
    const sync = () => {
      const val =
        sessionStorage.getItem("UserChatCompleted") ||
        sessionStorage.getItem("AstroChatCompleted") ||
        "";
      setChatCompletedState(val);
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const storedUserName = readSessionStorage("ChatUserName");
  const storedAstroName = readSessionStorage("ChatAstroName");

  useEffect(() => {
    if (role === "user" && popupData?.AstroName && !storedAstroName) {
      sessionStorage.setItem("ChatAstroName", popupData.AstroName);
    }
    if (role === "astrologer" && astroParsedData?.UserName && !storedUserName) {
      sessionStorage.setItem("ChatUserName", astroParsedData.UserName);
    }
  }, [popupData?.AstroName, astroParsedData?.UserName, role]);



  const getRoleData = () => {
    if (role === "astrologer") {
      return {
        loginId: readLocalStorage("AstroLoginId"),
        token: params.get("AstroChatTokenId"),
        uidPrefix: "WA",
        userName: "Astrologer",
        socketService: socketService,
        contextData: astroParsedData,
        checkEndedChat: astroCheckEndedChat,
        setCheckEndedChat: setAstroCheckEndedChat,
        backRoute: "/astrologer-panel/dashboard"
      };
    } else {
      return {
        loginId: readLocalStorage("UserLoginId"),
        token: params.get("UserChatTokenId"),
        uidPrefix: "WU",
        userName: "User",
        socketService: socketService,
        contextData: popupData,
        checkEndedChat: UserCheckEndedChat,
        setCheckEndedChat: setUserCheckEndedChat,
        backRoute: "/chat-to-astrologers"
      };
    }
  };

  const roleData = getRoleData();
  const channel = params.get("channel");
  const WaitingListId = params.get("WaitingListId");
  const UserId = params.get("UserId");
  const AstroId = params.get("AstroId");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [waitingListCheck, setWaitingListCheck] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [UserChatData, setUserChatData] = useState();
  const [autoUserMessageSent, setAutoUserMessageSent] = useState(false);
  const [isChatEnding, setIsChatEnding] = useState(false);
  const [isSendingAutoMessage, setIsSendingAutoMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Basic");
  const [timeLeft, setTimeLeft] = useState(0);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const pendingKeysRef = useRef(new Set());
  const autoUserMessageSentRef = useRef(false);
  const allHistoryRef = useRef([]);
  const timerEndRef = useRef(null);
  const getTimeIntervalRef = useRef(null);

  const formatMessage = useCallback((msg, isMine = false) => {
    const body = normalizeRtmPayload(msg);
    return {
      id: msg?.ChatId || msg?.Id || msg?.id || null,
      isMine,
      message: body,
      text: body,
      sender: msg?.UserName || (isMine ? "You" : roleData.userName),
      createdAt: msg?.createdAt || msg?.timestamp || new Date().toISOString(),
      timestamp: msg?.timestamp || msg?.createdAt || new Date().toISOString(),
      status: msg?.status || (isMine ? "sent" : "received"),
    };
  }, [roleData.userName]);

  const appendLiveMessage = useCallback((msg, isMine = false) => {
    const body = normalizeRtmPayload(msg);
    if (!body) return;

    const formatted = formatMessage(
      {
        text: body,
        Message: body,
        timestamp: msg?.timestamp || new Date().toISOString(),
        createdAt: msg?.createdAt || new Date().toISOString(),
        status: isMine ? "sent" : "received",
      },
      isMine
    );

    const key = buildMessageKey(formatted);
    if (pendingKeysRef.current.has(key)) return;
    pendingKeysRef.current.add(key);

    setMessages((prev) => dedupeMessages([...prev, formatted]));

    setTimeout(() => {
      pendingKeysRef.current.delete(key);
    }, 3000);
  }, [formatMessage]);

  // Fetch chat history
  const fetchChatHistory = useCallback(async () => {
    if (!UserId || !AstroId || !channel) return;
    setHistoryLoading(true);
    try {
      const res = await postWithToken("Chat/ReturnChat", {
        UserID: UserId,
        AstroID: AstroId,
      });
      const filtered = (res || []).filter(
        (item) => item?.ChannelName?.trim() === channel?.trim()
      );
      const formatted = filtered.map((msg) =>
        formatMessage(
          {
            ChatId: msg.ChatId || msg.Id,
            Message: msg.Message,
            UserName: msg.IsfromAstro ? "Astrologer" : "User",
            createdAt: msg.DateTimes,
            timestamp: msg.DateTimes,
          },
          role === "user" ? !msg.IsfromAstro : msg.IsfromAstro
        )
      );
      allHistoryRef.current = dedupeMessages(formatted);
      setHistoryPage(1);
      setChatHistory(allHistoryRef.current.slice(-HISTORY_PAGE_SIZE));
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [UserId, AstroId, channel, role, formatMessage]);

  const loadOlderMessages = useCallback(() => {
    const all = allHistoryRef.current;
    if (!all.length || loadingOlder) return;
    const currentlyShown = historyPage * HISTORY_PAGE_SIZE;
    if (currentlyShown >= all.length) return;

    setLoadingOlder(true);
    const container = messagesContainerRef.current;
    const prevHeight = container?.scrollHeight || 0;

    setHistoryPage((p) => p + 1);
    setChatHistory(all.slice(-(currentlyShown + HISTORY_PAGE_SIZE)));

    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = container.scrollHeight - prevHeight;
      }
      setLoadingOlder(false);
    });
  }, [historyPage, loadingOlder]);

  // Initialize RTM
  const fetchWaitingList = useCallback(async () => {
    try {
      const res = await postWithToken('WaitingList/GetData_WaitingListUser', { "AstroId": "", "UserId": roleData.loginId });
      if (res) {
        const checkData = res?.find((item) => item?.WaitingListId == roleData.contextData?.WaitingListId);
        if (checkData) {
          setWaitingListCheck(checkData);
        }
      }
    } catch (error) {
      console.error("Error fetching waiting list:", error);
    }
  }, [roleData.loginId, roleData.contextData?.WaitingListId]);

  useEffect(() => {
    if (!channel || !roleData.token || !roleData.loginId) return;

    let cancelled = false;
    const myUid = `${roleData.uidPrefix}${roleData.loginId}`;

    agoraRTM.onReconnect = () => {
      if (!cancelled) agoraRTM.reconnect();
    };

    const initRTM = async () => {
      setRtmStatus("connecting");
      setIsReady(false);

      const ok = await agoraRTM.init({
        appId: "6b24a712e983467b9ace351f51518f08",
        uid: myUid,
        channelName: channel,
        token: roleData.token,
        onMessage: (msg, senderId) => {
          if (isSystemRtmPayload(msg)) return;
          const body = normalizeRtmPayload(msg);
          if (!body) return;
          if (senderId && senderId === myUid) return;
          appendLiveMessage(msg, false);
        },
        onReady: () => {
          if (cancelled) return;
          setRtmStatus("ready");
          setIsReady(true);
        },
        onError: () => {
          if (cancelled) return;
          setRtmStatus("error");
          setIsReady(false);
        },
        onTokenRenew: async () => roleData.token,
      });

      if (!ok && !cancelled) setRtmStatus("error");
    };

    void initRTM();

    return () => {
      cancelled = true;
      agoraRTM.onReconnect = null;
      agoraRTM.leave();
      queueMicrotask(() => {
        setRtmStatus("idle");
        setIsReady(false);
      });
    };
  }, [channel, roleData.token, roleData.loginId, role, appendLiveMessage]);

  useEffect(() => {
    queueMicrotask(() => {
      pendingKeysRef.current.clear();
      setMessages([]);
      setChatHistory([]);
      allHistoryRef.current = [];
      setHistoryPage(1);
    });
  }, [channel]);

  useEffect(() => {
    void (async () => { await fetchChatHistory(); })();
  }, [fetchChatHistory]);

  useEffect(() => {
    if (role === "user" && roleData.loginId) {
      void (async () => { await fetchWaitingList(); })();
    }
  }, [role, roleData.loginId, fetchWaitingList]);


  const checkChannelMessageSent = () => {
    const channelKey = `autoMessage_${channel}`;
    return localStorage.getItem(channelKey) === 'sent';
  };

  // Mark auto message as sent for this channel
  const markChannelMessageSent = () => {
    const channelKey = `autoMessage_${channel}`;
    localStorage.setItem(channelKey, 'sent');
  };

  useEffect(() => {
    if (channel) {
      queueMicrotask(() => {
        const alreadySent = checkChannelMessageSent();
        setAutoUserMessageSent(alreadySent);
        autoUserMessageSentRef.current = alreadySent;
      });
    }
  }, [channel]);

  useEffect(() => {
    autoUserMessageSentRef.current = autoUserMessageSent;
  }, [autoUserMessageSent]);

  const sendMessage = async (text) => {
    const body = String(text || "").trim();
    if (!body || !agoraRTM.isChannelJoined || isSending) return;

    setIsSending(true);
    setSendError("");

    appendLiveMessage({ text: body, Message: body, status: "sending" }, true);

    try {
      const sent = agoraRTM.sendMessage({
        type: "chat",
        text: body,
        Message: body,
        UserName: roleData.userName,
        timestamp: new Date().toISOString(),
      });

      if (!sent) throw new Error("RTM send failed");

      await insertChat(body);

      setMessages((prev) =>
        prev.map((m) =>
          m.message === body && m.status === "sending" ? { ...m, status: "sent" } : m
        )
      );
    } catch (error) {
      console.error("Send message error:", error);
      setSendError("Message send failed. Please try again.");
      setMessages((prev) =>
        prev.map((m) =>
          m.message === body && m.status === "sending" ? { ...m, status: "failed" } : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };



  // Insert chat to database
  const insertChat = async (text) => {
    const val = {
      ChannelName: channel,
      AstroID: AstroId,
      UserID: UserId,
      IsfromAstro: role === "astrologer",
      Message: text,
      WaitingListId: WaitingListId,
      chatOrderId: WaitingListId,
    };
    await TokenWithDeleteUpadateAdd("Chat/InsertChat", val);
  };

  const fetchChatIntakeData = useCallback(async (bioId) => {
    try {
      const res = await postWithToken("CHATINTAKEFORM/GetSinglaData_CHATINTAKEFORM", {
        ChatUserBioID: bioId,
      });
      return res || null;
    } catch (error) {
      console.error("Intake form fetch error:", error);
      return null;
    }
  }, []);

  const buildUserDetailsMessage = (data) => {
    const list = Array.isArray(data) ? data : data ? [data] : [];
    if (!list.length) {
      if (!popupData) return "";
      return `Hi ${popupData?.AstroName || "Astrologer"},
Below are my details:
Name: User
Mobile: ${popupData?.UserMobile || "N/A"}
Email: ${popupData?.UserEmail || "N/A"}
Purpose: ${popupData?.UserPurpose || "General Consultation"}
I'm ready for the consultation.`;
    }

    const item = list[0];
    return `Hi ${popupData?.AstroName || "Astrologer"},
Below are my details:
Name: ${item?.NickName || "User"}
Gender: ${item?.Gender || "N/A"}
DOB: ${item?.DOB || "N/A"}
TOB: ${item?.TOB || "N/A"}
POB: ${item?.POB || "N/A"}
Marital: ${item?.Marital || "N/A"}
TopicofConcern: ${item?.TopicofConcern || "General"}
Occupation: ${item?.Occupation || "N/A"}
I'm ready for the consultation.`;
  };

  // Helper function to send auto message
  const sendAutoMessage = async (message) => {
    const body = String(message || "").trim();
    if (!body) return;

    appendLiveMessage({ Message: body, text: body }, true);

    try {
      agoraRTM.sendMessage({
        type: "userDetails",
        text: body,
        Message: body,
        UserName: roleData.userName,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ RTM send error:", error);
    }

    if (role === "user") {
      try {
        socketService.sendUser({
          Type: "userDetails",
          Message: body,
          ChannelName: channel,
        });
      } catch (error) {
        console.error("❌ Socket send error:", error);
      }
    }

    try {
      await insertChat(body);
    } catch (error) {
      console.error("❌ Database insert error:", error);
    }

    setAutoUserMessageSent(true);
    markChannelMessageSent();
  };

  const sendAutoUserDetailsMessageRef = useRef(null);

  // Send auto user details message
  const sendAutoUserDetailsMessage = useCallback(async () => {
    if (isSendingAutoMessage) {
      return;
    }

    if (isChatEnding) {
      return;
    }
    if (checkChannelMessageSent()) {
      setAutoUserMessageSent(true);
      return;
    }

    setIsSendingAutoMessage(true);

    try {
      if (!agoraRTM.isChannelJoined) {
        setTimeout(() => {
          setIsSendingAutoMessage(false);
          if (agoraRTM.isChannelJoined && !autoUserMessageSent && !isChatEnding) {
            sendAutoUserDetailsMessageRef.current?.();
          }
        }, 1000);
        return;
      }

      if (!UserChatData) {
        if (popupData?.ChatUserBioID) {
          const data = await fetchChatIntakeData(popupData.ChatUserBioID);
          if (data) {
            const details = buildUserDetailsMessage(data);
            await sendAutoMessage(details || `Hi ${popupData?.AstroName || "Astrologer"},\nI'm ready for the consultation.`);
          }
        }
        return;
      }

      const userDetails = buildUserDetailsMessage(UserChatData);

      if (!userDetails || userDetails.trim() === '') {
        const fallbackMessage = `Hi ${popupData?.AstroName || 'Astrologer'},\nI'm ready for the consultation.`;
        await sendAutoMessage(fallbackMessage);
        return;
      }

      await sendAutoMessage(userDetails);
    } catch (error) {
      console.error("❌ Error in sendAutoUserDetailsMessage:", error);
    } finally {
      setIsSendingAutoMessage(false);
    }
  }, [isSendingAutoMessage, isChatEnding, autoUserMessageSent, UserChatData, popupData, fetchChatIntakeData, roleData.userName, role, channel]);

  useEffect(() => {
    sendAutoUserDetailsMessageRef.current = sendAutoUserDetailsMessage;
  }, [sendAutoUserDetailsMessage]);

  useEffect(() => {
    if (role !== "user" || autoUserMessageSentRef.current || isSendingAutoMessage || isChatEnding) return;
    if (isReady && agoraRTM.isChannelJoined && UserChatData) {
      void (async () => { await sendAutoUserDetailsMessage(); })();
    }
  }, [isReady, UserChatData, autoUserMessageSent, isSendingAutoMessage, isChatEnding, role, sendAutoUserDetailsMessage]);

  // Navigation functions
  const handleBack = async () => {
    try {
      await agoraRTM.leave();
    } catch (error) {
      console.error("Leave RTM on back:", error);
    }
    sessionStorage.removeItem("AstroChatCompleted");
    sessionStorage.removeItem("UserAccepted");
    localStorage.removeItem("AstroChatTokenId");
    sessionStorage.removeItem("UserChatCompleted");
    setPopupData(null);
    router.push(roleData.backRoute);
  };

  const checkEnded = () => {
    if (!roleData.contextData) return;
    const payload = {
      UserId: `WU${roleData.contextData?.UserId}`,
      AstroId: `WA${roleData.contextData?.AstroId}`,
      Status: "CheckEnded",
      ReceivedMessageState: role === "user" ? "U" : "A",
      messageId: "NewRequest",
    };

    if (role === "user") {
      socketService.sendUser(payload);
    } else {
      socketService.sendAstro(payload);
    }
  };

  const chatCompleted = () => {
    if (!roleData.contextData) return;

    const payload = {
      UserId: `WU${roleData.contextData?.UserId}`,
      AstroId: `WA${roleData.contextData?.AstroId}`,
      Status: "Completed",
      Type: "chat",
      AstroName: roleData.contextData?.AstroName,
      AvatarUrl: roleData.contextData?.AvatarUrl,
      messageId: "NewRequest",
    };

    if (role === "user") {
      socketService.sendUser(payload);
    } else {
      socketService.sendAstro(payload);
    }
  };

  const leaveRtmChannel = async () => {
    try {
      await agoraRTM.leave();
    } catch (error) {
      console.error(error);
    } finally {
      roleData.setCheckEndedChat("");
      chatCompleted();
      sessionStorage.removeItem("UserPopupData");
      sessionStorage.removeItem("Usermessage");
      sessionStorage.removeItem("ChatCompleted");
    }
  };


  const combinedMessages = useMemo(
    () => dedupeMessages([...(chatHistory || []), ...(messages || [])]),
    [chatHistory, messages]
  );

  // Get header info based on role
  const getHeaderInfo = () => {
    const isEnded =
      roleData.contextData?.Message === "Chat Completed" ||
      isChatCompletedFromStorage;

    if (role === "astrologer") {
      return {
        name: roleData.contextData?.UserName || storedUserName,
        avatar: roleData.contextData?.AvatarUrl,
        isOnline: !isEnded,
        rate: null,
        showEndButton: !isEnded,
        chatStatus: isEnded ? "ended" : "active",
      };
    }

    return {
      name: roleData.contextData?.AstroName || storedAstroName,
      avatar: roleData.contextData?.ProfilePic,
      isOnline: !isEnded,
      rate: roleData.contextData?.Rate,
      showEndButton: !isEnded,
      chatStatus: isEnded ? "ended" : "active",
    };
  };

  const headerInfo = getHeaderInfo();
  const checkEndedChatPopup = roleData.checkEndedChat || null;


  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [combinedMessages]);
  // useEffect(() => {
  //   const container = messagesContainerRef.current;

  //   if (!container) return;

  //   // user bottom ke kitne paas h
  //   const isNearBottom =
  //     container.scrollHeight - container.scrollTop - container.clientHeight < 120;

  //   // sirf tab auto scroll karo
  //   if (isNearBottom) {
  //     messagesEndRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //     });
  //   }
  // }, [combinedMessages]);

  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (combinedMessages.length > prevMessageCountRef.current) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 120;

      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }

    prevMessageCountRef.current = combinedMessages.length;
  }, [combinedMessages]);

  const handleMessagesScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || loadingOlder) return;
    if (container.scrollTop < 80) {
      loadOlderMessages();
    }
  }, [loadOlderMessages, loadingOlder]);

  // Handle emoji select
  const handleEmojiSelect = (emoji) => {
    setInputValue(prev => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  // Handle send message
  const handleSend = () => {
    const message = inputValue.trim();
    if (message && !isSending) {
      sendMessage(message);
      setInputValue("");
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatElapsed = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const formatTimeLeftShort = (seconds) => {
    const safe = Math.max(0, Number(seconds) || 0);
    if (safe <= 0) return "—";
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return m > 0 ? `~ ${m}m ${String(s).padStart(2, "0")}s` : `~ ${s}s`;
  };

  const getAvatarSrc = (path) => {
    if (!path) return null;
    const cleaned = path.replace(/\\/g, "/");
    return cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
  };

  const walletBalance = loginUserData?.WalletAmt ?? popupData?.WalletAmt ?? 0;
  const chatRate = headerInfo?.rate || popupData?.Rate || roleData.contextData?.Rate || 0;
  const totalChatSeconds = convertToSeconds(role === "user" ? userCalculateTime : AstroCalculateTime);
  const safeTimeLeft = Math.max(0, Number(timeLeft) || 0);
  const walletTimeLeftSeconds =
    role === "user" && chatRate > 0 && walletBalance > 0
      ? Math.floor((walletBalance / chatRate) * 60)
      : 0;
  const displayTimeLeft = safeTimeLeft > 0 ? safeTimeLeft : walletTimeLeftSeconds;
  const chatElapsed =
    totalChatSeconds > 0
      ? Math.min(totalChatSeconds, Math.max(0, totalChatSeconds - safeTimeLeft))
      : 0;
  const isWalletLow = role === "user" && displayTimeLeft > 0 && displayTimeLeft <= 120;
  const showLowWalletBanner = role === "user" && (isWalletLow || (walletBalance > 0 && chatRate > 0 && walletBalance / chatRate < 2));
  const astroRating = popupData?.Review || popupData?.AvgRating || popupData?.Rating || null;
  const astroExp = popupData?.ExperiencedYears || loginAstrologerData?.ExperiencedYears || null;
  const isInputDisabled =
    headerInfo?.chatStatus === "ended" ||
    rtmStatus !== "ready" ||
    (role === "user" && !autoUserMessageSent) ||
    isChatCompletedFromStorage ||
    isSending;

  const quickActions = role === "astrologer"
    ? [
      // { icon: FileText, label: "Document", color: "text-blue-500", bg: "bg-blue-50", onClick: () => { } },
      // { icon: Camera, label: "Camera", color: "text-pink-500", bg: "bg-pink-50", onClick: () => { } },
      // { icon: ImageIcon, label: "Gallery", color: "text-purple-500", bg: "bg-purple-50", onClick: () => { } },
      { icon: Star, label: "Kundli", color: "text-amber-500", bg: "bg-amber-50", onClick: () => setIsModalOpen(true) },
      // { icon: Gift, label: "Send Gift", color: "text-green-500", bg: "bg-green-50", onClick: () => { } },
    ]
    : [
      { icon: FileText, label: "Document", color: "text-blue-500", bg: "bg-blue-50", onClick: () => sendAutoUserDetailsMessage() },
      { icon: Camera, label: "Camera", color: "text-pink-500", bg: "bg-pink-50", onClick: () => { } },
      { icon: ImageIcon, label: "Gallery", color: "text-purple-500", bg: "bg-purple-50", onClick: () => { } },
      { icon: Star, label: "Kundli", color: "text-amber-500", bg: "bg-amber-50", onClick: () => { } },
      { icon: Gift, label: "Send Gift", color: "text-green-500", bg: "bg-green-50", onClick: () => { } },
    ];

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parseMessageWithLinks = (message) => {
    if (!message) return "";

    let safeMessage = "";

    // object aaye to text nikalo
    if (typeof message === "object") {
      safeMessage = message?.text || message?.Message || "";
    } else {
      safeMessage = String(message);
    }

    safeMessage = safeMessage.trim();

    // remove starting & ending quotes
    safeMessage = safeMessage.replace(/^"+|"+$/g, "");

    // remove escaped quotes
    safeMessage = safeMessage.replace(/\\"/g, '"');

    // remove starting stars
    safeMessage = safeMessage.replace(/^\*+/, "");

    return sanitizeHtml(
      safeMessage
        .replace(/\n/g, "<br/>")
        .replace(
          urlRegex,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline font-medium">${url}</a>`
        )
    );
  };

  const messageItems = useMemo(() => {
    return combinedMessages.reduce((acc, item) => {
      const ts = item?.timestamp || item?.createdAt;
      const dateLabel = ts ? format(new Date(ts), "dd MMM yyyy") : "Today";
      const prevDate = acc.length > 0 ? acc[acc.length - 1].dateLabel : null;
      const showDate = dateLabel !== prevDate;
      acc.push({ item, showDate, dateLabel, key: buildMessageKey(item) });
      return acc;
    }, []);
  }, [combinedMessages]);
  // Setup global click handlers
  useEffect(() => {
    window.handleGemstoneClick = async (id, name, price, image) => {
      // console.log('Gemstone clicked:', { id, name, price, image });
    };

    window.handlePujaClick = async (id, name, price, image) => {
      // console.log('Puja clicked:', { id, name, price, image });
    };

    return () => {
      delete window.handleGemstoneClick;
      delete window.handlePujaClick;
    };
  }, []);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);


  useEffect(() => {
    if (popupData?.ChatUserBioID) {
      fetchChatIntakeData(popupData.ChatUserBioID).then((data) => {
        if (data) setUserChatData(data);
      });
    }
  }, [popupData?.ChatUserBioID, fetchChatIntakeData]);

  function convertToSeconds(time) {
    if (!time || typeof time !== "string") return 0;
    const parts = time.split(":").map(Number);
    if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return 0;
    const [hours = 0, minutes = 0, seconds = 0] = parts;
    return Math.max(0, hours * 3600 + minutes * 60 + seconds);
  }

  function formatTimeCalculateTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  useEffect(() => {
    const calcTime = role === "user" ? userCalculateTime : AstroCalculateTime;
    if (isChatCompletedFromStorage || !calcTime) return undefined;

    const totalSeconds = convertToSeconds(calcTime);
    if (totalSeconds <= 0) {
      queueMicrotask(() => setTimeLeft(0));
      return undefined;
    }

    timerEndRef.current = Date.now() + totalSeconds * 1000;

    const tick = () => {
      if (!timerEndRef.current) return;
      setTimeLeft(Math.max(0, Math.floor((timerEndRef.current - Date.now()) / 1000)));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [role, userCalculateTime, AstroCalculateTime, isChatCompletedFromStorage]);

  const GetTime = useCallback(() => {
    if (role === "user") {
      if (!(popupData?.UserId || UserId) || !(popupData?.AstroId || AstroId)) return;
      socketService.sendUser({
        UserId: `WU${popupData?.UserId || UserId}`,
        AstroId: `WA${popupData?.AstroId || AstroId}`,
        Status: "getCltime",
        ReceivedMessageState: "U",
        messageId: "NewRequest",
      });
    } else {
      if (!(astroParsedData?.UserId || UserId) || !(astroParsedData?.AstroId || AstroId)) return;
      socketService.sendAstro({
        UserId: `WU${astroParsedData?.UserId || UserId}`,
        AstroId: `WA${astroParsedData?.AstroId || AstroId}`,
        Status: "getCltime",
        ReceivedMessageState: "A",
        messageId: "NewRequest",
      });
    }
  }, [role, popupData, astroParsedData, UserId, AstroId]);

  useEffect(() => {
    GetTime();
    getTimeIntervalRef.current = setInterval(GetTime, 30000);
    return () => {
      if (getTimeIntervalRef.current) clearInterval(getTimeIntervalRef.current);
    };
  }, [GetTime]);

  useEffect(() => {
    if (role !== "astrologer") return undefined;

    const handleSocketMsg = (data) => {
      if (!data) return;
      if (data.Message === "Chat Completed" || data.Message === "Please Disconnect the Chat User Balance is Over") {
        setChatCompletedState("Chat Completed");
      }
      if (data.Status === "getCltime" || data.Message === "Time") return;
      if (data.Type === "userDetails" && data.Message) {
        if (channel && data.ChannelName && data.ChannelName !== channel) return;
        appendLiveMessage({ Message: data.Message, text: data.Message }, false);
      }
    };

    return socketService.addAstroListener(handleSocketMsg);
  }, [role, channel, appendLiveMessage]);

  useEffect(() => {
    if (role !== "user") return undefined;

    const handleSocketMsg = (data) => {
      if (!data) return;
      if (
        data.Message === "Chat Completed" ||
        data.Message === "Please Disconnect the Chat User Balance is Over"
      ) {
        setChatCompletedState("Chat Completed");
      }
    };

    return socketService.addUserListener(handleSocketMsg);
  }, [role]);

  const isPageLayout = layoutMode === "page";
  const pageOuterClass = isPageLayout ? role === "user"
    ? "fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
    : "fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4"
    : "fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3";

  const pageInnerClass = isPageLayout
    ? "relative z-10 flex h-[min(920px,calc(100dvh-5.5rem))] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl border border-orange-100/80 bg-white shadow-2xl"
    : "relative z-10 flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:h-[92dvh]";
  const displayName = headerInfo?.name || (role === "user" ? (storedAstroName || popupData?.AstroName || "Astrologer") : (storedUserName || astroParsedData?.UserName || "User"));
  const avatarSrc = getAvatarSrc(headerInfo?.avatar);

  return (
    <div className={pageOuterClass}>
      {!isPageLayout && <div className="absolute inset-0 bg-black/10" />}
      <div className={pageInnerClass}>

        {/* ── Top profile bar + stats (sticky) ── */}
        <div className="sticky top-0 z-10 shrink-0 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleBack} className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="relative shrink-0">
                {avatarSrc ? (
                  <Image src={avatarSrc} alt={displayName} width={44} height={44} className="h-11 w-11 rounded-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFE8D9] text-sm font-bold text-[#FF5C00]">
                    {displayName.charAt(0)}
                  </div>
                )}
                {headerInfo?.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h2 className="truncate text-sm font-bold text-[#1A1A1A]">
                    {role === "user" && !displayName.toLowerCase().startsWith("astro") ? `Astro ${displayName}` : displayName}
                  </h2>
                  {role === "user" && <BadgeCheck className="h-4 w-4 shrink-0 text-[#FF5C00]" />}
                </div>
                {role === "user" && (astroRating || astroExp) && (
                  <p className="truncate text-[11px] text-gray-500 flex items-center gap-1">
                    {astroRating && (
                      <>
                        <span className="text-yellow-400">★</span>
                        <span>{astroRating}</span>
                      </>
                    )}

                    {astroRating && astroExp && (
                      <span className="text-gray-300">•</span>
                    )}

                    {astroExp && (
                      <span>{astroExp}+ Years Exp.</span>
                    )}
                  </p>
                )}
                {role === "astrologer" && (
                  <p className="text-[11px] text-green-600 font-medium">Online</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {/* {role === "user" && (
                  <button type="button" className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Call">
                    <Phone className="h-4 w-4" />
                  </button>
                )} */}
                {/* <button type="button" className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="More">
                  <MoreVertical className="h-4 w-4" />
                </button> */}
                {headerInfo?.showEndButton && headerInfo?.chatStatus !== "ended" && !isChatCompletedFromStorage ? (
                  <button
                    type="button"
                    onClick={checkEnded}
                    className="ml-1 flex items-center gap-1 rounded-lg border border-red-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <Power className="h-3.5 w-3.5" /> End Chat
                  </button>
                ) : (
                  <button type="button" onClick={handleBack} className="ml-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600">
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="overflow-x-auto border-b border-orange-100 bg-[#FFF9F1] px-2 py-2">
            <div className="flex min-w-max items-center gap-1 sm:gap-2">
              {role === "user" && chatRate > 0 && (
                <div className="flex flex-col items-center px-2">
                  <span className="text-[10px] text-gray-400">Rate</span>
                  <span className="text-xs font-bold text-[#FF5C00]">₹{chatRate}/min</span>
                </div>
              )}
              {role === "user" && (
                <div className="flex flex-col items-center border-l border-orange-100 px-2">
                  <span className="text-[10px] text-gray-400">Wallet</span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
                    <Wallet className="h-3 w-3" /> ₹{walletBalance}
                  </span>
                </div>
              )}
              <div className="flex flex-col items-center border-l border-orange-100 px-2">
                <span className="text-[10px] text-gray-400">Time Left</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
                  <Clock className="h-3 w-3" />
                  {displayTimeLeft > 0 ? formatTimeLeftShort(displayTimeLeft) : "—"}
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-orange-100 px-2">
                <span className="text-[10px] text-gray-400">Chat Time</span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-red-500">
                  <Timer className="h-3 w-3" /> {formatElapsed(chatElapsed)}
                </span>
              </div>
              {/* {headerInfo?.showEndButton && headerInfo?.chatStatus !== "ended" && !isChatCompletedFromStorage ? (
                <button
                  type="button"
                  onClick={checkEnded}
                  className="ml-1 flex items-center gap-1 rounded-lg border border-red-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <Power className="h-3.5 w-3.5" /> End Chat
                </button>
              ) : (
                <button type="button" onClick={handleBack} className="ml-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600">
                  Back
                </button>
              )} */}
            </div>
          </div>
        </div>

        {/* ── Wallet low warning ── */}
        {showLowWalletBanner && (
          <div className="flex shrink-0 items-center justify-between gap-2 bg-[#FFF0E6] px-3 py-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#FF5C00]">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Wallet low · Est. time left: {formatTimeLeftShort(displayTimeLeft)}</span>
            </div>
            <button type="button" onClick={() => router.push("/plans")} className="shrink-0 font-semibold text-[#FF5C00] hover:underline">
              Recharge Now &gt;
            </button>
          </div>
        )}

        {/* ── RTM / connection status ── */}
        {rtmStatus === "connecting" && (
          <div className="shrink-0 bg-[#FFF9F1] px-3 py-2 text-center text-xs text-[#FF5C00]">
            Connecting to chat...
          </div>
        )}
        {rtmStatus === "error" && (
          <div className="flex shrink-0 items-center justify-between gap-2 bg-red-50 px-3 py-2 text-xs text-red-600">
            <span>Chat connection failed.</span>
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => agoraRTM.reconnect()}
            >
              Retry
            </button>
          </div>
        )}
        {sendError && (
          <div className="shrink-0 bg-red-50 px-3 py-1.5 text-center text-xs text-red-500">{sendError}</div>
        )}

        {/* ── Messages ── */}
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="min-h-0 flex-1 overflow-y-auto bg-[#FFF9F1] px-3 py-4 sm:px-5"
        >
          {loadingOlder && (
            <p className="mb-3 text-center text-[11px] text-gray-400">Loading older messages...</p>
          )}
          {historyLoading && combinedMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-gray-500">Loading chat...</p>
            </div>
          ) : combinedMessages?.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE8D9]">
                <Smile className="h-8 w-8 text-[#FF5C00]" />
              </div>
              <p className="font-semibold text-[#1A1A1A]">Start your consultation</p>
              <p className="mt-1 text-xs text-gray-400">Messages are end-to-end private</p>
            </div>
          ) : (
            messageItems.map(({ item, showDate, dateLabel, key }) => {
              const isMine = item?.isMine || item?.sender === "You";
              const ts = item?.timestamp || item?.createdAt;
              const body = getMessageBody(item);
              const html = parseMessageWithLinks(body);

              return (
                <React.Fragment key={key}>
                  {showDate && (
                    <div className="my-4 flex justify-center">
                      <span className="rounded-full bg-gray-200/80 px-3 py-0.5 text-[11px] font-medium text-gray-500">{dateLabel === format(new Date(), "dd MMM yyyy") ? "Today" : dateLabel}</span>
                    </div>
                  )}
                  <div className={`mb-3 flex items-end gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}>
                    {!isMine && avatarSrc && (
                      <Image src={avatarSrc} alt="" width={32} height={32} className="mb-1 h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#FFE8D9]" unoptimized />
                    )}
                    <div className={`max-w-[min(78%,560px)] ${isMine ? "order-1" : ""}`}>
                      <div
                        className={`inline-block min-w-[72px] max-w-full rounded-2xl px-4 py-2.5 shadow-sm ${isMine
                          ? "rounded-br-md bg-[#FF5C00] text-white"
                          : "rounded-bl-md border border-[#FFD4B8] bg-[#FFE8D9] text-[#1A1A1A]"
                          }`}
                      >
                        {html.includes("<") ? (
                          <p
                            className={`whitespace-pre-wrap text-[14px] leading-relaxed break-words [&_a]:underline ${isMine ? "[&_a]:text-orange-100" : "[&_a]:text-[#FF5C00]"}`}
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-[14px] leading-relaxed break-words">{body}</p>
                        )}
                        <div className={`mt-0.5 flex items-center gap-1 ${isMine ? "justify-end" : "justify-start"}`}>
                          {ts && <span className={`text-[10px] ${isMine ? "text-orange-100" : "text-gray-400"}`}>{formatTime(ts)}</span>}
                          {isMine && item?.status === "failed" && (
                            <span className="text-[10px] text-red-200">Failed</span>
                          )}
                          {isMine && item?.status !== "failed" && (
                            <CheckCheck className={`h-3 w-3 ${item?.status === "sending" ? "text-orange-200" : "text-orange-100"}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Recharge strip (bottom) ── */}
        {showLowWalletBanner && (
          <div className="shrink-0 border-t border-red-100 bg-[#FFF5F5] px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <Wallet className="h-3.5 w-3.5" /> Wallet Balance: ₹{walletBalance}
                </p>
                <p className="text-[10px] text-red-400">Chat will end in less than {Math.max(1, Math.ceil(displayTimeLeft / 60))} minute{displayTimeLeft > 60 ? "s" : ""}.</p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/plans")}
                className="shrink-0 rounded-lg bg-red-500 px-2.5 py-2 text-[10px] font-bold leading-tight text-white hover:bg-red-600 sm:text-[11px]"
              >
                Recharge ₹99<br className="sm:hidden" /> Get ₹99 Extra
              </button>
            </div>
          </div>
        )}

        {/* ── Input row ── */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2">
            <button type="button" className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-gray-100" aria-label="Attach">
              <Paperclip className="h-5 w-5" />
            </button>
            {
              role === "astrologer" &&
              <div className="mt-2.5 flex justify-between gap-1 px-1">
                <button
                  type="button"
                  onClick={() => [setIsModalOpen(true)]}
                  className="flex flex-1 flex-col items-center gap-0.5 disabled:opacity-40"
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50`}>
                    <Star className={`h-4 w-4 text-amber-500`} />
                  </span>
                  <span className="text-[9px] font-medium text-gray-500">Kundli</span>
                </button>

              </div>
            }

            <div className="relative flex flex-1 items-center">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isInputDisabled ? (headerInfo?.chatStatus === "ended" ? "Chat has ended" : "Sending your details...") : "Type your message..."}
                disabled={isInputDisabled}
                className="max-h-[80px] w-full resize-none rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-[#1A1A1A] focus:border-[#FF5C00] focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:opacity-50"
                rows={1}
              />
              <button
                type="button"
                onClick={() => setShowEmoji((v) => !v)}
                className="absolute right-3 text-gray-400 hover:text-[#FF5C00]"
                aria-label="Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
              {showEmoji && (
                <div className="absolute bottom-full right-0 z-20 mb-2 flex gap-1 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="rounded p-1 text-lg hover:bg-orange-50"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); if (inputValue.trim()) handleSend(); }}
              disabled={!inputValue.trim() || isInputDisabled || isSending}
              className={`shrink-0 rounded-full p-2.5 transition ${inputValue.trim() && !isInputDisabled ? "bg-[#FF5C00] text-white shadow-md hover:opacity-90" : "bg-gray-100 text-gray-300"}`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Quick actions */}
          {/* <div className="mt-2.5 flex justify-between gap-1 px-1">
            {quickActions.map(({ icon: Icon, label, color, bg, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={isInputDisabled && label !== "Document"}
                className="flex flex-1 flex-col items-center gap-0.5 disabled:opacity-40"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </span>
                <span className="text-[9px] font-medium text-gray-500">{label}</span>
              </button>
            ))}
          </div> */}

          <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400">
            <Lock className="h-3 w-3" /> Your chat is secure and private
          </p>
        </div>
      </div>

      {/* End Chat Confirmation Modal */}
      {checkEndedChatPopup?.Message === "Are You Sure To End The Chat." && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-orange-100 bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-center text-lg font-semibold text-[#1A1A1A]">End Chat?</h2>
            <p className="mb-6 text-center text-sm text-gray-500">Are you sure you want to end this chat session?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (role === "astrologer") {
                    sessionStorage.setItem("AstrologerChatEnd", true);
                    setTimeout(() => { leaveRtmChannel(); roleData.setCheckEndedChat(null); }, 100);
                  } else {
                    leaveRtmChannel();
                  }
                }}
                className="flex-1 rounded-lg bg-[#FF5C00] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Yes, End
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-gray-200 bg-[#FFF9F1] py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-orange-50"
                onClick={() => roleData.setCheckEndedChat(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {checkEndedChatPopup?.Message === "Please wait for 1 Minutes" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 text-xl text-gray-400 hover:text-red-500"
              onClick={() => roleData.setCheckEndedChat(null)}
            >
              &times;
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE8D9] text-[#FF5C00]">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-bold text-[#1A1A1A]">Please wait</h2>
            <p className="mb-6 text-sm text-gray-500">
              Wait <span className="font-semibold text-[#FF5C00]">1 minute</span> before ending the chat.
            </p>
            <button type="button" onClick={() => roleData.setCheckEndedChat(null)} className="rounded-full bg-[#FF5C00] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90">
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Kundli Popup - Only for Astrologer */}
      {role === "astrologer" && (
        <ChatKundliPopUp
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}


