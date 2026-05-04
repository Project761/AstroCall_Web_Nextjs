"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaWallet, FaHeart, FaGem, FaPray, FaComments, FaPhone, FaUser, FaHandsHelping, FaChevronRight, FaStar } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { MdAccessTime } from "react-icons/md";

import Image from "next/image";
import { useMenuContext } from "@/app/hooks/useMenuContext";


export default function ProfileCard({onClose, isOpen, onLogout }) {

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
    <div className="absolute right-0 top-12 z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[260px] max-w-[90vw]">
      {/* Profile Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-300">
          {/* <Image
            src={loginUserData?.ProfilePic || "/images/profile pic.webp"}
            alt="Profile"
            width={48}
            height={48}
            className="object-cover"
          /> */}
          <Image
            src={loginUserData?.ProfilePic ? `https://${loginUserData?.ProfilePic?.replace(/\\/g, "/")}` : "/images/profile pic.webp"}
            alt="Profile"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{loginUserData?.FirstName || 'User'}</h3>
          <p className="text-sm text-gray-600">{loginUserData?.MobileNo}</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FaWallet className="text-orange-500" />
          <span className="font-semibold text-gray-800">Balance:</span>
        </div>
        <span className="font-bold text-orange-600">₹{loginUserData?.WalletAmt || 0}</span>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {/* My Account */}
        <div className="px-4 py-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">My Account</h4>

          <button
            onClick={() => handleNavigation("/my-account")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaUser className="text-orange-500" />
            <span>Edit Profile</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My Wallet */}
          <button
            onClick={() => handleNavigation("/my-wallet")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaWallet className="text-orange-500" />
            <span>My Wallet</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My Favorites */}
          <button
            onClick={() => handleNavigation("/my-favorites")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaHeart className="text-orange-500" />
            <span>My Favorites</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My Following */}
          <button
            onClick={() => handleNavigation("/my-following")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <SlUserFollowing className="text-orange-500" />
            <span>My Following</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My GemStone */}
          <button
            onClick={() => handleNavigation("/my-gemstone")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaGem className="text-orange-500" />
            <span>My GemStone</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* Suggested */}
          <button
            onClick={() => handleNavigation("/my-account/suggested")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaStar className="text-orange-500" />
            <span>Suggested</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* Wait List */}
          <button
            onClick={() => handleNavigation("/wait-list")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <MdAccessTime className="text-orange-500" />
            <span>Wait List</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My Online Puja */}
          <button
            onClick={() => handleNavigation("/my-online-puja")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaPray className="text-orange-500" />
            <span>My Online Puja</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My Chats */}
          <button
            onClick={() => handleNavigation("/my-chats")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaComments className="text-orange-500" />
            <span>My Chats</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* My Calls */}
          <button
            onClick={() => handleNavigation("/my-calls")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaPhone className="text-orange-500" />
            <span>My Calls</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>

          {/* Support */}
          <button
            onClick={() => handleNavigation("/support")}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <FaHandsHelping className="text-orange-500" />
            <span>Support</span>
            <FaChevronRight className="ml-auto text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <div className="px-4 py-2 border-t border-gray-200 mt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2 text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaUser className="text-red-500" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
