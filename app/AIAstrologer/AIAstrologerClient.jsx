"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaBrain,
  FaUser,
  FaCommentDots,
  FaShieldAlt,
  FaClock,
  FaMagic,
  FaCog,
  FaOm,
  FaBell,
  FaLock,
  FaUsers,
  FaUserCheck,
  FaAward,
  FaHeadset,
  FaTh,
  FaSun,
  FaLeaf,
} from "react-icons/fa";
import PageBanner from "../components/PageBanner";

const ORANGE = "#FF5C00";
const NAVY = "#1A1A1A";
const CREAM = "#FFF9F1";
const PEACH = "#FFF0E6";

const HERO_PILLS = [
  { icon: FaCog, label: "Powered by Advanced AI" },
  { icon: FaOm, label: "Backed by Vedic Knowledge" },
  { icon: FaClock, label: "Available 24x7 Instantly" },
];

const FLOATING_CARDS = [
  { icon: FaCommentDots, label: "Ask Anything", pos: "left-[8%] top-[18%]" },
  { icon: FaTh, label: "Kundli Analysis", pos: "right-[5%] top-[22%]" },
  { icon: FaSun, label: "Horoscope", pos: "left-[5%] bottom-[28%]" },
  { icon: FaLeaf, label: "Remedies", pos: "right-[8%] bottom-[24%]" },
];

const EXPECT_ITEMS = [
  { icon: FaBrain, title: "Smart Predictions", desc: "Get accurate predictions based on AI & astrology." },
  { icon: FaUser, title: "Personalized Guidance", desc: "Solutions tailored to your unique life." },
  { icon: FaCommentDots, title: "Instant Answers", desc: "Ask anything and get instant, reliable answers." },
  { icon: FaShieldAlt, title: "100% Confidential", desc: "Your privacy is our top priority." },
  { icon: FaClock, title: "Available 24x7", desc: "Connect anytime, from anywhere." },
  { icon: FaMagic, title: "Advanced & Accurate", desc: "Combining advanced AI with ancient wisdom." },
];

const TRUST_BAR = [
  { icon: FaShieldAlt, title: "100% Secure", sub: "Safe & Encrypted" },
  { icon: FaUsers, title: "Trusted by Millions", sub: "20 Lakh+ Happy Users" },
  { icon: FaUserCheck, title: "Expert Verified", sub: "Backed by Astrologers" },
  { icon: FaAward, title: "Best in Industry", sub: "Leading Astrology Platform" },
  { icon: FaHeadset, title: "24x7 Support", sub: "Here to Help You" },
];

function RobotVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-50 via-amber-50/80 to-purple-50/40" />
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 44 * Math.cos(rad);
        const y = 50 + 44 * Math.sin(rad);
        return (
          <span
            key={i}
            className="absolute text-sm opacity-25"
            style={{ color: ORANGE, left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
          >
            {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"][i]}
          </span>
        );
      })}

      {FLOATING_CARDS.map(({ icon: Icon, label, pos }) => (
        <div
          key={label}
          className={`absolute ${pos} z-20 flex items-center gap-1.5 rounded-lg border border-orange-100 bg-white px-2.5 py-2 shadow-md sm:gap-2 sm:px-3 sm:py-2.5`}
        >
          <Icon size={12} className="shrink-0 text-[#FF5C00] sm:text-sm" />
          <span className="whitespace-nowrap text-[10px] font-semibold text-gray-700 sm:text-xs">{label}</span>
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-4">
        <div className="relative mb-2 flex flex-col items-center">
          <div className="relative z-10 flex h-16 w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg sm:h-20 sm:w-24">
            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-slate-800 sm:h-12 sm:w-16">
              <FaOm className="text-lg text-amber-400 sm:text-xl" />
            </div>
            <div className="absolute -left-3 top-6 h-8 w-3 rounded-full bg-gray-200 sm:h-10 sm:w-4" />
            <div className="absolute -right-3 top-6 h-8 w-3 rounded-full bg-gray-200 sm:h-10 sm:w-4" />
          </div>
          <div className="relative -mt-1 h-14 w-16 rounded-b-3xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-md sm:h-16 sm:w-20">
            <div className="absolute -bottom-1 left-2 h-4 w-5 rounded-b-lg bg-gray-200 sm:left-3 sm:h-5 sm:w-6" />
            <div className="absolute -bottom-1 right-2 h-4 w-5 rounded-b-lg bg-gray-200 sm:right-3 sm:h-5 sm:w-6" />
          </div>
        </div>
        <div
          className="h-4 w-32 rounded-full blur-md sm:h-5 sm:w-40"
          style={{ backgroundColor: "rgba(255,92,0,0.45)" }}
        />
        <div
          className="relative -mt-3 flex h-3 w-28 items-center justify-center rounded-full sm:h-4 sm:w-36"
          style={{ background: "linear-gradient(90deg, #FF5C00, #FF8C42, #FF5C00)" }}
        />
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      <span className="text-[10px]" style={{ color: ORANGE }}>
        ✦
      </span>
      <h2 className="font-heading text-center text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
        {children}
      </h2>
      <span className="text-[10px]" style={{ color: ORANGE }}>
        ✦
      </span>
    </div>
  );
}

export default function AIAstrologerClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      {/* Hero */}


      <PageBanner
        bannerSrc="/Banner/AI Bennar.png"
        bannerAlt="AstroCall Blog"
        currentPage="AI Astrologer"
        backHref="/"
        backLabel="Home"
        // title={
        //   <>
        //     AstroCall Blog
        //     <span className="page-banner__accent">
        //       Knowledge. Guidance. Transformation.
        //     </span>
        //   </>
        // }
        // subtitle="Explore cosmic wisdom through insightful astrological articles, guides, and predictions to illuminate your spiritual journey."
      >
        <div>
          {/* <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold"
            style={{ backgroundColor: PEACH, color: ORANGE }}
          >
            ✨ NEW & EXCITING
          </span> */}

          <h1 className="font-heading mt-4 text-4xl font-bold leading-tight sm:text-5xl" style={{ color: NAVY }}>
            AI Astrologer{" "}
            <span className="block sm:inline" style={{ color: ORANGE }}>
              is Coming Soon!
            </span>
          </h1>
          <p className="font-heading mt-2 text-lg font-semibold sm:text-xl" style={{ color: NAVY }}>
            The future of astrology is here!
          </p>
          <p className="font-body mt-4 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
            Experience accurate predictions, personalized guidance and instant answers with the power of Artificial
            Intelligence and ancient Vedic wisdom — all in one intelligent astrologer.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            {HERO_PILLS.map(({ icon: Icon, label }) => (
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
        {/* <ul className="page-banner__features">
          {HERO_FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="page-banner__feature-item">
              <span className="page-banner__feature-icon">
                <Icon style={{ width: "0.95em", height: "0.95em" }} />
              </span>
              {label}
            </li>
          ))}
        </ul> */}
      </PageBanner>
      {/* <section className="border-b border-gray-100" style={{ backgroundColor: CREAM }}>
        <div className="main-container px-4 py-8 sm:py-12">
          <nav className="mb-6 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#FF5C00]">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span>Services</span>
            <span className="mx-2">›</span>
            <span className="font-medium text-[#FF5C00]">AI Astrologer</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold"
                style={{ backgroundColor: PEACH, color: ORANGE }}
              >
                ✨ NEW & EXCITING
              </span>

              <h1 className="font-heading mt-4 text-4xl font-bold leading-tight sm:text-5xl" style={{ color: NAVY }}>
                AI Astrologer{" "}
                <span className="block sm:inline" style={{ color: ORANGE }}>
                  is Coming Soon!
                </span>
              </h1>
              <p className="font-heading mt-2 text-lg font-semibold sm:text-xl" style={{ color: NAVY }}>
                The future of astrology is here!
              </p>
              <p className="font-body mt-4 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
                Experience accurate predictions, personalized guidance and instant answers with the power of Artificial
                Intelligence and ancient Vedic wisdom — all in one intelligent astrologer.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                {HERO_PILLS.map(({ icon: Icon, label }) => (
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

            <RobotVisual />
          </div>
        </div>
      </section> */}

      {/* What to Expect */}
      <section className="py-10 sm:py-14">
        <div className="main-container px-4">
          <SectionTitle>What to Expect?</SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXPECT_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-[0_4px_24px_rgba(255,92,0,0.06)] transition hover:border-orange-100 hover:shadow-md"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-orange-50 to-white ring-1 ring-orange-100">
                  <Icon size={22} className="text-[#FF5C00]" />
                </span>
                <p className="font-heading mt-4 text-base font-bold text-[#1A1A1A]">{title}</p>
                <p className="font-body mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="pb-10 sm:pb-14">
        <div className="main-container px-4">
          <div
            className="flex flex-col items-center gap-6 rounded-2xl p-6 sm:flex-row sm:gap-8 sm:p-8"
            style={{ backgroundColor: PEACH, border: "1px solid #FFE4CC" }}
          >
            <div className="flex shrink-0 items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <span className="text-4xl">✉️</span>
                <FaBell
                  size={14}
                  className="absolute -right-1 -top-1 rounded-full bg-[#FF5C00] p-1 text-white"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h3 className="font-heading text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
                Be the First to Experience!
              </h3>
              <p className="font-body mt-2 text-sm text-gray-600">
                AI Astrologer is launching soon. Subscribe now and get notified as soon as it&apos;s live.
              </p>
            </div>

            <div className="w-full shrink-0 sm:max-w-sm">
              {submitted ? (
                <p className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-green-600 shadow-sm">
                  Thank you! We&apos;ll notify you when AI Astrologer launches.
                </p>
              ) : (
                <form onSubmit={handleNotify} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="submit"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-105"
                    style={{ backgroundColor: ORANGE }}
                  >
                    <FaBell size={12} /> Notify Me
                  </button>
                </form>
              )}
              <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-gray-500 sm:justify-start">
                <FaLock size={10} /> We respect your privacy. No spam, ever.
              </p>
            </div>
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
