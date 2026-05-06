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
        <div className="w-37.5 h-0.75 m-auto rounded-full bg-orange-500 my-2 mb-10"></div>

        {/* Carousel */}
        <div className="flex items-center mt-10 gap-4">

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="hidden lg:block cursor-pointer bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Cards */}
          <div className="flex gap-6 w-full">
            {visibleCards.map((card) => (
              <div
                key={card.id}
                className="flex-1 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden sellerCard bg-[#f3f3f3]"
                tyle={{
                  boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                }}
              >
                <Link href={card.link}>
                  <div className="cursor-pointer text-center">

                    {/* 🔶 Top Section */}
                    <div className="w-full flex items-center justify-center bg-[#FFF3E7] rounded-t-xl py-5">
                      <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                        <div className="relative w-14 h-14">
                          <Image
                            src="/images/kundli.webp"
                            alt={card.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 🔶 Content */}
                    <div className="p-5">
                      <div className="text-primaryColor inline-block">
                        <h3 className="custom-heading text-lg font-semibold text-[#FF6600]">{card.title}</h3>
                        <div className="soft-glow-line mt-1"></div>
                      </div>

                      <div className="text text-sm text-justify mt-5">
                        <p>{card.description}</p>
                      </div>
                    </div>

                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="hidden lg:block cursor-pointer bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Dots (Mobile) */}
        <div className="flex justify-center mt-6 lg:hidden">
          {Array.from({ length: totalCards }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`mx-1 w-3 h-3 rounded-full ${i === currentIndex ? "bg-orange-500" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}