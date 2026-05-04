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
    link: "/muhurat",
    title: "Shubh Muhurat 2025",
    description:
      "Find the most auspicious timings for marriage, business, and important life events.",
  },
  {
    id: 3,
    link: "/upcoming-festival",
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
    link: "/vrat-and-upvaas/purnima-vrat",
    title: "Vrat & Upvaas",
    description:
      "Know fasting dates, rituals, and spiritual benefits.",
  },
];



export default function CommonAstrologicalServices() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  function getCardsToShow() {
    if (window.innerWidth >= 1024) {
      return 3; // Show 3 cards on large screens
    } else if (window.innerWidth >= 768) {
      return 2; // Show 2 cards on medium screens
    } else {
      return 1; // Show 1 card on small screens
    }
  }

  // Update the number of visible cards on window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalCards = cardData.length;

  const getVisibleCards = () => {
    if (totalCards === 0) return [];
    const cards = [];
    for (let i = 0; i < cardsToShow; i++) {
      if (totalCards > i) {
        const index = (currentIndex + i) % totalCards;
        cards.push(cardData[index]);
      }
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  const handlePrevious = () => {
    if (totalCards > cardsToShow) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? totalCards - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (totalCards > cardsToShow) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
    }
  };


  return (
    <div className="main-container text-center flex flex-col justify-center my-4 m-auto items-center relative px-0">
      <h2 className="text-md lg:text-3xl font-[600]">
        {/* {t('commonAstrologicalServices')} */}
        Common Astrological Services
      </h2>
      <div className="w-[150px] h-[3px] m-auto rounded-full bg-primaryColor my-2 mb-10"></div>

      <div className="carousel2 flex justify-center mt-8 w-full">
        <div className="flex items-center w-full gap-5">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevious}
            className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition "
            disabled={totalCards <= cardsToShow}
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Carousel Cards */}
          <div className="flex justify-start items-center gap-6 w-full">
            {visibleCards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0"
                style={{
                  flexBasis: `calc((100% - ${(cardsToShow - 1) * 1.5}rem) / ${cardsToShow})`
                }}
              >
                <Link href={card.link}>
                  <div
                    className="sellerCard h-[330px] bg-[#ffffff] card_wirespon_comman card_wirespon_commane rounded-xl flex flex-col justify-start items-center"
                    style={{
                      boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                    }}
                  >
                    <div className="w-full flex items-center justify-center bg-[#FFF3E7] rounded-t-xl py-5">
                      <div className="img w-[90px] h-[90px] rounded-full orangeGradient p-1">
                        <Image
                          src="/images/kundli.webp" alt={card.title}
                          width={90} height={90}
                        />
                      </div>
                    </div>

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

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
            disabled={totalCards <= cardsToShow}
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>

      {totalCards > cardsToShow && (
        <div className="flex justify-center items-center mt-4 lg:hidden">
          {Array.from({ length: Math.ceil(totalCards / cardsToShow) }).map((_, dotIdx) => {
            const pageIndex = Math.floor(currentIndex / cardsToShow);
            const isActive = dotIdx === pageIndex;

            return (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx * cardsToShow)}
                className={`mx-1 w-3 h-3 rounded-full border border-orange-500 focus:outline-none transition-all duration-200 ${isActive ? "bg-orange-500" : "bg-white"}`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}