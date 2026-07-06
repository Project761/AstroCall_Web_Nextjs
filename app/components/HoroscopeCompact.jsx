import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { ORANGE, CREAM } from "@/app/lib/siteTheme";

export default function HoroscopeCompact() {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#1A1A1A]">Daily Horoscope & Panchang</h2>
      <p className="mt-2 text-xs text-[#666] sm:text-sm">Start your day with cosmic guidance from expert Vedic astrologers.</p>
      <ul className="mt-4 space-y-2">
        {["Daily predictions for all 12 signs", "Love, career, health insights", "Accurate Vedic calculations", "Free sun sign horoscope"].map((t) => (
          <li key={t} className="flex items-start gap-2 text-xs text-[#444] sm:text-sm">
            <FaCheckCircle className="mt-0.5 shrink-0" style={{ color: ORANGE }} />
            {t}
          </li>
        ))}
      </ul>
      <div className="relative mx-auto my-5 flex h-[130px] w-[130px] items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-dashed" style={{ borderColor: "rgba(241,99,34,0.25)" }} />
        <div className="grid grid-cols-3 gap-1 p-2">
          {["aries", "leo", "sagittarius", "taurus", "virgo", "capricorn", "gemini", "libra", "aquarius"].map((s) => (
            <Image key={s} src={`/horoimg/${s}.png`} alt={s} width={28} height={28} className="h-7 w-7 object-contain opacity-80" />
          ))}
        </div>
      </div>
      <Link href="/daily-horoscope" className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white hover:opacity-90" style={{ backgroundColor: ORANGE }}>
        View Horoscope
      </Link>
    </div>
  );
}
