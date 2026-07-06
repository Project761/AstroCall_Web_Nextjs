"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { postWithToken } from "../../utils/api.js";
import { useMenuContext } from "../../hooks/useMenuContext";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import { FaStar } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { MdPhoneInTalk } from "react-icons/md";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

function OfferBanner() {
  const router = useRouter();

  return (
    <div
      className="relative flex min-h-[260px] w-full overflow-hidden rounded-2xl p-5 shadow-[0_12px_30px_rgba(255,92,0,0.18)] sm:min-h-[280px] lg:min-h-[300px]"
      style={{
        background: "linear-gradient(135deg,#FF5C00 0%,#FF781F 55%,#FFA14F 100%)",
      }}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-lg" />
      <div className="absolute bottom-0 left-[-30px] h-20 w-20 rounded-full bg-white/10 blur-md" />

      <div className="absolute right-4 top-4 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
        <span className="text-[9px] font-bold uppercase tracking-wide text-white">FREE</span>
      </div>

      <div className="relative z-10 flex h-full w-full flex-col pr-20 sm:pr-24">
        <p className="text-xs font-semibold text-white/90">🎁 First Consultation</p>
        <h2 className="mt-1 text-4xl font-extrabold leading-none text-white sm:text-[42px]">FREE</h2>
        <p className="mt-2 max-w-[220px] text-xs leading-5 text-white/90 sm:mt-3 sm:text-[12px]">
          Talk with India&apos;s trusted astrologers at no cost.
        </p>

        <div className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
          {["Verified Experts", "100% Secure Chat", "Instant Connection"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-white">
              <span className="text-xs">✔</span>
              <span className="text-xs sm:text-sm">{item}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push("/chat-to-astrologers")}
          className="mt-4 flex h-10 w-full max-w-[240px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-[#FF5C00] shadow-lg transition hover:bg-orange-50 sm:mt-auto"
        >
          <IoChatbubbleEllipses className="text-lg" />
          Chat Now Free
        </button>
      </div>

      <Image
        src="/images/Package.svg"
        alt="Offer"
        width={90}
        height={90}
        className="absolute bottom-3 right-3 h-16 w-16 opacity-95 sm:h-20 sm:w-20"
      />
    </div>
  );
}

function AstrologerCard({ a, onChat, onCall }) {
  const specs = a.Specialization
    ? a.Specialization.split(",").map((s) => s.trim()).slice(0, 1).join(", ")
    : "Vedic Astrology";

  return (
    <div className="mx-auto flex h-full w-full max-w-[280px] flex-col items-center rounded-xl border border-gray-100 bg-white px-3 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(255,92,0,0.10)] sm:max-w-none">
      <div className="relative mb-2 h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full sm:h-[72px] sm:w-[72px]">
        <Image
          src={toCdnSrcOrFallback(a?.AvatarUrl)}
          alt={a.DisplayName}
          fill
          sizes="(max-width:640px) 68px, 72px"
          className="object-cover"
          loading="lazy"
          unoptimized={!!a?.AvatarUrl}
        />
      </div>

      <p className="w-full truncate text-center text-[13px] font-semibold text-gray-900">
        {a.DisplayName}
      </p>
      <p className="mt-0.5 text-center text-[11px] text-gray-400">{specs}</p>

      <div className="mt-1.5 flex items-center gap-1">
        <FaStar className="text-[11px] text-[#FF5C00]" />
        <span className="text-[12px] font-bold text-gray-900">{a.StarCount || "4.9"}</span>
        <span className="text-[13px] font-bold text-yellow-400">+</span>
      </div>

      <p className="mt-0.5 text-[11px] text-gray-500">{a.Experience || "9"}+ Yrs Experience</p>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-[11px] font-medium text-green-600">Online</span>
      </div>

      <div className="mt-3 flex w-full gap-2">
        <button
          type="button"
          onClick={() => onChat(a)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#FF5C00] bg-white py-2 text-[12px] font-semibold text-[#FF5C00] transition hover:bg-orange-50"
        >
          <IoChatbubbleEllipses className="text-sm" />
          Chat
        </button>
        <button
          type="button"
          onClick={() => onCall(a)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#FF5C00] bg-white py-2 text-[12px] font-semibold text-[#FF5C00] transition hover:bg-orange-50"
        >
          <MdPhoneInTalk className="text-sm" />
          Call
        </button>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[280px] flex-col items-center rounded-xl border border-gray-100 bg-white px-3 py-4 shadow-sm sm:max-w-none">
      <div className="h-[68px] w-[68px] animate-pulse rounded-full bg-gray-100 sm:h-[72px] sm:w-[72px]" />
      <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-2 h-2.5 w-16 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-3 flex w-full gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

const Astrologers = () => {
  const { setAstroNameHomePage } = useMenuContext();
  const router = useRouter();

  const [astrologers, setAstrologers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardsToShow, setCardsToShow] = useState(1);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCardsToShow(3);
      else if (w >= 1024) setCardsToShow(2);
      else if (w >= 640) setCardsToShow(2);
      else setCardsToShow(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fetchAstrologers = useCallback(async () => {
    try {
      const res = await postWithToken("Astrologer/GetData_AstrologerHomepage");
      const filtered =
        res?.filter((i) => i?.IsHomePage === true && i?.IsVerified === true) || [];
      setAstrologers(filtered);
    } catch (e) {
      console.error("Error fetching astrologers:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      fetchAstrologers().finally(() => { isFetchingRef.current = false; });
    }
  }, [fetchAstrologers]);

  const total = astrologers.length;
  const canNav = total > cardsToShow;

  const visibleCards = total
    ? Array.from({ length: Math.min(cardsToShow, total) }, (_, i) =>
      astrologers[(currentIndex + i) % total]
    )
    : [];

  const handlePrev = () =>
    canNav && setCurrentIndex((p) => (p === 0 ? total - 1 : p - 1));
  const handleNext = () =>
    canNav && setCurrentIndex((p) => (p + 1) % total);

  const handleChat = (a) => {
    setAstroNameHomePage(a);
    router.push(`/chat-to-astrologers/${a.DisplayName}`);
  };
  const handleCall = (a) => {
    router.push(`/talk-to-astrologers/${a.DisplayName}`);
  };

  const navBtnClass =
    "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-[#FF5C00] shadow-sm transition hover:bg-orange-50";

  return (
    <section className="w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6">

        {/* Left Side */}
        <div className="min-w-0 flex-1">

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Top <span className="text-[#FF5C00]">Astrologers</span>
            </h2>

            <Link
              href="/talk-to-astrologers"
              className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#FF5C00]"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="flex items-stretch gap-2 sm:gap-3">

              {canNav && (
                <button type="button" onClick={handlePrev} className={`${navBtnClass} self-center`} aria-label="Previous">
                  <ChevronLeft size={18} />
                </button>
              )}

              <div
                className="grid flex-1 gap-3"
                style={{
                  gridTemplateColumns: `repeat(${loading ? cardsToShow : visibleCards.length
                    }, minmax(0,1fr))`,
                }}
              >
                {loading
                  ? Array.from({ length: cardsToShow }).map((_, i) => (
                    <Skeleton key={i} />
                  ))
                  : visibleCards.map((a) => (
                    <AstrologerCard
                      key={a.DisplayName}
                      a={a}
                      onChat={handleChat}
                      onCall={handleCall}
                    />
                  ))}
              </div>

              {canNav && (
                <button type="button" onClick={handleNext} className={`${navBtnClass} self-center`} aria-label="Next">
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Banner */}
        <div className="w-full shrink-0 lg:w-[280px] xl:w-[300px]">
          <OfferBanner />
        </div>

      </div>
    </section>
  );
};

export default Astrologers;
