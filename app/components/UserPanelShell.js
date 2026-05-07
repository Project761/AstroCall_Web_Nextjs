"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PanelGuard from "@/app/components/PanelGuard";
import { FaBars, FaUser, FaWallet, FaPhone, FaComments, FaHeart, FaGem, FaPray } from "react-icons/fa";

const navItems = [
  { name: "My Account", path: "/my-account", icon: <FaUser /> },
  { name: "My Wallet", path: "/my-wallet", icon: <FaWallet /> },
  { name: "My Calls", path: "/my-calls", icon: <FaPhone /> },
  { name: "My Chats", path: "/my-chats", icon: <FaComments /> },
  { name: "My Favorites", path: "/my-favorites", icon: <FaHeart /> },
  { name: "My Following", path: "/my-following", icon: <FaUser /> },
  { name: "My Gemstone", path: "/my-gemstone", icon: <FaGem /> },
  { name: "My Online Puja", path: "/my-online-puja", icon: <FaPray /> },
];

export default function UserPanelShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <PanelGuard type="user">
      <div className="flex relative min-h-[calc(100vh-4rem)] bg-gray-50">
        {/* Overlay */}
        {open && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed left-0 top-16 w-full h-[calc(100vh-4rem)] bg-black/50 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72
      bg-gray-900 text-white overflow-y-auto shadow-lg
      transform transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      lg:fixed lg:top-16 lg:h-[calc(100vh-4rem)] lg:shrink-0`}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="font-bold text-xl text-orange-500">AstroCall</div>
            <div className="text-sm text-gray-300 mt-1">User Panel</div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
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
                      className={`w-full flex items-center gap-3 px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 ${active
                        ? "bg-orange-600 text-white shadow-md"
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

        {/* Content */}
        <main className="flex-1 min-w-0 w-full lg:ml-72 mt-12">
          <div className="lg:hidden p-4 bg-white shadow-sm border-b">
            <button
              type="button"
              className="bg-orange-600 p-3 rounded-full text-white shadow-md hover:bg-orange-700 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle user sidebar"
            >
              <FaBars size={20} />
            </button>
          </div>

          <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6 bg-gray-50 min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </PanelGuard>
  );
}

