"use client";

import Link from "next/link";
import { ORANGE } from "@/app/lib/siteTheme";

const ICON_ORANGE = ORANGE;
const HEART_ORANGE = "#FF4500";

const HOME_SERVICES = [
  {
    label: "AI Astrologer",
    href: "/AIAstrologer",
    isNew: true,
    isAI: true,
    icon: AiAstrologerIcon,
  },
  { label: "Chat", href: "/chat-to-astrologers", icon: ChatIcon },
  { label: "Call", href: "/talk-to-astrologers", icon: CallIcon },
  { label: "Video Call", href: "/talk-to-astrologers", icon: VideoCallIcon },
  { label: "Palm Reading", href: "/PalmReading", icon: PalmReadingIcon },
  { label: "Kundli", href: "/freekundli", icon: KundliIcon },
  { label: "Compatibility", href: "/kundali-matching", icon: CompatibilityIcon },
  { label: "Gemstones", href: "/gemstone", icon: GemstoneIcon },
  { label: "Puja", href: "/online-puja", icon: PujaIcon },
  { label: "Numerology", href: "/Numerology", icon: NumerologyIcon },
  { label: "Tarot", href: "/TarotReading", icon: TarotIcon },
  { label: "Vastu", href: "/VedicAstrology", icon: VastuIcon },
];

function AiAstrologerIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="16" width="28" height="22" rx="6" fill="#8B5CF6" />
      <rect x="15" y="21" width="18" height="12" rx="3" fill="#EDE9FE" />
      <circle cx="20" cy="27" r="2.2" fill="#6D28D9" />
      <circle cx="28" cy="27" r="2.2" fill="#6D28D9" />
      <path d="M20 31H28" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="16" x2="24" y2="12" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="10" r="2" fill="#6D28D9" />
      <line x1="13" y1="38" x2="16" y2="42" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="35" y1="38" x2="32" y2="42" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M8 12C8 9.8 9.8 8 12 8H36C38.2 8 40 9.8 40 12V30C40 32.2 38.2 34 36 34H16L8 42V12Z"
        fill={ICON_ORANGE}
        fillOpacity="0.12"
        stroke={ICON_ORANGE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="21" r="2.2" fill={ICON_ORANGE} />
      <circle cx="24" cy="21" r="2.2" fill={ICON_ORANGE} />
      <circle cx="30" cy="21" r="2.2" fill={ICON_ORANGE} />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M14 10C14 10 11 10 10 13C9 16 9 20 16 27C23 34 27 35 30 34C33 33 34 30 34 30L29 25C29 25 27 26 26 26C22 26 16 18 18 16C18 16 20 15 20 13L14 10Z"
        fill={ICON_ORANGE}
        fillOpacity="0.12"
        stroke={ICON_ORANGE}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M30 12C33 12 36 15 36 18" stroke={ICON_ORANGE} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 16C31.6 16 33 17.4 33 19" stroke={ICON_ORANGE} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function VideoCallIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="6" y="14" width="26" height="20" rx="4" fill={ICON_ORANGE} fillOpacity="0.12" stroke={ICON_ORANGE} strokeWidth="2.2" />
      <path d="M32 19L42 14V34L32 29V19Z" fill={ICON_ORANGE} fillOpacity="0.12" stroke={ICON_ORANGE} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

function PalmReadingIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M20 38V16C20 14.9 20.9 14 22 14C23.1 14 24 14.9 24 16V26" stroke={ICON_ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 22V14C24 12.9 24.9 12 26 12C27.1 12 28 12.9 28 14V24" stroke={ICON_ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 22V16C28 14.9 28.9 14 30 14C31.1 14 32 14.9 32 16V26" stroke={ICON_ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 28V20C16 18.9 16.9 18 18 18C19.1 18 20 18.9 20 20" stroke={ICON_ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 28C16 28 14 30 14 33C14 36 16 39 20 40H26C30 40 32 37 32 34V26" stroke={ICON_ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KundliIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="8" y="8" width="32" height="32" rx="3" stroke={ICON_ORANGE} strokeWidth="2.2" />
      <line x1="8" y1="24" x2="40" y2="24" stroke={ICON_ORANGE} strokeWidth="2" />
      <line x1="24" y1="8" x2="24" y2="40" stroke={ICON_ORANGE} strokeWidth="2" />
      <line x1="8" y1="8" x2="40" y2="40" stroke={ICON_ORANGE} strokeWidth="1.5" strokeOpacity="0.45" />
      <line x1="40" y1="8" x2="8" y2="40" stroke={ICON_ORANGE} strokeWidth="1.5" strokeOpacity="0.45" />
    </svg>
  );
}

function CompatibilityIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 38C24 38 8 29 8 19C8 14.6 11.6 11 16 11C19.2 11 22 12.8 24 15.4C26 12.8 28.8 11 32 11C36.4 11 40 14.6 40 19C40 29 24 38 24 38Z"
        fill={HEART_ORANGE}
        stroke={HEART_ORANGE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GemstoneIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <polygon points="24,6 38,18 24,42 10,18" fill={ICON_ORANGE} fillOpacity="0.15" stroke={ICON_ORANGE} strokeWidth="2" strokeLinejoin="round" />
      <polygon points="24,6 38,18 24,22 10,18" fill={ICON_ORANGE} fillOpacity="0.85" stroke={ICON_ORANGE} strokeWidth="2" strokeLinejoin="round" />
      <line x1="10" y1="18" x2="38" y2="18" stroke={ICON_ORANGE} strokeWidth="1.5" strokeOpacity="0.7" />
    </svg>
  );
}

function PujaIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <ellipse cx="24" cy="34" rx="14" ry="4" fill={ICON_ORANGE} fillOpacity="0.15" />
      <path d="M24 10C24 10 18 18 18 26C18 30 20.5 32 24 32C27.5 32 30 30 30 26C30 18 24 10 24 10Z" fill={ICON_ORANGE} fillOpacity="0.2" stroke={ICON_ORANGE} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M24 32V36" stroke={ICON_ORANGE} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 36H28" stroke={ICON_ORANGE} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 14L24 8" stroke={ICON_ORANGE} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="7" r="2" fill={ICON_ORANGE} />
    </svg>
  );
}

function NumerologyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="10" width="28" height="28" rx="4" stroke={ICON_ORANGE} strokeWidth="2.2" />
      <line x1="10" y1="20" x2="38" y2="20" stroke={ICON_ORANGE} strokeWidth="1.8" />
      <line x1="10" y1="30" x2="38" y2="30" stroke={ICON_ORANGE} strokeWidth="1.8" />
      <line x1="20" y1="10" x2="20" y2="38" stroke={ICON_ORANGE} strokeWidth="1.8" />
      <line x1="30" y1="10" x2="30" y2="38" stroke={ICON_ORANGE} strokeWidth="1.8" />
      <text x="14" y="18" fill={ICON_ORANGE} fontSize="7" fontWeight="700">7</text>
      <text x="24" y="18" fill={ICON_ORANGE} fontSize="7" fontWeight="700">3</text>
      <text x="32" y="18" fill={ICON_ORANGE} fontSize="7" fontWeight="700">9</text>
    </svg>
  );
}

function TarotIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="8" width="16" height="32" rx="2.5" fill={ICON_ORANGE} fillOpacity="0.12" stroke={ICON_ORANGE} strokeWidth="2" transform="rotate(-8 18 24)" />
      <rect x="18" y="8" width="16" height="32" rx="2.5" fill={ICON_ORANGE} fillOpacity="0.85" stroke={ICON_ORANGE} strokeWidth="2" />
      <rect x="26" y="8" width="16" height="32" rx="2.5" fill={ICON_ORANGE} fillOpacity="0.12" stroke={ICON_ORANGE} strokeWidth="2" transform="rotate(8 34 24)" />
    </svg>
  );
}

function VastuIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M8 22L24 8L40 22V40H30V30H18V40H8V22Z"
        fill={ICON_ORANGE}
        fillOpacity="0.12"
        stroke={ICON_ORANGE}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceCard({ item }) {
  const IconComponent = item.icon;

  return (
    <Link
      href={item.href}
      className="group flex w-[88px] shrink-0 snap-center cursor-pointer flex-col items-center sm:w-[96px] lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
    >
      <div
        className={`relative flex h-[64px] w-[64px] items-center justify-center rounded-2xl border shadow-[0_2px_12px_rgba(255,92,0,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_6px_18px_rgba(255,92,0,0.15)] ${item.isAI
            ? "border-violet-200 bg-gradient-to-br from-violet-50 to-white group-hover:border-violet-300"
            : "border-orange-100 bg-white group-hover:border-[#FF5C00]/40"
          }`}
      >
        {item.isNew && (
          <span
            className="absolute -right-1.5 -top-1.5 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white shadow-sm ring-2 ring-white"
            style={{ backgroundColor: ICON_ORANGE }}
          >
            NEW
          </span>
        )}

        <div className="relative z-[1] transition-transform duration-300 group-hover:scale-105">
          <IconComponent />
        </div>
      </div>

     <p className="mt-1 text-center text-[11px] font-semibold leading-4 text-gray-700 group-hover:text-[#FF5C00]">
  {item.label}
</p>
    </Link>
  );
}

export default function IconsBar() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
      <div className="px-1 py-3 md:px-3 md:py-4">
        <div className="relative z-10 w-full">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-6 md:gap-3 md:overflow-visible lg:grid-cols-12 lg:gap-2 xl:gap-4 [&::-webkit-scrollbar]:hidden">
            {HOME_SERVICES.map((item) => (
              <ServiceCard key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
