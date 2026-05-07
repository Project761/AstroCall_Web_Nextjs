"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaWallet, FaHeart, FaGem, FaPray, FaComments, FaPhone, FaUser, FaHandsHelping, FaChevronRight, FaStar } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { MdAccessTime } from "react-icons/md";

import Image from "next/image";
import { useMenuContext } from "@/app/hooks/useMenuContext";


export default function ProfileCard({ onClose, isOpen, onLogout }) {

  const { loginUserData, loadingUserData, Get_SingleData_User } = useMenuContext();


  // console.log(loginUserData ,'sdf')
  const router = useRouter();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target) && isOpen) {
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path) => {
    router.push(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      // Use parent logout handler if available
      if (onLogout) {
        onLogout();
      } else {
        // Fallback to local logout
        localStorage.clear();
        sessionStorage.clear();
        router.push("/");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={profileRef}
      className="absolute right-0 top-1 z-50 bg-white rounded-[20px] shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* Profile Header */}
      <div className="bg-[#F6E6CF] px-6 pt-2 pb-2 text-center cursor-pointer">
        <div className="relative mx-auto h-[80px] w-[80px] rounded-full overflow-hidden border-[5px] border-orange-400 bg-slate-500">
          <Image
            src={
              loginUserData?.ProfilePic
                ? `https://${loginUserData?.ProfilePic?.replace(/\\/g, "/")}`
                : "/images/profile pic.webp"
            }
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>

        <h3 className="mt-2 text-[18px] font-bold text-slate-800 leading-tight">
          {loginUserData?.FirstName || "User"}
        </h3>

        <p className="mt-1 text-[14px] font-normal text-slate-500">
          {loginUserData?.MobileNo}
        </p>

        {/* Balance */}
        <div className="mt-2 cursor-pointer flex items-center justify-between rounded-2xl bg-white px-4 py-1 shadow-sm border border-orange-100">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <FaWallet className="text-orange-500 text-[16px]" />
            </span>

            <div className="text-left">
              <p className="text-[12px] text-nowrap text-slate-500 font-medium">
                Wallet Balance
              </p>
              <h4 className="text-[17px] font-bold text-slate-800">
                ₹{loginUserData?.WalletAmt || 0}
              </h4>
            </div>
          </div>

          <button
            onClick={() => handleNavigation("/my-wallet")}
            className="rounded-xl bg-orange-500 px-4 py-1 cursor-pointer text-[12px] font-semibold text-white hover:bg-orange-600 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-[#FAFAFA]">
        <button
          onClick={() => handleNavigation("/my-account")}
          className="flex w-full items-center gap-5 border-b border-gray-200 px-7 py-3 text-left cursor-pointer hover:bg-orange-50 transition"
        >
          <FaUser className="text-orange-500 text-[15px]" />
          <span className="text-[14px] font-medium text-slate-800">
            My Account
          </span>
        </button>

        <button
          onClick={() => handleNavigation("/my-wallet")}
          className="flex w-full items-center gap-5 border-b border-gray-200 px-7 py-3 text-left cursor-pointer hover:bg-orange-50 transition"
        >
          <FaWallet className="text-orange-500 text-[15px]" />
          <span className="text-[14px] font-medium text-slate-800">
            Recharge
          </span>
        </button>

        <button
          onClick={() => handleNavigation("/notifications")}
          className="flex w-full items-center gap-5 border-b border-gray-200 px-7 py-3 text-left cursor-pointer hover:bg-orange-50 transition"
        >
          <FaStar className="text-orange-500 text-[15px]" />
          <span className="text-[14px] font-medium text-slate-800">
            Notification
          </span>
        </button>

        <button
          onClick={() => handleNavigation("/support")}
          className="flex w-full items-center gap-5 border-b border-gray-200 px-7 py-3 text-left cursor-pointer hover:bg-orange-50 transition"
        >
          <FaHandsHelping className="text-orange-500 text-[15px]" />
          <span className="text-[14px] font-medium text-slate-800">
            Help
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-5 px-7 py-3 text-left cursor-pointer hover:bg-red-50 transition"
        >
          <FaUser className="text-red-500 text-[15px]" />
          <span className="text-[14px] font-medium text-red-500 hover:text-red-600">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
