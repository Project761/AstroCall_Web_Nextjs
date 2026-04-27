"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";
import { IoIosChatbubbles } from "react-icons/io";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
// Custom loading spinner component
const CustomSpinner = () => (<div className="flex justify-center mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>);
// SummaryCard component
const SummaryCard = ({ label, value, subtext }) => (<div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-green-600 mt-1">{subtext}</div>
    </div>);
// Custom scroll to bottom component
const ReactScrollToBottom = ({ children, className }) => (<div className={className}>{children}</div>);
const ChatHistory = () => {
    const router = useRouter();
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
    useEffect(() => {
        if (GetAstroLoginId) {
            fetchChatHistory();
            Get_Data_ChatCallHistory();
            Get_Data_gemstone();
            Get_Data_OnlinePuja();
        }
    }, [GetAstroLoginId]);
    const fetchChatHistory = async () => {
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
    };
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
    const Get_Data_gemstone = async () => {
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
    };
    const Get_Data_ChatCallHistory = async () => {
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
    };
    const Get_Data_OnlinePuja = async () => {
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
    };
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
            console.log('Insert functionality needs TokenWithDeleteUpadateAdd API');
            // const res = await TokenWithDeleteUpadateAdd("Suggestions/Insert_Suggestions", val);
            const res = { success: true }; // Placeholder
            if (res) {
                console.log("Successfully Suggest"); // Replace with toastifySuccess
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
    return (<div className="flex-1 lg:ml-0">
                <div className="main-container px-6 py-6 w-full">
                    <div className="flex items-center gap-2 text-orange-500 w-full py-2 rounded-xl mb-3">
                        <IoIosChatbubbles className="text-3xl"/>
                        <h2 className="text-2xl font-semibold">Chat History</h2>
                    </div>

                    {loading ? (<CustomSpinner />) : (<>
                            <div className="w-full pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div>
                                        <SummaryCard label="Total Chats" value={TotalChatsdata?.TotalChatsCalls || 0} subtext={`${TotalChatsdata?.ChatCallIncreaseMonth || 0} increase this month`}/>
                                    </div>

                                    <div>
                                        <SummaryCard label="Total Duration" value={TotalChatsdata?.TotalDuration || 0} subtext={`Avg. ${TotalChatsdata?.AvgDuration} min per chat`}/>
                                    </div>

                                    <div>
                                        <SummaryCard label="Total Earnings" value={TotalChatsdata?.TotalEarning || 0} subtext={`${TotalChatsdata?.TotalEarningPer}% increase this month`}/>
                                    </div>

                                    <div>
                                        <SummaryCard label="Avg. Rating" value={TotalChatsdata?.AvgRating || 0} subtext={`From ${TotalChatsdata?.AvgRating} ratings`}/>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center justify-between mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        <input type="date" className="border rounded px-3 py-2 text-sm" value={searchDate} onChange={(e) => {
                setSearchDate(e.target.value);
                setCurrentPage(1);
            }}/>
                                        <input type="date" className="border rounded px-3 py-2 text-sm" value={endDate} onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
            }}/>
                                        <input type="text" placeholder="Search by name..." className="border rounded px-3 py-2 text-sm" onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
            }}/>
                                        <select className="border rounded px-3 py-2 text-sm" value={statusFilter} onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
            }}>
                                            <option>All Status</option>
                                            <option>completed</option>
                                            <option>in-progress</option>
                                            <option>Pending</option>
                                            <option>busy</option>
                                            <option>no-answer</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentItems.length > 0 ? (currentItems.map((chat) => (<div key={chat.OrderID} className="p-6 rounded-xl border-t-4 border-orange-400 shadow-md hover:shadow-xl transform hover:scale-105 transition bg-white cursor-pointer">
                                                <div onClick={() => openChat(chat)}>
                                                    <div className="flex items-center space-x-4">
                                                        <img src={chat.UserImage ? `https://${chat.UserImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="Profile" className="w-16 h-16 rounded-full border-2 border-orange-400 hover:border-orange-600 transition"/>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">
                                                                <strong>{chat.UserName}</strong>
                                                                <span className="ml-2 text-sm text-gray-500">(<strong>{chat.UserId}</strong>)</span>
                                                            </h3>
                                                            <p className="text-sm text-gray-500">Order ID: <strong>{chat.OrderID}</strong></p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <strong>{format(new Date(chat.Datetime), "yyyy-MM-dd HH:mm")}</strong>
                                                    </div>

                                                    <div className="mt-2 text-sm text-gray-700">
                                                        Duration: <strong>{chat.Duration} minutes</strong>
                                                    </div>

                                                    <div className="mt-2 text-sm text-gray-700">
                                                        Deduction: <strong>₹{chat.PayableAmount || 'N/A'}</strong>
                                                    </div>

                                                    <div className={`mt-1 font-semibold text-sm ${chat.Status === "Completed" ? "text-green-500" : "text-red-500"}`}>
                                                        <strong>{chat.Status}</strong>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4 mt-4">
                                                    <button className="flex items-center gap-2 border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 font-medium px-5 py-1 rounded-full" onClick={() => { setSuggestStatus(true); setSuggestUserId(chat?.UserId); }}>
                                                        Suggest Remedy
                                                    </button>
                                                </div>
                                            </div>))) : (<div className="text-center col-span-full py-20 text-gray-400 font-semibold">
                                            No Data Available...
                                        </div>)}
                                </div>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (<div className="flex justify-center overflow-x-auto mt-10 space-x-2 items-center">
                                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="text-gray-500 hover:text-black disabled:opacity-40 text-xl px-2">
                                        &#8249;
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                    return (page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1));
                })
                    .map((page, index, arr) => {
                    const prev = arr[index - 1];
                    const showEllipsis = prev && page - prev > 1;
                    return (<React.Fragment key={page}>
                                                    {showEllipsis && (<span className="px-2 text-gray-400 select-none">...</span>)}
                                                    <button onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-md text-sm font-medium transition ${currentPage === page
                            ? "bg-orange-500 text-white"
                            : "text-gray-800 hover:bg-gray-200"}`}>
                                                        {page}
                                                    </button>
                                                </React.Fragment>);
                })}

                                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="text-gray-500 hover:text-black disabled:opacity-40 text-xl px-2">
                                        &#8250;
                                    </button>
                                </div>)}

                            {/* Suggest Remedy Modal */}
                            {SuggestStatus && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white w-full max-w-md rounded-lg h-[80vh] sm:h-[600px] shadow-lg relative overflow-hidden">
                                        {SuggestStatusAdd && productId ? (<div className="flex flex-col h-full">
                                                <div className="bg-orange-100 flex items-center px-4 py-3 font-semibold text-lg relative shadow-sm rounded-t-xl">
                                                    <button className="text-3xl text-gray-700" onClick={() => {
                        setProductId(null);
                    }}>
                                                        <IoArrowBack />
                                                    </button>
                                                    <div className="flex-1 text-center text-gray-800 -ml-6">
                                                        {productId === 1 ? "Gemstone" : "Online Puja"}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-5 overflow-auto">
                                                    {productId === 1
                        ? gemstonedata.map((product) => (<div key={product.GemstoneID} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl shadow-md bg-white">
                                                                <img src={product?.Image1
                                ? `https://${product?.Image1?.replace(/\\/g, "/")}`
                                : "/images/default-image.jpg"} alt="Gemstone" className="w-20 h-20 object-cover rounded-lg border"/>
                                                                <div className="flex flex-col justify-between flex-1">
                                                                    <h3 className="font-semibold text-gray-900 text-base">
                                                                        {product.HeadingDescription}
                                                                    </h3>
                                                                    <h5 className="text-orange-600 font-medium mt-1 text-sm">
                                                                        ₹{product.TotalAmt}
                                                                    </h5>
                                                                </div>
                                                                <button className="ml-auto border border-orange-600 text-orange-600 hover:bg-orange-100 transition px-4 py-1.5 rounded-full text-sm font-medium" onClick={() => { Insert_Suggestions(product); }}>
                                                                    SUGGEST
                                                                </button>
                                                            </div>))
                        : pujadata.map((product) => (<div key={product.PujaID} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl shadow-md bg-white">
                                                                <img src={product?.PujaImage
                                ? `https://${product?.PujaImage.replace(/\\/g, "/")}`
                                : "/images/default-image.jpg"} alt="Puja" className="w-20 h-20 object-cover rounded-lg border"/>
                                                                <div className="flex flex-col justify-between flex-1">
                                                                    <h3 className="font-semibold text-gray-900 text-base">
                                                                        {product.PujaName}
                                                                    </h3>
                                                                    <div className="flex mt-2">
                                                                        <h5 className="text-orange-600 font-medium mt-1 text-sm">
                                                                            ₹{product.TotalAmt}
                                                                        </h5>
                                                                        <button className="ml-auto border border-orange-600 text-orange-600 hover:bg-orange-100 transition px-4 py-1.5 rounded-full text-sm font-medium" onClick={() => { Insert_Suggestions(product); }}>
                                                                            SUGGEST
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>))}
                                                </div>
                                            </div>) : SuggestStatusAdd ? (<div className="flex flex-col h-full">
                                                <div className="bg-orange-100 flex items-center px-4 py-3 font-semibold text-lg relative shadow-sm rounded-t-xl">
                                                    <button className="text-3xl text-gray-700" onClick={() => {
                        setSuggestStatusAdd(false);
                    }}>
                                                        <IoArrowBack />
                                                    </button>
                                                    <div className="flex-1 text-center text-gray-800 -ml-6">
                                                        Astromall
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-5 overflow-auto">
                                                    {products.map((product) => (<div key={product.id} className="flex items-center gap-4 p-3 border rounded-xl shadow-sm cursor-pointer" onClick={() => {
                            setProductId(product.id);
                        }}>
                                                            <img src={product?.image ? `https://${product?.image?.replace(/\\/g, "/")}` : "/images/default-image.jpg"} alt={product.title} className="w-20 h-20 object-cover rounded-md"/>
                                                            <h3 className="font-medium text-gray-800">{product.title}</h3>
                                                        </div>))}
                                                </div>
                                            </div>) : (<div className="flex flex-col h-full">
                                                <div className="bg-orange-100 text-center py-3 px-4 font-semibold text-lg relative" id="suggest-remedy-title">
                                                    Suggest Remedy
                                                    <button onClick={() => setSuggestStatus(false)} className="absolute right-3 top-3 text-gray-500 hover:text-black text-xl">
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="flex-1 p-4 overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-4">
                                                    <p>You can suggest any remedy to the customer (like a doctor).</p>
                                                    <p>It can be a free mantra, advice, etc.</p>
                                                    <p>
                                                        Or a paid product like gemstone, online puja, healing, etc. which
                                                        you can sell or refer to Astromall.
                                                    </p>
                                                    <p>
                                                        You get 50% revenue if customer buys from you. If you refer to
                                                        Astromall, you get 10%.
                                                    </p>
                                                </div>

                                                <div className="p-4 border-t text-center">
                                                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium" onClick={() => setSuggestStatusAdd(true)}>
                                                        + Add
                                                    </button>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>)}
                        </>)}

                    {/* Chat Popup */}
                    {isChatOpen && selectedChat && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                            <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
                                <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <img src={selectedChat.UserImage ? `https://${selectedChat.UserImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="Profile" className="w-12 h-12 rounded-full"/>
                                        <div>
                                            <h3 className="text-lg font-semibold">{selectedChat?.UserName}</h3>
                                            <div className={`text-sm font-semibold ${selectedChat?.Status === "Completed" ? "text-green-400" : "text-red-400"}`}>
                                                {selectedChat?.Status}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-white text-lg hover:text-red-500" onClick={() => setIsChatOpen(false)}>
                                        ✖
                                    </button>
                                </div>

                                <ReactScrollToBottom className="h-[500px] p-4 overflow-y-auto bg-gray-100">
                                    {messages.length > 0 ? ((() => {
                let lastDate = null;
                return messages.map((msg, index) => {
                    const messageDate = new Date(msg.dateTime);
                    const dateStr = format(messageDate, "dd MMM yyyy");
                    const timeStr = format(messageDate, "hh:mm a");
                    const showDate = dateStr !== lastDate;
                    lastDate = dateStr;
                    return (<React.Fragment key={index}>
                                                        {showDate && (<div className="text-center my-4 text-sm font-medium text-gray-500">
                                                                {dateStr}
                                                            </div>)}
                                                        <div className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                                            <div className={`relative max-w-[80%] px-4 py-3 pr-14 pb-6 rounded-2xl shadow-sm text-sm break-words min-h-[40px] ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
                                                                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text }}/>
                                                                <span className={`absolute bottom-1 right-3 text-[10px] ${msg.sender === "user" ? "text-white/100" : "text-gray-400"}`}>
                                                                    {timeStr}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>);
                });
            })()) : (<p className="text-center text-gray-400">No messages.</p>)}
                                </ReactScrollToBottom>

                                <div className="h-4 bg-gray-900"></div>
                            </div>
                        </div>)}
                </div>
        </div>);
};
export default ChatHistory;
