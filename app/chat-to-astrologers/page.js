"use client";
import React, { useEffect, useState } from "react";
// Using direct path for Next.js public folder
import { FaSearch, FaSortAmountDown } from "react-icons/fa";
import { LiaAwardSolid } from "react-icons/lia";
import { IoClose, IoLanguage } from "react-icons/io5";
import { MdOutlineCases, MdVerified } from "react-icons/md";
import { TbCurrencyRupee } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { postWithToken } from "@/app/utils/api";
import { FaStar, FaStarHalf } from "react-icons/fa6";
import SEO from "@/app/components/SEO/page.js";
import InsufficientBalancePopup from "@/app/components/InsufficientBalancePopup.js";
// Custom Loading Indicator Component
const LoadingIndicator = ({ size = "medium" }) => {
    return (<div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>);
};
// Custom Modal Component
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-lg sm:text-xl font-semibold">{title}</h5>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">✕</button>
        </div>
        {children}
      </div>
    </div>);
};
const ChatToAstrologers = () => {
    // Mock translation function - replace with actual translation if needed
    const t = (key) => {
        const translations = {
            "availableBalance": "Available Balance",
            "recharge": "Recharge",
            "years": "years",
            "perMinute": "per minute",
            "chat": "Chat"
        };
        return translations[key] || key;
    };
    const router = useRouter();
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || "" : "";
    const Usermessage = typeof window !== 'undefined' ? sessionStorage.getItem("Usermessage") || "" : "";
    // Mock context data - replace with actual context if needed
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] = useState(false);
    const [insufficientBalanceData, setInsufficientBalanceData] = useState({
      requiredAmount: 0,
      currentBalance: 0,
      astrologerName: ''
    });
    const [loginUserData, setLoginUserData] = useState(null);
    const [AstroNameHomePage, setAstroNameHomePage] = useState(null);
    const [LanguagesData, setLanguagesData] = useState([]);
    const [SkillsData, setSkillsData] = useState([]);
    const [CategoryData, setCategoryData] = useState([]);
    const [AstroNotBusy, setAstroNotBusy] = useState(null);
    const [AstroNotBusyStatus, setAstroNotBusyStatus] = useState(false);
    const [BusyTimes, setBusyTimes] = useState({});
    const [AstroBusyStatus, setAstroBusyStatus] = useState(null);
    const [AstroBusyMap, setAstroBusyMap] = useState({});
    const [displayedAstrologers, setDisplayedAstrologers] = useState([]);
    const [astrologerdata, setastrologerdata] = useState([]);
    const [astrologers, setAstrologers] = useState([]);
    const [ChatPopUpStatus, setChatPopUpStatus] = useState(false);
    const [Callstatus, setCallstatus] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [isLoadingAstrologerData, setIsLoadingAstrologerData] = useState(false);
    // Mock functions - replace with actual implementations
    // const GetData_ActivityLog = (page, action) => {
    //     console.log(`Activity: ${page} - ${action}`);
    // };
    const Get_Data_Astrologer = async () => {
        setIsLoadingAstrologerData(true);
        try {
            const val = { IsActive: "1", Source: "chat" };
            const res = await postWithToken("Astrologer/UserGetData_Astrologer", val);
            if (res) {
                setAstrologers(res);
                setastrologerdata(res);
                setDisplayedAstrologers(res);
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem("OnlineStatus");
                }
            }
        }
        catch (error) {
            console.log(error, "error");
        }
        finally {
            setIsLoadingAstrologerData(false);
        }
    };
    const Get_BusyTimes = async () => {
        try {
            // Mock implementation - replace with actual API call
            setBusyTimes({});
        }
        catch (error) {
            console.error("Error fetching busy times:", error);
        }
    };
    const [searchVal, setSearchVal] = useState(AstroNameHomePage ? AstroNameHomePage : "");
    const [astroName, setAstroName] = useState("");
    const [PricePerMinastro, setPricePerMinastro] = useState(0);
    const [chatOnlineStatus, setChatOnlineStatus] = useState({});
    const [isNavigating, setIsNavigating] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedSkillIds, setSelectedSkillIds] = useState([]);
    const [selectedLanguagesIds, setSelectedLanguagesIds] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [GenderIds, setGenderIds] = useState([]);
    const [activeTab, setActiveTab] = useState("Skill");
    const [showPopup, setShowPopup] = useState(false);
    const [selected, setSelected] = useState("Popularity");
    const GenderOptions = ["Male", "Female"];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, []);

    // useEffect(() => {
    //     if (UserLoginId) {
    //         GetData_ActivityLog("ChatFragment", "Chat astrologer list is fetch Now");
    //     }
    // }, [UserLoginId]);

    useEffect(() => {
        Get_Data_Astrologer();
        Get_BusyTimes();
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = "auto";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, []);

    const GetPrice = PricePerMinastro ? PricePerMinastro * 5 : popupData?.Rate * 5;

    const handleSearchChange = (e) => {
        setSearchVal(e.target.value);
    };

    useEffect(() => {
        const filteredData = astrologers?.filter((item) => item?.DisplayName &&
            typeof item?.DisplayName === "string" &&
            item?.DisplayName.toLowerCase().includes(searchVal.toLowerCase()));
        setastrologerdata(filteredData);
        setDisplayedAstrologers(filteredData);
    }, [searchVal, AstroNameHomePage, astrologers]);
    
    const loginOrChatModal = (card) => {
        try {
            if (typeof window !== 'undefined' && localStorage.getItem("UserLoginId")) {
                const navUrl = `/chat-to-astrologers/user-chat-home?AstroId=${card?.ID}&Type=chat&IsChat=${card?.IsChat}`;
                router.push(navUrl);
            }
            else {
                setIsModalOpen(true);
            }
        }
        catch (error) {
            console.error("Navigation error in loginOrChatModal:", error);
            if (typeof window !== 'undefined' && localStorage.getItem("UserLoginId") && card?.ID) {
                window.location.href = `/chat-to-astrologers/user-chat-home?AstroId=${card?.ID}&Type=chat&IsChat=${card?.IsChat}`;
            }
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            try {
                if (typeof window === 'undefined')
                    return;
                const raw = sessionStorage.getItem("AstrologerOnlineChat");
                if (!raw)
                    return;
                const msg = JSON.parse(raw);
                if (msg?.Type === "chat" && msg?.UserId && msg?.Message) {
                    const normalizedUserId = String(msg.UserId.replace(/[a-zA-Z]/g, ''));
                    const isOnline = msg?.Message === "This Astrologer is Online";
                    setChatOnlineStatus((prev) => ({
                        ...prev,
                        [normalizedUserId]: isOnline,
                    }));
                }
            }
            catch (err) {
                console.error("Invalid JSON in sessionStorage:", err);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    const sortOptions = [
        "Popularity",
        "Experience : High to Low",
        "Experience : Low to High",
        "Total orders : High to Low",
        "Total orders : Low to High",
        "Price : High to Low",
        "Price : Low to High",
        "Rating : High to Low",
    ];
    const applyFilters = () => {
        let filteredData = [...astrologers];
        if (selectedSkillIds.length > 0) {
            filteredData = filteredData.filter(item => {
                const astrologerSkillIds = item?.skills?.split(",")?.map((s) => Number(s.trim()));
                return astrologerSkillIds?.some((skillId) => selectedSkillIds.includes(skillId));
            });
        }
        if (selectedCategoryIds.length > 0) {
            filteredData = filteredData.filter(item => {
                const astrologerCategoryIds = item?.skills?.split(",")?.map((s) => Number(s.trim()));
                return astrologerCategoryIds?.some((item) => selectedCategoryIds.includes(item));
            });
        }
        if (selectedLanguagesIds.length > 0) {
            filteredData = filteredData.filter(item => {
                const astrologerLanguagesIds = item?.Languages?.split(",")?.map((s) => Number(s.trim()));
                return astrologerLanguagesIds?.some((item) => selectedLanguagesIds.includes(item));
            });
        }
        if (GenderIds.length > 0) {
            filteredData = filteredData.filter(item => GenderIds.includes(item?.Gender));
        }
        setastrologerdata(filteredData);
        setDisplayedAstrologers(filteredData);
        setIsFilterOpen(false);
    };
    useEffect(() => {
        if (selected === "Popularity") {
            setastrologerdata(displayedAstrologers);
            return;
        }
        let sortedData = [...displayedAstrologers];
        switch (selected) {
            case "Experience : High to Low":
                sortedData.sort((a, b) => b.ExperiencedYears - a.ExperiencedYears);
                break;
            case "Experience : Low to High":
                sortedData.sort((a, b) => a.ExperiencedYears - b.ExperiencedYears);
                break;
            case "Total orders : High to Low":
                sortedData.sort((a, b) => b.ChatOrders - a.ChatOrders);
                break;
            case "Total orders : Low to High":
                sortedData.sort((a, b) => a.ChatOrders - b.ChatOrders);
                break;
            case "Price : High to Low":
                sortedData.sort((a, b) => b.PricePerMin - a.PricePerMin);
                break;
            case "Price : Low to High":
                sortedData.sort((a, b) => a.PricePerMin - b.PricePerMin);
                break;
            case "Rating : High to Low":
                sortedData.sort((a, b) => b.Review - a.Review);
                break;
            default:
                break;
        }
        setastrologerdata(sortedData);
    }, [selected]);
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        if (!timeLeft)
            return;
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);
    const hmsToMinutes = (value) => {
        if (!value)
            return 0;
        if (typeof value === "number")
            return value;
        if (typeof value === "string") {
            if (value.toLowerCase().includes("min")) {
                const minutes = parseInt(value.replace(/\D/g, ""), 10);
                return isNaN(minutes) ? 0 : minutes;
            }
            const parts = value.split(":").map(Number);
            if (parts.length === 3) {
                const [h, m, s] = parts;
                return h * 60 + m + Math.floor(s / 60);
            }
            if (parts.length === 2) {
                const [m, s] = parts;
                return m + Math.floor(s / 60);
            }
        }
        return 0;
    };
    useEffect(() => {
        const interval = setInterval(() => {
            try {
                if (!AstroNotBusy)
                    return;
                const normalizedAstroId = String(AstroNotBusy?.AstroId);
                if (AstroNotBusy?.Type === "chat" && AstroNotBusy?.Message === "Astro Chat is Not Busy.") {
                    setastrologerdata(prevData => prevData.map(card => String(card.ID) === normalizedAstroId
                        ? { ...card, Isbusy: false }
                        : card));
                    setAstroNotBusy('');
                }
            }
            catch (err) {
                console.error("Error parsing AstrologerOnline JSON:", err);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [AstroNotBusy]);
    useEffect(() => {
        if (!Array.isArray(astrologerdata) || astrologerdata.length === 0)
            return;
        setastrologerdata((prev) => prev.map((card) => {
            const astroId = String(card.ID);
            const busyEntry = AstroBusyMap?.[astroId];
            if (busyEntry) {
                return {
                    ...card,
                    Isbusy: !!busyEntry.Isbusy,
                    BusyTime: busyEntry?.BusyTime ?? card?.BusyTime ?? null,
                };
            }
            return {
                ...card,
                Isbusy: false,
                BusyTime: null,
            };
        }));
    }, [AstroBusyMap, AstroNotBusyStatus]);
    return (<>
      <SEO title="Chat with Expert Astrologers Online | AstroCall Live" description="Chat with certified astrologers online anytime on AstroCall Live. Get instant astrology guidance on love, career, finance, and health from trusted Jyotish experts." canonical="https://astrocall.live/chat-to-astrologers" type="service" schema={{
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "name": "AstroCall",
                    "url": "https://astrocall.live/",
                    "logo": "https://astrocall.live/assets/logo.png"
                },
                {
                    "@type": "WebSite",
                    "url": "https://astrocall.live/",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://astrocall.live/search?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://astrocall.live/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Chat to Astrologer",
                            "item": "https://astrocall.live/chat_to_astrologer"
                        }
                    ]
                },
                {
                    "@type": "Service",
                    "serviceType": "Astrology Chat Consultation",
                    "provider": {
                        "@type": "Organization",
                        "name": "AstroCall",
                        "url": "https://astrocall.live/"
                    }
                }
            ]
        }}/>

      <div className="bg-[#F973160D]">
        <div className="main-container text-left py-3 sm:py-4 md:py-5 ">
          <div className="bg-orange-500 rounded-md w-full text-white mt-18 text-center py-2 sm:py-3 md:py-4 px-3 sm:px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold">
                  Chat with Our Expert Astrologers
                </h1>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 sm:mt-3">
                How to Talk to an Astrologer Online
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed px-2">
                Connect instantly with our experienced astrologers for personalized guidance on career,
                relationships, health, and more. Get live text-based chat consultations with our experts.
              </p>
              <div className="w-8 h-[2px] bg-white mt-5"></div>
            </div>
          </div>
        </div>

        <div className="main-container px-2 sm:px-3 md:px-0 py-2 sm:py-3 mt-2 sm:mt-3">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-black font-semibold text-lg sm:text-xl md:text-[22px] lg:text-[26px] text-center md:text-left whitespace-normal md:whitespace-nowrap">
              Chat With Astrologer
            </h3>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 w-full">
              <div className="text-black text-[16px] whitespace-nowrap flex justify-center w-full sm:w-auto">
                <h4>
                  {t("availableBalance")}{" "}
                  {loginUserData?.WalletAmt ? loginUserData?.WalletAmt : 0}
                </h4>
              </div>

              <div className="flex items-center justify-center w-full sm:w-auto">
                {UserLoginId?.length > 0 ? (<button type="button" onClick={() => {
                setIsNavigating(true);
                router.push("/plans");
            }} disabled={isNavigating} className={`bg-white text-black text-sm px-4 py-2 rounded border transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2
                      ${isNavigating
                ? 'bg-orange-100 border-orange-300 cursor-not-allowed'
                : 'hover:bg-gray-50 hover:shadow-sm active:scale-95'}`}>
                    {isNavigating ? (<>
                        <div className="w-3 h-3 border border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>) : (<>
                        <span className="text-orange-500">⚡</span>
                        {t("recharge")}
                      </>)}
                  </button>) : (<button type="button" onClick={() => router.push("/plans")} className="bg-white text-black text-sm px-4 py-2 rounded border hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    {t("recharge")}
                  </button>)}
              </div>

              <div className="flex justify-center items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-white rounded px-4 py-2 border cursor-pointer hover:bg-gray-50 transition-colors justify-center w-1/2 sm:w-auto" onClick={() => setShowPopup(true)}>
                  <FaSortAmountDown className="text-gray-600 w-4 h-4"/>
                  <span className="text-sm text-gray-700">Sort by</span>
                </div>
              </div>

              <div className="relative w-full sm:w-[240px] md:w-[260px] lg:w-[280px]">
                <input type="text" className="pl-3 pr-10 py-2 rounded border bg-white text-xs sm:text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-[#FF6600]" placeholder="Search name..." value={searchVal} onChange={handleSearchChange}/>
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4"/>
              </div>
            </div>
          </div>
        </div>

        {showPopup && (<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowPopup(false)}></div>
            <div className="relative w-80 bg-white shadow-2xl rounded-xl border border-gray-100 p-5 z-50 transform transition-all duration-300 ease-out scale-100 animate-fade-in">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FaSortAmountDown className="text-orange-500 w-4 h-4"/>
                  <h3 className="text-base font-bold text-gray-800">Sort By</h3>
                </div>
                <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100">
                  <IoClose className="w-5 h-5"/>
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sortOptions?.map((option, idx) => (<label key={idx} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-orange-50 group">
                    <input type="radio" name="sort" value={option} checked={selected === option} onChange={() => { setSelected(option); setShowPopup(false); }} className="w-4 h-4 text-orange-600 focus:ring-orange-500 focus:ring-2 accent-orange-600"/>
                    <span className={`text-sm flex-1 transition-colors duration-200 ${selected === option
                    ? "font-semibold text-orange-700"
                    : "text-gray-700 group-hover:text-gray-900"}`}>
                      {option}
                    </span>
                    {selected === option && (<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>)}
                  </label>))}
              </div>
            </div>
          </div>)}

        <div className="grid grid-cols-1 px-2 sm:px-3 md:px-0 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 main-container md:grid-cols-2 my-1 sm:grid-cols-1">
          {isLoadingAstrologerData ? (<div className="col-span-full flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-orange-300 rounded-full animate-spin" style={{ animationDelay: '150ms' }}></div>
              </div>
              <p className="text-gray-600 text-sm font-medium animate-pulse">Finding best astrologers for you...</p>
            </div>) : astrologerdata?.length === 0 ? (<div className="text-center col-span-full text-gray-500 text-lg py-10">
              {searchVal ? (<>
                  <p className="font-medium mb-2">No astrologers found for "{searchVal}"</p>
                  <p className="text-sm text-gray-400">Try searching with different keywords</p>
                </>) : (<>
                  <p className="font-medium mb-2">No Astrologers Found</p>
                  <p className="text-sm text-gray-400">Please check back later</p>
                </>)}
            </div>) : (astrologerdata?.map((card, index) => {
            const socketStatus = chatOnlineStatus[String(card.ID)];
            const isOnline = socketStatus === true ? true : socketStatus === false ? false : card?.IsChat === true;
            return (<div key={card?.ID || index} className="flex bg-white p-3 sm:p-4 rounded-xl shadow-md duration-300 gap-3 sm:gap-4 md:gap-5 hover:scale-105 hover:shadow-lg relative sellerCard">
                  <div className="flex flex-col items-center left-side flex-shrink-0">
                    <div className="img relative">
                      {card.AvatarUrl ? (<div className="h-[70px] w-[70px] sm:h-[80px] sm:w-[80px] md:h-[90px] md:w-[90px] rounded-full overflow-hidden" style={{ backgroundColor: "#F9DDC1" }}>
                          <img src={card?.AvatarUrl ? `https://${card?.AvatarUrl?.replace(/\\/g, "/")}` : "/images/profile pic.webp"} className="h-full w-full object-contain"/>
                        </div>) : (<img style={{ borderRadius: "50px" }} src="/images/profile pic.webp" className="h-[70px] w-[70px] sm:h-[80px] sm:w-[80px] md:h-[90px] md:w-[90px]" alt=""/>)}
                      <div className={`
                           ${card?.Isbusy
                    ? "bg-red-600"
                    : isOnline
                        ? "bg-green-600"
                        : "bg-gray-400"}
                          w-[15px] h-[15px] rounded-full absolute bottom-1 right-1 border-2 border-gray-300
                             `}></div>
                    </div>
                    <div className="ratings flex flex-col items-center justify-center pt-1 w-full">
                      <div className="flex items-center justify-center space-x-[2px] text-yellow-500" style={{ lineHeight: '1', height: '22px' }}>
                        {Array.from({ length: 5 }).map((_, i) => {
                    const rating = card?.Review || 0;
                    if (i + 1 <= Math.floor(rating))
                        return <FaStar key={i} className="text-[13px]"/>;
                    else if (i < rating)
                        return <FaStarHalf key={i} className="text-[13px]"/>;
                    return null;
                })}
                      </div>
                      <p className="text-xs text-gray-600 mt-[2px]">{card?.ChatOrders} orders</p>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 text-blue-500">
                    <MdVerified className="w-5 h-5"/>
                  </div>

                  <div className="right-side flex-1 min-w-0">
                    <div onClick={() => {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem("AstroIDCallChat", card?.ID);
                        sessionStorage.setItem("selectedAstrologer", JSON.stringify(card));
                    }
                    router.push(`/chat-to-astrologers/${card.DisplayName}`);
                }} className="cursor-pointer flex items-center justify-between">
                      <div className="text-base sm:text-lg font-[700] mb-1 sm:mb-2 name">
                        <h5 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 truncate">{card?.DisplayName}</h5>
                      </div>
                    </div>

                    <div className="specs flex flex-col gap-1 text-xs sm:text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <LiaAwardSolid className="text-sm"/>
                        <p>{card?.skillsValue || "N/A"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <IoLanguage className="text-sm"/>
                        <p>{card?.LanguageValue || "N/A"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdOutlineCases className="text-sm"/>
                        <p>{card?.ExperiencedYears} {t("years")}</p>
                      </div>

                      {card?.FreeState === "Free" ? (<div>
                          <p className="text-red-600 font-semibold">Free Chat</p>
                        </div>) : (<div className="flex items-center gap-2">
                          <TbCurrencyRupee className="text-sm"/>
                          {card?.OriginalPricePerMin && card?.PricePerMin !== card?.OriginalPricePerMin ? (<>
                              <p>{card?.PricePerMin} {t("perMinute")}</p>
                              <p className="line-through text-gray-500">
                                {card?.OriginalPricePerMin} {t("perMinute")}
                              </p>
                            </>) : (<p>{card?.PricePerMin || "N/A"} {t("perMinute")}</p>)}
                        </div>)}
                    </div>
                  </div>

                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 contact right-2 sm:right-3">
                    <button type="button" className={`w-20 sm:w-24 px-3 sm:px-4 md:px-5 py-1 border-2 hover:scale-105 duration-300 rounded-xl flex justify-center items-center gap-1 sm:gap-2
                         ${card?.Isbusy
                    ? "border-red-600 hover:shadow-red-400/60"
                    : isOnline
                        ? "border-green-600 hover:shadow-green-400/60"
                        : "border-gray-600 hover:shadow-gray-400/60"}`} style={{ minHeight: '36px', touchAction: 'manipulation' }} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!UserLoginId || UserLoginId.length === 0) {
                        setIsModalOpen(true);
                        return;
                    }
                    if (ChatPopUpStatus === true || ChatPopUpStatus === "true") {
                        toastifyInfo("You are already on the list");
                        return;
                    }
                    const price = parseFloat(card?.PricePerMin);
                    if (!price || isNaN(price)) {
                        toastifyInfo("Astrologer Price Invalid");
                        return;
                    }
                    setAstroName(card?.FirstName);
                    setPricePerMinastro(price);
                    if (card?.FreeState === "Free") {
                        loginOrChatModal(card);
                    }
                    else if (card?.FreeState === "Not Free") {
                        const requiredAmount = price * 5;
                        const currentBalance = loginUserData?.WalletAmt || 0;
                        
                        if (currentBalance < requiredAmount) {
                            setInsufficientBalanceData({
                                requiredAmount: requiredAmount,
                                currentBalance: currentBalance,
                                astrologerName: card?.FirstName || 'Astrologer'
                            });
                            setShowInsufficientBalancePopup(true);
                        } else {
                            loginOrChatModal(card);
                        }
                    }
                }}>
                      <p className={`text-xs sm:text-sm font-bold
                           ${card?.Isbusy
                    ? "text-red-700"
                    : isOnline
                        ? "text-green-700"
                        : "text-gray-700"}`}>
                        {t("chat")}
                      </p>
                    </button>

                    {(card?.Isbusy) && (<div className="mt-2 w-full flex justify-center">
                        <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-[2px] rounded-full shadow-sm text-[11px] font-medium">
                          <span className="blink text-[14px] leading-none">•</span>
                          <span>Busy</span>
                          <span className="ml-1 text-red-700">
                            ({BusyTimes?.[card?.ID]
                        ? `${hmsToMinutes(BusyTimes[card?.ID])} min`
                        : card?.BusyTime
                            ? (typeof card.BusyTime === "string" && card.BusyTime.includes(":")
                                ? `${hmsToMinutes(card.BusyTime)} min`
                                : `${card.BusyTime} min`)
                            : `0 min`})
                          </span>
                        </div>
                      </div>)}
                  </div>
                </div>);
        }))}
        </div>

        {AstroNameHomePage && (<div className="flex justify-center mt-8">
            <button className="bg-orange-400 text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-orange-500 transition" onClick={() => { setastrologerdata(astrologers); setAstroNameHomePage(null); setSearchVal(''); }}>
              View All Astrologers
            </button>
          </div>)}
      </div>

      <CustomModal isOpen={Callstatus} onClose={() => setCallstatus(false)} title="Call Confirmation">
        <p className="text-center text-gray-600 text-base mt-4">
          Minimum balance of <span className="text-gray-800 font-medium">5 minutes {GetPrice}</span> is required to start a Chat with {astroName || popupData?.AstroName}.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300" onClick={() => setCallstatus(false)}>
            Cancel
          </button>
          <button type="button" className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
              ${isNavigating
            ? 'bg-orange-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 active:scale-95'} text-white`} onClick={() => {
            setIsNavigating(true);
            router.push('/plans');
        }} disabled={isNavigating}>
            {isNavigating ? (<>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>) : (<>
                <span>⚡</span>
                Recharge
              </>)}
          </button>
        </div>
      </CustomModal>

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Login Required">
        <h5 className="text-lg sm:text-xl mb-4 sm:mb-5 text-center">Please login to chat with astrologers</h5>
        <div className="flex justify-center">
          <button className="bg-orange-500 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow hover:shadow-lg transition duration-300 text-sm sm:text-base" onClick={() => {
            router.push('/login');
        }}>
            Go to Login
          </button>
        </div>
      </CustomModal>

      <InsufficientBalancePopup
        isOpen={showInsufficientBalancePopup}
        onClose={() => setShowInsufficientBalancePopup(false)}
        requiredAmount={insufficientBalanceData.requiredAmount}
        currentBalance={insufficientBalanceData.currentBalance}
        astrologerName={insufficientBalanceData.astrologerName}
      />
    </>);
};
export default ChatToAstrologers;
