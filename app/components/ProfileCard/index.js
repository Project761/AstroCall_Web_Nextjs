"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { FaChevronRight, FaCoins, FaSignOutAlt, FaComments, FaPhone, FaBolt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import {
  USER_PANEL_NAV,
  LOGOUT_NAV,
  isPanelNavActive,
  calcProfileCompletion,
  ORANGE,
} from "@/app/lib/userPanelNav";
import { CREAM, CREAM_ALT, PEACH } from "@/app/lib/siteTheme";
import { UpdateWebFCMToken } from "@/app/utils/api";

function getProfileImage(user) {
  if (user?.ProfilePic) {
    const pic = String(user.ProfilePic).replace(/\\/g, "/");
    return pic.startsWith("http") ? pic : `https://${pic}`;
  }
  return "/images/profile pic.webp";
}

function getDisplayName(user) {
  const first = user?.FirstName?.trim();
  const last = user?.LastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ");
  return user?.UserName || user?.MobileNo || "Welcome";
}

const MENU_SECTIONS = [
  { title: "Account", hrefs: ["/my-account", "/my-account/edit-profile", "/my-wallet", "/notification"] },
  // { title: "Activity", hrefs: ["/my-chats", "/my-calls", "/my-favorites", "/my-following"] },
  // { title: "Services", hrefs: ["/my-gemstone", "/my-online-puja", "/freekundli", "/my-account/suggested", "/wait-list"] },
  { title: "More", hrefs: ["/plans", "/support"] },
];

const QUICK_ACTIONS = [
  { label: "Chat", href: "/my-chats", icon: FaComments },
  { label: "Calls", href: "/my-calls", icon: FaPhone },
  { label: "Recharge", href: "/plans", icon: FaBolt },
];

export default function ProfileCard({ onClose, isOpen, onLogout, variant = "dropdown" }) {
  const { loginUserData } = useMenuContext();
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef(null);

  const { percent: profilePercent } = useMemo(
    () => calcProfileCompletion(loginUserData),
    [loginUserData]
  );

  const navByHref = useMemo(
    () => Object.fromEntries(USER_PANEL_NAV.map((item) => [item.href, item])),
    []
  );

  useEffect(() => {
    if (variant !== "dropdown") return;
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target) && isOpen) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose, variant]);

  const handleNavigation = (path) => {
    router.push(path);
    onClose?.();
  };

  // const handleLogout = () => {
  //   if (onLogout) onLogout();
  //   else {
  //     localStorage.clear();
  //     sessionStorage.clear();
  //     router.push("/");
  //   }
  //   onClose?.();
  // };
  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("UserLoginId");

      if (userId) {
        await UpdateWebFCMToken("");
      }

      if (onLogout) {
        onLogout();
      } else {
        localStorage.clear();
        sessionStorage.clear();
        router.push("/");
      }

      onClose?.();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  const isDropdown = variant === "dropdown";
  const walletAmt = loginUserData?.WalletAmt ?? 0;
  const profileImg = getProfileImage(loginUserData);

  const containerClass = isDropdown
    ? "absolute right-0 top-full z-50 mt-2 w-[min(340px,calc(100vw-1.5rem))] overflow-hidden rounded-[20px] border border-orange-100 bg-white shadow-[0_20px_56px_rgba(255,92,0,0.16)]"
    : "w-full rounded-2xl border border-orange-100 bg-[#FFFBF7] p-2";

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const active = isPanelNavActive(pathname, item.href);
    return (
      <button
        key={item.href}
        type="button"
        onClick={() => handleNavigation(item.href)}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active
          ? "bg-gradient-to-r from-orange-50 to-[#FFF9F1] shadow-sm ring-1 ring-orange-100"
          : "hover:bg-white hover:shadow-sm"
          }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${active ? "bg-[#FF5C00] text-white shadow-md shadow-orange-200/50" : "bg-white text-[#FF5C00] ring-1 ring-orange-100"
            }`}
        >
          <Icon size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`font-body text-[13px] font-semibold ${active ? "text-[#FF5C00]" : "text-[#1A1A1A]"}`}>
            {item.label}
          </p>
        </div>
        {item.badge ? (
          <span className="min-w-[20px] rounded-full bg-[#FF5C00] px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
            {item.badge}
          </span>
        ) : null}
        <FaChevronRight
          className={`shrink-0 text-[9px] transition group-hover:translate-x-0.5 ${active ? "text-[#FF5C00]" : "text-gray-300"
            }`}
        />
      </button>
    );
  };

  return (
    <div ref={profileRef} className={containerClass}>
      {isDropdown && <div className="h-1 bg-gradient-to-r from-[#FF5C00] via-[#FF7A33] to-[#FF5C00]" />}

      {loginUserData && (
        <div
          className={`border-b border-orange-100 px-4 py-4 ${isDropdown ? "" : "rounded-xl"}`}
          style={{ background: `linear-gradient(145deg, ${CREAM} 0%, ${PEACH} 55%, ${CREAM_ALT} 100%)` }}
        >
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="relative h-[52px] w-[52px] overflow-hidden rounded-full ring-[3px] ring-white shadow-md">
                <Image
                  src={profileImg}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="52px"
                  unoptimized={profileImg.startsWith("http")}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                <MdVerified className="text-sm text-[#3B82F6]" />
              </span>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="font-heading truncate text-[15px] font-bold text-[#1A1A1A]">
                {getDisplayName(loginUserData)}
              </p>
              {loginUserData?.MobileNo && (
                <p className="font-body mt-0.5 truncate text-xs text-gray-500">+91 {loginUserData.MobileNo}</p>
              )}
              {/* <button
                type="button"
                onClick={() => handleNavigation("/my-account/edit-profile")}
                className="font-body mt-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-gray-600 shadow-sm ring-1 ring-orange-100 transition hover:text-[#FF5C00]"
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {profilePercent}%
                </span>
                Complete your profile
              </button> */}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={() => handleNavigation("/my-wallet")}
              className="font-body flex items-center gap-2.5 rounded-xl border border-white/80 bg-white/95 px-3 py-2.5 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-[#FFF0E6] text-[#FF5C00]">
                <FaCoins size={15} />
              </span>
              <span>
                <span className="block text-[10px] font-medium uppercase tracking-wide text-gray-400">Wallet</span>
                <span className="font-heading text-base font-bold text-[#1A1A1A]">₹{walletAmt}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/plans")}
              className="font-heading self-stretch rounded-xl px-4 text-xs font-bold text-white shadow-md shadow-orange-200/40 transition hover:brightness-105"
              style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #FF7A33 100%)` }}
            >
              + Recharge
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <button
                key={href}
                type="button"
                onClick={() => handleNavigation(href)}
                className="flex flex-col items-center gap-1 rounded-xl border border-white/70 bg-white/80 py-2.5 text-center shadow-sm transition hover:border-orange-200 hover:bg-white"
              >
                <Icon size={14} className="text-[#FF5C00]" />
                <span className="font-body text-[10px] font-semibold text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isDropdown && (
        <p className="mb-2 mt-1 px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">My Account</p>
      )}

      <div
        className={`${isDropdown
          ? "max-h-[min(46vh,380px)] overflow-y-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-200"
          : "space-y-3 px-1 py-1"
          }`}
      >
        {MENU_SECTIONS.map((section) => {
          const items = section.hrefs.map((href) => navByHref[href]).filter(Boolean);
          if (!items.length) return null;
          return (
            <div key={section.title}>
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                {section.title}
              </p>
              <div className="space-y-0.5">{items.map(renderMenuItem)}</div>
            </div>
          );
        })}
      </div>

      <div
        className={`border-t border-orange-100 px-2 py-2 ${isDropdown ? "bg-gradient-to-b from-white to-[#FFF9F1]" : "mt-1"}`}
      >
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-red-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 ring-1 ring-red-100 transition group-hover:bg-red-100">
            <FaSignOutAlt size={14} />
          </span>
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-red-500">{LOGOUT_NAV.label}</p>
            <p className="text-[10px] text-red-400">Sign out from AstroCall</p>
          </div>
          <FaChevronRight className="text-[9px] text-red-300" />
        </button>
      </div>
    </div>
  );
}
