"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiPhoneCall } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { FaRupeeSign, FaUsers, FaUser, FaStar, FaCog, FaClock } from "react-icons/fa";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";

export default function AstrologerDashboard() {
  const router = useRouter();

  const tiles = [
    { label: "Profile", icon: <FaUser />, path: "/astrologer-panel/profile" },
    { label: "Wallet", icon: <FaRupeeSign />, path: "/astrologer-panel/wallet" },
    { label: "Call History", icon: <FiPhoneCall />, path: "/astrologer-panel/call-history" },
    { label: "Chat History", icon: <BsChatDots />, path: "/astrologer-panel/chat-history" },
    { label: "Followers", icon: <FaUsers />, path: "/astrologer-panel/followers" },
    { label: "Waiting List", icon: <FaClock />, path: "/astrologer-panel/waiting-list" },
    { label: "Assign Puja", icon: <MdOutlineAssignmentTurnedIn />, path: "/astrologer-panel/assign-puja" },
    { label: "Reviews", icon: <FaStar />, path: "/astrologer-panel/reviews" },
    { label: "Settings", icon: <FaCog />, path: "/astrologer-panel/settings" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Astrologer Dashboard</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Quick access to your panel modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {tiles.map((t) => (
          <button
            key={t.path}
            type="button"
            onClick={() => router.push(t.path)}
            className="p-4 rounded-xl shadow-md border bg-white hover:shadow-lg transition flex items-center gap-3 text-left"
          >
            <span className="text-orange-500 text-xl">{t.icon}</span>
            <span className="font-semibold text-gray-800">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

