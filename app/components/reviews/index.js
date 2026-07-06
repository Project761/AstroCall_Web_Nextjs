"use client";

import React, { useEffect, useState } from "react";
import { postWithToken } from "../../utils/api.js";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";

const CustomersFeedback = () => {
  const [customerdata, setcustomerdata] = useState([]);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [visibleCardsCount, setVisibleCardsCount] = useState(4);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      try {
        const val = {
          IsActive: 1,
        };

        const res = await postWithToken(
          "CustomerStories/GetData_CustomerStories",
          val
        );

        if (res && !cancelled) {
          setcustomerdata(
            res.filter((data) => data?.Name)
          );
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const updateVisibleCardsCount = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;

        if (width < 640) {
          setVisibleCardsCount(1);
        } else if (width < 1024) {
          setVisibleCardsCount(2);
        } else if (width < 1280) {
          setVisibleCardsCount(3);
        } else {
          setVisibleCardsCount(4);
        }
      }
    };

    updateVisibleCardsCount();

    window.addEventListener("resize", updateVisibleCardsCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCardsCount);
    };
  }, []);

  const totalCards = customerdata.length;

  const handlePrevious = () => {
    setcurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, totalCards - visibleCardsCount)
        : prevIndex - 1
    );
  };

  const handleNext = () => {
    setcurrentIndex((prevIndex) =>
      prevIndex >= totalCards - visibleCardsCount
        ? 0
        : prevIndex + 1
    );
  };

  const visibleCards = customerdata.slice(
    currentIndex,
    currentIndex + visibleCardsCount
  );

  return (
    <section className="py-8 lg:py-12">
      <div className="main-container">
        {/* <div className="relative rounded-[36px]  bg-white px-5 py-10 lg:px-10 lg:py-14  overflow-hidden"> */}
        <div className="relative rounded-[30px] -100 bg-white px-4 py-6 lg:px-8 lg:py-8">

          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_60%)] pointer-events-none" />

          {/* Header */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="w-20 h-px bg-orange-200"></div>

                <span className="text-orange-500 text-xl">
                  ❝
                </span>

                <div className="w-10 h-10 rounded-full border border-orange-500 flex items-center justify-center text-orange-500">
                  🕉
                </div>

                <span className="text-orange-500 text-xl">
                  ❞
                </span>

                <div className="w-20 h-px bg-orange-200"></div>
              </div>

              {/* <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-slate-900"> */}
              <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold">
                Customer&apos;s{" "}
                <span className="text-orange-500">
                  Feedback
                </span>
              </h2>

              <p className="mt-4 text-slate-600 text-base lg:text-lg max-w-3xl mx-auto">
                Trusted by thousands of happy customers who found
                clarity, peace & positive changes in their lives.
              </p>
            </div>

            <button className="hidden lg:flex cursor-pointer items-center gap-2 border border-orange-500 text-orange-500 px-7 py-3 rounded-full font-medium hover:bg-orange-500 hover:text-white transition-all duration-300">
              View All Reviews
              <IoArrowForward />
            </button>
          </div>

          {/* Slider Section */}
          <div className="relative">
            {totalCards > visibleCardsCount && (
              <>
                <button
                  onClick={handlePrevious}
                  className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 cursor-pointer bg-white border border-orange-100 rounded-2xl items-center justify-center text-orange-500 shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <FaChevronLeft />
                </button>

                <button
                  onClick={handleNext}
                  className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 cursor-pointer bg-white border border-orange-100 rounded-2xl items-center justify-center text-orange-500 shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {visibleCards.map((item, index) => (
                <div
                  key={item.Id || index}
                  className="bg-white border border-orange-100 rounded-[28px] p-4 h-[288px] flex flex-col justify-between hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                >
                  <div>
                    {/* Quote */}
                    <RiDoubleQuotesL
                      size={52}
                      className="text-orange-200"
                    />

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className="text-orange-500 text-sm"
                        />
                      ))}

                      <span className="ml-2 text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full">
                        {item?.Stars || 4.8}
                      </span>
                    </div>

                    {/* Review */}
                    <p className="text-slate-700 text-[13px] leading-5">
                      {item?.Comments
                        ? item.Comments.split(" ").slice(0, 30).join(" ") +
                        (item.Comments.split(" ").length > 30 ? "..." : "")
                        : "Amazing experience! The astrologer was very knowledgeable and answered all my questions patiently."}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div>
                    <div className="border-t border-orange-100 my-2"></div>

                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item?.PhotoUrl
                            ? `https://${item.PhotoUrl.replace(
                              /\\/g,
                              "/"
                            )}`
                            : "/images/default-profile.webp"
                        }
                        alt={item?.Name}
                        className="w-11 h-11 rounded-full object-cover border border-orange-100"
                      />

                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg">
                          {item?.Name}
                        </h4>

                        <p className="text-slate-500 text-sm">
                          {item?.Designation ||
                            "Talk to Astrologer"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Dots */}
            {totalCards > visibleCardsCount && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({
                  length: Math.ceil(
                    totalCards / visibleCardsCount
                  ),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setcurrentIndex(
                        index * visibleCardsCount
                      )
                    }
                    className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${Math.floor(
                      currentIndex / visibleCardsCount
                    ) === index
                      ? "w-8 bg-orange-500"
                      : "w-2.5 bg-orange-200"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex justify-center mt-8 lg:hidden">
            <button className="flex cursor-pointer items-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-full font-medium hover:bg-orange-500 hover:text-white transition-all duration-300">
              View All Reviews
              <IoArrowForward />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomersFeedback;