"use client";

import { useState, useRef, useEffect } from "react";

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const dropdownRef = useRef(null);

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "HI", name: "हिंदी", flag: "🇮🇳" },
    { code: "TA", name: "தமிழ்", flag: "🇱🇰" },
    { code: "TE", name: "తెలుగు", flag: "🇮🇳" },
    { code: "BN", name: "বাংলা", flag: "🇧🇩" },
    { code: "GU", name: "ગુજરાતી", flag: "🇮🇳" },
    { code: "MR", name: "मराठी", flag: "🇮🇳" },
    { code: "KN", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ML", name: "മലയാളം", flag: "🇮🇳" },
    { code: "PA", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "OR", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
    { code: "AS", name: "অসমীয়া", flag: "🇮🇳" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang.code);
    setIsOpen(false);
    
    // Save to localStorage
    localStorage.setItem("selectedLanguage", lang.code);
    
    // Here you would typically integrate with i18next
    // For now, just update the state
  };

  const currentLang = languages.find(lang => lang.code === selectedLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLang.code}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                  lang.code === selectedLang ? 'bg-orange-100 text-orange-600' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{lang.name}</div>
                  <div className="text-xs text-gray-500">{lang.code}</div>
                </div>
                {lang.code === selectedLang && (
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414 0l8 8a1 1 0 001.414-1.414l-8-8z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
