"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import AuthModal from "../AuthModal/page";
import ProfileCard from "../ProfileCard/page";
import LanguageDropdown from "../LanguageDropdown/page";
import { toastifySuccess } from "../../utils/utility";
import { CgProfile } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import { RiUserShared2Fill } from "react-icons/ri";
import { FaWallet, FaHeart, FaGem, FaPray, FaComments, FaPhone, FaUser, FaHandsHelping, FaChevronRight, FaUserCircle } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { MdPhoneInTalk } from "react-icons/md";
import { IoMdChatboxes } from "react-icons/io";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import UserChat from "@/app/user-chat/page";


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { loginUserData, loadingUserData, Get_SingleData_User, isMenuOpen, setisMenuOpen } = useMenuContext();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);


  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Check login status on mount
  useEffect(() => {
    const loginData = localStorage.getItem("LoginTokenData");
    const userId = localStorage.getItem("UserLoginId");

    if (loginData && userId) {
      setIsLogin(true);
      try {
        const parsedData = JSON.parse(loginData);

      } catch (error) {
        console.error("Error parsing login data:", error);
      }
    }
  }, []);



  // Click outside handlers

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setisMenuOpen(false); // Sync with global state
      }
      if (profileRef.current && !profileRef.current.contains(event.target) && showProfileCard) {
        setShowProfileCard(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);



    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };

  }, [mobileMenuOpen, showProfileCard]);



  // Handle body scroll lock for mobile menu

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';



      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);

      };
    }
  }, [mobileMenuOpen]);



  const handleLoginSuccess = (data) => {
    setIsLogin(true);
    setIsAuthModalOpen(false);
    setMobileMenuOpen(false);
    setShowProfileCard(false);
    toastifySuccess("Successfully Logged In!");

  };



  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Update state immediately
    setIsLogin(false);
    setShowProfileCard(false);
    setMobileMenuOpen(false);



    // Navigate to home and show success message
    router.push("/");
    toastifySuccess("Logged Out Successfully!");



    // Force re-render by triggering a state update

    setTimeout(() => {
      window.location.reload();
    }, 100);

  };



  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    console.log('Current pathname:', pathname);
    console.log('Mobile menu open:', mobileMenuOpen);
    console.log('Global menu open:', isMenuOpen);

    // Prevent any potential event issues
    try {
      router.push(path);
      setMobileMenuOpen(false);
      setisMenuOpen(false); // Also close global menu
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };



  const handleTalkClick = () => {
    console.log('Talk button clicked, isLogin:', isLogin);
    if (isLogin) {
      handleNavigation("/talk-to-astrologers");
    } else {
      setIsAuthModalOpen(true);
    }

  };



  const handleChatClick = () => {
    console.log('Chat button clicked, isLogin:', isLogin);
    if (isLogin) {
      handleNavigation("/chat-to-astrologers");
    } else {
      setIsAuthModalOpen(true);
    }

  };
  const amount = loginUserData?.WalletAmt || 0;

  return (

    <>

      {/* Main Header */}

      <div className="bg-white shadow-customn fixed top-0 z-20 pointer-events-auto" style={{ width: '100vw', maxWidth: '100%' }}>
        <div className="flex justify-between m-auto items-center main-container max-h-[90px] px-2 sm:px-4 py-2">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")} >
            <Image
              src="/images/logo1.webp"
              alt="AstroCall"
              width={40}
              height={40}
              priority={true}
              className="w-[35px] sm:w-[50px] h-[35px] sm:h-[50px] aspect-[1/1] object-contain flex-shrink-0"
            />
            <span className="text-2xl font-bold">AstroCall</span>
          </div>



          {/* Desktop Navigation */}
          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={handleTalkClick}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-orange-600 transition-all duration-300 whitespace-nowrap flex items-center gap-2 chat-button pointer-events-auto">
                Talk to an Astrologer
                <div className="text-xl icon">
                  <MdPhoneInTalk />
                </div>
              </button>

              <button
                onClick={handleChatClick}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-orange-600 transition-all duration-300 whitespace-nowrap flex items-center gap-2 chat-button pointer-events-auto"
                name="Chat-to-Astrologers"
              >
                Chat with an Astrologer
                <div className="text-xl icon">
                  <IoMdChatboxes />
                </div>
              </button>

              
            </div>



            {/* Right Section */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Language Dropdown */}
              <LanguageDropdown />
              {/* Wallet Balance */}

              {isLogin && loginUserData && (
                <div className="hidden md:flex items-center gap-2 border border-orange-200 rounded-md px-3 py-1
                 bg-orange-50">
                  <FaWallet className="text-orange-600" />
                  <span className="text-black font-medium">₹{amount}</span>
                </div>

              )}



              {/* Profile */}

              <div className="relative" ref={profileRef}>

                {isLogin && loginUserData ? (
                  <div
                    onClick={() => setShowProfileCard(!showProfileCard)}
                    className="h-8 w-8 rounded-full overflow-hidden border-2 border-orange-300 cursor-pointer"
                  >
                    <Image
                      src={
                        loginUserData?.ProfilePic
                          ? `https://${loginUserData.ProfilePic.replace(/\\/g, "/")}`
                          : "/images/profile pic.webp"
                      }
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (

                  <div className="flex items-center gap-4 text-gray-700">

                    {/* 🔹 Login Icon */}
                    <div
                      onClick={() => setIsAuthModalOpen("login")}
                      className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition"
                    >
                      <CgProfile className="text-2xl" />
                    </div>

                    {/* 🔹 Signup Icon */}
                    <div
                      onClick={() => setIsAuthModalOpen("register")}
                      className="flex items-center gap-1 cursor-pointer hover:text-orange-500 transition"
                    >
                      <RiUserShared2Fill className="text-xl" />
                      <span className="text-sm font-medium">Signup</span>
                    </div>

                  </div>
                )}

                {/* Profile Card */}
                {showProfileCard && isLogin && loginUserData && (
                  <div className="absolute right-0 top-12 z-50">
                    <ProfileCard
                      userData={loginUserData}
                      onClose={() => setShowProfileCard(false)}
                      isOpen={showProfileCard}
                      onLogout={handleLogout}
                    />
                  </div>
                )}
              </div>



              {/* Mobile Menu Toggle */}

              <button
                className="lg:hidden text-orange-500 p-2 rounded-full hover:bg-orange-50 transition-colors"
                onClick={() => {
                  const newState = !mobileMenuOpen;
                  setMobileMenuOpen(newState);
                  setisMenuOpen(newState); // Sync with global state
                }}
              >

                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

            </div>

          </div>

        </div >



        {/* Mobile Menu Overlay */}

        {
          mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => {
                setMobileMenuOpen(false);
                setisMenuOpen(false); // Sync with global state
              }}
            />

          )
        }



        {/* Mobile Menu Sidebar */}

        <div className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}>

          {/* Close Button */}

          <button
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 p-2 rounded-full text-white transition-colors"
            onClick={() => {
              setMobileMenuOpen(false);
              setisMenuOpen(false); // Sync with global state
            }}
          >
            <ImCross className="text-lg" />
          </button>



          {/* Mobile Menu Content */}

          <div className="flex flex-col h-full overflow-y-auto pt-4 pb-6">
            {/* Profile Section */}
            {isLogin && loginUserData && (
              <div className="w-full bg-gray-700 p-5 mb-4">
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-orange-500 mb-3">
                    <Image
                      src={loginUserData?.ProfilePic ? `https://${loginUserData?.ProfilePic?.replace(/\\/g, "/")}` : "/images/profile pic.webp"}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover"

                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{loginUserData?.FirstName || 'User'}</h3>
                  <p className="text-sm text-gray-300 mb-3">{loginUserData?.MobileNo}</p>
                  <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-full border border-orange-500">
                    <span className="font-semibold text-white">Balance: ₹{amount}</span>
                  </div>

                </div>

              </div>

            )}



            {/* Menu Items */}

            <div className="flex flex-col gap-3 w-full px-4">

              {isLogin ? (
                <>
                  {/* Talk to Astrologers */}
                  <button
                    onClick={() => handleNavigation("/talk-to-astrologers")}
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-700 transition w-full text-left rounded-lg ${pathname === "/talk-to-astrologers" ? "bg-orange-500 text-white font-semibold" : "text-white"
                      }`}

                  >
                    <MdPhoneInTalk className="text-xl flex-shrink-0" />
                    <span className="text-base font-medium">Talk to Astrologers</span>
                  </button>

                  {/* Chat with Astrologers */}

                  <button
                    onClick={() => handleNavigation("/chat-to-astrologers")}
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-700 transition w-full text-left rounded-lg ${pathname === "/chat-to-astrologers" ? "bg-orange-500 text-white font-semibold" : "text-white"
                      }`}

                  >
                    <IoMdChatboxes className="text-xl flex-shrink-0" />
                    <span className="text-base font-medium">Chat with Astrologers</span>
                  </button>

                  
                  {/* My Account */}

                  <button
                    onClick={() => handleNavigation("/my-account")}
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-700 transition w-full text-left rounded-lg ${pathname === "/my-account" ? "bg-orange-500 text-white font-semibold" : "text-white"
                      }`}

                  >
                    {/* <FaUser className="text-xl flex-shrink-0" /> */}
                    <span className="text-base font-medium">My Account</span>
                  </button>



                  {/* My Wallet */}

                  <button
                    onClick={() => handleNavigation("/my-wallet")}
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-700 transition w-full text-left rounded-lg ${pathname === "/my-wallet" ? "bg-orange-500 text-white font-semibold" : "text-white"
                      }`}
                  >
                    <FaWallet className="text-xl flex-shrink-0" />
                    <span className="text-base font-medium">My Wallet</span>
                  </button>



                  {/* My Favorites */}

                  <button
                    onClick={() => handleNavigation("/my-favorites")}
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-700 transition w-full text-left rounded-lg ${pathname === "/my-favorites" ? "bg-orange-500 text-white font-semibold" : "text-white"
                      }`}
                  >
                    <FaHeart className="text-xl flex-shrink-0" />
                    <span className="text-base font-medium">My Favorites</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 text-red-400 hover:bg-red-900 hover:bg-opacity-20 active:bg-red-900 active:bg-opacity-30 transition w-full text-left rounded-lg mt-4"
                  >
                    {/* <FaPersonCircleQuestion className="text-xl flex-shrink-0" /> */}
                    <span className="text-base font-semibold">Logout</span>
                  </button>

                </>

              ) : (

                /* Login/Signup for non-logged users */

                <button
                  className="flex items-center gap-3 px-4 py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition w-full text-left font-semibold shadow-md mt-2"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >

                  <RiUserShared2Fill className="text-xl" />
                  <span className="text-base">Sign Up</span>
                </button>

              )}

            </div>

          </div>
        </div>

      </div>



      {/* Authentication Modal */}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <UserChat />

    </>

  );

}