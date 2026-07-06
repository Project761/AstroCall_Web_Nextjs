"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  FaChevronRight, FaChevronLeft, FaShieldAlt, FaStar, FaHeart, FaOm,
  FaCommentDots, FaPhone, FaVideo, FaArrowUp, FaCheckCircle, FaExclamationTriangle,
  FaUser, FaCalendarAlt, FaMapMarkerAlt,
} from "react-icons/fa";
import { TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";
const CARD = "rounded-xl border border-gray-100 bg-white shadow-sm";

const STEPS = ["Basic Details", "Kundli Details", "Matching", "Report"];

const HERO_FEATURES = [
  { icon: FaOm, t: "As Per Vedic Astrology" },
  { icon: FaStar, t: "Detailed Compatibility" },
  { icon: FaHeart, t: "Personalized Remedies" },
  { icon: FaShieldAlt, t: "100% Secure & Confidential" },
];

const TRUST_ITEMS = [
  { icon: FaCheckCircle, title: "100% Accurate Matching", sub: "Vedic Guna Milan" },
  { icon: FaOm, title: "Based on Vedic Astrology", sub: "Ashtakoot system" },
  { icon: FaStar, title: "Trusted by Millions", sub: "Across India" },
  { icon: FaShieldAlt, title: "Secure & Confidential", sub: "Data protected" },
];

const WHY_ITEMS = [
  "Helps in understanding the nature of your relationship",
  "Reveals compatibility for a happy married life",
  "Identifies potential doshas and their remedies",
  "Guides you towards a prosperous future together",
];

const LoadingIndicator = () => (
  <div className="flex justify-center py-10">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200" style={{ borderTopColor: ORANGE }} />
  </div>
);

const getVerdict = (obtained, max) => {
  const pct = max ? (obtained / max) * 100 : 0;
  if (pct >= 75) return { label: "Excellent Match", color: "green" };
  if (pct >= 50) return { label: "Good Match", color: "green" };
  if (pct >= 40) return { label: "Average Match", color: "orange" };
  return { label: "Needs Review", color: "red" };
};

const formatDob = (d) => {
  if (!d?.Day || !d?.Month || !d?.Year) return "—";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.Day} ${months[d.Month - 1] || d.Month} ${d.Year}, ${String(d.Hours ?? 0).padStart(2, "0")}:${String(d.Minute ?? 0).padStart(2, "0")}`;
};

function KundliMatchingDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";
  const BidGET = typeof window !== "undefined" ? localStorage.getItem("Bid") || "" : "";
  const GidGET = typeof window !== "undefined" ? localStorage.getItem("Gid") || "" : "";

  const Bid = searchParams.get("Bid") || BidGET;
  const Gid = searchParams.get("Gid") || GidGET;
  const [apiResponse, setapiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [MaleData, setMaleData] = useState();
  const [FemaleData, setFemaleData] = useState();
  const [showBackTop, setShowBackTop] = useState(false);

  const Get_Ashtakoot_Milan = useCallback(async (male, female) => {
    setLoading(true);
    const val = {
      p1_Date: `${male?.Year}-${String(male?.Month).padStart(2, "0")}-${String(male?.Day).padStart(2, "0")}T${String(male?.Hours).padStart(2, "0")}:${String(male?.Minute).padStart(2, "0")}:${String(male?.Second).padStart(2, "0")}`,
      p1_full_name: male?.Name,
      p1_year: male?.Year,
      p1_month: male?.Month,
      p1_day: male?.Day,
      p1_gender: male?.Gender,
      p1_place: male?.PlaceOfBirth,
      p1_lat: male?.Latitude,
      p1_lon: male?.Longitude,
      p1_tzone: "5.5",
      p1_sec: male?.Second,
      p1_min: male?.Minute,
      p1_hour: male?.Hours,
      p2_Date: `${female?.Year}-${String(female?.Month).padStart(2, "0")}-${String(female?.Day).padStart(2, "0")}T${String(female?.Hours).padStart(2, "0")}:${String(female?.Minute).padStart(2, "0")}:${String(female?.Second).padStart(2, "0")}`,
      p2_full_name: female?.Name,
      p2_year: female?.Year,
      p2_month: female?.Month,
      p2_day: female?.Day,
      p2_gender: female?.Gender,
      p2_place: female?.PlaceOfBirth,
      p2_lat: female?.Latitude,
      p2_lon: female?.Longitude,
      p2_tzone: "5.5",
      p2_sec: female?.Second,
      p2_min: female?.Minute,
      p2_hour: female?.Hours,
      lan: "en",
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/ashtakoot_milan", val);
      const parsed = JSON.parse(res.data);
      if (parsed?.data) setapiResponse(parsed.data);
    } catch (error) {
      console.error("Error fetching Kundli Matching details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const Get_Data_Kundli_Partners = useCallback(async () => {
    const val = { UserId: UserLoginId, Type: "kundali_Matching" };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliDetails/GetData_KundaliDetails", val);
      const parsed = JSON.parse(res.data);
      const raw = parsed?.Table;
      if (raw) {
        const filteredMaleData = raw?.filter((item) => item?.Id == Bid);
        const filteredFeMaleData = raw?.filter((item) => item?.Id == Gid);
        if (filteredMaleData[0] && filteredFeMaleData[0]) {
          Get_Ashtakoot_Milan(filteredMaleData[0], filteredFeMaleData[0]);
        }
        if (filteredMaleData.length > 0) setMaleData(filteredMaleData[0]);
        if (filteredFeMaleData.length > 0) setFemaleData(filteredFeMaleData[0]);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [Bid, Gid, UserLoginId, Get_Ashtakoot_Milan]);

  useEffect(() => {
    if (Bid && Gid) void (async () => { await Get_Data_Kundli_Partners(); })();
  }, [Bid, Gid, Get_Data_Kundli_Partners]);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const result = apiResponse?.ashtakoot_milan_result;
  const obtained = Number(result?.points_obtained ?? 0);
  const maxPts = Number(result?.max_ponits ?? 36);
  const verdict = getVerdict(obtained, maxPts);
  const scorePct = maxPts ? Math.round((obtained / maxPts) * 100) : 0;
  const isCompatible = result?.is_compatible === "true";

  const compatBars = useMemo(() => {
    const base = scorePct || 70;
    return [
      { label: "Love", val: Math.min(100, base + 5) },
      { label: "Marriage", val: Math.min(100, base + 8) },
      { label: "Trust", val: Math.min(100, base - 2) },
      { label: "Communication", val: Math.min(100, base - 5) },
      { label: "Understanding", val: Math.min(100, base + 3) },
    ];
  }, [scorePct]);

  const ashtakootList = useMemo(() => {
    if (!apiResponse?.ashtakoot_milan) return [];
    return Object.entries(apiResponse.ashtakoot_milan).map(([key, val]) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      score: `${val?.points_obtained ?? 0} / ${val?.max_ponits ?? 0}`,
    }));
  }, [apiResponse]);

  const renderPersonCard = (person, accent) => (
    <div className={`overflow-hidden ${CARD}`}>
      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: ORANGE }}>
        <h3 className="text-sm font-bold text-white">Basic Details</h3>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">{person?.Gender || accent}</span>
      </div>
      <div className="space-y-0 p-4">
        {[
          { icon: FaUser, label: "Name", val: person?.Name },
          { icon: FaCalendarAlt, label: "Birth Date & Time", val: formatDob(person) },
          { icon: FaMapMarkerAlt, label: "Birth Place", val: person?.PlaceOfBirth },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} className="flex items-start gap-2.5 border-b border-gray-50 py-2.5 last:border-0">
            <Icon size={13} className="mt-0.5 shrink-0 text-[#FF5C00]" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase text-gray-400">{label}</p>
              <p className="text-sm font-semibold text-[#0F172A]">{val || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-[72px] pb-28">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.horoscope}
        currentPage="Matching Report"
        crumbs={[
          { label: "Free Kundli", href: "/freekundli" },
          { label: "Kundli Matching", href: "/kundali-matching" },
        ]}
        title={
          <>
            Kundli Matching Report
            <span className="mt-2 block text-lg font-bold text-[#FF5C00] sm:text-xl">
              Your cosmic compatibility analysis is ready
            </span>
          </>
        }
        subtitle="Detailed Ashtakoot Guna Milan report with dosha analysis and personalized insights for your relationship."
      >
        <div className="mt-4 flex flex-wrap gap-4">
          {HERO_FEATURES.map(({ icon: Icon, t }) => (
            <span key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Icon size={13} className="text-[#FF5C00]" /> {t}
            </span>
          ))}
        </div>
      </PageBanner>

      {/* Stepper — Report step active */}
      <div className="border-b border-gray-100 bg-white">
        <div className="main-container flex items-center justify-center gap-2 overflow-x-auto px-4 py-4 sm:gap-6">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i <= 3 ? "text-white" : "border border-gray-300 text-gray-400"}`}
                  style={i <= 3 ? { backgroundColor: i === 3 ? ORANGE : "#22c55e" } : {}}
                >
                  {i < 3 ? "✓" : i + 1}
                </span>
                <span className={`whitespace-nowrap text-xs font-bold sm:text-sm ${i === 3 ? "text-[#FF5C00]" : i < 3 ? "text-green-600" : "text-gray-400"}`}>{step}</span>
              </div>
              {i < STEPS.length - 1 && <span className="hidden h-px w-8 bg-gray-200 sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="main-container px-4 py-8">
        {/* Couple header */}
        <div className={`mb-6 flex flex-col items-center justify-center gap-4 p-5 sm:flex-row ${CARD}`}>
          <div className="rounded-xl border-2 px-6 py-3 text-center" style={{ borderColor: ORANGE }}>
            <p className="text-[10px] font-bold uppercase text-blue-600">Groom / Boy</p>
            <p className="text-base font-extrabold text-[#0F172A]">{MaleData?.Name || "—"}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <FaHeart className="text-red-500" size={24} />
          </div>
          <div className="rounded-xl border-2 px-6 py-3 text-center" style={{ borderColor: ORANGE }}>
            <p className="text-[10px] font-bold uppercase text-red-500">Bride / Girl</p>
            <p className="text-base font-extrabold text-[#0F172A]">{FemaleData?.Name || "—"}</p>
          </div>
        </div>

        {/* Basic details */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {renderPersonCard(MaleData, "Male")}
          {renderPersonCard(FemaleData, "Female")}
        </div>

        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main results */}
            <div className="space-y-6">
              {/* Score card */}
              {result && (
                <div className={`p-5 sm:p-6 ${CARD}`}>
                  <h2 className="mb-5 text-base font-bold text-[#0F172A]">Matching Result</h2>
                  <div className="grid gap-5 lg:grid-cols-[140px_1fr_180px]">
                    <div className="flex flex-col items-center justify-center">
                      <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-[6px] bg-green-50 ${isCompatible ? "border-green-500" : "border-orange-400"}`}>
                        <div className="text-center">
                          <p className={`text-2xl font-extrabold ${isCompatible ? "text-green-600" : "text-orange-500"}`}>
                            {obtained}<span className="text-sm text-gray-400">/{maxPts}</span>
                          </p>
                          <p className={`text-[10px] font-bold ${isCompatible ? "text-green-600" : "text-orange-500"}`}>{verdict.label}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-bold text-[#0F172A]">Overall Compatibility</p>
                      <p className="mb-4 text-xs text-gray-500">Based on Ashtakoot Guna Milan — score of 18+ is acceptable, 24+ is excellent for marriage.</p>
                      <div className="space-y-2.5">
                        {compatBars.map(({ label, val }) => (
                          <div key={label}>
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="font-semibold text-gray-600">{label}</span>
                              <span className="font-bold text-green-600">{val}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                              <div className="h-full rounded-full bg-green-500" style={{ width: `${val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`rounded-xl p-4 text-center ${isCompatible ? "bg-green-50" : "bg-orange-50"}`}>
                      <p className="text-xs font-bold text-gray-500">Verdict</p>
                      <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold text-white ${isCompatible ? "bg-green-500" : "bg-orange-500"}`}>
                        {isCompatible ? verdict.label : "Review Required"}
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-gray-600">
                        {result?.content || (isCompatible ? "This match is favorable for marriage." : "Consult an astrologer for detailed guidance.")}
                      </p>
                    </div>
                  </div>
                  {result?.content && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <p className="text-xs leading-relaxed text-gray-600">{result.content}</p>
                    </div>
                  )}
                  <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl bg-orange-50 px-4 py-3 sm:flex-row">
                    <p className="text-xs font-semibold text-gray-700">Get personalized remedies from our expert astrologers</p>
                    <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="shrink-0 rounded-lg border-2 px-5 py-2 text-xs font-bold transition hover:bg-orange-50" style={{ borderColor: ORANGE, color: ORANGE }}>
                      Chat with Astrologer
                    </button>
                  </div>
                </div>
              )}

              {/* Ashtakoot table */}
              {apiResponse?.ashtakoot_milan && (
                <div className={`overflow-hidden ${CARD}`}>
                  <div className="border-b border-gray-100 px-4 py-3">
                    <h2 className="text-sm font-bold text-[#0F172A]">Ashtakoot Milan — Detailed Breakdown</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          {["Koota", "Male", "Female", "Points", "Max", "Area of Life", "Description"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(apiResponse.ashtakoot_milan).map(([key, val]) => (
                          <tr key={key} className="border-t border-gray-50 hover:bg-orange-50/30">
                            <td className="px-3 py-2 font-bold capitalize text-[#0F172A] whitespace-nowrap">{key.replace(/_/g, " ")}</td>
                            <td className="px-3 py-2 text-gray-600">{val.p1}</td>
                            <td className="px-3 py-2 text-gray-600">{val.p2}</td>
                            <td className="px-3 py-2 font-bold text-green-600">{val.points_obtained}</td>
                            <td className="px-3 py-2 text-gray-600">{val.max_ponits}</td>
                            <td className="px-3 py-2 text-gray-600">{val.area_of_life}</td>
                            <td className="px-3 py-2 text-gray-500 max-w-xs">{val.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Dosha cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Manglik Dosha",
                    content: (
                      <>
                        <p className="text-xs"><span className="font-bold">Male:</span> {apiResponse?.manglik_dosha?.p1 || "—"}</p>
                        <p className="text-xs"><span className="font-bold">Female:</span> {apiResponse?.manglik_dosha?.p2 || "—"}</p>
                        <p className="mt-2 text-[10px] text-gray-500">Important check for marriage compatibility</p>
                      </>
                    ),
                  },
                  {
                    title: "Nadi Dosha",
                    content: (
                      <>
                        <p className={`text-xs font-bold ${apiResponse?.nadi_dosha === "true" ? "text-orange-600" : "text-green-600"}`}>
                          {apiResponse?.nadi_dosha === "true" ? "Nadi Dosha Present" : "No Nadi Dosha"}
                        </p>
                        <p className="mt-2 text-[10px] text-gray-500">Affects health & progeny in marital life</p>
                      </>
                    ),
                  },
                  {
                    title: "Bhakoot Dosha",
                    content: (
                      <>
                        <p className={`text-xs font-bold ${apiResponse?.bhakoot_dosha === "true" ? "text-orange-600" : "text-green-600"}`}>
                          {apiResponse?.bhakoot_dosha === "true" ? "Bhakoot Dosha Present" : "No Bhakoot Dosha"}
                        </p>
                        <p className="mt-2 text-[10px] text-gray-500">Impacts emotional bonding & harmony</p>
                      </>
                    ),
                  },
                ].map(({ title, content }) => (
                  <div key={title} className={`overflow-hidden ${CARD}`}>
                    <div className="px-4 py-3" style={{ backgroundColor: ORANGE }}>
                      <h3 className="text-sm font-bold text-white">{title}</h3>
                    </div>
                    <div className="space-y-1 p-4 text-gray-700">{content}</div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => router.push("/kundali-matching")} className="flex items-center gap-2 text-sm font-semibold text-[#FF5C00] hover:underline">
                <FaChevronLeft size={12} /> Match Another Kundli
              </button>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Ashtakoota Score</h3>
                {ashtakootList.length > 0 ? (
                  <ul className="space-y-2">
                    {ashtakootList.map(({ name, score }) => (
                      <li key={name} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-600">{name}</span>
                        <span className="font-bold text-green-600">{score}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">Loading scores...</p>
                )}
                {result && (
                  <p className="mt-3 border-t border-gray-100 pt-3 text-center text-sm font-extrabold text-green-600">
                    Total {obtained} / {maxPts}
                  </p>
                )}
              </div>

              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Why Match Kundli?</h3>
                <ul className="space-y-2.5">
                  {WHY_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <FaHeart className="mt-0.5 shrink-0 text-[#FF5C00]" size={11} /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-2 text-sm font-bold text-[#0F172A]">Need Expert Guidance?</h3>
                <p className="mb-3 text-xs text-gray-500">Discuss your compatibility with our experienced astrologers.</p>
                <div className="mb-3 flex -space-x-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-orange-100">
                      <Image src="/images/ChatBanner.png" alt="" fill className="object-cover" sizes="36px" />
                    </div>
                  ))}
                </div>
                <p className="mb-3 flex items-center gap-1 text-xs font-bold text-gray-700">
                  <FaStar className="text-[#FF5C00]" size={12} /> 4.8 (12K+ Reviews)
                </p>
                <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>
                  <FaCommentDots size={13} /> Chat with Astrologer
                </button>
              </div>

              {/* Dosha summary */}
              {apiResponse && (
                <div className={`p-4 ${CARD}`}>
                  <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Dosha Summary</h3>
                  <ul className="space-y-2 text-xs">
                    {[
                      { n: "Manglik Dosha", ok: !(apiResponse?.manglik_dosha?.p1?.toLowerCase?.()?.includes("manglik") || apiResponse?.manglik_dosha?.p2?.toLowerCase?.()?.includes("manglik")) },
                      { n: "Nadi Dosha", ok: apiResponse?.nadi_dosha !== "true" },
                      { n: "Bhakoot Dosha", ok: apiResponse?.bhakoot_dosha !== "true" },
                    ].map(({ n, ok }) => (
                      <li key={n} className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">{n}</span>
                        {ok
                          ? <span className="flex items-center gap-1 font-bold text-green-600"><FaCheckCircle size={10} /> Clear</span>
                          : <span className="flex items-center gap-1 font-bold text-[#FF5C00]"><FaExclamationTriangle size={10} /> Present</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trust bar */}
      <section className="border-t border-orange-50 py-8" style={{ backgroundColor: CREAM }}>
        <div className="main-container grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Icon size={16} className="text-[#FF5C00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
        <div className="main-container flex items-center justify-center gap-2 sm:gap-4">
          {[
            { icon: FaCommentDots, label: "Chat Now", href: "/chat-to-astrologers" },
            { icon: FaPhone, label: "Call Now", href: "/talk-to-astrologers" },
            { icon: FaVideo, label: "Video Call", href: "/talk-to-astrologers" },
            { icon: FaOm, label: "Book Puja", href: "/online-puja" },
          ].map(({ icon: Icon, label, href }) => (
            <button key={label} type="button" onClick={() => router.push(href)} className="flex flex-1 flex-col items-center gap-0.5 sm:flex-row sm:gap-2 sm:rounded-full sm:border sm:border-orange-100 sm:px-4 sm:py-2">
              <Icon size={16} className="text-[#FF5C00]" />
              <span className="text-[10px] font-bold text-gray-700 sm:text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {showBackTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: ORANGE }}>
          <FaArrowUp size={14} />
        </button>
      )}
    </div>
  );
}

export default function MatchingDetailsClient() {
  return (
    <Suspense fallback={<div className="main-container flex justify-center py-10"><LoadingIndicator /></div>}>
      <KundliMatchingDetailsContent />
    </Suspense>
  );
}
