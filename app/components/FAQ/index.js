"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const HomeFAQ = ({ variant = "default" }) => {
  const isHomeV2 = variant === "home-v2";
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate are astrological predictions?",
      answer:
        "Astrological predictions are based on celestial patterns and can offer valuable insights, but outcomes may vary depending on interpretation and individual circumstances.",
    },
    {
      question: "What information do I need to provide for a kundli?",
      answer:
        "You typically need your full birth date, exact birth time, and place of birth to generate an accurate kundli.",
    },
    {
      question: "How does zodiac sign compatibility work?",
      answer:
        "Compatibility is analyzed based on planetary positions, elements (fire, water, etc.), and emotional alignment between zodiac signs.",
    },
    {
      question: "What is the difference between Vedic and Western astrology?",
      answer:
        "Vedic astrology (Jyotish) is sidereal and includes lunar constellations, while Western astrology is tropical and solar-based.",
    },
    {
      question: "How often should I consult an astrologer?",
      answer:
        "Consulting during major life decisions or transitions is common—monthly or yearly reviews are also helpful for guidance.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-14 bg-white">
      <div className="main-container px-4 max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#F16322]">
            FAQs
          </span>

          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-gray-500">
            Everything you need to know about astrology consultations.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300
            ${openIndex === index
                  ? "border-[#F16322] shadow-lg"
                  : "border-orange-100 hover:shadow-md"
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full cursor-pointer items-center justify-between p-5 text-left"
              >
                <h3 className="pr-4 text-base md:text-lg font-semibold text-[#1A1A1A]">
                  {faq.question}
                </h3>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${openIndex === index
                      ? "bg-[#F16322] text-white"
                      : "bg-orange-50 text-[#F16322]"
                    }`}
                >
                  {openIndex === index ? (
                    <FaMinus size={14} />
                  ) : (
                    <FaPlus size={14} />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                  }`}
              >
                <div className="border-t border-orange-100 px-5 py-4">
                  <p className="leading-7 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeFAQ;

