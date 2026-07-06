"use client";

import PanelGuard from "@/app/components/PanelGuard";
import AstrologerSidebar from "@/app/components/AstrologerSidebar";
import AstrologerPanelHeader from "@/app/components/AstrologerPanelHeader";
import { useState } from "react";
import { AP_BG } from "@/app/lib/astrologerPanelTheme";

export default function AstrologerPanelLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PanelGuard type="astrologer">
      <div className="flex min-h-screen" style={{ backgroundColor: AP_BG }}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <AstrologerSidebar
          isOpen={sidebarOpen}
          onNavigate={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
          <AstrologerPanelHeader onMenuClick={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">{children}</main>
        </div>
      </div>
    </PanelGuard>
  );
}
