"use client";

import Link from "next/link";
import Image from "next/image";
import { IoMdChatboxes } from "react-icons/io";
import { MdPhoneInTalk } from "react-icons/md";
import { ImCalculator } from "react-icons/im";

const iconItems = [
  {
    title: "Talk to Astrologers",
    href: "/talk-to-astrologers",
    icon: <MdPhoneInTalk className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl" />,
  },
  {
    title: "Chat with Astrologers",
    href: "/chat-to-astrologers",
    icon: <IoMdChatboxes className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl" />,
  },
  {
    title: "Love Calculator",
    href: "/love-calculator",
    icon: <ImCalculator className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl" />,
  },
  {
    title: "Free Kundali",
    href: "/freekundli",
    image: "/images/iconbar-2.webp",
  },
  {
    title: "Kundali Matching",
    href: "/kundali-matching",
    image: "/images/iconbar-2.webp",
  },
  {
    title: "Daily Horoscope",
    href: "/daily-horoscope",
    image: "/images/iconbar-4.webp",
  },
  {
    title: "Gemstone",
    href: "/gemstone",
    image: "/images/iconbar-3.webp",
  },
  {
    title: "Online Puja",
    href: "/online-puja",
    image: "/images/iconbar-5.webp",
  },
  {
    title: "Astrology Blog",
    href: "/astrology-blog",
    image: "/images/iconbar-7.webp",
  },
];
 
export default function IconsBar() {
  return (
    <div className="main-container cards-bar flex flex-nowrap overflow-x-auto lg:overflow-x-hidden overflow-y-hidden items-center lg:justify-around justify-start gap-3 sm:gap-4 lg:gap-5 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 scrollbar-hide">
      {iconItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex-shrink-0 lg:flex-shrink"
        >
          <div className="flex flex-col items-center min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-0">
            <div className="group bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center border-2 border-orange-500 shadow-sm hover:shadow-md transition-all duration-300">
              {item.icon ? (
                item.icon
              ) : (
                <Image
                  src={item.image}
                  width={40}
                  height={40}
                  alt={item.title}
                  className="w-[55%] sm:w-[50%] group-hover:w-[65%] sm:group-hover:w-[60%] aspect-square object-contain duration-300"
                />
              )}
            </div>

            <p className="text-center mt-2 text-xs sm:text-sm font-medium text-subtitle whitespace-nowrap px-1">
              {item.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}