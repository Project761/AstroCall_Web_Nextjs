"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postWithToken } from "../../utils/api.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { GiLotus } from "react-icons/gi";

const HomeOnlinepuja = () => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [pujadata, setPujadata] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

  function getCardsToShow() {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 5;
  }

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      try {
        const val = {
          IsActive: "1",
          IsHomePage: true,
        };

        const res = await postWithToken("Puja/GetData_Puja", val);

        if (res && !cancelled) {
          setPujadata(res.filter((item) => item?.PujaID));
        }
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePrev = () => {
    if (pujadata.length <= cardsToShow) return;

    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, pujadata.length - cardsToShow)
        : prev - 1
    );
  };

  const handleNext = () => {
    if (pujadata.length <= cardsToShow) return;

    setCurrentIndex((prev) =>
      prev >= pujadata.length - cardsToShow ? 0 : prev + 1
    );
  };

  const visibleCards = pujadata.slice(
    currentIndex,
    currentIndex + cardsToShow
  );

  return (
    <section className="main-container mx-auto px-4 py-10">
      <div className="rounded-[32px] p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-orange-500 text-xl">ॐ</span>

              <div className="w-12 h-[2px] bg-orange-300"></div>

              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">
                Online{" "}
                <span className="text-orange-500">
                  Puja
                </span>
              </h2>

              <div className="w-12 h-[2px] bg-orange-300"></div>

              <span className="text-orange-500 text-xl">ॐ</span>
            </div>

            <p className="text-slate-600 text-base lg:text-lg max-w-3xl mx-auto">
              Perform sacred rituals from the comfort of your home with
              authentic Vedic guidance.
            </p>
          </div>

          <button
            onClick={() => router.push("/online-puja")}
            className="hidden lg:flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full border border-orange-500 text-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            View All Puja
            <IoArrowForward size={18} />
          </button>
        </div>

        {/* Slider */}
        <div className="relative">
          {pujadata.length > cardsToShow && (
            <>
              <button
                onClick={handlePrev}
                className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 cursor-pointer bg-white border border-orange-200 rounded-full items-center justify-center text-orange-500 shadow-md hover:bg-orange-500 hover:text-white transition"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={handleNext}
                className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 cursor-pointer bg-white border border-orange-200 rounded-full items-center justify-center text-orange-500 shadow-md hover:bg-orange-500 hover:text-white transition"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {visibleCards.map((card, index) => (
              <div
                key={index}
                className="group bg-white border border-orange-100 rounded-[24px] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-[180px] overflow-hidden">
                  <img
                    src={
                      card?.PujaImage
                        ? `https://${card?.PujaImage.replace(/\\/g, "/")}`
                        : "/images/default-puja.webp"
                    }
                    alt={card?.PujaName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="relative p-4">
                  {/* Icon */}
                  <div className="-mt-10 mb-3">
                    <div className="w-14 h-14 rounded-full bg-orange-500 border-4 border-white flex items-center justify-center shadow-lg">
                      <GiLotus
                        size={24}
                        className="text-white"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                    {card?.PujaName}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-2 min-h-[48px]">
                    {card?.ShortDescription ||
                      "Perform sacred rituals with authentic Vedic guidance and divine blessings."}
                  </p>

                  {/* Price + Action */}
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <h4 className="text-orange-600 font-bold text-2xl">
                        ₹ {card?.Amt}
                      </h4>

                      <span className="text-orange-500 text-sm font-medium">
                        / Puja
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/online-puja?onlinePuja-to-astrologersOP=${card?.PujaID}`
                        )
                      }
                      className="w-11 h-11 cursor-pointer rounded-full border border-orange-200 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      <IoArrowForward size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Dots */}
          {pujadata.length > cardsToShow && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({
                length: Math.ceil(
                  pujadata.length / cardsToShow
                ),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentIndex(index * cardsToShow)
                  }
                  className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / cardsToShow) ===
                    index
                      ? "w-8 bg-orange-500"
                      : "w-2.5 bg-orange-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center lg:hidden">
          <button
            onClick={() => router.push("/online-puja")}
            className="flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full border border-orange-500 text-orange-500 font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            View All Puja
            <IoArrowForward size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeOnlinepuja;