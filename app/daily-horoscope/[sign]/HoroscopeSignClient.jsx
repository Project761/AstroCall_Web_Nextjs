"use client";

import { useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import {
  FaChevronRight, FaChevronLeft, FaPhoneAlt, FaCommentDots,
  FaSun, FaCircle, FaClock, FaHeart, FaSmile,
  FaUser, FaBriefcase, FaPlus, FaCalendarAlt,
  FaUserCheck,
  FaLock,
  FaBolt,
} from "react-icons/fa";
import { MenuContext } from "@/app/context/MenuContext";
import { postWithToken } from "@/app/utils/api";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";

const ZODIAC_SIGNS = [
  { name: "Aries", slug: "aries", img: "/horoimg/aries.png", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", slug: "taurus", img: "/horoimg/taurus.png", dates: "Apr 20 - May 20" },
  { name: "Gemini", slug: "gemini", img: "/horoimg/gemini.png", dates: "May 21 - Jun 20" },
  { name: "Cancer", slug: "cancer", img: "/horoimg/cancer.png", dates: "Jun 21 - Jul 22" },
  { name: "Leo", slug: "leo", img: "/horoimg/leo.png", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", slug: "virgo", img: "/horoimg/virgo.png", dates: "Aug 23 - Sep 22" },
  { name: "Libra", slug: "libra", img: "/horoimg/libra.png", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", slug: "scorpio", img: "/horoimg/scorpio.png", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", slug: "sagittarius", img: "/horoimg/sagittarius.png", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", slug: "capricorn", img: "/horoimg/capricorn.png", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", slug: "aquarius", img: "/horoimg/aquarius.png", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", slug: "pisces", img: "/horoimg/pisces.png", dates: "Feb 19 - Mar 20" },
];

const DETAIL_CATS = [
  { key: "personal", title: "General", icon: FaUser, color: ORANGE },
  { key: "emotions", title: "Love & Relationship", icon: FaHeart, color: "#EF4444" },
  { key: "profession", title: "Career", icon: FaBriefcase, color: "#3B82F6" },
  { key: "luck", title: "Money", icon: FaSun, color: "#22C55E", isList: true },
  { key: "health", title: "Health", icon: FaPlus, color: "#8B5CF6" },
  { key: "travel", title: "Remedies", icon: FaSun, color: ORANGE },
];

const PERIODIC = [
  { label: "Weekly Horoscope", type: "week", bg: "bg-purple-50", border: "border-purple-100", btn: "View Weekly Horoscope" },
  { label: "Monthly Horoscope", type: "month", bg: "bg-green-50", border: "border-green-100", btn: "View Monthly Horoscope" },
  { label: "Yearly Horoscope", type: "year", bg: "bg-red-50", border: "border-red-100", btn: "View Yearly Horoscope" },
];

const ARTICLES = [
  { title: "How Zodiac Signs Affect Your Personality", date: "June 10, 2026", read: "5 min read", img: "/images/ChatBanner.png" },
  { title: "Planetary Transits This Month", date: "June 8, 2026", read: "4 min read", img: "/images/ChatBanner.png" },
  { title: "Love Compatibility by Zodiac", date: "June 5, 2026", read: "6 min read", img: "/images/ChatBanner.png" },
  { title: "Career Guidance Through Astrology", date: "June 1, 2026", read: "5 min read", img: "/images/ChatBanner.png" },
];

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "Aries";

export default function HoroscopeSignClient({ initialHoroscopeData = null, defaultSign = "aries" }) {
  const params = useParams();
  const router = useRouter();
  const signSlug = (params?.sign || defaultSign).toString().toLowerCase();
  const currentSign = ZODIAC_SIGNS.find((z) => z.slug === signSlug) || ZODIAC_SIGNS[0];

  const [activeButton, setActiveButton] = useState("daily");
  const [horoscopedata, sethoroscopedata] = useState(initialHoroscopeData);
  const [activeDays, setActiveDays] = useState("current");
  const [signIdx, setSignIdx] = useState(() => {
    const idx = ZODIAC_SIGNS.findIndex((z) => z.slug === signSlug);
    return idx >= 0 ? Math.min(idx, ZODIAC_SIGNS.length - 6) : 0;
  });
  const [expandedCat, setExpandedCat] = useState(null);
  const skipInitialFetchRef = useRef(!!initialHoroscopeData);

  const { LanguageDropdown } = useContext(MenuContext);

  const todayLabel = useMemo(() => format(new Date(), "EEEE, MMMM d, yyyy"), []);

  const fetchHoroscope = useCallback(async () => {
    try {
      const res = await postWithToken("Chat/GetData_Horoscope", {
        Sign: capitalize(signSlug),
        Date: format(new Date(), "MM/dd/yyyy"),
        Type: activeButton,
        State: activeDays,
        lan: LanguageDropdown,
      });
      if (res) {
        const parsed = JSON.parse(res[0]?.Response);
        if (parsed) {
          const data = parsed.data || parsed;
          let finalData = {};
          switch (activeButton) {
            case "daily": finalData = data.prediction || data; break;
            case "week": finalData = data.weekly_horoscope || data; break;
            case "month": finalData = data.monthly_horoscope || data; break;
            case "year": finalData = data.yearly_horoscope || data; break;
            default: break;
          }
          sethoroscopedata({
            sign: data.sign || parsed.sign || capitalize(signSlug),
            ...finalData,
            special: data.special || parsed.special || null,
          });
        }
      }
    } catch (e) { console.log(e); }
  }, [signSlug, activeButton, activeDays, LanguageDropdown]);

  useEffect(() => {
    if (skipInitialFetchRef.current && activeButton === "daily" && activeDays === "current") {
      skipInitialFetchRef.current = false;
      return;
    }
    void (async () => {
      await fetchHoroscope();
    })();
  }, [fetchHoroscope, activeButton, activeDays]);

  const selectSign = (slug) => {
    const idx = ZODIAC_SIGNS.findIndex((z) => z.slug === slug);
    if (idx >= 0) setSignIdx(Math.min(idx, ZODIAC_SIGNS.length - 6));
    router.push(`/daily-horoscope/${slug}`);
  };

  const overviewText = horoscopedata?.personal || "Today brings new opportunities and positive energy. Stay focused on your goals and trust your instincts.";
  const special = horoscopedata?.special || {};
  const luckyStats = [
    { icon: FaSun, label: "Lucky Number", value: special.lucky_number || special.luckyNumber || "7", color: ORANGE },
    { icon: FaCircle, label: "Lucky Color", value: special.lucky_color || special.luckyColor || "Red", color: ORANGE },
    { icon: FaClock, label: "Lucky Time", value: special.lucky_time || special.luckyTime || "11:00 AM - 12:30 PM", color: ORANGE },
    { icon: FaHeart, label: "Compatibility", value: special.compatibility || "Leo", color: "#EC4899" },
    { icon: FaSmile, label: "Mood", value: special.mood || "Energetic", color: ORANGE },
  ];

  const visibleSigns = ZODIAC_SIGNS.slice(signIdx, signIdx + 6);

  const getCatText = (cat) => {
    if (cat.isList && horoscopedata?.luck?.length) return horoscopedata.luck[0];
    return horoscopedata?.[cat.key] || "Insights coming soon for this area.";
  };

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.horoscope}
        currentPage={params?.sign ? currentSign.name : "Daily Horoscope"}
        crumbs={params?.sign ? [{ label: "Daily Horoscope", href: "/daily-horoscope" }] : []}
        title={
          <>
            {params?.sign ? `${currentSign.name} Horoscope` : "Daily Horoscope"}
            <span className="mt-2 block text-lg font-bold text-[#FF5C00] sm:text-xl">
              Your Cosmic Guide for Today
            </span>
          </>
        }
        subtitle="Read your free daily horoscope based on your zodiac sign and plan your day better."
      >
        <ul className="mt-4 hidden flex-col gap-2.5 md:flex sm:gap-3 sm:mt-5">
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
        </ul>
      </PageBanner>
      {/* <section className="border-b border-orange-50" style={{ backgroundColor: CREAM }}>
        <div className="main-container px-4 py-6 sm:py-8">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
            <button type="button" onClick={() => router.push("/")} className="hover:text-[#FF5C00]">Home</button>
            <FaChevronRight size={8} className="text-gray-300" />
            <span className="font-medium text-gray-700">Horoscope</span>
          </nav>
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-[#0F172A] sm:text-4xl md:text-5xl">Horoscope</h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-600">
                Read your free daily horoscope based on your zodiac sign and plan your day better.
              </p>
            </div>
            <div className="relative hidden h-40 overflow-hidden rounded-2xl opacity-40 sm:block lg:h-48">
              <Image src="/horoimg/1.png" alt="" fill className="object-contain object-right" sizes="400px" />
            </div>
          </div>
        </div>
      </section> */}

      <div className="main-container px-4 py-8">
        {/* Zodiac grid */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-[#0F172A]">Choose Your Zodiac Sign</h2>
          <div className="relative flex items-center gap-2">
            <button type="button" onClick={() => setSignIdx((i) => Math.max(0, i - 1))} disabled={signIdx === 0} className="hidden shrink-0 rounded-full border border-gray-200 p-2 text-gray-500 hover:border-[#FF5C00] disabled:opacity-30 sm:flex">
              <FaChevronLeft size={12} />
            </button>
            <div className="grid flex-1 grid-cols-3 gap-3 sm:grid-cols-6">
              {visibleSigns.map((z) => {
                const active = z.slug === signSlug;
                return (
                  <button
                    key={z.slug}
                    type="button"
                    onClick={() => selectSign(z.slug)}
                    className={`flex flex-col items-center rounded-xl border-2 bg-white p-3 transition hover:shadow-sm ${active ? "border-[#FF5C00] shadow-sm" : "border-gray-100"}`}
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full sm:h-14 sm:w-14">
                      <Image src={z.img} alt={z.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#0F172A]">{z.name}</p>
                    <p className="text-[10px] text-gray-400">{z.dates}</p>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => setSignIdx((i) => Math.min(ZODIAC_SIGNS.length - 6, i + 1))} disabled={signIdx >= ZODIAC_SIGNS.length - 6} className="hidden shrink-0 rounded-full border border-gray-200 p-2 text-gray-500 hover:border-[#FF5C00] disabled:opacity-30 sm:flex">
              <FaChevronRight size={12} />
            </button>
          </div>
          {/* Mobile: show all signs in scroll */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:hidden">
            {ZODIAC_SIGNS.map((z) => (
              <button key={z.slug} type="button" onClick={() => selectSign(z.slug)} className={`shrink-0 rounded-xl border-2 bg-white px-3 py-2 text-center ${z.slug === signSlug ? "border-[#FF5C00]" : "border-gray-100"}`}>
                <p className="text-xs font-bold">{z.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Day selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[{ label: "Today", val: "current" }, { label: "Yesterday", val: "prev" }, { label: "Tomorrow", val: "next" }].map((d) => (
            <button key={d.val} type="button" onClick={() => { setActiveDays(d.val); setActiveButton("daily"); }} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${activeDays === d.val && activeButton === "daily" ? "bg-[#FF5C00] text-white" : "border border-gray-200 text-gray-600 hover:border-[#FF5C00]"}`}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Overview */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-1">
            <h2 className="text-base font-bold text-[#0F172A]">Today&apos;s Overview</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image src={currentSign.img} alt={currentSign.name} fill className="object-cover" sizes="56px" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-[#FF5C00]">{currentSign.name}</p>
                <p className="text-xs text-gray-400">{currentSign.dates}</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-bold text-[#0F172A]">{todayLabel}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{overviewText}</p>
            <ul className="mt-4 space-y-2.5">
              {luckyStats.map((s) => (
                <li key={s.label} className="flex items-center gap-2 text-sm text-gray-700">
                  <s.icon size={13} style={{ color: s.color }} />
                  <span className="text-gray-500">{s.label}:</span>
                  <span className="font-semibold text-[#0F172A]">{s.value}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => router.push("/talk-to-astrologers")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
              <FaPhoneAlt size={13} /> Talk to Astrologer
            </button>
          </div>

          {/* Detailed Horoscope */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-base font-bold text-[#0F172A]">Detailed Horoscope</h2>
            {horoscopedata ? (
              <div className="space-y-2">
                {DETAIL_CATS.map((cat) => {
                  const text = getCatText(cat);
                  const expanded = expandedCat === cat.key;
                  return (
                    <div key={cat.key} className="overflow-hidden rounded-xl border border-gray-100">
                      <button
                        type="button"
                        onClick={() => setExpandedCat(expanded ? null : cat.key)}
                        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: cat.color }}>
                          <cat.icon size={14} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#0F172A]">{cat.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{typeof text === "string" ? text : String(text)}</p>
                        </div>
                        <FaChevronRight size={12} className={`shrink-0 text-gray-400 transition ${expanded ? "rotate-90" : ""}`} />
                      </button>
                      {expanded && (
                        <div className="border-t border-gray-50 px-4 pb-4 pt-2 text-sm leading-relaxed text-gray-600">
                          {cat.isList && horoscopedata.luck?.length ? (
                            <ul className="list-disc pl-5 space-y-1">{horoscopedata.luck.map((item, i) => <li key={i}>{item}</li>)}</ul>
                          ) : (
                            <p>{horoscopedata[cat.key] || "No data available."}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">Loading horoscope...</p>
            )}
          </div>
        </div>

        {/* Periodic horoscope */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PERIODIC.map((p) => (
            <div key={p.type} className={`rounded-2xl border p-5 ${p.bg} ${p.border}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <FaCalendarAlt size={16} className="text-[#FF5C00]" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-[#0F172A]">{p.label}</h3>
              <p className="mt-1 text-xs text-gray-500">Get deeper insights for the {p.type === "week" ? "week" : p.type === "month" ? "month" : "year"} ahead.</p>
              <button
                type="button"
                onClick={() => setActiveButton(p.type)}
                className="mt-4 w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-[#0F172A] transition hover:border-[#FF5C00] hover:text-[#FF5C00]"
              >
                {p.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Blog section */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A]">Astrology Insights for You</h2>
            <Link href="/astrology-blog" className="text-sm font-semibold text-[#FF5C00] hover:underline">View All Articles &gt;</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ARTICLES.map((a) => (
              <Link key={a.title} href="/astrology-blog" className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                <div className="relative h-32">
                  <Image src={a.img} alt={a.title} fill className="object-cover transition group-hover:scale-105" sizes="250px" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2 group-hover:text-[#FF5C00]">{a.title}</h3>
                  <p className="mt-2 text-[11px] text-gray-400">{a.date} · {a.read}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden py-10" style={{ backgroundColor: ORANGE }}>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20">
          <Image src="/horoimg/1.png" alt="" fill className="object-contain object-right" sizes="300px" />
        </div>
        <div className="main-container relative flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">Want Personalized Guidance?</h2>
            <p className="mt-1 text-sm text-white/80">Chat with our expert astrologers for insights tailored to your birth chart.</p>
          </div>
          <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#FF5C00] shadow-sm hover:bg-orange-50">
            <FaCommentDots size={14} /> Chat with Astrologer
          </button>
        </div>
      </section>
    </div>
  );
}
