"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  FaSearch, FaFilter, FaRedo, FaUserCheck, FaLock, FaBolt,
  FaUsers, FaHeart, FaBriefcase, FaRing, FaHome, FaChartLine, FaLayerGroup, FaEllipsisH,
  FaStar, FaCommentDots, FaPhoneAlt, FaUserCheck as FaUC, FaLock as FaLk, FaBolt as FaBl,
  FaBullseye, FaClock,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useRouter } from "next/navigation";
import { postWithToken } from "@/app/utils/api";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import { useMenuContext } from "../hooks/useMenuContext";
import { toastifyInfo } from "../utils/utility";
import InsufficientBalancePopup from "@/app/components/InsufficientBalancePopup.js";
import AuthModal from "../components/AuthModal";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const PEACH = "#FFF9F1";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BLUE = "#3B82F6";
const INITIAL_VISIBLE = 9;
const LOAD_MORE = 9;

const CATEGORIES = [
  { id: "all", label: "All Astrologers", icon: FaUsers },
  { id: "love", label: "Love & Relationship", icon: FaHeart },
  { id: "career", label: "Career Guidance", icon: FaBriefcase },
  { id: "marriage", label: "Marriage Prediction", icon: FaRing },
  { id: "vastu", label: "Vastu Consultation", icon: FaHome },
  { id: "finance", label: "Financial Astrology", icon: FaChartLine },
  { id: "tarot", label: "Tarot Reading", icon: FaLayerGroup },
  { id: "more", label: "More", icon: FaEllipsisH },
];

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "20-50", label: "₹20 - ₹50", min: 20, max: 50 },
  { id: "50-100", label: "₹50 - ₹100", min: 50, max: 100 },
  { id: "100+", label: "₹100+", min: 100, max: Infinity },
];

const EXPERIENCE_RANGES = [
  { id: "0-5", label: "0-5 Years", min: 0, max: 5 },
  { id: "5-10", label: "5-10 Years", min: 5, max: 10 },
  { id: "10+", label: "10+ Years", min: 10, max: Infinity },
];

const DEFAULT_FILTERS = { onlineOnly: false, experience: [], priceRange: "all", language: "", gender: [] };

const SORT_OPTIONS = ["Popularity", "Experience : High to Low", "Experience : Low to High", "Price : High to Low", "Price : Low to High", "Rating : High to Low"];

function formatReviewCount(count) {
  if (!count) return "4.1K";
  const n = Number(count);
  if (Number.isNaN(n)) return String(count);
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function isCardOnline(card, onlineStatus, source) {
  const socketStatus = onlineStatus[String(card.ID)];
  if (socketStatus === true) return true;
  if (socketStatus === false) return false;
  return source === "call" ? card?.IsCall === true : card?.IsChat === true;
}

function applyFilters(list, filters, onlineStatus, source = "chat") {
  let result = [...(list || [])];
  if (filters.onlineOnly) result = result.filter((c) => isCardOnline(c, onlineStatus, source) && !c?.Isbusy);
  if (filters.experience?.length) {
    result = result.filter((c) => {
      const years = Number(c?.ExperiencedYears) || 0;
      return filters.experience.some((id) => {
        const r = EXPERIENCE_RANGES.find((x) => x.id === id);
        return r && years >= r.min && years < r.max;
      });
    });
  }
  if (filters.priceRange && filters.priceRange !== "all") {
    const range = PRICE_RANGES.find((r) => r.id === filters.priceRange);
    if (range) result = result.filter((c) => { const p = Number(c?.PricePerMin) || 0; return p >= range.min && p <= range.max; });
  }
  if (filters.language) {
    const lang = filters.language.toLowerCase();
    result = result.filter((c) => (c?.LanguageValue || "").toLowerCase().includes(lang));
  }
  if (filters.gender?.length) result = result.filter((c) => filters.gender.includes(c?.Gender));
  return result;
}

function filterByCategory(list, categoryId) {
  if (!categoryId || categoryId === "all") return list;
  const keywords = { love: ["love", "relationship"], career: ["career", "job", "business"], marriage: ["marriage", "wedding", "match"], vastu: ["vastu"], finance: ["finance", "financial", "money", "wealth"], tarot: ["tarot"] };
  const keys = keywords[categoryId];
  if (!keys) return list;
  return list.filter((c) => keys.some((k) => (c?.skillsValue || "").toLowerCase().includes(k)));
}

function extractLanguages(list) {
  const set = new Set();
  (list || []).forEach((c) => (c?.LanguageValue || "").split(",").map((s) => s.trim()).filter(Boolean).forEach((l) => set.add(l)));
  return Array.from(set).sort();
}

function countOnline(list, onlineStatus, source) {
  return (list || []).filter((c) => isCardOnline(c, onlineStatus, source) && !c?.Isbusy).length;
}

function sortList(list, selected) {
  if (!list?.length || selected === "Popularity") return [...(list || [])];
  const s = [...list];
  if (selected === "Experience : High to Low") s.sort((a, b) => b.ExperiencedYears - a.ExperiencedYears);
  else if (selected === "Experience : Low to High") s.sort((a, b) => a.ExperiencedYears - b.ExperiencedYears);
  else if (selected === "Price : High to Low") s.sort((a, b) => b.PricePerMin - a.PricePerMin);
  else if (selected === "Price : Low to High") s.sort((a, b) => a.PricePerMin - b.PricePerMin);
  else if (selected === "Rating : High to Low") s.sort((a, b) => b.Review - a.Review);
  return s;
}

function FilterSidebar({ filters, onChange, onApply, onReset, onlineCount, languages }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const toggleExp = (id) => set("experience", filters.experience.includes(id) ? filters.experience.filter((x) => x !== id) : [...filters.experience, id]);
  const toggleGender = (g) => set("gender", filters.gender.includes(g) ? filters.gender.filter((x) => x !== g) : [...filters.gender, g]);

  return (
    <aside className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-4 text-sm font-bold" style={{ color: TEXT }}>Filter Astrologers</h3>
      <div className="mb-5 border-b border-gray-50 pb-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Availability</p>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={filters.onlineOnly} onChange={(e) => set("onlineOnly", e.target.checked)} className="h-4 w-4 rounded accent-[#FF5C00]" />
            Online Now
          </span>
          <span className="text-xs font-semibold text-gray-400">{onlineCount}</span>
        </label>
      </div>
      <div className="mb-5 border-b border-gray-50 pb-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Experience</p>
        {EXPERIENCE_RANGES.map((r) => (
          <label key={r.id} className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={filters.experience.includes(r.id)} onChange={() => toggleExp(r.id)} className="h-4 w-4 rounded accent-[#FF5C00]" />
            {r.label}
          </label>
        ))}
      </div>
      <div className="mb-5 border-b border-gray-50 pb-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Price Per Minute</p>
        {PRICE_RANGES.map((r) => (
          <label key={r.id} className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="radio" name="price" checked={filters.priceRange === r.id} onChange={() => set("priceRange", r.id)} className="h-4 w-4 accent-[#FF5C00]" />
            {r.label}
          </label>
        ))}
      </div>
      <div className="mb-5 border-b border-gray-50 pb-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Language</p>
        <select value={filters.language} onChange={(e) => set("language", e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100">
          <option value="">Select Language</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="mb-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Gender</p>
        {["Male", "Female"].map((g) => (
          <label key={g} className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={filters.gender.includes(g)} onChange={() => toggleGender(g)} className="h-4 w-4 rounded accent-[#FF5C00]" />
            {g}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onReset} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Reset</button>
        <button type="button" onClick={onApply} className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: ORANGE }}>Apply Filters</button>
      </div>
    </aside>
  );
}

function AstrologerCard({ card, onlineStatus, onPrimary, onSecondary, onProfile, hmsToMinutes, primaryLabel, secondaryLabel }) {
  const isOnline = isCardOnline(card, onlineStatus, "chat");
  const isBusy = card?.Isbusy;
  const statusLabel = isBusy ? "Busy" : isOnline ? "Online" : "Offline";
  const statusDot = isBusy ? "bg-red-500" : isOnline ? "bg-[#22C55E]" : "bg-gray-400";
  const expertise = (card?.skillsValue || "Vedic Astrology, Vastu").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 2).join(", ");
  const experience = card?.ExperiencedYears ? `${card.ExperiencedYears}+ Years Exp.` : "5+ Years Exp.";
  const rating = card?.Review || 4.9;
  const reviewCount = formatReviewCount(card?.ChatOrders);

  return (
    <article className="relative flex h-full flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,92,0,0.1)] sm:p-5">
      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-gray-100 bg-white px-2 py-0.5 text-[10px] font-semibold shadow-sm">
        <span className={`h-1.5 w-1.5 rounded-full ${statusDot} ${isOnline && !isBusy ? "animate-pulse" : ""}`} />
        <span className={isOnline && !isBusy ? "text-[#22C55E]" : "text-gray-500"}>{statusLabel}</span>
      </div>
      <div className="mt-6 flex flex-col items-center text-center">
        <button type="button" onClick={() => onProfile(card)} className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-full ring-2 ring-[#FF5C00] ring-offset-2 sm:h-[88px] sm:w-[88px]">
          <Image src={toCdnSrcOrFallback(card?.AvatarUrl)} alt={card?.DisplayName || "Astrologer"} fill className="object-cover" sizes="88px" unoptimized={!!card?.AvatarUrl} />
        </button>
        <button type="button" onClick={() => onProfile(card)} className="mt-3 flex items-center cursor-pointer gap-1">
          <span className="text-sm font-bold hover:text-[#FF5C00] sm:text-base " style={{ color: TEXT }}>{card?.DisplayName}</span>
          <MdVerified size={16} style={{ color: BLUE }} />
        </button>
        <p className="mt-1 text-[11px] sm:text-xs" style={{ color: MUTED }}>{expertise}</p>
        <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>{experience}</p>
      </div>
      <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center gap-1 text-xs">
          <FaStar className="text-[#FF5C00]" size={12} />
          <span className="font-bold" style={{ color: TEXT }}>{rating}</span>
          <span className="text-gray-400">({reviewCount})</span>
        </div>
        <p className="text-sm font-bold" style={{ color: TEXT }}>
          {card?.FreeState === "Free" ? <span className="text-[#22C55E]">Free</span> : <>₹{card?.PricePerMin}<span className="text-xs font-normal text-gray-400">/min</span></>}
        </p>
      </div>
      {isBusy && <p className="mt-1 text-center text-[10px] font-medium text-red-500">Wait · {hmsToMinutes?.(card?.BusyTime) || 0} min</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={(e) => onPrimary(card, e)} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-white hover:opacity-90 sm:text-sm" style={{ backgroundColor: ORANGE }}>
          <FaCommentDots size={13} /> {primaryLabel}
        </button>
        <button type="button" onClick={(e) => onSecondary(card, e)} className="flex flex-1 items-center cursor-pointer justify-center gap-1.5 rounded-lg border-2 py-2.5 text-xs font-bold hover:bg-orange-50 sm:text-sm" style={{ borderColor: ORANGE, color: ORANGE }}>
          <FaPhoneAlt size={12} /> {secondaryLabel}
        </button>
      </div>
    </article>
  );
}

export default function ChatToAstrologersClient() {
  const { loginUserData, BusyTimes, setBusyTimes } = useMenuContext();
  const router = useRouter();
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
  const [insufficientBalanceData, setInsufficientBalanceData] = useState({ requiredAmount: 0, currentBalance: 0, astrologerName: "" });
  const [astrologers, setAstrologers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [chatOnlineStatus, setChatOnlineStatus] = useState({});
  const [selected, setSelected] = useState("Popularity");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await postWithToken("Astrologer/UserGetData_Astrologer", { IsActive: "1", Source: "chat" });
        if (res) setAstrologers(res);
      } catch (e) { console.log(e); }
      finally { setIsLoading(false); }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = sessionStorage.getItem("AstrologerOnlineChat");
        if (!raw) return;
        const msg = JSON.parse(raw);
        if (msg?.Type === "chat" && msg?.UserId) {
          const id = String(msg.UserId.replace(/[a-zA-Z]/g, ""));
          setChatOnlineStatus((prev) => ({ ...prev, [id]: msg?.Message === "This Astrologer is Online" }));
        }
      } catch { }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        if (!BusyTimes) return;
        const id = String(BusyTimes?.AstroId);
        if (BusyTimes?.Type === "chat" && BusyTimes?.Message === "Astro Chat is Not Busy.") {
          setAstrologers((prev) => prev.map((c) => String(c.ID) === id ? { ...c, Isbusy: false } : c));
          setBusyTimes("");
        }
      } catch { }
    }, 2000);
    return () => clearInterval(interval);
  }, [BusyTimes, setBusyTimes]);

  const baseList = useMemo(() => {
    let list = astrologers;
    if (searchVal) list = list.filter((i) => i?.DisplayName?.toLowerCase().includes(searchVal.toLowerCase()) || (i?.skillsValue || "").toLowerCase().includes(searchVal.toLowerCase()));
    list = filterByCategory(list, activeCategory);
    list = applyFilters(list, appliedFilters, chatOnlineStatus, "chat");
    return sortList(list, selected);
  }, [astrologers, searchVal, activeCategory, appliedFilters, chatOnlineStatus, selected]);

  const visibleList = baseList.slice(0, visibleCount);
  const onlineCount = countOnline(astrologers, chatOnlineStatus, "chat");
  const languages = useMemo(() => extractLanguages(astrologers), [astrologers]);

  const loginOrChatModal = (card) => {
    if (typeof window !== "undefined" && localStorage.getItem("UserLoginId"))
      router.push(`/chat-to-astrologers/user-chat-home?AstroId=${card?.ID}&Type=chat&IsChat=${card?.IsChat}`);
  };

  const hmsToMinutes = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      if (value.toLowerCase().includes("min")) return parseInt(value.replace(/\D/g, ""), 10) || 0;
      const parts = value.split(":").map(Number);
      if (parts.length === 3) return parts[0] * 60 + parts[1] + Math.floor(parts[2] / 60);
      if (parts.length === 2) return parts[0] + Math.floor(parts[1] / 60);
    }
    return 0;
  };

  const handleChatClick = (card, e) => {
    e?.preventDefault?.(); e?.stopPropagation?.();
    if (!UserLoginId) { setShowAuthModal(true); return; }
    const price = parseFloat(card?.PricePerMin);
    if (!price || isNaN(price)) { toastifyInfo("Astrologer Price Invalid"); return; }
    if (card?.FreeState === "Free") { loginOrChatModal(card); return; }
    const req = price * 5;
    const bal = loginUserData?.WalletAmt || 0;
    if (bal < req) {
      setInsufficientBalanceData({ requiredAmount: req, currentBalance: bal, astrologerName: card?.FirstName || "Astrologer" });
      setShowInsufficientBalancePopup(true);
    } else { loginOrChatModal(card); }
  };

  const handleCallClick = (card, e) => {
    e?.preventDefault?.(); e?.stopPropagation?.();
    const slug = card.DisplayName?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    router.push(`/talk-to-astrologers/${slug}`);
  };

  const goToProfile = (card) => {
    const slug = card.DisplayName?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("AstroIDCallChat", card?.ID);
      sessionStorage.setItem("selectedAstrologer", JSON.stringify(card));
    }
    router.push(`/chat-to-astrologers/${slug}`);
  };

  const whyItems = [
    { icon: FaUC, label: "100% Verified Astrologers" },
    { icon: FaLk, label: "Private & Secure Consultation" },
    { icon: FaBl, label: "Instant Response" },
    { icon: FaBullseye, label: "Accurate Predictions" },
    { icon: FaClock, label: "Available 24x7" },
  ];

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.chat}
        currentPage="Chat with Astrologers"
        objectPosition="object-[85%_center] md:object-center"
        title={
          <>
            <span className="text-[#FF5C00]">Chat</span> With Verified Astrologers Online
          </>
        }
        subtitle="Connect instantly with 1000+ expert astrologers and get solutions to your life problems."
        bottomSlot={
          <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-full border border-gray-100 bg-white py-1.5 pl-5 pr-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.1)] sm:pl-6">
            <input
              type="text"
              value={searchVal}
              onChange={(e) => { setSearchVal(e.target.value); setVisibleCount(INITIAL_VISIBLE); }}
              placeholder="Search by astrologer name, expertise..."
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-400"
              style={{ color: TEXT }}
            />
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
              style={{ backgroundColor: ORANGE }}
            >
              <FaSearch size={13} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        }
      >
        <ul className="mt-4 hidden flex-col gap-2.5 md:flex sm:gap-3 sm:mt-5">
          {[
            { icon: FaUserCheck, label: "100% Verified Astrologers" },
            { icon: FaLock, label: "Private & Secure Consultation" },
            { icon: FaBolt, label: "Instant Solution & Guidance" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs font-semibold sm:text-sm" style={{ color: TEXT }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm" style={{ color: ORANGE }}>
                <Icon size={14} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </PageBanner>

      {/* Categories */}
      <section className=" bg-white py-5 sm:py-6">
        <div className="main-container px-4">
          <h2 className="mb-4 text-sm font-bold sm:text-base" style={{ color: TEXT }}>Popular Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id} type="button" onClick={() => { setActiveCategory(cat.id); setVisibleCount(INITIAL_VISIBLE); }} className={`flex cursor-pointer min-w-[100px] shrink-0 flex-col items-center gap-2 rounded-xl border px-4 py-3 transition sm:min-w-[110px] sm:px-5 sm:py-3.5 ${isActive ? "border-[#FF5C00] bg-orange-50/50 shadow-sm" : "border-gray-100 bg-white hover:border-orange-100"}`}>
                  <Icon size={18} className={isActive ? "text-[#FF5C00]" : "text-gray-400"} />
                  <span className={`text-center text-[10px] font-semibold leading-tight sm:text-[11px] ${isActive ? "text-[#FF5C00]" : "text-gray-600"}`}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="main-container px-4 pb-10 pt-10 sm:pt-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <button type="button" onClick={() => setMobileFilterOpen(true)} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 lg:hidden">
            <FaFilter size={14} className="text-[#FF5C00]" /> Filters
          </button>
          <div className="hidden w-full shrink-0 lg:block lg:w-[260px] xl:w-[280px]">
            <FilterSidebar filters={filters} onChange={setFilters} onApply={() => { setAppliedFilters({ ...filters }); setVisibleCount(INITIAL_VISIBLE); setMobileFilterOpen(false); }} onReset={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); setVisibleCount(INITIAL_VISIBLE); }} onlineCount={onlineCount} languages={languages} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-bold sm:text-base" style={{ color: TEXT }}>{baseList.length}+ Astrologers Online</h2>
              <select value={selected} onChange={(e) => { setSelected(e.target.value); setVisibleCount(INITIAL_VISIBLE); }} className="rounded-lg cursor-pointer border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-orange-300 sm:text-sm">
                {SORT_OPTIONS.map((o) => <option key={o} value={o}>Sort by: {o === "Popularity" ? "Popular" : o}</option>)}
              </select>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-5">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-100" />
                    <div className="mx-auto mt-4 h-4 w-3/4 rounded bg-gray-100" />
                    <div className="mt-4 h-9 rounded-lg bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : baseList.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">🔮</div>
                <p className="font-semibold text-gray-700">No Astrologers Available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleList.map((card, i) => (
                    <AstrologerCard key={card?.ID || i} card={card} onlineStatus={chatOnlineStatus} onPrimary={handleChatClick} onSecondary={handleCallClick} onProfile={goToProfile} hmsToMinutes={hmsToMinutes} primaryLabel="Chat Now" secondaryLabel="Call" />
                  ))}
                </div>
                {visibleCount < baseList.length && (
                  <div className="mt-8 flex justify-center">
                    <button type="button" onClick={() => setVisibleCount((c) => c + LOAD_MORE)} className="flex items-center gap-2 rounded-lg border-2 border-[#FF5C00] px-8 py-3 text-sm font-bold text-[#FF5C00] hover:bg-orange-50">
                      <FaRedo size={14} /> Load More Astrologers
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Why banner */}
      <section className="border-t border-orange-100/50 py-8 sm:py-10" style={{ background: `linear-gradient(90deg, ${PEACH} 0%, #ffffff 100%)` }}>
        <div className="main-container px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-serif text-xl font-bold sm:text-2xl" style={{ color: TEXT }}>Why Chat on AstroCall?</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
              {whyItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={14} style={{ color: ORANGE }} />
                  <span className="text-xs font-semibold sm:text-sm" style={{ color: MUTED }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 cursor-pointer bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4">
            <FilterSidebar filters={filters} onChange={setFilters} onApply={() => { setAppliedFilters({ ...filters }); setVisibleCount(INITIAL_VISIBLE); setMobileFilterOpen(false); }} onReset={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); setVisibleCount(INITIAL_VISIBLE); }} onlineCount={onlineCount} languages={languages} />
          </div>
        </div>
      )}

      <InsufficientBalancePopup isOpen={showInsufficientBalancePopup} onClose={() => setShowInsufficientBalancePopup(false)} requiredAmount={insufficientBalanceData.requiredAmount} currentBalance={insufficientBalanceData.currentBalance} astrologerName={insufficientBalanceData.astrologerName} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
