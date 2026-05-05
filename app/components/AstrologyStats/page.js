"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaHeart,
  FaGem,
  FaPhoneAlt,
  FaComments,
} from "react-icons/fa";
import { MdStars, MdOutlineHomeWork } from "react-icons/md";
import { GiSun, GiBookCover, GiCrystalBall } from "react-icons/gi";
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

  // const astrologyServices = [
  //   {
  //     icon: <FaCalendarAlt />,
  //     title: "Today's Panchang",
  //     desc: "Daily Panchang with Tithi, Nakshatra, Yoga",
  //     path: "/today-panchang",
  //   },
  //   {
  //     icon: <MdStars />,
  //     title: "Free Kundali",
  //     desc: "Complete birth chart analysis",
  //     path: "/freekundli",
  //   },
  //   {
  //     icon: <FaHeart />,
  //     title: "Kundali Matching",
  //     desc: "Marriage compatibility analysis",
  //     path: "/kundali-matching",
  //   },
  //   {
  //     icon: <GiSun />,
  //     title: "Daily Horoscope",
  //     desc: "Personalized zodiac predictions",
  //     path: "/daily-horoscope",
  //   },
  //   {
  //     icon: <FaGem />,
  //     title: "Gemstone",
  //     desc: "Gemstone recommendations",
  //     path: "/gemstone-to-astrologers",
  //   },
  //   {
  //     icon: <GiBookCover />,
  //     title: "Online Puja",
  //     desc: "Book Vedic rituals online",
  //     path: "/online-puja",
  //   },
  //   {
  //     icon: <GiCrystalBall />,
  //     title: "Astrology Blog",
  //     desc: "Read astrology articles",
  //     path: "/astrology-blog",
  //   },
  //   {
  //     icon: <FaPhoneAlt />,
  //     title: "Talk to Astrologer",
  //     desc: "Call astrologers instantly",
  //     path: "/talk-to-astrologers",
  //   },
  //   {
  //     icon: <FaComments />,
  //     title: "Chat with Astrologer",
  //     desc: "Chat with experts",
  //     path: "/chat-to-astrologers",
  //   },
  //   {
  //     icon: <RiNumbersFill />,
  //     title: "Numerology",
  //     desc: "Numerology insights",
  //     path: "/numerology-services",
  //   },
  //   {
  //     icon: <TbCards />,
  //     title: "Tarot Reading",
  //     desc: "Tarot guidance",
  //     path: "/tarot-reading-services",
  //   },
  //   {
  //     icon: <MdOutlineHomeWork />,
  //     title: "Vastu",
  //     desc: "Vastu consultation",
  //     path: "/vedic-astrology-services",
  //   },
  // ];


  const astrologyServices = [
    {
      icon: <FaCalendarAlt className="w-6 h-6 text-white" />,
      title: "Today's Panchang",
      desc: "Get accurate daily Panchang with Tithi, Nakshatra, Yoga, and Karna for your daily guidance.",
      link: "Free Daily Updates",
      price: "",
      // to: "/today-panchang",
      // navigate: () => navigate("/today-panchang"),
      path: "/today-panchang",
    },
    {
      icon: <MdStars className="w-6 h-6 text-white" />,
      title: "Free Kundali Analysis",
      desc: "Complete birth chart analysis with planetary positions, doshas, and life predictions.",
      link: "Free Basic Reading",
      price: "",
      // to: "/FreeKundli",
      // navigate: () => navigate("/freekundli"),
      path: "/freekundli",
    },
    {
      icon: <FaHeart className="w-6 h-6 text-white" />,
      title: "Kundali Matching",
      desc: "Comprehensive marriage compatibility analysis using Ashtakoot system.",
      link: "",
      price: "Starting ₹250",
      // to: "/KundliMatchingDetails",
      // navigate: () => navigate("/kundali-matching"),
      path: "/kundali-matching",
    },
    {
      icon: <GiSun className="w-6 h-6 text-white" />,
      title: "Daily Horoscope",
      desc: "Personalized daily predictions for love, career, health, and more based on your zodiac sign.",
      link: "Free Daily Insights",
      price: "",
      // to: "/daily-horoscope",
      // navigate: () => navigate("/daily-horoscope"),
      path: "/daily-horoscope",
    },
    {
      icon: <FaGem className="w-6 h-6 text-white" />,
      title: "Gemstone Consultation",
      desc: "Expert gemstone recommendations based on your chart to boost positive planetary effects.",
      link: "",
      price: "Starting ₹750",
      // to: "/Gemstone-to-astrologers?",
      // navigate: () => navigate("/Gemstone-to-astrologers?"),
      path: "/Gemstone-to-astrologers?",
    },
    {
      icon: <GiBookCover className="w-6 h-6 text-white" />,
      title: "Online Puja Services",
      desc: "Book authentic Vedic Pujas and rituals performed by experienced pandits.",
      link: "",
      price: "Starting ₹1100",
      // to: "/online-puja",
      // navigate: () => navigate("/online-puja"),
      path: "/online-puja",
    },
    {
      icon: <GiCrystalBall className="w-6 h-6 text-white" />,
      title: "Astrology Blog",
      desc: "Read insightful articles on astrology, spirituality, and cosmic wisdom.",
      link: "Free Knowledge Hub",
      price: "",
      // to: "/Blog_astrologers",
      // navigate: () => navigate("/astrology-blog"),
      path: "/astrology-blog",
    },
    {
      icon: <FaPhoneAlt className="w-6 h-6 text-white" />,
      title: "Talk to Astrologer",
      desc: "Get instant phone consultations with certified astrologers for guidance.",
      link: "",
      price: "₹25/min onwards",
      // to: "/talk-to-astrologers",
      // navigate: () => navigate("/talk-to-astrologers"),
      path: "/talk-to-astrologers",
    },
    {
      icon: <FaComments className="w-6 h-6 text-white" />,
      title: "Chat with Astrologer",
      desc: "Connect via chat with expert astrologers for instant remedies and predictions.",
      link: "",
      price: "₹15/min onwards",
      // to: "/chat-to-astrologers",
      // navigate: () => navigate("/chat-to-astrologers"),
      path: "/chat-to-astrologers",
    },
    {
      icon: <RiNumbersFill className="w-6 h-6 text-white" />,
      title: "Numerology Reading",
      desc: "Discover your life path, destiny, and personality through Numerology analysis.",
      link: "",
      price: "Starting ₹250",
      // to: "/numerology",
      // navigate: () => navigate("/numerology-services"),
      path: "/numerology-services",
    },
    {
      icon: <TbCards className="w-6 h-6 text-white" />,
      title: "Tarot Card Reading",
      desc: "Unveil hidden insights into your past, present, and future with Tarot guidance.",
      link: "",
      price: "Starting ₹499",
      // to: "/tarot-reading-services",
      // navigate: () => navigate("/tarot-reading-services"),
      path: "/tarot-reading-services",
    },
    {
      icon: <MdOutlineHomeWork className="w-6 h-6 text-white" />,
      title: "Vastu Consultation",
      desc: "Transform your home/office as per Vastu Shastra for positivity and prosperity.",
      link: "",
      price: "Starting ₹750",
      // to: "/vedic-astrology-services",
      // navigate: () => navigate("/vedic-astrology-services"),
      path: "/vedic-astrology-services",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma, Satisfied Client",
      feedback:
        "AstroCal's Astro Solutions have been incredibly accurate and helpful. The detailed Kundli analysis helped me understand my life purpose, and the gemstone recommendations have brought positive changes to my career and relationships",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 py-12">

      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600">
          Explore Our Astrology Services
        </h2>
        <div className="w-[150px] h-[3px] m-auto rounded-full bg-orange-500 my-2 mb-10"></div>
        <p className="text-[#666666] mt-2 max-w-2xl mx-auto font-[500]">
          Discover comprehensive astrology solutions designed to guide you through life's journey with ancient wisdom and modern conveniencer, and life guidance.
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {stats.map((item, i) => (
          <div
            key={i}
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
      <section className="py-8 main-container ">
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {astrologyServices.map((service, index) => (
            <div
              key={index}
              onClick={() => router.push(service.path)}
              className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition text-center border-2 border-transparent hover:bg-orange-50 hover:border-orange-500"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center m-auto justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-400 shadow-md mb-4">
                {service.icon || <MdOutlineHomeWork className="w-6 h-6 text-white" />}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.desc}</p>

            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <div className=" main-container px-4">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-6 border-l-4 border-orange-500  mt-5  "
          >
            <p className="italic text-gray-700">
              "{item.feedback}"
            </p>
            <p className="mt-3 text-orange-600 font-semibold text-center">
              – {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}