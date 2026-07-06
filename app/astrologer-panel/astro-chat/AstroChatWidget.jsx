"use client";
import { useState, useEffect, useCallback } from "react";
import socketService from "@/app/services/socketService";
import { useRouter } from "next/navigation";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import ChatKundliPopUp from "@/app/components/ChatKundliPopUp";
import { CgAdd } from "react-icons/cg";
import Image from "next/image";

export default function AstroChatWidget() {

  const AstroId = typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") : "";
  const router = useRouter();

  const { loginAstrologerData, astroParsedData, setAstroParsedData, setAstrologerToggleStatus, setAstroCheckEndedChat, callPopupData, setcallPopupData, AstroCalculateTime, setAstroCalculateTime } = useMenuContext();

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

  useEffect(() => {
    if (!AstroId) return;

    socketService.connectAstro(AstroId);
    socketService.setupVisibilityHandler(null, AstroId);

    const unsubscribe = socketService.addAstroListener((messageData) => {
      handleAstroMessages(messageData);
    });

    return () => {
      unsubscribe();
    };
  }, [AstroId, handleAstroMessages]);


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
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4">
          <div className="w-full max-w-md rounded-2xl border border-orange-100 bg-white p-5 shadow-xl mb-2">
            <h2 className="mb-4 text-center text-lg font-bold text-[#1A1A1A]">
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
                    className="flex-1 rounded-lg bg-[#FF5C00] py-2.5 font-medium text-white transition hover:opacity-90"
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
                      className="flex-1 rounded-lg bg-[#FF5C00] py-2.5 font-medium text-white transition hover:opacity-90"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => {
                        reject_Chat_Request();
                      }}
                      className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2.5 font-medium text-red-600 transition hover:bg-red-100"
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20">
          <div className="w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-5 shadow-xl mb-2">
            <div className="flex items-center gap-4 mb-5">
              <Image
                src={astroParsedData?.ProfilePic ? `https://${astroParsedData?.ProfilePic?.replace(/\\/g, "/")}` : ""}
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
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-sm w-full animate-fadeIn scale-100 z-10">
            <img
              src={
                callPopupData?.ProfilePic
                  ? `https://${callPopupData?.ProfilePic?.replace(/\\/g, "/")}`
                  : profilepic
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