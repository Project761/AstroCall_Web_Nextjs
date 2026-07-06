"use client";

import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaSearch, FaShoppingCart, FaStar, FaChevronRight, FaChevronLeft,
  FaFire, FaHeart, FaCalendarAlt, FaCheck, FaVideo, FaGift,
  FaCertificate, FaTruck, FaHeadset, FaOm, FaPrayingHands,
  FaClock, FaLandmark, FaShieldAlt, FaUsers, FaCreditCard,
  FaUserCheck,
  FaLock,
  FaBolt,
} from "react-icons/fa";
import { toastifySuccess } from "../utils/utility.js";
import { getPostData, TokenWithDeleteUpadateAdd, fetchData } from "../utils/api.js";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";
import { MdPhoneInTalk } from "react-icons/md";
import { IoMdChatboxes } from "react-icons/io";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";

const MenuContext = React.createContext({ pujareviewstatus: false, setpujareviewstatus: () => { } });

const LoadingIndicator = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200" style={{ borderTopColor: ORANGE }} />
  </div>
);

const CATEGORIES = [
  { id: "all", label: "All Pujas", icon: FaOm },
  { id: "shiva", label: "Lord Shiva", icon: FaOm },
  { id: "durga", label: "Goddess Durga", icon: FaPrayingHands },
  { id: "ganesha", label: "Lord Ganesha", icon: FaOm },
  { id: "navagraha", label: "Navagraha", icon: FaStar },
  { id: "wealth", label: "Wealth & Prosperity", icon: FaGift },
  { id: "health", label: "Health & Healing", icon: FaHeart },
  { id: "love", label: "Love & Marriage", icon: FaHeart },
  { id: "career", label: "Career & Success", icon: FaFire },
];

const PUJA_TYPES = ["Maha Puja", "Lord Shiva Puja", "Goddess Puja", "Navagraha Puja", "Lakshmi Puja", "Ganesh Puja"];
const PURPOSES = ["Love & Marriage", "Career & Business", "Health & Peace", "Wealth & Prosperity", "Family Wellbeing"];
const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "101-500", label: "₹101 - ₹500", min: 101, max: 500 },
  { id: "501-1000", label: "₹501 - ₹1,000", min: 501, max: 1000 },
  { id: "1001-2000", label: "₹1,001 - ₹2,000", min: 1001, max: 2000 },
  { id: "2000+", label: "₹2,000+", min: 2000, max: Infinity },
];
const DURATIONS = ["Under 1 Hour", "1 - 3 Hours", "3 - 6 Hours", "More than 6 Hours"];

const HERO_FEATURES = [
  { icon: FaCertificate, label: "100% Authentic Puja Vidhi" },
  { icon: FaUsers, label: "Experienced & Verified Pandits" },
  { icon: FaVideo, label: "Live Puja & Complete Transparency" },
];

const HERO_SERVICES = [
  { icon: FaOm, title: "Custom Puja", sub: "Book a puja as per your need" },
  { icon: FaVideo, title: "Live Puja", sub: "Watch your puja live" },
  { icon: FaCertificate, title: "Puja Certificate", sub: "Get puja photo & certificate" },
  { icon: FaGift, title: "Doorstep Prasad", sub: "Prasad delivered to your home" },
];

const WHY_ITEMS = [
  { icon: FaOm, title: "Authentic Vedic Rituals", sub: "Performed as per scriptures" },
  { icon: FaUsers, title: "Verified Pandits", sub: "Experienced & background verified" },
  { icon: FaVideo, title: "Live Puja Streaming", sub: "Watch puja from anywhere" },
  { icon: FaCertificate, title: "Puja Certificate", sub: "With photo after completion" },
  { icon: FaTruck, title: "Prasad at Your Doorstep", sub: "Delivered with purity" },
];

const HOW_STEPS = [
  { icon: FaSearch, title: "Choose a Puja", sub: "Select puja as per your need" },
  { icon: FaCalendarAlt, title: "Provide Details", sub: "Fill in your name, gotra & other details" },
  { icon: FaCreditCard, title: "Make Payment", sub: "Secure payment through multiple options" },
  { icon: FaPrayingHands, title: "Puja is Performed", sub: "By expert pandits on your behalf" },
  { icon: FaGift, title: "Get Certificate & Prasad", sub: "Receive certificate & prasad at your doorstep" },
];

const TESTIMONIALS = [
  { name: "Rahul Sharma", city: "Mumbai", text: "The Maha Mrityunjaya Puja brought peace to our family. Highly recommend AstroCall!", rating: 5 },
  { name: "Priya Verma", city: "Delhi", text: "Live streaming was amazing. Felt connected despite being far from the temple.", rating: 5 },
  { name: "Amit Patel", city: "Ahmedabad", text: "Prasad arrived on time. Authentic rituals performed by knowledgeable pandits.", rating: 5 },
];

const WHY_FOOTER = [
  { icon: FaOm, title: "100% Authentic Vedic Puja" },
  { icon: FaUsers, title: "Experienced & Verified Pandits" },
  { icon: FaVideo, title: "Live Updates & Video of Puja" },
  { icon: FaShieldAlt, title: "Secure & Easy Payments" },
  { icon: FaTruck, title: "Prasad Delivered To Your Doorstep" },
  { icon: FaHeadset, title: "Customer Support 24/7" },
];

const getSlug = (card) => card?.PujaName?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") || "";

const matchCategory = (item, catId) => {
  if (catId === "all") return true;
  const name = (item?.PujaName || "").toLowerCase();
  const pujaFor = (item?.PujaFor || "").toLowerCase();
  const map = {
    shiva: ["shiva", "mahadev", "rudra"],
    durga: ["durga", "goddess", "devi"],
    ganesha: ["ganesh", "ganesha", "vinayak"],
    navagraha: ["navagraha", "graha", "planet"],
    wealth: ["wealth", "lakshmi", "prosperity", "money"],
    health: ["health", "healing", "mrityunjaya"],
    love: ["love", "marriage", "vivah"],
    career: ["career", "business", "success"],
  };
  return map[catId]?.some((k) => name.includes(k) || pujaFor.includes(k));
};

function OnlinePuja() {
  const router = useRouter();
  const { setpujareviewstatus } = useContext(MenuContext);

  const [view, setView] = useState("landing");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [PujaForsdata, setPujaForsdata] = useState();
  const [allPujaData, setAllPujaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [draftFilters, setDraftFilters] = useState({ search: "", types: [], purposes: [], price: "all", durations: [], sort: "popularity" });

  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";
  const MerchantId = typeof window !== "undefined" ? sessionStorage.getItem("MerchantId") || "" : "";
  const pujaID = typeof window !== "undefined" ? sessionStorage.getItem("PujaID") || "" : "";

  const Get_Data_OnlinePuja = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPostData("Puja/GetData_Puja", { IsActive: "1" });
      if (res) setAllPujaData(Array.isArray(res) ? res : res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const Get_Data_PujaFor = useCallback(async () => {
    try {
      const urlSet = typeof window !== "undefined" ? window.location.origin : "";
      const apiUrl = urlSet === "https://astrocall.live"
        ? "https://api.astrocall.live/api/PujaFor/GetDropDownData_PujaFor"
        : "https://liveapi.astrocall.live/api/PujaFor/GetDropDownData_PujaFor";
      const res = await fetchData(apiUrl);
      const parseData = JSON.parse(res?.data);
      if (parseData?.Table) setPujaForsdata(parseData.Table);
    } catch (e) { console.error(e); }
  }, []);

  const PhonePe_handlePayment = useCallback(async (merchantId) => {
    try {
      const res = await TokenWithDeleteUpadateAdd("PhonePay/OrderStatus", { MerchantOrderId: merchantId });
      if (res?.state === "COMPLETED") {
        setpujareviewstatus(true);
        sessionStorage.removeItem("MerchantId");
      }
    } catch (e) { console.error(e); }
  }, [setpujareviewstatus]);

  useEffect(() => {
    void (async () => {
      await Get_Data_OnlinePuja();
      await Get_Data_PujaFor();
    })();
  }, [Get_Data_OnlinePuja, Get_Data_PujaFor]);

  useEffect(() => {
    if (UserLoginId && MerchantId) void (async () => { await PhonePe_handlePayment(MerchantId); })();
  }, [MerchantId, UserLoginId, PhonePe_handlePayment]);

  const goToDetail = (card) => router.push(`/online-puja/${getSlug(card)}`);

  const filteredPujaData = useMemo(() => {
    if (!Array.isArray(allPujaData)) return [];
    let list = allPujaData.filter((item) => {
      if (!item?.PujaID) return false;
      const matchesSearch = item.PujaName?.toLowerCase().includes(searchVal.toLowerCase());
      const catObj = PujaForsdata?.find((pf) => pf.PujaFors?.toLowerCase() === selectedCategory.toLowerCase());
      const matchesCat = selectedCategory === "all" || item.PujaFor?.toLowerCase() === selectedCategory.toLowerCase() || item.PujaForID === catObj?.PujaForID;
      const matchesTab = matchCategory(item, activeTab);
      const pr = PRICE_RANGES.find((p) => p.id === priceRange);
      const amt = item.Amt || 0;
      const matchesPrice = !pr || pr.id === "all" || (amt >= pr.min && amt <= pr.max);
      const matchesType = !selectedTypes.length || selectedTypes.some((t) => item.PujaFor?.toLowerCase().includes(t.toLowerCase()) || item.PujaName?.toLowerCase().includes(t.toLowerCase().split(" ")[0]));
      const matchesPurpose = !selectedPurposes.length || selectedPurposes.some((p) => item.PujaFor?.toLowerCase().includes(p.toLowerCase().split(" ")[0]));
      return matchesSearch && matchesCat && matchesTab && matchesPrice && matchesType && matchesPurpose;
    });
    if (sortBy === "price-low") list.sort((a, b) => (a.Amt || 0) - (b.Amt || 0));
    else if (sortBy === "price-high") list.sort((a, b) => (b.Amt || 0) - (a.Amt || 0));
    else if (sortBy === "name") list.sort((a, b) => (a.PujaName || "").localeCompare(b.PujaName || ""));
    return list;
  }, [allPujaData, searchVal, selectedCategory, PujaForsdata, activeTab, priceRange, selectedTypes, selectedPurposes, sortBy]);

  const featuredPujas = allPujaData.slice(0, 5);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredPujaData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPujaData.length / itemsPerPage) || 1;

  const applyFilters = () => {
    setSearchVal(draftFilters.search);
    setSelectedTypes(draftFilters.types);
    setSelectedPurposes(draftFilters.purposes);
    setPriceRange(draftFilters.price);
    setSelectedDurations(draftFilters.durations);
    setSortBy(draftFilters.sort);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchVal(""); setSelectedCategory("all"); setActiveTab("all");
    setPriceRange("all"); setSelectedTypes([]); setSelectedPurposes([]); setSelectedDurations([]);
    setSortBy("popularity"); setCurrentPage(1);
    setDraftFilters({ search: "", types: [], purposes: [], price: "all", durations: [], sort: "popularity" });
  };

  const openAllPujas = () => { setView("listing"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const PujaCard = ({ card, variant = "featured" }) => (
    <div className={`overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md ${variant === "listing" ? "" : ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => goToDetail(card)}>
        <img src={card.PujaImage ? `https://${card.PujaImage.replace(/\\/g, "/")}` : "/default-image.jpg"} alt={card.PujaName} className="h-full w-full object-cover" onError={(e) => { e.target.src = "/default-image.jpg"; }} />
        <span className="absolute left-2 top-2 rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-white">Popular</span>
        {variant === "listing" && <span className="absolute right-2 top-2 rounded bg-[#FF5C00] px-2 py-0.5 text-[10px] font-bold text-white">Live Puja</span>}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2">{card.PujaName}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{card.ShortDescription || "For peace, prosperity and positive energy."}</p>
        {variant === "listing" && (
          <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><FaClock size={9} /> 3 - 4 Hours</span>
            <span className="flex items-center gap-1"><FaLandmark size={9} /> At Temple</span>
          </div>
        )}
        <div className={`mt-2 flex items-center ${variant === "listing" ? "justify-between" : "gap-2"}`}>
          <div>
            <span className="text-lg font-bold text-[#FF5C00]">₹{(card.Amt || 0).toLocaleString()}</span>
            {variant === "featured" && <p className="text-[10px] text-gray-400">One Time</p>}
          </div>
          {variant === "listing" && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#FF5C00]">
              <FaStar size={10} /> 4.8 <span className="text-gray-400 font-normal">(2.6K)</span>
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => goToDetail(card)}
          className={`mt-3 w-full rounded-lg py-2.5 text-xs font-bold transition ${variant === "featured" ? "text-white hover:opacity-90" : "border-2 text-[#FF5C00] hover:bg-orange-50"}`}
          style={variant === "featured" ? { backgroundColor: ORANGE } : { borderColor: ORANGE }}
        >
          {variant === "featured" ? "Book Now" : "View Details"}
        </button>
      </div>
    </div>
  );

  /* ─── LISTING VIEW (Image 2) ─── */
  if (view === "listing") {
    return (
      <div className="min-h-screen bg-white pt-[72px]">
        <PageBanner
          bannerSrc={PAGE_BANNER_IMAGES.puja}
          currentPage="All Puja Services"
          crumbs={[{ label: "Online Puja", href: "/online-puja" }]}
          title="All Puja Services"
          subtitle="Explore 100+ authentic pujas performed by experienced pandits at holy temples."
        />

        {/* Category tabs */}
        <div className="border-b border-gray-100 bg-white">
          <div className="main-container flex gap-2 overflow-x-auto px-4 py-3">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" onClick={() => { setActiveTab(c.id); setCurrentPage(1); }}
                className={`flex shrink-0 flex-col items-center rounded-xl border-2 px-3 py-2 transition ${activeTab === c.id ? "border-[#FF5C00] bg-orange-50" : "border-gray-100"}`}>
                <c.icon size={16} className="text-[#FF5C00]" />
                <span className="mt-1 text-[10px] font-semibold text-gray-700">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="main-container grid gap-6 px-4 py-6 lg:grid-cols-12">
          {/* Filters sidebar */}
          <aside className="space-y-4 lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A]">Filter Puja Services</h3>
              <button type="button" onClick={resetFilters} className="text-xs font-semibold text-[#FF5C00]">Reset All</button>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
              <input type="text" placeholder="Search Puja" value={draftFilters.search} onChange={(e) => setDraftFilters((d) => ({ ...d, search: e.target.value }))} className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#FF5C00]" />
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="mb-2 text-xs font-bold text-gray-700">Puja Type</p>
              {PUJA_TYPES.map((t) => (
                <label key={t} className="mb-1.5 flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={draftFilters.types.includes(t)} onChange={(e) => setDraftFilters((d) => ({ ...d, types: e.target.checked ? [...d.types, t] : d.types.filter((x) => x !== t) }))} className="accent-[#FF5C00]" />
                  {t}
                </label>
              ))}
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="mb-2 text-xs font-bold text-gray-700">Purpose</p>
              {PURPOSES.map((p) => (
                <label key={p} className="mb-1.5 flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={draftFilters.purposes.includes(p)} onChange={(e) => setDraftFilters((d) => ({ ...d, purposes: e.target.checked ? [...d.purposes, p] : d.purposes.filter((x) => x !== p) }))} className="accent-[#FF5C00]" />
                  {p}
                </label>
              ))}
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="mb-2 text-xs font-bold text-gray-700">Price Range</p>
              {PRICE_RANGES.map((p) => (
                <label key={p.id} className="mb-1.5 flex items-center gap-2 text-xs text-gray-600">
                  <input type="radio" name="price" checked={draftFilters.price === p.id} onChange={() => setDraftFilters((d) => ({ ...d, price: p.id }))} className="accent-[#FF5C00]" />
                  {p.label}
                </label>
              ))}
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="mb-2 text-xs font-bold text-gray-700">Duration</p>
              {DURATIONS.map((d) => (
                <label key={d} className="mb-1.5 flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={draftFilters.durations.includes(d)} onChange={(e) => setDraftFilters((df) => ({ ...df, durations: e.target.checked ? [...df.durations, d] : df.durations.filter((x) => x !== d) }))} className="accent-[#FF5C00]" />
                  {d}
                </label>
              ))}
            </div>
            <select value={draftFilters.sort} onChange={(e) => setDraftFilters((d) => ({ ...d, sort: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
              <option value="popularity">Sort By: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <button type="button" onClick={applyFilters} className="w-full rounded-lg py-3 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>Apply Filters</button>
          </aside>

          {/* Grid */}
          <div className="lg:col-span-9">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
              <span>Showing {filteredPujaData.length ? indexOfFirst + 1 : 0} – {Math.min(indexOfLast, filteredPujaData.length)} of {filteredPujaData.length} Puja Services</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none">
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            {loading ? <LoadingIndicator /> : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {currentItems.map((card) => <PujaCard key={card.PujaID} card={card} variant="listing" />)}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 disabled:opacity-40"><FaChevronLeft size={12} /></button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((page) => (
                  <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${currentPage === page ? "text-white" : "border border-gray-200"}`} style={currentPage === page ? { backgroundColor: ORANGE } : {}}>{page}</button>
                ))}
                <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 disabled:opacity-40"><FaChevronRight size={12} /></button>
              </div>
            )}
          </div>
        </div>

        {/* CTA banner */}
        <section className="mx-4 mb-6 rounded-2xl bg-orange-50 p-5 sm:mx-auto sm:max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <FaCalendarAlt size={24} className="text-[#FF5C00]" />
              <p className="text-sm text-gray-700"><strong>Can&apos;t Find the Puja You&apos;re Looking For?</strong><br />Our experts will help you find the right puja for your needs.</p>
            </div>
            <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>Consult Our Experts →</button>
          </div>
        </section>

        <section className="border-t border-orange-50 bg-[#FFF9F1] py-8">
          <h2 className="mb-6 text-center text-lg font-bold text-[#0F172A]">Why Book Puja with AstroCall?</h2>
          <div className="main-container grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-6">
            {WHY_FOOTER.map(({ icon: Icon, title }) => (
              <div key={title} className="text-center">
                <Icon size={20} className="mx-auto text-[#FF5C00]" />
                <p className="mt-2 text-[11px] font-semibold text-gray-700">{title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ─── LANDING VIEW (Image 1) ─── */
  return (
    <div className="min-h-screen bg-white pt-[72px]">

      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.puja}
        currentPage="Online Puja"
        title={
          <>
            Online Puja
            <span className="mt-2 block text-lg font-bold text-[#FF5C00] sm:text-xl">
              Perform Powerful Vedic Pujas from Home
            </span>
          </>
        }
        subtitle="Perform powerful Vedic pujas by experienced pandits for peace, prosperity and positive energy."
      >
        {/* <ul className="mt-4 hidden flex-col gap-2.5 md:flex sm:gap-3 sm:mt-5">
          {[
            { icon: FaUserCheck, label: "100% Verified Pandits" },
            { icon: FaLock, label: "Private & Secure Booking" },
            { icon: FaBolt, label: "Live Puja Streaming" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs font-semibold text-[#0F172A] sm:text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-[#FF5C00]">
                <Icon size={14} />
              </span>
              {label}
            </li>
          ))}
        </ul> */}
        <div className="mt-4 flex flex-wrap gap-4">
          {[{ icon: FaBolt, t: "Instant Generation" }, { icon: FaShieldAlt, t: "100% Accurate Vedic Chart" }, { icon: FaStar, t: "Detailed Predictions" }].map(({ icon: Icon, t }) => (
            <span key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Icon size={13} className="text-[#FF5C00]" /> {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-row gap-1.5 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/chat-to-astrologers")}
            className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#FF5C00] px-1.5 text-[11px] font-semibold text-white shadow-[0_3px_12px_rgba(255,92,0,0.22)] transition hover:bg-[#E85500] min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <IoMdChatboxes className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
            Chat Now
          </button>

          <button
            type="button"
            onClick={() => router.push("/talk-to-astrologers")}
            className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-[#FF5C00] bg-white/95 px-1.5 text-[11px] font-semibold text-[#FF5C00] backdrop-blur-sm transition hover:bg-orange-50 min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <MdPhoneInTalk className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
            Call Now
          </button>


        </div>

      </PageBanner>

      {/* Hero */}
      {/* <section className="border-b border-orange-50" style={{ backgroundColor: CREAM }}>
        <div className="main-container px-4 py-6 sm:py-8">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
            <button type="button" onClick={() => router.push("/")} className="hover:text-[#FF5C00]">Home</button>
            <FaChevronRight size={8} className="text-gray-300" />
            <span className="font-medium text-gray-700">Puja</span>
          </nav>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-[#0F172A] sm:text-4xl">Puja Services</h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">Perform Powerful Vedic Pujas by Experienced Pandits for Peace, Prosperity and Positive Energy.</p>
              <div className="mt-4 flex flex-wrap gap-4">
                {HERO_FEATURES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100"><Icon size={12} className="text-[#FF5C00]" /></span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              {HERO_SERVICES.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="mb-3 flex items-center gap-3 last:mb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50"><Icon size={14} className="text-[#FF5C00]" /></span>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{title}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <div className="main-container px-4 py-8">
        {/* Categories */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Popular Puja Categories</h2>
            <button type="button" onClick={openAllPujas} className="text-sm font-semibold text-[#FF5C00] hover:underline">View All Categories →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" onClick={() => { setActiveTab(c.id); openAllPujas(); }}
                className={`flex shrink-0 flex-col items-center rounded-xl border-2 px-4 py-3 transition ${c.id === "all" ? "border-[#FF5C00] bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}>
                <c.icon size={20} className="text-[#FF5C00]" />
                <span className="mt-2 text-xs font-semibold text-gray-700">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Featured Pujas</h2>
            <button type="button" onClick={openAllPujas} className="text-sm font-semibold text-[#FF5C00] hover:underline">View All Pujas →</button>
          </div>
          {loading ? <LoadingIndicator /> : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {featuredPujas.map((card) => <PujaCard key={card.PujaID} card={card} variant="featured" />)}
            </div>
          )}
        </section>

        {/* Why Perform */}
        <section className="mb-10 text-center">
          <h2 className="text-lg font-bold text-[#0F172A]">Why Perform Puja with AstroCall?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {WHY_ITEMS.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="rounded-xl border border-gray-100 p-4">
                <Icon size={24} className="mx-auto text-[#FF5C00]" />
                <p className="mt-2 text-sm font-bold text-[#0F172A]">{title}</p>
                <p className="mt-1 text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10 text-center">
          <h2 className="text-lg font-bold text-[#0F172A]">How It Works?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {HOW_STEPS.map(({ icon: Icon, title, sub }, i) => (
              <div key={title} className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ backgroundColor: ORANGE }}>
                  <Icon size={18} />
                </div>
                <p className="mt-2 text-xs font-bold text-[#0F172A]">{title}</p>
                <p className="mt-1 text-[10px] text-gray-500">{sub}</p>
                {i < HOW_STEPS.length - 1 && <FaChevronRight className="absolute right-0 top-5 hidden text-gray-300 lg:block" size={12} />}
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">What Devotees Say</h2>
            <button type="button" className="text-sm font-semibold text-[#FF5C00]">View All Reviews</button>
          </div>
          <div className="relative flex items-center gap-3">
            <button type="button" onClick={() => setTestimonialIdx((i) => Math.max(0, i - 1))} className="shrink-0 rounded-full border border-gray-200 p-2"><FaChevronLeft size={12} /></button>
            <div className="grid flex-1 gap-4 sm:grid-cols-3">
              {TESTIMONIALS.slice(testimonialIdx, testimonialIdx + 3).map((t) => (
                <div key={t.name} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[#FF5C00]">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.city}</p>
                      <div className="flex text-[#FF5C00]">{Array.from({ length: t.rating }).map((_, i) => <FaStar key={i} size={10} />)}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-gray-600">{t.text}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setTestimonialIdx((i) => Math.min(TESTIMONIALS.length - 3, i + 1))} className="shrink-0 rounded-full border border-gray-200 p-2"><FaChevronRight size={12} /></button>
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-10" style={{ backgroundColor: ORANGE }}>
        <div className="main-container relative flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">Need Help Choosing the Right Puja?</h2>
            <p className="mt-1 text-sm text-white/80">Talk to our experts and find the best puja for your needs.</p>
          </div>
          <button type="button" onClick={() => router.push("/talk-to-astrologers")} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#FF5C00]">
            <FaHeadset size={14} /> Talk to Expert
          </button>
        </div>
      </section>
    </div>
  );
}

export default function OnlinePujaPageClient() {
  const [pujareviewstatus, setpujareviewstatus] = useState(false);
  return (
    <MenuContext.Provider value={{ pujareviewstatus, setpujareviewstatus }}>
      <OnlinePuja />
    </MenuContext.Provider>
  );
}
