"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PanelGuard from "@/app/components/PanelGuard";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import {
  USER_PANEL_NAV,
  LOGOUT_NAV,
  isPanelNavActive,
  getPanelPageTitle,
  calcProfileCompletion,
  ORANGE,
  CREAM,
} from "@/app/lib/userPanelNav";
import { FaBars, FaChevronLeft, FaChevronRight, FaCheckCircle, FaCircle, FaHeadset } from "react-icons/fa";

function NavItem({ active, onClick, icon: Icon, label, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition ${
        active
          ? "bg-orange-50 text-[#FF5C00]"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#FF5C00]"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r" style={{ backgroundColor: ORANGE }} />
      )}
      <Icon size={14} className={`shrink-0 ${active ? "text-[#FF5C00]" : "text-gray-400"}`} />
      <span className="flex-1 truncate">{label}</span>
      {badge ? (
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export default function UserPanelShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { loginUserData } = useMenuContext();
  const pageTitle = getPanelPageTitle(pathname);
  const { percent, tasks } = calcProfileCompletion(loginUserData);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const isDashboard = pathname === "/my-account";

  const handleNavClick = (item) => {
    router.push(item.href);
    setOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="shrink-0 border-b border-gray-100 px-4 py-4">
        <button
          type="button"
          onClick={() => router.push(isDashboard ? "/" : "/my-account")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#FF5C00]"
        >
          <FaChevronLeft size={11} /> {isDashboard ? "Back to Home" : "Back to Dashboard"}
        </button>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">My Account</p>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {USER_PANEL_NAV.map((item) => (
            <li key={item.label}>
              <NavItem
                active={isPanelNavActive(pathname, item.href)}
                onClick={() => handleNavClick(item)}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
              />
            </li>
          ))}
          <li className="pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold text-red-500 transition hover:bg-red-50"
            >
              <LOGOUT_NAV.icon size={14} className="shrink-0" />
              {LOGOUT_NAV.label}
            </button>
          </li>
        </ul>
      </nav>

      {/* Complete Your Profile */}
      <div className="mx-3 mb-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[#0F172A]">Complete Your Profile</p>
        <p className="mt-0.5 text-[11px] text-gray-500">Unlock personalized astrology insights</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#FFE4CC" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke={ORANGE}
                strokeWidth="3"
                strokeDasharray={`${((2 * Math.PI * 15.5 * percent) / 100).toFixed(1)} ${(2 * Math.PI * 15.5).toFixed(1)}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#FF5C00]">
              {percent}%
            </span>
          </div>
          <p className="text-[11px] font-semibold text-gray-600">Profile Completed</p>
        </div>
        <ul className="mt-3 space-y-1.5">
          {tasks.map(({ label, done }) => (
            <li key={label} className="flex items-center gap-2 text-[11px] text-gray-600">
              {done ? (
                <FaCheckCircle className="shrink-0 text-green-500" size={12} />
              ) : (
                <FaCircle className="shrink-0 text-orange-300" size={10} />
              )}
              {label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => router.push("/my-account/edit-profile")}
          className="mt-3 w-full rounded-lg border py-2 text-xs font-bold text-[#FF5C00] transition hover:bg-orange-50"
          style={{ borderColor: ORANGE }}
        >
          Complete Now
        </button>
      </div>

      {/* Need Help */}
      <div className="mx-3 mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-[#0F172A]">Need Help?</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
          We are here to assist you with any questions.
        </p>
        <Link
          href="/support"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: ORANGE }}
        >
          <FaHeadset size={12} /> Chat with Support
        </Link>
      </div>
    </>
  );

  return (
    <PanelGuard type="user">
      <div className="min-h-screen pt-[72px]" style={{ backgroundColor: CREAM }}>
        <div className="main-container mx-auto px-3 py-4 sm:px-4 sm:py-5 lg:py-6">
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
            <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-[#FF5C00]" aria-label="Open menu">
              <FaBars size={18} />
            </button>
            <span className="text-sm font-semibold text-[#0F172A]">{pageTitle}</span>
            <FaChevronRight className="text-[10px] text-gray-400" />
          </div>

          <div className="flex items-start gap-5 lg:gap-6">
            <aside className="sticky top-20 hidden max-h-[calc(100vh-1rem)] w-[240px] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:flex xl:w-[260px]">
              {sidebarContent}
            </aside>

            <main className="min-w-0 flex-1 pb-6">{children}</main>
          </div>
        </div>

        {open && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-[72px] z-30 bg-black/50 backdrop-blur-[1px] lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-[72px] z-40 flex h-[calc(100vh-4.5rem)] w-[min(280px,88vw)] flex-col overflow-hidden rounded-r-2xl border border-gray-100 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </PanelGuard>
  );
}
