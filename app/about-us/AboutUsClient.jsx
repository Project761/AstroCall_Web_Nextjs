"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaUsers,
  FaShieldAlt,
  FaLock,
  FaHeadset,
  FaComments,
  FaPhoneAlt,
  FaVideo,
  FaCheckCircle,
  FaWallet,
  FaUserCheck,
  FaBolt,
  FaGem,
  FaPrayingHands,
  FaHeart,
  FaChartLine,
  FaBookOpen,
  FaChevronDown,
  FaQuoteLeft,
  FaHandshake,
  FaEye,
  FaMobileAlt,
} from "react-icons/fa";
import {
  MdOutlineAutoGraph,
  MdPsychology,
  MdVerified,
} from "react-icons/md";
import { ORANGE, CREAM, CREAM_ALT } from "@/app/lib/siteTheme";

/* ─── data ─── */
const OFFERS = [
  { icon: FaComments, label: "Online Astrology Consultation", href: "/chat-to-astrologers", desc: "Chat or call verified astrologers instantly." },
  { icon: FaBookOpen, label: "Kundli", href: "/freekundli", desc: "Free personalised birth chart analysis." },
  { icon: FaHeart, label: "Kundli Matching", href: "/kundali-matching", desc: "Marriage compatibility with Vedic gun milan." },
  { icon: MdOutlineAutoGraph, label: "Daily Horoscope", href: "/daily-horoscope", desc: "Daily predictions for all 12 zodiac signs." },
  { icon: MdPsychology, label: "Numerology", href: "/Numerology", desc: "Decode your life path through numbers." },
  { icon: FaChartLine, label: "Tarot Reading", href: "/TarotReading", desc: "Intuitive tarot guidance for clarity." },
  { icon: FaGem, label: "Gemstones", href: "/gemstone", desc: "Authentic gemstones with astrological advice." },
  { icon: FaPrayingHands, label: "Online Puja", href: "/online-puja", desc: "Book sacred rituals performed by priests." },
];

const WHY_CHOOSE = [
  { icon: MdVerified, title: "Verified Astrologers", desc: "Every expert is screened, skilled, and rated by real users." },
  { icon: FaLock, title: "100% Privacy", desc: "Your birth details and conversations stay completely confidential." },
  { icon: FaShieldAlt, title: "Secure Payments", desc: "Encrypted wallet recharge with trusted payment gateways." },
  { icon: FaHeadset, title: "24×7 Support", desc: "Our support team is always ready to help you." },
  { icon: FaBolt, title: "Instant Chat", desc: "Connect with astrologers in seconds — no long waits." },
  { icon: FaVideo, title: "Voice & Video Consultation", desc: "Choose chat, voice call, or video for deeper guidance." },
  { icon: FaCheckCircle, title: "Accurate Guidance", desc: "Authentic Vedic methods blended with years of experience." },
  { icon: FaWallet, title: "Affordable Pricing", desc: "Transparent per-minute rates that fit every budget." },
];

const PROCESS = [
  { step: "01", icon: FaUserCheck, title: "Choose Astrologer", desc: "Browse profiles, ratings, and expertise to find your perfect guide." },
  { step: "02", icon: FaWallet, title: "Recharge Wallet", desc: "Add balance securely and pay only for the minutes you use." },
  { step: "03", icon: FaPhoneAlt, title: "Connect Instantly", desc: "Start a chat or call — no appointments, no hassle." },
  { step: "04", icon: FaComments, title: "Get Personalized Guidance", desc: "Receive tailored insights for love, career, health, and more." },
];

const STATS = [
  { value: 10000, suffix: "+", label: "Happy Customers", display: "10,000+" },
  { value: 500, suffix: "+", label: "Verified Astrologers", display: "500+" },
  { value: 50000, suffix: "+", label: "Consultations", display: "50,000+" },
  { value: 4.9, suffix: "★", label: "Customer Rating", display: "4.9★", isDecimal: true },
];

const TRUST_PILLARS = [
  { icon: FaHandshake, title: "Customer First", desc: "Every feature we build starts with what helps you make better life decisions." },
  { icon: FaEye, title: "Transparent Pricing", desc: "No hidden charges — see per-minute rates before you connect." },
  { icon: FaShieldAlt, title: "Data Protection", desc: "Industry-standard encryption keeps your personal information safe." },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    text: "AstroCall helped me find clarity during a difficult career transition. The astrologer was patient, accurate, and genuinely caring.",
    rating: 5,
    avatar: "/images/profile pic.webp",
  },
  {
    name: "Rahul Verma",
    city: "Delhi",
    text: "I was sceptical about online astrology, but the kundli matching report was incredibly detailed. Highly recommend AstroCall!",
    rating: 5,
    avatar: "/images/profile pic.webp",
  },
  {
    name: "Ananya Reddy",
    city: "Hyderabad",
    text: "Instant chat with an astrologer at midnight when I needed guidance — that's what makes AstroCall special. Truly 24×7.",
    rating: 5,
    avatar: "/images/profile pic.webp",
  },
];

const FAQS = [
  {
    q: "What is AstroCall?",
    a: "AstroCall is India's trusted online astrology platform that connects you with verified astrologers for chat, call, and video consultations — anytime, anywhere.",
  },
  {
    q: "Are the astrologers on AstroCall verified?",
    a: "Yes. Every astrologer goes through a rigorous verification process including skill assessment, background check, and ongoing quality monitoring based on user ratings.",
  },
  {
    q: "How do I consult an astrologer on AstroCall?",
    a: "Simply create an account, recharge your wallet, choose an astrologer, and connect instantly via chat or call. No appointments needed.",
  },
  {
    q: "Is my personal information kept private?",
    a: "Absolutely. Your birth details, chat history, and payment information are encrypted and never shared with third parties.",
  },
  {
    q: "What services does AstroCall offer?",
    a: "We offer online consultations, free kundli, kundli matching, daily horoscope, numerology, tarot reading, authentic gemstones, and online puja booking.",
  },
  {
    q: "How much does a consultation cost?",
    a: "Rates vary by astrologer and are shown per minute on their profile. You only pay for the time you use — no hidden fees.",
  },
  {
    q: "Can I get a refund if I'm not satisfied?",
    a: "Yes. AstroCall has a fair refund policy. If you face a genuine issue, contact our 24×7 support team and we'll resolve it promptly.",
  },
  {
    q: "Does AstroCall have a mobile app?",
    a: "Our website is fully mobile-optimised for a seamless experience on any device. A dedicated mobile app is coming soon — join our waitlist to be notified.",
  },
];

/* ─── helpers ─── */
function SectionTag({ children }) {
  return (
    <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#FF5C00]">
      {children}
    </span>
  );
}

function SectionHeading({ tag, title, subtitle }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
      {tag && <SectionTag>{tag}</SectionTag>}
      <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 font-body text-sm leading-relaxed text-gray-500 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function AnimatedStat({ stat, active }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (stat.isDecimal) {
      const steps = 30;
      let i = 0;
      const t = setInterval(() => {
        i += 1;
        setCount(Math.min(4.9, (4.9 / steps) * i));
        if (i >= steps) clearInterval(t);
      }, 40);
      return () => clearInterval(t);
    }
    const target = stat.value;
    const steps = 40;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setCount(Math.min(target, Math.floor((target / steps) * i)));
      if (i >= steps) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, [active, stat]);

  const display = stat.isDecimal
    ? `${count.toFixed(1)}${stat.suffix}`
    : `${count.toLocaleString("en-IN")}${stat.suffix}`;

  return (
    <div className="text-center">
      <p className="font-heading text-3xl font-extrabold text-[#FF5C00] sm:text-4xl md:text-5xl">
        {active ? display : stat.display}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-600">{stat.label}</p>
    </div>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        open ? "border-[#FF5C00]/40 shadow-lg shadow-orange-100/60" : "border-orange-100 hover:border-orange-200 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] sm:text-base">
          {item.q}
        </h3>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            open ? "bg-[#FF5C00] text-white" : "bg-orange-50 text-[#FF5C00]"
          }`}
        >
          <FaChevronDown className={`text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 font-body text-sm leading-relaxed text-gray-600">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── page ─── */
export default function AboutUsClient() {
  const [openFaq, setOpenFaq] = useState(0);
  const statsView = useInView(0.2);

  return (
    <article className="bg-white pt-[72px]">
      {/* ── 1. Hero ── */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="about-hero-heading"
      >
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/Banner/HomePageBanner3.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/85 via-[#1A1A1A]/65 to-[#FF5C00]/30" />
        </div>

        <div className="main-container relative z-10 flex min-h-[min(52vh,420px)] flex-col justify-center py-16 sm:min-h-[min(58vh,480px)] sm:py-20">
          <nav className="mb-4 text-xs text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-[#FF5C00]">About Us</span>
          </nav>

          <h1
            id="about-hero-heading"
            className="font-heading max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            About <span className="text-[#FF5C00]">AstroCall</span>
          </h1>
          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
            AstroCall connects you with trusted, verified astrologers for authentic Vedic guidance —
            helping you navigate love, career, marriage, health, and every important decision in life.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/talk-to-astrologers"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5C00] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-[#E85500] hover:shadow-orange-500/40"
            >
              <FaPhoneAlt />
              Talk to an Astrologer
            </Link>
            <Link
              href="/chat-to-astrologers"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <FaComments />
              Chat Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Who We Are ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: CREAM }} aria-labelledby="who-we-are">
        <div className="main-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionTag>Who We Are</SectionTag>
              <h2 id="who-we-are" className="font-heading mt-3 text-2xl font-bold text-[#1A1A1A] sm:text-3xl md:text-4xl">
                Making Authentic Astrology Accessible to Everyone
              </h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-gray-600 sm:text-base">
                Founded with a passion for preserving India&apos;s rich astrological heritage, AstroCall bridges
                ancient Vedic wisdom with modern technology. We believe everyone deserves access to genuine,
                personalised guidance — not generic predictions.
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-gray-600 sm:text-base">
                From a small team of astrology enthusiasts to a platform serving lakhs of users across India,
                our journey has been driven by one goal: connect people with the right astrologer at the right time.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#FF5C00]">
                  <FaUsers className="text-xl" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-[#1A1A1A]">Trusted by Lakhs of Indians</p>
                  <p className="text-xs text-gray-500">Growing community of seekers &amp; believers</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-orange-200/40">
              <Image
                src="/Banner/chat2.png"
                alt="AstroCall online astrology consultation"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 & 4. Mission + Vision ── */}
      <section className="py-16 md:py-20" aria-labelledby="mission-vision">
        <div className="main-container">
          <SectionHeading
            tag="Our Purpose"
            title="Mission & Vision"
            subtitle="Guiding millions toward clarity, confidence, and cosmic wisdom."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5C00] text-white shadow-lg shadow-orange-300/40">
                <FaCheckCircle className="text-2xl" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">Our Mission</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Help people make better, informed life decisions.",
                  "Provide access to trusted, verified astrologers.",
                  "Deliver easy, secure, and affordable consultations.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5C00]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="group rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-[#FFF0E6] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/60">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#FF5C00] shadow-lg">
                <FaEye className="text-2xl" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">Our Vision</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Become India's most trusted astrology platform.",
                  "Blend ancient Vedic wisdom with cutting-edge technology.",
                  "Empower every Indian to discover their cosmic path.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5C00]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. What We Offer ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: CREAM }} aria-labelledby="what-we-offer">
        <div className="main-container">
          <SectionHeading
            tag="Services"
            title="What We Offer"
            subtitle="A complete suite of astrology services — from daily horoscopes to sacred online puja."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OFFERS.map(({ icon: Icon, label, href, desc }) => (
              <Link
                key={label}
                href={href}
                className="group flex cursor-pointer flex-col rounded-2xl border border-orange-100/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#FF5C00]/30 hover:shadow-lg hover:shadow-orange-100/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#FF5C00] transition group-hover:bg-[#FF5C00] group-hover:text-white">
                  <Icon className="text-xl" />
                </div>
                <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">{label}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500">{desc}</p>
                <span className="mt-3 text-xs font-semibold text-[#FF5C00] opacity-0 transition group-hover:opacity-100">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Why Choose AstroCall  ── */}
      <section className="py-16 md:py-20" aria-labelledby="why-choose">
        <div className="main-container">
          <SectionHeading
            tag="Why Us"
            title="Why Choose AstroCall"
            subtitle="Built on trust, powered by technology, guided by the stars."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-[#FFF0E6] text-[#FF5C00]">
                  <Icon className="text-lg" />
                </div>
                <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Our Process ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: CREAM }} aria-labelledby="our-process">
        <div className="main-container">
          <SectionHeading
            tag="How It Works"
            title="Our Process"
            subtitle="Four simple steps to cosmic clarity."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={title} className="relative">
                {i < PROCESS.length - 1 && (
                  <div className="absolute right-0 top-10 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-[#FF5C00]/40 to-transparent lg:block" aria-hidden />
                )}
                <div className="relative rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <span className="font-heading text-4xl font-extrabold text-orange-100">{step}</span>
                  <div className="-mt-3 mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF5C00] text-white shadow-md shadow-orange-300/30">
                    <Icon />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#1A1A1A]">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Statistics ── */}
      <section
        ref={statsView.ref}
        className="relative overflow-hidden py-16 md:py-20"
        aria-labelledby="company-stats"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5C00] to-[#E85500]" aria-hidden />
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
        </div>
        <div className="main-container relative z-10">
          <h2 id="company-stats" className="mb-10 text-center font-heading text-2xl font-bold text-white sm:text-3xl">
            AstroCall by the Numbers
          </h2>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <AnimatedStat key={stat.label} stat={stat} active={statsView.visible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Customer Trust ── */}
      <section className="py-16 md:py-20" aria-labelledby="customer-trust">
        <div className="main-container">
          <SectionHeading
            tag="Trust"
            title="Our Customer-First Philosophy"
            subtitle="Your trust is our greatest asset — we work every day to earn and keep it."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {TRUST_PILLARS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-orange-100 bg-gradient-to-b from-white to-orange-50/30 p-7 text-center shadow-sm transition hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5C00] text-white shadow-lg shadow-orange-300/30">
                  <Icon className="text-xl" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Testimonials ── */}
      <section className="py-16 md:py-20" style={{ backgroundColor: CREAM }} aria-labelledby="testimonials">
        <div className="main-container">
          <SectionHeading
            tag="Reviews"
            title="What Our Customers Say"
            subtitle="Real stories from people who found guidance through AstroCall."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, city, text, rating, avatar }) => (
              <article
                key={name}
                className="flex flex-col rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <FaQuoteLeft className="text-2xl text-orange-200" aria-hidden />
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-gray-600">&ldquo;{text}&rdquo;</p>
                <div className="mt-4 flex gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: rating }).map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-orange-50 pt-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-orange-200">
                    <Image src={avatar} alt={name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-[#1A1A1A]">{name}</p>
                    <p className="text-xs text-gray-400">{city}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <section className="py-16 md:py-20" aria-labelledby="about-faq">
        <div className="main-container max-w-3xl">
          <SectionHeading
            tag="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about AstroCall."
          />
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. CTA ── */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        aria-labelledby="about-cta"
      >
        <div className="absolute inset-0" style={{ backgroundColor: CREAM_ALT }} aria-hidden />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF5C00]/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" aria-hidden />

        <div className="main-container relative z-10 text-center">
          <h2
            id="about-cta"
            className="font-heading text-3xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-4xl md:text-5xl"
          >
            Your Future Starts <span className="text-[#FF5C00]">Today</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-gray-600 sm:text-base">
            Don&apos;t leave important life decisions to chance. Consult a verified astrologer
            on AstroCall and gain the clarity you deserve — love, career, marriage, health, and beyond.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/talk-to-astrologers"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#FF5C00] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-400/30 transition hover:bg-[#E85500] hover:shadow-orange-400/40"
            >
              <FaPhoneAlt />
              Talk to Astrologer
            </Link>
            <Link
              href="/wait-list"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#FF5C00] bg-white px-8 py-4 text-sm font-bold text-[#FF5C00] transition hover:bg-orange-50"
            >
              <FaMobileAlt />
              Download App
            </Link>
          </div>
        </div>
      </section>

      {/* ── 13. Footer spacing ── */}
      <div className="h-6 md:h-10" aria-hidden />
    </article>
  );
}
