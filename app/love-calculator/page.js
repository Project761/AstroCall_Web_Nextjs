"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import DOMPurify from "dompurify";
// import Select from "react-select";
// import Header from "@/components/header/header";
// import Footer from "@/components/footer/Footer";
// import ChatCallPopup from "@/components/ChatCallPopup/ChatCallPopup";
// import CommanHoroscope from "@/components/ChatCallPopup/CommanHoroscope";
import { useMenuContext } from "../hooks/useMenuContext";
import { AddDeleteUpadate } from "../utils/api";
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
        <meta name="description" content="Free love calculator to check compatibility."/>
      </Head>

      {/* <Header /> */}

      <div className="bg-orange-50 min-h-screen pt-20">
        <div className="main-container text-left py-3 sm:py-4 md:py-5 mt-16 px-3 sm:px-4">
          <div className="bg-orange-500 rounded-md w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4">
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
      
        {/* Card */}
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10">

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 p-1 rounded-full">
            <button onClick={() => setTab("names")} className={`flex-1 py-2 rounded-full ${tab === "names"
            ? "bg-orange-500 text-white"
            : "text-gray-600"}`}>
              By Name
            </button>

            <button onClick={() => setTab("birthdate")} className={`flex-1 py-2 rounded-full ${tab === "birthdate"
            ? "bg-orange-500 text-white"
            : "text-gray-600"}`}>
              By DOB
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">

            <input name="UserName" value={formData.UserName} onChange={handleChange} placeholder="Your Name" className="w-full border p-3 rounded-lg"/>

            <input name="PartnerName" value={formData.PartnerName} onChange={handleChange} placeholder="Partner Name" className="w-full border p-3 rounded-lg"/>

            {tab === "birthdate" ? (<>
                <input type="date" name="UserDOB" onChange={handleChange} className="w-full border p-3 rounded-lg"/>
                <input type="date" name="PartnerDOB" onChange={handleChange} className="w-full border p-3 rounded-lg"/>
              </>) : (<>
                {/* <Select
              options={genderOptions}
              placeholder="Your Gender"
              // styles={customStyle}
              onChange={(e) =>
                setFormData({ ...formData, UserGender: e?.value })
              }
            /> */}

                {/* <Select
              options={genderOptions}
              placeholder="Partner Gender"
              // styles={customStyle}
              onChange={(e) =>
                setFormData({ ...formData, PartnerGender: e?.value })
              }
            /> */}
              </>)}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button onClick={validateForm} className="flex-1 bg-orange-500 text-white py-3 rounded-lg">
              Calculate
            </button>

            <button onClick={handleReset} className="bg-gray-200 px-6 rounded-lg">
              Reset
            </button>
          </div>

          {/* Result */}
          {result && (<div className="mt-6 bg-orange-100 p-4 rounded-xl">
              <h3 className="font-bold text-lg text-orange-600">
                {result.percent}% Match ❤️
              </h3>
              <p className="mt-2 text-gray-700">
                {result.userName} ❤️ {result.partnerName}
              </p>
              <p className="text-sm mt-2">{result.message}</p>
            </div>)}
        </div>

        {/* FAQ */}
        {FAQData?.length > 0 && (<div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            {FAQData.map((faq, i) => (<div key={i} dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(faq.HoroscopeDetailsHTML),
                }}/>))}
          </div>)}
      </div>

      {/* <ChatCallPopup /> */}
      {/* <CommanHoroscope /> */}
      {/* <Footer /> */}
    </>);
}
