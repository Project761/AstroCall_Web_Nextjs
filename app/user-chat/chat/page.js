"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import socketService from "@/app/services/socketService";
import ChatUI from "@/app/components/chat/ChatUI";
import agoraRTM from "@/app/services/agoraRTMService";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";

export default function UserChatPage() {

    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || "" : "";

    const { popupData, setPopupData, UserCheckEndedChat, setUserCheckEndedChat } = useMenuContext();
    const router = useRouter();
    console.log(popupData, 'popupData')
    
    const params = useSearchParams();
    const channel = params.get("channel");
    const WaitingListId = params.get("WaitingListId");


    const UserChatTokenId = params.get("UserChatTokenId");
    const userId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") : "";
    const [messages, setMessages] = useState([]);
    const [WaitinglistCheck, setWaitinglistCheck] = useState([]);
    const [isJoinedAndReady, setIsJoinedAndReady] = useState(false);
    const [ChatHistory, setChatHistory] = useState([]);

    const formatMessage = (msg, isMine = false) => ({
        isMine,
        message: msg?.Message || msg?.text || "",
        sender: msg?.UserName || (isMine ? "You" : "User"),
        createdAt: msg?.createdAt || new Date().toISOString(), // ✅ FIX
        timestamp: msg?.timestamp || new Date().toISOString()
    });


    useEffect(() => {
        if (popupData && channel) {
            User_Chat(popupData?.UserLoginId, popupData?.AstroId);
        }
    }, [popupData, channel]);

    const User_Chat = async (UserLoginId, AstroId) => {
        try {
            const payload = {
                UserID: UserLoginId,
                AstroID: AstroId,
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
                                createdAt: msg.DateTimes,   // ✅ ADD
                                timestamp: msg.DateTimes    // ✅ ADD
                            },
                            !msg.IsfromAstro
                            // msg.IsfromAstro
                        )
                    );

                    setChatHistory(formatted);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };


    const combinedMessages = [
        ...(ChatHistory || []),
        ...(messages || [])
    ];


    useEffect(() => {
        if (!channel || !UserChatTokenId || !userId) return;

        let isMounted = true;

        const initRTM = async () => {
            await agoraRTM.init({
                appId: "6b24a712e983467b9ace351f51518f08",
                uid: `WU${userId}`,
                channelName: channel,
                token: UserChatTokenId,
                onMessage: (msg) => {
                    setMessages(prev => [
                        ...prev,
                        formatMessage(
                            msg,
                            msg?.UserName === "User"
                        )
                    ]);
                },
                onReady: () => {
                    setIsJoinedAndReady(true);
                }
            });
        };

        initRTM();

        return () => {
            isMounted = false;
            agoraRTM.leave();
        };
    }, [channel, UserChatTokenId, userId]);

    const sendMessage = async (text) => {

        if (!agoraRTM.isChannelJoined) {
            console.warn("⏳ RTM not ready");
            return;
        }

        // ✅ 1. UI update
        setMessages((prev) => [
            ...prev,
            formatMessage({ Message: text }, true)
        ]);

        // ✅ 2. RTM (real-time)
        agoraRTM.sendMessage({
            Message: text,
            UserName: "User"
        });

        // ✅ 3. SOCKET (optional backup)
        socketService.sendUser({
            Type: "chat",
            Message: text,
            ChannelName: channel,
        });

        // ✅ 4. DB INSERT (IMPORTANT)
        await insertAstro_Chat(text);
    };


    const insertAstro_Chat = async (text) => {
        try {
            const val = {
                ChannelName: channel,
                UserID: UserLoginId,
                AstroID: popupData?.AstroId ? popupData?.AstroId : AstroId,
                IsfromAstro: false,
                Message: text,
                WaitingListId: WaitingListId,
                chatOrderId: WaitingListId
            };
            await TokenWithDeleteUpadateAdd("Chat/InsertChat", val);

        } catch (error) {
            console.log("InsertChat Error:", error);
        }
    };


    const ChatButtonBack = () => {
        router.push(`/chat-to-astrologers`);
    }

    useEffect(() => {
        if (userId) {
            Get_WaitingList_History();
        }
    }, [userId]);

    const Get_WaitingList_History = async () => {
        const val = { "AstroId": "", "UserId": userId };
        try {
            const res = await postWithToken('WaitingList/GetData_WaitingListUser', val);
            if (res) {
                const checkData = res?.find((item) => item?.WaitingListId == popupData?.WaitingListId);
                if (checkData) {
                    setWaitinglistCheck(checkData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };


    const CheckEnded = () => {
        socketService.sendUser({
            UserId: `WU${popupData?.UserId}`,
            AstroId: `WA${popupData?.AstroId}`,
            Status: "CheckEnded",
            ReceivedMessageState: "U",
            messageId: "NewRequest",
        });
    };
    const ChatCompleted = () => {
        socketService.sendUser({
            UserId: `WU${popupData?.UserId}`,
            AstroId: `WA${popupData?.AstroId}`,
            Status: "Completed",
            Type: "chat",
            AstroName: popupData?.AstroName,
            AvatarUrl: popupData?.AvatarUrl,
            messageId: "NewRequest",
        });
    };

    const leaveRtmChannel = async () => {
        try {
            await agoraRTM.leave();
        } catch (error) {
            console.error(error);
        } finally {
            setUserCheckEndedChat("")
            ChatCompleted();
            sessionStorage.removeItem("UserPopupData");
            sessionStorage.removeItem("Usermessage");
            sessionStorage.removeItem("ChatCompleted");
        }
    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" ></div>
            <div className="relative w-full max-w-[80vw] h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden z-10">


                {/* Header - Website Brand Color: Orange Theme */}
                <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-white p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-white font-bold text-lg">U</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{popupData?.AstroName}</h2>
                            <p className="text-sm text-white/90 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="font-medium">Online</span>
                            </p>
                            {/* <p className="text-sm font-semibold">{formatTime(timeLeft)}</p> */}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right  backdrop-blur-sm rounded-lg px-3 py-2">
                            {
                                popupData?.Message === "Chat Completed" || popupData?.Message === "Please Disconnect the Chat User Balance is Over" ?
                                    <button
                                        onClick={() => { ChatButtonBack(); }}
                                        className="bg-black hover:bg-gray-900 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white flex-shrink-0"
                                        style={{ minHeight: '36px', minWidth: '60px' }}
                                    >
                                        <span className="hidden sm:inline">Back</span>
                                        <span className="sm:hidden">←</span>
                                        <span className="ml-1 hidden sm:inline">←</span>
                                    </button>

                                    :
                                    WaitinglistCheck && (
                                        <button
                                            onClick={() => { CheckEnded(); }}
                                            className="bg-red-600 hover:bg-red-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex-shrink-0"
                                            style={{ minHeight: '36px', minWidth: '60px' }}
                                        >
                                            <span className="hidden sm:inline">END</span>
                                            <span className="sm:hidden">END</span>
                                            <span className="ml-1 hidden sm:inline">←</span>
                                        </button>
                                    )
                            }

                        </div>
                    </div>
                </div>

                {/* Chat UI - Height calculated to fit viewport */}
                <div className="h-[calc(80vh-80px)] overflow-hidden">
                    <ChatUI messages={combinedMessages} onSend={sendMessage} disabled={!isJoinedAndReady} />
                </div>

            </div>


            {
                UserCheckEndedChat?.Message === "Are You Sure To End The Chat." ?
                    (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 border border-orange-300">


                            <h2 className="text-lg font-semibold text-gray-800 text-center mb-3">
                                End Chat Confirmation
                            </h2>

                            <p className="text-sm text-gray-600 text-center mb-6">  Are you sure you want to end the chat?</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        leaveRtmChannel();
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
                                >
                                    Yes, End
                                </button>

                                <button
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2.5 rounded-lg shadow-md transition"
                                    onClick={() => { setUserCheckEndedChat("") }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                    )
                    :
                    (
                        UserCheckEndedChat?.Message === "Please wait for 1 Minutes" &&
                        (
                            <div className="fixed inset-0 z-50 pointer-events-none">
                                <div className="flex items-center justify-center h-full w-full pointer-events-none">
                                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-orange-300 text-center pointer-events-auto">

                                        <button
                                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                                            onClick={() => { setUserCheckEndedChat("") }}
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

                                        <button onClick={() => { setUserCheckEndedChat("") }} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition duration-300">
                                            Okay
                                        </button>
                                    </div>
                                </div>
                            </div>


                        )
                    )
            }
        </div>
    );
}