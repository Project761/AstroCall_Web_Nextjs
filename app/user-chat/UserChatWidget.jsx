
"use client";
import socketService from "@/app/services/socketService";
import { useEffect, useState, useCallback, useRef } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toastifySuccess } from "../utils/utility";
import { useRouter } from "next/navigation";
import { FiMinimize } from "react-icons/fi";
import Image from "next/image";
import { useMenuContext } from "../hooks/useMenuContext";
import ReviewPopup from "@/app/components/ReviewPopup";
import { getStoredUserId, hasUserAuthSession } from "@/app/lib/wsUrl";

const ss = {
  set: (key, value) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  },
  get: (key) => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  remove: (key) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  },
};

export default function UserChatWidget() {

  const router = useRouter();
  const { popupData, setPopupData, setUserCheckEndedChat, Get_SingleData_User, userCalculateTime, setUserCalculateTime, BusyTimes, setBusyTimes, UserLoginId, isLogin } = useMenuContext();
  const [ChatPopUpStatus, setChatPopUpStatus] = useState(false);
  const [userMessage, setUsermessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [twominchatpopup, settwominchatpopup] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  const handleUserMessages = useCallback((data) => {
    console.log("📩 Handling WebSocket message:", data);
    switch (data?.Message) {

      case "Please Accept Request":
        ss.remove("UserChatCompleted");
        setChatPopUpStatus(true);
        setUsermessage(data?.Message);
        setPopupData(data);
        break;

      case "Record Add in Waiting list":
        const RecordAdd = 'Record Add in Waiting list';
        setUsermessage(RecordAdd);
        setPopupData(data);
        setChatPopUpStatus(true);
        ss.remove("UserChatCompleted");
        ss.set("requestSentTime", Date.now());
        break;

      case "Time":
        setUserCalculateTime(data?.CalculateTime);
        break;

      case "Sorry your Record is add in WaitingList.":

        const RecordAdd1 = 'Sorry your Record is add in WaitingList.';
        setUsermessage(RecordAdd1);
        setPopupData(data);
        setChatPopUpStatus(true);
        ss.set("requestSentTime", Date.now());
        break;

      case "Sorry Amount greater than or equal to 5 min":
        // setCallstatus(true)
        setPopupData(data);

        break;

      case "User Chat is Start":
        const ChatStartUser = 'User Chat is Start';
        setUsermessage(ChatStartUser);
        setPopupData(data);
        setChatPopUpStatus(true);
        router.push(`/user-chat/chat?channel=${encodeURIComponent(data?.ChannelName || '')}&UserChatTokenId=${encodeURIComponent(data?.UserChatTokenId || '')}&WaitingListId=${encodeURIComponent(data?.WaitingListId || '')}&UserId=${encodeURIComponent(data?.UserId)}&AstroId=${encodeURIComponent(data?.AstroId || '')}`);
        break;

      case "CancelRequest":
        const cancelMsg = 'Astrologer rejected your request please Try again.';
        setUsermessage(cancelMsg);
        setPopupData(data);
        break;

      case "Successfully Send The Request":
        const successMsg = 'Successfully Send The Request';
        setUsermessage(successMsg);
        setPopupData(data);
        ss.set("requestSentTime", Date.now());
        setChatPopUpStatus(true);
        ss.remove("UserChatCompleted");
        break;

      case "This Astrologer is Online And Busy":
        const OnlineAndBusy = 'This Astrologer is Online And Busy';
        ss.set("OnlineAndBusy", OnlineAndBusy);
        break;

      case "User Chat is Live.":
        const ChatLiveMsg = "User Chat is Live.";
        setUsermessage(ChatLiveMsg);
        setPopupData(data);
        setChatPopUpStatus(true);
        break;

      case "Astrologer is busy your Record is add in WaitingList.":
        const AstroBusyMsg = 'Astrologer is busy your Record is add in WaitingList.';
        setUsermessage(AstroBusyMsg);
        setPopupData(data);
        setChatPopUpStatus(true);
        ss.set("requestSentTime", Date.now());
        break;

      case "Please Wait For 1 Minutes":
        setChatPopUpStatus(true);
        setUsermessage(data?.Message);
        setPopupData(data);
        break;

      case "Sorry the astrologer denied your request please try again.":
        const deniedMsg = 'Sorry the astrologer denied your request please try again.';
        ss.remove("AstroBusyStatusCall");
        setUsermessage(deniedMsg);
        // setAstroNotBusyCall(data);
        break;

      case "Sorry This Astrologer is not online your Record is add in WaitingList.":
        const offlineMsg = 'Sorry This Astrologer is not online your Record is add in WaitingList.';
        setUsermessage(offlineMsg);
        setPopupData(data);
        setChatPopUpStatus(true);
        ss.set("requestSentTime", Date.now());
        break;

      case "Successfully Connected The Call.":
        const onlineCall = 'Successfully Connected The Call.';
        setUsermessage(onlineCall);
        setPopupData(data);
        ss.set("AstroBusyStatusCall", JSON.stringify(data));
        setChatPopUpStatus(true);
        break

      case "Already Waiting List is Found":
        const AlreadyWaitingList = "Already Waiting List is Found";
        setUsermessage(AlreadyWaitingList);
        setPopupData(data);
        setChatPopUpStatus(true);
        ss.set("requestSentTime", Date.now());
        break

      case "Please Provide the Review":
        const ReviewCall = "Please Provide the Review";
        setUsermessage(ReviewCall);
        setShowReviewPopup(true); // Open review popup
        setPopupData(data);
        setChatPopUpStatus(false);
        break;
      //   setPopupData(data);
      //   setChatPopUpStatus(false);
      //   setUsermessage("")
      //   // Get_SingleData_User(localStorage.getItem("UserLoginId"));
      //   ss.remove("AstroBusyStatusCall")
      //   // setAstroNotBusyCall(data)
      //   break;

      case "Sorry Please Disconnect Another Call":
        const StartCall = "Sorry Please Disconnect Another Call";
        setUsermessage(StartCall);
        setPopupData(data);
        // ss.remove("AstroBusyStatusCall")
        setChatPopUpStatus(true);
        break;

      // case "This Astrologer is Online":
      //   ss.set("AstrologerOnline", JSON.stringify(data));
      //   break;

      // case "This Astrologer is Offline":
      //   ss.set("AstrologerOnline", JSON.stringify(data));
      //   break;
      case "This Astrologer is Online":
      case "This Astrologer is Offline": {

        const type = (data?.Type || "").toLowerCase();
        if (type === "chat") {
          ss.set("AstrologerOnlineChat", JSON.stringify(data));
        }
        else if (type === "call") {
          ss.set("AstrologerOnlineCall", JSON.stringify(data));
        }
        else {
          ss.set("AstrologerOnline", JSON.stringify(data));
        }
        break;
      }


      case "Astro chat is busy": {
        // setBusyForAstro(data);
        break;
      }
      case "Removed call Message": {
        setChatPopUpStatus(false)
        setPopupData(null);
        // setBusyForAstro(data);
        break;
      }

      case "Waiting List Deleted":
      case "Astro Chat is Not Busy.":
      case "Chat Completed": {

        // clearBusyForAstro(data);
        // setAstroNotBusyStatus((prev) => !prev);
        if (data?.Message === "Waiting List Deleted") {
          setChatPopUpStatus(false);
          setPopupData(null);
          setUsermessage("");
        }
        if (data?.Message === "Chat Completed") {
          ss.set("UserChatCompleted", data?.Message);
          Get_SingleData_User(localStorage.getItem("UserLoginId"));
          setPopupData(data);
          // setreviewstatus(true);
          setChatPopUpStatus(false);
          setUsermessage("");
          if (typeof window !== "undefined") ss.remove("CheckEndedChat")
        }

        if (data?.Message === "Astro Chat is Not Busy.") {
          setBusyTimes(data)
        }

        break;
      }


      case "CancelWaitingListDeleted":
        setChatPopUpStatus(false);
        setPopupData(null);
        setUsermessage("");
        if (typeof window !== "undefined") ss.remove("requestSentTime");
        break;

      case "Astro Cancel Request":
        setChatPopUpStatus(true);
        setUsermessage(data?.Message);
        setPopupData(data);
        if (typeof window !== "undefined") ss.remove("UserChatCompleted")

        break;


      case "Please Disconnect the Chat User Balance is Over":
        const ChatCompleted = 'Chat Completed';
        if (typeof window !== "undefined") ss.set("UserChatCompleted", ChatCompleted);
        // setAstroChatCompleted(ChatCompleted);
        setPopupData(data);
        setUsermessage("")
        Get_SingleData_User(localStorage.getItem("UserLoginId"));
        // setreviewstatus(true)
        setChatPopUpStatus(false);

        break;

      case "Please wait for 1 Minutes":
        // ss.set("CheckEndedChat", JSON.stringify(data));
        setUserCheckEndedChat(data);
        break;

      case "Are You Sure To End The Chat.":
        setUserCheckEndedChat(data);
        // ss.set("CheckEndedChat", JSON.stringify(data));
        break;

      default:
      // console.log("📩 Unhandled WebSocket message:", data?.Message);

    }
  }, [router, setPopupData, setUserCalculateTime, setBusyTimes, setUserCheckEndedChat, Get_SingleData_User, setChatPopUpStatus, setUsermessage, setShowReviewPopup]);

  const handleUserMessagesRef = useRef(handleUserMessages);

  useEffect(() => {
    handleUserMessagesRef.current = handleUserMessages;
  }, [handleUserMessages]);

  useEffect(() => {
    const userId = UserLoginId || getStoredUserId();
    const loggedIn = isLogin || hasUserAuthSession();
    if (!userId || !loggedIn) return;

    socketService.connectUser(userId);
    socketService.setupVisibilityHandler(userId, null);

    const unsubscribe = socketService.addUserListener((messageData) => {
      console.log("📩 Received WebSocket message:", messageData);
      handleUserMessagesRef.current(messageData);
    });

    return () => {
      unsubscribe();
    };
  }, [isLogin, UserLoginId]);


  const AstroUserBusyAccepted = () => {
    socketService.sendUser({
      UserId: `WU${popupData?.UserId}`,
      AstroId: `WA${popupData?.AstroId}`,
      Status: "AstroUserBusy",
      Type: "chat",
      Message: "Accepted"
    });
  };

  const HandleJoinChatUser = () => {
    // setShowChatOverlay(true);
    if (popupData?.Message === "User Chat is Start" || popupData?.Message === "User Chat is Live.") {
      router.push(`/user-chat/chat?channel=${encodeURIComponent(popupData?.ChannelName || '')}&UserChatTokenId=${encodeURIComponent(popupData?.UserChatTokenId || '')}&WaitingListId=${encodeURIComponent(popupData?.WaitingListId || '')}&UserId=${encodeURIComponent(popupData?.UserId || '')}&AstroId=${encodeURIComponent(popupData?.AstroId || '')}`);
    }
    setChatPopUpStatus(false);
  }

  const UserCancelRequest = async () => {
    socketService.sendUser({
      AstroId: `WA${popupData?.AstroId}`, UserId: `WU${popupData?.UserId}`, Status: "Cancel", Type: "chat", Message: "CancelRequest", "messageId": "NewRequest"
    });
    // try {
    //   const message = JSON.stringify({
    //     AstroId: `WA${popupData?.AstroId}`, UserId: `WU${popupData?.UserId}`, Status: "Cancel", Type: "chat", Message: "CancelRequest", "messageId": "NewRequest"
    //   });
    //   console.log(message, 'message')
    //   ws.send(message);
    // } catch (error) {
    //   console.error("Logout Error:", error);
    // }
  };

  const DeleteWaitingListWS = (popupData) => {
    socketService.sendUser({
      AstroId: `WA${popupData?.AstroId}`, UserId: `WU${popupData?.UserId}`, Status: "Cancel", Type: "chat", Message: "CancelRequest", "messageId": "NewRequest"
    });
    // if (popupData) {
    //   const message = `{ \"UserId\":\"WU${popupData?.UserId}\",\"AstroId\":\"WA${popupData?.AstroId}\",\"Status\":\"DeleteWaitingList\",
    //   \"AstroName\":\"${popupData?.AstroName}\",\"Type\":\"${popupData?.Type}\",\"Rate\":\"${popupData?.Rate}\",\"messageId\":\"NewRequest\"}`;
    //   console.log(message, 'message')
    //   ws.send(message);
    // }
    // // toastifySuccess("Waiting List Deleted")
    // setChatPopUpStatus(false);
    // ss.remove("Usermessage");
    // // setChatPopUpStatus(false)
  }

  const handleDeleteClick = () => {
    const restrictedMessages = [
      "Successfully Send The Request",
      "Record Add in Waiting list",
      "Sorry This Astrologer is not online your Record is add in WaitingList.",
      "Sorry your Record is add in WaitingList.",
      "Astrologer is busy your Record is add in WaitingList.",
      "Already Waiting List is Found",
      "Please Wait For 1 Minutes",
    ];

    if (restrictedMessages.includes(popupData?.Message)) {
      // if (!canDeleteNow()) {
      //   settwominchatpopup(true);
      //   return;
      // } else {
      DeleteWaitingListWS(popupData);
      popupData?.Type === "Chat" && toastifySuccess("Waiting List Deleted");
      setPopupData(null);
      setChatPopUpStatus(false);
      // settwominchatpopup(false);
      return;
      // }
    }

    if (popupData?.Message === "Astro Cancel Request") {
      UserCancelRequest();
      return;
    }
    DeleteWaitingListWS(popupData);
    popupData?.Type === "Chat" && toastifySuccess("Waiting List Deleted");
    setPopupData(null);
    setChatPopUpStatus(false);
  };

  return (
    <>
      {ChatPopUpStatus && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center px-4 pb-5 transition ${popupData?.Message === "Please Accept Request"

            || popupData?.Message === "User Chat is Start" || popupData?.Message === "User Chat is Live."
            ? "bg-black/20 pointer-events-auto"
            : "pointer-events-none"
            }`}
        >

          <div className="pointer-events-auto w-full max-w-[400px]">
            <div className="relative overflow-hidden rounded-3xl border border-orange-400/20 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] p-3 shadow-[0_25px_70px_rgba(0,0,0,.45)] backdrop-blur-xl">

              {/* Decorative Glow */}
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>

              {/* Close Button */}
              {popupData?.Message !== "Please Accept Request" &&
                popupData?.Message !== "User Chat is Start" &&
                popupData?.IsChatProgress !== 1 && (
                  <button
                    onClick={handleDeleteClick}
                    className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1.5 text-gray-300 backdrop-blur transition hover:bg-red-500 hover:text-white"
                  >
                    <IoIosCloseCircleOutline className="text-3xl" />
                  </button>
                )}

              <div className="relative flex items-center gap-4">

                {/* Avatar */}
                <div className="relative shrink-0">
                  {/* <div className="rounded-full border-2 border-orange-400 p-1 shadow-lg">
                    <Image
                      src={`https://${popupData?.AvatarUrl?.replace(/\\/g, "/")}`}
                      alt="Astrologer"
                      width={72}
                      height={72}
                      className="rounded-full object-cover"
                    />
                  </div> */}
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-orange-400 bg-white p-[2px] shadow-md">
                    <Image
                      src={`https://${popupData?.AvatarUrl?.replace(/\\/g, "/")}`}
                      alt="Astrologer"
                      fill
                      className="rounded-full object-cover"
                      sizes="56px"
                    />
                  </div>

                  {/* Online Badge */}
                  <span className="absolute bottom-1 right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#0F172A] bg-green-500"></span>
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <h3 className="truncate text-lg font-bold text-white">
                    {popupData?.AstroName}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-300">
                    <span>₹{popupData?.Rate}/min</span>
                    <span className="text-orange-400">•</span>
                    <span>{popupData?.Type}</span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-orange-400">
                    {(popupData?.IsChatProgress === "1" ||
                      popupData?.IsChatProgress === 1 ||
                      popupData?.Message === "User Chat is Start")
                      ? "💬 Chat in Progress"
                      : userMessage}
                  </p>

                </div>
              </div>

              {/* Button */}
              <div className="mt-6">
                {popupData?.Message === "Please Accept Request" ? (
                  <button
                    onClick={AstroUserBusyAccepted}
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40"
                  >
                    Accept Request
                  </button>
                ) : (
                  <>
                    {(popupData?.IsChatProgress === "1" ||
                      popupData?.IsChatProgress === 1 ||
                      popupData?.Message === "User Chat is Start") && (
                        <button
                          onClick={HandleJoinChatUser}
                          className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/40"
                        >
                          Join Chat
                        </button>
                      )}
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      )}


      {twominchatpopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-orange-400 text-center">

            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold transition"
              onClick={() => settwominchatpopup(false)}
            >
              &times;
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 text-orange-600 rounded-full p-3 shadow-inner">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Waitlist Locked
            </h2>

            {/* Description */}
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              You’ve already sent a request to the astrologer. <br />
              Please wait for{" "}
              <span className="font-semibold text-orange-600">1 minutes</span>{" "}
              before you can remove it.
            </p>

            {/* Button */}
            <button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-2.5 rounded-full font-semibold shadow-md transition duration-300"
              onClick={() => settwominchatpopup(false)}
            >
              Okay
            </button>
          </div>
        </div>


      )}


      {/* Review Popup */}
      <ReviewPopup
        isOpen={showReviewPopup}
        onClose={() => setShowReviewPopup(false)}
        popupData={popupData}
      />


    </>
  );
}
