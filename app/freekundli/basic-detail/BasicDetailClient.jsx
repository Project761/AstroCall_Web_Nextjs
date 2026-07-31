'use client';

import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaChevronRight, FaChevronLeft, FaCommentDots, FaShieldAlt, FaBolt, FaStar,
  FaCheckCircle, FaExclamationTriangle, FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt,
  FaEdit, FaDownload, FaShareAlt, FaBookmark, FaChartPie, FaOm, FaPrayingHands,
  FaFileAlt, FaPhone, FaVideo, FaArrowUp,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { TokenWithDeleteUpadateAdd, getPostData } from "../../utils/api";
import { OrbitProgress } from "react-loading-indicators";
import ChatCallPopup from "@/app/components/ChatCallPopup";
import { MenuContext } from "@/app/context/MenuContext";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";
const CARD = "rounded-xl border border-gray-100 bg-white shadow-sm";

const SIDEBAR_LINKS = [
  { label: "My Kundli", tab: "Kundli", href: null },
  { label: "Kundli by Details", tab: null, href: "/freekundli" },
  { label: "Kundli Matching", tab: null, href: "/kundali-matching" },
  { label: "Manglik Check", tab: "Mangal Dosha", href: null },
  { label: "Panchang", tab: null, href: "/today-panchang" },
];

const CHART_TABS = [
  { id: "Lagna Chart", icon: FaChartPie },
  { id: "Navamsa Chart", icon: FaOm },
  { id: "Planetary Positions", icon: FaStar },
  { id: "Dasha Info", icon: FaClock },
];

const MORE_TABS = ["Basic", "Charts", "Sade Sati", "Mangal Dosha", "Kalsarpa Doshas"];

const DIVISIONAL = [
  { id: "D9", label: "D9 Navamsa", sub: "Marriage & Dharma", chart: "D9Chartkundli" },
  { id: "D10", label: "D10 Dashamsa", sub: "Career & Profession", chart: "D10Chart" },
  { id: "D7", label: "D7 Saptamsa", sub: "Children & Progeny", chart: "D7Chart" },
  { id: "D12", label: "D12 Dwadasamsa", sub: "Parents & Ancestors", chart: "D12Chart" },
];

const TRUST_ITEMS = [
  { icon: FaBolt, title: "Accurate Calculations", sub: "Vedic precision" },
  { icon: FaStar, title: "Detailed Planetary Analysis", sub: "Complete graha report" },
  { icon: FaPrayingHands, title: "Personalized Remedies", sub: "Expert suggestions" },
  { icon: FaCommentDots, title: "Expert Guidance", sub: "Chat with astrologers" },
];

const formatTime12 = (h, m) => {
  const hour = Number(h);
  const min = String(m ?? 0).padStart(2, "0");
  if (Number.isNaN(hour)) return "--";
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${min} ${ampm}`;
};

const formatDob = (day, month, year) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const m = months[Number(month) - 1] || month;
  return `${day} ${m} ${year}`;
};

const ChartLoader = () => (
  <div className="flex justify-center p-8"><OrbitProgress color="#FF5C00" size="medium" style={{ alignItems: "center" }} text="" textColor="" /></div>
);


const BasicDetailClient = () => {
  const router = useRouter();
  const getLocalStorageItem = (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || '';
    }
    return '';
  };

  const UserLoginId = getLocalStorageItem("UserLoginId");
  const BasicDetailID = getLocalStorageItem("BasicDetailID");
  const { LanguageDropdown, GetData_ActivityLog } = useContext(MenuContext);
  const id = BasicDetailID;

  const isFetchingRef = useRef(false);
  const [activeTab, setActiveTab] = useState("Kundli");
  const [chartViewTab, setChartViewTab] = useState("Lagna Chart");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [onclickdata, setonclickdata] = useState();
  const [region, setRegion] = useState("north");
  const [regionkundli, setRegionkundli] = useState("north");
  const [lonData, setlonData] = useState()
  const [latData, setlatData] = useState()
  const [datetimeData, setdatetimeData] = useState()
  const [p1_place, setp1_place] = useState();
  const [p1_gender, setp1_gender] = useState();
  const [p1_full_name, setp1_full_name] = useState();

  // ---------------------Chart-----------------------------


  const [D1Chart, setD1Chart] = useState('');
  const [D2Chart, setD2Chart] = useState('');
  const [D3Chart, setD3Chart] = useState('');
  const [D4Chart, setD4Chart] = useState('');
  const [D7Chart, setD7Chart] = useState('');
  const [D9Chart, setD9Chart] = useState('');
  const [D10Chart, setD10Chart] = useState('');
  const [D12Chart, setD12Chart] = useState('');
  const [D16Chart, setD16Chart] = useState('');
  const [D60Chart, setD60Chart] = useState('');
  const [D20Chart, setD20Chart] = useState('');
  const [D24Chart, setD24Chart] = useState('');
  const [D27Chart, setD27Chart] = useState('');
  const [D30Chart, setD30Chart] = useState('');
  const [D40Chart, setD40Chart] = useState('');
  const [D45Chart, setD45Chart] = useState('');
  const [ChalitChart, setChalitChart] = useState('');
  const [SUNChart, setSUNChart] = useState('');
  const [MOONChart, setMOONChart] = useState('');
  const [D1ChartKundli, setD1ChartKundli] = useState('');
  const [D9Chartkundli, setD9ChartKundli] = useState('');
  const [kalsarpadata, setkalsarpadata] = useState()
  const [currentLevel, setCurrentLevel] = useState("maha_dasha");
  const [currentData, setCurrentData] = useState([]);
  const [selectedMaha, setSelectedMaha] = useState(null);
  const [selectedAntar, setSelectedAntar] = useState(null);
  const [PlanetData, setPlanetData] = useState()
  const [SadeSatiData, setSadeSatiData] = useState()
  const [MangalDoshaData, setMangalDoshaData] = useState()
 


  const Handleclickchartstyle = (buttonName) => {
    setRegion(buttonName === "North Indian" ? "north" : "south");
  };

  const prevRegionKundliRef = useRef(regionkundli);
  const HandleclickchartstyleKundli = (buttonName) => {
    setRegionkundli(buttonName === "North Indian" ? "north" : "south");
  };


  const steps = [
    { label: "Mahadasha", key: "maha_dasha" },
    { label: "Antardasha", key: "antar_dasha" },
    { label: "Pratyantardasha", key: "pratyantar_dasha" },
    { label: "Sookshmadasha", key: "sookshmadasha" }
  ];


  useEffect(() => {
    if (UserLoginId) {
      GetData_ActivityLog("FreeKundli Generate", `Viewed FreeKundli Details`);
    }
  }, [UserLoginId]);

  const Get_Data_Kundli = useCallback(async (detailsData) => {
    const val = {
      "p1_Date": `${detailsData?.Year}-${String(detailsData?.Month).padStart(2, "0")
        }-${String(detailsData?.Day).padStart(2, "0")
        }T${String(detailsData?.Hours).padStart(2, "0")
        }:${String(detailsData?.Minute).padStart(2, "0")
        }:${String(detailsData?.Second).padStart(2, "0")
        }`,
      "p1_full_name": detailsData?.Name,
      "p1_gender": detailsData?.Gender,
      "p1_place": detailsData?.PlaceOfBirth,
      "p1_lat": detailsData?.Latitude,
      "p1_lon": detailsData?.Longitude,
      "p1_tzone": "5.5",
      "lan": "en"
    }
    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/Basic_Astrologer_Details', val);
      const { data } = res;
      const parseData = JSON.parse(data);
    
      if (parseData?.msg && parseData.msg.length > 0) {
        const apiData = parseData.msg[0];
      
        setonclickdata(apiData);
        setlonData(apiData.longitude);
        setlatData(apiData.latitude);
        setdatetimeData(`${apiData.year}-${String(apiData.month).padStart(2, "0")}-${String(apiData.day).padStart(2, "0")}T${String(apiData.hour).padStart(2, "0")}:${String(apiData.minute).padStart(2, "0")}:00`);
        setp1_place(apiData.place);
        setp1_gender(apiData.gender);
        setp1_full_name(apiData.full_name);
       
      } else if (parseData?.data) {
       
        setonclickdata(parseData.data);
        setlonData(parseData.data.longitude);
        setlatData(parseData.data.latitude);
        setdatetimeData(`${parseData.data.year}-${String(parseData.data.month).padStart(2, "0")}-${String(parseData.data.day).padStart(2, "0")}T${String(parseData.data.hour).padStart(2, "0")}:${String(parseData.data.minute).padStart(2, "0")}:00`);
        setp1_place(parseData.data.place);
        setp1_gender(parseData.data.gender);
        setp1_full_name(parseData.data.full_name);
      } 
    } catch (error) {
      console.error('Error fetching data for Kundli Matching:', error);
    }
  }, []);

  const Get_Data_Details = useCallback(async (kundliId) => {
    await Promise.resolve();
    const val = {
      UserId: UserLoginId,
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliDetails/GetData_KundaliDetails", val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.Table;
      const FilterData = Data?.filter((item) => item?.Id == kundliId);
      if (FilterData && FilterData.length > 0) {
        Get_Data_Kundli(FilterData[0])
      } 
    } catch (error) {
      console.log(error, "error");
    }
  }, [UserLoginId, Get_Data_Kundli]);

  useEffect(() => {
    if (id) {
      void (async () => { await Get_Data_Details(id); })();
    }
  }, [id, Get_Data_Details])


  // ---------------------------------- Other Api useEffect (moved below API callbacks) ---------------------------------------------------------------------------------------------------------------------------------


  // -----------------------------------Chart useEffect (moved below API callbacks) --------------------------------------------------------------------------------------------------------------------------------------

  const getAstroHoroscopeChart_kundli_D1 = async () => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": LanguageDropdown,
      "show_planet_degree": "1",
      "show_planet_retro": "1",
      "show_modern_planets": "1",
      "planet_color": "#333333",
      "sign_color": "#333333",
      "line_color": "#333333",
      "chart_color": "#ffffff",
      "chart_type": regionkundli,
      "ChartId": "D1"
    };

    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/horoscope_chart', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data
      if (Data?.svg) {
        setD1ChartKundli(Data?.svg);
      }
      // if (parseData?.svg) {
      //     setD1ChartKundli(parseData.svg);
      // }
    } catch (error) {
      console.error(`Error fetching chart ${chartId}:`, error);
    }
  };

  const getAstroHoroscopeChart_kundli_D9 = async () => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": LanguageDropdown,
      "show_planet_degree": "1",
      "show_planet_retro": "1",
      "show_modern_planets": "1",
      "planet_color": "#333333",
      "sign_color": "#333333",
      "line_color": "#333333",
      "chart_color": "#ffffff",
      "chart_type": regionkundli,
      "ChartId": "D1"
    };

    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/horoscope_chart', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data
      if (Data?.svg) {
        setD9ChartKundli(Data?.svg);
      }
    } catch (error) {
      console.error(`Error fetching chart ${chartId}:`, error);
    }
  };

  const getAstroHoroscopeChart = async (ChartId) => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": LanguageDropdown,
      "show_planet_degree": "1",
      "show_planet_retro": "1",
      "show_modern_planets": "1",
      "planet_color": "#333333",
      "sign_color": "#333333",
      "line_color": "#333333",
      "chart_color": "#ffffff",
      "chart_type": region,
      ChartId
    };

    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/horoscope_chart', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data
      if (Data?.svg) {
        setChart(ChartId, Data.svg);
      }
    } catch (error) {
      console.error(`Error fetching chart ${ChartId}:`, error);
    }
  };

  const setChart = (chartId, svgData) => {
    switch (chartId) {
      case "chalit":
        setChalitChart(svgData);
        break;
      case "SUN":
        setSUNChart(svgData);
        break;
      case "MOON":
        setMOONChart(svgData);
        break;
      case "D1":
        setD1Chart(svgData);
        break;
      case "D2":
        setD2Chart(svgData);
        break;
      case "D3":
        setD3Chart(svgData);
        break;
      case "D4":
        setD4Chart(svgData);
        break;
      case "D7":
        setD7Chart(svgData);
        break;
      case "D9":
        setD9Chart(svgData);
        break;
      case "D10":
        setD10Chart(svgData);
        break;
      case "D12":
        setD12Chart(svgData);
        break;
      case "D16":
        setD16Chart(svgData);
        break;
      case "D20":
        setD20Chart(svgData);
        break;
      case "D24":
        setD24Chart(svgData);
        break;
      case "D27":
        setD27Chart(svgData);
        break;
      case "D30":
        setD30Chart(svgData);
        break;
      case "D40":
        setD40Chart(svgData);
        break;
      case "D45":
        setD45Chart(svgData);
        break;

      case "D60":
        setD60Chart(svgData);
        break;
      default:
        console.warn(`Unknown chart ID: ${chartId}`);
    }
  };

  // -----------------------------------------------------------------Kundli-------------------------------------------------------------------------------------------------------------------
  const Get_Data_PlanetPanchang = async () => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": "en",
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/kp_planetary_positions", val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data;
      if (Data) {
        setPlanetData(Data);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  // -------------------------------------------------Sade Sati--------------------------------------------------------------------------------------------------------------------------------
  const Get_Data_SadeSati = async () => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": LanguageDropdown
    };
    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/sadhe_sati', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data
      if (Data) {
        setSadeSatiData(Data)
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  // --------------------------------------------------------------------------------------------------Mangal Dosha----------------------------------------------------------------------------
  const Get_Data_ManglicDosh = async () => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": "en"
    };
    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/manglik_dosha', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data
      if (Data) {
        setMangalDoshaData(Data)
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const getAntarPart = (value = '') => {
    const parts = String(value).split('-');
    return parts.length > 1 ? parts[parts.length - 1].trim() : String(value).trim();
  };

  const Get_Data_vimshottari_dasha = async (dasha_type, selectedMaha, selectedAntar, selectedsookshma) => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": LanguageDropdown,
      "dasha_type": dasha_type,
      "maha_dasha": selectedMaha,
      "antar_dasha": getAntarPart(selectedAntar),
      "pratyantar_dasha": getAntarPart(selectedsookshma)
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/vimshottari_dasha", val);
      const parsed = JSON.parse(res.data);
      // console.log(parsed, 'parsed')
      if (parsed) {
        const rows = Object.entries(parsed).map(([planet, info]) => ({
          planet: info.Planet,
          start: info.StartDate,
          end: info.EndDate,
        }));
        setCurrentData(rows);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRowClick = (row, level) => {
    if (level === "maha_dasha") {
      setSelectedMaha(row.planet);
      setCurrentLevel("antar_dasha");
      Get_Data_vimshottari_dasha("antar-dasha", row.planet, null, null);
    }
    else if (level === "antar_dasha") {
      setSelectedAntar(row.planet);
      setCurrentLevel("pratyantar_dasha");
      Get_Data_vimshottari_dasha("pratyantar-dasha", selectedMaha, row.planet, null);
    }
    else if (level === "pratyantar_dasha") {
      setCurrentLevel("sookshmadasha");
      Get_Data_vimshottari_dasha("sookshma-dasha", selectedMaha, selectedAntar, row.planet,);
    }
  };

  const handleBack = () => {
    if (currentLevel === "sookshmadasha") {
      setCurrentLevel("pratyantar_dasha");
      Get_Data_vimshottari_dasha("pratyantar-dasha", selectedMaha, selectedAntar, null);
    }
    else if (currentLevel === "pratyantar_dasha") {
      setCurrentLevel("antar_dasha");
      Get_Data_vimshottari_dasha("antar-dasha", selectedMaha, null, null);
    }
    else if (currentLevel === "antar_dasha") {
      setCurrentLevel("maha_dasha");
      Get_Data_vimshottari_dasha("maha-dasha", null, null, null);
    }
  };

  // ---------------------------------------------------------------------------Kaalsarp Doshas------------------------------------------------------------------------------------------
  const Get_Data_kalsarpa_details = async () => {
    const val = {
      "p1_Date": datetimeData,
      "p1_full_name": p1_full_name,
      "p1_gender": p1_gender,
      "p1_place": p1_place,
      "p1_lat": latData,
      "p1_lon": lonData,
      "p1_tzone": "5.5",
      "lan": LanguageDropdown
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/kaal_sarpa_yoga", val);
      // console.log(res, 'res')
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.data
      if (Data) {
        setkalsarpadata(Data)
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (UserLoginId && datetimeData && latData && lonData && activeTab && regionkundli && LanguageDropdown) {
        isFetchingRef.current = true;
        try {
          const promises = [];

          if (activeTab === "Kundli" && prevRegionKundliRef.current === regionkundli) {
            promises.push(Get_Data_PlanetPanchang());
            promises.push(Get_Data_vimshottari_dasha("maha-dasha", null, null, null));
            promises.push(Get_Data_ManglicDosh());
            promises.push(Get_Data_kalsarpa_details());
          }

          if (activeTab === "Kundli" && (regionkundli === "north" || regionkundli === "south")) {
            promises.push(getAstroHoroscopeChart_kundli_D1(regionkundli));
            promises.push(getAstroHoroscopeChart_kundli_D9(regionkundli));
          }

          if (activeTab === "Sade Sati") {
            promises.push(Get_Data_SadeSati());
          } else if (activeTab === "Mangal Dosha") {
            promises.push(Get_Data_ManglicDosh());
          } else if (activeTab === "Kalsarpa Doshas") {
            promises.push(Get_Data_kalsarpa_details());
          }

          if (promises.length > 0) {
            await Promise.all(promises);
          }

          prevRegionKundliRef.current = regionkundli;

        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          isFetchingRef.current = false;
        }
      }
    };

    void fetchData();
  }, [UserLoginId, datetimeData, latData, lonData, LanguageDropdown, activeTab, regionkundli]);

  useEffect(() => {
    const fetchData = async () => {
      if (UserLoginId && datetimeData && latData && lonData && region && LanguageDropdown) {
        try {
          isFetchingRef.current = true;
          if (activeTab === "Charts") {
            const chartIds = [
              "chalit", "SUN", "MOON",
              "D1", "D2", "D3", "D4", "D7",
              "D9", "D10", "D12", "D16", "D20",
              "D24", "D27", "D30", "D40", "D45",
              "D60",
            ];

            await Promise.all(chartIds?.map((chartId) => getAstroHoroscopeChart(chartId)));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          isFetchingRef.current = false;
        }
      }
    };
    void fetchData();
  }, [UserLoginId, datetimeData, latData, lonData, region, LanguageDropdown, activeTab]);


  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ascPlanet = PlanetData?.planets?.find((p) => /asc/i.test(p?.name || ""));
  const lagnaSign = ascPlanet?.sign || PlanetData?.planets?.[0]?.sign || "—";
  const manglikPresent = MangalDoshaData?.is_manglik === true || MangalDoshaData?.is_manglik === "true" || MangalDoshaData?.manglik === true || MangalDoshaData?.manglik === "true";
  const kalsarpaPresent = kalsarpadata?.result === "true" || kalsarpadata?.result === true;
  const housesMap = (PlanetData?.planets || []).reduce((acc, p) => {
    const h = p?.house;
    if (h) {
      if (!acc[h]) acc[h] = [];
      acc[h].push(p);
    }
    return acc;
  }, {});
  const houseLabels = ["1st House", "2nd House", "3rd House", "4th House", "5th House", "6th House", "7th House", "8th House", "9th House", "10th House", "11th House", "12th House"];

  const renderChartSvg = (svg) => (
    svg?.length > 0
      ? <div className="mx-auto w-full max-w-sm [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      : <ChartLoader />
  );

  const chartTabCls = (id) =>
    `flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition sm:text-sm ${chartViewTab === id ? "text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:border-orange-200"}`;

  const sidebarItemCls = (tab) =>
    `flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${activeTab === tab ? "bg-orange-50 text-[#FF5C00]" : "text-gray-600 hover:bg-gray-50"}`;

  const tabCls = (tab) =>
    `px-4 sm:px-6 py-3 text-sm sm:text-base font-bold whitespace-nowrap transition flex-shrink-0 ${activeTab === tab ? "border-b-2 border-[#FF5C00] text-[#FF5C00]" : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"}`;

  return (

    <>

      {/* <Header /> */}
      <div className="min-h-screen bg-[#F5F6F8] pt-[72px] pb-28">
       
        <div className="main-container px-4 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

            {/* Mobile nav */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {SIDEBAR_LINKS.map(({ label, tab, href }) => (
                <button key={label} type="button" onClick={() => { if (href) router.push(href); else if (tab) setActiveTab(tab); }} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${activeTab === (tab || "Kundli") ? "text-white" : "border border-gray-200 bg-white text-gray-600"}`} style={activeTab === (tab || "Kundli") ? { backgroundColor: ORANGE } : {}}>
                  {label}
                </button>
              ))}
            </div>

            {/* Left Sidebar */}
            <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
              <button type="button" onClick={() => router.push("/freekundli")} className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF5C00]">
                <FaChevronLeft size={12} /> Back to Free Kundli
              </button>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Kundli</p>
              <nav className="space-y-1">
                {SIDEBAR_LINKS.map(({ label, tab, href }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => { if (href) router.push(href); else if (tab) setActiveTab(tab); }}
                    className={sidebarItemCls(tab || "Kundli")}
                  >
                    <FaOm size={14} className={activeTab === (tab || "Kundli") ? "text-[#FF5C00]" : "text-gray-400"} />
                    {label}
                  </button>
                ))}
              </nav>

              <div className={`mt-5 overflow-hidden ${CARD}`}>
                <div className="relative h-28 bg-orange-50">
                  <Image src="/images/ChatBanner.png" alt="" fill className="object-cover" sizes="240px" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-[#0F172A]">Need a Detailed Kundli Analysis?</p>
                  <p className="mt-1 text-[10px] text-gray-500">Get personalized insights from expert astrologers.</p>
                  <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="mt-3 w-full rounded-lg py-2 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>Chat with Astrologer</button>
                </div>
              </div>

              <div className={`mt-4 p-3 ${CARD}`}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Reports & Remedies</p>
                {[{ l: "Kundli Report", t: "Kundli" }, { l: "Dosha Analysis", t: "Mangal Dosha" }, { l: "Remedies", t: "Sade Sati" }].map(({ l, t }) => (
                  <button key={l} type="button" onClick={() => setActiveTab(t)} className="flex w-full items-center gap-2 py-2 text-left text-xs font-semibold text-gray-600 hover:text-[#FF5C00]">
                    <FaFileAlt size={12} className="text-[#FF5C00]" /> {l}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5">
                <FaShieldAlt className="text-green-600" size={14} />
                <span className="text-[10px] font-semibold text-green-700">100% Secure & Confidential</span>
              </div>
            </aside>

            {/* Main Column */}
            <div className="min-w-0 flex-1">

              {activeTab === "Kundli" && (
                <>
                  {/* Header Card */}
                  <div className={`mb-4 p-4 sm:p-5 ${CARD}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-xl font-extrabold text-[#0F172A] sm:text-2xl">My Kundli</h1>
                          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-600">
                            <FaCheckCircle size={10} /> Verified
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">
                          Kundli ID: {BasicDetailID || "—"} · Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {[
                            { icon: FaUser, label: "Name", val: onclickdata?.full_name || p1_full_name || "—" },
                            { icon: FaClock, label: "Time of Birth", val: formatTime12(onclickdata?.hour, onclickdata?.minute) },
                            { icon: FaCalendarAlt, label: "Date of Birth", val: onclickdata ? formatDob(onclickdata.day, onclickdata.month, onclickdata.year) : "—" },
                            { icon: FaMapMarkerAlt, label: "Place of Birth", val: onclickdata?.place || p1_place || "—" },
                          ].map(({ icon: Icon, label, val }) => (
                            <div key={label} className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
                              <Icon size={14} className="mt-0.5 shrink-0 text-[#FF5C00]" />
                              <div>
                                <p className="text-[10px] font-semibold uppercase text-gray-400">{label}</p>
                                <p className="text-sm font-bold text-[#0F172A]">{val}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="relative mx-auto h-28 w-40 shrink-0 sm:h-32 sm:w-48">
                        <Image src="/horoimg/1.png" alt="" fill className="object-contain" sizes="200px" />
                      </div>
                      <div className="flex flex-row gap-2 lg:flex-col">
                        {[
                          { icon: FaEdit, label: "Edit Details", action: () => router.push("/freekundli") },
                          { icon: FaDownload, label: "Download PDF", action: () => {} },
                          { icon: FaShareAlt, label: "Share Kundli", action: () => {} },
                          { icon: FaBookmark, label: "Save Kundli", action: () => {} },
                        ].map(({ icon: Icon, label, action }) => (
                          <button key={label} type="button" onClick={action} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-orange-100 bg-orange-50/50 px-3 py-2 text-xs font-bold text-[#FF5C00] transition hover:bg-orange-50 lg:flex-none lg:justify-start lg:px-4">
                            <Icon size={12} /> {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chart style toggle */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {["North Indian", "South Indian"].map((buttonName) => (
                      <button
                        key={buttonName}
                        type="button"
                        onClick={() => HandleclickchartstyleKundli(buttonName)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${regionkundli === (buttonName === "North Indian" ? "north" : "south") ? "text-white" : "border border-gray-200 bg-white text-gray-600"}`}
                        style={regionkundli === (buttonName === "North Indian" ? "north" : "south") ? { backgroundColor: ORANGE } : {}}
                      >
                        {buttonName}
                      </button>
                    ))}
                  </div>

                  {/* Chart Tabs */}
                  <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
                    {CHART_TABS.map(({ id, icon: Icon }) => (
                      <button key={id} type="button" onClick={() => setChartViewTab(id)} className={chartTabCls(id)} style={chartViewTab === id ? { backgroundColor: ORANGE } : {}}>
                        <Icon size={12} /> {id}
                      </button>
                    ))}
                    <div className="relative">
                      <button type="button" onClick={() => setShowMoreMenu((v) => !v)} className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600">
                        ··· More
                      </button>
                      {showMoreMenu && (
                        <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                          {MORE_TABS.map((t) => (
                            <button key={t} type="button" onClick={() => { setActiveTab(t); setShowMoreMenu(false); }} className="block w-full px-4 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-[#FF5C00]">{t}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main grid: content + right widgets */}
                  <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
                    <div className="space-y-4">
                      {(chartViewTab === "Lagna Chart" || chartViewTab === "Navamsa Chart") && (
                        <div className={`p-4 ${CARD}`}>
                          <h2 className="mb-3 text-sm font-bold text-[#0F172A]">{chartViewTab === "Lagna Chart" ? "Lagna Chart (D1)" : "Navamsa Chart (D9)"}</h2>
                          {chartViewTab === "Lagna Chart" ? renderChartSvg(D1ChartKundli) : renderChartSvg(D9Chartkundli)}
                        </div>
                      )}

                      {chartViewTab === "Planetary Positions" && PlanetData?.planets && (
                        <div className={`overflow-hidden ${CARD}`}>
                          <div className="border-b border-gray-100 px-4 py-3">
                            <h2 className="text-sm font-bold text-[#0F172A]">Planetary Positions</h2>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                  {["Planet", "Sign", "House", "Degree", "Nakshatra", "Pada", "Retro"].map((h) => (
                                    <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {PlanetData.planets.map((planet, i) => (
                                  <tr key={i} className="border-t border-gray-50 hover:bg-orange-50/30">
                                    <td className="px-3 py-2 font-bold text-[#0F172A]">{planet?.name}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.sign}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.house}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.longitude}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.nakshatra}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.nakshatra_pada}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.is_retro === "true" ? "Yes" : "No"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {(chartViewTab === "Lagna Chart") && PlanetData?.planets && (
                        <div className={`overflow-hidden ${CARD}`}>
                          <div className="border-b border-gray-100 px-4 py-3">
                            <h2 className="text-sm font-bold text-[#0F172A]">Planetary Positions</h2>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                  {["Planet", "Sign", "Degree", "Nakshatra", "Pada"].map((h) => (
                                    <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {PlanetData.planets.map((planet, i) => (
                                  <tr key={i} className="border-t border-gray-50 hover:bg-orange-50/30">
                                    <td className="px-3 py-2 font-bold text-[#0F172A]">{planet?.name}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.sign}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.longitude}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.nakshatra}</td>
                                    <td className="px-3 py-2 text-gray-600">{planet?.nakshatra_pada}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <button type="button" onClick={() => setChartViewTab("Planetary Positions")} className="w-full border-t border-gray-100 py-2.5 text-xs font-bold text-[#FF5C00] hover:bg-orange-50">
                            View All Planetary Details →
                          </button>
                        </div>
                      )}

                      {chartViewTab === "Dasha Info" && (
                        <div className={`p-4 ${CARD}`}>
                          <h2 className="mb-4 text-sm font-bold text-[#0F172A]">Vimshottari Dasha</h2>
                          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                            {steps.map((step, i) => (
                              <div key={step.key} className={`flex items-center gap-1.5 text-xs ${currentLevel === step.key ? "font-bold text-[#FF5C00]" : "text-gray-400"}`}>
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${currentLevel === step.key ? "bg-[#FF5C00] text-white" : "border border-gray-300"}`}>{i + 1}</span>
                                {step.label}
                                {i !== steps.length - 1 && <span className="mx-1 hidden h-px w-6 bg-gray-200 sm:block" />}
                              </div>
                            ))}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">Planet</th><th className="px-3 py-2 text-left">Start</th><th className="px-3 py-2 text-left">End</th></tr></thead>
                              <tbody>
                                {currentData?.map((row, i) => (
                                  <tr key={i} className="cursor-pointer border-t border-gray-50 hover:bg-orange-50/40" onClick={() => handleRowClick(row, currentLevel)}>
                                    <td className="px-3 py-2 font-bold">{row.planet}</td>
                                    <td className="px-3 py-2">{row.start}</td>
                                    <td className="px-3 py-2">{row.end}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {currentLevel !== "maha_dasha" && (
                            <button type="button" onClick={handleBack} className="mt-4 rounded-full px-6 py-2 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>← Back</button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right widgets */}
                    <div className="space-y-4">
                      <div className={`p-4 ${CARD}`}>
                        <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Kundli Overview</h3>
                        <dl className="space-y-2 text-xs">
                          {[
                            ["Kundli Type", "Vedic Birth Chart"],
                            ["Chart Type", regionkundli === "north" ? "North Indian" : "South Indian"],
                            ["Lagna (Ascendant)", lagnaSign],
                            ["Moon Sign", PlanetData?.planets?.find((p) => p?.name === "Moon")?.sign || "—"],
                            ["Sun Sign", PlanetData?.planets?.find((p) => p?.name === "Sun")?.sign || "—"],
                            ["Nakshatra", onclickdata?.nakshatra || "—"],
                            ["Tithi", onclickdata?.tithi || "—"],
                            ["Yoga", onclickdata?.yoga || "—"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2 border-b border-gray-50 pb-2">
                              <dt className="text-gray-400">{k}</dt>
                              <dd className="font-semibold text-[#0F172A]">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>

                      <div className={`p-4 ${CARD}`}>
                        <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Important Yogas</h3>
                        <ul className="space-y-2 text-xs">
                          {["Gajakesari Yoga", "Budhaditya Yoga", "Chandra Mangal Yoga"].map((y) => (
                            <li key={y} className="flex items-center gap-2 font-semibold text-gray-700">
                              <FaCheckCircle className="text-green-500" size={12} /> {y}
                            </li>
                          ))}
                        </ul>
                        <button type="button" className="mt-3 text-xs font-bold text-[#FF5C00]">View All Yogas →</button>
                      </div>

                      <div className={`p-4 ${CARD}`}>
                        <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Doshas</h3>
                        <ul className="space-y-2 text-xs">
                          {[
                            { n: "Manglik Dosha", present: manglikPresent },
                            { n: "Kaal Sarp Dosha", present: kalsarpaPresent },
                            { n: "Pitru Dosha", present: false },
                            { n: "Nadi Dosha", present: false },
                          ].map(({ n, present }) => (
                            <li key={n} className="flex items-center justify-between">
                              <span className="font-semibold text-gray-700">{n}</span>
                              {present
                                ? <span className="flex items-center gap-1 font-bold text-[#FF5C00]"><FaExclamationTriangle size={10} /> Present</span>
                                : <span className="flex items-center gap-1 font-bold text-green-600"><FaCheckCircle size={10} /> Not Present</span>}
                            </li>
                          ))}
                        </ul>
                        <button type="button" onClick={() => setActiveTab("Mangal Dosha")} className="mt-3 text-xs font-bold text-[#FF5C00]">View Details →</button>
                      </div>

                      <div className={`p-4 ${CARD}`}>
                        <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Life Overview</h3>
                        {[{ l: "Career", v: 85 }, { l: "Finance", v: 72 }, { l: "Love", v: 78 }, { l: "Health", v: 65 }].map(({ l, v }) => (
                          <div key={l} className="mb-3">
                            <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-gray-600">{l}</span><span className="font-bold text-[#FF5C00]">{v}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-green-500" style={{ width: `${v}%` }} /></div>
                          </div>
                        ))}
                        <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="text-xs font-bold text-[#FF5C00]">View Detailed Analysis →</button>
                      </div>
                    </div>
                  </div>

                  {/* Divisional Charts + Dasha Timeline */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className={`p-4 ${CARD}`}>
                      <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Divisional Charts</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "D9 Navamsa", sub: "Marriage & Dharma" },
                          { label: "D10 Dashamsa", sub: "Career & Profession" },
                          { label: "D7 Saptamsa", sub: "Children & Progeny" },
                          { label: "D12 Dwadasamsa", sub: "Parents & Ancestors" },
                        ].map(({ label, sub }) => (
                          <button key={label} type="button" onClick={() => setActiveTab("Charts")} className="rounded-lg border border-gray-100 p-3 text-left transition hover:border-orange-200 hover:bg-orange-50/30">
                            <FaOm className="mb-1 text-[#FF5C00]" size={16} />
                            <p className="text-xs font-bold text-[#0F172A]">{label}</p>
                            <p className="text-[10px] text-gray-400">{sub}</p>
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={() => setActiveTab("Charts")} className="mt-3 text-xs font-bold text-[#FF5C00]">View All Divisional Charts →</button>
                    </div>

                    <div className={`p-4 ${CARD}`}>
                      <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Dasha Timeline</h3>
                      <p className="mb-2 text-[10px] font-semibold uppercase text-gray-400">Vimshottari Dasha</p>
                      <div className="space-y-2 text-xs">
                        {currentData?.slice(0, 4).map((row, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                            <span className="font-bold text-[#0F172A]">{["Maha Dasha", "Antar Dasha", "Pratyantar Dasha", "Sookshma Dasha"][i] || row.planet}</span>
                            <span className="text-gray-500">{row.start} – {row.end}</span>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => setChartViewTab("Dasha Info")} className="mt-3 text-xs font-bold text-[#FF5C00]">View Full Dasha Details →</button>
                    </div>
                  </div>

                  {/* Planets in Houses */}
                  <div className={`mt-4 p-4 ${CARD}`}>
                    <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Planets in Houses</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {houseLabels.map((label, idx) => {
                        const houseNum = idx + 1;
                        const planets = housesMap[houseNum] || [];
                        const sign = planets[0]?.sign || "—";
                        return (
                          <div key={label} className="min-w-[120px] shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                            <p className="text-[10px] font-bold uppercase text-gray-400">{label}</p>
                            <p className="mt-1 text-xs font-bold text-[#0F172A]">{sign}</p>
                            <p className="mt-1 text-[10px] font-semibold text-[#FF5C00]">
                              {planets.length ? planets.map((p) => p.name?.slice(0, 2)).join(", ") : "—"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {activeTab !== "Kundli" && (
                <div className="mb-4 flex items-center gap-2">
                  <button type="button" onClick={() => setActiveTab("Kundli")} className="text-sm font-semibold text-[#FF5C00] hover:underline">← Back to My Kundli</button>
                </div>
              )}

              <div>
                {activeTab === "Basic" && (
                  <div>
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                      {/* Left Section: Basic Details */}
                      <div className="flex-1 border rounded-lg shadow-md bg-white overflow-x-auto">
                        <h2 className="text-base sm:text-lg font-semibold mb-2 text-center p-2 sm:p-3">Basic Details</h2>
                        {/* {onclickdata ? (
                          <div className="mb-4 p-2 bg-gray-100 text-xs">
                            <strong>Debug - Raw Data:</strong> {JSON.stringify(onclickdata, null, 2)}
                          </div>
                        ) : null} */}
                        {onclickdata ? (
                          <table className="table-auto w-full border-collapse border-y border-gray-200 text-xs sm:text-sm">
                            <tbody>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Name</td>
                                <td className="border border-gray-200 p-2 break-words">{onclickdata?.full_name}</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Date</td>
                                <td className="border border-gray-200 p-2">
                                  {onclickdata?.day}/{onclickdata?.month}/{onclickdata?.year}
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Time</td>
                                <td className="border border-gray-200 p-2">
                                  {onclickdata?.hour}:{onclickdata?.minute}
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Place</td>
                                <td className="border border-gray-200 p-2 break-words">{onclickdata?.place}</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Latitude</td>
                                <td className="border border-gray-200 p-2">
                                  {onclickdata?.latitude ? Number(onclickdata?.latitude).toFixed(6) : "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Longitude</td>
                                <td className="border border-gray-200 p-2">
                                  {onclickdata?.longitude ? Number(onclickdata?.longitude).toFixed(6) : "N/A"}
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-gray-200 p-2 font-semibold">Timezone</td>
                                <td className="border border-gray-200 p-2">GMT+{onclickdata?.timezone}</td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-4 flex justify-center">
                            <OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} />
                          </div>
                        )}
                      </div>

                      {/* Right Section: Panchang Details */}
                      <div className="flex-1 border rounded-lg shadow-md bg-white overflow-x-auto">
                        <h2 className="text-base sm:text-lg font-semibold mb-2 text-center p-2 sm:p-3">Panchang Details</h2>
                        <table className="table-auto w-full border-collapse border-y border-gray-200 text-xs sm:text-sm">
                          <tbody>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Tithi</td>
                              <td className="border border-gray-200 p-2 break-words">{onclickdata?.tithi}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Yoga</td>
                              <td className="border border-gray-200 p-2 break-words">{onclickdata?.yoga}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Nakshatra</td>
                              <td className="border border-gray-200 p-2 break-words">{onclickdata?.nakshatra}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Karana</td>
                              <td className="border border-gray-200 p-2 break-words">{onclickdata?.karana}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Sunrise</td>
                              <td className="border border-gray-200 p-2">{onclickdata?.sunrise}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Sunset</td>
                              <td className="border border-gray-200 p-2">{onclickdata?.sunset}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Moonrise</td>
                              <td className="border border-gray-200 p-2">{onclickdata?.moonrise || "N/A"}</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-200 p-2 font-semibold">Moonset</td>
                              <td className="border border-gray-200 p-2">{onclickdata?.moonset || "N/A"}</td>
                            </tr>
                            {/* <tr>
                                                            <td className="border border-gray-200 p-2">Shaka Samvat</td>
                                                            <td className="border border-gray-200 p-2">{onclickdata?.shaka_samvat_name}</td>
                                                        </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Charts" && (
                  <div>
                    <div>
                      <ul className="my-4 sm:my-6 flex justify-center gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-16">
                        {['North Indian', 'South Indian'].map((buttonName) => (
                          <li key={buttonName}>
                            <div
                              className={`bg px-3 sm:px-4 py-2 text-primaryColor rounded-lg sm:rounded-xl border-2 border-orange-400 duration-300 font-[600] 
                                                        ${region === (buttonName === "North Indian" ? "north" : "south") ? "bg-primaryColor text-white" : "text-primaryColor"}`}
                            >
                              <button
                                className="flex items-center gap-2 text-xs sm:text-sm md:text-base w-full"
                                onClick={() => Handleclickchartstyle(buttonName)}
                              >
                                {buttonName}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-6 sm:my-8 md:my-10">

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Chalit Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            ChalitChart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: ChalitChart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>


                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Sun Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            SUNChart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: SUNChart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Moon Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            MOONChart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: MOONChart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Lagna Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D1Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D1Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Hora Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D2Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D2Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Drekkana Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D3Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D3Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Chaturthamsa Chart (Turyamsa)</h4>
                        <div className="overflow-x-auto">
                          {
                            D4Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D4Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Saptamsa Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D7Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D7Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Navamsa Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D9Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D9Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Dasamsa Chart (Karma Chart)</h4>
                        <div className="overflow-x-auto">
                          {
                            D10Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D10Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Dvadasamsa Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D12Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D12Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Shodashamsa Chart (Kalamsa)</h4>
                        <div className="overflow-x-auto">
                          {
                            D16Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D16Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Vishamansha Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D20Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D20Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Chaturvimshamsha Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D24Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D24Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>


                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Bhamsha Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D27Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D27Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Trishamansha Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D30Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D30Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Khavedamsha Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D40Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D40Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Akshvedansha Chart</h4>
                        <div className="overflow-x-auto">
                          {
                            D45Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D45Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>

                      <div className="w-full">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Shastiamsa (Summary of charts)</h4>
                        <div className="overflow-x-auto">
                          {
                            D60Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D60Chart }} /> : <div className="p-4"><OrbitProgress color="#6b716b" size="medium" style={{ alignItems: 'center' }} text="" textColor="" /></div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Sade Sati" && (
                  <div className="py-4 sm:py-6">
                    {/* <h1 className="text-2xl font-bold mb-4">Sade Sati Report</h1> */}
                    <div className="space-y-4 sm:space-y-6">
                      {SadeSatiData ? (
                        <>
                          {/* -------- Basic Info -------- */}
                          <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 px-2">General Information</h2>
                            <div className="overflow-x-auto">
                              <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 text-xs sm:text-sm">
                                <tbody>
                                  {Object.entries(SadeSatiData?.sadhesati || {}).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-gray-50">
                                      <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 capitalize font-semibold whitespace-nowrap">
                                        {key.replace(/_/g, " ")}
                                      </td>
                                      <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 break-words">
                                        {value === true || value === "true"
                                          ? "Yes"
                                          : value === false || value === "false"
                                            ? "No"
                                            : value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>


                          {/* -------- Sadhesati Life Analysis -------- */}
                          <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 px-2">Sadhesati Life Analysis</h2>
                            <div className="overflow-x-auto bg-white">
                              <table className="min-w-full table-auto border-collapse border border-gray-300 text-xs sm:text-sm">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Sign</th>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Phase</th>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Date</th>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Retro</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {SadeSatiData?.sadhesati_life_analysis?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.sign_name}</td>
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.phase}</td>
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.date}</td>
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.is_retro === "true" ? "Yes" : "No"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* -------- Small Panoti -------- */}
                          <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 px-2">Small Panoti</h2>
                            <div className="overflow-x-auto bg-white">
                              <table className="min-w-full table-auto border-collapse border border-gray-300 text-xs sm:text-sm">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Sign</th>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Phase</th>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Date</th>
                                    <th className="border px-2 sm:px-3 md:px-4 py-2 whitespace-nowrap">Retro</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {SadeSatiData?.small_panoti?.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.sign_name}</td>
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.phase}</td>
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.date}</td>
                                      <td className="border px-2 sm:px-3 md:px-4 py-2">{item.is_retro === "true" ? "Yes" : "No"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* -------- Remedies -------- */}
                          <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 mt-8 sm:mt-12 md:mt-16 px-2">Remedies</h2>
                            <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">
                              {SadeSatiData?.remedies?.map((remedy, i) => (
                                <li key={i} className="break-words">{remedy}</li>
                              ))}
                            </ul>
                          </div>

                          {/* -------- Content -------- */}
                          <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 mt-8 sm:mt-12 md:mt-16 px-2">{SadeSatiData?.content?.title}</h2>
                            {SadeSatiData?.content?.description?.map((desc, i) => (
                              <p key={i} className="text-gray-700 mb-2 text-sm sm:text-base leading-relaxed px-2">{desc}</p>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-4 flex justify-center">
                          <OrbitProgress color="#6b716b" size="medium" style={{ alignItems: "center" }} text="" textColor="" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "Mangal Dosha" && (
                  <div>
                    <div className="py-4 sm:py-6">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">Manglik Report</h1>
                      {MangalDoshaData ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border-collapse border border-gray-200 text-xs sm:text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Criteria</th>
                                <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 text-left">Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(MangalDoshaData).map(([key, value], index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 capitalize font-semibold whitespace-nowrap">
                                    {key.replace(/_/g, " ")}
                                  </td>
                                  <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 break-words">
                                    {Array.isArray(value) ? (
                                      value.length > 0 ? (
                                        <ul className="list-disc list-inside">
                                          {value.map((item, i) => (
                                            <li key={i} className="break-words">{item}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        "N/A"
                                      )
                                    ) : typeof value === "boolean" ? (
                                      value ? "Yes" : "No"
                                    ) : (
                                      value?.toString() || "N/A"
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 flex justify-center">
                          <OrbitProgress
                            color="#6b716b"
                            size="medium"
                            style={{ alignItems: "center" }}
                            text=""
                            textColor=""
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "Kalsarpa Doshas" && (
                  <div className="py-4 sm:py-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">KalSarpa Dosha</h1>
                    {kalsarpadata ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse border border-gray-200 text-xs sm:text-sm">
                          <tbody>
                            {Object.entries(kalsarpadata).map(([key, value]) => (
                              <tr key={key} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 font-semibold capitalize whitespace-nowrap">
                                  {key}
                                </td>
                                <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 break-words">
                                  {Array.isArray(value) ? (
                                    <ul className="list-disc pl-3 sm:pl-5 space-y-1">
                                      {value.map((item, i) => (
                                        <li key={i} className="break-words">{item}</li>
                                      ))}
                                    </ul>
                                  ) : typeof value === "object" ? (
                                    JSON.stringify(value)
                                  ) : key === "result" ? (
                                    value === "true" ? "Yes" : "No"
                                  ) : (
                                    value?.toString()
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-4 flex justify-center">
                        <OrbitProgress
                          color="#6b716b"
                          size="medium"
                          style={{ alignItems: "center" }}
                          text=""
                          textColor=""
                        />
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <section className="border-t border-orange-50 py-8" style={{ backgroundColor: CREAM }}>
          <div className="main-container grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
            {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <Icon size={16} className="text-[#FF5C00]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">{title}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sticky bottom actions */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
          <div className="main-container flex items-center justify-center gap-2 sm:gap-4">
            {[
              { icon: FaCommentDots, label: "Chat Now", href: "/chat-to-astrologers" },
              { icon: FaPhone, label: "Call Now", href: "/talk-to-astrologers" },
              { icon: FaVideo, label: "Video Call", href: "/talk-to-astrologers" },
              { icon: FaOm, label: "Book Puja", href: "/online-puja" },
            ].map(({ icon: Icon, label, href }) => (
              <button key={label} type="button" onClick={() => router.push(href)} className="flex flex-1 flex-col items-center gap-0.5 sm:flex-row sm:gap-2 sm:rounded-full sm:border sm:border-orange-100 sm:px-4 sm:py-2">
                <Icon size={16} className="text-[#FF5C00]" />
                <span className="text-[10px] font-bold text-gray-700 sm:text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {showBackTop && (
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: ORANGE }}>
            <FaArrowUp size={14} />
          </button>
        )}
      </div>

      <ChatCallPopup />
      {/* <CommonServies /> */}
      {/* <Horoscope /> */}
      {/* <Footer /> */}
    </>
  );
};

export default BasicDetailClient;
