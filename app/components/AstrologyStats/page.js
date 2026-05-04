"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaHeart, FaGem, FaPhoneAlt, FaComments } from "react-icons/fa";
import { GiSun, GiBookCover, GiCrystalBall } from "react-icons/gi";
import { MdStars, MdOutlineHomeWork } from "react-icons/md";
import { RiNumbersFill } from "react-icons/ri";
import { TbCards } from "react-icons/tb";

export default function AstrologyStats() {
  const router = useRouter();

  const stats = [
    { value: "50K+", label: "Happy Clients" },
    { value: "100+", label: "Expert Astrologers" },
    { value: "1M+", label: "Consultations Done" },
    { value: "24/7", label: "Support Available" },
  ];

  const services = [
    {
      title: "Free Kundali Analysis",
      desc: "Complete birth chart reading with planetary positions and life predictions",
    },
    {
      title: "Marriage Compatibility",
      desc: "Scientific Kundali matching using traditional Ashtakoot system",
    },
    {
      title: "Live Consultations",
      desc: "Connect with expert astrologers via phone or chat",
    },
    {
      title: "Personalized Remedies",
      desc: "Custom gemstone recommendations and rituals",
    },
    {
      title: "Daily Predictions",
      desc: "Accurate horoscope forecasts tailored to your zodiac",
    },
  ];

  const astrologyServices = [
    {
      icon: <FaCalendarAlt />,
      title: "Today's Panchang",
      desc: "Daily Panchang with Tithi, Nakshatra, Yoga",
      path: "/today-panchang",
    },
    {
      icon: <MdStars />,
      title: "Free Kundali",
      desc: "Complete birth chart analysis",
      path: "/freekundli",
    },
    {
      icon: <FaHeart />,
      title: "Kundali Matching",
      desc: "Marriage compatibility analysis",
      path: "/kundali-matching",
    },
    {
      icon: <GiSun />,
      title: "Daily Horoscope",
      desc: "Personalized zodiac predictions",
      path: "/daily-horoscope",
    },
    {
      icon: <FaGem />,
      title: "Gemstone",
      desc: "Gemstone recommendations",
      path: "/gemstone-to-astrologers",
    },
    {
      icon: <GiBookCover />,
      title: "Online Puja",
      desc: "Book Vedic rituals online",
      path: "/online-puja",
    },
    {
      icon: <GiCrystalBall />,
      title: "Astrology Blog",
      desc: "Read astrology articles",
      path: "/astrology-blog",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Talk to Astrologer",
      desc: "Call astrologers instantly",
      path: "/talk-to-astrologers",
    },
    {
      icon: <FaComments />,
      title: "Chat with Astrologer",
      desc: "Chat with experts",
      path: "/chat-to-astrologers",
    },
    {
      icon: <RiNumbersFill />,
      title: "Numerology",
      desc: "Numerology insights",
      path: "/numerology-services",
    },
    {
      icon: <TbCards />,
      title: "Tarot Reading",
      desc: "Tarot guidance",
      path: "/tarot-reading-services",
    },
    {
      icon: <MdOutlineHomeWork />,
      title: "Vastu",
      desc: "Vastu consultation",
      path: "/vedic-astrology-services",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      feedback:
        "AstroCall services are accurate and helpful. Kundli and gemstone suggestions improved my life.",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 py-12">

      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600">
          Explore Our Astrology Services
        </h2>
        <p className="text-gray-600 mt-4">
          Discover powerful astrology solutions for love, career, and life guidance.
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-xl p-6 text-center"
          >
            <h3 className="text-xl font-bold text-orange-500">{item.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{item.label}</p>
          </div>
        ))} 
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-orange-600 mb-4">
          Professional Astrology Services
        </h3>

        <p className="text-gray-700 mb-4">
          We provide expert astrology consultation using Vedic knowledge and modern tools.
        </p>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {services.map((item, i) => (
            <li key={i}>
              <span className="font-semibold text-orange-500">
                {item.title}:
              </span>{" "}
              {item.desc}
            </li>
          ))}
        </ul>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {astrologyServices.map((service, i) => (
          <div
            key={i}
            onClick={() => router.push(service.path)}
            className="cursor-pointer bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition hover:border-orange-500 border"
          >
            <div className="w-14 h-14 flex items-center justify-center mx-auto rounded-full bg-orange-500 text-white mb-4 text-xl">
              {service.icon}
            </div>

            <h3 className="font-semibold text-gray-800">
              {service.title}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {service.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto mt-12 px-4">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-6 border-l-4 border-orange-500"
          >
            <p className="italic text-gray-700">
              "{item.feedback}"
            </p>
            <p className="mt-3 text-orange-600 font-semibold">
              – {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}