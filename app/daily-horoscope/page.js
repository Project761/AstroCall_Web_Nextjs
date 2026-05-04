"use client";
import React, { useState } from "react";
import { GiStarsStack } from "react-icons/gi";
import SEO from "../components/SEO/page.js";
import Link from "next/link";
import "./styles.css";
// Simple Loading Indicator component (replacement for OrbitProgress)
const LoadingIndicator = ({ color = "#F97316", size = "medium" }) => {
  const sizeClass = size === "small" ? "w-4 h-4" : size === "large" ? "w-8 h-8" : "w-6 h-6";
  return (<div className="flex justify-center items-center">
    <div className={`${sizeClass} border-2 border-gray-200 border-t-${color} rounded-full animate-spin`} style={{ borderTopColor: color }}></div>
  </div>);
};
const DailyHoroscope = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const Horoscopeimages = [
    {
      name: "Aries",
      img: "/horoimg/aries.png",
      description: "Aries, today you are full of energy and determination. New opportunities may come your way, pushing you to take bold steps. Your leadership qualities will inspire others, but avoid making hasty choices. Focus on balance to make the most of this powerful day.",
    },
    {
      name: "Taurus",
      img: "/horoimg/taurus.png",
      description: "Taurus, patience and persistence are your strongest allies today. Financial gains and stability seem favorable if you stay grounded. Comfort and security will bring you peace, while practical decisions help you move forward. Focus on long-term success instead of quick rewards.",
    },
    {
      name: "Aquarius",
      img: "/horoimg/aquarius.png",
      description: "Aquarius, your innovative and independent side shines today. Creative thinking can open unexpected doors, and your ideas may gain recognition. Friends and social connections bring positive vibes. Trust your originality—it will help you stand out and move ahead.",
    },
    {
      name: "Cancer",
      img: "/horoimg/cancer.png",
      description: "Cancer, emotions guide your path today, and your intuition is stronger than ever. Loved ones may seek your care and support, so nurture your close relationships. A calm approach will bring balance. Trust your heart to lead you in the right direction.",
    },
    {
      name: "Capricorn",
      img: "/horoimg/capricorn.png",
      description: "Capricorn, your ambition and hard work will pay off today. Long-term goals require your focus and dedication, but steady progress is assured. Discipline will help you stay ahead of challenges. Remember to balance responsibilities with moments of relaxation.",
    },
    {
      name: "Gemini",
      img: "/horoimg/gemini.png",
      description: "Gemini, curiosity and communication define your day. You may find yourself in deep conversations or learning something new. Flexibility will help you adapt to sudden changes. Keep an open mind, and exciting opportunities may come your way.",
    },
    {
      name: "Leo",
      img: "/horoimg/leo.png",
      description: "Leo, your confidence and creativity are at their peak today. It's a perfect time to take charge and showcase your talents. People will be drawn to your charm and leadership. Express yourself boldly, but stay humble to win lasting admiration.",
    },
    {
      name: "Libra",
      img: "/horoimg/libra.png",
      description: "Libra, harmony and balance guide your path today. Relationships may need your attention, so focus on open communication. Cooperation will help resolve conflicts peacefully. By staying fair and diplomatic, you can achieve stability in both work and personal life.",
    },
    {
      name: "Pisces",
      img: "/horoimg/pisces.png",
      description: "Pisces, your imagination and sensitivity are powerful today. Creative projects will bring joy and satisfaction. Compassion will help you connect deeply with others. Trust your intuition—it can guide you towards emotional clarity and inner peace.",
    },
    {
      name: "Sagittarius",
      img: "/horoimg/sagittarius.png",
      description: "Sagittarius, adventure and learning are highlighted today. Your positive energy will attract new opportunities for growth. It's a good time to explore ideas, travel, or start something new. Stay optimistic, and success will follow your enthusiasm.",
    },
    {
      name: "Scorpio",
      img: "/horoimg/scorpio.png",
      description: "Scorpio, passion and determination push you forward today. Emotional depth may bring transformation in personal or professional areas. Challenges will test your strength, but your focus and intensity can help you achieve success. Trust your inner power.",
    },
    {
      name: "Virgo",
      img: "/horoimg/virgo.png",
      description: "Virgo, practicality and attention to detail make this a productive day. Organizing your plans will bring clarity and progress. Focus on health and self-care, as they are equally important. With patience and persistence, long-term goals can be achieved.",
    },
  ];
  return (<>
    <SEO title="Today's Horoscope – Daily Astrology Predictions" description="Read your free daily horoscope on AstroCall. Get accurate astrology-based guidance for love, career, health and money for all 12 zodiac signs." canonical="https://astrocall.live/daily-horoscope" type="WebPage" schema={{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "name": "Daily Horoscope for All Zodiac Signs | AstroCall",
          "url": "https://astrocall.live/daily-horoscope",
          "description": "Read your free daily horoscope for all 12 zodiac signs on AstroCall. Get today's astrological predictions for Aries, Taurus, Gemini, Cancer & more.",
          "inLanguage": "en-IN",
          "isPartOf": { "@id": "https://astrocall.live/#website" },
          "dateModified": "2026-03-18"
        },
        {
          "@type": "ItemList",
          "name": "Daily Horoscope — All Zodiac Signs",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Aries Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#aries" },
            { "@type": "ListItem", "position": 2, "name": "Taurus Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#taurus" },
            { "@type": "ListItem", "position": 3, "name": "Gemini Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#gemini" },
            { "@type": "ListItem", "position": 4, "name": "Cancer Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#cancer" },
            { "@type": "ListItem", "position": 5, "name": "Leo Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#leo" },
            { "@type": "ListItem", "position": 6, "name": "Virgo Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#virgo" },
            { "@type": "ListItem", "position": 7, "name": "Libra Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#libra" },
            { "@type": "ListItem", "position": 8, "name": "Scorpio Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#scorpio" },
            { "@type": "ListItem", "position": 9, "name": "Sagittarius Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#sagittarius" },
            { "@type": "ListItem", "position": 10, "name": "Capricorn Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#capricorn" },
            { "@type": "ListItem", "position": 11, "name": "Aquarius Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#aquarius" },
            { "@type": "ListItem", "position": 12, "name": "Pisces Daily Horoscope", "url": "https://astrocall.live/daily-horoscope#pisces" }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://astrocall.live/" },
            { "@type": "ListItem", "position": 2, "name": "Daily Horoscope", "item": "https://astrocall.live/daily-horoscope" }
          ]
        }
      ]
    }} />
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen">
      <div className="main-container">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 mt-[4.500rem] rounded-2xl w-full text-white text-center py-8 px-4 shadow-xl">
          <div className="flex flex-col items-center justify-center">
            {/* Animated stars background */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-4 left-4 text-white/20 text-2xl animate-pulse">✦</div>
              <div className="absolute top-8 right-8 text-white/20 text-xl animate-pulse delay-100">✦</div>
              <div className="absolute bottom-6 left-12 text-white/20 text-lg animate-pulse delay-200">✦</div>
              <div className="absolute bottom-4 right-16 text-white/20 text-2xl animate-pulse delay-300">✦</div>
            </div>

            {/* Heading */}
            <div className="flex items-center gap-3 relative z-10">
              <GiStarsStack className="text-white text-4xl animate-spin-slow" />
              <h1 className="text-2xl sm:text-3xl font-extrabold">Daily Horoscope Online – Check Your Zodiac Predictions</h1>
            </div>
            <h2 className="text-xl sm:text-2xl font-[550] mt-3">Daily, Weekly & Monthly Horoscope</h2>

            {/* Subtext */}
            <div className="mt-4 max-w-2xl">
              <p className="text-sm sm:text-base leading-relaxed text-white/90">
                Get your astrology-based guidance for the day. Choose your zodiac sign to
                see love, career, and health insights—all tailored to today.
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-2 mt-6">
              <div className="w-8 h-[2px] bg-white/60"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-8 h-[2px] bg-white/60"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Choose Your Zodiac Sign</h2>
          <p className="text-gray-600">Click on your sign to get detailed daily predictions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Horoscopeimages?.map((item) => (<Link href={`/daily-horoscope/${item.name.toLowerCase()}`} key={item.name} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-orange-300 transition-all duration-300 p-6 transform hover:-translate-y-1" onMouseEnter={() => setHoveredCard(item.name)} onMouseLeave={() => setHoveredCard(null)}>
            {/* Hover effect overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-2xl transition-opacity duration-300 ${hoveredCard === item.name ? 'opacity-100' : 'opacity-0'}`}></div>

            {/* Card content */}
            <div className="relative z-10">
              {/* Image container */}
              <div className="w-[80px] h-[80px] mx-auto mb-4 rounded-full overflow-hidden border-3 border-orange-200 group-hover:border-orange-400 transition-colors duration-300 shadow-md">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" width="80" height="80" loading="lazy" decoding="async" onError={(e) => {
                  e.target.src = "/horoimg/aries.png";
                }} />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-xs text-orange-500 font-semibold mb-3">Yearly Horoscope</p>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                  {item.description || "No description available"}
                </p>

                {/* Read more indicator */}
                <div className="flex items-center justify-center gap-1 mt-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Read More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>))}
        </div>
      </div>

      {/* {FAQData && FAQData?.length > 0 && (
          <div className="main-container mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                {FAQData?.map((faq, index) => (
                  <div key={index} className="border-b pb-4">
                    <p
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq?.HoroscopeDetailsHTML) }}
                    ></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
    </div>


  </>);
};
export default DailyHoroscope;
