"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import socketService from "@/app/services/socketService";
import agoraRTM from "@/app/services/agoraRTMService";
import ChatUI from "@/app/components/chat/ChatUI";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";

export default function AstroChatPage() {

    const { loginAstrologerData, astroParsedData, astroCheckEndedChat, setAstroCheckEndedChat } = useMenuContext();
    console.log(astroParsedData, 'astroParsedData')

    const router = useRouter();
    const AstroCheckEndedChatPopup = astroCheckEndedChat || null;

    const params = useSearchParams();
    const channel = params.get("channel");
    const astroId = localStorage.getItem("AstroLoginId");
    const [messages, setMessages] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const messagesEndRef = useRef(null);


    const formatMessage = (msg, isMine = false) => ({
        isMine,
        message: msg?.Message || msg?.text || "",
        sender: msg?.UserName || (isMine ? "You" : "User"),
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString()
    });


    useEffect(() => {
        if (astroParsedData && channel) {
            User_Chat(astroParsedData?.UserId, astroParsedData?.AstroId);
        }
    }, [astroParsedData, channel]);

    const User_Chat = async (UserId, AstroId) => {
        try {
            const payload = {
                UserID: UserId,
                AstroID: AstroId,
            };
            const res = await postWithToken("Chat/ReturnChat", payload);
            if (res) {
                const FilterChat = res?.filter((item) => item?.ChannelName === channel)
                if (FilterChat?.length > 0) {
                    const formatted = FilterChat.map(msg =>
                        formatMessage(
                            {
                                Message: msg.Message,
                                UserName: msg.IsfromAstro ? "Astrologer" : "User"
                            },
                            msg.IsfromAstro
                        )
                    );

                    setChatHistory(formatted);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };



    useEffect(() => {
        if (!channel) return;

        const token = new URLSearchParams(window.location.search).get("AstroChatTokenId");

        if (!token || !astroId) {
            console.error("Missing RTM astro params");
            return;
        }

        agoraRTM.init({
            appId: "6b24a712e983467b9ace351f51518f08",
            uid: `WA${astroId}`,
            channelName: channel,
            token: token,
            onMessage: (msg) => {
                setMessages(prev => [
                    ...prev,
                    formatMessage(msg, false) // ✅ FIX
                ]);
            },
            onReady: () => {
                console.log("✅ ASTRO RTM READY");
                setIsReady(true);
            }
        });

        return () => agoraRTM.leave();
    }, [channel]);


    const sendMessage = async (text) => {

        if (!isReady || !agoraRTM.isChannelJoined) return;

        // UI
        setMessages(prev => [
            ...prev,
            formatMessage({ Message: text }, true)
        ]);

        // RTM
        agoraRTM.sendMessage({
            Message: text,
            UserName: "Astrologer"
        });

        // SOCKET
        socketService.sendAstro({
            Type: "chat",
            Message: text,
            ChannelName: channel,
        });

        // ✅ INSERT (astro)
        await insertChat(text, true);
    };

    const insertChat = async (text, isFromAstro) => {
        try {
            const val = {
                ChannelName: channel, // ✅ FIX (channelName nahi)
                UserID: astroParsedData?.UserId,
                AstroID: astroParsedData?.AstroId,
                IsfromAstro: isFromAstro, // ✅ dynamic
                Message: text,
                WaitingListId: astroParsedData?.WaitingListId,
                chatOrderId: astroParsedData?.WaitingListId
            };
          
            await TokenWithDeleteUpadateAdd("Chat/InsertChat", val);

        } catch (error) {
            console.log("InsertChat Error:", error);
        }
    };

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    useEffect(() => {
        const combined = [...chatHistory, ...messages];
        const grouped = groupMessagesByDate(combined);
        setGroupedMessages(grouped);
    }, [chatHistory, messages]);




    const groupMessagesByDate = (messages) => {
        const grouped = [];
        let lastDate = null;

        messages.forEach((msg) => {
            const msgDate = formatDate(msg.createdAt || msg.timestamp);

            if (msgDate !== lastDate) {
                grouped.push({ type: "date", date: msgDate });
                lastDate = msgDate;
            }
            grouped.push(msg);
        });

        return grouped;
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const HandleBackButton = () => {
        // navigate("/dashboard");
        router.push(`/astrologer-panel/dashboard`);
        sessionStorage.setItem("UserAccepted", '');
        sessionStorage.removeItem("AstroChatCompleted")
        sessionStorage.removeItem("UserAccepted")
        localStorage.removeItem("AstroChatTokenId")
        // setAcceptedUser(false)
    }

    const CheckEnded = () => {
        if (astroParsedData) {
            socketService.sendAstro({
                UserId: `WU${astroParsedData?.UserId}`,
                AstroId: `WA${astroParsedData?.AstroId}`,
                Status: "CheckEnded",
                ReceivedMessageState: "A",
                messageId: "NewRequest",
            });


        }
    };

    const ChatCompleted = () => {
        if (astroParsedData) {
            socketService.sendAstro({
                UserId: `WU${astroParsedData?.UserId}`,
                AstroId: `WA${astroParsedData?.AstroId}`,
                Status: "Completed",
                Type: "chat",
                AstroName: astroParsedData?.AstroName,
                AvatarUrl: astroParsedData?.AvatarUrl,
                messageId: "NewRequest",
            });
        }
    }

    const leaveRtmChannel = async () => {
        try {
            await agoraRTM.leave();
        } catch (error) {
            console.error(error);
        } finally {
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
                {/* Chat Header - Website Brand Color: Orange Theme */}
                <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 text-white p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{astroParsedData?.UserName || "User Chat"}</h2>
                            <p className="text-sm text-white/90 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="font-medium">Online</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {
                            astroParsedData?.Message === "Chat Completed" || astroParsedData?.Message === "Please Disconnect the Chat User Balance is Over" ?
                                <button
                                    onClick={() => { HandleBackButton(); }}
                                    className="bg-black hover:bg-gray-900 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white flex-shrink-0"
                                    style={{ minHeight: '36px', minWidth: '60px' }}
                                >
                                    <span className="hidden sm:inline">Back</span>
                                    <span className="sm:hidden">←</span>
                                    <span className="ml-1 hidden sm:inline">←</span>
                                </button>

                                :
                                (
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

                {/* Chat Body */}
                <div className="h-[calc(80vh-80px)] overflow-hidden">
                    <ChatUI messages={groupedMessages} onSend={sendMessage} disabled={!isReady} />
                </div>
            </div>


            {
                AstroCheckEndedChatPopup?.Message === "Are You Sure To End The Chat." ?
                    (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  px-4">
                        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-orange-300">


                            <h2 className="text-base sm:text-lg font-semibold text-gray-800 text-center mb-3">
                                End Chat Confirmation
                            </h2>

                            <p className="text-sm text-gray-600 text-center mb-4 sm:mb-6">  Are you sure you want to end the chat?</p>

                            <div className="flex gap-3 sm:gap-4">
                                <button
                                    onClick={() => {
                                        sessionStorage.setItem("AstrologerChatEnd", true); setTimeout(() => { leaveRtmChannel(); setAstroCheckEndedChat(null) }, 100);
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg shadow-md transition text-sm sm:text-base"
                                >
                                    Yes, End
                                </button>

                                <button
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 sm:py-2.5 rounded-lg shadow-md transition text-sm sm:text-base"
                                    onClick={() => { setAstroCheckEndedChat(null) }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                    )
                    :
                    (
                        AstroCheckEndedChatPopup?.Message === "Please wait for 1 Minutes" &&
                        (
                            <div className="fixed inset-0 z-50 pointer-events-none">
                                <div className="flex items-center justify-center h-full w-full pointer-events-none px-4">
                                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-orange-300 text-center pointer-events-auto">

                                        <button
                                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
                                            onClick={() => { setAstroCheckEndedChat(null) }}
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


                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">End Chat Confirmation</h2>
                                        <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                                            Please wait for <span className="font-medium text-orange-500">1 minute</span> before ending the chat.
                                        </p>

                                        <button onClick={() => { setAstroCheckEndedChat(null) }} className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2 rounded-full font-semibold transition duration-300 text-sm sm:text-base">
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