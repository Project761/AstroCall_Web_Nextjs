
import socketService from "@/app/services/socketService";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { toastifySuccess } from "../utils/utility";
import { useRouter } from "next/navigation";
import { FiMinimize } from "react-icons/fi";
import Image from "next/image";
import { useMenuContext } from "../hooks/useMenuContext";

export default function UserChat() {

  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") : "";
  const { popupData, setPopupData, UserCheckEndedChat, setUserCheckEndedChat } = useMenuContext();

  // const [popupData, setPopupData] = useState(null);
  const [ChatPopUpStatus, setChatPopUpStatus] = useState(false);
  const [userMessage, setUsermessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [shouldShowPopup, setShouldShowPopup] = useState(true);
  const [clickbuttonloading, setclickbuttonloading] = useState(true);
  const [twominchatpopup, settwominchatpopup] = useState(false);


  useEffect(() => {
    if (userId) {
      socketService.connectUser(userId);
    }
    socketService.setUserListener((messageData) => {
      console.log("📩 USER MSG:", messageData);

      // Handle chat messages when overlay is open
      if (messageData?.Type === "chat" && messageData?.Message) {
        setChatMessages(prev => [...prev, {
          sender: messageData.UserName || "User",
          text: messageData.Message,
          timestamp: new Date().toISOString()
        }]);
      }

      handleUserMessages(messageData);
    });
  }, [userId]);


  const handleUserMessages = (data) => {
    switch (data?.Message) {

      case "Please Accept Request":

        setChatPopUpStatus(true);
        setUsermessage(data?.Message);
        setPopupData(data);
        break;

      case "Record Add in Waiting list":
        const RecordAdd = 'Record Add in Waiting list';
        setUsermessage(RecordAdd);
        setPopupData(data);
        setChatPopUpStatus(true);
        sessionStorage.setItem("requestSentTime", Date.now());
        break;

      case "Sorry your Record is add in WaitingList.":

        const RecordAdd1 = 'Sorry your Record is add in WaitingList.';
        setUsermessage(RecordAdd1);
        setPopupData(data);
        setChatPopUpStatus(true);
        sessionStorage.setItem("requestSentTime", Date.now());
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
        sessionStorage.setItem("requestSentTime", Date.now());
        setChatPopUpStatus(true);
        break;

      case "This Astrologer is Online And Busy":
        const OnlineAndBusy = 'This Astrologer is Online And Busy';
        sessionStorage.setItem("OnlineAndBusy", OnlineAndBusy);
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
        sessionStorage.setItem("requestSentTime", Date.now());
        break;

      case "Please Wait For 1 Minutes":
        const waitMsg = 'Please Wait For 1 Minutes';
        setUsermessage(waitMsg);
        setChatPopUpStatus(true);
        setUsermessage(data?.Message);
        setPopupData(data);

        break;

      case "Sorry the astrologer denied your request please try again.":
        const deniedMsg = 'Sorry the astrologer denied your request please try again.';
        sessionStorage.removeItem("AstroBusyStatusCall");
        setUsermessage(deniedMsg);
        // setAstroNotBusyCall(data);
        break;

      case "Sorry This Astrologer is not online your Record is add in WaitingList.":
        const offlineMsg = 'Sorry This Astrologer is not online your Record is add in WaitingList.';
        setUsermessage(offlineMsg);
        setPopupData(data);
        setChatPopUpStatus(true);
        sessionStorage.setItem("requestSentTime", Date.now());
        break;

      case "Successfully Connected The Call.":
        const onlineCall = 'Successfully Connected The Call.';
        setUsermessage(onlineCall);
        setPopupData(data);
        sessionStorage.setItem("AstroBusyStatusCall", JSON.stringify(data));
        setChatPopUpStatus(true);
        break

      case "Already Waiting List is Found":
        const AlreadyWaitingList = "Already Waiting List is Found";
        setUsermessage(AlreadyWaitingList);
        setPopupData(data);
        setChatPopUpStatus(true);
        sessionStorage.setItem("requestSentTime", Date.now());
        break

      // case "Please Provide the Review":
      //   const ReviewCall = "Please Provide the Review";
      //   setUsermessage(ReviewCall);
      //   // setreviewstatus(true)
      //   setPopupData(data);
      //   setChatPopUpStatus(false);
      //   setUsermessage("")
      //   // Get_SingleData_User(localStorage.getItem("UserLoginId"));
      //   sessionStorage.removeItem("AstroBusyStatusCall")
      //   // setAstroNotBusyCall(data)
      //   break;

      case "Sorry Please Disconnect Another Call":
        const StartCall = "Sorry Please Disconnect Another Call";
        setUsermessage(StartCall);
        setPopupData(data);
        // sessionStorage.removeItem("AstroBusyStatusCall")
        setChatPopUpStatus(true);
        break;

      // case "This Astrologer is Online":
      //   sessionStorage.setItem("AstrologerOnline", JSON.stringify(data));
      //   break;

      // case "This Astrologer is Offline":
      //   sessionStorage.setItem("AstrologerOnline", JSON.stringify(data));
      //   break;
      case "This Astrologer is Online":
      case "This Astrologer is Offline": {

        const type = (data?.Type || "").toLowerCase();
        if (type === "chat") {
          sessionStorage.setItem("AstrologerOnlineChat", JSON.stringify(data));
        }
        else if (type === "call") {
          sessionStorage.setItem("AstrologerOnlineCall", JSON.stringify(data));
        }
        else {
          sessionStorage.setItem("AstrologerOnline", JSON.stringify(data));
        }
        break;
      }


      case "Astro chat is busy": {
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
          if (typeof window !== "undefined") sessionStorage.removeItem("requestSentTime");
        }

        if (data?.Message === "Chat Completed") {
          if (typeof window !== "undefined") sessionStorage.setItem("UserChatCompleted", data?.Message);
          // Get_SingleData_User(localStorage.getItem("UserLoginId"));
          setPopupData(data);
          // setreviewstatus(true);
          setChatPopUpStatus(false);
          setUsermessage("");
          if (typeof window !== "undefined") sessionStorage.removeItem("CheckEndedChat")
        }

        break;
      }


      case "CancelWaitingListDeleted":
        setChatPopUpStatus(false);
        setPopupData(null);
        setUsermessage("");
        if (typeof window !== "undefined") sessionStorage.removeItem("requestSentTime");
        break;

      case "Astro Cancel Request":
        setChatPopUpStatus(true);
        setUsermessage(data?.Message);
        setPopupData(data);
        if (typeof window !== "undefined") sessionStorage.removeItem("UserChatCompleted")

        break;


      case "Please Disconnect the Chat User Balance is Over":
        const ChatCompleted = 'Chat Completed';
        if (typeof window !== "undefined") sessionStorage.setItem("UserChatCompleted", ChatCompleted);
        // setAstroChatCompleted(ChatCompleted);
        setPopupData(data);
        setUsermessage("")
        // Get_SingleData_User(localStorage.getItem("UserLoginId"));
        // setreviewstatus(true)
        setChatPopUpStatus(false);

        break;

      case "Please wait for 1 Minutes":
        // sessionStorage.setItem("CheckEndedChat", JSON.stringify(data));
        setUserCheckEndedChat(data);
        break;

      case "Are You Sure To End The Chat.":
        setUserCheckEndedChat(data);
        // sessionStorage.setItem("CheckEndedChat", JSON.stringify(data));
        break;

      default:
      // console.log("📩 Unhandled WebSocket message:", data?.Message);

    }
  };


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
    console.log(popupData, 'popupDatasdfsd')
    if (popupData?.Message === "User Chat is Start" || popupData?.Message === "User Chat is Live.") {
      router.push(`/user-chat/chat?channel=${encodeURIComponent(popupData?.ChannelName || '')}&UserChatTokenId=${encodeURIComponent(popupData?.UserChatTokenId || '')}&WaitingListId=${encodeURIComponent(popupData?.WaitingListId || '')}&UserId=${encodeURIComponent(popupData?.UserId || '')}&AstroId=${encodeURIComponent(popupData?.AstroId || '')}`);
    }

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
    // sessionStorage.removeItem("Usermessage");
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
  };

  return (
    <>
      {ChatPopUpStatus && shouldShowPopup && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center px-4 pb-5 transition ${popupData?.Message === "Please Accept Request"

            || popupData?.Message === "User Chat is Start" || popupData?.Message === "User Chat is Live."
            ? "backdrop-blur-sm bg-black/30 pointer-events-auto"
            : "pointer-events-none"
            }`}
        >

          <div className="pointer-events-auto space-y-4 max-w-md w-full">
            <div
              className="w-full p-4 bg-orange-400 border border-gray-200 rounded-2xl shadow-xl flex items-center gap-4 relative"
            >

              <div className="relative">
                {popupData?.AvatarUrl && (
                  <Image
                    src={`https://${popupData.AvatarUrl.replace(/\\/g, "/")}`}
                    alt="Avatar"
                    width={70}
                    height={70}
                    className="rounded-full object-cover border-2 border-orange-400"
                  />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {popupData?.AstroName}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-3">
                  ₹ {popupData?.Rate}/min
                  <span className="border-l border-gray-400 pl-3">Type: {popupData?.Type}</span>
                </p>

                <p className="text-xs text-red-600 font-medium mt-1">
                  {(popupData?.IsChatProgress === '1' || popupData?.IsChatProgress === 1) || popupData?.Message === "User Chat is Start" ? <>Chat is in Progress Join</> : userMessage}
                </p>
              </div>

              <div className="absolute bottom-10 right-4">
                {popupData?.Message === "Please Accept Request" ? (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-4 rounded-lg shadow transition"
                      onClick={() => { AstroUserBusyAccepted() }}
                      disabled={!clickbuttonloading}
                    >
                      Accept
                    </button>
                  </>
                ) : (
                  <>
                    {(popupData?.IsChatProgress === '1' || popupData?.IsChatProgress === 1) || popupData?.Message === "User Chat is Start" ? (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-4 rounded-lg shadow transition"
                        onClick={() => { HandleJoinChatUser() }}
                      >
                        Join Chat
                      </button>
                    ) : (
                      (popupData?.Message === "CancelRequest") ? (
                        <div onClick={() => { handleDeleteClick() }} className="cursor-pointer">
                          <IoIosCloseCircleOutline className="text-5xl text-gray-800 hover:text-red-500 transition duration-200" />
                        </div>
                      ) : (
                        <div onClick={() => { handleDeleteClick() }} className="cursor-pointer">
                          <IoIosCloseCircleOutline className="text-5xl text-gray-800 hover:text-red-500 transition duration-200" />
                        </div>
                      )
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



    </>
  );
}