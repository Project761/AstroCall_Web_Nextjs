"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaChevronLeft,
  FaStar,
  FaUserCheck,
  FaLock,
  FaHeadset,
  FaHeart,
  FaBriefcase,
  FaFileAlt,
  FaQuestionCircle,
  FaCalendarAlt,
  FaArrowUp,
  FaCommentDots,
  FaPhone,
  FaVideo,
  FaPrayingHands,
  FaGem,
  FaOm,
  FaChartLine,
  FaClipboardCheck,
  FaLightbulb,
  FaCheckCircle,
  FaUpload,
  FaCompass,
  FaSun,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import PageBanner from "../components/PageBanner";

const ORANGE = "#FF5C00";
const ORANGE_LIGHT = "#FFF0E6";
const CREAM = "#FFF9F1";
const CARD = "rounded-xl border border-gray-100 bg-white shadow-sm";

const SIDEBAR_NAV = [
  { id: "overview", label: "Overview", icon: IoSparkles },
  { id: "kundli", label: "Birth Chart Analysis", icon: FaOm },
  { id: "dasha", label: "Dasha Predictions", icon: FaChartLine },
  { id: "marriage", label: "Marriage Guidance", icon: FaHeart },
  { id: "career", label: "Career Guidance", icon: FaBriefcase },
  { id: "remedies", label: "Remedies & Upay", icon: FaPrayingHands },
  { id: "gemstone", label: "Gemstone Recommendations", icon: FaGem },
  { id: "muhurat", label: "Muhurat Selection", icon: FaCalendarAlt },
  { id: "report", label: "Vedic Report", icon: FaFileAlt },
  { id: "faq", label: "FAQ", icon: FaQuestionCircle },
];

const HERO_FEATURES = [
  { icon: FaChartLine, label: "Detailed Birth Chart" },
  { icon: FaClipboardCheck, label: "Dasha Analysis" },
  { icon: FaLightbulb, label: "Personalized Remedies" },
  { icon: FaSun, label: "Life Path Guidance" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Share Birth Details", desc: "Provide your date, time and place of birth." },
  { step: 2, title: "Chart Analysis", desc: "Expert astrologer analyzes your Kundli." },
  { step: 3, title: "Personalized Report", desc: "Receive detailed predictions and insights." },
  { step: 4, title: "Remedies & Upay", desc: "Get customized remedies for challenges." },
  { step: 5, title: "Positive Changes", desc: "Apply guidance for a better life path." },
];

const CONSULTATION_TYPES = [
  { icon: FaOm, title: "Full Kundli Analysis", desc: "Complete birth chart reading with planetary positions and predictions.", price: "₹1,999" },
  { icon: FaHeart, title: "Marriage Consultation", desc: "Compatibility, timing and relationship guidance from your chart.", price: "₹1,499" },
  { icon: FaBriefcase, title: "Career Guidance", desc: "Career path, job changes and business decisions via Jyotish.", price: "₹1,499" },
  { icon: FaCalendarAlt, title: "Yearly Predictions", desc: "Month-by-month forecast based on dasha and transits.", price: "₹2,499" },
];

const BENEFITS = [
  { icon: FaSun, title: "Understand Your Destiny", desc: "Discover life purpose through your birth chart." },
  { icon: FaChartLine, title: "Planetary Insights", desc: "Know how planets influence your life." },
  { icon: FaGem, title: "Remedial Guidance", desc: "Gemstones, mantras and upay for challenges." },
  { icon: FaCalendarAlt, title: "Auspicious Timing", desc: "Choose the right muhurat for important events." },
  { icon: FaHeart, title: "Relationship Clarity", desc: "Marriage and compatibility insights." },
];

const EXPERTS = [
  { name: "Dr. Anant Sharma", title: "Vedic Astrologer", exp: "18+ Years", rating: "4.9", img: "/images/profile pic.webp" },
  { name: "Pt. Rajesh Verma", title: "Jyotish Acharya", exp: "15+ Years", rating: "4.8", img: "/images/profile pic.webp" },
  { name: "Acharya Meera Devi", title: "Kundli Specialist", exp: "12+ Years", rating: "4.9", img: "/images/profile pic.webp" },
];

const TIPS = [
  { icon: FaSun, tip: "Know your Lagna for accurate predictions" },
  { icon: FaOm, tip: "Chant your Ishta Devata mantra daily" },
  { icon: FaGem, tip: "Wear gemstones only after expert consultation" },
  { icon: FaCalendarAlt, tip: "Follow auspicious muhurat for new beginnings" },
  { icon: FaPrayingHands, tip: "Perform remedies with faith and consistency" },
  { icon: FaHeart, tip: "Match kundlis before marriage decisions" },
];

const WHY_CHOOSE = [
  "Certified Vedic Astrologers",
  "Accurate Jyotish Analysis",
  "Personalized Remedies",
  "100% Confidential",
  "24x7 Expert Support",
];

const TRUST_BOTTOM = [
  { icon: FaUserCheck, label: "Verified Astrologers" },
  { icon: FaCheckCircle, label: "Accurate Analysis" },
  { icon: FaClipboardCheck, label: "Personalized Reports" },
  { icon: FaLock, label: "100% Confidential" },
  { icon: FaHeadset, label: "24x7 Support" },
];

function KundliVisual() {
  return (
    <div className="relative mx-auto flex h-44 w-full max-w-xs items-center justify-center sm:h-52">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50" />
      <div className="relative z-10 grid grid-cols-3 gap-1.5 p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
          <div
            key={n}
            className="flex h-8 w-8 items-center justify-center rounded border border-orange-200 bg-white text-[10px] font-bold text-[#FF5C00] sm:h-9 sm:w-9"
          >
            {n}
          </div>
        ))}
      </div>
      <FaCompass className="absolute -right-2 -top-2 text-4xl text-amber-400 opacity-80 sm:text-5xl" />
    </div>
  );
}

export default function VedicAstrologyClient() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("overview");
  const [showBackTop, setShowBackTop] = useState(false);
  const [form, setForm] = useState({
    consultation: "",
    gender: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
  });

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveNav(id);
    document.getElementById(id === "overview" ? "hero" : id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[72px]">


      <PageBanner
        bannerSrc="/Banner/Vastu.png"
        bannerAlt="AstroCall Blog"
        currentPage="Vastu"
        backHref="/"
        backLabel="Home"
      >
        <div>
          <h1 className="font-heading  text-4xl font-bold leading-tight sm:text-4xl" >
            Vastu{" "}
            <span className="block sm:inline" style={{ color: ORANGE }}>
              is Coming Soon!
            </span>
          </h1>
          <p className="mt-3 text-lg font-medium sm:text-xl" style={{ color: ORANGE }}>
            Unlock the secrets of your life in{" "}
            <span style={{ color: ORANGE }}>the palm of your hand.</span>
          </p>
          <p className="font-body mt-4 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
            Get accurate insights about your career, love life, marriage, health, wealth and future through expert
            palm reading from certified palmists on AstroCall.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-100 px-4 py-3 shadow-sm" style={{ backgroundColor: CREAM }}>
              {HERO_FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-700 sm:text-xs">
                  <Icon size={14} style={{ color: ORANGE }} /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/talk-to-astrologers")}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
            style={{ backgroundColor: ORANGE }}
          >
            <FaPhone size={14} /> Talk to Palm Reader Now
          </button>
          <button
            type="button"
            onClick={() => router.push("/chat-to-astrologers")}
            className="inline-flex items-center gap-2 rounded-xl border-2 bg-white px-5 py-3 text-sm font-bold transition hover:bg-orange-50"
            style={{ borderColor: ORANGE, color: ORANGE }}
          >
            <FaCommentDots size={14} /> Chat Now
          </button>
        </div>
      </PageBanner>


      <div className="main-container px-4 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          {/* Mobile nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {SIDEBAR_NAV.slice(0, 6).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${activeNav === id ? "text-white" : "border border-gray-200 bg-white text-gray-600"
                  }`}
                style={activeNav === id ? { backgroundColor: ORANGE } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Left sidebar */}
          <aside className="hidden w-52 shrink-0 space-y-4 lg:block xl:w-56">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF5C00]"
            >
              <FaChevronLeft size={12} /> Back to Dashboard
            </button>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Vedic Astrology</p>
            <nav className="space-y-0.5">
              {SIDEBAR_NAV.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={`relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition ${activeNav === id ? "bg-orange-50 text-[#FF5C00]" : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {activeNav === id && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[#FF5C00]" />
                  )}
                  <Icon size={13} className={activeNav === id ? "text-[#FF5C00]" : "text-gray-400"} />
                  {label}
                </button>
              ))}
            </nav>

            <div className={`overflow-hidden ${CARD}`}>
              <div className="relative h-24 bg-orange-50">
                <Image src="/images/UIAstro.png" alt="" fill className="object-cover opacity-70" sizes="220px" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#1A1A1A]">Need Expert Guidance?</p>
                <button
                  type="button"
                  onClick={() => router.push("/talk-to-astrologers")}
                  className="mt-2 w-full rounded-lg py-2 text-xs font-bold text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  Talk to Vedic Expert
                </button>
              </div>
            </div>

            <div className={`p-3 ${CARD}`}>
              <p className="text-xs font-bold text-[#1A1A1A]">Why Choose AstroCall?</p>
              <ul className="mt-2 space-y-2">
                {WHY_CHOOSE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-gray-600">
                    <FaUserCheck size={11} className="mt-0.5 shrink-0 text-[#FF5C00]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main + right */}
          <div className="min-w-0 flex-1">
            <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
              <div className="space-y-5">
                {/* Hero */}
                <section id="hero" className={`overflow-hidden p-5 sm:p-6 ${CARD}`} style={{ backgroundColor: CREAM, borderColor: "#FFE4CC" }}>
                  <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
                    <div>
                      <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] sm:text-4xl">Vedic Astrology</h1>
                      <p className="mt-1 text-base font-semibold sm:text-lg" style={{ color: ORANGE }}>
                        Unlock your destiny with ancient Jyotish wisdom.
                      </p>
                      <p className="font-body mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                        Discover your life path through Vedic birth chart analysis. Get personalized predictions,
                        remedies and guidance from certified Jyotish experts on AstroCall.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        {HERO_FEATURES.map(({ icon: Icon, label }) => (
                          <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-600 sm:text-xs">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                              <Icon size={14} className="text-[#FF5C00]" />
                            </span>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <KundliVisual />
                  </div>
                </section>

                {/* How it works */}
                <section id="kundli" className={`p-5 sm:p-6 ${CARD}`}>
                  <h2 className="font-heading mb-5 text-lg font-bold text-[#1A1A1A]">How Vedic Astrology Works?</h2>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {HOW_IT_WORKS.map(({ step, title, desc }) => (
                      <div key={step} className="text-center">
                        <div
                          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold text-white"
                          style={{ backgroundColor: ORANGE }}
                        >
                          {step}
                        </div>
                        <p className="mt-2 text-xs font-bold text-[#1A1A1A]">{title}</p>
                        <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Consultation types */}
                <section id="dasha">
                  <h2 className="font-heading mb-4 text-lg font-bold text-[#1A1A1A]">Choose Your Consultation Type</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {CONSULTATION_TYPES.map(({ icon: Icon, title, desc, price }) => (
                      <div key={title} className={`flex flex-col p-4 ${CARD}`}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                          <Icon size={18} className="text-[#FF5C00]" />
                        </span>
                        <p className="mt-3 text-sm font-bold text-[#1A1A1A]">{title}</p>
                        <p className="mt-1 flex-1 text-[11px] leading-relaxed text-gray-500">{desc}</p>
                        <p className="mt-2 text-sm font-extrabold text-[#FF5C00]">{price}</p>
                        <button
                          type="button"
                          onClick={() => router.push("/talk-to-astrologers")}
                          className="mt-3 w-full rounded-lg border-2 py-2 text-xs font-bold transition hover:bg-orange-50"
                          style={{ borderColor: ORANGE, color: ORANGE }}
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Intake form */}
                <section id="report" className={`p-5 sm:p-6 ${CARD}`}>
                  <h2 className="font-heading mb-4 text-lg font-bold text-[#1A1A1A]">How to Get Started?</h2>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Select Consultation Type</label>
                        <select
                          value={form.consultation}
                          onChange={(e) => setForm({ ...form, consultation: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100"
                        >
                          <option value="">Choose consultation</option>
                          {CONSULTATION_TYPES.map((c) => (
                            <option key={c.title} value={c.title}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Gender</label>
                        <select
                          value={form.gender}
                          onChange={(e) => setForm({ ...form, gender: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500">Date of Birth</label>
                          <input
                            type="date"
                            value={form.dob}
                            onChange={(e) => setForm({ ...form, dob: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00]"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500">Time of Birth</label>
                          <input
                            type="time"
                            value={form.birthTime}
                            onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Place of Birth</label>
                        <input
                          type="text"
                          placeholder="Enter city name"
                          value={form.birthPlace}
                          onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-6 text-center">
                      <FaUpload className="mb-2 text-2xl text-[#FF5C00]" />
                      <p className="text-sm font-semibold text-[#1A1A1A]">Optional: Upload existing Kundli</p>
                      <p className="mt-1 text-[11px] text-gray-500">Drag & drop or click to upload PDF/image</p>
                      <button type="button" className="mt-3 text-xs font-bold text-[#FF5C00] hover:underline">
                        Browse files
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/freekundli")}
                    className="font-heading mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition hover:brightness-105 sm:w-auto sm:px-10"
                    style={{ backgroundColor: ORANGE }}
                  >
                    Continue <span>→</span>
                  </button>
                </section>

                {/* Tips */}
                <section id="remedies">
                  <h2 className="font-heading mb-4 text-lg font-bold text-[#1A1A1A]">Vedic Tips for You</h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {TIPS.map(({ icon: Icon, tip }) => (
                      <div key={tip} className={`flex flex-col items-center p-3 text-center ${CARD}`}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                          <Icon size={14} className="text-[#FF5C00]" />
                        </span>
                        <p className="mt-2 text-[10px] leading-snug text-gray-600">{tip}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Trust bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-4 py-3 shadow-sm" style={{ backgroundColor: ORANGE_LIGHT, border: "1px solid #FFE4CC" }}>
                  {TRUST_BOTTOM.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-700 sm:text-xs">
                      <Icon size={14} className="text-[#FF5C00]" /> {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right sidebar */}
              <aside className="space-y-4">
                <div className={`p-4 ${CARD}`}>
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Benefits of Vedic Astrology</h3>
                  <ul className="mt-3 space-y-3">
                    {BENEFITS.map(({ icon: Icon, title, desc }) => (
                      <li key={title} className="flex gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                          <Icon size={13} className="text-[#FF5C00]" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#1A1A1A]">{title}</p>
                          <p className="text-[10px] text-gray-500">{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 ${CARD}`} id="marriage">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Our Vedic Experts</h3>
                  <ul className="mt-3 space-y-3">
                    {EXPERTS.map((e) => (
                      <li key={e.name} className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-orange-50">
                          <Image src={e.img} alt={e.name} fill className="object-cover" sizes="44px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#1A1A1A]">{e.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {e.title} · Exp. {e.exp}
                          </p>
                        </div>
                        <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                          {e.rating} <FaStar size={10} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => router.push("/chat-to-astrologers")}
                    className="mt-4 w-full rounded-lg border-2 py-2.5 text-xs font-bold transition hover:bg-orange-50"
                    style={{ borderColor: ORANGE, color: ORANGE }}
                  >
                    View All Experts
                  </button>
                </div>

                <div className={`p-4 ${CARD}`}>
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Have Questions?</h3>
                  <p className="mt-1 text-[11px] text-gray-500">Get instant guidance from Vedic astrologers</p>
                  <button
                    type="button"
                    onClick={() => router.push("/chat-to-astrologers")}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white"
                    style={{ backgroundColor: ORANGE }}
                  >
                    <FaCommentDots size={12} /> Chat Now
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-lg md:flex">
        {[
          { icon: FaCommentDots, label: "Chat Now", href: "/chat-to-astrologers" },
          { icon: FaPhone, label: "Call Now", href: "/talk-to-astrologers" },
          { icon: FaVideo, label: "Video Call", href: "/talk-to-astrologers" },
          { icon: FaPrayingHands, label: "Book Puja", href: "/online-puja" },
        ].map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-[#FF5C00]"
          >
            <Icon size={12} /> {label}
          </Link>
        ))}
      </div>

      {showBackTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg"
          style={{ backgroundColor: ORANGE }}
          aria-label="Back to top"
        >
          <FaArrowUp size={14} />
        </button>
      )}
    </div>
  );
}
