"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Images
// import kundliImg from "@/assets/images/kundli.webp";
// 
// import kundliMatchingImg from "@/assets/images/kundli-matching.webp";

const cardData = [
  {
    id: 1,
    link: "/love-calculator",
    // imgSrc: kundliImg,
    title: "Love Calculator",
    description:
      "Check your love compatibility and discover your relationship strength with accurate astrology insights.",
  },
  {
    id: 2,
    link: "/muhurat",
    // imgSrc: kundliImg,
    title: "Shubh Muhurat 2025",
    description:
      "Find the most auspicious timings for marriage, business, and important life events.",
  },
  {
    id: 3,
    link: "/upcoming-festival",
    // imgSrc: festivalImg,
    title: "Upcoming Festivals",
    description:
      "Stay updated with upcoming Hindu festivals and their significance.",
  },
  {
    id: 4,
    link: "/freekundli",
    // imgSrc: kundliImg,
    title: "Free Kundli",
    description:
      "Generate your kundli instantly and explore your birth chart in detail.",
  },
  {
    id: 5,
    link: "/kundali-matching",
    // imgSrc: kundliMatchingImg,
    title: "Kundli Matching",
    description:
      "Check marriage compatibility and relationship predictions easily.",
  },
  {
    id: 6,
    link: "/vrat-and-upvaas/purnima-vrat",
    // imgSrc: kundliMatchingImg,
    title: "Vrat & Upvaas",
    description:
      "Know fasting dates, rituals, and spiritual benefits.",
  },
];

export default function CommonAstrologicalServices() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Responsive cards
  const getCardsToShow = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    <>
      {/* ✅ SEO */}
      <Head>
        <title>Astrological Services - AstroCall</title>
        <meta
          name="description"
          content="Explore astrology tools like Kundli, Love Calculator, Muhurat, Festivals and more."
        />
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-12 text-center relative">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Common Astrological Services
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>

        {/* Carousel */}
        <div className="flex items-center mt-10 gap-4">

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="hidden lg:flex items-center justify-center w-10 h-10 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronLeft />
          </button>

          {/* Cards */}
          <div className="flex gap-6 w-full">
            {visibleCards.map((card) => (
              <div
                key={card.id}
                className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Link href={card.link}>
                  <div className="cursor-pointer">

                    {/* Image */}
                    <div className="bg-orange-50 py-6 rounded-t-2xl flex justify-center">
                      <div className="w-24 h-24 relative">
                        <Image
                          src="/images/kundli.webp"
                          alt={card.title}
                          fill
                          sizes="(max-width: 1024px) 96px, 96px"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-orange-500">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-3">
                        {card.description}
                      </p>
                    </div>

                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="hidden lg:flex items-center justify-center w-10 h-10 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Dots (Mobile) */}
        <div className="flex justify-center mt-6 lg:hidden">
          {Array.from({ length: totalCards }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`mx-1 w-3 h-3 rounded-full ${
                i === currentIndex ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}