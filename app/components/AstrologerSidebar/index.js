"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt, FaWallet, FaCog, FaSignOutAlt, FaPrayingHands,
  FaShoppingBag, FaStar, FaClock, FaUsers, FaUser, FaVideo,
  FaComments, FaCalendarAlt, FaHeadset, FaChevronDown, FaChevronRight,
} from "react-icons/fa";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import socketService from "@/app/services/socketService";
import AstroChatWidget from "@/app/astrologer-panel/astro-chat/AstroChatWidget";
import { AP_ORANGE } from "@/app/lib/astrologerPanelTheme";
import { HelpCard } from "@/app/components/AstrologerPanelUi";
import Image from "next/image";

const AstrologerSidebar = ({ isOpen = true, onNavigate }) => {
  const { loginAstrologerData } = useMenuContext();
  const AstroId = typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") : "";
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [consultOpen, setConsultOpen] = useState(true);

  const isVerified =
    loginAstrologerData?.IsVerified === true ||
    loginAstrologerData?.IsVerified === "true";

  const NAV_MAIN = !isVerified
    ? [{ name: "Profile", icon: FaUser, path: "/astrologer-panel/profile" }]
    : [
      { name: "Dashboard", icon: FaTachometerAlt, path: "/astrologer-panel/dashboard" },
      { name: "Profile", icon: FaUser, path: "/astrologer-panel/profile" },
      {
        name: "Consultations",
        icon: FaComments,
        path: "/astrologer-panel/pending-list",
        children: [
          { name: "Chat Requests", icon: BsChatDots, path: "/astrologer-panel/waiting-list", badge: loginAstrologerData?.TotalChats || null },
          { name: "Call Requests", icon: FiPhoneCall, path: "/astrologer-panel/call-history", badge: loginAstrologerData?.TotalCalls || null },
          { name: "Pending List", icon: FaUsers, path: "/astrologer-panel/pending-list" },
        ],
      },
      { name: "My Reels", icon: FaVideo, path: "/astrologer-panel/my-reels" },
      { name: "Wallet", icon: FaWallet, path: "/astrologer-panel/wallet" },
      { name: "Reviews", icon: FaStar, path: "/astrologer-panel/reviews" },
      { name: "Schedule", icon: FaCalendarAlt, path: "/astrologer-panel/waiting-list" },
      { name: "Settings", icon: FaCog, path: "/astrologer-panel/settings" },
    ];

  const NAV_MORE = isVerified
    ? [
      { name: "My Followers", icon: FaUsers, path: "/astrologer-panel/followers" },
      { name: "Assign Puja", icon: MdOutlineAssignmentTurnedIn, path: "/astrologer-panel/assign-puja" },
      { name: "Suggested Puja", icon: FaPrayingHands, path: "/astrologer-panel/suggested-puja" },
      { name: "Suggested Mall", icon: FaShoppingBag, path: "/astrologer-panel/suggested-mall" },
      { name: "Chat History", icon: BsChatDots, path: "/astrologer-panel/chat-history" },
      { name: "Bank Details", icon: FaWallet, path: "/astrologer-panel/bank-details" },
    ]
    : [];

  const Logout_RemoveRecord = async () => {
    socketService.sendAstro({
      UserId: `WA${AstroId}`,
      Status: "RemoveRecord",
      messageId: "NewRequest",
    });
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      Logout_RemoveRecord();
      socketService.disconnectAstro();
      localStorage.removeItem("AstroLoginId");
      localStorage.removeItem("LoginTokenData");
      localStorage.removeItem("AstroChatTokenId");
      sessionStorage.clear();
      localStorage.clear();
    }
    router.replace("/astrologer-login");
  };

  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current && (loginAstrologerData?.IsChat === true || loginAstrologerData?.IsChat === "true")) {
      if (loginAstrologerData && AstroId) {
        socketService.sendAstro({
          UserId: `WA${AstroId}`,
          Status: "OnlineType",
          Type: "chat",
          ChatOnline: "1",
          CallOnline: loginAstrologerData?.IsCall === true ? "1" : "0",
          BusyType: "0",
          messageId: "NewRequest",
        });
      }
      hasRun.current = true;
    }
  }, [loginAstrologerData, AstroId]);

  const isActive = (path) =>
    pathname === path || pathname?.startsWith(`${path}/`);

  const NavLink = ({ item, nested = false }) => {
    const active = isActive(item.path);
    const Icon = item.icon;
    return (
      <Link
        href={item.path}
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${nested ? "pl-10" : ""
          } ${active
            ? "border-l-[3px] border-[#FF5C00] bg-[#FFF0E6] text-[#FF5C00]"
            : "border-l-[3px] border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#1A1A1A]"
          }`}
      >
        {Icon && <Icon className={`shrink-0 text-base ${active ? "text-[#FF5C00]" : "text-gray-400"}`} />}
        <span className="flex-1 truncate">{item.name}</span>
        {item.badge != null && Number(item.badge) > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF5C00] px-1.5 text-[10px] font-bold text-white">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-gray-100 bg-white shadow-2xl transition-transform lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="border-b border-gray-50 px-4 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo1.webp"
              alt="AstroCall"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
            <div>
              <p className="font-heading text-base font-extrabold" style={{ color: AP_ORANGE }}>AstroCall</p>
              <p className="text-[10px] font-medium text-gray-400">Astrologer Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {NAV_MAIN.map((item) => {
              if (item.children) {
                const groupActive = item.children.some((c) => isActive(c.path)) || isActive(item.path);
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setConsultOpen((v) => !v)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${groupActive
                          ? "border-l-[3px] border-[#FF5C00] bg-[#FFF0E6] text-[#FF5C00]"
                          : "border-l-[3px] border-transparent text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <item.icon className={`text-base ${groupActive ? "text-[#FF5C00]" : "text-gray-400"}`} />
                      <span className="flex-1 text-left">{item.name}</span>
                      {consultOpen ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs" />}
                    </button>
                    {consultOpen && (
                      <ul className="mt-0.5 space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <NavLink item={child} nested />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }
              return (
                <li key={item.name}>
                  <NavLink item={item} />
                </li>
              );
            })}

            {NAV_MORE.length > 0 && (
              <>
                <li className="pt-3">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">More</p>
                </li>
                {NAV_MORE.map((item) => (
                  <li key={item.name}>
                    <NavLink item={item} />
                  </li>
                ))}
              </>
            )}

            <li className="pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutPopup(true)}
                className="flex w-full items-center gap-3 rounded-lg border-l-[3px] border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
              >
                <FaSignOutAlt className="text-base text-gray-400" />
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Help card */}
        <div className="border-t border-gray-50 p-3">
          <HelpCard />
        </div>
      </aside>

      {showLogoutPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to logout?</p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutPopup(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <AstroChatWidget />
    </>
  );
};

export default AstrologerSidebar;
