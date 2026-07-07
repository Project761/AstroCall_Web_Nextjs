"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { getPostData } from "../../utils/api.js";
import { useRouter, useParams } from "next/navigation";
import { useMenuContext } from "../../hooks/useMenuContext";
import { FaStar, FaCheck, FaStarHalf, FaCartShopping } from "react-icons/fa6";
import { sanitizeHtml } from "@/app/lib/sanitizeHtml";
import {
  FaGem, FaArrowLeft, FaCommentDots, FaShieldAlt, FaTruck, FaUndo,
  FaCreditCard, FaCertificate, FaSun, FaHeart, FaChevronRight, FaChevronLeft,
  FaBolt, FaUsers, FaLeaf, FaSearch,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import AuthModal from "@/app/components/AuthModal";
import Image from "next/image";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";

const LoadingIndicator = ({ color = ORANGE }) => (
  <div className="flex justify-center py-20">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200" style={{ borderTopColor: color }} />
  </div>
);

const SIDEBAR_NAV = [
  { label: "Overview", icon: FaGem },
  { label: "Gemstones by Planet", icon: FaSun },
  { label: "Recommended for You", icon: FaStar },
  { label: "Gemstone Finder", icon: FaSearch },
  { label: "Benefits of Gemstones", icon: FaLeaf },
  { label: "How to Wear Gemstones", icon: FaCertificate },
  { label: "Certification", icon: FaShieldAlt },
  { label: "FAQs", icon: FaCommentDots },
];

const BENEFIT_CARDS = [
  { title: "Boosts Confidence", desc: "Enhances self-esteem and leadership qualities.", color: "#8B5CF6" },
  { title: "Career Growth", desc: "Attracts professional success and recognition.", color: "#3B82F6" },
  { title: "Health & Vitality", desc: "Strengthens physical and mental well-being.", color: "#22C55E" },
  { title: "Relationship Harmony", desc: "Improves love life and marital bliss.", color: "#EF4444" },
  { title: "Financial Prosperity", desc: "Attracts wealth and abundance.", color: "#EAB308" },
  { title: "Spiritual Growth", desc: "Deepens meditation and spiritual awareness.", color: "#F97316" },
];

const REVIEWS = [
  { name: "Priya Sharma", text: "Authentic gemstone, exactly as described. Fast delivery and great packaging!", rating: 5 },
  { name: "Rohit Verma", text: "Lab certificate included. Very satisfied with the quality and energization.", rating: 5 },
  { name: "Anjali Mehta", text: "Beautiful ring setting. AstroCall's expert guidance helped me choose the right stone.", rating: 5 },
];

const TRUST_FOOTER = [
  { icon: FaGem, t1: "100% Natural Gemstones", t2: "Lab Certified" },
  { icon: FaBolt, t1: "Energized & Purified", t2: "By Vedic Mantras" },
  { icon: FaStar, t1: "Premium Quality", t2: "Finest Grade Gemstones" },
  { icon: FaUsers, t1: "Trusted by Millions", t2: "Across the Globe" },
  { icon: FaUndo, t1: "Easy Returns", t2: "7-Day Return Policy" },
];

const TABS = ["Benefits", "Who Should Wear", "Details", "How to Wear", "Care Instructions", "FAQs", "Reviews"];

const RATTI_SIZES = ["3.25", "4.25", "5.25", "6.25", "7.25"];
const METALS = ["Silver 925", "Gold 18K", "Gold 22K", "Panchdhatu"];

const calcDiscount = (current, original) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

const getSlug = (g) => g?.HeadingDescription?.toLowerCase().replace(/\s+/g, "-") || "";

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function GemstoneDetailsClient({ initialGemstoneRows = null }) {
  const router = useRouter();
  const { slug } = useParams();
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";
  const { setIsModalOpen, GetData_ActivityLog } = useMenuContext();

  const [gemstoneData, setGemstoneData] = useState(initialGemstoneRows || []);
  const [allGemstones, setAllGemstones] = useState([]);
  const [manualMainImage, setManualMainImage] = useState(null);
  const [loading, setLoading] = useState(!initialGemstoneRows);
  const [certificateCost] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [activeTab, setActiveTab] = useState("Benefits");
  const [selectedMetal, setSelectedMetal] = useState("Silver 925");
  const [selectedRatti, setSelectedRatti] = useState("5.25");
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  const GetsinglaData_Gemstone = useCallback(async () => {
    const val = {
      GemstoneID: "0",
      HeadingDescription: (typeof slug === "string" ? slug : slug?.[0])?.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim(),
    };
    try {
      const urlSet = typeof window !== "undefined" ? window.location.origin : "";
      const res = await axios.post(
        urlSet === "https://astrocall.live" ? "https://api.astrocall.live/api/Gemstone/GetsinglaData_Gemstone" : "https://liveapi.astrocall.live/api/Gemstone/GetsinglaData_Gemstone",
        val
      );
      const parseData = JSON.parse(res.data?.data);
      if (parseData?.Table) {
        setGemstoneData(parseData.Table);
        setManualMainImage(null);
        setLoading(false);
      }
    } catch (error) {
      if (error?.response?.status == 400 && error?.response?.data?.Message === "No Data Available") {
        const res = await getPostData("Gemstone/GetData_Gemstone", { IsActive: "1" });
        if (res) {
          const g = res?.find((item) => item?.HeadingDescription);
          setGemstoneData(g ? [g] : []);
          setManualMainImage(null);
        }
      }
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void (async () => {
      if (slug && !initialGemstoneRows) await GetsinglaData_Gemstone();
    })();
    getPostData("Gemstone/GetData_Gemstone", { IsActive: "1" }).then((res) => { if (res) setAllGemstones(res); }).catch(console.error);
  }, [slug, initialGemstoneRows, GetsinglaData_Gemstone]);

  useEffect(() => {
    if (UserLoginId && GetData_ActivityLog) GetData_ActivityLog("Gemstone Detail", `looking at ${slug} (Gemstone) Detail`);
  }, [UserLoginId, GetData_ActivityLog, slug]);

  const selectedGemstone = gemstoneData.find((item) => item.HeadingDescription) || {};
  const filteredData = useMemo(() => gemstoneData.filter((item) => item?.HeadingDescription), [gemstoneData]);
  const mainImage = manualMainImage ?? selectedGemstone?.Image1 ?? null;

  const finalPrice = ((selectedGemstone?.CurrentPrice || 0) + certificateCost) * qty;
  const discount = calcDiscount(selectedGemstone?.CurrentPrice, selectedGemstone?.originalPrice);
  const relatedGems = allGemstones.filter((g) => g.GemstoneID !== selectedGemstone?.GemstoneID && g.HeadingDescription).slice(0, 4);

  const handleBuyNow = (item) => {
    const payload = { ...item, selectedMetal, selectedRatti, qty };
    if (UserLoginId) {
      sessionStorage.setItem("selectedGemstone", JSON.stringify(payload));
      router.push("/checkout/address");
    } else {
      setIsAuthModalOpen(true);
      setIsModalOpen(true);
    }
  };

  const thumbnails = ["Image1", "Image2", "Image3", "Image4", "Image5"].filter((k) => selectedGemstone[k]);

  if (loading) return <div className="min-h-screen bg-white pt-16"><LoadingIndicator /></div>;
  if (!selectedGemstone?.HeadingDescription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Gemstone Not Found</h2>
          <button type="button" onClick={() => router.push("/gemstone")} className="mt-4 text-sm font-semibold text-[#FF5C00]">Back to Gemstones</button>
        </div>
      </div>
    );
  }

  const item = selectedGemstone;
  const rating = item.StarCount || 4.8;
  const reviewCount = item.TotalReview || 256;

  return (
    <div className="min-h-screen bg-white pt-[72px] pb-8">
      {/* <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.gemstone}
        currentPage={item.HeadingDescription}
        crumbs={[{ label: "Gemstones", href: "/gemstone" }]}
        title={item.HeadingDescription}
        subtitle="Authentic, lab-certified gemstones energized for astrological benefits."
        titleClassName="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl md:text-3xl"
      /> */}
      <div className="main-container px-4 py-4">

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar */}
          <aside className="space-y-4 lg:col-span-2 lg:sticky lg:top-20 lg:self-start">
            <button type="button" onClick={() => router.push("/gemstone")} className="flex items-center gap-2 text-xs text-gray-500 hover:text-[#FF5C00]">
              <FaArrowLeft size={10} /> Back
            </button>
            <nav className="hidden space-y-0.5 lg:block">
              {SIDEBAR_NAV.map(({ label, icon: Icon }) => (
                <button key={label} type="button" onClick={() => router.push("/gemstone")} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] text-gray-600 hover:bg-orange-50 hover:text-[#FF5C00]">
                  <Icon size={11} /> {label}
                </button>
              ))}
            </nav>
            <div className="rounded-xl border border-orange-100 bg-[#FFF9F1] p-3">
              <h3 className="text-xs font-bold text-[#0F172A]">Need Help Choosing?</h3>
              <p className="mt-1 text-[10px] text-gray-500">Chat with our gemstone experts.</p>
              <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-bold text-white" style={{ backgroundColor: ORANGE }}>
                <FaCommentDots size={11} /> Chat with Expert
              </button>
            </div>
            <div className="space-y-2">
              {["100% Natural & Certified", "Energized & Purified", "Secure Packaging", "Easy Returns"].map((t, i) => {
                const Icon = [FaCertificate, FaBolt, FaShieldAlt, FaUndo][i];
                return (
                  <div key={t} className="flex items-center gap-2 text-[10px] text-gray-600">
                    <Icon size={11} className="text-[#FF5C00]" /> {t}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Product top section */}
          <div className="lg:col-span-10">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Gallery */}
              <div>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  <img
                    src={mainImage ? `https://${mainImage.replace(/\\/g, "/")}` : "/default-image.jpg"}
                    alt={item.HeadingDescription}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = "/default-image.jpg"; }}
                  />
                  <span className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: ORANGE }}>Bestseller</span>
                  <button type="button" onClick={() => setIsFavorite(!isFavorite)} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                    <FaHeart size={14} className={isFavorite ? "text-red-500" : "text-gray-300"} />
                  </button>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {thumbnails.map((k, idx) => (
                    <button key={k} type="button" onClick={() => setManualMainImage(item[k])} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${mainImage === item[k] ? "border-[#FF5C00]" : "border-gray-200"}`}>
                      <img src={`https://${item[k].replace(/\\/g, "/")}`} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-500">360°</div>
                </div>
              </div>

              {/* Product info */}
              <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{item.HeadingDescription}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <FaSun size={13} className="text-[#FF5C00]" /> Ruling Planet: {item.Category || "Sun"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => {
                      if (i + 1 <= Math.floor(rating)) return <FaStar key={i} size={12} />;
                      if (i < rating) return <FaStarHalf key={i} size={12} />;
                      return <FaStar key={i} size={12} className="text-gray-200" />;
                    })}
                  </div>
                  <span className="text-sm text-gray-500">{rating} ({reviewCount} Reviews)</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-extrabold text-[#FF5C00]">₹{finalPrice.toLocaleString()}</span>
                  {item.originalPrice && item.originalPrice > item.CurrentPrice && (
                    <span className="text-base text-gray-400 line-through">₹{item.originalPrice.toLocaleString()}</span>
                  )}
                  {discount > 0 && <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-600">{discount}% OFF</span>}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.ShortDescription || "") }} />

                {/* Specs */}
                <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                  {[
                    { label: "Color", val: item.Color || "Natural" },
                    { label: "Origin", val: item.Origin || "Certified" },
                    { label: "Shape", val: item.Shape || "Oval" },
                    { label: "Weight", val: `${selectedRatti} Ratti` },
                    { label: "Hardness", val: item.Hardness || "8-9 Mohs" },
                    { label: "Certification", val: "Free Lab Certificate" },
                  ].map((s) => (
                    <div key={s.label} className="flex gap-2"><span className="w-24 font-semibold text-gray-700">{s.label}:</span><span>{s.val}</span></div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-yellow-50 p-3 text-xs text-gray-700">
                  <p className="flex items-center gap-1 font-semibold text-[#0F172A]"><FaSun size={12} className="text-[#FF5C00]" /> Best for</p>
                  <p className="mt-1">Individuals seeking confidence, leadership, career growth and success in professional life.</p>
                </div>

                {/* Selectors */}
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Select Metal</label>
                    <select value={selectedMetal} onChange={(e) => setSelectedMetal(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]">
                      {METALS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Select Size (Ratti)</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {RATTI_SIZES.map((r) => (
                        <button key={r} type="button" onClick={() => setSelectedRatti(r)} className={`rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition ${selectedRatti === r ? "border-[#FF5C00] text-[#FF5C00] bg-orange-50" : "border-gray-200 text-gray-600"}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Qty</label>
                    <div className="mt-1 flex items-center gap-3">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600">−</button>
                      <span className="text-sm font-bold">{qty}</span>
                      <button type="button" onClick={() => setQty((q) => q + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600">+</button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button type="button" onClick={() => handleBuyNow(item)} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                    <FaCartShopping size={14} /> Add to Cart
                  </button>
                  <button type="button" onClick={() => handleBuyNow(item)} className="flex flex-1 items-center justify-center rounded-xl border-2 py-3 text-sm font-bold text-[#FF5C00]" style={{ borderColor: ORANGE }}>
                    Buy Now
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[10px] text-gray-500">
                  {[{ icon: FaTruck, t: "Free Shipping" }, { icon: FaTruck, t: "Delivery in 5-7 days" }, { icon: FaUndo, t: "7-Day Returns" }, { icon: FaCertificate, t: "Lab Certificate" }, { icon: FaCreditCard, t: "Secure Payment" }].map(({ icon: Icon, t }) => (
                    <span key={t} className="flex items-center gap-1"><Icon size={10} className="text-[#FF5C00]" /> {t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs section */}
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="overflow-x-auto border-b border-gray-100">
                  <div className="flex gap-1">
                    {TABS.map((tab) => (
                      <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-semibold sm:text-sm ${activeTab === tab ? "border-[#FF5C00] text-[#FF5C00]" : "border-transparent text-gray-400"}`}>
                        {tab}{tab === "Reviews" && ` (${reviewCount})`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  {activeTab === "Benefits" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {BENEFIT_CARDS.map((b) => (
                        <div key={b.title} className="rounded-xl border border-gray-100 p-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm" style={{ backgroundColor: b.color }}>✦</div>
                          <p className="mt-2 text-sm font-bold text-[#0F172A]">{b.title}</p>
                          <p className="mt-1 text-xs text-gray-500">{b.desc}</p>
                        </div>
                      ))}
                      {filteredData[0]?.Benefits && (
                        <div className="col-span-full rounded-xl bg-orange-50 p-4 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(filteredData[0].Benefits) }} />
                      )}
                    </div>
                  )}
                  {activeTab === "Who Should Wear" && (
                    <p className="text-sm text-gray-600">Recommended for individuals with weak or afflicted ruling planets in their birth chart. Consult our astrologers for personalized guidance.</p>
                  )}
                  {activeTab === "Details" && (
                    <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(filteredData[0]?.DetailDescription || item.ShortDescription || "") }} />
                  )}
                  {activeTab === "How to Wear" && (
                    <ul className="space-y-2 text-sm text-gray-600">
                      {["Wear on the recommended finger (usually ring finger)", "Set in the correct metal as per astrology", "Wear on the auspicious day and time (Muhurat)", "Chant the associated mantra while wearing", "Ensure the gemstone touches the skin"].map((t) => (
                        <li key={t} className="flex items-start gap-2"><FaCheck className="mt-0.5 shrink-0 text-green-500" size={12} /> {t}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "Care Instructions" && (
                    <ul className="space-y-2 text-sm text-gray-600">
                      {["Clean with mild soap and lukewarm water", "Avoid harsh chemicals and ultrasonic cleaners", "Store separately to prevent scratches", "Remove before swimming or exercising", "Re-energize periodically with mantras"].map((t) => (
                        <li key={t} className="flex items-start gap-2"><FaCheck className="mt-0.5 shrink-0 text-green-500" size={12} /> {t}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "FAQs" && filteredData[0]?.FAQ && (
                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeHtml(filteredData[0].FAQ) }} />
                  )}
                  {activeTab === "FAQs" && !filteredData[0]?.FAQ && (
                    <p className="text-sm text-gray-500">Contact our experts for gemstone-related questions.</p>
                  )}
                  {activeTab === "Reviews" && (
                    <div className="space-y-4">
                      {REVIEWS.map((r) => (
                        <div key={r.name} className="rounded-xl border border-gray-100 p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#FF5C00]">{r.name[0]}</div>
                            <div>
                              <p className="text-sm font-bold">{r.name}</p>
                              <p className="flex items-center gap-1 text-[10px] text-green-600"><MdVerified size={10} /> Verified Buyer</p>
                            </div>
                            <div className="ml-auto flex text-yellow-400">{Array.from({ length: r.rating }).map((_, i) => <FaStar key={i} size={10} />)}</div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom detail columns */}
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-[#0F172A]">About {item.HeadingDescription}</h3>
                    <p className="mt-2 text-xs text-gray-600">{stripHtml(item.ShortDescription) || "A premium natural gemstone for astrological remedies."}</p>
                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                      {[["Ruling Planet", item.Category || "Sun"], ["Associated Rashi", "Leo"], ["Associated Chakra", "Solar Plexus"], ["Element", "Fire"], ["Day", "Sunday"], ["Best Time", "Sunrise"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-gray-50 py-1"><span className="text-gray-500">{k}</span><span className="font-medium">{v}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-[#0F172A]">How to Wear {item.HeadingDescription?.split(" ")[0]}</h3>
                    <ul className="mt-2 space-y-1.5">
                      {["Sunday morning during Shukla Paksha", "Ring finger of the working hand", "Set in gold or copper metal", "Chant Surya mantra 108 times"].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-xs text-gray-600"><FaCheck className="mt-0.5 shrink-0 text-green-500" size={10} /> {t}</li>
                      ))}
                    </ul>
                    <div className="mt-3 rounded-lg bg-yellow-50 p-2 text-[10px] text-gray-600">💡 Consult an astrologer before wearing for best results.</div>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-4">
                    <h3 className="text-sm font-bold text-[#0F172A]">Care Instructions</h3>
                    <ul className="mt-2 space-y-1.5">
                      {["Clean with soft cloth weekly", "Avoid extreme temperatures", "Store in velvet pouch", "Get re-energized annually"].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-xs text-gray-600"><FaCheck className="mt-0.5 shrink-0 text-green-500" size={10} /> {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Customer reviews carousel */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="shrink-0">
                    <h3 className="text-lg font-bold text-[#0F172A]">What Our Customers Say</h3>
                    <p className="text-3xl font-extrabold text-[#FF5C00]">{rating}</p>
                    <div className="flex text-yellow-400">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} size={12} />)}</div>
                    <p className="text-xs text-gray-500">{reviewCount} reviews</p>
                  </div>
                  <div className="relative flex-1">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {REVIEWS.slice(reviewIdx, reviewIdx + 2).map((r) => (
                        <div key={r.name} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-orange-100 text-center text-xs font-bold leading-8 text-[#FF5C00]">{r.name[0]}</div>
                            <div>
                              <p className="text-xs font-bold">{r.name}</p>
                              <p className="text-[10px] text-green-600">Verified Buyer</p>
                            </div>
                          </div>
                          <div className="mt-1 flex text-yellow-400">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} size={9} />)}</div>
                          <p className="mt-2 text-xs text-gray-600">{r.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <button type="button" onClick={() => setReviewIdx((i) => Math.max(0, i - 1))} className="rounded-full border border-gray-200 p-2"><FaChevronLeft size={12} /></button>
                      <button type="button" onClick={() => setReviewIdx((i) => Math.min(REVIEWS.length - 2, i + 1))} className="rounded-full border border-gray-200 p-2"><FaChevronRight size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <aside className="space-y-4">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#0F172A]">Want to know if {item.HeadingDescription?.split(" ")[0]} is right for you?</h3>
                  <div className="mt-3 flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                        <Image src="/images/profile pic.webp" alt="" fill className="object-cover" sizes="32px" />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => router.push("/talk-to-astrologers")} className="mt-3 w-full rounded-lg border-2 py-2 text-xs font-bold text-[#FF5C00]" style={{ borderColor: ORANGE }}>
                    Talk to Astrologer
                  </button>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#0F172A]">You May Also Like</h3>
                  <ul className="mt-3 space-y-3">
                    {relatedGems.map((g) => (
                      <li key={g.GemstoneID}>
                        <button type="button" onClick={() => router.push(`/gemstone/${getSlug(g)}`)} className="flex w-full gap-3 text-left">
                          <img src={g.Image1 ? `https://${g.Image1.replace(/\\/g, "/")}` : "/default-image.jpg"} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#0F172A] line-clamp-1">{g.HeadingDescription}</p>
                            <p className="text-xs font-bold text-[#FF5C00]">₹{g.CurrentPrice?.toLocaleString()}</p>
                            <div className="flex text-yellow-400">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} size={8} />)}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => router.push("/gemstone")} className="mt-3 text-xs font-semibold text-[#FF5C00] hover:underline">
                    View All Gemstones →
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Footer trust bar */}
      <section className="mt-8 border-t border-orange-50 bg-[#FFF9F1] py-6">
        <div className="main-container grid grid-cols-2 gap-4 px-4 md:grid-cols-5">
          {TRUST_FOOTER.map(({ icon: Icon, t1, t2 }) => (
            <div key={t1} className="flex items-start gap-2">
              <Icon size={16} className="mt-0.5 shrink-0 text-[#FF5C00]" />
              <div><p className="text-[11px] font-bold text-[#0F172A]">{t1}</p><p className="text-[10px] text-gray-500">{t2}</p></div>
            </div>
          ))}
        </div>
      </section>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onLoginSuccess={() => {
            setIsAuthModalOpen(false);
            const newId = localStorage.getItem("UserLoginId") || "";
            if (newId) {
              const payload = { ...selectedGemstone, selectedMetal, selectedRatti, qty };
              sessionStorage.setItem("selectedGemstone", JSON.stringify(payload));
              router.push("/checkout/address");
            }
          }}
        />
      )}
    </div>
  );
}
