"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import ProfileCard from "../ProfileCard";
import ClientOnly from "../ClientOnly";
import { toastifySuccess } from "../../utils/utility";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { RiUserShared2Fill } from "react-icons/ri";
import { FaChevronDown, FaPlus, FaCoins, FaTimes } from "react-icons/fa";
import { ORANGE, CREAM, CREAM_ALT } from "@/app/lib/siteTheme";
import { isUserPanelRoute } from "@/app/lib/userPanelNav";
import { MdLanguage } from "react-icons/md";
import socketService from "@/app/services/socketService";
import PerfRenderMark from "../PerfRenderMark";

const AuthModal = dynamic(() => import("../AuthModal"), { ssr: false, loading: () => null });
const UserChatWidget = dynamic(() => import("@/app/user-chat/UserChatWidget"), {
  ssr: false,
  loading: () => null,
});

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Horoscope", href: "/daily-horoscope" },
  { label: "Kundli", href: "/freekundli" },
  { label: "Puja", href: "/online-puja" },
  { label: "Store", href: "/gemstone" },
  { label: "Reels", href: "/reels", fullLabel: "Astro Reels" },
  { label: "Blog", href: "/astrology-blog" },

];

const LANGUAGES = [
  { code: "EN", label: "English", native: "English" },
  { code: "HI", label: "Hindi", native: "हिन्दी" },
];

function getProfileImage(user) {
  if (user?.ProfilePic) {
    const pic = String(user.ProfilePic).replace(/\\/g, "/");
    return pic.startsWith("http") ? pic : `https://${pic}`;
  }
  return "/images/profile pic.webp";
}

function isNavActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function WalletButton({ compact = false, amount, isLogin, loginUserData, router, onAddCoins }) {
  return (
    <div
      className={`flex shrink-0 items-center rounded-full ${compact ? "h-8 pl-1.5 pr-0.5" : "h-10 pl-3 pr-1"}`}
      style={{ backgroundColor: CREAM_ALT }}
    >
      <button
        type="button"
        onClick={onAddCoins}
        className={`flex cursor-pointer items-center ${compact ? "gap-1" : "gap-2"}`}
        aria-label="Wallet balance"
      >
        <FaCoins className="shrink-0 text-amber-500" size={compact ? 12 : 15} />
        <span className={`truncate font-heading font-semibold text-[#1A1A1A] ${compact ? "max-w-[40px] text-[11px]" : "max-w-[52px] text-[15px]"}`}>
          {isLogin && loginUserData ? amount : "500"}
        </span>
      </button>

      <button
        type="button"
        onClick={onAddCoins}
        className={`ml-0.5 flex shrink-0 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition hover:opacity-90 ${compact ? "h-6 w-6" : "ml-1 h-8 w-8"}`}
        style={{ backgroundColor: ORANGE }}
        aria-label="Add coins"
      >
        <FaPlus size={compact ? 8 : 10} />
      </button>
    </div>
  );
}

function LanguageSelector({
  compact = false,
  langRef,
  selectedLang,
  showLangDropdown,
  onToggleDropdown,
  onSelectLang,
}) {
  return (
    <div className={`relative ${compact ? "w-full" : ""}`} ref={langRef}>
      <button
        type="button"
        onClick={onToggleDropdown}
        className={`flex cursor-pointer items-center rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 ${compact ? "h-9 gap-1.5 px-2.5" : "h-10 gap-2 px-3"
          }`}
      >
        <MdLanguage className="shrink-0 text-[18px]" style={{ color: ORANGE }} />
        <span className="font-heading text-sm font-medium text-gray-800">{selectedLang}</span>
        <FaChevronDown className={`shrink-0 text-[10px] text-gray-400 transition ${showLangDropdown ? "rotate-180" : ""}`} />
      </button>
      {showLangDropdown && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLang(lang.code)}
              className={`flex w-full items-center cursor-pointer justify-between px-3 py-2 text-xs transition hover:bg-orange-50 ${selectedLang === lang.code ? "font-bold text-[#FF5C00]" : "font-medium text-gray-600"
                }`}
            >
              <span>{lang.label}</span>
              <span className="text-gray-400">{lang.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthButtons({ onLoginClick }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={onLoginClick}
        className="font-heading flex h-10 items-center gap-1.5 rounded-xl px-3 cursor-pointer text-sm font-semibold text-white transition hover:opacity-90 xl:px-4 xl:text-[15px]"
        style={{ backgroundColor: ORANGE }}
      >
        <RiUserShared2Fill />
        Login / Join
      </button>
    </div>
  );
}

function NavLinkButton({ link, mobile = false, pathname, onNavigate }) {
  const active = isNavActive(pathname, link.href);
  const label = mobile ? (link.fullLabel || link.label) : link.label;
  if (mobile) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(link.href)}
        className={`w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active ? "bg-orange-50 text-[#FF5C00]" : "text-gray-700 hover:bg-orange-50/70"
          }`}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onNavigate(link.href)}
      className={`font-heading relative shrink-0 whitespace-nowrap px-0 pb-0.5 text-sm cursor-pointer font-semibold transition hover:text-[#FF5C00] lg:text-[15px] xl:text-base ${active ? "text-[#FF5C00]" : "text-gray-700"
        }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-0.5 left-0 right-0 mx-auto h-0.5 rounded-full" style={{ backgroundColor: ORANGE }} />
      )}
    </button>
  );
}

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isUserPanel = isUserPanelRoute(pathname);

  const { loginUserData, isMenuOpen, setisMenuOpen, isLogin, setisLogin } = useMenuContext();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginData = localStorage.getItem("LoginTokenData");
      const userId = localStorage.getItem("UserLoginId");
      setisLogin(Boolean(loginData && userId));
    };
    checkLoginStatus();
    const handleStorageChange = (e) => {
      if (e.key === "LoginTokenData" || e.key === "UserLoginId") checkLoginStatus();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setisLogin]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setisMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target) && showProfileCard) {
        setShowProfileCard(false);
      }
      if (langRef.current && !langRef.current.contains(event.target) && showLangDropdown) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen, showProfileCard, setisMenuOpen, showLangDropdown]);

  useEffect(() => {
    if (isUserPanel) {
      queueMicrotask(() => {
        setMobileMenuOpen(false);
        setShowProfileCard(false);
        setisMenuOpen(false);
      });
    }
  }, [isUserPanel, setisMenuOpen]);

  useEffect(() => {
    queueMicrotask(() => {
      setMobileMenuOpen(false);
      setShowProfileCard(false);
    });
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [mobileMenuOpen]);

  const handleLoginSuccess = () => {
    setisLogin(true);
    setIsAuthModalOpen(null);
    setMobileMenuOpen(false);
    setShowProfileCard(false);
    toastifySuccess("Welcome back! You have successfully logged in.");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setisLogin(false);
    setShowProfileCard(false);
    setMobileMenuOpen(false);
    socketService.disconnectAll();
    toastifySuccess("You have been successfully logged out.");
    setTimeout(() => { window.location.href = "/"; }, 500);
  };

  const handleNavigation = useCallback((path) => {
    try {
      router.prefetch(path);
    } catch {
      /* prefetch optional */
    }
    router.push(path);
    setMobileMenuOpen(false);
    setisMenuOpen(false);
  }, [router, setisMenuOpen]);

  const toggleMobileMenu = () => {
    const next = !mobileMenuOpen;
    setMobileMenuOpen(next);
    setisMenuOpen(next);
  };

  const amount = loginUserData?.WalletAmt ?? 0;
  const profileImg = getProfileImage(loginUserData);
  const handleAddCoins = () => {
    if (loginUserData) router.push("/plans");
    else setIsAuthModalOpen("login");
  };
  const handleOpenLogin = () => setIsAuthModalOpen("login");
  const handleSelectLang = (code) => {
    setSelectedLang(code);
    setShowLangDropdown(false);
  };

  return (
    <PerfRenderMark name="Header">
    <>
      <header className="fixed top-0 z-50 w-full border-b border-orange-50 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="main-container flex h-[72px] min-w-0 items-center justify-between gap-1.5 sm:gap-2 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 xl:gap-6">
          {/* Left */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2.5 lg:flex-none lg:gap-3">
            {!isUserPanel && (
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#FF5C00] transition hover:bg-orange-50 lg:hidden"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <FaTimes size={17} /> : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-2.5"
              aria-label="AstroCall home"
            >
              <Image
                src="/images/logo1.webp"
                alt="AstroCall"
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 rounded-lg object-cover xl:h-10 xl:w-10"
              />
              <div className="min-w-0 text-left lg:max-w-[200px] xl:max-w-none xl:shrink-0">
                <div className="font-heading truncate text-base font-bold leading-none text-[#FF5C00] sm:text-lg lg:text-xl xl:overflow-visible xl:whitespace-nowrap xl:text-[28px]">
                  AstroCall
                </div>
                <div className="hidden truncate font-body text-[11px] font-medium text-gray-500 xl:block xl:overflow-visible xl:whitespace-nowrap">
                  Your Guide to a Better Tomorrow
                </div>
              </div>
            </button>
          </div>

          {/* Center nav — lg+ */}
          {!isUserPanel && (
            <nav
              className="hidden min-w-0 items-center justify-center gap-3 lg:col-start-2 lg:flex lg:overflow-x-auto lg:[scrollbar-width:none] xl:gap-5 2xl:gap-8 [&::-webkit-scrollbar]:hidden"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <NavLinkButton key={link.href} link={link} pathname={pathname} onNavigate={handleNavigation} />
              ))}
            </nav>
          )}

          {/* Right */}
          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2 md:gap-2.5 lg:col-start-3 lg:gap-2.5 xl:gap-3">
            <div className="hidden md:block">
              <LanguageSelector
                langRef={langRef}
                selectedLang={selectedLang}
                showLangDropdown={showLangDropdown}
                onToggleDropdown={() => setShowLangDropdown((v) => !v)}
                onSelectLang={handleSelectLang}
              />
            </div>

            <div className="md:hidden">
              <WalletButton
                compact
                amount={amount}
                isLogin={isLogin}
                loginUserData={loginUserData}
                router={router}
                onAddCoins={handleAddCoins}
              />
            </div>
            <div className="hidden md:block">
              <WalletButton
                amount={amount}
                isLogin={isLogin}
                loginUserData={loginUserData}
                router={router}
                onAddCoins={handleAddCoins}
              />
            </div>

            {isLogin && loginUserData ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() =>
                    isUserPanel
                      ? router.push("/my-account")
                      : setShowProfileCard((v) => !v)
                  }
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-2 ring-orange-200 transition hover:ring-orange-300 sm:h-9 sm:w-9"
                  aria-label="My account"
                >
                  <Image
                    src={profileImg}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </button>

                {showProfileCard && !isUserPanel && (
                  <ProfileCard
                    onClose={() => setShowProfileCard(false)}
                    isOpen={showProfileCard}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="hidden sm:flex">
                  <AuthButtons onLoginClick={handleOpenLogin} />
                </div>
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-white sm:hidden"
                  style={{ backgroundColor: ORANGE }}
                >
                  <RiUserShared2Fill size={12} />
                  Join
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile / tablet drawer — below fixed header */}
      {mobileMenuOpen && !isUserPanel && (
        <div className="fixed inset-0 z-40 lg:hidden" ref={menuRef}>
          <div
            className="absolute inset-0 top-[72px] cursor-pointer bg-black/45 backdrop-blur-[1px]"
            onClick={() => { setMobileMenuOpen(false); setisMenuOpen(false); }}
          />
          <nav
            className="absolute left-0 top-[72px] flex h-[calc(100dvh-72px)] w-[min(300px,88vw)] flex-col overflow-hidden bg-white shadow-2xl sm:w-[min(320px,85vw)]"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-orange-50 px-4 py-3" style={{ backgroundColor: CREAM }}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Menu</p>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); setisMenuOpen(false); }}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-white"
                aria-label="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {isLogin && loginUserData && (
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-orange-200 sm:h-11 sm:w-11">
                  <Image src={profileImg} alt="" width={44} height={44} className="h-full w-full object-cover" />
                </div>
                <WalletButton
                  compact
                  amount={amount}
                  isLogin={isLogin}
                  loginUserData={loginUserData}
                  router={router}
                  onAddCoins={handleAddCoins}
                />
                <button
                  type="button"
                  onClick={() => handleNavigation("/my-account")}
                  className="shrink-0 rounded-full border px-2.5 py-1.5 text-[11px] font-bold text-[#FF5C00] sm:px-3 sm:text-xs"
                  style={{ borderColor: ORANGE }}
                >
                  My Account
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <div className="mb-3 px-2 md:hidden">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Language</p>
                <LanguageSelector
                  compact
                  langRef={langRef}
                  selectedLang={selectedLang}
                  showLangDropdown={showLangDropdown}
                  onToggleDropdown={() => setShowLangDropdown((v) => !v)}
                  onSelectLang={handleSelectLang}
                />
              </div>

              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Menu</p>
              <div className="space-y-0.5 sm:space-y-1">
                {NAV_LINKS.map((link) => (
                  <NavLinkButton key={link.href} link={link} mobile pathname={pathname} onNavigate={handleNavigation} />
                ))}
              </div>

              {isLogin && loginUserData ? (
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <ProfileCard
                    variant="drawer"
                    isOpen
                    onClose={() => { setMobileMenuOpen(false); setisMenuOpen(false); }}
                    onLogout={handleLogout}
                  />
                </div>
              ) : (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <AuthButtons
                    onLoginClick={() => {
                      handleOpenLogin();
                      setMobileMenuOpen(false);
                      setisMenuOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(null)}
        onLoginSuccess={handleLoginSuccess}
        onSignUpClick={() => setIsAuthModalOpen((prev) => (prev === "register" ? "login" : "register"))}
      />

      <ClientOnly>
        {isLogin ? <UserChatWidget /> : null}
      </ClientOnly>
    </>
    </PerfRenderMark>
  );
}

export default memo(Header);
