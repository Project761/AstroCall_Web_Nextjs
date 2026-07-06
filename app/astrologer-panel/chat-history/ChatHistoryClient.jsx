"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  PanelPageHeader, PanelCard, StatCard, PanelFilterBar, PanelLoading, PanelEmpty,
  PanelPagination, StatusBadge, ServiceBadge,
} from "@/app/components/AstrologerPanelUi";
import { AP_INPUT, AP_BTN_OUTLINE, AP_BTN_PRIMARY } from "@/app/lib/astrologerPanelTheme";

const ReactScrollToBottom = ({ children, className }) => (<div className={className}>{children}</div>);

const ChatHistory = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [chatData, setChatData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [SuggestUserId, setSuggestUserId] = useState("");
    const [SuggestStatus, setSuggestStatus] = useState(false);
    const [SuggestStatusAdd, setSuggestStatusAdd] = useState(false);
    const [productId, setProductId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All Status");
    // Sidebar is rendered by `app/astrologer-panel/layout.js`
    const products = [
        { id: 1, title: "Gemstone", image: "api.astrocall.live/Imagefolder/ddb0e298-3f24-4e02-8550-2dbac61b4b15_download_thumb.jpg" },
        { id: 2, title: "Online Puja", image: "api.astrocall.live/Imagefolder/3b692eac-4fe8-48b8-ab76-5ace0fae4b29_Delay In Marriage Due Destructive Shani Mangal Yog Poja_thumb.jpg" }
    ];
    const [gemstonedata, setgemstonedata] = useState([]);
    const [pujadata, setpujadata] = useState([]);
    const [TotalChatsdata, setTotalChatsdata] = useState();

    const fetchChatHistory = useCallback(async () => {
        const payload = {
            IsActive: "1",
            AstroId: GetAstroLoginId,
            Type: "chat"
        };
        try {
            const res = await postWithToken("ChatHistory/GetData_ChatHistory", payload);
            if (res)
                setChatData(res);
            setLoading(false);
        }
        catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [GetAstroLoginId]);

    const Get_Data_gemstone = useCallback(async () => {
        const val = { IsActive: "1" };
        try {
            const res = await postWithToken("Gemstone/GetData_Gemstone", val);
            if (res) {
                setgemstonedata(res?.filter((item) => item?.GemstoneID));
            }
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    const Get_Data_ChatCallHistory = useCallback(async () => {
        const val = {
            AstroID: GetAstroLoginId,
            Type: "chat"
        };
        try {
            const res = await postWithToken("AstroWalletTransaction/ChatCallHistory", val);
            if (res) {
                setTotalChatsdata(res[0]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [GetAstroLoginId]);

    const Get_Data_OnlinePuja = useCallback(async () => {
        const val = { IsActive: "1" };
        try {
            const res = await postWithToken("Puja/GetData_Puja", val);
            if (res) {
                setpujadata(res.filter((item) => item?.PujaID));
            }
        }
        catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (!GetAstroLoginId) return;
        const timer = setTimeout(() => {
            fetchChatHistory();
            Get_Data_ChatCallHistory();
            Get_Data_gemstone();
            Get_Data_OnlinePuja();
        }, 0);
        return () => clearTimeout(timer);
    }, [GetAstroLoginId, fetchChatHistory, Get_Data_ChatCallHistory, Get_Data_gemstone, Get_Data_OnlinePuja]);

    const openChat = async (chat) => {
        setSelectedChat(chat);
        setIsChatOpen(true);
        const payload = {
            UserID: chat?.UserId,
            AstroID: chat?.AstroId,
            chatOrderId: chat?.OrderID,
        };
        try {
            const res = await postWithToken("Chat/ReturnChat", payload);
            setMessages(res?.map((item) => ({
                sender: item.IsfromAstro ? "user" : "astro",
                text: item.Message,
                dateTime: item.DateTimes,
            })) || []);
        }
        catch (error) {
            console.error(error);
        }
    };
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const filteredData = chatData?.filter(item => {
        const itemDate = new Date(item.Datetime);
        const matchesName = item?.UserName?.toLowerCase().includes(searchName.toLowerCase());
        const matchesDate = searchDate || endDate
            ? (!searchDate || itemDate >= new Date(searchDate)) &&
                (!endDate || itemDate <= new Date(endDate))
            : itemDate >= sevenDaysAgo && itemDate <= today;
        const matchesStatus = statusFilter === "All Status"
            ? true
            : item?.Status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesName && matchesDate && matchesStatus;
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const Insert_Suggestions = async (product) => {
        const val = {
            AstrologerId: GetAstroLoginId,
            UseriD: SuggestUserId,
            ProductId: productId === 1 ? product.GemstoneID : product.PujaID,
            Type: productId === 1 ? "GemStone" : "Puja",
            SuggestedText: "test",
            Status: "Pending ",
        };
        try {
            // Note: TokenWithDeleteUpadateAdd needs to be implemented or imported
            // const res = await TokenWithDeleteUpadateAdd("Suggestions/Insert_Suggestions", val);
            const res = { success: true }; // Placeholder
            if (res) {
                // toastifySuccess("Successfully Suggest")
                setSuggestStatus(false);
                setProductId(null);
                setSuggestStatusAdd(false);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="mx-auto max-w-[1400px]">
            <PanelPageHeader title="Chat History" breadcrumbs={["Dashboard", "Chat History"]} description="View past chat sessions and transcripts." />

            {loading ? (<PanelLoading />) : (<>
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Chats" value={TotalChatsdata?.TotalChatsCalls || 0} sub={`${TotalChatsdata?.ChatCallIncreaseMonth || 0} this month`} iconBg="bg-purple-50" />
                    <StatCard label="Total Duration" value={TotalChatsdata?.TotalDuration || 0} sub={`Avg. ${TotalChatsdata?.AvgDuration} min`} iconBg="bg-orange-50" />
                    <StatCard label="Total Earnings" value={`₹${TotalChatsdata?.TotalEarning || 0}`} sub={`${TotalChatsdata?.TotalEarningPer}% increase`} iconBg="bg-orange-50" />
                    <StatCard label="Avg. Rating" value={TotalChatsdata?.AvgRating || 0} sub="Client ratings" iconBg="bg-yellow-50" />
                </div>

                <PanelCard title="Chat Sessions">
                    <PanelFilterBar>
                        <input type="date" className={AP_INPUT} value={searchDate} onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }} />
                        <input type="date" className={AP_INPUT} value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
                        <input type="text" placeholder="Search by name..." className={AP_INPUT} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }} />
                        <select className={AP_INPUT} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                            <option>All Status</option>
                            <option>completed</option>
                            <option>in-progress</option>
                            <option>Pending</option>
                            <option>busy</option>
                            <option>no-answer</option>
                        </select>
                    </PanelFilterBar>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {currentItems.length > 0 ? (currentItems.map((chat) => (
                            <div key={chat.OrderID} className="cursor-pointer rounded-xl border border-gray-100 bg-[#FFF9F1] p-5 transition hover:border-orange-200 hover:shadow-md" onClick={() => openChat(chat)}>
                                <div className="flex items-center gap-3">
                                    <Image src={toCdnSrcOrFallback(chat?.UserImage)} alt={chat.UserName} width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-50" unoptimized={!!chat?.UserImage} />
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A]">{chat.UserName}</h3>
                                        <p className="text-xs text-gray-400">Order #{chat.OrderID}</p>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1 text-xs text-gray-600">
                                    <p>{format(new Date(chat.Datetime), "dd MMM yyyy, HH:mm")}</p>
                                    <ServiceBadge type="chat" />
                                    <StatusBadge status={chat.Status === "completed" ? "Completed" : "Pending"} />
                                </div>
                                <p className="mt-2 text-[10px] text-[#FF5C00]">Tap to view transcript →</p>
                                <button
                                    type="button"
                                    className={`${AP_BTN_OUTLINE} mt-3 w-full text-xs`}
                                    onClick={(e) => { e.stopPropagation(); setSuggestStatus(true); setSuggestUserId(chat?.UserId); }}
                                >
                                    Suggest Remedy
                                </button>
                            </div>
                        ))) : (<PanelEmpty />)}
                    </div>

                    <PanelPagination page={currentPage} totalPages={totalPages} total={filteredData.length} pageSize={itemsPerPage} onPageChange={setCurrentPage} />
                </PanelCard>

                {/* Suggest Remedy Modal */}
                {SuggestStatus && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                            {SuggestStatusAdd && productId ? (
                                <div className="flex h-full max-h-[85vh] flex-col">
                                    <div className="flex items-center border-b border-orange-100 bg-[#FFF9F1] px-4 py-3">
                                        <button type="button" className="text-2xl text-gray-600" onClick={() => setProductId(null)}><IoArrowBack /></button>
                                        <div className="flex-1 text-center font-semibold text-[#1A1A1A]">{productId === 1 ? "Gemstone" : "Online Puja"}</div>
                                    </div>
                                    <div className="space-y-3 overflow-auto p-4">
                                        {productId === 1
                                            ? gemstonedata.map((product) => (
                                                <div key={product.GemstoneID} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#FFF9F1] p-3">
                                                    <img src={product?.Image1 ? `https://${product?.Image1?.replace(/\\/g, "/")}` : "/images/default-image.jpg"} alt="Gemstone" className="h-16 w-16 rounded-lg object-cover" />
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-semibold">{product.HeadingDescription}</h3>
                                                        <p className="text-sm font-medium text-[#FF5C00]">₹{product.TotalAmt}</p>
                                                    </div>
                                                    <button type="button" className={AP_BTN_OUTLINE} onClick={() => Insert_Suggestions(product)}>Suggest</button>
                                                </div>
                                            ))
                                            : pujadata.map((product) => (
                                                <div key={product.PujaID} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#FFF9F1] p-3">
                                                    <img src={product?.PujaImage ? `https://${product?.PujaImage.replace(/\\/g, "/")}` : "/images/default-image.jpg"} alt="Puja" className="h-16 w-16 rounded-lg object-cover" />
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-semibold">{product.PujaName}</h3>
                                                        <p className="text-sm font-medium text-[#FF5C00]">₹{product.TotalAmt}</p>
                                                    </div>
                                                    <button type="button" className={AP_BTN_OUTLINE} onClick={() => Insert_Suggestions(product)}>Suggest</button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : SuggestStatusAdd ? (
                                <div className="flex h-full max-h-[85vh] flex-col">
                                    <div className="flex items-center border-b border-orange-100 bg-[#FFF9F1] px-4 py-3">
                                        <button type="button" className="text-2xl text-gray-600" onClick={() => setSuggestStatusAdd(false)}><IoArrowBack /></button>
                                        <div className="flex-1 text-center font-semibold">Astromall</div>
                                    </div>
                                    <div className="space-y-3 overflow-auto p-4">
                                        {products.map((product) => (
                                            <div key={product.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 hover:border-orange-200" onClick={() => setProductId(product.id)}>
                                                <img src={product?.image ? `https://${product?.image?.replace(/\\/g, "/")}` : "/images/default-image.jpg"} alt={product.title} className="h-16 w-16 rounded-lg object-cover" />
                                                <h3 className="font-medium">{product.title}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <div className="relative border-b border-orange-100 bg-[#FFF9F1] py-3 text-center font-semibold">
                                        Suggest Remedy
                                        <button type="button" onClick={() => setSuggestStatus(false)} className="absolute right-3 top-3 text-gray-500 hover:text-black">✕</button>
                                    </div>
                                    <div className="space-y-3 p-4 text-sm text-gray-600">
                                        <p>You can suggest any remedy to the customer (like a doctor).</p>
                                        <p>It can be a free mantra, advice, etc.</p>
                                        <p>Or a paid product like gemstone, online puja, healing, etc.</p>
                                        <p>You get 50% revenue if customer buys from you. If you refer to Astromall, you get 10%.</p>
                                    </div>
                                    <div className="border-t p-4 text-center">
                                        <button type="button" className={`${AP_BTN_PRIMARY} rounded-full px-6 py-2 text-sm`} onClick={() => setSuggestStatusAdd(true)}>+ Add</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Popup */}
                {isChatOpen && selectedChat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
                            <div className="flex items-center justify-between bg-[#1A1A1A] p-4 text-white">
                                <div className="flex items-center gap-3">
                                    <Image src={toCdnSrcOrFallback(selectedChat?.UserImage)} alt={selectedChat?.UserName} width={48} height={48} className="h-12 w-12 rounded-full object-cover" unoptimized={!!selectedChat?.UserImage} />
                                    <div>
                                        <h3 className="font-semibold">{selectedChat?.UserName}</h3>
                                        <StatusBadge status={selectedChat?.Status === "Completed" ? "Completed" : "Pending"} />
                                    </div>
                                </div>
                                <button type="button" className="text-xl hover:text-red-400" onClick={() => setIsChatOpen(false)}>✖</button>
                            </div>
                            <ReactScrollToBottom className="h-[500px] overflow-y-auto bg-[#FFF9F1] p-4">
                                {messages.length > 0 ? (() => {
                                    let lastDate = null;
                                    return messages.map((msg, index) => {
                                        const messageDate = new Date(msg.dateTime);
                                        const dateStr = format(messageDate, "dd MMM yyyy");
                                        const timeStr = format(messageDate, "hh:mm a");
                                        const showDate = dateStr !== lastDate;
                                        lastDate = dateStr;
                                        return (
                                            <React.Fragment key={index}>
                                                {showDate && <div className="my-4 text-center text-xs font-medium text-gray-400">{dateStr}</div>}
                                                <div className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                                    <div className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.sender === "user" ? "rounded-br-none bg-[#FF5C00] text-white" : "rounded-bl-none bg-white text-gray-800 shadow-sm"}`}>
                                                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                                        <span className={`mt-1 block text-[10px] ${msg.sender === "user" ? "text-white/80" : "text-gray-400"}`}>{timeStr}</span>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    });
                                })() : <p className="text-center text-gray-400">No messages.</p>}
                            </ReactScrollToBottom>
                        </div>
                    </div>
                )}
            </>)}
        </div>
    );
};
export default ChatHistory;
