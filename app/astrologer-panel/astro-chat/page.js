"use client";
import { useState, useEffect, useRef } from "react";
import socketService from "@/app/services/socketService";
import { useRouter } from "next/navigation";
import ChatUI from "@/app/components/chat/ChatUI";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import ChatKundliPopUp from "@/app/components/ChatKundliPopUp";
import { CgAdd } from "react-icons/cg";
import Image from "next/image";

export default function AstroChat() {

  const AstroId = typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") : "";
  const router = useRouter();

  const { loginAstrologerData, astroParsedData, setAstroParsedData, setAstrologerToggleStatus, setAstroCheckEndedChat, callPopupData, setcallPopupData } = useMenuContext();

  const [playSound, setPlaySound] = useState(false);
  const [isPopUPOpen, setIsPopupOpen] = useState(false);
  const [showPopupCall, setshowPopupCall] = useState(false);
  // const [callPopupData, setcallPopupData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Basic");

  // console.log(astroParsedData, 'astroparsdata')
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [popupAceept, setpopupAceept] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const messagesEndRef = useRef(null);




  useEffect(() => {

    if (AstroId) {
      socketService.connectAstro(AstroId);
    }
    socketService.setAstroListener((messageData) => {
      // Handle chat messages when chat interface is open
      if (messageData?.Type === "chat" && messageData?.Message) {
        setChatMessages(prev => [...prev, {
          sender: messageData.UserName || "User",
          text: messageData.Message,
          timestamp: new Date().toISOString()
        }]);
      }

      handleAstroMessages(messageData);
    });
  }, [AstroId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);



  const handleAstroMessages = (messageData) => {
    const msg = messageData?.Message;

    switch (msg) {

      // 🔥 NEW CHAT REQUEST
      case "Please Accept Request":
        setAstroParsedData(messageData);
        setPlaySound(true);
        setTimeout(() => setPlaySound(false), 100);
        setShowChatPopup(true);
        setpopupAceept(false);
        router.push(`/astrologer-panel/dashboard`);
        break;


      case "User Chat is Live.":
      case "User Chat is Live":
        setAstroParsedData(messageData);
        setShowChatPopup(true);
        setCurrentChannel(messageData?.ChannelName);
        break;


      case "Sorry Amount greater than or equal to 5 min":
        setAstroParsedData(messageData);
        setIsPopupOpen(true);
        break;


      case "Accepted":
        setAstroParsedData(messageData);
        setShowChatPopup(false);
        setCurrentChannel(messageData?.ChannelName);



        // Update URL with channel ID
        if (messageData?.ChannelName) {
          router.push(`/astrologer-panel/astro-chat/chat?channel=${messageData.ChannelName}&AstroChatTokenId=${encodeURIComponent(messageData?.AstroChatTokenId || '')}&WaitingListId=${encodeURIComponent(messageData?.WaitingListId || '')}&AstroId=${encodeURIComponent(messageData?.AstroId || '')}&UserId=${encodeURIComponent(messageData?.UserId)}`);
        }
        break;


      case "Chat Completed":
        sessionStorage.setItem("AstroChatCompleted", "Chat Completed");
        // setAstroChatCompleted("Chat Completed");
        setAstroParsedData(messageData);
        setShowChatPopup(false);
        setChatMessages([]);
        setpopupAceept(false)
        break;


      case "Astro Cancel Request":
        setAstroParsedData(null);
        setShowChatPopup(false);
        break;


      case "Waiting List Deleted":
      case "CancelWaitingListDeleted":
        setAstroParsedData(null);
        setpopupAceept(false);
        setShowChatPopup(false);
        setshowPopupCall(false);
        setcallPopupData(null)
        setpopupAceept(false)
        break;


      case "Please Wait For 1 Minutes":
        setAstroParsedData(null);
        break;


      case "Call is Processing":
        setcallPopupData(messageData);
        setshowPopupCall(true);
        router.push("/astrologer-panel/dashboard");
        // setAcceptedUser(false);
        // navigate("/dashboard");
        break;

      case "Removed call Message":
        setcallPopupData(null);
        setshowPopupCall(false);
        setpopupAceept(false)
        break;


      case "Astro Request Accepted":
        setpopupAceept(true);
        setAstroParsedData(messageData);
        setShowChatPopup(false);

        break;

      // ⚠️ BUSY
      case "This Astrologer is Busy":
        if (messageData?.BusyType === '1') {
          setpopupAceept(true);
          setAstroParsedData(messageData);
          setShowChatPopup(true);
        }
        break;

      // 🟢 ONLINE/OFFLINE
      case "This Astrologer is Online":
        setAstrologerToggleStatus(messageData);
        break;

      case "This Astrologer is Offline":
        setAstrologerToggleStatus(messageData);
        break;

      // 💰 BALANCE OVER
      case "Please Disconnect the Chat User Balance is Over":
        setAstroParsedData(messageData);
        sessionStorage.setItem("AstroChatCompleted", "Chat Completed");
        setAstroCalculateTime("");
        setShowChatPopup(false);
        localStorage.removeItem("AstroChatTokenId");
        break;

      // ❓ END CHAT CONFIRM
      case "Please wait for 1 Minutes":
      case "Are You Sure To End The Chat.":
        setAstroCheckEndedChat(messageData);
        break;

      default:
        // console.log("📩 Unhandled:", msg);
        break;
    }
  };


  const accept_Chat_Request = () => {
    socketService.sendAstro({
      AstroId: `WA${astroParsedData?.AstroId}`,
      UserId: `WU${astroParsedData?.UserId}`,
      Status: "AstroBusy",
      OnlineType: "1",
      BusyType: "0",
      Type: "chat",
      Message: "Please Accept Request",
      ChannelName: astroParsedData?.ChannelName,
      WaitingListId: astroParsedData?.WaitingListId,
      CalculateTime: astroParsedData?.CalculateTime,
      AstroName: astroParsedData?.AstroName,
      Rate: astroParsedData?.Rate,
      AvatarUrl: astroParsedData?.AvatarUrl,
      ChatUserBioID: astroParsedData?.ChatUserBioID,
      messageId: "NewRequest",
    });
  };

  const AstroCancelRequest = () => {
    if (astroParsedData && AstroId) {
      socketService.sendAstro({
        UserId: `WA${AstroId}`,
        Status: "Cancel",
        Type: "chat",
        ToUser: astroParsedData?.UserId,
        WaitingListId: astroParsedData?.WaitingListId,
      });

      // Close popup and reset state
      setShowChatPopup(false);
      setAstroParsedData(null);
      setpopupAceept(false);
      localStorage.removeItem("AstroChatTokenId");
    }
  };

  const reject_Chat_Request = async () => {
    socketService.sendAstro({
      UserId: `WA${astroParsedData?.AstroId}`,
      AstroId: `WU${astroParsedData?.UserId}`,
      Status: "RejectType",
      AstroName: loginAstrologerData?.FirstName,
      Rate: loginAstrologerData?.PricePerMin,
      messageId: "NewRequest"
    });
  };


  const HandleJoinChatUser = () => {
    if (astroParsedData?.Message === "User Chat is Live" || astroParsedData?.Message === "User Chat is Live.") {
      router.push(`/astrologer-panel/astro-chat/chat?channel=${astroParsedData.ChannelName}&AstroChatTokenId=${encodeURIComponent(astroParsedData?.AstroChatTokenId || '')}&WaitingListId=${encodeURIComponent(astroParsedData?.WaitingListId || '')}&AstroId=${encodeURIComponent(astroParsedData?.AstroId || '')}&UserId=${encodeURIComponent(astroParsedData?.UserId)}`);
    }
  }

  return (
    <>
      {showChatPopup && astroParsedData && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 mb-6 bg-orange-300 rounded-2xl shadow-xl p-4">
            <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
              Chat Request
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <Image
                src={astroParsedData?.ProfilePic ? `https://${astroParsedData?.ProfilePic?.replace(/\\/g, "/")}` : ""}
                alt="Profile"
                loading="lazy"
                decoding="async"
                className="rounded-full object-cover border border-gray-300"
                width={64}
                height={64}
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{astroParsedData?.UserName}</h3>
                {
                  astroParsedData?.IsChatProgress === '1' || astroParsedData?.IsChatProgress === 1 ?
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="text-green-700 font-semibold">{astroParsedData?.Message}</span>
                    </p>
                    :
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="text-red-600 font-semibold">Message:</span> Please accept the request.
                    </p>
                }
              </div>
            </div>

            <div className="flex gap-3">
              {
                astroParsedData?.IsChatProgress === '1' || astroParsedData?.IsChatProgress === 1 || astroParsedData?.Message === "Accepted" ? <>
                  <button
                    onClick={() => { HandleJoinChatUser() }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
                  >
                    Join Chat
                  </button>
                </>
                  :
                  <>
                    <button
                      onClick={() => {
                        accept_Chat_Request();
                        sessionStorage.removeItem("AstroChatCompleted")
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => {
                        reject_Chat_Request();
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
                    >
                      Reject
                    </button>
                  </>
              }
            </div>
          </div>
        </div>
      )}

      {popupAceept && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 mb-6 bg-orange-300 rounded-2xl shadow-xl p-4 pointer-events-auto animate-slide-up">
            <div className="flex items-center gap-4 mb-5">
              <Image
                src={astroParsedData?.ProfilePic ? `https://${astroParsedData?.ProfilePic?.replace(/\\/g, "/")}` : profilepic}
                alt="Profile"
                loading="lazy"
                decoding="async"
                className="rounded-full object-cover border border-gray-600 shadow"
                width={64}
                height={64}
              />
              <div>
                <h3 className="text-lg font-semibold text-black"> {astroParsedData?.UserName}</h3>
                <p className="text-sm text-black"> Waiting for user to accept your request...</p>
                <p className="text-xs text-black">This may take a few moments.</p>
              </div>
            </div>

            {
              astroParsedData?.Message === "Astro Cancel Request" && (
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition duration-200"
                    onClick={() => { AstroCancelRequest(); }}
                  >
                    Cancel Request
                  </button>
                </div>
              )
            }
          </div>
        </div>
      )}

      {showPopupCall && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-sm w-full animate-fadeIn scale-100 z-10">
            <img
              src={
                callPopupData?.ProfilePic
                  ? `https://${callPopupData?.ProfilePic?.replace(/\\/g, "/")}`
                  : profilepic
              }
              className="w-20 h-20 rounded-full border-4 border-orange-500 shadow-md object-cover"
            />

            <h2 className="mt-3 text-xl font-semibold text-gray-800"> {callPopupData?.UserName} </h2>

            <p className="text-gray-600 mt-2 text-center">
              Your call has started with{" "}
              <span className="font-medium text-orange-600">  {callPopupData?.UserName} </span>
              .
            </p>

            <div className="mt-4 text-orange-600 animate-pulse text-sm font-medium"> 📞 Connecting Live...  </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all duration-300"
            >
              Open Kundli
            </button>
          </div>

          <ChatKundliPopUp
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      )}
    </>
  );
}