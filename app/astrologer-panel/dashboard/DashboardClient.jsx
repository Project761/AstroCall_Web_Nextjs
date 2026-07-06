"use client";

import socketService from "@/app/services/socketService";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaWallet, FaStar, FaComments, FaPhone, FaVideo, FaTrophy,
  FaCalendarCheck, FaUser, FaCog, FaChartLine, FaBullhorn,
} from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { useRouter } from "next/navigation";
import {
  PanelPageHeader, StatCard, MiniStat, PanelCard, PanelToggle, RightWidget, ServiceBadge,
} from "@/app/components/AstrologerPanelUi";
import { AP_BTN_OUTLINE, AP_BTN_PRIMARY, AP_ORANGE } from "@/app/lib/astrologerPanelTheme";

export default function AstrologerDashboard() {
  const AstroId = typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") : "";
  const { loginAstrologerData, astrologerToggleStatus } = useMenuContext();
  const router = useRouter();

  const [isCheckedCall, setIsCheckedCall] = useState(false);
  const [isCheckedChat, setIsCheckedChat] = useState(false);

  const handleChatToggle = () => {
    const newState = !isCheckedChat;
    setIsCheckedChat(newState);
    socketService.sendAstro({
      UserId: `WA${AstroId}`,
      Status: newState ? "OnlineType" : "ToggleClose",
      Type: "chat",
      ChatOnline: newState ? "1" : "0",
      CallOnline: isCheckedCall ? "1" : "0",
      BusyType: "0",
      messageId: "NewRequest",
    });
  };

  const handleCallToggle = () => {
    const newState = !isCheckedCall;
    setIsCheckedCall(newState);
    if (newState) {
      socketService.sendAstro({
        UserId: `WA${AstroId}`,
        Status: "OnlineType",
        Type: "call",
        CallOnline: "1",
        ChatOnline: isCheckedChat ? "1" : "0",
        BusyType: "0",
        messageId: "NewRequest",
      });
    } else {
      socketService.sendAstro({
        UserId: `WA${AstroId}`,
        Status: "ToggleClose",
        Type: "call",
        CallOnline: "0",
        ChatOnline: isCheckedChat ? "1" : "0",
      });
    }
  };

  useEffect(() => {
    if (loginAstrologerData) {
      const savedChat = sessionStorage.getItem("IsChat");
      const savedCall = sessionStorage.getItem("IsCall");
      const timer = setTimeout(() => {
        if (savedChat === null) {
          const apiChatValue = loginAstrologerData?.IsChat === true || loginAstrologerData?.IsChat === "true";
          setIsCheckedChat(apiChatValue);
          sessionStorage.setItem("IsChat", apiChatValue);
        }
        if (savedCall === null) {
          const apiCallValue = loginAstrologerData?.IsCall === true || loginAstrologerData?.IsCall === "true";
          setIsCheckedCall(apiCallValue);
          sessionStorage.setItem("IsCall", apiCallValue);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [loginAstrologerData]);

  useEffect(() => {
    sessionStorage.setItem("IsChat", isCheckedChat);
    sessionStorage.setItem("IsCall", isCheckedCall);
  }, [isCheckedChat, isCheckedCall]);

  useEffect(() => {
    if (!loginAstrologerData) return;
    const isChat = loginAstrologerData?.IsChat === true || loginAstrologerData?.IsChat === "true";
    const isCall = loginAstrologerData?.IsCall === true || loginAstrologerData?.IsCall === "true";
    const timer = setTimeout(() => {
      setIsCheckedChat(isChat);
      setIsCheckedCall(isCall);
      sessionStorage.setItem("IsChat", isChat);
      sessionStorage.setItem("IsCall", isCall);
      if (isCall) {
        socketService.sendAstro({
          UserId: `WA${AstroId}`,
          Status: "OnlineType",
          Type: "call",
          CallOnline: "1",
          ChatOnline: isChat ? "1" : "0",
          BusyType: "0",
          messageId: "NewRequest",
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [loginAstrologerData, AstroId]);

  useEffect(() => {
    const data = astrologerToggleStatus;
    if (!data) return;
    const astroId = data?.UserId?.replace(/[a-zA-Z]/g, "");
    if (astroId !== AstroId) return;
    const timer = setTimeout(() => {
      if (data.Type === "chat") {
        if (data.Message === "This Astrologer is Online") {
          setIsCheckedChat(true);
          sessionStorage.setItem("IsChat", "true");
        } else if (data.Message === "This Astrologer is Offline") {
          setIsCheckedChat(false);
          sessionStorage.setItem("IsChat", "false");
        }
      }
      if (data.Type === "call") {
        if (data.Message === "This Astrologer is Online") {
          setIsCheckedCall(true);
          sessionStorage.setItem("IsCall", "true");
        } else if (data.Message === "This Astrologer is Offline") {
          setIsCheckedCall(false);
          sessionStorage.setItem("IsCall", "false");
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [astrologerToggleStatus, AstroId]);

  const name = loginAstrologerData?.DisplayName || "Astrologer";
  const price = loginAstrologerData?.AstroPricePerMin || "—";

  const quickLinks = [
    { label: "Update Availability", icon: FaCalendarCheck, path: "/astrologer-panel/settings" },
    { label: "Manage Services", icon: FaCog, path: "/astrologer-panel/profile" },
    { label: "Earnings Report", icon: FaChartLine, path: "/astrologer-panel/wallet" },
    { label: "Promote Profile", icon: FaBullhorn, path: "/astrologer-panel/profile" },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title={`Welcome back, ${name} 🙏`}
        breadcrumbs={["Dashboard"]}
        description="Your personalized dashboard — quick actions and insights."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          {/* Top stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={FaWallet}
              iconBg="bg-orange-50"
              label="Today's Earnings"
              value={`₹${loginAstrologerData?.TodayEarning || loginAstrologerData?.WalletBalance || 0}`}
              trend="↑ 12% from yesterday"
            />
            <StatCard
              icon={FaChartLine}
              iconBg="bg-purple-50"
              label="Monthly Earnings"
              value={`₹${loginAstrologerData?.MonthEarning || "92,500"}`}
              trend="↑ 18% from last month"
            />
            <StatCard
              icon={FaWallet}
              iconBg="bg-green-50"
              label="Available Balance"
              value={`₹${loginAstrologerData?.WalletBalance || 0}`}
              sub="Ready to withdraw"
            />
            <StatCard
              icon={FaStar}
              iconBg="bg-yellow-50"
              label="Your Rating"
              value={`${loginAstrologerData?.StarCount || "4.9"} ★`}
              sub={`(${loginAstrologerData?.TotalReviews || "512"} Reviews)`}
            />
          </div>

          {/* Today's overview + availability */}
          <div className="grid gap-4 lg:grid-cols-2">
            <PanelCard title="Today's Overview">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat icon={BsChatDots} iconBg="bg-purple-100 text-purple-600" label="Chat Requests" value={loginAstrologerData?.TotalChats || 0} />
                <MiniStat icon={FiPhoneCall} iconBg="bg-green-100 text-green-600" label="Call Requests" value={loginAstrologerData?.TotalCalls || 0} />
                <MiniStat icon={FaVideo} iconBg="bg-orange-100 text-[#FF5C00]" label="Video Calls" value="3" />
                <MiniStat icon={FaComments} iconBg="bg-red-100 text-red-600" label="Missed Chats" value="1" />
              </div>
            </PanelCard>

            <PanelCard
              title="Service Availability"
              action={
                <Link href="/astrologer-panel/settings" className="text-xs font-semibold text-[#FF5C00] hover:underline">
                  Manage →
                </Link>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Chat</p>
                    <p className="text-xs text-gray-500">₹{price}/min</p>
                  </div>
                  <PanelToggle checked={isCheckedChat} onChange={handleChatToggle} label={isCheckedChat ? "Online" : "Offline"} />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Call</p>
                    <p className="text-xs text-gray-500">₹{price}/min</p>
                  </div>
                  <PanelToggle checked={isCheckedCall} onChange={handleCallToggle} label={isCheckedCall ? "Online" : "Offline"} />
                </div>
              </div>
            </PanelCard>
          </div>

          {/* Quick access grid */}
          <PanelCard title="Quick Access">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {[
                { label: "Chat Requests", icon: BsChatDots, path: "/astrologer-panel/waiting-list" },
                { label: "Call History", icon: FiPhoneCall, path: "/astrologer-panel/call-history" },
                { label: "Wallet", icon: FaWallet, path: "/astrologer-panel/wallet" },
                { label: "My Reviews", icon: FaStar, path: "/astrologer-panel/reviews" },
                { label: "Pending List", icon: FaUser, path: "/astrologer-panel/pending-list" },
                { label: "My Followers", icon: FaUser, path: "/astrologer-panel/followers" },
                { label: "Assign Puja", icon: FaCalendarCheck, path: "/astrologer-panel/assign-puja" },
                { label: "Settings", icon: FaCog, path: "/astrologer-panel/settings" },
              ].map(({ label, icon: Icon, path }) => (
                <Link
                  key={path}
                  href={path}
                  className="flex flex-col items-center rounded-xl border border-gray-100 bg-[#FFF9F1] p-4 transition hover:border-orange-200 hover:shadow-sm"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                    <Icon className="text-lg text-[#FF5C00]" />
                  </div>
                  <span className="text-center text-xs font-semibold text-gray-700">{label}</span>
                </Link>
              ))}
            </div>
          </PanelCard>

          {/* Motivation banner */}
          <div
            className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-orange-100 p-5 sm:flex-row sm:items-center"
            style={{ background: "linear-gradient(135deg, #FFF0E6 0%, #FFF9F1 100%)" }}
          >
            <div className="flex items-start gap-3">
              <FaStar className="mt-0.5 text-2xl text-yellow-500" />
              <div>
                <p className="font-bold text-[#1A1A1A]">Great Going!</p>
                <p className="text-sm text-gray-600">You&apos;re doing amazing. Keep your availability high to get more consultations.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaTrophy className="text-2xl text-[#FF5C00]" />
              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">Top 10% Astrologers</p>
                <button type="button" className={AP_BTN_OUTLINE}>View Leaderboard</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar widgets */}
        <aside className="space-y-4">
          <RightWidget title="Profile Completion">
            <div className="flex flex-col items-center py-2">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={AP_ORANGE} strokeWidth="8" strokeDasharray="264" strokeDashoffset="40" strokeLinecap="round" />
                </svg>
                <span className="absolute text-lg font-extrabold text-[#FF5C00]">85%</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">Almost Complete!</p>
              <Link href="/astrologer-panel/profile" className={`${AP_BTN_OUTLINE} mt-3 w-full text-xs`}>
                Complete Now
              </Link>
            </div>
          </RightWidget>

          <RightWidget title="Quick Actions">
            <ul className="space-y-2">
              {quickLinks.map(({ label, icon: Icon, path }) => (
                <li key={label}>
                  <Link href={path} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-[#FF5C00]">
                    <Icon className="text-[#FF5C00]" />
                    {label}
                    <span className="ml-auto text-gray-300">›</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/astrologer-panel/profile" className={`${AP_BTN_OUTLINE} mt-3 w-full text-xs`}>
              View Profile
            </Link>
          </RightWidget>

          <RightWidget
            title="Top Services"
            action={<Link href="/astrologer-panel/profile" className="text-xs text-[#FF5C00]">Manage</Link>}
          >
            <ul className="space-y-3">
              {[
                { name: "Kundli Analysis", rate: `₹${price}/min`, icon: FaComments },
                { name: "Career Guidance", rate: `₹${price}/min`, icon: FaPhone },
                { name: "Love Compatibility", rate: `₹${price}/min`, icon: FaVideo },
              ].map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <s.icon className="text-sm text-[#FF5C00]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#1A1A1A]">{s.name}</p>
                    <p className="text-[10px] text-gray-500">{s.rate}</p>
                  </div>
                </li>
              ))}
            </ul>
          </RightWidget>
        </aside>
      </div>
    </div>
  );
}
