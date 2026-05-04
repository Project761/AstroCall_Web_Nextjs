"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import DOMPurify from "dompurify";
import Select from "react-select";
// import Header from "@/components/Header/page";
// import Footer from "../components/Footer/page";
// import ChatCallPopup from "@/components/ChatCallPopup/ChatCallPopup";
// import CommanHoroscope from "@/components/ChatCallPopup/CommanHoroscope";
import { useMenuContext } from "../hooks/useMenuContext";
import { AddDeleteUpadate } from "../utils/api";
import { customStyle } from "../utils/utility";
// import { customStyle } from "@/components/Common/customStyle";
export default function LoveCalculator() {
  const { isModalOpen, setIsModalOpen, FAQData, GetData_ActivityLog } = useMenuContext();
  const [userId, setUserId] = useState("");
  const [tab, setTab] = useState("names");
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    UserName: "",
    PartnerName: "",
    UserDOB: "",
    PartnerDOB: "",
    UserGender: "",
    PartnerGender: "",
  });
  useEffect(() => {
    const id = localStorage.getItem("UserLoginId") || "";
    setUserId(id);
    if (id) {
      GetData_ActivityLog("Love Calculator", "Using Love Calculator (Entered Details & Viewed Result)");
    }
  }, []);
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.UserName)
      newErrors.UserName = "Required";
    if (!formData.PartnerName)
      newErrors.PartnerName = "Required";
    if (tab === "birthdate") {
      if (!formData.UserDOB)
        newErrors.UserDOB = "Required";
      if (!formData.PartnerDOB)
        newErrors.PartnerDOB = "Required";
    }
    else {
      if (!formData.UserGender)
        newErrors.UserGender = "Required";
      if (!formData.PartnerGender)
        newErrors.PartnerGender = "Required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      if (userId) {
        handleCalculate();
      }
      else {
        setIsModalOpen(true);
      }
    }
  };
  const handleCalculate = async () => {
    try {
      const payload = {
        ...formData,
        UserDOB: formData.UserDOB || "2002/12/09",
        PartnerDOB: formData.PartnerDOB || "2002/12/09",
      };
      const res = await AddDeleteUpadate("Chat/LoveCalculator", payload);
      const parse = JSON.parse(res.data);
      setResult({
        percent: parse.Percentage,
        message: parse.Message,
        userName: formData.UserName,
        partnerName: formData.PartnerName,
      });
    }
    catch (err) {
      console.log(err);
    }
  };
  const handleReset = () => {
    setFormData({
      UserName: "",
      PartnerName: "",
      UserDOB: "",
      PartnerDOB: "",
      UserGender: "",
      PartnerGender: "",
    });
    setResult(null);
    setErrors({});
  };
  return (<>
    {/* ✅ SEO */}
    <Head>
      <title>Love Calculator Online – Check Compatibility</title>
      <meta name="description" content="Free love calculator to check compatibility." />
    </Head>

    {/* <Header /> */}

    <div className="bg-[#F973160D]">
      <div className="main-container text-left py-3 sm:py-4 md:py-5  px-3 sm:px-4">
        <div className="bg-orange-500 rounded-md w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4 mt-18">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Love Calculator Online – Check Your Love Compatibility</h1>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-2">Free Love Compatibility Test 💕</h2>
            <h3>
              <p className="mt-2 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed">
                Explore relationship compatibility, cosmic influences, and future predictions.
              </p>
            </h3>
            <div className="w-8 h-[2px] bg-white mt-3 sm:mt-4"></div>
          </div>
        </div>
      </div>


      <div className="text-center mb-6 sm:mb-8 px-3 sm:px-4">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 flex flex-wrap items-center justify-center gap-2">
          <span className="text-orange-600 text-2xl sm:text-3xl md:text-4xl">♡</span>
          <span className="wrap-break-word">Love Calculator: Find Your Perfect Match and Discover True Love</span>
        </p>
        <p className="text-gray-500 mt-2 text-xs sm:text-sm">Find your compatibility with your partner</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg border border-orange-100 mb-10 sm:mb-16 md:mb-20 px-3 sm:px-4">
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-gray-100 p-1 rounded-full">
          <button
            className={`flex-1 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${tab === "names"
              ? "bg-orange-600 text-white shadow"
              : "text-gray-600 hover:text-orange-600"
              }`}
            onClick={() => setTab("names")}
          >
            👤 By Names
          </button>
          <button
            className={`flex-1 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${tab === "birthdate"
              ? "bg-orange-600 text-white shadow"
              : "text-gray-600 hover:text-orange-600"
              }`}
            onClick={() => setTab("birthdate")}
          >
            📅 By Birth Date
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 sm:space-y-6">
          {/* User Details */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">💖 Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  name="UserName"
                  autoComplete='Off'
                  value={formData.UserName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                {errors.UserName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.UserName}</p>}
              </div>
              {tab === "birthdate" ? (
                <div>
                  <input
                    type="date"
                    name="UserDOB"
                    value={formData.UserDOB}
                    onChange={handleChange}
                    autoComplete='Off'
                    className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  {errors.UserDOB && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.UserDOB}</p>}
                </div>
              ) : (
                <div>
                  <Select
                    name="UserGender"
                    options={genderOptions}
                    isClearable
                    placeholder="Your Gender"
                    value={genderOptions?.filter((obj) => obj.value === formData?.UserGender)}
                    onChange={(selectedOption) => {
                      setFormData({ ...formData, UserGender: selectedOption ? selectedOption.value : '' });
                    }}
                    className="w-full"
                    styles={customStyle}
                  />
                  {errors.UserGender && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.UserGender}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Partner Details */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">💞 Partner's Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  name="PartnerName"
                  autoComplete='Off'
                  value={formData.PartnerName}
                  onChange={handleChange}
                  placeholder="Partner's Name"
                  className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                {errors.PartnerName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.PartnerName}</p>}
              </div>
              {tab === "birthdate" ? (
                <div>
                  <input
                    type="date"
                    autoComplete='Off'
                    name="PartnerDOB"
                    value={formData.PartnerDOB}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  {errors.PartnerDOB && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.PartnerDOB}</p>}
                </div>
              ) : (
                <div>

                  <Select
                    name="PartnerGender"
                    options={genderOptions}
                    isClearable
                    placeholder="Partner's Gender"
                    value={genderOptions?.filter((obj) => obj.value === formData?.PartnerGender)}
                    onChange={(selectedOption) => {
                      setFormData({ ...formData, PartnerGender: selectedOption ? selectedOption.value : '' });
                    }}
                    className="w-full"
                    styles={customStyle}
                  />
                  {errors.PartnerGender && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.PartnerGender}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={validateForm}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-lg font-medium transition shadow text-sm sm:text-base"
          >
            💕 Calculate
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition shadow-sm text-sm sm:text-base"
          >
            Reset
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-inner animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-orange-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-orange-600"
                    strokeWidth="4"
                    strokeDasharray={`${result.percent}, 100`}
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-bold text-orange-600">
                  {result.percent}%
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg break-words">
                  Compatibility between <span className="font-bold">{result.userName}</span> ❤️ <span className="font-bold">{result.partnerName}</span>
                </p>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm md:text-base">{result.message}</p>
              </div>
            </div>
          </div>
        )}



      </div>
      {
        FAQData && FAQData?.length > 0 && (
          <div className="main-container mb-8 sm:mb-10 px-3 sm:px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="space-y-3 sm:space-y-4">
                {FAQData?.map((faq, index) => (
                  <div key={index} className="border-b pb-3 sm:pb-4 last:border-b-0">
                    {/* <h3 className="text-2xl font-semibold mb-4">{faq?.HoroscopeName} FAQs</h3> */}
                    {/* <h4 className="text-lg font-medium mb-2">{faq.Question}</h4> */}
                    <p
                      className="text-gray-700 text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq?.HoroscopeDetailsHTML) }}
                    ></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    </div>

    {/* <ChatCallPopup /> */}
    {/* <CommanHoroscope /> */}
    {/* <Footer /> */}
  </>);
}
