"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { MenuContext } from "@/app/context/MenuContext";
import { postWithToken } from "@/app/utils/api";
import { FaStar, FaCheckCircle, FaClock, FaCalendarAlt } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { OrbitProgress } from "react-loading-indicators";
import DOMPurify from "dompurify";
import { ORANGE, CREAM, CREAM_ALT, PEACH, PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";
import PageBanner from "@/app/components/PageBanner";

const HIGHLIGHTS = [
  { icon: FaCalendarAlt, label: "Festival Dates" },
  { icon: MdCelebration, label: "Major Celebrations" },
  { icon: FaStar, label: "Vrat & Rituals" },
  { icon: FaCheckCircle, label: "Vedic Calendar" },
];

const TRUST = [
  { icon: FaCheckCircle, text: "Accurate Dates" },
  { icon: FaStar, text: "Expert Verified" },
  { icon: FaClock, text: "Updated Timings" },
];

export default function Upcomingfestival() {
  const { VratUpvaasData } = useContext(MenuContext);
  const year = new Date().getFullYear();

  const [activeTab, setActiveTab] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [descriptionDocData, setDescriptionDocData] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (!VratUpvaasData?.length) return;

    const storedId =
      typeof window !== "undefined" ? sessionStorage.getItem("VratUpvaasID") : null;
    const match = VratUpvaasData.find(
      (item) => String(item?.VratUpvaasID) === String(storedId)
    );
    const initial = match || VratUpvaasData[0];

    queueMicrotask(() => {
      setSelectedId(String(initial?.VratUpvaasID ?? ""));
      setActiveTab(initial?.Description ?? "");
    });
  }, [VratUpvaasData]);

  const getFestivalContent = useCallback(async (vratUpvaasId) => {
    await Promise.resolve();
    setLoadingContent(true);
    const val = { IsActive: "1", VratUpvaasID: vratUpvaasId };
    try {
      const res = await postWithToken("VratUpvaasMain/GetData_VratUpvaas", val);
      setDescriptionDocData(res?.length > 0 ? res : []);
    } catch (error) {
      console.log(error, "error");
      setDescriptionDocData([]);
    } finally {
      setLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await getFestivalContent(selectedId);
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedId, getFestivalContent]);

  const handleTabClick = (tab) => {
    setActiveTab(tab?.Description);
    setSelectedId(String(tab?.VratUpvaasID));
    sessionStorage.setItem("VratUpvaasID", tab?.VratUpvaasID);
  };

  return (
    <div className="min-h-screen pb-16 pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.UpcomingFestivals}
        currentPage="Upcoming Festivals"
        title={
          <>
            Upcoming Festivals <span className="text-[#FF5C00]">{year}</span>
          </>
        }
        subtitle="Discover important Hindu festivals, vrat dates, and auspicious celebrations — with dates, significance, and rituals based on the Vedic calendar."
      >
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 sm:mt-5">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-orange-100 bg-white/80 px-3 py-2.5 shadow-sm"
            >
              <Icon className="shrink-0 text-base text-[#FF5C00]" />
              <span className="text-left text-[11px] font-semibold text-gray-700 sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </PageBanner>

      <div className="main-container px-4 py-6 sm:py-8 md:py-10">
        {!VratUpvaasData?.length ? (
          <div className="flex justify-center py-20">
            <OrbitProgress color={ORANGE} size="large" />
          </div>
        ) : (
          <>
            <div className="mb-5 text-center sm:mb-6">
              <h2 className="font-serif text-xl font-extrabold text-[#1A1A1A] sm:text-2xl md:text-3xl">
                Browse <span style={{ color: ORANGE }}>Festivals & Vrats</span>
              </h2>
              <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
                Select a festival to view dates, significance, and rituals
              </p>
            </div>

            <div className="relative mb-6 sm:mb-8">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#FFF9F1] to-transparent sm:hidden"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#FFF9F1] to-transparent sm:hidden"
                aria-hidden
              />

              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:gap-2.5 [&::-webkit-scrollbar]:hidden">
                {VratUpvaasData.map((tab, index) => {
                  const isActive = activeTab === tab?.Description;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTabClick(tab)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-sm ${
                        isActive
                          ? "border-transparent text-white shadow-md"
                          : "border-orange-100 bg-white text-gray-700 hover:border-orange-200 hover:text-[#FF5C00]"
                      }`}
                      style={isActive ? { backgroundColor: ORANGE } : undefined}
                    >
                      {tab?.Description}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_30px_rgba(255,92,0,0.08)] sm:rounded-3xl">
              <div
                className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-50 px-4 py-3 sm:px-6 sm:py-4"
                style={{ background: `linear-gradient(90deg, ${CREAM_ALT}, ${CREAM})` }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Selected
                  </p>
                  <p className="font-serif text-base font-bold text-[#1A1A1A] sm:text-lg">
                    {activeTab || "Festival"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRUST.map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600 sm:text-xs"
                    >
                      <Icon style={{ color: ORANGE }} size={11} />
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-4 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
                {loadingContent ? (
                  <div className="flex justify-center py-12">
                    <OrbitProgress color={ORANGE} size="medium" />
                  </div>
                ) : descriptionDocData?.length > 0 ? (
                  descriptionDocData.map((item, index) => (
                    <div
                      key={index}
                      className="prose prose-sm sm:prose-base max-w-none text-justify leading-relaxed prose-headings:font-serif prose-headings:text-[#1A1A1A] prose-p:text-gray-700 prose-strong:text-[#1A1A1A] prose-a:text-[#FF5C00] prose-li:text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item?.VratUpvaashtml || ""),
                      }}
                    />
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <MdCelebration className="mx-auto text-4xl opacity-30" style={{ color: ORANGE }} />
                    <p className="mt-3 text-base font-semibold text-gray-500 sm:text-lg">
                      Festival details coming soon...
                    </p>
                    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                      We are updating dates and rituals for this festival.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div
              className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-orange-100 px-4 py-5 sm:flex-row sm:px-6"
              style={{ background: `linear-gradient(135deg, ${PEACH} 0%, white 100%)` }}
            >
              <div className="text-center sm:text-left">
                <p className="font-serif text-base font-bold text-[#1A1A1A] sm:text-lg">
                  Need guidance for an upcoming festival?
                </p>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  Consult our expert astrologers for muhurat and ritual advice.
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href="/chat-to-astrologers"
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 sm:px-5 sm:text-sm"
                  style={{ backgroundColor: ORANGE }}
                >
                  Chat Now
                </Link>
                <Link
                  href="/talk-to-astrologers"
                  className="rounded-xl border-2 bg-white px-4 py-2.5 text-xs font-bold transition hover:bg-orange-50 sm:px-5 sm:text-sm"
                  style={{ borderColor: ORANGE, color: ORANGE }}
                >
                  Call Now
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
