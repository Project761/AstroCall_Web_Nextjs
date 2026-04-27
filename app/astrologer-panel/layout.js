"use client";

import PanelGuard from "@/app/components/PanelGuard";
import AstrologerSidebar from "@/app/components/AstrologerSidebar/page";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function AstrologerPanelLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelGuard type="astrologer">
      <div className="flex min-h-screen bg-gray-50">
        <AstrologerSidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        <div className="flex-1">
          <div className="lg:hidden p-2">
            <button
              type="button"
              className="bg-gray-900 p-2 rounded-full text-white"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <FaBars size={20} />
            </button>
          </div>

          <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4">{children}</div>
        </div>
      </div>
    </PanelGuard>
  );
}
