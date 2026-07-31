"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaUserCheck,
  FaLock,
  FaHeadset,
  FaCreditCard,
  FaUsers,
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
  FaPhoneAlt,
  FaClipboardList,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { GiCardPick } from "react-icons/gi";
import PageBanner from "../components/PageBanner";

const PURPLE = "#6D28D9";
const PURPLE_DARK = "#4C1D95";
const PURPLE_LIGHT = "#EDE9FE";
const HERO_BG = "linear-gradient(135deg, #2E1065 0%, #4C1D95 45%, #1E1B4B 100%)";
const ORANGE = "#FF5C00";
const CARD = "rounded-xl border border-gray-100 bg-white shadow-sm";

const SIDEBAR_NAV = [
  { id: "overview", label: "Overview", icon: IoSparkles },
  { id: "live", label: "Live Tarot Reading", icon: FaPhoneAlt },
  { id: "question", label: "Question Based Reading", icon: FaQuestionCircle },
  { id: "love", label: "Love Tarot Reading", icon: FaHeart },
  { id: "career", label: "Career Tarot Reading", icon: FaBriefcase },
  { id: "yearly", label: "Yearly Tarot Reading", icon: FaCalendarAlt },
  { id: "reports", label: "Tarot Reports", icon: FaFileAlt },
  { id: "daily", label: "Daily Tarot", icon: GiCardPick },
  { id: "spreads", label: "Tarot Spreads", icon: FaClipboardList },
  { id: "about", label: "About Tarot", icon: FaLightbulb },
  { id: "faq", label: "FAQ", icon: FaQuestionCircle },
];

const TRUST_TOP = [
  { icon: FaUserCheck, label: "100+ Verified Experts" },
  { icon: FaCheckCircle, label: "Accurate & Honest Guidance" },
  { icon: FaLock, label: "Private & Confidential" },
  { icon: FaHeadset, label: "24x7 Support Available" },
];

const READING_TYPES = [
  { icon: FaPhoneAlt, title: "Live Tarot Reading", desc: "Connect instantly with expert tarot readers via call or chat.", price: "₹199 /min", btn: "Call Now" },
  { icon: FaQuestionCircle, title: "Question Based Reading", desc: "Ask a specific question and get detailed card guidance.", price: "₹399", btn: "Get Reading" },
  { icon: FaHeart, title: "Love Tarot Reading", desc: "Insights on relationships, compatibility and love life.", price: "₹499", btn: "Get Reading" },
  { icon: FaBriefcase, title: "Career Tarot Reading", desc: "Guidance on career moves, job changes and finances.", price: "₹499", btn: "Get Reading" },
  { icon: FaCalendarAlt, title: "Yearly Tarot Reading", desc: "Month-by-month forecast for the year ahead.", price: "₹799", btn: "Get Reading" },
];

const SPREADS = [
  { title: "Yes or No", desc: "Quick answer to a single question.", price: "₹299", layout: "single" },
  { title: "Three Card Spread", desc: "Past, present and future insight.", price: "₹499", layout: "three" },
  { title: "Celtic Cross", desc: "Deep 10-card comprehensive reading.", price: "₹699", layout: "celtic" },
  { title: "Relationship Spread", desc: "Understand your relationship dynamics.", price: "₹599", layout: "rel" },
  { title: "Career Spread", desc: "Career path and opportunity guidance.", price: "₹549", layout: "career" },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Choose Reading", desc: "Select the type of tarot reading you need." },
  { step: 2, title: "Share Your Details", desc: "Provide your question or situation details." },
  { step: 3, title: "Get Your Reading", desc: "Connect with our expert or get your reading report." },
  { step: 4, title: "Gain Clarity", desc: "Receive guidance and make better decisions." },
];

const TOP_EXPERTS = [
  { name: "Sunita Sharma", exp: "12+ Years", rating: "4.9", img: "/images/profile pic.webp" },
  { name: "Neha Rajput", exp: "10+ Years", rating: "4.8", img: "/images/profile pic.webp" },
  { name: "Arjun Malhotra", exp: "15+ Years", rating: "4.9", img: "/images/profile pic.webp" },
];

const TESTIMONIALS = [
  { quote: "The tarot reading was spot on! It gave me clarity about my career decision.", name: "Priya S.", stars: 5 },
  { quote: "Love tarot spread helped me understand my relationship better. Highly recommend!", name: "Rohan K.", stars: 5 },
  { quote: "Celtic cross reading was incredibly detailed. Worth every rupee.", name: "Meera T.", stars: 5 },
  { quote: "Daily tarot card has become my morning ritual. So insightful!", name: "Ankit P.", stars: 5 },
];

const WHY_CHOOSE = [
  "Verified Tarot Experts",
  "Accurate Readings",
  "Secure & Private",
  "Multiple Reading Types",
  "Satisfaction Guaranteed",
];

const TRUST_BOTTOM = [
  { icon: FaUsers, label: "Trusted by Millions" },
  { icon: FaLock, label: "100% Confidential" },
  { icon: FaCheckCircle, label: "Accurate & Reliable" },
  { icon: FaHeadset, label: "24x7 Support" },
  { icon: FaCreditCard, label: "Easy Payments" },
];

function SpreadDiagram({ layout }) {
  const dot = "rounded-sm border border-purple-300 bg-purple-100";
  if (layout === "single") {
    return <div className={`mx-auto h-14 w-10 ${dot}`} />;
  }
  if (layout === "three") {
    return (
      <div className="mx-auto flex justify-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-12 w-8 ${dot}`} />
        ))}
      </div>
    );
  }
  if (layout === "celtic") {
    return (
      <div className="relative mx-auto h-16 w-24">
        <div className={`absolute left-1/2 top-1/2 h-10 w-7 -translate-x-1/2 -translate-y-1/2 ${dot}`} />
        <div className={`absolute left-0 top-1/2 h-8 w-6 -translate-y-1/2 ${dot}`} />
        <div className={`absolute right-0 top-1/2 h-8 w-6 -translate-y-1/2 ${dot}`} />
        <div className={`absolute left-1/2 top-0 h-6 w-5 -translate-x-1/2 ${dot}`} />
      </div>
    );
  }
  return (
    <div className="mx-auto flex justify-center gap-1.5">
      {[1, 2].map((n) => (
        <div key={n} className={`h-12 w-8 ${dot}`} />
      ))}
    </div>
  );
}

function TarotCardMini({ name }) {
  return (
    <div className="flex h-28 w-[4.5rem] flex-col overflow-hidden rounded-lg border border-amber-200/40 bg-gradient-to-b from-[#3B0764] to-[#1E1B4B] shadow-lg sm:h-32 sm:w-20">
      <div className="flex flex-1 items-center justify-center p-1">
        <span className="text-[8px] font-bold uppercase tracking-wide text-amber-200/90 sm:text-[9px]">{name}</span>
      </div>
      <div className="h-1 bg-amber-400/60" />
    </div>
  );
}

function HeroCards() {
  return (
    <div className="relative flex items-end justify-center gap-2 sm:gap-3">
      <TarotCardMini name="The Star" />
      <div className="-mb-2 scale-110">
        <TarotCardMini name="The Sun" />
      </div>
      <TarotCardMini name="The World" />
    </div>
  );
}

export default function TarotReadingClient() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("overview");
  const [showBackTop, setShowBackTop] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveNav(id);
    document.getElementById(id === "overview" ? "hero" : id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleTestimonials = TESTIMONIALS.slice(testimonialIdx, testimonialIdx + 4).length >= 4
    ? TESTIMONIALS.slice(testimonialIdx, testimonialIdx + 4)
    : [...TESTIMONIALS.slice(testimonialIdx), ...TESTIMONIALS].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-[72px]">

      <PageBanner
        bannerSrc="/Banner/Tarot Reading.png"
        bannerAlt="AstroCall Blog"
        currentPage="Tarot Reading"
        backHref="/"
        backLabel="Home"
      >
        <div>
          <h1 className="font-heading  text-4xl font-bold leading-tight sm:text-4xl" >
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
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-100 px-4 py-3 shadow-sm" style={{ backgroundColor: PURPLE_LIGHT }}>
              {TRUST_TOP.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-700 sm:text-xs">
                  <Icon size={14} style={{ color: PURPLE }} /> {label}
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
                onClick={() => scrollTo(id)}
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
                  onClick={() => scrollTo(id)}
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
              <div className="relative h-24" style={{ background: HERO_BG }}>
                <Image src="/images/ChatBanner.png" alt="" fill className="object-cover opacity-30" sizes="220px" />
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-12 w-8 rounded border border-amber-300/30 bg-purple-900/80" />
                  ))}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#1A1A1A]">Talk to Tarot Expert</p>
                <p className="mt-1 text-[10px] text-gray-500">Get instant guidance from verified readers</p>
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

          {/* Main + right column */}
          <div className="min-w-0 flex-1">
            <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
              <div className="space-y-5">
                {/* Hero */}
                {/* <section id="hero" className="overflow-hidden rounded-xl shadow-sm" style={{ background: HERO_BG }}>
                  <div className="grid items-center gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
                    <div>
                      <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Tarot Reading</h1>
                      <p className="mt-1 text-base font-semibold text-purple-200 sm:text-lg">Find clarity. Discover your path.</p>
                      <p className="font-body mt-3 max-w-xl text-sm leading-relaxed text-purple-100/90">
                        Unlock the wisdom of the cards. Get guidance on love, career, relationships and life decisions
                        from expert tarot readers on AstroCall.
                      </p>
                      <button
                        type="button"
                        onClick={() => router.push("/talk-to-astrologers")}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-[#4C1D95] shadow-sm transition hover:brightness-105"
                        style={{ backgroundColor: PURPLE_LIGHT }}
                      >
                        <FaCommentDots size={14} /> Talk to Tarot Expert
                      </button>
                    </div>
                    <HeroCards />
                  </div>
                </section> */}

                {/* Trust strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-100 px-4 py-3 shadow-sm" style={{ backgroundColor: PURPLE_LIGHT }}>
                  {TRUST_TOP.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-gray-700 sm:text-xs">
                      <Icon size={14} style={{ color: PURPLE }} /> {label}
                    </div>
                  ))}
                </div>

                {/* Reading types */}
                <section id="live">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Choose Your Reading Type</h2>
                    <button type="button" className="text-sm font-semibold hover:underline" style={{ color: PURPLE }}>
                      View All Readings →
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {READING_TYPES.map(({ icon: Icon, title, desc, price, btn }) => (
                      <div key={title} className={`flex flex-col p-4 ${CARD}`}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: PURPLE_LIGHT }}>
                          <Icon size={16} style={{ color: PURPLE }} />
                        </span>
                        <p className="mt-3 text-sm font-bold text-[#1A1A1A]">{title}</p>
                        <p className="mt-1 flex-1 text-[11px] leading-relaxed text-gray-500">{desc}</p>
                        <p className="mt-2 text-sm font-extrabold" style={{ color: PURPLE_DARK }}>
                          {price}
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/talk-to-astrologers")}
                          className="mt-3 w-full rounded-lg py-2 text-xs font-bold text-white"
                          style={{ backgroundColor: PURPLE }}
                        >
                          {btn}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Spreads */}
                <section id="spreads">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Popular Tarot Spreads</h2>
                    <button type="button" className="text-sm font-semibold hover:underline" style={{ color: PURPLE }}>
                      View All Spreads →
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {SPREADS.map(({ title, desc, price, layout }) => (
                      <div key={title} className={`flex flex-col p-4 ${CARD}`}>
                        <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-purple-50/80">
                          <SpreadDiagram layout={layout} />
                        </div>
                        <p className="text-sm font-bold text-[#1A1A1A]">{title}</p>
                        <p className="mt-1 flex-1 text-[11px] leading-relaxed text-gray-500">{desc}</p>
                        <p className="mt-2 text-sm font-extrabold" style={{ color: PURPLE_DARK }}>
                          {price}
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/chat-to-astrologers")}
                          className="mt-3 w-full rounded-lg border py-2 text-xs font-bold transition hover:bg-purple-50"
                          style={{ borderColor: PURPLE, color: PURPLE }}
                        >
                          Choose
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* How it works */}
                <section id="about" className={`p-5 sm:p-6 ${CARD}`}>
                  <h2 className="font-heading mb-5 text-lg font-bold text-[#1A1A1A]">How Tarot Reading Works</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
                      <div key={step} className="relative text-center">
                        <div
                          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold text-white"
                          style={{ backgroundColor: PURPLE }}
                        >
                          {step}
                        </div>
                        <p className="mt-3 text-sm font-bold text-[#1A1A1A]">{title}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{desc}</p>
                        {i < HOW_IT_WORKS.length - 1 && (
                          <FaChevronRight
                            size={14}
                            className="absolute right-0 top-5 hidden text-purple-300 lg:block xl:-right-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Testimonials */}
                <section id="faq">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">What Our Customers Say</h2>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                        className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-purple-50"
                      >
                        <FaChevronLeft size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)}
                        className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-purple-50"
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {visibleTestimonials.map(({ quote, name, stars }) => (
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

              {/* Right sidebar */}
              <aside className="space-y-4">
                <div className={`p-4 ${CARD}`} id="daily">
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Daily Tarot Card</h3>
                  <div className="mt-3 flex justify-center">
                    <TarotCardMini name="The Star" />
                  </div>
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">
                    Hope, inspiration and renewal. Today brings clarity and spiritual guidance your way.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/chat-to-astrologers")}
                    className="mt-3 w-full rounded-lg py-2.5 text-xs font-bold text-white"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Draw Your Card
                  </button>
                </div>

                <div className={`p-4 ${CARD}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1A1A1A]">Top Tarot Experts</h3>
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
                    onClick={() => router.push("/talk-to-astrologers")}
                    className="mt-4 w-full rounded-lg py-2.5 text-xs font-bold text-white"
                    style={{ backgroundColor: PURPLE }}
                  >
                    Talk to Expert
                  </button>
                </div>

                <div className={`p-4 ${CARD}`}>
                  <h3 className="text-sm font-bold text-[#1A1A1A]">Have Questions?</h3>
                  <p className="mt-1 text-[11px] text-gray-500">Get instant guidance from tarot experts</p>
                  <button
                    type="button"
                    onClick={() => router.push("/chat-to-astrologers")}
                    className="mt-3 w-full rounded-lg border py-2 text-xs font-bold transition hover:bg-purple-50"
                    style={{ borderColor: PURPLE, color: PURPLE }}
                  >
                    Chat Now
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
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition hover:bg-purple-50 hover:text-[#6D28D9]"
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
