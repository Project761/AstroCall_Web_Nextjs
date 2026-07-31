"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import socketService from "@/app/services/socketService";
import { useRouter } from "next/navigation";
import { useMenuContext } from "@/app/hooks/useMenuContext";      
import ChatKundliPopUp from "@/app/components/ChatKundliPopUp";
import { CgAdd } from "react-icons/cg";
import Image from "next/image";

export default function AstroChatWidget() {

  const router = useRouter();
  const { loginAstrologerData, GetAstroLoginId, astroParsedData, setAstroParsedData, setAstrologerToggleStatus, setAstroCheckEndedChat, callPopupData, setcallPopupData, AstroCalculateTime, setAstroCalculateTime } = useMenuContext();
  const AstroId = GetAstroLoginId || (typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") : "");

  const [playSound, setPlaySound] = useState(false);
  const [isPopUPOpen, setIsPopupOpen] = useState(false);
  const [showPopupCall, setshowPopupCall] = useState(false);
  // const [callPopupData, setcallPopupData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Basic");

  // console.log(astroParsedData, 'astroparsdata')
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [popupAceept, setpopupAceept] = useState(false);

  const handleAstroMessages = useCallback((messageData) => {
    const msg = messageData?.Message;
    console.log("📩 Received WebSocket message:", messageData);
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

      case "Astro Rejected Request":
        setAstroParsedData(null);
        setShowChatPopup(false);
        setpopupAceept(false);
        break;


      case "User Chat is Live.":
      case "User Chat is Live":
        setAstroParsedData(messageData);
        setShowChatPopup(true);
        setpopupAceept(false)

        break;


      case "Time":
        setAstroCalculateTime(messageData?.CalculateTime);
        break;

      case "Sorry Amount greater than or equal to 5 min":
        setAstroParsedData(messageData);
        setIsPopupOpen(true);
        break;


      case "Accepted":
        setAstroParsedData(messageData);
        setShowChatPopup(false);
        setpopupAceept(false)

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
  }, [router, setAstroCalculateTime, setAstroCheckEndedChat, setAstroParsedData, setAstrologerToggleStatus, setcallPopupData]);

  const handleAstroMessagesRef = useRef(handleAstroMessages);
  useEffect(() => {
    handleAstroMessagesRef.current = handleAstroMessages;
  }, [handleAstroMessages]);

  useEffect(() => {
    if (!AstroId) return;

    const unsubscribe = socketService.addAstroListener((messageData) => {
      handleAstroMessagesRef.current(messageData);
    });

    return () => {
      unsubscribe();
    };
  }, [AstroId]);


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
      setTimeout(() => {
        router.push(`/astrologer-panel/astro-chat/chat?channel=${astroParsedData.ChannelName}&AstroChatTokenId=${encodeURIComponent(astroParsedData?.AstroChatTokenId || '')}&WaitingListId=${encodeURIComponent(astroParsedData?.WaitingListId || '')}&AstroId=${encodeURIComponent(astroParsedData?.AstroId || '')}&UserId=${encodeURIComponent(astroParsedData?.UserId)}`);
      }, 5000);
      setShowChatPopup(false);
    }
  }

  return (
    <>
      {showChatPopup && astroParsedData && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center px-4 pb-5 ${astroParsedData?.Message === "Please Accept Request" ||
            astroParsedData?.Message === "User Chat is Live." ||
            astroParsedData?.Message === "User Chat is Live"
            ? "bg-black/20"
            : "pointer-events-none"
            }`}
        >
          <div className="pointer-events-auto w-full max-w-[340px]">
            <div className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] p-4 shadow-[0_20px_60px_rgba(0,0,0,.45)]">

              {/* Glow */}
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-orange-500/10 blur-3xl"></div>

              <div className="flex items-center gap-3">

                {/* Profile */}
                <div className="relative shrink-0">
                  <Image
                    src={
                      astroParsedData?.ProfilePic
                        ? `https://${astroParsedData?.ProfilePic.replace(/\\/g, "/")}`
                        : ""
                    }
                    alt="Profile"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-2 border-orange-400 object-cover"
                  />

                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0F172A] bg-green-500"></span>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-white">
                    {astroParsedData?.UserName}
                  </h3>

                  <p className="mt-1 text-xs text-gray-300">
                    {astroParsedData?.IsChatProgress === "1" ||
                      astroParsedData?.IsChatProgress === 1
                      ? "💬 User is waiting..."
                      : "New Chat Request"}
                  </p>

                  <p className="mt-1 text-xs font-medium text-orange-400">
                    {astroParsedData?.IsChatProgress === "1" ||
                      astroParsedData?.IsChatProgress === 1
                      ? astroParsedData?.Message
                      : "Please accept the request"}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                {astroParsedData?.IsChatProgress === "1" ||
                  astroParsedData?.IsChatProgress === 1 
                  // || astroParsedData?.Message === "Accepted"
                   ? (
                  <button
                    onClick={HandleJoinChatUser}
                    className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
                  >
                    Join Chat
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        accept_Chat_Request();
                        sessionStorage.removeItem("AstroChatCompleted");
                      }}
                      className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
                    >
                      Accept
                    </button>

                    <button
                      onClick={reject_Chat_Request}
                      className="flex-1 rounded-lg border border-red-400 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {popupAceept && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-5">
          <div className="pointer-events-auto w-full max-w-[340px]">
            <div className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] p-4 shadow-[0_20px_60px_rgba(0,0,0,.45)]">

              {/* Glow Effect */}
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-orange-500/10 blur-3xl"></div>

              <div className="flex items-center gap-3">

                {/* Profile */}
                <div className="relative shrink-0">
                  <Image
                    src={
                      astroParsedData?.ProfilePic
                        ? `https://${astroParsedData?.ProfilePic.replace(/\\/g, "/")}`
                        : ""
                    }
                    alt="Profile"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-2 border-orange-400 object-cover"
                  />

                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#0F172A] bg-yellow-400"></span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-white">
                    {astroParsedData?.UserName}
                  </h3>

                  <p className="mt-1 text-xs text-gray-300">
                    Waiting for user...
                  </p>

                  <p className="mt-1 text-xs font-medium text-orange-400">
                    Waiting for user to accept your request.
                  </p>

                  <p className="mt-1 text-[11px] text-gray-400">
                    This may take a few moments.
                  </p>
                </div>
              </div>

              {/* Loader */}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500"></div>
              </div>

              {/* Cancel Button */}
              {astroParsedData?.Message === "Astro Cancel Request" && (
                <button
                  onClick={AstroCancelRequest}
                  className="mt-4 w-full rounded-lg border border-red-400 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showPopupCall && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-sm w-full animate-fadeIn scale-100 z-10">
            <img
              // src={
              //   callPopupData?.ProfilePic
              //     ? `https://${callPopupData?.ProfilePic?.replace(/\\/g, "/")}`
              //     : profilepic
              // }
              src={
                callPopupData?.ProfilePic
                  ? `https://${callPopupData.ProfilePic.replace(/\\/g, "/")}`
                  : "/images/profile pic.webp"
              }
              className="h-20 w-20 rounded-full border-4 border-[#FF5C00] object-cover shadow-md"
            />

            <h2 className="mt-3 text-xl font-semibold text-gray-800"> {callPopupData?.UserName} </h2>

            <p className="text-gray-600 mt-2 text-center">
              Your call has started with{" "}
              <span className="font-medium text-[#FF5C00]">  {callPopupData?.UserName} </span>
              .
            </p>

            <div className="mt-4 animate-pulse text-sm font-medium text-[#FF5C00]"> 📞 Connecting Live...  </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 rounded-full bg-[#FF5C00] px-5 py-2 font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#E85500]"
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