"use client";

import Link from "next/link";
import { FaChevronRight, FaShieldAlt, FaLock, FaHeadset, FaCheckCircle } from "react-icons/fa";
import { ORANGE, CREAM } from "@/app/lib/userPanelNav";

export const PANEL_TEXT_MUTED = "text-gray-500";
export const PANEL_TEXT_BODY = "text-gray-800";
export const PANEL_ORANGE = ORANGE;

export function PanelBreadcrumb({ title }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
      <Link href="/" className="font-medium transition hover:text-[#FF5C00]">Home</Link>
      <FaChevronRight className="text-[9px] text-gray-300" />
      <Link href="/my-account" className="font-medium transition hover:text-[#FF5C00]">My Account</Link>
      <FaChevronRight className="text-[9px] text-gray-300" />
      <span className="font-semibold text-gray-700">{title}</span>
    </nav>
  );
}

export function UserPanelPage({ title, subtitle, children, action, showBreadcrumb = true, showTrustFooter = true }) {
  return (
    <div className="space-y-5">
      {showBreadcrumb && <PanelBreadcrumb title={title} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
      {showTrustFooter && <TrustBadges />}
    </div>
  );
}

export function PanelCard({ children, className = "", id }) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelStatCard({ icon: Icon, label, value, linkText, onLink, color = ORANGE, iconBg }) {
  const bg = iconBg || `${color}18`;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-orange-100 sm:p-5">
      <span
        className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: bg, color }}
      >
        {Icon && <Icon size={16} />}
      </span>
      <p className="text-lg font-bold leading-tight text-[#0F172A] sm:text-xl">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-gray-400">{label}</p>
      {linkText && onLink && (
        <button
          type="button"
          onClick={onLink}
          className="mt-3 text-left text-xs font-semibold text-[#FF5C00] transition hover:underline"
        >
          {linkText} →
        </button>
      )}
    </div>
  );
}

export function PanelSectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-bold text-[#0F172A]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PanelTabs({ tabs, active, onChange, underline = false }) {
  if (underline) {
    return (
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                active === tab
                  ? "border-[#FF5C00] text-[#FF5C00]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            active === tab ? "text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-[#FF5C00]"
          }`}
          style={active === tab ? { backgroundColor: ORANGE } : undefined}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function PanelLoader() {
  return (
    <div className="flex justify-center py-24">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-100 border-t-[#FF5C00]" />
    </div>
  );
}

export function PanelEmpty({ icon: Icon, title, description, action }) {
  return (
    <PanelCard className="py-20 text-center">
      {Icon && <Icon className="mx-auto text-4xl text-gray-300" />}
      <p className="mt-4 font-semibold text-[#0F172A]">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action}
    </PanelCard>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    Success: "bg-emerald-50 text-emerald-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Upcoming: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Online: "bg-emerald-50 text-emerald-700",
    Following: "bg-emerald-50 text-emerald-600",
    open: "bg-amber-50 text-amber-700",
    resolved: "bg-emerald-50 text-emerald-700",
  };
  const cls = styles[status] || "bg-gray-100 text-gray-600";
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>{status}</span>;
}

export function TrustBadges() {
  const items = [
    { icon: FaLock, title: "100% Privacy", sub: "Your data is safe with us" },
    { icon: FaCheckCircle, title: "Verified Experts", sub: "Consult certified & experienced astrologers" },
    { icon: FaShieldAlt, title: "Secure Payments", sub: "100% safe & secure payments" },
    { icon: FaHeadset, title: "24/7 Support", sub: "We are always here to help" },
  ];
  return (
    <section className="rounded-2xl border border-orange-50 px-4 py-6 sm:px-6" style={{ backgroundColor: CREAM }}>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {items.map((t) => (
          <div key={t.title} className="flex items-start gap-3">
            <t.icon className="mt-0.5 shrink-0 text-[18px]" style={{ color: ORANGE }} />
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{t.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PanelPagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            currentPage === page ? "text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#FF5C00]"
          }`}
          style={currentPage === page ? { backgroundColor: ORANGE } : undefined}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export function OrangeButton({ children, onClick, className = "", outline = false, type = "button", disabled = false }) {
  if (outline) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded-xl border-2 border-[#FF5C00] px-4 py-2 text-sm font-semibold text-[#FF5C00] transition hover:bg-[#FFF9F1] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl bg-[#FF5C00] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E85500] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
