"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { FaGlobeAmericas } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";
import { MenuContext } from "@/app/context/MenuContext";

export default function LanguageDropdown() {
  const { setLanguageDropdown } = useContext(MenuContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ENG");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedLang = sessionStorage.getItem("Language");

    if (savedLang === "hi") {
      setSelectedLanguage("हिंदी");
      setLanguageDropdown("hi");
    } else {
      setSelectedLanguage("ENG");
      setLanguageDropdown("en");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const changeLanguage = (lang) => {
    if (lang === "en") {
      setSelectedLanguage("ENG");
      sessionStorage.setItem("Language", "en");
      setLanguageDropdown("en");
    } else {
      setSelectedLanguage("हिंदी");
      sessionStorage.setItem("Language", "hi");
      setLanguageDropdown("hi");
    }

    setIsOpen(false);
  };

  return (
    <div className="relative inline-block " ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className=" px-2.5 py-2 flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-orange-300 bg-white text-[#1f2937] hover:bg-orange-50 transition"
      >
        <FaGlobeAmericas className="text-[16px] text-black" />
        <span className="text-[14px]  leading-none">
          {selectedLanguage}
        </span>
        <AiFillCaretDown className="text-[12px] text-black" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[52px] w-[182px] bg-white border border-gray-200 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.18)] z-[9999] overflow-hidden">
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className={`w-full px-5 py-4 text-left text-[16px] font-medium hover:bg-orange-50 flex items-center gap-2 ${selectedLanguage === "ENG" ? "text-[#ff5b00]" : "text-gray-700"
              }`}
          >
            English
            {selectedLanguage === "ENG" && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("hi")}
            className={`w-full px-5 py-4 text-left text-[16px] font-medium hover:bg-orange-50 flex items-center gap-2 ${selectedLanguage === "हिंदी" ? "text-[#ff5b00]" : "text-gray-700"
              }`}
          >
            हिंदी (Hindi)
            {selectedLanguage === "हिंदी" && <span>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}