"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PanelGuard from "@/app/components/PanelGuard";
import { FaBars, FaUser, FaWallet, FaPhone, FaComments, FaHeart, FaGem, FaPray } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";

const navItems = [
  { name: "My Account", path: "/my-account", icon: <FaUser /> },
  { name: "My Wallet", path: "/my-wallet", icon: <FaWallet /> },
  { name: "My Calls", path: "/my-calls", icon: <FaPhone /> },
  { name: "My Chats", path: "/my-chats", icon: <FaComments /> },
  { name: "My Favorites", path: "/my-favorites", icon: <FaHeart /> },
  { name: "My Following", path: "/my-following", icon: <SlUserFollowing /> },
  { name: "My Gemstone", path: "/my-gemstone", icon: <FaGem /> },
  { name: "My Online Puja", path: "/my-online-puja", icon: <FaPray /> },
];

export default function UserPanelShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <PanelGuard type="user">
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900 text-white transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 border-b border-gray-800">
            <div className="font-bold text-xl text-orange-500">AstroCall</div>
            <div className="text-xs text-gray-400 mt-1">User Panel</div>
          </div>

          <nav className="p-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(item.path);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-orange-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Overlay (mobile) */}
        {open && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 w-full">
          <div className="lg:hidden p-2">
            <button
              type="button"
              className="bg-gray-900 p-2 rounded-full text-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle user sidebar"
            >
              <FaBars size={20} />
            </button>
          </div>

          <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4">{children}</div>
        </main>
      </div>
    </PanelGuard>
  );
}

