import Link from "next/link";
import Image from "next/image";
import { ORANGE } from "@/app/lib/siteTheme";

export default function PromoBanners() {
  return (
    <section className="bg-white py-6 sm:py-8 md:py-10">
      <div className="main-container grid gap-4 px-3 sm:gap-5 sm:px-4 md:grid-cols-2">
        <div className="relative flex min-h-[180px] flex-col justify-center overflow-hidden rounded-2xl p-4 shadow-sm sm:min-h-[210px] sm:p-6 md:min-h-[230px]" style={{ background: "linear-gradient(135deg, #E8F4FD 0%, #D6EBFA 100%)" }}>
          <div className="relative z-10 max-w-[72%] sm:max-w-[58%]">
            <span className="mb-2 inline-block rounded-full bg-[#2563EB] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">New</span>
            <h2 className="text-lg font-bold text-[#1A1A1A] sm:text-xl md:text-2xl">AI Astrologer</h2>
            <p className="mt-1.5 text-xs text-[#555] sm:mt-2 sm:text-sm">Get instant answers powered by advanced astrology AI.</p>
            <Link href="/chat-to-astrologers" className="mt-3 inline-block cursor-pointer rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm">
              Ask AI Now
            </Link>
          </div>
          <Image src="/images/Personal.svg" alt="" width={150} height={150} className="absolute bottom-0 right-0 h-28 w-28 object-contain sm:h-36 sm:w-36 md:h-40 md:w-40" />
        </div>
        <div className="relative flex min-h-[180px] flex-col justify-center overflow-hidden rounded-2xl p-4 shadow-sm sm:min-h-[210px] sm:p-6 md:min-h-[230px]" style={{ background: "linear-gradient(135deg, #FFF0F3 0%, #FFE4EC 100%)" }}>
          <div className="relative z-10 max-w-[72%] sm:max-w-[58%]">
            <h2 className="text-lg font-bold text-[#1A1A1A] sm:text-xl md:text-2xl">Kundli Matching for Marriage</h2>
            <p className="mt-1.5 text-xs text-[#555] sm:mt-2 sm:text-sm">Find the perfect match with accurate Kundli Matching.</p>
            <Link href="/kundali-matching" className="mt-3 inline-block cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-white hover:opacity-90 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm" style={{ backgroundColor: ORANGE }}>
              Match Now
            </Link>
          </div>
          <Image src="/images/Rituals.svg" alt="" width={150} height={150} className="absolute bottom-0 right-0 h-28 w-28 object-contain sm:h-36 sm:w-36 md:h-40 md:w-40" />
        </div>
      </div>
    </section>
  );
}
