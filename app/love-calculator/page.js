'use client'

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Select from "react-select";
import { AddDeleteUpadate, getData } from "../utils/api";

// Test if imports work
console.log("getData function:", typeof getData);
console.log("AddDeleteUpadate function:", typeof AddDeleteUpadate);

// Inline postData function to bypass import issue
const postData = async (url, requestData) => {
  try {
    const visitorId = typeof window !== 'undefined' ? localStorage.getItem("visitor_Id") || '' : '';
    const baseUrl = typeof window !== 'undefined'
      ? (window.location.origin === 'https://astrocall.live'
        ? 'https://api.astrocall.live/api/'
        : 'https://liveapi.astrocall.live/api/')
      : 'https://liveapi.astrocall.live/api/';
    const fullUrl = baseUrl.endsWith('/') ? baseUrl + url.replace(/^\/+/, '') : baseUrl + '/' + url.replace(/^\/+/, '');

    console.log("Inline postData URL:", fullUrl);
    console.log("Inline postData Request:", requestData);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'FingerPrintJsKey': visitorId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log("Inline postData Response status:", response.status);

    if (!response.ok) {
      console.error("HTTP error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log("Inline postData Raw response:", data);

    // Handle different response formats
    let parseData;
    try {
      if (data?.data) {
        if (typeof data.data === 'string') {
          parseData = JSON.parse(data.data);
        } else {
          parseData = data.data;
        }
      } else {
        parseData = data;
      }
      console.log("Inline postData Parsed data:", parseData);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      parseData = data;
    }

    return parseData;
  } catch (error) {
    console.error('Inline postData error:', error);
    return null;
  }
};
import { MenuContext } from "../context/MenuContext";
import SEO from "../components/SEO/page";
import ErrorMessage from "../components/ErrorMessage/page";
import { customStyle } from "../components/Common/customStyle";
import ChatCallPopup from "../components/ChatCallPopup/page";
import Horoscope from "../components/Horoscope/page";
import AuthModal from "../components/AuthModal/page";

const LoveCalculator = () => {

  const { isModalOpen, setIsModalOpen, FAQData, GetData_ActivityLog } = useContext(MenuContext);

  const [UserLoginId, setUserLoginId] = useState("");
  const [tab, setTab] = useState("names");

  useEffect(() => {
    const storedUserId = localStorage.getItem("UserLoginId") || "";
    setUserLoginId(storedUserId);
  }, []);
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
    if (UserLoginId) {
      GetData_ActivityLog("Love Calculator", `Using Love Calculator (Entered Details & Viewed Result)`);
    }
  }, [UserLoginId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const AddType = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ]

  const validateForm = () => {
    const newErrors = {};
    if (!formData.UserName.trim()) newErrors.UserName = "Required";
    if (!formData.PartnerName.trim()) newErrors.PartnerName = "Required";

    if (tab === "birthdate") {
      if (!formData.UserDOB) newErrors.UserDOB = "Required";
      if (!formData.PartnerDOB) newErrors.PartnerDOB = "Required";
    } else {
      if (!formData.UserGender) newErrors.UserGender = "Required";
      if (!formData.PartnerGender) newErrors.PartnerGender = "Required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      if (UserLoginId) {
        handleCalculate();
      } else {
        setIsModalOpen(true);
      }
    }
  };


  const handleCalculate = async () => {

    try {
      const { UserName, PartnerName, UserDOB, PartnerDOB, UserGender, PartnerGender, } = formData
      const val = {
        UserName: UserName,
        PartnerName: PartnerName,
        UserDOB: UserDOB || "2002/12/09",
        PartnerDOB: PartnerDOB || "2002/12/09",
        UserGender: UserGender,
        PartnerGender: PartnerGender,
      }
      const response = await postData("Chat/LoveCalculator", val);
      console.log("API Response:", response);

      if (response) {
        const resultData = {
          percent: response.Percentage,
          message: response.Message,
          userName: formData.UserName,
          partnerName: formData.PartnerName,
        };
        console.log("Setting Result:", resultData);
        setResult(resultData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Reset form + result
  const handleReset = () => {
    setFormData({
      UserName: "",
      PartnerName: "",
      UserDOB: "",
      PartnerDOB: "",
      UserGender: "",
      PartnerGender: "",
    });
    setErrors({});
    setResult(null);
  };



  return (
    <>
      <SEO
        title="Love Calculator Online – Check Compatibility Score"
        description="Use AstroCall’s free love calculator to check name‑based love compatibility. Get a quick score and basic insights about your relationship potential."
        keywords="love calculator, love compatibility, relationship calculator, love percentage, compatibility test, love match calculator"
        canonical="https://astrocall.live/love-calculator"
        type="service"
        schema={

          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "Love Calculator — AstroCall",
                "url": "https://astrocall.live/love-calculator",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Web Browser",
                "description": "Free online love compatibility calculator on AstroCall. Enter two names to instantly calculate your love percentage and compatibility score.",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
                "provider": { "@id": "https://astrocall.live/#organization" }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://astrocall.live/" },
                  { "@type": "ListItem", "position": 2, "name": "Love Calculator", "item": "https://astrocall.live/love-calculator" }
                ]
              }
            ]
          }


        }


      />
      {/* <Header /> */}
      <div className="bg-[#F973160D] mt-16">
        <div className="main-container text-left py-3 sm:py-4 md:py-5  px-3 sm:px-4">
          <div className="bg-orange-500 rounded-md w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4 mt-5">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Love Calculator Online – Check Your Love Compatibility</h1>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-[600] mt-2">Free Love Compatibility Test 💕</h2>
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
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 flex flex-wrap items-center justify-center gap-2">
            <span className="text-orange-600 text-2xl sm:text-3xl md:text-4xl">♡</span>
            <span className="break-words">Love Calculator: Find Your Perfect Match and Discover True Love</span>
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
                  <ErrorMessage error={errors?.UserName} />
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

                    <ErrorMessage error={errors?.UserDOB} />
                  </div>
                ) : (
                  <div>
                    {/* <select
                                            name="UserGender"
                                            value={formData.UserGender}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none bg-white cursor-pointer"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                backgroundPosition: 'right 0.5rem center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '1.5em 1.5em',
                                                paddingRight: '2.5rem'
                                            }}
                                        >
                                            <option value="">Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select> */}

                    <Select
                      name="UserGender"
                      options={AddType}
                      isClearable
                      placeholder="Your Gender"
                      styles={customStyle}
                      value={AddType?.filter((obj) => obj.value === formData?.UserGender)}
                      onChange={(selectedOption) => {
                        setFormData({ ...formData, UserGender: selectedOption ? selectedOption.value : '' });
                      }}
                    />
                    <ErrorMessage error={errors?.UserGender} />

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
                  <ErrorMessage error={errors?.PartnerName} />

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
                    <ErrorMessage error={errors?.PartnerDOB} />

                  </div>
                ) : (
                  <div>
                    {/* <select
                                            name="PartnerGender"
                                            value={formData.PartnerGender}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg p-2.5 sm:p-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none bg-white cursor-pointer"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                backgroundPosition: 'right 0.5rem center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: '1.5em 1.5em',
                                                paddingRight: '2.5rem'
                                            }}
                                        >
                                            <option value="">Partner's Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                        </select> */}
                    <Select
                      name="PartnerGender"
                      options={AddType}
                      isClearable
                      placeholder="Partner's Gender"
                      styles={customStyle}
                      value={AddType?.filter((obj) => obj.value === formData?.PartnerGender)}
                      onChange={(selectedOption) => {
                        setFormData({ ...formData, PartnerGender: selectedOption ? selectedOption.value : '' });
                      }}
                    />
                    <ErrorMessage error={errors?.PartnerGender} />

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
      <ChatCallPopup />

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={(userData) => {
          console.log("Login successful:", userData);
          // After successful login, trigger calculation
          handleCalculate();
        }}
      />

      <Horoscope />
      {/* <Footer /> */}
    </>
  );
};

export default LoveCalculator;
