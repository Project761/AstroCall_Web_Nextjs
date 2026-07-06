"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const cardData = [
  {
    id: 1,
    link: "/love-calculator",
    title: "Love Calculator",
    description:
      "Check your love compatibility and discover your relationship strength with accurate astrology insights.",
  },
  {
    id: 2,
    link: "/Muhurat",
    title: "Shubh Muhurat 2025",
    description:
      "Find the most auspicious timings for marriage, business, and important life events.",
  },
  {
    id: 3,
    link: "/Upcomingfestival",
    title: "Upcoming Festivals",
    description:
      "Stay updated with upcoming Hindu festivals and their significance.",
  },
  {
    id: 4,
    link: "/freekundli",
    title: "Free Kundli",
    description:
      "Generate your kundli instantly and explore your birth chart in detail.",
  },
  {
    id: 5,
    link: "/kundali-matching",
    title: "Kundli Matching",
    description:
      "Check marriage compatibility and relationship predictions easily.",
  },
  {
    id: 6,
    link: "/VratUpvaas",
    title: "Vrat & Upvaas",
    description:
      "Know fasting dates, rituals, and spiritual benefits.",
  },
];

export default function CommonAstrologicalServices() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  const getCardsToShow = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalCards = cardData.length;

  const visibleCards = Array.from({ length: cardsToShow }).map((_, i) => {
    const index = (currentIndex + i) % totalCards;
    return cardData[index];
  });

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalCards - 1 : prev - 1
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600">
          Astrology Services
        </span>

        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-800">
          Explore Our Popular Services
        </h2>

        <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
          Get accurate astrology insights, kundli analysis, compatibility
          reports, auspicious timings, festival details and much more.
        </p>

        <div className="w-24 h-1 bg-orange-500 rounded-full mx-auto mt-5"></div>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="hidden lg:flex w-12 h-12 cursor-pointer items-center justify-center rounded-full bg-white border border-orange-100 shadow-lg text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
        >
          <FaChevronLeft />
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {visibleCards.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              prefetch={true}
              className="group cursor-pointer"
            >
              <div className="h-full overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_rgba(255,102,0,0.15)] hover:-translate-y-2 transition-all duration-300">
                {/* Top Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 py-8">
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-orange-200/30"></div>
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-amber-200/30"></div>

                  <div className="relative z-10 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                      <div className="relative w-12 h-12">
                        <Image
                          src="/images/kundli.webp"
                          alt={card.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-orange-500 transition">
                    {card.title}
                  </h3>

                  <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mt-3"></div>

                  <p className="mt-4 text-sm leading-6 text-slate-600 line-clamp-3 min-h-[72px]">
                    {card.description}
                  </p>

                  <div className="mt-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-5 py-2.5 text-sm font-semibold text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      Explore Service
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="hidden lg:flex w-12 h-12 cursor-pointer items-center justify-center rounded-full bg-white border border-orange-100 shadow-lg text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Mobile Dots */}
      <div className="flex justify-center gap-2 mt-8 lg:hidden">
        {Array.from({ length: totalCards }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-8 bg-orange-500"
                : "w-2.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}