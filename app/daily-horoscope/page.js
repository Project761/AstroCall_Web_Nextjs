"use client";
import React, { useState } from "react";
import { GiStarsStack } from "react-icons/gi";
import SEO from "../components/SEO/page.js";
import Link from "next/link";
import Image from "next/image";
import "./styles.css";

const DailyHoroscope = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const Horoscopeimages = [
    { name: "Aries", img: "/horoimg/aries.png", description: "Aries, today you are full of energy and determination..." },
    { name: "Taurus", img: "/horoimg/taurus.png", description: "Taurus, patience and persistence are your strongest allies today..." },
    { name: "Aquarius", img: "/horoimg/aquarius.png", description: "Aquarius, your innovative side shines today..." },
    { name: "Cancer", img: "/horoimg/cancer.png", description: "Cancer, emotions guide your path today..." },
    { name: "Capricorn", img: "/horoimg/capricorn.png", description: "Capricorn, your ambition will pay off today..." },
    { name: "Gemini", img: "/horoimg/gemini.png", description: "Gemini, curiosity defines your day..." },
    { name: "Leo", img: "/horoimg/leo.png", description: "Leo, your confidence is at its peak..." },
    { name: "Libra", img: "/horoimg/libra.png", description: "Libra, harmony and balance guide your path..." },
    { name: "Pisces", img: "/horoimg/pisces.png", description: "Pisces, imagination and sensitivity are powerful today..." },
    { name: "Sagittarius", img: "/horoimg/sagittarius.png", description: "Sagittarius, adventure and learning are highlighted..." },
    { name: "Scorpio", img: "/horoimg/scorpio.png", description: "Scorpio, passion and determination push you forward..." },
    { name: "Virgo", img: "/horoimg/virgo.png", description: "Virgo, practicality makes this a productive day..." },
  ];

  return (
    <>
      <SEO
        title="Today's Horoscope – Daily Astrology Predictions"
        description="Read your free daily horoscope on AstroCall."
        canonical="https://astrocall.live/daily-horoscope"
      />

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen">

        {/* 🔥 HERO SECTION */}
        <div className="main-container">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 mt-[4.5rem] rounded-2xl w-full text-white text-center py-8 px-4 shadow-xl">

            <div className="flex flex-col items-center justify-center">



              {/* Heading */}
              <div className="flex items-center gap-3">
                <GiStarsStack className="text-4xl animate-spin-slow" />
                <h1 className="text-2xl sm:text-3xl font-extrabold">
                  Daily Horoscope Online – Check Your Zodiac Predictions
                </h1>
              </div>

              <h2 className="text-xl sm:text-2xl mt-3">
                Daily, Weekly & Monthly Horoscope
              </h2>

              <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/90">
                Get astrology-based guidance for your day. Choose your zodiac sign
                to see love, career, and health insights.
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 mt-6">
                <div className="w-8 h-[2px] bg-white/60"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-8 h-[2px] bg-white/60"></div>
              </div>

            </div>
          </div>
        </div>

        {/* 🔥 GRID SECTION */}
        <div className="main-container px-4 py-8">

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Choose Your Zodiac Sign
            </h2>
            <p className="text-gray-600">
              Click on your sign to get predictions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Horoscopeimages.map((item) => (
              <Link
                href={`/daily-horoscope/${item.name.toLowerCase()}`}
                key={item.name}
                className="group bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:border-orange-300 transition-all duration-300 p-5 flex items-start gap-5"
              >
                {/* Image */}
                <div className="w-[85px] h-[85px] shrink-0 rounded-full overflow-hidden border border-gray-200 bg-orange-50 relative">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="85px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-black mb-2 group-hover:text-orange-600 transition-colors">
                    {item.name} Yearly Horoscope
                  </h3>

                  <p className="text-[#14213d] text-sm sm:text-base leading-7 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default DailyHoroscope;