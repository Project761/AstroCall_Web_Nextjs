"use client";

import Link from "next/link";
import Image from "next/image";
import { MdPhoneInTalk } from "../Icons/MdPhoneInTalk";
import { IoMdChatboxes } from "../Icons/IoMdChatboxes";
import { ImCalculator } from "../Icons/ImCalculator";

export default function IconsBar() {
  // Simple translation function (in real app, you'd use react-i18next)
  const t = (key) => {
    const translations = {
      talkToAstrologers: "Talk to Astrologers",
      chatWithAstrologers: "Chat with Astrologers",
      freeKundali: "Free Kundali",
      kundaliMatching: "Kundali Matching",
      dailyHoroscope: "Daily Horoscope",
      gemstone: "Gemstone",
      onlinePuja: "Online Puja",
      astrologyBlog: "Astrology Blog"
    };
    return translations[key] || key;
  };

  return (
    <div className="main-container cards-bar flex flex-nowrap overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:items-center items-center lg:justify-around justify-start gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>

      {/* Talk to Astrologers */}
      <Link href="/talk-to-astrologers" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <MdPhoneInTalk className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl transition-colors duration-300" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("talkToAstrologers")}
          </p>
        </div>
      </Link>

      {/* Chat with Astrologers */}
      <Link href="/chat-to-astrologers" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <IoMdChatboxes className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl transition-colors duration-300" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("chatWithAstrologers")}
          </p>
        </div>
      </Link>

      {/* Love Calculator */}
      <Link href="/love-calculator" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <ImCalculator className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl transition-colors duration-300"/>
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Love Calculator
          </p>
        </div>
      </Link>

      {/* Free Kundali */}
      <Link href="/freekundli" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-2.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Free Kundali" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("freeKundali")}
          </p>
        </div>
      </Link>

      {/* Kundali Matching */}
      <Link href="/kundali-matching" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-2.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Kundali Matching" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold whitespace-nowrap px-1">
            {t("kundaliMatching")}
          </p>
        </div>
      </Link>

      {/* Daily Horoscope */}
      <Link href="/daily-horoscope" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-4.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Daily Horoscope" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("dailyHoroscope")}
          </p>
        </div>
      </Link>

      {/* Gemstone */}
      <Link href="/Gemstone-to-astrologers" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-3.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Gemstone" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("gemstone")}
          </p>
        </div>
      </Link>

      {/* Online Puja */}
      <Link href="/online-puja" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-5.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Online Puja" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("onlinePuja")}
          </p>
        </div>
      </Link>

      {/* Astrology Blog */}
      <Link href="/astrology-blog" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-7.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Astrology Blog" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            {t("astrologyBlog")}
          </p>
        </div>
      </Link>

    </div>
  );
}
