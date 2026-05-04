"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaWallet,
  FaCog,
  FaSignOutAlt,
  FaPrayingHands,
  FaShoppingBag,
  FaStar,
  FaClock,
  FaUsers,
  FaUser,
} from "react-icons/fa";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import Image from "next/image";

const NAV_ITEMS = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/astrologer-panel/dashboard" },
  { name: "Profile", icon: <FaUser />, path: "/astrologer-panel/profile" },
  { name: "Wallet", icon: <FaWallet />, path: "/astrologer-panel/wallet" },
  { name: "My Followers", icon: <FaUsers />, path: "/astrologer-panel/followers" },
  { name: "Pending List", icon: <FaUsers />, path: "/astrologer-panel/pending-list" },
  { name: "Waiting List", icon: <FaClock />, path: "/astrologer-panel/waiting-list" },
  { name: "Assign Puja", icon: <MdOutlineAssignmentTurnedIn />, path: "/astrologer-panel/assign-puja" },
  { name: "Suggested Online Puja", icon: <FaPrayingHands />, path: "/astrologer-panel/suggested-puja" },
  { name: "Suggested Mall Items", icon: <FaShoppingBag />, path: "/astrologer-panel/suggested-mall" },
  { name: "My Reviews", icon: <FaStar />, path: "/astrologer-panel/reviews" },
  { name: "Call History", icon: <FiPhoneCall />, path: "/astrologer-panel/call-history" },
  { name: "Chat History", icon: <BsChatDots />, path: "/astrologer-panel/chat-history" },
  { name: "Settings", icon: <FaCog />, path: "/astrologer-panel/settings" },
];

const AstrologerSidebar = ({ isOpen = true, onNavigate }) => {

  const { loginAstrologerData, setLoginAstrologerData, astrows } = useMenuContext();

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("AstroLoginId");
      localStorage.removeItem("LoginTokenData");
      localStorage.removeItem("AstroChatTokenId");
      sessionStorage.clear();
    }
    router.replace("/astrologer-login");
  };

  return (
    <aside className={`${isOpen ? "block" : "hidden"} lg:block w-64 bg-gray-900 text-white`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <div className="font-bold text-xl text-orange-500">AstroCall</div>
        </div>

        <div className="flex flex-col items-center py-4 border-b border-gray-700">
          <div className="relative">
            <div className="relative mt-4 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <Image
                  src={loginAstrologerData?.AvatarUrl ? `https://${loginAstrologerData?.AvatarUrl?.replace(/\\/g, "/")}` : "/images/profile pic.webp"}
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                  alt="Profile"
                />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <h5 className="text-white text-sm font-semibold mt-2 capitalize">{loginAstrologerData?.FirstName || "Astrologer"}</h5>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="mt-3 px-2 text-sm font-medium space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-orange-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}

            <li className="pt-2 mt-2 border-t border-gray-700">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <span className="text-lg">
                  <FaSignOutAlt />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};
export default AstrologerSidebar;
