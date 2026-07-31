"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { getPostData, TokenWithDeleteUpadateAdd } from "../utils/api.js";
import { useRouter } from "next/navigation";
import { useMenuContext } from "../hooks/useMenuContext";
import {
  FaGem, FaCertificate, FaSun, FaMoon, FaArrowLeft, FaCommentDots,
  FaShieldAlt, FaTruck, FaUndo, FaCreditCard, FaStar, FaSearch,
  FaChevronRight, FaChevronLeft, FaLeaf, FaBolt, FaUsers, FaCheck, FaHeart,
  FaLock,
  FaUserCheck,
} from "react-icons/fa";
import { MdPhoneInTalk, MdVerified } from "react-icons/md";
import axios from "axios";
import Image from "next/image";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";
import { IoMdChatboxes } from "react-icons/io";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";

const LoadingIndicator = ({ color = ORANGE, size = "medium" }) => {
  const sizeClass = size === "small" ? "w-4 h-4" : size === "large" ? "w-8 h-8" : "w-6 h-6";
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClass} animate-spin rounded-full border-2 border-gray-200`} style={{ borderTopColor: color }} />
    </div>
  );
};

const SIDEBAR_NAV = [
  { id: "overview", label: "Overview", icon: FaGem },
  { id: "by-planet", label: "Gemstones by Planet", icon: FaSun },
  { id: "recommended", label: "Recommended For You", icon: FaStar },
  { id: "finder", label: "Gemstone Finder", icon: FaSearch },
  { id: "benefits", label: "Benefits of Gemstones", icon: FaLeaf },
  { id: "how-to-wear", label: "How to Wear Gemstones", icon: FaCertificate },
  { id: "certification", label: "Certification", icon: FaShieldAlt },
  { id: "faqs", label: "FAQs", icon: FaCommentDots },
];

const PLANETS = [
  { planet: "Sun", gem: "Ruby (Manik)", benefit: "Brings confidence, authority & success", icon: FaSun, color: "#EF4444" },
  { planet: "Moon", gem: "Pearl (Moti)", benefit: "Emotional balance & mental peace", icon: FaMoon, color: "#94A3B8" },
  { planet: "Mars", gem: "Red Coral (Moonga)", benefit: "Courage, energy & vitality", icon: FaBolt, color: "#F97316" },
  { planet: "Mercury", gem: "Emerald (Panna)", benefit: "Intelligence, communication & business", icon: FaLeaf, color: "#22C55E" },
  { planet: "Jupiter", gem: "Yellow Sapphire (Pukhraj)", benefit: "Wisdom, prosperity & good fortune", icon: FaStar, color: "#EAB308" },
  { planet: "Venus", gem: "Diamond (Heera)", benefit: "Love, luxury & artistic talents", icon: FaGem, color: "#A855F7" },
  { planet: "Saturn", gem: "Blue Sapphire (Neelam)", benefit: "Discipline, focus & career growth", icon: FaGem, color: "#3B82F6" },
];

const TRUST_TOP = [
  { icon: FaGem, label: "100% Natural Gemstones" },
  { icon: FaCertificate, label: "Lab Certified" },
  { icon: FaBolt, label: "Energized & Purified" },
  { icon: FaStar, label: "Premium Quality" },
  { icon: FaUndo, label: "Easy Returns" },
];

const TRUST_BOTTOM = [
  { icon: FaCertificate, title: "Authentic & Certified", sub: "Lab tested gemstones" },
  { icon: FaBolt, title: "Energized by Experts", sub: "By Vedic Mantras" },
  { icon: FaStar, title: "Premium Quality", sub: "Finest grade gemstones" },
  { icon: FaUsers, title: "Trusted by Millions", sub: "Across the globe" },
];

const ARTICLES = [
  { title: "How Gemstones Work?", excerpt: "Understand how gemstones channel planetary energies to balance your life.", img: "/images/ChatBanner.png" },
  { title: "Gemstone Care Tips", excerpt: "Learn how to clean, store and maintain your precious gemstones.", img: "/images/ChatBanner.png" },
  { title: "Choosing the Right Gemstone", excerpt: "A guide to selecting gemstones based on your birth chart.", img: "/images/ChatBanner.png" },
  { title: "Certification Guide", excerpt: "Why lab certification matters when buying astrological gemstones.", img: "/images/ChatBanner.png" },
];

const calcDiscount = (current, original) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

const getSlug = (card) => card?.HeadingDescription?.toLowerCase().replace(/\s+/g, "-") || "";

const matchPlanetGem = (planets, allData) =>
  planets.map((p) => {
    const match = allData.find((g) =>
      g.HeadingDescription?.toLowerCase().includes(p.gem.split(" ")[0].toLowerCase()) ||
      g.HeadingDescription?.toLowerCase().includes(p.gem.split("(")[1]?.replace(")", "").toLowerCase())
    );
    return { ...p, data: match };
  });

export default function GemstonePageClient() {
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") : "";
  const { Gemstonereviewstatus, setGemstonereviewstatus, GetData_ActivityLog } = useMenuContext();
  const router = useRouter();

  const [searchVal, setSearchVal] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewsdata, setreviewsdata] = useState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [CategoryData, setCategoryData] = useState();
  const [allgemstoneData, setAllgemstoneData] = useState([]);
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNav, setActiveNav] = useState("overview");
  const [recIdx, setRecIdx] = useState(0);

  const popupData = typeof window !== "undefined" ? sessionStorage.getItem("GemstoneOrder") : "";
  const MerchantIdGemstone = typeof window !== "undefined" ? sessionStorage.getItem("MerchantIdGemstone") : "";
  const GemstoneOrder = popupData ? JSON.parse(popupData) : null;

  const Get_Data_gemstone = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPostData("Gemstone/GetData_Gemstone", { IsActive: "1" });
      if (res) {
        setAllgemstoneData(res);
        setreviewsdata(res?.filter((item) => item?.GemstoneID == GemstoneOrder?.GemstoneId));
      }
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }, [GemstoneOrder?.GemstoneId]);

  const GetData_GemstoneCategory = useCallback(async () => {
    try {
      const urlSet = typeof window !== "undefined" ? window.location.origin : "";
      const visitor_Id = typeof window !== "undefined" ? localStorage.getItem("visitor_Id") : "";
      const res = await axios.post(
        urlSet === "https://astrocall.live"
          ? "https://api.astrocall.live/api/GemstoneCategory/GetData_GemstoneCategory"
          : "https://liveapi.astrocall.live/api/GemstoneCategory/GetData_GemstoneCategory",
        { IsActive: "1" },
        { headers: { FingerPrintJsKey: visitor_Id, "Content-Type": "application/json" } }
      );
      const parseData = JSON.parse(res.data?.data);
      if (parseData?.Table) setCategoryData(parseData.Table);
    } catch (e) { console.log(e); }
  }, []);

  const PhonePe_handlePayment = useCallback(async (merchantId) => {
    try {
      const res = await TokenWithDeleteUpadateAdd("PhonePay/OrderStatus", { MerchantOrderId: merchantId });
      if (res?.state === "COMPLETED") {
        setGemstonereviewstatus(true);
        sessionStorage.removeItem("MerchantIdGemstone");
      }
    } catch (e) { console.error(e); }
  }, [setGemstonereviewstatus]);

  useEffect(() => {
    void (async () => {
      await Get_Data_gemstone();
    })();
  }, [Get_Data_gemstone]);
  useEffect(() => {
    void (async () => {
      await GetData_GemstoneCategory();
    })();
  }, [GetData_GemstoneCategory]);
  useEffect(() => {
    if (UserLoginId) GetData_ActivityLog("Gemstone", "Gemstone list is fetch Now");
  }, [UserLoginId, GetData_ActivityLog]);
  useEffect(() => {
    void (async () => {
      if (UserLoginId && MerchantIdGemstone) await PhonePe_handlePayment(MerchantIdGemstone);
    })();
  }, [MerchantIdGemstone, UserLoginId, PhonePe_handlePayment]);

  const Insert_GemstoneOrder_reviews = async () => {
    try {
      const res = await TokenWithDeleteUpadateAdd("GemstoneOrder/Update", {
        StarCount: rating, Comment: comment, GemstoneOrderID: GemstoneOrder?.GemstoneOrderID,
      });
      if (res) sessionStorage.removeItem("GemstoneOrder");
    } catch (e) { console.log(e); }
  };

  const filteredGemstoneData = useMemo(() => {
    return allgemstoneData.filter((item) => {
      const matchesName = item?.HeadingDescription?.toLowerCase().includes(searchVal?.toLowerCase());
      const categoryObj = CategoryData?.find((pf) => pf?.Category?.toLowerCase() === selectedCategory?.toLowerCase());
      const matchesCategory = selectedCategory === "all" ||
        item?.Category?.toLowerCase() === selectedCategory?.toLowerCase() ||
        item?.GemstoneID === categoryObj?.GemstoneID;
      return item?.GemstoneID && matchesName && matchesCategory;
    });
  }, [allgemstoneData, searchVal, selectedCategory, CategoryData]);

  const planetGems = useMemo(() => matchPlanetGem(PLANETS, allgemstoneData), [allgemstoneData]);
  const recommended = filteredGemstoneData.slice(0, 8);
  const visibleRec = recommended.slice(recIdx, recIdx + 4);

  const scrollTo = (id) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToDetail = (card) => router.push(`/gemstone/${getSlug(card)}`);

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.gemstone}
        currentPage="Gemstones"
        title={
          <>
            Gemstones
            <span className="mt-2 block text-lg font-bold text-[#FF5C00] sm:text-xl md:text-2xl">
              Enhance Your Life with the Power of Natural Gemstones
            </span>
          </>
        }
        subtitle="Harness the cosmic power of natural gemstones to balance planetary energies, attract prosperity, and bring harmony to your life."
      >
        <div className="mt-4 flex flex-wrap gap-4">
          {[{ icon: FaBolt, t: "Instant Generation" }, { icon: FaShieldAlt, t: "100% Accurate Vedic Chart" }, { icon: FaStar, t: "Detailed Predictions" }].map(({ icon: Icon, t }) => (
            <span key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Icon size={13} className="text-[#FF5C00]" /> {t}
            </span>
          ))}
        </div>
        {/* <ul className="mt-4 hidden flex-col gap-2.5 md:flex sm:gap-3 sm:mt-5">
          {[
            { icon: FaUserCheck, label: "100% Verified Astrologers" },
            { icon: FaLock, label: "Private & Secure Consultation" },
            { icon: FaBolt, label: "Instant Solution & Guidance" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs font-semibold text-[#0F172A] sm:text-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-[#FF5C00]">
                <Icon size={14} />
              </span>
              {label}
            </li>
          ))}
        </ul> */}

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
      <div className="main-container px-4 pb-10 pt-10 sm:pt-12">

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          {TRUST_TOP.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-600 sm:text-xs">
              <Icon size={14} className="text-[#FF5C00]" /> {label}
            </div>
          ))}
        </div>

        {/* By Planet */}
        {/* <section id="by-planet">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Gemstones by Planet</h2>
            <button type="button" className="text-sm font-semibold text-[#FF5C00] hover:underline">View All Planets →</button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {planetGems.map((p) => (
              <div key={p.planet} className="flex flex-col rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
                <p className="flex items-center justify-center gap-1 text-xs font-bold text-[#0F172A]">
                  <p.icon size={12} style={{ color: p.color }} /> {p.planet}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#FF5C00]">{p.gem}</p>
                <div className="relative mx-auto my-2 h-16 w-16 overflow-hidden rounded-lg bg-gray-50">
                  {p.data?.Image1 ? (
                    <img src={`https://${p.data.Image1.replace(/\\/g, "/")}`} alt={p.gem} className="h-full w-full object-cover" onError={(e) => { e.target.src = "/default-image.jpg"; }} />
                  ) : (
                    <div className="flex h-full items-center justify-center"><FaGem className="text-orange-200" /></div>
                  )}
                </div>
                <p className="flex-1 text-[10px] leading-snug text-gray-500">{p.benefit}</p>
                <button
                  type="button"
                  onClick={() => p.data ? goToDetail(p.data) : scrollTo("recommended")}
                  className="mt-2 w-full rounded-lg border-2 py-1.5 text-[11px] font-bold text-[#FF5C00] transition hover:bg-orange-50"
                  style={{ borderColor: ORANGE }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section> */}

        {/* Recommended + Finder */}
        {/* <section id="recommended" className="grid gap-5 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Recommended For You</h2>
                <p className="text-xs text-gray-500">Based on your birth details and planetary positions.</p>
              </div>
              <button type="button" className="text-sm font-semibold text-[#FF5C00] hover:underline">View Full Recommendation →</button>
            </div>
            {loading ? (
              <div className="flex items-center gap-3 py-10"><LoadingIndicator /><span className="text-sm text-gray-500">Loading gemstones...</span></div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(visibleRec.length ? visibleRec : filteredGemstoneData.slice(0, 4)).map((card) => {
                  const disc = calcDiscount(card.CurrentPrice, card.originalPrice);
                  return (
                    <div key={card.GemstoneID} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
                        <img src={card.Image1 ? `https://${card.Image1.replace(/\\/g, "/")}` : "/default-image.jpg"} alt={card.HeadingDescription} className="h-full w-full object-cover" onError={(e) => { e.target.src = "/default-image.jpg"; }} />
                      </div>
                      <p className="mt-2 text-xs font-bold text-[#0F172A] line-clamp-1">{card.HeadingDescription}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <span className="text-sm font-bold text-red-600">₹{card.CurrentPrice?.toLocaleString() || 0}</span>
                        {card.originalPrice && card.originalPrice > card.CurrentPrice && (
                          <span className="text-[10px] text-gray-400 line-through">₹{card.originalPrice?.toLocaleString()}</span>
                        )}
                        {disc > 0 && <span className="rounded bg-green-50 px-1 text-[10px] font-bold text-green-600">{disc}% OFF</span>}
                      </div>
                      <button type="button" onClick={() => goToDetail(card)} className="mt-2 w-full rounded-lg border-2 py-1.5 text-[11px] font-bold text-[#FF5C00]" style={{ borderColor: ORANGE }}>
                        View Product
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {recommended.length > 4 && (
              <div className="mt-3 flex justify-center gap-2">
                <button type="button" onClick={() => setRecIdx((i) => Math.max(0, i - 1))} className="rounded-full border border-gray-200 p-2 text-gray-500"><FaChevronLeft size={12} /></button>
                <button type="button" onClick={() => setRecIdx((i) => Math.min(recommended.length - 4, i + 1))} className="rounded-full border border-gray-200 p-2 text-gray-500"><FaChevronRight size={12} /></button>
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-2.5 text-[11px] text-gray-500">
              {[{ icon: FaTruck, t: "Free Shipping" }, { icon: FaUndo, t: "Easy 7-Day Returns" }, { icon: FaCreditCard, t: "Secure Payment" }, { icon: FaCertificate, t: "Comes with Lab Certificate" }].map(({ icon: Icon, t }) => (
                <span key={t} className="flex items-center gap-1"><Icon size={11} className="text-[#FF5C00]" /> {t}</span>
              ))}
            </div>
          </div>

          <div id="finder" className="rounded-xl border border-orange-100 bg-[#FFF9F1] p-5">
            <h3 className="text-sm font-bold text-[#0F172A]">Gemstone Finder</h3>
            <p className="mt-2 text-xs text-gray-500">Not sure which gemstone is right for you? Answer a few questions...</p>
            <ul className="mt-3 space-y-2">
              {["Personalized Recommendation", "Based on Vedic Astrology", "100% Accurate Results"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-xs text-gray-600">
                  <FaCheck className="text-green-500" size={10} /> {t}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => router.push("/freekundli")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
              Find My Gemstone <FaChevronRight size={11} />
            </button>
          </div>
        </section> */}


        <section>
          <div className="mb-4 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center  sm:justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">All Gemstones</h2>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-48">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                <input type="text" placeholder="Search..." value={searchVal} onChange={(e) => { setSearchVal(e.target.value); setCurrentPage(1); }} className="w-full rounded-lg border border-gray-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-[#FF5C00]" />
              </div>
              <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
                <option value="all">All Categories</option>
                {CategoryData?.map((c) => <option key={c.Category} value={c.Category}>{c.Category}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-full py-10 text-center"><LoadingIndicator /></div>
            ) : filteredGemstoneData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((card) => (
              <div key={card.GemstoneID} onClick={() => goToDetail(card)} className="cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                <img src={card.Image1 ? `https://${card.Image1.replace(/\\/g, "/")}` : "/default-image.jpg"} alt={card.HeadingDescription} className="h-36 w-full object-cover" onError={(e) => { e.target.src = "/default-image.jpg"; }} />
                <div className="p-3">
                  <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1">{card.HeadingDescription}</h3>
                  <p className="mt-1 text-sm font-bold text-[#FF5C00]">₹{card.CurrentPrice?.toLocaleString() || 0}</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); goToDetail(card); }} className="mt-2 w-full rounded-lg py-2 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Learn More */}
        <section id="benefits">
          <div className="mb-4 mt-10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Learn More About Gemstones</h2>
            <button type="button" onClick={() => router.push("/astrology-blog")} className="text-sm font-semibold text-[#FF5C00] hover:underline">View All Articles →</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ARTICLES.map((a) => (
              <div key={a.title} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-28">
                  <Image src={a.img} alt={a.title} fill className="object-cover" sizes="250px" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">{a.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{a.excerpt}</p>
                  <button type="button" onClick={() => router.push("/astrology-blog")} className="mt-2 text-xs font-semibold text-red-600 hover:underline">Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All gemstones grid */}


        {/* Certification & FAQs placeholders */}
        <section id="certification" className="rounded-xl mt-10 border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A]">Certification</h2>
          <p className="mt-2 text-sm text-gray-600">Every gemstone comes with a free lab certificate verifying authenticity, origin, and quality grade.</p>
        </section>

        <section id="how-to-wear" className="rounded-xl mt-10 border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A]">How to Wear Gemstones</h2>
          <p className="mt-2 text-sm text-gray-600">Wear gemstones on the correct finger, metal, and day as per Vedic astrology for maximum benefits.</p>
        </section>

        <section id="faqs" className="rounded-xl border mt-10 border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A]">FAQs</h2>
          <p className="mt-2 text-sm text-gray-600">Contact our experts for personalized gemstone recommendations based on your birth chart.</p>
        </section>
        {/* </div> */}
        {/* </div> */}
        {/* </div> */}

        {/* Bottom trust bar */}
        <section className="border-t border-orange-50 bg-[#FFF9F1] py-8">
          <div className="main-container grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
            {TRUST_BOTTOM.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100"><Icon size={16} className="text-[#FF5C00]" /></div>
                <div><p className="text-sm font-bold text-[#0F172A]">{title}</p><p className="text-xs text-gray-500">{sub}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Review popup */}
      {Gemstonereviewstatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-lg">
            <button type="button" onClick={() => { setGemstonereviewstatus(false); sessionStorage.removeItem("GemstoneOrder"); }} className="absolute right-3 top-3 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <div className="p-6">
              <h2 className="text-center text-lg font-semibold">Review Your Gemstone</h2>
              <p className="mb-4 text-center text-xs text-gray-500">Let us know what you think about your recent purchase.</p>
              {reviewsdata?.map((item, i) => (
                <div key={i} className="mb-4 flex items-center gap-3">
                  <img src={item?.Image1 ? `https://${item.Image1.replace(/\\/g, "/")}` : "/default-image.jpg"} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <h3 className="text-sm font-medium">{item?.HeadingDescription}</h3>
                </div>
              ))}
              <div className="mb-4 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} className={`text-4xl ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." className="mb-4 w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-orange-300" rows={4} />
              <button type="button" onClick={() => { Insert_GemstoneOrder_reviews(); setGemstonereviewstatus(false); }} className="w-full rounded-full py-3 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
