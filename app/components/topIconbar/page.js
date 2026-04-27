'use client';
import { IoMdChatboxes } from "react-icons/io";
import { MdPhoneInTalk } from "react-icons/md";
import { ImCalculator } from "react-icons/im";
import Link from "next/link";
export default function IconsBar() {

  return (
    <div className="main-container cards-bar flex flex-nowrap overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:items-center items-center lg:justify-around justify-start gap-3 sm:gap-4 lg:gap-5 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>

      {/* Talk to Astrologers */}
      <Link href="/talk-to-astrologers" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <MdPhoneInTalk className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl transition-colors duration-300" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Talk to Astrologers
          </p>
        </div>
      </Link >

      {/* Chat with Astrologers */}
      <Link href="/chat-to-astrologers" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[90px] sm:min-w-[100px] md:min-w-[110px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <IoMdChatboxes className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl transition-colors duration-300" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Chat with Astrologers
          </p>
        </div>
      </Link >

      <Link href="/love-calculator" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* <img src={icon8} className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Love Calculator" /> */}
            <ImCalculator className="text-orange-500 text-2xl sm:text-3xl lg:text-2xl transition-colors duration-300" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Love Calculator
          </p>
        </div>
      </Link>

      {/* <!-- Card 2 --> */}
      <Link href="/freekundli" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-2.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Free Kundali" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Free Kundali
          </p>
        </div>
      </Link>


      {/* <!-- Card 3 --> */}
      <Link href="/kundali-matching" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-2.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Kundali Matching" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold whitespace-nowrap px-1">
            Kundali Matching
          </p>
        </div>
      </Link>

      {/* <!-- Card 4 --> */}
      <Link href="/daily-horoscope" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-4.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Daily Horoscope" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Daily Horoscope
          </p>
        </div>
      </Link>

      {/* <!-- Card 5 --> */}
      <Link href="/gemstone" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-3.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Gemstone" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Gemstone
          </p>
        </div>
      </Link>


      {/* <!-- Card 6 --> */}
      <Link href="/online-puja" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-5.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Online Puja" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
            Online Puja
          </p>
        </div>
      </Link>
         <Link href="/astrology-blog" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[75px] sm:min-w-[80px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-7.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Online Puja" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1">
             Astrology Blog
          </p>
        </div>
      </Link>
      {/* <Link href="/astrology-blog" className="flex-shrink-0 lg:flex-shrink">
        <div className="flex flex-col items-center min-w-[85px] sm:min-w-[90px] lg:min-w-0">
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src="/images/iconbar-7.webp" className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Online Puja" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-xs font-semibold text-subtitle px-1 whitespace-nowrap">
            Astrology Blog
          </p>
        </div>
      </Link> */}

      {/* <!-- Card 7 --> */}
      {/* <Link to="/Blog" className="flex-shrink-0" style={{ flexShrink: 0, minWidth: '140px' }}>
        <div className="flex flex-col items-center w-full" style={{ minWidth: '140px', width: '100%', flexShrink: 0 }}>
          <div className="card3 bg-white rounded-full w-[65px] h-[65px] sm:w-[70px] sm:h-[70px] lg:w-[60px] lg:h-[60px] flex justify-center items-center icon_bar border-2 border-orange-500 shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src={icon7} className="w-[55%] sm:w-[50%] hover:w-[65%] sm:hover:w-[60%] aspect-[1/1] object-contain duration-300" alt="Blog" />
          </div>
          <p className="text-center text-black mt-2 text-xs sm:text-sm font-semibold text-subtitle whitespace-nowrap px-1 w-full" style={{ overflow: 'visible', textOverflow: 'clip', wordBreak: 'keep-all' }}>
            Astrology Blog
          </p>
        </div>
      </Link> */}
    </div>


  );
};
