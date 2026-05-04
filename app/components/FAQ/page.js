"use client";

import { useState } from "react";

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate are the predictions?",
      answer: "Our astrologers provide highly accurate predictions based on Vedic astrology principles and years of experience."
    },
    {
      question: "How do I book a consultation?",
      answer: "You can book a consultation by selecting an astrologer and choosing a suitable time slot. Payment can be made online."
    },
    {
      question: "Is my information kept confidential?",
      answer: "Yes, all your personal information and consultation details are kept completely confidential."
    },
    {
      question: "What if I'm not satisfied with the consultation?",
      answer: "We offer a satisfaction guarantee. If you're not satisfied, we can arrange another consultation or provide a refund."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-lg transition-shadow"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-orange-500 text-[22px]">{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="bg-white rounded-b-lg shadow p-4 border-t">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
