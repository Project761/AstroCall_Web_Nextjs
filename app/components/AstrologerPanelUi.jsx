"use client";

import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import { AP_ORANGE, AP_CARD, AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

export function PanelPageHeader({ title, breadcrumbs = [], description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs text-gray-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1">
                {i > 0 && <FaChevronRight className="text-[9px]" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-[#FF5C00]">{crumb}</span>
                ) : (
                  <span>{crumb}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PanelCard({ title, action, children, className = "" }) {
  return (
    <div className={`${AP_CARD} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3 sm:px-5 sm:py-4">
          {title && <h3 className="font-heading text-sm font-bold text-[#1A1A1A] sm:text-base">{title}</h3>}
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

export function StatCard({ icon: Icon, iconBg, label, value, sub, trend }) {
  return (
    <div className={`${AP_CARD} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg || "bg-orange-50"}`}>
          {Icon && <Icon className="text-lg text-[#FF5C00]" />}
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.startsWith("+") || trend.startsWith("↑") ? "text-green-600" : "text-red-500"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-gray-500">{label}</p>
      <p className="font-heading mt-0.5 text-xl font-extrabold text-[#1A1A1A] sm:text-2xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export function MiniStat({ icon: Icon, iconBg, label, value }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-3 text-center">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className="text-sm" />
      </div>
      <p className="font-heading text-lg font-bold text-[#1A1A1A]">{value}</p>
      <p className="text-[10px] text-gray-500 sm:text-xs">{label}</p>
    </div>
  );
}

export function PanelTabs({ tabs, active, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-1 border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            active === tab.id
              ? "border-b-2 border-[#FF5C00] text-[#FF5C00]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {tab.count != null && (
            <span className="ml-1 text-gray-400">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Ongoing: "bg-purple-100 text-purple-700",
    Upcoming: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Open: "bg-red-100 text-red-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
    Waiting: "bg-orange-100 text-orange-700",
    Accepted: "bg-green-100 text-green-700",
    Missed: "bg-gray-100 text-gray-600",
    Credit: "bg-green-100 text-green-700",
    Debit: "bg-red-100 text-red-700",
    Pending: "bg-orange-100 text-orange-700",
    Approved: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-xs ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export function ServiceBadge({ type }) {
  const map = {
    chat: "bg-purple-100 text-purple-700",
    call: "bg-green-100 text-green-700",
    video: "bg-orange-100 text-orange-700",
    Chat: "bg-purple-100 text-purple-700",
    Call: "bg-green-100 text-green-700",
    Video: "bg-orange-100 text-orange-700",
  };
  const key = String(type || "").toLowerCase();
  const cls = map[type] || map[key] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${cls}`}>
      {type}
    </span>
  );
}

export function PanelToggle({ checked, onChange, label }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-2">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <div className="relative h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-[#FF5C00]">
        <span className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`} />
      </div>
      {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
    </label>
  );
}

export function PanelPagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-gray-50 pt-4 text-xs text-gray-500 sm:flex-row">
      <p>
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40"
        >
          Prev
        </button>
        {[...Array(Math.min(totalPages, 5))].map((_, i) => (
          <button
            key={i + 1}
            type="button"
            onClick={() => onPageChange(i + 1)}
            className={`h-8 w-8 rounded-lg text-sm font-semibold ${
              page === i + 1 ? "bg-[#FF5C00] text-white" : "border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function HelpCard() {
  return (
    <div className="rounded-xl border border-orange-100 bg-[#FFF9F1] p-4">
      <p className="text-sm font-bold text-[#1A1A1A]">Need Help?</p>
      <p className="mt-1 text-xs text-gray-500">Contact our support team for assistance.</p>
      <Link href="/astrologer-panel/settings" className={`${AP_BTN_OUTLINE} mt-3 w-full text-xs`}>
        Contact Support
      </Link>
    </div>
  );
}

export function RightWidget({ title, action, children }) {
  return (
    <div className={`${AP_CARD} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3">
        <h4 className="text-sm font-bold text-[#1A1A1A]">{title}</h4>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function PanelLoading() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#FF5C00]" />
    </div>
  );
}

export function PanelEmpty({ message = "No data available" }) {
  return <p className="py-16 text-center text-sm text-gray-400">{message}</p>;
}

export function PanelFilterBar({ children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-[#FFF9F1] p-3">
      {children}
    </div>
  );
}
