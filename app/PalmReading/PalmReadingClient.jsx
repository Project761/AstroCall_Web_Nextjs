"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaStar,
  FaShieldAlt,
  FaUserCheck,
  FaLock,
  FaHeadset,
  FaUsers,
  FaBriefcase,
  FaHeart,
  FaRing,
  FaHeartbeat,
  FaCoins,
  FaEye,
  FaUser,
  FaCommentDots,
  FaPhone,
  FaBolt,
  FaCheckCircle,
  FaChevronRight, 
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import PageBanner from "../components/PageBanner";

const ORANGE = "#FF5C00";
const NAVY = "#1A1A1A";
const CREAM = "#FFF9F1";

const HERO_FEATURES = [
  { icon: FaEye, label: "Accurate Predictions" },
  { icon: FaUserCheck, label: "Expert Palm Readers" },
  { icon: FaLock, label: "Private & Confidential" },
  { icon: FaBolt, label: "Quick Answers" },
];

const CATEGORIES = [
  { icon: FaBriefcase, label: "Career & Success" },
  { icon: FaHeart, label: "Love & Relationships" },
  { icon: FaRing, label: "Marriage & Compatibility" },
  { icon: FaHeartbeat, label: "Health & Well-being" },
  { icon: FaCoins, label: "Wealth & Prosperity" },
  { icon: FaEye, label: "Future Predictions" },
  { icon: FaUser, label: "Personality & Traits" },
];

const STEPS = [
  { num: "01", icon: FaUserCheck, title: "Connect with Expert", desc: "Choose a palm reader and connect via chat or call." },
  { num: "02", icon: FaCommentDots, title: "Share Your Hand", desc: "Share your palm image or show your palm during the call." },
  { num: "03", icon: FaEye, title: "Get Insights", desc: "Expert will read your palm lines and provide accurate insights." },
  { num: "04", icon: FaCheckCircle, title: "Get Guidance", desc: "Receive practical guidance and solutions for a better tomorrow." },
];

const READERS = [
  { name: "Acharya Dev Sharma", title: "Palm Reading Expert", exp: "15+ Years", rating: "4.9", price: "₹40/min", img: "/images/profile pic.webp" },
  { name: "Dr. Neha Kapoor", title: "Palm & Tarot Expert", exp: "12+ Years", rating: "4.8", price: "₹35/min", img: "/images/profile pic.webp" },
  { name: "Pt. Rajesh Verma", title: "Vedic Palm Reader", exp: "18+ Years", rating: "4.9", price: "₹45/min", img: "/images/profile pic.webp" },
  { name: "Sunita Sharma", title: "Love & Marriage Palmist", exp: "10+ Years", rating: "4.7", price: "₹30/min", img: "/images/profile pic.webp" },
];

const TESTIMONIALS = [
  { quote: "The palm reading was incredibly accurate about my career transition. Highly recommended!", name: "Rohit Verma", img: "/images/profile pic.webp", stars: 5 },
  { quote: "Got clarity about my relationship through palm reading. The expert was very knowledgeable.", name: "Priya Singh", img: "/images/profile pic.webp", stars: 5 },
  { quote: "Quick, private and insightful session. The palm reader explained everything clearly.", name: "Amit Kumar", img: "/images/profile pic.webp", stars: 5 },
];

const TRUST_BAR = [
  { icon: FaShieldAlt, title: "100% Secure", sub: "Your data is safe with us" },
  { icon: FaBolt, title: "Instant Response", sub: "Connect in seconds with experts" },
  { icon: FaUserCheck, title: "Verified Experts", sub: "Experienced & verified palm readers" },
  { icon: FaHeadset, title: "24x7 Support", sub: "We are here to help you anytime" },
  { icon: FaUsers, title: "20 Lakh+ Users", sub: "Trusted by millions of happy customers" },
];

const PALM_LINES = [
  { label: "Heart Line", style: "top-[28%] left-[18%] w-[55%] rotate-[-8deg]" },
  { label: "Head Line", style: "top-[38%] left-[15%] w-[60%] rotate-[-2deg]" },
  { label: "Life Line", style: "top-[32%] left-[22%] h-[45%] w-px rotate-[25deg]" },
  { label: "Fate Line", style: "top-[45%] left-[48%] h-[35%] w-px" },
  { label: "Sun Line", style: "top-[50%] left-[55%] h-[25%] w-px rotate-[-5deg]" },
];

function PalmVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-50 via-amber-50 to-purple-50 opacity-80" />
      <div className="absolute inset-4 rounded-full border border-orange-100/60" />
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute text-lg opacity-20"
          style={{
            color: ORANGE,
            left: `${50 + 42 * Math.cos((i * Math.PI * 2) / 8)}%`,
            top: `${50 + 42 * Math.sin((i * Math.PI * 2) / 8)}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          ✦
        </span>
      ))}
      <div className="relative z-10 flex h-full items-center justify-center p-6">
        <div className="relative h-full w-[70%] max-w-[280px]">
          <div className="absolute inset-0 rounded-[45%_45%_40%_40%] bg-gradient-to-b from-[#F5D0C5] to-[#E8B4A8] shadow-inner" />
          <div className="absolute inset-0 rounded-[45%_45%_40%_40%] border border-orange-200/40" />
          {PALM_LINES.map(({ label, style }) => (
            <div key={label} className={`absolute ${style}`}>
              <div className="h-full w-full border-t-2 border-dashed border-[#FF5C00]/70" />
              <span className="absolute -top-5 whitespace-nowrap text-[10px] font-semibold text-[#FF5C00] sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-4">
      <span className="hidden h-px flex-1 max-w-[120px] bg-gray-200 sm:block" />
      <h2 className="font-heading text-center text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
        {children}
      </h2>
      <span className="hidden h-px flex-1 max-w-[120px] bg-gray-200 sm:block" />
    </div>
  );
}

export default function PalmReadingClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      {/* Hero */}

      <PageBanner
        bannerSrc="/Banner/Palm Reading.png"
        bannerAlt="AstroCall Blog"
        currentPage="Palm Reading"
        backHref="/"
        backLabel="Home"
      >
        <div>
          <h1 className="font-heading  text-4xl font-bold leading-tight sm:text-4xl" style={{ color: NAVY }}>
           Palm Reading{" "}
            <span className="block sm:inline" style={{ color: ORANGE }}>
              is Coming Soon!
            </span>
          </h1>
          <p className="mt-3 text-lg font-medium sm:text-xl" style={{ color: NAVY }}>
            Unlock the secrets of your life in{" "}
            <span style={{ color: ORANGE }}>the palm of your hand.</span>
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
                <Icon size={14} className="shrink-0 text-[#FF5C00]" />
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
      <section className="py-10 sm:py-12" style={{ backgroundColor: CREAM }}>
        <div className="main-container px-4">
          <SectionTitle>What You Can Know Through Palm Reading</SectionTitle>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-gray-100 bg-white px-3 py-5 text-center shadow-sm transition hover:border-orange-200 hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <Icon size={20} className="text-[#FF5C00]" />
                </span>
                <p className="mt-3 text-xs font-semibold leading-snug text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works + Top readers */}
      <section className="py-10 sm:py-12">
        <div className="main-container px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="font-heading mb-6 text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
                How Palm Reading Works?
              </h2>
              <div className="space-y-0">
                {STEPS.map(({ num, icon: Icon, title, desc }, i) => (
                  <div key={num} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < STEPS.length - 1 && (
                      <span className="absolute left-5 top-12 h-[calc(100%-2rem)] border-l-2 border-dashed border-orange-200" />
                    )}
                    <div
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                      style={{ backgroundColor: ORANGE }}
                    >
                      {num}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="mb-1 flex items-center gap-2">
                        <Icon size={14} className="text-[#FF5C00]" />
                        <p className="text-sm font-bold text-[#1A1A1A]">{title}</p>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: ORANGE }}>
                Know More About Palm Reading <FaChevronRight size={12} />
              </button>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
                  Top Palm Readers
                </h2>
                <Link href="/chat-to-astrologers" className="text-sm font-semibold hover:underline" style={{ color: ORANGE }}>
                  View All
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {READERS.map((r) => (
                  <div key={r.name} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-xl">
                      <Image src={r.img} alt={r.name} fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1">
                      <p className="text-sm font-bold text-[#1A1A1A]">{r.name}</p>
                      <MdVerified className="text-green-500" size={16} />
                    </div>
                    <p className="mt-0.5 text-center text-[11px] text-gray-500">{r.title}</p>
                    <div className="mt-2 flex items-center justify-center gap-3 text-[11px]">
                      <span className="flex items-center gap-0.5 font-bold text-amber-500">
                        {r.rating} <FaStar size={10} />
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">Exp. {r.exp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/chat-to-astrologers")}
                      className="mt-3 w-full rounded-lg py-2.5 text-xs font-bold text-white"
                      style={{ backgroundColor: ORANGE }}
                    >
                      Chat Now
                    </button>
                    <p className="mt-2 text-center text-[10px] text-gray-400">@ {r.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-gray-100 py-10 sm:py-12" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="main-container px-4">
          <SectionTitle>What Our Users Say</SectionTitle>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, img, stars }) => (
              <div key={name} className="relative rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <span className="font-serif text-4xl leading-none text-orange-200">&ldquo;</span>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{quote}</p>
                <div className="mt-4 flex items-center gap-3 border-t border-gray-50 pt-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={img} alt={name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(stars)].map((_, i) => (
                        <FaStar key={i} size={10} className="text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-gray-100 py-8">
        <div className="main-container px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST_BAR.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
                  <Icon size={16} className="text-[#FF5C00]" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
