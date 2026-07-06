"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaChevronLeft,
  FaStar,
  FaShieldAlt,
  FaUserCheck,
  FaClock,
  FaLock,
  FaHeadset,
  FaCreditCard,
  FaUsers,
  FaChartLine,
  FaBaby,
  FaBriefcase,
  FaHeart,
  FaFileAlt,
  FaCalculator,
  FaQuestionCircle,
  FaGem,
  FaPalette,
  FaCalendarAlt,
  FaHashtag,
  FaArrowUp,
  FaCommentDots,
  FaPhone,
  FaVideo,
  FaPrayingHands,
  FaInfoCircle,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import PageBanner from "../components/PageBanner";

const PURPLE = "#7C3AED";
const PURPLE_DARK = "#6D28D9";
const PURPLE_LIGHT = "#F3E8FF";
const ORANGE = "#FF5C00";
const CARD = "rounded-xl border border-gray-100 bg-white shadow-sm";

const SIDEBAR_NAV = [
  { id: "overview", label: "Overview", icon: IoSparkles },
  { id: "personal", label: "Personal Numerology", icon: FaHashtag },
  { id: "name", label: "Name Numerology", icon: FaFileAlt },
  { id: "business", label: "Business Numerology", icon: FaBriefcase },
  { id: "baby", label: "Baby Name Numerology", icon: FaBaby },
  { id: "report", label: "Numerology Report", icon: FaChartLine },
  { id: "compatibility", label: "Compatibility Match", icon: FaHeart },
  { id: "lucky", label: "Lucky Numbers", icon: FaGem },
  { id: "remedies", label: "Remedies & Guidance", icon: FaPrayingHands },
  { id: "calculator", label: "Numerology Calculator", icon: FaCalculator },
  { id: "faq", label: "FAQ", icon: FaQuestionCircle },
];

const HERO_FEATURES = [
  { icon: FaChartLine, label: "Accurate Analysis" },
  { icon: FaFileAlt, label: "Personalized Report" },
  { icon: FaUserCheck, label: "Expert Guidance" },
  { icon: FaLock, label: "100% Confidential" },
  { icon: FaHeadset, label: "24x7 Support" },
];

const PERSONAL_NUMBERS = [
  { title: "Life Path Number", num: 7, name: "The Seeker", desc: "Deep thinker with spiritual wisdom and analytical mind.", color: PURPLE },
  { title: "Destiny Number", num: 3, name: "The Communicator", desc: "Creative, expressive and naturally gifted with words.", color: "#3B82F6" },
  { title: "Soul Urge Number", num: 2, name: "The Peacemaker", desc: "Harmonious soul who values relationships and balance.", color: "#22C55E" },
  { title: "Personality Number", num: 8, name: "The Achiever", desc: "Ambitious leader with strong business acumen.", color: ORANGE },
  { title: "Maturity Number", num: 5, name: "The Freedom Lover", desc: "Adventurous spirit seeking variety and new experiences.", color: "#6366F1" },
];

const USER_DETAILS = [
  { label: "Name", value: "Priya Sharma" },
  { label: "Date of Birth", value: "15 March 1990" },
  { label: "Life Path Number", value: "7" },
  { label: "Destiny Number", value: "3" },
  { label: "Soul Urge Number", value: "2" },
  { label: "Personality Number", value: "8" },
  { label: "Maturity Number", value: "5" },
];

const LO_SHU_GRID = [
  { num: 4, label: "Stability", filled: false },
  { num: 9, label: "Wisdom", filled: true },
  { num: 2, label: "Cooperation", filled: false },
  { num: 3, label: "Creativity", filled: true },
  { num: 5, label: "Freedom", filled: true },
  { num: 7, label: "Spirituality", filled: false },
  { num: 8, label: "Power", filled: false },
  { num: 1, label: "Leadership", filled: true },
  { num: 6, label: "Responsibility", filled: true },
];

const LUCKY_ITEMS = [
  { icon: FaHashtag, label: "Lucky Number", value: "5", color: "#6366F1" },
  { icon: FaCalendarAlt, label: "Lucky Days", value: "Wednesday, Friday", color: "#22C55E" },
  { icon: FaPalette, label: "Lucky Colors", value: "Green, Blue, Violet", color: "#3B82F6" },
  { icon: FaGem, label: "Lucky Gemstone", value: "Amethyst", color: PURPLE },
  { icon: FaStar, label: "Lucky Metal", value: "Silver", color: "#94A3B8" },
];

const SERVICES = [
  { icon: FaFileAlt, title: "Name Numerology", desc: "Discover the power hidden in your name.", price: "₹599" },
  { icon: FaBriefcase, title: "Business Numerology", desc: "Choose lucky names for your business.", price: "₹799" },
  { icon: FaBaby, title: "Baby Name Numerology", desc: "Find the perfect name for your child.", price: "₹499" },
  { icon: FaHeart, title: "Compatibility Match", desc: "Check relationship compatibility via numbers.", price: "₹699" },
  { icon: FaChartLine, title: "Full Numerology Report", desc: "Complete 25+ page detailed analysis.", price: "₹999" },
];

const TOP_EXPERTS = [
  { name: "Dr. Neha Kapoor", exp: "15+ Years", rating: "4.9", img: "/images/profile pic.webp" },
  { name: "Pt. Rajesh Verma", exp: "12+ Years", rating: "4.8", img: "/images/profile pic.webp" },
  { name: "Acharya Meera", exp: "10+ Years", rating: "4.9", img: "/images/profile pic.webp" },
  { name: "Dr. Sanjay Joshi", exp: "18+ Years", rating: "5.0", img: "/images/profile pic.webp" },
];

const TESTIMONIALS = [
  { quote: "The numerology report was incredibly accurate. It helped me understand my career path better.", name: "Priya S.", stars: 5 },
  { quote: "Changed my business name based on numerology advice. Sales improved within months!", name: "Rahul M.", stars: 5 },
  { quote: "Baby name suggestion was perfect. Our astrologer recommended the best options.", name: "Anita K.", stars: 5 },
  { quote: "Compatibility report saved our relationship. Highly recommend AstroCall numerology.", name: "Vikram D.", stars: 5 },
];

const WHY_CHOOSE = [
  "100+ Verified Numerologists",
  "Accurate Predictions",
  "Personalized Reports",
  "24x7 Expert Support",
];

const TRUST_BOTTOM = [
  { icon: FaUsers, label: "Trusted by Millions" },
  { icon: FaLock, label: "100% Confidential" },
  { icon: FaChartLine, label: "Accurate & Reliable" },
  { icon: FaHeadset, label: "24x7 Support" },
  { icon: FaCreditCard, label: "Easy Payments" },
];

function HeroGraphic() {
  return (
    <div className="relative mx-auto h-44 w-44 sm:h-52 sm:w-52 lg:mx-0 lg:ml-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#1E1B4B] shadow-xl" />
      <div className="absolute inset-3 rounded-full border border-white/20" />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => {
        const angle = (i / 9) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 38 * Math.cos(rad);
        const y = 50 + 38 * Math.sin(rad);
        return (
          <span
            key={n}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {n}
          </span>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading text-5xl font-extrabold text-white drop-shadow-lg sm:text-6xl">9</span>
      </div>
    </div>
  );
}

export default function NumerologyClient() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("overview");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ORANGE = "#FF5C00";
  const NAVY = "#1A1A1A";
  const CREAM = "#FFF9F1"

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[72px]">

      <PageBanner
        bannerSrc="/Banner/Numerology 4.png"
        bannerAlt="AstroCall Blog"
        currentPage="Numerology"
        backHref="/"
        backLabel="Home"
      >
        <div>
          <h1 className="font-heading  text-4xl font-bold leading-tight sm:text-4xl" style={{ color: NAVY }}>
            Numerology{" "}
            <span className="block sm:inline" style={{ color: PURPLE_DARK }}>
              is Coming Soon!
            </span>
          </h1>
          <p className="mt-3 text-lg font-medium sm:text-xl" style={{ color: PURPLE_DARK }}>
            Unlock the secrets of your life in{" "}
            <span style={{ color: PURPLE_DARK }}>the palm of your hand.</span>
          </p>
          <p className="font-body mt-4 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
            Get accurate insights about your career, love life, marriage, health, wealth and future through expert
            palm reading from certified palmists on AstroCall.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-sm"
              >
                <Icon size={14} className="shrink-0"  style={{ color: PURPLE_DARK }} />
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/talk-to-astrologers")}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
            style={{ backgroundColor: PURPLE_DARK }}
          >
            <FaPhone size={14} /> Talk to Palm Reader Now
          </button>
          <button
            type="button"
            onClick={() => router.push("/chat-to-astrologers")}
            className="inline-flex items-center gap-2 rounded-xl border-2 bg-white px-5 py-3 text-sm font-bold transition hover:bg-orange-50"
            style={{ borderColor: PURPLE_DARK, color: PURPLE_DARK }}
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
                onClick={() => scrollTo(id === "overview" ? "hero" : id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${activeNav === id ? "text-white" : "border border-gray-200 bg-white text-gray-600"
                  }`}
                style={activeNav === id ? { backgroundColor: PURPLE } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Left sidebar */}
          <aside className="hidden w-52 shrink-0 space-y-4 lg:block xl:w-56">
            <nav className="space-y-0.5">
              {SIDEBAR_NAV.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id === "overview" ? "hero" : id)}
                  className={`relative flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition ${activeNav === id ? "text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  style={activeNav === id ? { backgroundColor: PURPLE } : {}}
                >
                  <Icon size={13} className={activeNav === id ? "text-white" : "text-gray-400"} />
                  {label}
                </button>
              ))}
            </nav>

            <div className={`overflow-hidden ${CARD}`}>
              <div className="relative h-24" style={{ backgroundColor: PURPLE_LIGHT }}>
                <Image src="/images/ChatBanner.png" alt="" fill className="object-cover opacity-60 mix-blend-multiply" sizes="220px" />
                <div className="absolute inset-0 flex items-center justify-center gap-1 text-2xl opacity-40">
                  {["1", "3", "7", "9"].map((n) => (
                    <span key={n} className="font-bold" style={{ color: PURPLE }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#1A1A1A]">Talk to Numerology Expert</p>
                <p className="mt-1 text-[10px] text-gray-500">Get instant guidance from verified experts</p>
                <button
                  type="button"
                  onClick={() => router.push("/chat-to-astrologers")}
                  className="mt-2 w-full rounded-lg py-2 text-xs font-bold text-white"
                  style={{ backgroundColor: PURPLE }}
                >
                  Chat Now
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

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Hero */}
            {/* <section id="hero" className={`overflow-hidden p-5 sm:p-6 ${CARD}`} style={{ backgroundColor: PURPLE_LIGHT, borderColor: "#E9D5FF" }}>
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
                <div>
                  <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] sm:text-4xl">Numerology</h1>
                  <p className="mt-1 text-base font-semibold sm:text-lg" style={{ color: PURPLE_DARK }}>
                    Decode numbers. Discover your true path.
                  </p>
                  <p className="font-body mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                    Numerology reveals the hidden meaning behind numbers in your life. Understand your personality,
                    strengths, challenges and life purpose through ancient number science.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollTo("report")}
                    className="mt-4 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Get Your Numerology Report
                  </button>
                </div>
                <HeroGraphic />
              </div>
            </section> */}

            {/* Feature strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              {HERO_FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-600 sm:text-xs">
                  <Icon size={14} style={{ color: PURPLE }} /> {label}
                </div>
              ))}
            </div>

            {/* Personal numbers */}
            <section id="personal">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Your Personal Numbers</h2>
                  <FaInfoCircle size={14} className="text-gray-400" />
                </div>
                <button type="button" className="text-sm font-semibold hover:underline" style={{ color: PURPLE }}>
                  How it Works?
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {PERSONAL_NUMBERS.map(({ title, num, name, desc, color }) => (
                  <div key={title} className={`flex flex-col p-4 ${CARD}`}>
                    <p className="text-[11px] font-semibold text-gray-500">{title}</p>
                    <p className="font-heading my-1 text-4xl font-extrabold" style={{ color }}>
                      {num}
                    </p>
                    <p className="text-sm font-bold text-[#1A1A1A]">{name}</p>
                    <p className="mt-1 flex-1 text-[11px] leading-relaxed text-gray-500">{desc}</p>
                    <button type="button" className="mt-3 text-left text-xs font-bold hover:underline" style={{ color: PURPLE }}>
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Chart + right widgets */}
            <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
              <section id="lucky" className={`p-4 sm:p-5 ${CARD}`}>
                <h2 className="font-heading mb-4 text-lg font-bold text-[#1A1A1A]">Numerology Chart</h2>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="space-y-2">
                    {USER_DETAILS.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 text-xs">
                        <span className="font-medium text-gray-500">{label}</span>
                        <span className="font-bold text-[#1A1A1A]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-center text-xs font-semibold text-gray-500">Lo Shu Grid</p>
                    <div className="mx-auto grid max-w-[220px] grid-cols-3 gap-2">
                      {LO_SHU_GRID.map(({ num, label, filled }) => (
                        <div
                          key={num}
                          className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-center ${filled ? "border-purple-200 text-[#1A1A1A]" : "border-gray-100 bg-gray-50 text-gray-400"
                            }`}
                          style={filled ? { backgroundColor: PURPLE_LIGHT } : {}}
                        >
                          <span className="text-lg font-extrabold" style={{ color: filled ? PURPLE : undefined }}>
                            {num}
                          </span>
                          <span className="text-[9px] font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-bold text-[#1A1A1A]">Lucky For You</p>
                    <div className="space-y-2">
                      {LUCKY_ITEMS.map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                            <Icon size={13} style={{ color }} />
                          </span>
                          <div>
                            <p className="text-[10px] font-medium text-gray-500">{label}</p>
                            <p className="text-xs font-bold text-[#1A1A1A]">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <aside className="space-y-4">
                <div className={`p-4 ${CARD}`}>
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Need Personal Guidance?</h3>
                  <p className="mt-1 text-[11px] text-gray-500">Talk to our expert numerologists for personalized advice</p>
                  <div className="mt-3 flex -space-x-2">
                    {TOP_EXPERTS.slice(0, 3).map((e) => (
                      <div key={e.name} className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                        <Image src={e.img} alt="" fill className="object-cover" sizes="36px" />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/talk-to-astrologers")}
                    className="mt-3 w-full rounded-lg py-2.5 text-xs font-bold text-white"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Talk to Expert
                  </button>
                </div>

                <div className={`p-4 ${CARD}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Top Numerologists</h3>
                    <Link href="/chat-to-astrologers" className="text-[11px] font-semibold hover:underline" style={{ color: PURPLE }}>
                      View All →
                    </Link>
                  </div>
                  <ul className="space-y-3">
                    {TOP_EXPERTS.map((e) => (
                      <li key={e.name} className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Image src={e.img} alt={e.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#1A1A1A]">{e.name}</p>
                          <p className="text-[10px] text-gray-500">Exp. {e.exp}</p>
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
                    className="mt-4 w-full rounded-lg border py-2 text-xs font-bold transition hover:bg-purple-50"
                    style={{ borderColor: PURPLE, color: PURPLE }}
                  >
                    View All Experts
                  </button>
                </div>
              </aside>
            </div>

            {/* Services */}
            <section id="report">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Explore Numerology Services</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {SERVICES.map(({ icon: Icon, title, desc, price }) => (
                  <div key={title} className={`flex flex-col p-4 ${CARD}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: PURPLE_LIGHT }}>
                      <Icon size={16} style={{ color: PURPLE }} />
                    </span>
                    <p className="mt-3 text-sm font-bold text-[#1A1A1A]">{title}</p>
                    <p className="mt-1 flex-1 text-[11px] leading-relaxed text-gray-500">{desc}</p>
                    <p className="mt-2 text-sm font-extrabold" style={{ color: PURPLE_DARK }}>
                      {price}
                    </p>
                    <button type="button" className="mt-2 text-left text-xs font-bold hover:underline" style={{ color: PURPLE }}>
                      Get Report →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA banner */}
            <div
              className="flex flex-col items-start justify-between gap-4 rounded-xl px-5 py-5 sm:flex-row sm:items-center"
              style={{ backgroundColor: PURPLE_LIGHT, border: "1px solid #E9D5FF" }}
            >
              <div>
                <p className="font-heading text-base font-bold text-[#1A1A1A] sm:text-lg">
                  Your Personalized Numerology Report is just a click away!
                </p>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Get a detailed 25+ page report covering all your core numbers, lucky elements and life guidance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/chat-to-astrologers")}
                className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: PURPLE }}
              >
                Generate My Report →
              </button>
            </div>

            {/* Testimonials */}
            <section id="faq">
              <h2 className="font-heading mb-4 text-lg font-bold text-[#1A1A1A]">What Our Clients Say</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {TESTIMONIALS.map(({ quote, name, stars }) => (
                  <div key={name} className={`p-4 ${CARD}`}>
                    <div className="mb-2 flex gap-0.5">
                      {[...Array(stars)].map((_, i) => (
                        <FaStar key={i} size={11} className="text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">&ldquo;{quote}&rdquo;</p>
                    <p className="mt-3 text-xs font-bold text-[#1A1A1A]">— {name}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              {TRUST_BOTTOM.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-600 sm:text-xs">
                  <Icon size={14} className="text-[#FF5C00]" /> {label}
                </div>
              ))}
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
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-purple-50 hover:text-[#7C3AED]"
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
          style={{ backgroundColor: PURPLE }}
          aria-label="Back to top"
        >
          <FaArrowUp size={14} />
        </button>
      )}
    </div>
  );
}
