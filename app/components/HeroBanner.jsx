"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoMdChatboxes, IoMdVideocam } from "react-icons/io";
import { MdPhoneInTalk, MdVerified } from "react-icons/md";
import {
  FaRegCalendarAlt,
  FaSun,
  FaPalette,
  FaUsers,
  FaStar,
  FaClock,
} from "react-icons/fa";
import { CREAM } from "@/app/lib/siteTheme";

const BANNER_SRC = "/Banner/HomePageBanner3.png";

const INFO_ROWS = [
  {
    icon: FaRegCalendarAlt,
    label: "Daily Horoscope",
    link: { href: "/daily-horoscope", text: "Read Now" },
  },
  {
    icon: FaSun,
    label: "Lucky Number",
    value: "7",
    valueClass: "text-[#FF5C00]",
  },
  {
    icon: FaPalette,
    label: "Lucky Color",
    value: "Blue",
    valueClass: "text-blue-600",
  },
  {
    icon: FaRegCalendarAlt,
    label: "Panchang",
    link: { href: "/today-panchang", text: "View Now" },
  },
];

const ONLINE_AVATARS = [
  "/images/profile pic.webp",
  "/images/profile pic.webp",
  "/images/profile pic.webp",
  "/images/profile pic.webp",
];

function InfoCard({ className = "" }) {
  return (
    <div
      className={`w-full rounded-xl border border-orange-100 bg-white/95 p-2.5 shadow-sm backdrop-blur-sm sm:p-3 ${className}`}
    >
      <div className="space-y-0.5 sm:space-y-1">
        {INFO_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-md px-1 py-1.5 hover:bg-orange-50 sm:px-1.5"
          >
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-50 sm:h-7 sm:w-7">
                <row.icon className="text-[11px] text-[#FF5C00] sm:text-xs" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium leading-none text-gray-700 sm:text-xs">
                  {row.label}
                </p>
                {row.link && (
                  <Link
                    href={row.link.href}
                    className="cursor-pointer text-[10px] font-semibold text-[#FF5C00] sm:text-[11px]"
                  >
                    {row.link.text}
                  </Link>
                )}
              </div>
            </div>
            {row.value && (
              <span className={`shrink-0 text-[10px] font-bold sm:text-[11px] ${row.valueClass || "text-[#FF5C00]"}`}>
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OnlineCard({ className = "" }) {
  return (
    <div
      className={`w-full rounded-xl border border-orange-100 bg-white/95 p-2.5 shadow-sm backdrop-blur-sm sm:p-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          <span className="text-[11px] font-semibold text-gray-800 sm:text-xs">
            348 Astrologers Online
          </span>
        </div>
        <span className="rounded bg-[#FF5C00] px-1.5 py-0.5 text-[8px] font-bold text-white sm:text-[9px]">
          LIVE
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {ONLINE_AVATARS.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] rounded-full border border-white object-cover sm:h-6 sm:w-6"
            />
          ))}
        </div>
        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-[#FF5C00] sm:text-[10px]">
          +343
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-orange-100 pt-2">
        <span className="text-[10px] text-gray-500 sm:text-[11px]">Avg. wait</span>
        <span className="text-[10px] font-bold text-green-600 sm:text-[11px]">1–2 mins</span>
      </div>
    </div>
  );
}

const STATS = [
  { icon: FaUsers, value: "20 Lakh+", label: "Happy Customers" },
  { icon: FaStar, value: "4.9", label: "Average Rating" },
  { icon: MdVerified, value: "1280+", label: "Verified Astrologers" },
  { icon: FaClock, value: "24×7", label: "Consultation" },
];

export default function HeroBanner() {
  const router = useRouter();

  return (
    <>
      <section
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-orange-100/60"
        style={{ backgroundColor: CREAM }}
      >
        {/* Full-width banner background */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={BANNER_SRC}
            alt=""
            fill
            priority
            className="object-cover object-[85%_top] sm:object-[75%_center] lg:object-[62%_center]"
            sizes="100vw"
          />
          {/* <div
            className="absolute inset-0 bg-gradient-to-b from-[#FFF9F1]/98 via-[#FFF9F1]/92 to-[#FFF9F1]/75 sm:bg-gradient-to-r sm:from-[#FFF9F1] sm:via-[#FFF9F1]/80 sm:to-[#FFF9F1]/20 lg:via-[#FFF9F1]/55"
            aria-hidden
          /> */}
        </div>

        <div className="main-container relative z-10">
          {/* Banner content — mobile par auto height, desktop par fixed */}
          <div className="relative py-5 sm:py-6 md:min-h-[320px] md:py-8 lg:min-h-[370px]">
            <div className="max-w-full pr-0 md:max-w-[58%] lg:max-w-xl lg:pr-4">
              <h1 className="font-heading text-[1.25rem] font-bold leading-snug tracking-[-0.02em] text-[#1A1A1A] min-[380px]:text-[1.35rem] sm:text-[1.65rem] md:text-[1.85rem] lg:text-[2.1rem] lg:leading-[1.15] xl:text-[2.35rem]">
                Your Gateway to{" "}
                <span className="text-[#FF5C00]">Cosmic Wisdom</span>
                {" "}&amp; Astrological Excellence
              </h1>

              <p className="mt-2 max-w-full font-body text-xs leading-relaxed text-gray-600 sm:mt-2.5 sm:text-sm sm:leading-6">
                Discover authentic Vedic astrology, personalised consultations, and cosmic guidance.
              </p>

              {/* Mobile: one row flex | sm+: grid */}
              <div className="mt-4 flex flex-row gap-1.5 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => router.push("/chat-to-astrologers")}
                  className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#FF5C00] px-1.5 text-[11px] font-semibold text-white shadow-[0_3px_12px_rgba(255,92,0,0.22)] transition hover:bg-[#E85500] min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
                >
                  <IoMdChatboxes className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
                  Chat Now
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/talk-to-astrologers")}
                  className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-[#FF5C00] bg-white/95 px-1.5 text-[11px] font-semibold text-[#FF5C00] backdrop-blur-sm transition hover:bg-orange-50 min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
                >
                  <MdPhoneInTalk className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
                  Call Now
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/talk-to-astrologers")}
                  className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-[#FF5C00] bg-white/95 px-1.5 text-[11px] font-semibold text-[#FF5C00] backdrop-blur-sm transition hover:bg-orange-50 min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
                >
                  <IoMdVideocam className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
                  Video Call
                </button>
              </div>
            </div>

            {/* Desktop — right side cards */}
            <div className="absolute right-0 top-1/2 z-20 hidden w-[200px] -translate-y-1/2 flex-col gap-2.5 md:flex lg:w-[220px] xl:w-[235px]">
              <InfoCard />
              <OnlineCard />
            </div>

            <div className="hidden md:block w-full lg:max-w-xl mt-6">
              <div className="rounded-xl border border-white/70 bg-white/80 backdrop-blur-sm px-3 py-2.5 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STATS.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      {/* Icon */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50">
                        <Icon className="text-sm text-[#FF5C00]" />
                      </div>

                      {/* Text */}
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold leading-none text-[#1A1A1A]">
                          {value}
                        </p>
                        <p className="mt-0.5 text-[9px] leading-tight text-gray-500">
                          {label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>



        </div>
      </section>

      {/* Mobile / tablet — cards banner ke neeche full width */}
      <div className="border-b  border-orange-50 bg-[#FFFBF7] py-3 md:hidden">
        <div className="main-container">
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <InfoCard />
            <OnlineCard />
          </div>
        </div>
      </div>

    </>
  );
}
