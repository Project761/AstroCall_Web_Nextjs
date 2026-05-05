"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const HomeFAQ = () => {
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
    <section className="bg-orange-50 py-16 mt-16 px-4">
      <div className="max-w-4xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-orange-500 mb-2">
          Frequently Asked Questions
        </h2>

        <p className="text-gray-600 mb-10">
          Find answers to common questions about astrology and our services
        </p>

        {/* FAQ List */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg"
            >
              {/* Question */}
              <div
                className="flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {faq.question}
                </h3>

                <div className="text-gray-500 bg-orange-100 rounded-full p-2 transition hover:bg-orange-200">
                  <span className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                    {openIndex === index ? <FaMinus /> : <FaPlus />}
                  </span>
                </div>
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                  }`}
              >
                <p className="text-sm text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeFAQ;