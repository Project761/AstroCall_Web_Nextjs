"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaComments, FaClock, FaWallet, FaStar } from "react-icons/fa";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  UserPanelPage,
  PanelCard,
  PanelLoader,
  PanelStatCard,
  PanelSectionTitle,
  PanelPagination,
  PanelEmpty,
  StatusBadge,
} from "../components/UserPanelPage";

const stripIdPrefix = (id) => String(id || "").replace(/^[A-Za-z]+/, "");

const ReactScrollToBottom = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const mapChatMessages = (res) =>
  (res || []).map((item) => ({
    sender: item.IsfromAstro ? "astro" : "user",
    text: item.Message,
    dateTime: item.DateTimes,
  }));

export default function MyChatsClient() {
  const router = useRouter();
  const UserLoginId =
    typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

  const userData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const loginData = localStorage.getItem("LoginTokenData");
      return loginData ? JSON.parse(loginData) : null;
    } catch {
      return null;
    }
  }, []);

  const [chatData, setChatData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchChatHistory = useCallback(async () => {
    if (!UserLoginId) return;
    const payload = {
      IsActive: "1",
      UserId: UserLoginId,
      UserID: UserLoginId,
      Type: "chat",
    };
    try {
      const res = await postWithToken("ChatHistory/GetData_ChatHistory", payload);
      setChatData(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error(error);
      setChatData([]);
    } finally {
      setLoading(false);
    }
  }, [UserLoginId]);

  useEffect(() => {
    if (!userData) {
      router.push("/");
      return;
    }
    if (!UserLoginId) return;
    const timer = setTimeout(() => {
      fetchChatHistory();
    }, 0);
    return () => clearTimeout(timer);
  }, [userData, UserLoginId, router, fetchChatHistory]);

  const openChat = async (chat) => {
    setSelectedChat(chat);
    setIsChatOpen(true);
    setMessages([]);
    setMessagesLoading(true);

    const payload = {
      UserID: stripIdPrefix(chat?.UserId || UserLoginId),
      AstroID: stripIdPrefix(chat?.AstroId),
      chatOrderId: chat?.OrderID,
    };

    try {
      const res = await postWithToken("Chat/ReturnChat", payload);
      setMessages(mapChatMessages(res));
    } catch (error) {
      console.error(error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedChat(null);
    setMessages([]);
  };

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const filteredData = useMemo(() => {
    return (chatData || []).filter((item) => {
      const itemDate = new Date(item.Datetime);
      const astroName = (item?.AstrologerName || item?.AstroName || "").toLowerCase();
      const matchesName = astroName.includes(searchName.toLowerCase());
      const matchesDate =
        searchDate || endDate
          ? (!searchDate || itemDate >= new Date(searchDate)) &&
            (!endDate || itemDate <= new Date(endDate))
          : itemDate >= sevenDaysAgo && itemDate <= today;
      const matchesStatus =
        statusFilter === "All Status"
          ? true
          : item?.Status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesName && matchesDate && matchesStatus;
    });
  }, [chatData, searchName, searchDate, endDate, statusFilter, sevenDaysAgo, today]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const chatStats = useMemo(() => {
    const list = chatData || [];
    const thisMonth = list.filter((item) => {
      const d = new Date(item.Datetime);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalDuration = list.reduce((sum, item) => sum + (Number(item.Duration) || 0), 0);
    const totalSpent = list.reduce((sum, item) => sum + (Number(item.PayableAmount) || 0), 0);
    const avgDuration = list.length ? Math.round(totalDuration / list.length) : 0;
    return {
      totalChats: list.length,
      thisMonth: thisMonth.length,
      totalDuration,
      avgDuration,
      totalSpent,
    };
  }, [chatData]);

  if (!userData) return <PanelLoader />;

  return (
    <UserPanelPage title="My Chats" subtitle="View your chat history with astrologers">
      {loading ? (
        <PanelLoader />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PanelStatCard
              icon={FaComments}
              label="Total Chats"
              value={chatStats.totalChats}
              linkText={`${chatStats.thisMonth} this month`}
            />
            <PanelStatCard
              icon={FaClock}
              label="Total Duration"
              value={`${chatStats.totalDuration} min`}
              linkText={`Avg. ${chatStats.avgDuration} min`}
            />
            <PanelStatCard
              icon={FaWallet}
              label="Total Spent"
              value={`₹${chatStats.totalSpent}`}
              linkText="On chat sessions"
            />
            <PanelStatCard
              icon={FaStar}
              label="Sessions"
              value={filteredData.length}
              linkText="In current filter"
            />
          </div>

          <PanelCard>
            <PanelSectionTitle
              title="Chat Sessions"
              subtitle="Tap a session to view the full transcript"
            />

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                type="date"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]"
                value={searchDate}
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <input
                type="date"
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <input
                type="text"
                placeholder="Search astrologer..."
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <select
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Status</option>
                <option>completed</option>
                <option>in-progress</option>
                <option>Pending</option>
                <option>busy</option>
                <option>no-answer</option>
              </select>
            </div>

            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((chat) => (
                  <div
                    key={chat.OrderID}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer rounded-xl border border-gray-100 bg-[#FFF9F1] p-5 transition hover:border-orange-200 hover:shadow-md"
                    onClick={() => openChat(chat)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openChat(chat);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={toCdnSrcOrFallback(chat?.AstroImage)}
                        alt={chat.AstrologerName || "Astrologer"}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-50"
                        unoptimized={!!chat?.AstroImage}
                      />
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-[#1A1A1A]">
                          {chat.AstrologerName || chat.AstroName || "Astrologer"}
                        </h3>
                        <p className="text-xs text-gray-400">Order #{chat.OrderID}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      <p>
                        {chat.Datetime
                          ? format(new Date(chat.Datetime), "dd MMM yyyy, HH:mm")
                          : "—"}
                      </p>
                      <p>{chat.Duration || 0} min · ₹{chat.PayableAmount || 0}</p>
                      <StatusBadge
                        status={
                          chat.Status?.toLowerCase() === "completed" ? "Completed" : "Pending"
                        }
                      />
                    </div>
                    <p className="mt-2 text-[10px] font-medium text-[#FF5C00]">
                      Tap to view transcript →
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <PanelEmpty
                title="No chat history yet"
                description="Start a chat with an astrologer to see your sessions here."
              />
            )}

            <PanelPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </PanelCard>
        </>
      )}

      {isChatOpen && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between bg-[#FF5C00] p-4 text-white">
              <div className="flex items-center gap-3">
                <Image
                  src={toCdnSrcOrFallback(selectedChat?.AstroImage)}
                  alt={selectedChat?.AstrologerName || "Astrologer"}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30"
                  unoptimized={!!selectedChat?.AstroImage}
                />
                <div>
                  <h3 className="font-semibold">
                    {selectedChat?.AstrologerName || selectedChat?.AstroName}
                  </h3>
                  <StatusBadge
                    status={
                      selectedChat?.Status?.toLowerCase() === "completed"
                        ? "Completed"
                        : "Pending"
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                className="text-xl hover:text-red-200"
                onClick={closeChat}
                aria-label="Close chat"
              >
                ✖
              </button>
            </div>

            <ReactScrollToBottom className="h-[500px] overflow-y-auto bg-[#FFF9F1] p-4">
              {messagesLoading ? (
                <p className="py-10 text-center text-sm text-gray-400">Loading messages...</p>
              ) : messages.length > 0 ? (
                (() => {
                  let lastDate = null;
                  return messages.map((msg, index) => {
                    const messageDate = new Date(msg.dateTime);
                    const dateStr = format(messageDate, "dd MMM yyyy");
                    const timeStr = format(messageDate, "hh:mm a");
                    const showDate = dateStr !== lastDate;
                    lastDate = dateStr;
                    const isUser = msg.sender === "user";

                    return (
                      <React.Fragment key={`${msg.dateTime}-${index}`}>
                        {showDate && (
                          <div className="my-4 text-center text-xs font-medium text-gray-400">
                            {dateStr}
                          </div>
                        )}
                        <div className={`mb-3 flex ${isUser ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                              isUser
                                ? "rounded-br-none bg-[#FF5C00] text-white"
                                : "rounded-bl-none bg-white text-gray-800 shadow-sm"
                            }`}
                          >
                            <div
                              className="whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ __html: msg.text }}
                            />
                            <span
                              className={`mt-1 block text-[10px] ${
                                isUser ? "text-white/80" : "text-gray-400"
                              }`}
                            >
                              {timeStr}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()
              ) : (
                <p className="py-10 text-center text-gray-400">No messages in this session.</p>
              )}
            </ReactScrollToBottom>
          </div>
        </div>
      )}
    </UserPanelPage>
  );
}
