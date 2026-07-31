"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaStar, FaChevronRight, FaPhoneAlt, FaVideo, FaCommentDots,
  FaBullseye, FaUsers, FaClipboardList, FaGlobe, FaChevronLeft, FaHeart,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import {
  IoSparklesOutline, IoBriefcaseOutline, IoSchoolOutline, IoTimeOutline,
} from "react-icons/io5";
import { postWithToken } from "@/app/utils/api";
import { useMenuContext } from "../../hooks/useMenuContext";
import AuthModal from "../../components/AuthModal";
import InsufficientBalancePopup from "@/app/components/InsufficientBalancePopup.js";
import Image from "next/image";

const ORANGE = "#FF5C00";
const GREEN = "#00A35C";
const BLUE = "#3B82F6";

const TABS = ["About", "Expertise", "Reviews", "Ratings", "Availability", "Articles"];

export default function ChatAstrologerProfileClient() {
  const router = useRouter();
  const { loginUserData } = useMenuContext();
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";
  const id = typeof window !== "undefined" ? sessionStorage.getItem("AstroIDCallChat") : null;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
  const [insufficientBalanceData, setInsufficientBalanceData] = useState({ requiredAmount: 0, currentBalance: 0, astrologerName: "" });
  const [activeTab, setActiveTab] = useState("About");
  const [astro, setAstro] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem("selectedAstrologer");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarIdx, setSimilarIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const res = await postWithToken("Astrologer/UserGetSingleData_Astrologer", { ID: id });
          if (res) setAstro((prev) => ({ ...prev, ...res }));
        }
      } catch (e) { console.log(e); }
    })();
  }, []);

  const avatarSrc = astro?.AvatarUrl ? `https://${astro.AvatarUrl.replace(/\\/g, "/")}` : "/images/profile pic.webp";
  const data = {
    DisplayName: astro?.DisplayName || "Astrologer",
    Skills: astro?.skillsValue || astro?.Skills || "Vedic Astrology, Vastu Expert",
    Review: astro?.Review || 4.9,
    ReviewCount: astro?.ChatOrders ? (astro.ChatOrders >= 1000 ? `${(astro.ChatOrders / 1000).toFixed(1)}K` : String(astro.ChatOrders)) : "6.2K",
    ExperiencedYears: astro?.ExperiencedYears || 12,
    Consultations: astro?.ChatOrders ? `${astro.ChatOrders}+` : "1280+",
    Languages: astro?.LanguageValue || astro?.Languages || "Hindi, English, Sanskrit",
    About: astro?.Aboutme || `${astro?.DisplayName || "This astrologer"} is a renowned Vedic Astrologer with extensive experience in Kundli analysis, Prashna Kundli, Vastu, and Vedic remedies.`,
    AboutExtra: "His accurate predictions and practical solutions have helped thousands of individuals in solving problems related to love, career, marriage, health, business and much more.",
    PricePerMin: astro?.PricePerMin || 60,
    CallPrice: astro?.CallPrice || astro?.PricePerMin || 60,
    VideoPrice: astro?.VideoPrice || 80,
  };

  const skillTags = (data.Skills || "").split(",").map((s) => s.trim()).filter(Boolean);
  const EXPERTISE_LIST = skillTags.length ? skillTags : ["Vedic Astrology", "Kundli Analysis", "Vastu Shastra", "Career Guidance", "Marriage Prediction"];

  const [allFeedback, setAllFeedback] = useState([]);


  useEffect(() => {
    if (!id && UserLoginId) return;
    fetchFeedback();
  }, [id, UserLoginId]);

  const fetchFeedback = async () => {
    const val = { AstroId: id, Status: "" };
    try {
      const res = await postWithToken("Feedback/GetData_Feedback", val);
      console.log("Feedback response:", res);
      if (res) {
        setAllFeedback(res);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };



  const REVIEWS = [
    { name: "Priya Sharma", time: "2 days ago", rating: 5, text: "Very accurate predictions. Helped me with career decisions. Highly recommended!" },
    { name: "Rohit Verma", time: "1 week ago", rating: 5, text: "Consulted for marriage problem and got amazing results. Thank you!" },
    { name: "Anjali Mehta", time: "2 weeks ago", rating: 5, text: "Very polite and humble. The solutions were simple and effective." },
  ];
  const SIMILAR = [
    { name: "Pandit Rajesh", price: 45, rating: 4.8, img: "/images/profile pic.webp" },
    { name: "Acharya Meena", price: 55, rating: 4.9, img: "/images/profile pic.webp" },
    { name: "Guru Vikram", price: 40, rating: 4.7, img: "/images/profile pic.webp" },
  ];

  const checkBalance = (price) => {
    const req = parseFloat(price) * 5;
    const bal = loginUserData?.WalletAmt || 0;
    if (bal < req) {
      setInsufficientBalanceData({ requiredAmount: req, currentBalance: bal, astrologerName: data.DisplayName });
      setShowInsufficientBalancePopup(true);
      return false;
    }
    return true;
  };

  const startChat = () => {
    if (!UserLoginId) { setShowAuthModal(true); return; }
    const price = parseFloat(data.PricePerMin);
    if (!checkBalance(price)) return;
    router.push(`/chat-to-astrologers/user-chat-home?AstroId=${astro?.ID}&Type=chat&IsChat=${astro?.IsChat}`);
  };

  const startCall = () => {
    if (!UserLoginId) { setShowAuthModal(true); return; }
    const price = parseFloat(data.PricePerMin);
    if (!checkBalance(price)) return;
    router.push(`/talk-to-astrologers/user-talk-home?AstroId=${astro?.ID}&Type=call&IsCall=${astro?.IsCall}`);
  };

  const quickStats = [
    { icon: FaBullseye, value: "98%", label: "Accuracy", color: "#EF4444" },
    { icon: FaUsers, value: `${data.ReviewCount}+`, label: "Happy Clients", color: ORANGE },
    { icon: FaClipboardList, value: `${data.Consultations}`, label: "Consultations", color: ORANGE },
  ];

  const aboutStats = [
    { icon: IoTimeOutline, value: `${data.ExperiencedYears}+`, label: "Experience" },
    { icon: FaClipboardList, value: data.Consultations, label: "Consultations" },
    { icon: IoSparklesOutline, value: String(EXPERTISE_LIST.length), label: "Expertise" },
    { icon: FaUsers, value: `${data.ReviewCount}+`, label: "Clients" },
  ];

  return (
    <div className="min-h-screen bg-white pt-16 pb-28">
      <div className="main-container px-4 py-4">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <button type="button" onClick={() => router.push("/")} className="hover:text-[#FF5C00]">Home</button>
          <FaChevronRight size={8} className="text-gray-300" />
          <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="hover:text-[#FF5C00]">Chat with Astrologer</button>
          <FaChevronRight size={8} className="text-gray-300" />
          <span className="font-semibold text-gray-800">{data.DisplayName}</span>
        </nav>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-orange-100/50 p-5 sm:p-6 md:p-8" style={{ backgroundColor: "#fdead9" }}>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20">
            {/* <Image src="/horoimg/1.png" alt="" fill className="object-contain object-right" sizes="400px" /> */}
          </div>
          <div className="relative grid gap-6 lg:grid-cols-[auto_1fr_220px] lg:items-start">
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-orange-100 sm:h-52 sm:w-52 lg:mx-0">
              <Image src={avatarSrc} alt={data.DisplayName} fill className="object-cover" sizes="128px" priority />
            </div>
            <div className="text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <h1 className="text-xl font-extrabold text-[#0F172A] sm:text-2xl">{data.DisplayName}</h1>
                <MdVerified size={20} style={{ color: BLUE }} />
              </div>
              <p className="mt-1 text-sm text-gray-500">{data.Skills}</p>
              <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600 lg:justify-start">
                <FaStar className="text-[#FF5C00]" size={12} />
                <span className="font-semibold">{data.Review}</span>
                <span className="text-gray-400">({data.ReviewCount} Reviews)</span>
                <span className="text-gray-300">|</span>
                <span>{data.ExperiencedYears}+ Years Experience</span>
              </p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-gray-600 lg:justify-start">
                <FaGlobe className="text-[#22C55E]" size={12} />
                {data.Languages}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-6 lg:justify-start">
                {quickStats.map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon size={16} style={{ color: s.color }} className="mx-auto" />
                    <p className="mt-1 text-sm font-bold text-[#0F172A]">{s.value}</p>
                    <p className="text-[10px] text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-bold text-[#0F172A]">Available for</p>
              {[{ icon: FaCommentDots, label: "Online Chat" }, { icon: FaPhoneAlt, label: "Voice Call" },].map(({ icon: Icon, label }) => (
                <div key={label} className="mb-2 flex items-center gap-2 text-xs text-gray-600 last:mb-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-[#22C55E]"><Icon size={11} /></span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={startChat} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90" style={{ backgroundColor: ORANGE }}>
            <FaCommentDots size={14} /> Chat Now <span className="text-xs opacity-90">₹{data.PricePerMin}/min</span>
          </button>
          <button type="button" onClick={startCall} className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90" style={{ backgroundColor: GREEN }}>
            <FaPhoneAlt size={13} /> Call Now <span className="text-xs opacity-90">₹{data.CallPrice}/min</span>
          </button>

          <button type="button" onClick={() => setIsFavorite(!isFavorite)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <FaHeart size={16} className={isFavorite ? "text-red-500" : "text-gray-300"} />
          </button>
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="overflow-x-auto border-b border-gray-100">
              <div className="flex gap-1">
                {TABS.map((tab) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab ? "border-[#FF5C00] text-[#FF5C00]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                    {tab}{tab === "Reviews" && ` (${data.ReviewCount})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              {activeTab === "About" && (
                <>
                  <h2 className="text-lg font-bold text-[#0F172A]">About {data.DisplayName}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{data.About}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{data.AboutExtra}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {aboutStats.map((s) => (
                      <div key={s.label} className="rounded-xl bg-orange-50/60 p-4 text-center">
                        <s.icon size={18} className="mx-auto text-[#FF5C00]" />
                        <p className="mt-2 text-lg font-bold text-[#0F172A]">{s.value}</p>
                        <p className="text-[11px] text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === "Expertise" && (
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_LIST.map((tag) => (
                    <span key={tag} className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#FF5C00]">{tag}</span>
                  ))}
                </div>
              )}
              {activeTab === "Reviews" && (
                <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
                  {allFeedback?.length > 0 ? (
                    allFeedback.map((review, index) => {
                      const initials =
                        review?.UserName
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "U";

                      const rating = Number(review?.Rating || 4);

                      return (
                        <div
                          key={review?.Id || index}
                          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-[#FF5C00]">
                              {initials}
                            </div>

                            {/* User Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <h4 className="truncate text-sm font-semibold text-gray-900">
                                    {review?.UserName || "Anonymous"}
                                  </h4>

                                  <p className="mt-0.5 text-xs text-gray-500">
                                    {review?.CreatedTime || ""}
                                  </p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                      key={i}
                                      size={13}
                                      className={
                                        i < rating
                                          ? "text-[#FFB400]"
                                          : "text-gray-300"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Review */}
                              <p className="mt-3 text-sm leading-6 text-gray-600">
                                {review?.Comments || "No review available."}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
                      <p className="text-sm text-gray-500">
                        No reviews available.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "Ratings" && (
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[#0F172A]">{data.Review}</p>
                  <div className="mt-1 flex justify-center text-[#FF5C00]">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} size={14} />)}</div>
                  <p className="mt-1 text-sm text-gray-500">({data.ReviewCount} Reviews)</p>
                </div>
              )}
              {activeTab === "Availability" && (
                <div>
                  <p className="font-semibold text-[#0F172A]">Monday – Sunday</p>
                  <p className="mt-1 text-sm text-gray-600">6:00 AM to 11:00 PM</p>
                </div>
              )}
              {activeTab === "Articles" && (
                <p className="text-sm text-gray-500">Articles by {data.DisplayName} coming soon.</p>
              )}
            </div>

            {/* What Clients Say */}
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0F172A]">What Clients Say</h2>
                <button type="button" className="text-sm font-semibold text-[#FF5C00] hover:underline">View All Reviews</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {REVIEWS.map((r) => (
                  <div key={r.name} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-orange-100 text-center text-xs font-bold leading-8 text-[#FF5C00]">{r.name[0]}</div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">{r.name}</p>
                        <p className="text-[10px] text-gray-400">{r.time}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex text-[#FF5C00]">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} size={9} />)}</div>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-3">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Astrologers */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0F172A]">Similar Astrologers</h2>
                <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="text-sm font-semibold text-[#FF5C00] hover:underline">View All</button>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {SIMILAR.slice(similarIdx, similarIdx + 3).map((s) => (
                    <div key={s.name} className="rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm">
                      <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full">
                        <Image src={s.img} alt={s.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-[#0F172A]">{s.name}</p>
                      <p className="text-[10px] text-gray-500">₹{s.price}/min · {s.rating}★</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  <button type="button" onClick={() => setSimilarIdx((i) => Math.max(0, i - 1))} className="rounded-full border border-gray-200 p-2 text-gray-500 hover:border-[#FF5C00]"><FaChevronLeft size={12} /></button>
                  <button type="button" onClick={() => setSimilarIdx((i) => Math.min(SIMILAR.length - 3, i + 1))} className="rounded-full border border-gray-200 p-2 text-gray-500 hover:border-[#FF5C00]"><FaChevronRight size={12} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A]">Skills & Expertise</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {EXPERTISE_LIST.map((tag) => (
                  <span key={tag} className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#FF5C00]">{tag}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A]">Consultation Charges</h3>
              <div className="mt-3 space-y-3">
                {[{ label: "Chat", price: data.PricePerMin }, { label: "Voice Call", price: data.CallPrice },].map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{c.label}</span>
                    <span className="font-bold text-[#0F172A]">₹{c.price}/min</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={startChat} className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: ORANGE }}>
                Chat Now
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-orange-100 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <div className="main-container flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-serif text-sm font-bold text-[#0F172A] sm:text-base">Talk to {data.DisplayName} Now and get solutions to your problems</p>
            <p className="text-xs text-gray-500">100% Private | Secure | Trusted by {data.ReviewCount}+ Clients</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={startChat} className="rounded-full px-5 py-2 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>Chat Now</button>
            <button type="button" onClick={startCall} className="rounded-full px-5 py-2 text-sm font-bold text-white" style={{ backgroundColor: GREEN }}>Call Now</button>
          </div>
        </div>
      </div>

      <InsufficientBalancePopup isOpen={showInsufficientBalancePopup} onClose={() => setShowInsufficientBalancePopup(false)} requiredAmount={insufficientBalanceData.requiredAmount} currentBalance={insufficientBalanceData.currentBalance} astrologerName={insufficientBalanceData.astrologerName} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
