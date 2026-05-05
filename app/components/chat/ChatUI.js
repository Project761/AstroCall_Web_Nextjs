"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import socketService from "@/app/services/socketService";
import agoraRTM from "@/app/services/agoraRTMService";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { FiSend, FiPaperclip, FiSmile, FiMic, FiPhone, FiVideo, FiMoreVertical, FiInfo } from "react-icons/fi";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import { LiaAwardSolid } from "react-icons/lia";
import { IoLanguage } from "react-icons/io5";
import { MdOutlineCases, MdVerified } from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { FaSortAmountDown } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function ChatUI({
  role = "user" // "user" or "astrologer"
}) {
  const router = useRouter();
  const params = useSearchParams();
  const { popupData, setPopupData, UserCheckEndedChat, setUserCheckEndedChat, loginAstrologerData, astroParsedData, astroCheckEndedChat, setAstroCheckEndedChat } = useMenuContext();

  const getRoleData = () => {
    if (role === "astrologer") {
      return {
        loginId: localStorage.getItem("AstroLoginId"),
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
        loginId: localStorage.getItem("UserLoginId"),
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

  // States
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [waitingListCheck, setWaitingListCheck] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '💫', '🔮', '🌟'];
  const quickMessages = ['Hello!', 'How are you?', 'Thank you', 'Good bye'];

  // Format message function
  const formatMessage = (msg, isMine = false) => ({
    isMine,
    message: msg?.Message || msg?.text || "",
    sender: msg?.UserName || (isMine ? "You" : roleData.userName),
    createdAt: msg?.createdAt || new Date().toISOString(),
    timestamp: msg?.timestamp || new Date().toISOString()
  });

  // Fetch chat history
  const fetchChatHistory = async () => {
    if (!roleData.contextData || !channel) return;

    try {
      const payload = {
        UserID: role === "user" ? roleData.contextData?.UserLoginId : roleData.contextData?.UserId,
        AstroID: role === "user" ? roleData.contextData?.AstroId : roleData.contextData?.AstroId,
      };
      const res = await postWithToken("Chat/ReturnChat", payload);
      if (res) {
        const FilterChat = res?.filter((item) => item?.ChannelName?.trim() === channel?.trim());
        if (FilterChat?.length > 0) {
          const formatted = FilterChat?.map(msg =>
            formatMessage(
              {
                Message: msg.Message,
                UserName: msg.IsfromAstro ? "Astrologer" : "User",
                createdAt: msg.DateTimes,
                timestamp: msg.DateTimes
              },
              role === "user" ? !msg.IsfromAstro : msg.IsfromAstro
            )
          );
          setChatHistory(formatted);
        }
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Initialize RTM
  useEffect(() => {
    if (!channel || !roleData.token || !roleData.loginId) return;

    let isMounted = true;

    const initRTM = async () => {
      await agoraRTM.init({
        appId: "6b24a712e983467b9ace351f51518f08",
        uid: `${roleData.uidPrefix}${roleData.loginId}`,
        channelName: channel,
        token: roleData.token,
        onMessage: (msg) => {
          setMessages(prev => [
            ...prev,
            formatMessage(
              msg,
              role === "user" ? msg?.UserName === "User" : false
            )
          ]);
        },
        onReady: () => {
          setIsReady(true);
        }
      });
    };

    initRTM();

    return () => {
      isMounted = false;
      agoraRTM.leave();
    };
  }, [channel, roleData.token, roleData.loginId, role]);

  // Fetch chat history when data is available
  useEffect(() => {
    if (roleData.contextData && channel) {
      fetchChatHistory();
    }
  }, [roleData.contextData, channel]);

  // Fetch waiting list for user
  useEffect(() => {
    if (role === "user" && roleData.loginId) {
      fetchWaitingList();
    }
  }, [roleData.loginId]);

  const fetchWaitingList = async () => {
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
  };

  // Send message function
  const sendMessage = async (text) => {
    if (!agoraRTM.isChannelJoined) {
      console.warn("⏳ RTM not ready");
      return;
    }

    // UI update
    setMessages((prev) => [
      ...prev,
      formatMessage({ Message: text }, true)
    ]);

    // RTM
    agoraRTM.sendMessage({
      Message: text,
      UserName: roleData.userName
    });

    // Socket
    // roleData.socketService({
    //   Type: "chat",
    //   Message: text,
    //   ChannelName: channel,
    // });

    if (role === "user") {
      roleData.socketService.sendUser({
        Type: "chat",
        Message: text,
        ChannelName: channel,
      });
    } else {
      roleData.socketService.sendAstro({
        Type: "chat",
        Message: text,
        ChannelName: channel,
      });
    }

    // Database insert
    await insertChat(text);
  };

  // Insert chat to database
  const insertChat = async (text) => {
    try {
      const val = {
        ChannelName: channel,
        UserID: role === "user" ? roleData.loginId : roleData.contextData?.UserId,
        AstroID: role === "user" ? roleData.contextData?.AstroId : roleData.contextData?.AstroId,
        IsfromAstro: role === "astrologer",
        Message: text,
        WaitingListId: WaitingListId,
        chatOrderId: WaitingListId
      };
      await TokenWithDeleteUpadateAdd("Chat/InsertChat", val);
    } catch (error) {
      console.log("InsertChat Error:", error);
    }
  };

  // Navigation functions
  const handleBack = () => {
    router.push(roleData.backRoute);
    if (role === "astrologer") {
      sessionStorage.setItem("UserAccepted", '');
      sessionStorage.removeItem("AstroChatCompleted");
      sessionStorage.removeItem("UserAccepted");
      localStorage.removeItem("AstroChatTokenId");
    }
  };

  // const checkEnded = () => {
  //   if (roleData.contextData) {
  //     roleData.socketService({
  //       UserId: `WU${roleData.contextData?.UserId}`,
  //       AstroId: `WA${roleData.contextData?.AstroId}`,
  //       Status: "CheckEnded",
  //       ReceivedMessageState: role === "user" ? "U" : "A",
  //       messageId: "NewRequest",
  //     });
  //   }
  // };

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

  // const chatCompleted = () => {
  //   if (roleData.contextData) {
  //     roleData.socketService({
  //       UserId: `WU${roleData.contextData?.UserId}`,
  //       AstroId: `WA${roleData.contextData?.AstroId}`,
  //       Status: "Completed",
  //       Type: "chat",
  //       AstroName: roleData.contextData?.AstroName,
  //       AvatarUrl: roleData.contextData?.AvatarUrl,
  //       messageId: "NewRequest",
  //     });
  //   }
  // };

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

  // Combine messages
  const combinedMessages = [
    ...(chatHistory || []),
    ...(messages || [])
  ];

  // Get header info based on role
  const getHeaderInfo = () => {
    if (role === "astrologer") {
      return {
        name: roleData.contextData?.UserName || "User",
        avatar: roleData.contextData?.AvatarUrl,
        isOnline: true,
        rate: null,
        showEndButton: roleData.contextData?.Message !== "Chat Completed",
        chatStatus: roleData.contextData?.Message === "Chat Completed" ? "ended" : "active"
      };
    } else {
      return {
        name: roleData.contextData?.AstroName || "Astrologer",
        avatar: roleData.contextData?.AvatarUrl,
        isOnline: roleData.contextData?.Message !== "Chat Completed",
        rate: roleData.contextData?.Rate,
        showEndButton: waitingListCheck && roleData.contextData?.Message !== "Chat Completed",
        chatStatus: roleData.contextData?.Message === "Chat Completed" ? "ended" : "active"
      };
    }
  };

  const headerInfo = getHeaderInfo();
  const checkEndedChatPopup = roleData.checkEndedChat || null;


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [combinedMessages]);

  // Handle emoji select
  const handleEmojiSelect = (emoji) => {
    setInputValue(prev => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  // Handle send message
  const handleSend = () => {
    const message = inputValue.trim();
    if (message) {
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

  // Parse message with links
  const parseMessageWithLinks = (message) => {
    if (!message) return '';
    let parsedMessage = message.replace(/\n/g, "<br />");

    // Parse GEMSTONE links
    parsedMessage = parsedMessage.replace(
      /#GEMSTONE:([^:]+):([^:]+):([^:]+):([^:]+)/g,
      (match, id, name, price, image) => {
        return `<span style="color: #2563eb; text-decoration: underline; cursor: pointer; font-weight: 600;" onclick="window.handleGemstoneClick('${id}', '${name}', '${price}', '${image}')">🔮 View Gemstone</span>`;
      }
    );

    // Parse PUJA links
    parsedMessage = parsedMessage.replace(
      /#PUJA:([^:]+):([^:]+):([^:]+):([^:]+)/g,
      (match, id, name, price, image) => {
        return `<span style="color: #2563eb; text-decoration: underline; cursor: pointer; font-weight: 600;" onclick="window.handlePujaClick('${id}', '${name}', '${price}', '${image}')">🙏 View Puja</span>`;
      }
    );

    return parsedMessage;
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-[80vw] h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden z-10">
        {/* Header */}
        {/* className="flex flex-col h-full max-h-full bg-gradient-to-b from-orange-50/50 to-white overflow-hidden" */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 overflow-hidden">
              {headerInfo?.avatar ? (
                <img
                  src={`https://${headerInfo.avatar.replace(/\\/g, "/")}`}
                  alt={headerInfo?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {role === "astrologer" ? "U" : "A"}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {headerInfo?.name ||
                  (role === "astrologer" ?
                    (astroParsedData?.UserName || "User") :
                    (popupData?.AstroName || "Astrologer")
                  )
                }
              </h2>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <span className={`w-2.5 h-2.5 rounded-full ${headerInfo?.isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}></span>
                <span className="font-medium">
                  {headerInfo?.isOnline ? "Online" : "Offline"}
                </span>
                {role === "user" && headerInfo?.rate && (
                  <span className="border-l border-white/30 pl-2">
                    ₹{headerInfo.rate}/min
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {headerInfo?.showEndButton && headerInfo?.chatStatus !== "ended" ? (
              <button
                onClick={checkEnded}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                END
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="bg-black hover:bg-gray-900 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ height: 'calc(80vh - 140px)' }}>
          {combinedMessages?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FiSmile className="text-3xl text-orange-500" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">No messages yet</p>
              <p className="text-gray-400 text-sm">Start the conversation with a friendly greeting!</p>
            </div>
          ) : (
            combinedMessages?.map((item, i) => {
              const isMine = item?.isMine || item?.sender === "You";

              return (
                <div
                  key={`msg-${i}-${item?.message?.slice(0, 10)}`}
                  className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                >
                  {!isMine && (
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-xs font-bold">
                        {item?.sender ? item?.sender?.charAt(0)?.toUpperCase() : "U"}
                      </span>
                    </div>
                  )}

                  <div className="max-w-xs lg:max-w-md">
                    <div
                       className={`px-4 py-3 rounded-2xl shadow-sm ${isMine
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm shadow-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                        }`}
                    >
                      <p
                        className="text-sm leading-relaxed break-words"
                        dangerouslySetInnerHTML={{
                          __html: parseMessageWithLinks(item?.message || item?.text)
                        }}
                      />
                      {(item?.timestamp || item?.createdAt) && (
                        <p className={`text-xs mt-1 ${isMine ? "text-orange-100" : "text-gray-400"
                          }`}>
                          {formatTime(item?.timestamp || item?.createdAt)}
                        </p>
                      )}
                    </div>

                    {!isMine && item?.sender && (
                      <p className="text-xs text-gray-500 mt-1 ml-1">{item?.sender}</p>
                    )}
                  </div>

                  {isMine && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">Y</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
          <div className="flex gap-2 mb-3 justify-center flex-wrap">
            {quickMessages.slice(0, 4).map((quickMsg, index) => (
              <button
                key={index}
                onClick={() => {
                  sendMessage(quickMsg);
                  setInputValue("");
                }}
                disabled={headerInfo?.chatStatus === "ended"}
                className="px-3 py-1.5 text-xs bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors duration-200 font-medium border border-orange-100 disabled:opacity-50"
              >
                {quickMsg}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <button
              className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all duration-200 disabled:opacity-50"
              title="Attach file"
              disabled={headerInfo?.chatStatus === "ended"}
            >
              <FiPaperclip className="text-xl" />
            </button>

            <button
              className={`p-3 rounded-full transition-all duration-200 ${"text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                } disabled:opacity-50`}
              title="Voice message"
              disabled={headerInfo?.chatStatus === "ended"}
            >
              <FiMic className="text-xl" />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={headerInfo?.chatStatus === "ended" ? "Chat has ended" : "Type your message..."}
                disabled={headerInfo?.chatStatus === "ended"}
                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={1}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
              />

              <div className="relative">
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  disabled={headerInfo?.chatStatus === "ended"}
                  className="absolute right-3 bottom-3 p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all duration-200 disabled:opacity-50"
                  title="Add emoji"
                >
                  <FiSmile className="text-lg" />
                </button>

                {showEmoji && (
                  <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-4 gap-2 z-10">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-1.5 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || headerInfo?.chatStatus === "ended"}
              className={`p-3 rounded-full transition-all duration-200 ${inputValue.trim() && headerInfo?.chatStatus !== "ended"
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transform hover:scale-105 shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              title="Send message"
            >
              <FiSend className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* End Chat Confirmation Modal */}
      {checkEndedChatPopup?.Message === "Are You Sure To End The Chat." && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 border border-orange-300">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
              End Chat Confirmation
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">Are you sure you want to end the chat?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (role === "astrologer") {
                    sessionStorage.setItem("AstrologerChatEnd", true);
                    setTimeout(() => { leaveRtmChannel(); roleData.setCheckEndedChat(null); }, 100);
                  } else {
                    leaveRtmChannel();
                  }
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
              >
                Yes, End
              </button>
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2.5 rounded-lg shadow-md transition"
                onClick={() => roleData.setCheckEndedChat(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wait Modal */}
      {checkEndedChatPopup?.Message === "Please wait for 1 Minutes" && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="flex items-center justify-center h-full w-full pointer-events-none px-4">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-orange-300 text-center pointer-events-auto">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                onClick={() => roleData.setCheckEndedChat(null)}
              >
                &times;
              </button>
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 text-orange-500 rounded-full p-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">End Chat Confirmation</h2>
              <p className="text-sm text-gray-600 mb-6">
                Please wait for <span className="font-medium text-orange-500">1 minute</span> before ending the chat.
              </p>
              <button onClick={() => roleData.setCheckEndedChat(null)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition duration-300">
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


