"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import AuthModal from "../AuthModal/page";
import ProfileCard from "../ProfileCard/page";
import LanguageDropdown from "../LanguageDropdown/page";

import { toastifySuccess } from "../../utils/utility";
import { useMenuContext } from "@/app/hooks/useMenuContext";

import { CgProfile } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import { RiUserShared2Fill } from "react-icons/ri";
import { FaWallet, FaHeart } from "react-icons/fa";
import { MdPhoneInTalk } from "react-icons/md";
import { IoMdChatboxes } from "react-icons/io";

// ✅ Hydration fix
const UserChat = dynamic(() => import("@/app/user-chat/page"), {
  ssr: false,
});

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    loginUserData,
    isMenuOpen,
    setisMenuOpen,
    isLogin,
    setisLogin,
  } = useMenuContext();

  // ✅ Changed false -> null
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(null);

  const [showProfileCard, setShowProfileCard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Mounted state hydration fix
  const [mounted, setMounted] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Login check
  useEffect(() => {
    if (!mounted) return;

    const loginData = localStorage.getItem("LoginTokenData");
    const userId = localStorage.getItem("UserLoginId");

    if (loginData && userId) {
      setisLogin(true);
    }
  }, [mounted, setisLogin]);

  // Click outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
        setisMenuOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        showProfileCard
      ) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mounted, mobileMenuOpen, showProfileCard, setisMenuOpen]);

  // Body scroll lock
  useEffect(() => {
    if (!mounted) return;

    if (mobileMenuOpen) {
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
    }
  }, [mounted, mobileMenuOpen]);

  const handleLoginSuccess = () => {
    setisLogin(true);
    setIsAuthModalOpen(null);
    setMobileMenuOpen(false);
    setShowProfileCard(false);

    toastifySuccess(
      "Welcome back! You have successfully logged in."
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    setisLogin(false);
    setShowProfileCard(false);
    setMobileMenuOpen(false);

    toastifySuccess(
      "You have been successfully logged out."
    );

    // Force redirect to dashboard
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  const handleNavigation = (path) => {
    router.push(path);

    setMobileMenuOpen(false);
    setisMenuOpen(false);
  };

  const handleTalkClick = () => {
    if (isLogin) {
      handleNavigation("/talk-to-astrologers");
    } else {
      setIsAuthModalOpen("login");
    }
  };

  const handleChatClick = () => {
    if (isLogin) {
      handleNavigation("/chat-to-astrologers");
    } else {
      setIsAuthModalOpen("login");
    }
  };

  // ✅ Prevent hydration mismatch
  if (!mounted) return null;

  const amount = loginUserData?.WalletAmt || 0;

  return (
    <>
      <div className="bg-white shadow-customn fixed top-0 z-20 w-full">
        <div className="flex justify-between items-center main-container px-4 py-2">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="/images/logo1.webp"
              alt="AstroCall"
              width={50}
              height={50}
              style={{ borderRadius: '50%' }}
            />

            <span className="text-2xl font-bold">
              AstroCall
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              
              <button
                onClick={handleTalkClick}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                Talk to Astrologer
                <MdPhoneInTalk />
              </button>

              <button
                onClick={handleChatClick}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                Chat with Astrologer
                <IoMdChatboxes />
              </button>
            </div>

            {/* Language */}
            <LanguageDropdown />

            {/* Wallet */}
            {isLogin && loginUserData && (
              <div className="hidden md:flex items-center gap-2 border border-orange-200 rounded-md px-3 py-1 bg-orange-50">
                <FaWallet className="text-orange-600" />

                <span className="font-medium">
                  ₹{amount}
                </span>
              </div>
            )}

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              {isLogin && loginUserData ? (
                <div
                  onClick={() =>
                    setShowProfileCard(!showProfileCard)
                  }
                  className="h-8 w-8 rounded-full overflow-hidden border-2 border-orange-300 cursor-pointer"
                >
                  <Image
                    src={
                      loginUserData?.ProfilePic
                        ? `https://${loginUserData.ProfilePic.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "/images/profile pic.webp"
                    }
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  
                  <div
                    onClick={() =>
                      setIsAuthModalOpen("login")
                    }
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <CgProfile className="text-2xl" />
                    <span>Login</span>
                  </div>

                  <div
                    onClick={() =>
                      setIsAuthModalOpen("register")
                    }
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <RiUserShared2Fill className="text-xl" />
                    <span>Signup</span>
                  </div>
                </div>
              )}

              {/* Profile Card */}
              {showProfileCard &&
                isLogin &&
                loginUserData && (
                  <div className="absolute right-0 top-12 z-50">
                    <ProfileCard
                      userData={loginUserData}
                      onClose={() =>
                        setShowProfileCard(false)
                      }
                      isOpen={showProfileCard}
                      onLogout={handleLogout}
                    />
                  </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-orange-500"
              onClick={() => {
                const newState = !mobileMenuOpen;

                setMobileMenuOpen(newState);
                setisMenuOpen(newState);
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(null)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Chat */}
      <UserChat />
    </>
  );
}