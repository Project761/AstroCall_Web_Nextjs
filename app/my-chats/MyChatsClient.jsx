"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";
import { IoIosChatbubbles } from "react-icons/io";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
import { UserPanelPage, PanelCard, PanelLoader } from "../components/UserPanelPage";
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

  const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
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
      UserID: UserLoginId,
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
  }, [UserLoginId]);

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
      AstroID: UserLoginId,
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
  }, [UserLoginId]);

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
    if (UserLoginId) {
      queueMicrotask(() => {
        fetchChatHistory();
        Get_Data_ChatCallHistory();
        Get_Data_gemstone();
        Get_Data_OnlinePuja();
      });
    }
  }, [UserLoginId, fetchChatHistory, Get_Data_ChatCallHistory, Get_Data_gemstone, Get_Data_OnlinePuja]);
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
      AstrologerId: UserLoginId,
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
    <UserPanelPage title="My Chats" subtitle="View your chat history with astrologers">
      {loading ? <PanelLoader /> : currentItems.length === 0 ? (
        <PanelCard className="py-16 text-center text-sm text-gray-500">No chat history yet.</PanelCard>
      ) : (
        <div className="space-y-3">
          {currentItems.map((chat) => (
            <PanelCard key={chat.OrderID} className="!p-4 cursor-pointer hover:border-orange-200" onClick={() => openChat(chat)}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={chat?.AstroImage ? `https://${chat.AstroImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-orange-100" />
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{chat.AstrologerName}</p>
                    <p className="text-xs text-gray-500">Order #{chat.OrderID} · {chat.Duration} min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{chat.Datetime ? format(new Date(chat.Datetime), "dd MMM yyyy, hh:mm a") : ""}</p>
                  <p className="text-sm font-bold text-[#FF5C00]">₹{chat.PayableAmount || "N/A"}</p>
                </div>
              </div>
            </PanelCard>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-lg bg-gray-100 px-3 py-1 text-sm disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 text-sm">{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-lg bg-gray-100 px-3 py-1 text-sm disabled:opacity-50">Next</button>
        </div>
      )}

      {isChatOpen && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between bg-[#FF5C00] p-4 text-white">
              <div className="flex items-center gap-3">
                <img src={selectedChat.AstroImage ? `https://${selectedChat.AstroImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="Profile" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30" />
                <div>
                  <h3 className="font-semibold">{selectedChat?.AstrologerName}</h3>
                  <span className={`text-xs font-medium ${selectedChat?.Status === "Completed" ? "text-green-200" : "text-orange-100"}`}>
                    {selectedChat?.Status}
                  </span>
                </div>
              </div>
              <button type="button" className="text-xl hover:text-red-200" onClick={() => setIsChatOpen(false)}>✖</button>
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
                  const isUser = msg.sender === "user";
                  return (
                    <React.Fragment key={index}>
                      {showDate && <div className="my-4 text-center text-xs font-medium text-gray-400">{dateStr}</div>}
                      <div className={`mb-3 flex ${isUser ? "justify-start" : "justify-end"}`}>
                        <div className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm ${isUser ? "rounded-bl-md border border-orange-100 bg-white text-gray-800" : "rounded-br-md bg-[#FF5C00] text-white"}`}>
                          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text }} />
                          <span className={`mt-1 block text-[10px] ${isUser ? "text-gray-400" : "text-orange-100"}`}>{timeStr}</span>
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
    </UserPanelPage>
  );
};
export default ChatHistory;
