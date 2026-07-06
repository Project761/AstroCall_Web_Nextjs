"use client";

import { useRouter } from "next/navigation";
import {
  FaWallet, FaComments, FaShoppingBag, FaBookOpen, FaHeart,
  FaPhone, FaVideo, FaOm, FaRobot, FaStar,
} from "react-icons/fa";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import {
  PanelCard, PanelStatCard, PanelSectionTitle, TrustBadges, OrangeButton,
} from "@/app/components/UserPanelPage";

const QUICK_ACTIONS = [
  { label: "Chat", icon: FaComments, href: "/chat-to-astrologers" },
  { label: "Call", icon: FaPhone, href: "/talk-to-astrologers" },
  { label: "Video Call", icon: FaVideo, href: "/talk-to-astrologers" },
  { label: "Kundli", icon: FaBookOpen, href: "/freekundli" },
  { label: "Puja", icon: FaOm, href: "/online-puja" },
];

const RECENT_ACTIVITY = [
  { text: "Chat with Acharya Dev Sharma", time: "2 hours ago" },
  { text: "Kundli Generated", time: "Yesterday" },
  { text: "Call with Pandit Rajesh", time: "2 days ago" },
];

export default function MyDashboardClient() {
  const router = useRouter();
  const { loginUserData } = useMenuContext();
  const name = loginUserData?.FirstName || "User";
  const wallet = loginUserData?.WalletAmt ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
            Welcome back, {name} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s a summary of your astrology journey.
          </p>
        </div>
        <div className="w-full shrink-0 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:max-w-[280px]">
          <div className="flex items-center gap-2">
            <FaStar className="text-[#FF5C00]" size={14} />
            <p className="text-xs font-bold uppercase tracking-wide text-[#FF5C00]">Premium Member</p>
          </div>
          <p className="mt-1 text-[11px] text-gray-500">Enjoy unlimited chats &amp; calls</p>
          <OrangeButton className="mt-3 w-full" onClick={() => router.push("/plans")}>
            Upgrade Now
          </OrangeButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <PanelStatCard
          icon={FaWallet}
          label="Wallet Balance"
          value={`${wallet}₹`}
          linkText="Add payments"
          onLink={() => router.push("/plans")}
          color="#FF5C00"
          iconBg="#FFF4ED"
        />
        <PanelStatCard
          icon={FaComments}
          label="Total Consultations"
          value="12"
          linkText="View"
          onLink={() => router.push("/my-chats")}
          color="#3B82F6"
          iconBg="#EFF6FF"
        />
        <PanelStatCard
          icon={FaShoppingBag}
          label="Orders Placed"
          value="8"
          linkText="View"
          onLink={() => router.push("/my-gemstone")}
          color="#8B5CF6"
          iconBg="#F5F3FF"
        />
        <PanelStatCard
          icon={FaBookOpen}
          label="Kundlis Created"
          value="5"
          linkText="View"
          onLink={() => router.push("/freekundli")}
          color="#10B981"
          iconBg="#ECFDF5"
        />
        <PanelStatCard
          icon={FaHeart}
          label="Saved Items"
          value="7"
          linkText="View"
          onLink={() => router.push("/my-favorites")}
          color="#EF4444"
          iconBg="#FEF2F2"
        />
      </div>

      {/* Quick Actions */}
      <PanelCard>
        <PanelSectionTitle title="Quick Actions" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => router.push(a.href)}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-4 transition hover:border-orange-100 hover:bg-orange-50/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-[#FF5C00]">
                <a.icon size={18} />
              </span>
              <span className="text-xs font-semibold text-[#374151]">{a.label}</span>
            </button>
          ))}
        </div>
      </PanelCard>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <PanelCard>
          <PanelSectionTitle title="Recent Activity" />
          <ul className="divide-y divide-[#F3F4F6]">
            {RECENT_ACTIVITY.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="text-sm font-medium text-[#374151]">{item.text}</span>
                <span className="shrink-0 text-[11px] text-[#9CA3AF]">{item.time}</span>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard>
          <PanelSectionTitle title="Today's Horoscope" />
          <div className="flex items-center gap-5">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#FFF4ED] text-3xl">
              ♈
            </div>
            <div>
              <p className="text-base font-bold text-[#111827]">Aries</p>
              <p className="text-xs text-[#9CA3AF]">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <OrangeButton className="mt-3" onClick={() => router.push("/daily-horoscope/aries")}>
                Read Now
              </OrangeButton>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* AI Banner */}
      <div className="flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] p-5 shadow-md sm:flex-row sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
            <FaRobot size={22} />
          </span>
          <div>
            <p className="font-bold text-white">AI Astrologer</p>
            <p className="text-sm text-white/85">Get instant answers powered by AI astrology</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/chat-to-astrologers")}
          className="shrink-0 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-[#6366F1] shadow-sm transition hover:bg-white/95"
        >
          Ask AI Now
        </button>
      </div>

      <TrustBadges />
    </div>
  );
}