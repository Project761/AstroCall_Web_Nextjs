"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GiScrollUnfurled } from "react-icons/gi";
import { MdPhoneInTalk } from "react-icons/md";
import { IoIosArrowForward, IoMdChatboxes } from "react-icons/io";
import SEO from "@/app/components/SEO/page.js";
import { TokenWithDeleteUpadateAdd } from "@/app/utils/api";
// Custom Loading Indicator Component
const LoadingIndicator = ({ size = "medium" }) => {
    return (<div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>);
};
const FreeKundliDetailsContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const BasicDetailID = typeof window !== 'undefined' ? localStorage.getItem("BasicDetailID") || '' : '';
    const FreekundliID = searchParams.get('FreekundliID') || BasicDetailID;
    const isFetchingRef = useRef(false);
    const [activeTab, setActiveTab] = useState("Basic");
    const [onclickdata, setonclickdata] = useState();
    const [region, setRegion] = useState("north");
    const [regionkundli, setRegionkundli] = useState("north");
    const [lonData, setlonData] = useState();
    const [latData, setlatData] = useState();
    const [datetimeData, setdatetimeData] = useState();
    const [p1_place, setp1_place] = useState();
    const [p1_gender, setp1_gender] = useState();
    const [p1_full_name, setp1_full_name] = useState();
    // ---------------------Chart-----------------------------
    const [loading, setLoading] = useState(true);
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
    const [kalsarpadata, setkalsarpadata] = useState();
    const [currentLevel, setCurrentLevel] = useState("maha_dasha");
    const [currentData, setCurrentData] = useState([]);
    const [selectedMaha, setSelectedMaha] = useState(null);
    const [selectedAntar, setSelectedAntar] = useState(null);
    const [selectedsookshma, setSelectedsookshma] = useState(null);
    // -----------------------Kundli-------------------------
    const [PlanetData, setPlanetData] = useState();
    // -----------------------Sade Sati----------------------
    const [SadeSatiData, setSadeSatiData] = useState();
    // ----------------------Mangal Dosha--------------------
    const [MangalDoshaData, setMangalDoshaData] = useState();
    // -------------------------------------------------
    const handleclickTalk = () => { router.push('/talk-to-astrologers'); };
    const handleclickChat = () => { router.push('/chat-to-astrologers'); };
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
        // GetData_ActivityLog("FreeKundli Generate", `Viewed FreeKundli Details`);
    }, [UserLoginId]);
    useEffect(() => {
        if (FreekundliID) {
            Get_Data_Details(FreekundliID);
        }
    }, [FreekundliID]);
    const Get_Data_Details = async () => {
        const val = {
            UserId: UserLoginId,
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliDetails/GetData_KundaliDetails", val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const Data = parseData?.Table;
            const FilterData = Data?.filter((item) => item?.Id == FreekundliID);
            if (FilterData) {
                Get_Data_Kundli(FilterData[0]);
            }
        }
        catch (error) {
            console.log(error, "error");
        }
    };
    const Get_Data_Kundli = async (detailsData) => {
        const val = {
            "p1_Date": `${detailsData?.Year}-${String(detailsData?.Month).padStart(2, "0")}-${String(detailsData?.Day).padStart(2, "0")}T${String(detailsData?.Hours).padStart(2, "0")}:${String(detailsData?.Minute).padStart(2, "0")}:${String(detailsData?.Second).padStart(2, "0")}`,
            "p1_full_name": detailsData?.Name,
            "p1_gender": detailsData?.Gender,
            "p1_place": detailsData?.PlaceOfBirth,
            "p1_lat": detailsData?.Latitude,
            "p1_lon": detailsData?.Longitude,
            "p1_tzone": "5.5",
            "lan": "en"
        };
        try {
            const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/Basic_Astrologer_Details', val);
            const { data } = res;
            const parseData = JSON.parse(data);
            if (parseData) {
                setonclickdata(parseData?.data);
                setlonData(parseData?.data.longitude);
                setlatData(parseData?.data.latitude);
                setdatetimeData(`${parseData?.data?.year}-${String(parseData?.data?.month).padStart(2, "0")}-${String(parseData?.data?.day).padStart(2, "0")}T${String(parseData?.data?.hour).padStart(2, "0")}:${String(parseData?.data?.minute).padStart(2, "0")}:00`);
                setp1_place(parseData?.data.place);
                setp1_gender(parseData?.data.gender);
                setp1_full_name(parseData?.data.full_name);
            }
        }
        catch (error) {
            console.error('Error fetching data for Kundli Matching:', error);
        }
    };
    // ---------------------------------- Other Api useEffect---------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            if (UserLoginId && datetimeData && latData && lonData && activeTab && regionkundli) {
                isFetchingRef.current = true;
                try {
                    const promises = [];
                    // Run these API calls only when activeTab is "Kundli" and regionkundli is NOT the only change
                    if (activeTab === "Kundli" && prevRegionKundliRef.current === regionkundli) {
                        promises.push(Get_Data_PlanetPanchang());
                        promises.push(Get_Data_vimshottari_dasha("maha-dasha", null, null, null));
                    }
                    // Only call these APIs when regionkundli changes, without re-calling previous ones
                    if (activeTab === "Kundli" && (regionkundli === "north" || regionkundli === "south")) {
                        promises.push(getAstroHoroscopeChart_kundli_D1(regionkundli));
                        promises.push(getAstroHoroscopeChart_kundli_D9(regionkundli));
                    }
                    if (activeTab === "Sade Sati") {
                        promises.push(Get_Data_SadeSati());
                    }
                    else if (activeTab === "Mangal Dosha") {
                        promises.push(Get_Data_ManglicDosh());
                    }
                    else if (activeTab === "Kalsarpa Doshas") {
                        promises.push(Get_Data_kalsarpa_details());
                    }
                    if (promises.length > 0) {
                        await Promise.all(promises);
                    }
                    // Update the previous regionkundli reference
                    prevRegionKundliRef.current = regionkundli;
                }
                catch (error) {
                    console.error("Error fetching data:", error);
                }
                finally {
                    isFetchingRef.current = false;
                }
            }
        };
        fetchData();
    }, [UserLoginId, datetimeData, latData, lonData, activeTab, regionkundli]);
    // -----------------------------------Chart useEffect --------------------------------------------------------------------------------------------------------------------------------------
    const getAstroHoroscopeChart_kundli_D1 = async () => {
        const val = {
            "p1_Date": datetimeData,
            "p1_full_name": p1_full_name,
            "p1_gender": p1_gender,
            "p1_place": p1_place,
            "p1_lat": latData,
            "p1_lon": lonData,
            "p1_tzone": "5.5",
            "lan": "en",
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
            const Data = parseData?.data;
            if (Data?.svg) {
                setD1ChartKundli(Data?.svg);
            }
        }
        catch (error) {
            console.error(`Error fetching chart D1:`, error);
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
            "lan": "en",
            "show_planet_degree": "1",
            "show_planet_retro": "1",
            "show_modern_planets": "1",
            "planet_color": "#333333",
            "sign_color": "#333333",
            "line_color": "#333333",
            "chart_color": "#ffffff",
            "chart_type": regionkundli,
            "ChartId": "D9"
        };
        try {
            const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/horoscope_chart', val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const Data = parseData?.data;
            if (Data?.svg) {
                setD9ChartKundli(Data?.svg);
            }
        }
        catch (error) {
            console.error(`Error fetching chart D9:`, error);
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
            "lan": "en",
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
            const Data = parseData?.data;
            if (Data?.svg) {
                setChart(ChartId, Data.svg);
            }
        }
        catch (error) {
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
    useEffect(() => {
        const fetchData = async () => {
            if (UserLoginId && datetimeData && latData && lonData && region) {
                try {
                    isFetchingRef.current = true;
                    if (activeTab === "Charts") {
                        // ✅ Explicitly include all required chart IDs
                        const chartIds = [
                            "chalit", "SUN", "MOON",
                            "D1", "D2", "D3", "D4", "D7",
                            "D9", "D10", "D12", "D16", "D20",
                            "D24", "D27", "D30", "D40", "D45",
                            "D60",
                        ];
                        await Promise.all(chartIds?.map((chartId) => getAstroHoroscopeChart(chartId)));
                    }
                    setLoading(false);
                }
                catch (error) {
                    console.error("Error fetching data:", error);
                }
                finally {
                    isFetchingRef.current = false;
                }
            }
        };
        fetchData();
    }, [UserLoginId, datetimeData, latData, lonData, region, activeTab]);
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
        }
        catch (error) {
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
            "lan": "en"
        };
        try {
            const res = await TokenWithDeleteUpadateAdd('KundaliMatchMaking/sadhe_sati', val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const Data = parseData?.data;
            if (Data) {
                setSadeSatiData(Data);
            }
        }
        catch (error) {
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
            const Data = parseData?.data;
            if (Data) {
                setMangalDoshaData(Data);
            }
        }
        catch (error) {
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
            "lan": "en",
            "dasha_type": dasha_type,
            "maha_dasha": selectedMaha,
            "antar_dasha": getAntarPart(selectedAntar),
            "pratyantar_dasha": getAntarPart(selectedsookshma)
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/vimshottari_dasha", val);
            const parsed = JSON.parse(res.data);
            if (parsed) {
                const rows = Object.entries(parsed).map(([planet, info]) => ({
                    planet: info.Planet,
                    start: info.StartDate,
                    end: info.EndDate,
                }));
                setCurrentData(rows);
            }
        }
        catch (e) {
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
            setSelectedsookshma(row.planet);
            setCurrentLevel("sookshmadasha");
            Get_Data_vimshottari_dasha("sookshma-dasha", selectedMaha, selectedAntar, row.planet);
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
            "lan": "en"
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/kaal_sarpa_yoga", val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const Data = parseData?.data;
            if (Data) {
                setkalsarpadata(Data);
            }
        }
        catch (error) {
            console.error("Error", error);
        }
    };
    return (<>
      <SEO title="Free Kundli Online – Generate Janam Kundli Instantly" description="Generate your free kundli online on AstroCall. Get an instant Vedic Janam Kundli based on your date, time and place of birth with basic life insights." canonical="https://astrocall.live/freekundli" type="website" schema={{
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "name": "Free Kundli Generator — AstroCall",
                    "url": "https://astrocall.live/freekundli",
                    "applicationCategory": "AstrologyApplication",
                    "operatingSystem": "Web Browser",
                    "description": "Generate your free Janam Kundli (birth chart) online by date of birth, time, and place. Get detailed Vedic astrology chart with planetary positions, doshas & yogas.",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
                    "provider": { "@id": "https://astrocall.live/#organization" }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is a Kundli?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "A Kundli (Janam Kundali) is a Vedic birth chart based on your date, time, and place of birth. It maps planetary positions and predicts key life events."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Is the Kundli on AstroCall free?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. AstroCall offers a 100% free Kundli generation tool. Simply enter your birth details to receive an accurate Vedic birth chart instantly."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What details do I need to generate my Kundli?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "You need your date of birth, exact time of birth, and place of birth to generate an accurate Janam Kundli on AstroCall."
                            }
                        }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://astrocall.live/" },
                        { "@type": "ListItem", "position": 2, "name": "Free Kundli", "item": "https://astrocall.live/freekundli" }
                    ]
                }
            ]
        }}/>

      <div className="bg-orange-50">
        <div className="main-container text-left py-3 sm:py-4 md:py-5 mt-16 px-3 sm:px-4">
          <div className="bg-orange-500 rounded-md w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <GiScrollUnfurled className="text-white text-2xl sm:text-3xl"/>
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Free Kundli Online</h1>
              </div>
              <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed px-2">
                Create your detailed birth chart instantly using your date, time, and place of birth. Get accurate planetary positions, houses, and predictions – absolutely free. Start your astrological journey now.
              </p>
              <div className="w-8 h-[2px] bg-white mt-3 sm:mt-4"></div>
            </div>
          </div>
        </div>

        <div>
          <div className="py-4 sm:py-6 md:py-8 main-container px-3 sm:px-4">
            <div className="flex border-b border-gray-300 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide lg:justify-center justify-start" style={{ maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-8 min-w-max">
                {["Basic", "Kundli", "Charts", "Sade Sati", "Mangal Dosha", "Kalsarpa Doshas"].map((tab) => (<button key={tab} className={`px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-[700] ${activeTab === tab ? "border-b-[3px] border-yellow-500 text-yellow-500" : "text-gray-600 hover:text-yellow-800"} whitespace-nowrap transition-all duration-200 flex-shrink-0`} onClick={() => setActiveTab(tab)}>
                      {tab}
                    </button>))}
              </div>
            </div>

            <div>
              {activeTab === "Basic" && (<div>
                  <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                    {/* Left Section: Basic Details */}
                    <div className="flex-1 border rounded-lg shadow-md bg-white overflow-x-auto">
                      <h2 className="text-base sm:text-lg font-semibold mb-2 text-center p-2 sm:p-3">Basic Details</h2>
                      {onclickdata ? (<table className="table-auto w-full border-collapse border-y border-gray-200 text-xs sm:text-sm">
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
                        </table>) : (<div className="p-4 flex justify-center">
                          <LoadingIndicator />
                        </div>)}
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
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>)}

              {activeTab === "Kundli" && (<div>
                  <div>
                    <ul className="my-4 sm:my-6 flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-16">
                      {['North Indian', 'South Indian'].map((buttonName) => (<li key={buttonName}>
                          <div className={`bg px-3 sm:px-4 py-2 text-orange-500 rounded-lg sm:rounded-xl border-2 border-orange-400 duration-300 font-[600] 
                            ${regionkundli === (buttonName === "North Indian" ? "north" : "south") ? "bg-orange-500 text-white" : "text-orange-500"}`}>
                            <button className="flex items-center gap-2 text-xs sm:text-sm md:text-base w-full" onClick={() => HandleclickchartstyleKundli(buttonName)}>
                              {buttonName}
                            </button>
                          </div>
                        </li>))}
                    </ul>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 m-4 sm:m-6 md:m-10 flex-wrap' style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div className="w-full sm:w-auto">
                      <h6 className="text-sm sm:text-base md:text-lg font-semibold mb-2">Lagna Chart</h6>
                      <div className="overflow-x-auto">
                        {D1ChartKundli?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D1ChartKundli }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      <h6 className="text-sm sm:text-base md:text-lg font-semibold mb-2">Navamsa Chart</h6>
                      <div className="overflow-x-auto">
                        {D9Chartkundli?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D9Chartkundli }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                  </div>

                  {PlanetData?.planets && (<div className="overflow-x-auto mt-10 sm:mt-16 md:mt-20 mb-10 sm:mb-16 md:mb-20">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 capitalize px-2">Planets</h1>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md text-xs sm:text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Planet</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Sign</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Sign No</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">House</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Longitude</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Nakshatra</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Nakshatra Pada</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Rashi Lord</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Sub Lord</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Retrograde</th>
                              <th className="border px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Combusted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PlanetData.planets.map((planet, i) => (<tr key={i} className="hover:bg-gray-50">
                                <td className="border px-2 sm:px-3 md:px-4 py-2 font-semibold">{planet?.name}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.sign}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.sign_no}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.house}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.longitude}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.nakshatra}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.nakshatra_pada}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.rashi_lord}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">{planet?.sub_lord}</td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">
                                  {planet?.is_retro === "true" ? "Yes" : "No"}
                                </td>
                                <td className="border px-2 sm:px-3 md:px-4 py-2">
                                  {planet?.is_combusted === "true" ? "Yes" : "No"}
                                </td>
                              </tr>))}
                          </tbody>
                        </table>
                      </div>
                    </div>)}

                  {/* Stepper Header */}
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-7 capitalize px-2">Vimshottari Dasha</h1>
                  <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap px-2">
                    {steps.map((step, i) => (<div key={step.key} className={`flex items-center gap-1 sm:gap-2 ${currentLevel === step.key ? "text-orange-500 font-bold" : "text-gray-500"}`}>
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full border-2 text-xs sm:text-sm ${currentLevel === step.key
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-gray-400"}`}>
                          {i + 1}
                        </span>
                        <span className="text-xs sm:text-sm md:text-base">{step.label}</span>
                        {i !== steps.length - 1 && (<span className="w-6 sm:w-8 md:w-12 h-[1px] bg-gray-400"></span>)}
                      </div>))}
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 sm:px-3 md:px-4 py-2 border whitespace-nowrap">Planet</th>
                          <th className="px-2 sm:px-3 md:px-4 py-2 border whitespace-nowrap">Start Date</th>
                          <th className="px-2 sm:px-3 md:px-4 py-2 border whitespace-nowrap">End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData?.map((row, i) => (<tr key={i} className="cursor-pointer hover:bg-yellow-50" onClick={() => { handleRowClick(row, currentLevel); }}>
                            <td className="border px-2 sm:px-3 md:px-4 py-2 font-semibold">{row.planet}</td>
                            <td className="border px-2 sm:px-3 md:px-4 py-2">{row.start}</td>
                            <td className="border px-2 sm:px-3 md:px-4 py-2 flex items-center justify-between">
                              <span>{row.end}</span>
                              <IoIosArrowForward className="text-gray-500 text-sm sm:text-base"/>
                            </td>
                          </tr>))}
                      </tbody>
                    </table>
                  </div>

                  {currentLevel !== "maha_dasha" && (<div className="flex justify-center mt-4 sm:mt-6">
                      <button onClick={handleBack} className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[320px] py-2.5 sm:py-3 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition duration-300 text-sm sm:text-base">
                        ⬅ Back
                      </button>
                    </div>)}
                </div>)}

              {activeTab === "Charts" && (<div>
                  <div>
                    <ul className="my-4 sm:my-6 flex justify-center gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-16">
                      {['North Indian', 'South Indian'].map((buttonName) => (<li key={buttonName}>
                          <div className={`bg px-3 sm:px-4 py-2 text-orange-500 rounded-lg sm:rounded-xl border-2 border-orange-400 duration-300 font-[600] 
                            ${region === (buttonName === "North Indian" ? "north" : "south") ? "bg-orange-500 text-white" : "text-orange-500"}`}>
                            <button className="flex items-center gap-2 text-xs sm:text-sm md:text-base w-full" onClick={() => Handleclickchartstyle(buttonName)}>
                              {buttonName}
                            </button>
                          </div>
                        </li>))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-6 sm:my-8 md:my-10">

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Chalit Chart</h4>
                      <div className="overflow-x-auto">
                        {ChalitChart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: ChalitChart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Sun Chart</h4>
                      <div className="overflow-x-auto">
                        {SUNChart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: SUNChart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Moon Chart</h4>
                      <div className="overflow-x-auto">
                        {MOONChart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: MOONChart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Lagna Chart</h4>
                      <div className="overflow-x-auto">
                        {D1Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D1Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Hora Chart</h4>
                      <div className="overflow-x-auto">
                        {D2Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D2Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Drekkana Chart</h4>
                      <div className="overflow-x-auto">
                        {D3Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D3Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Chaturthamsa Chart (Turyamsa)</h4>
                      <div className="overflow-x-auto">
                        {D4Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D4Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Saptamsa Chart</h4>
                      <div className="overflow-x-auto">
                        {D7Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D7Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Navamsa Chart</h4>
                      <div className="overflow-x-auto">
                        {D9Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D9Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Dasamsa Chart (Karma Chart)</h4>
                      <div className="overflow-x-auto">
                        {D10Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D10Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Dvadasamsa Chart</h4>
                      <div className="overflow-x-auto">
                        {D12Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D12Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Shodashamsa Chart (Kalamsa)</h4>
                      <div className="overflow-x-auto">
                        {D16Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D16Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Vishamansha Chart</h4>
                      <div className="overflow-x-auto">
                        {D20Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D20Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Chaturvimshamsha Chart</h4>
                      <div className="overflow-x-auto">
                        {D24Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D24Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Bhamsha Chart</h4>
                      <div className="overflow-x-auto">
                        {D27Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D27Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Trishamansha Chart</h4>
                      <div className="overflow-x-auto">
                        {D30Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D30Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Khavedamsha Chart</h4>
                      <div className="overflow-x-auto">
                        {D40Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D40Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Akshvedansha Chart</h4>
                      <div className="overflow-x-auto">
                        {D45Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D45Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>

                    <div className="w-full">
                      <h4 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">Shastiamsa (Summary of charts)</h4>
                      <div className="overflow-x-auto">
                        {D60Chart?.length > 0 ? <div className="w-full" style={{ maxWidth: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: D60Chart }}/> : <div className="p-4"><LoadingIndicator /></div>}
                      </div>
                    </div>
                  </div>
                </div>)}

              {activeTab === "Sade Sati" && (<div className="py-4 sm:py-6">
                  <div className="space-y-4 sm:space-y-6">
                    {SadeSatiData ? (<>
                        {/* -------- Basic Info -------- */}
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 px-2">General Information</h2>
                          <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 text-xs sm:text-sm">
                              <tbody>
                                {Object.entries(SadeSatiData?.sadhesati || {}).map(([key, value]) => (<tr key={key} className="hover:bg-gray-50">
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
                                  </tr>))}
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
                                {SadeSatiData?.sadhesati_life_analysis?.map((item, i) => (<tr key={i} className="hover:bg-gray-50">
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.sign_name}</td>
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.phase}</td>
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.date}</td>
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.is_retro === "true" ? "Yes" : "No"}</td>
                                  </tr>))}
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
                                {SadeSatiData?.small_panoti?.map((item, i) => (<tr key={i} className="hover:bg-gray-50">
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.sign_name}</td>
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.phase}</td>
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.date}</td>
                                    <td className="border px-2 sm:px-3 md:px-4 py-2">{item.is_retro === "true" ? "Yes" : "No"}</td>
                                  </tr>))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* -------- Remedies -------- */}
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 mt-8 sm:mt-12 md:mt-16 px-2">Remedies</h2>
                          <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">
                            {SadeSatiData?.remedies?.map((remedy, i) => (<li key={i} className="break-words">{remedy}</li>))}
                          </ul>
                        </div>

                        {/* -------- Content -------- */}
                        <div>
                          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 mt-8 sm:mt-12 md:mt-16 px-2">{SadeSatiData?.content?.title}</h2>
                          {SadeSatiData?.content?.description?.map((desc, i) => (<p key={i} className="text-gray-700 mb-2 text-sm sm:text-base leading-relaxed px-2">{desc}</p>))}
                        </div>
                      </>) : (<div className="p-4 flex justify-center">
                        <LoadingIndicator />
                      </div>)}
                  </div>
                </div>)}

              {activeTab === "Mangal Dosha" && (<div>
                  <div className="py-4 sm:py-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">Manglik Report</h1>
                    {MangalDoshaData ? (<div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-collapse border border-gray-200 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 text-left whitespace-nowrap">Criteria</th>
                              <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 text-left">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(MangalDoshaData).map(([key, value], index) => (<tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 capitalize font-semibold whitespace-nowrap">
                                  {key.replace(/_/g, " ")}
                                </td>
                                <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 break-words">
                                  {Array.isArray(value) ? (value.length > 0 ? (<ul className="list-disc list-inside">
                                        {value.map((item, i) => (<li key={i} className="break-words">{item}</li>))}
                                      </ul>) : ("N/A")) : typeof value === "boolean" ? (value ? "Yes" : "No") : (value?.toString() || "N/A")}
                                </td>
                              </tr>))}
                          </tbody>
                        </table>
                      </div>) : (<div className="p-4 flex justify-center">
                        <LoadingIndicator />
                      </div>)}
                  </div>
                </div>)}

              {activeTab === "Kalsarpa Doshas" && (<div className="py-4 sm:py-6">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">KalSarpa Dosha</h1>
                  {kalsarpadata ? (<div className="overflow-x-auto">
                      <table className="min-w-full bg-white border-collapse border border-gray-200 text-xs sm:text-sm">
                        <tbody>
                          {Object.entries(kalsarpadata).map(([key, value]) => (<tr key={key} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 font-semibold capitalize whitespace-nowrap">
                                {key}
                              </td>
                              <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-2 break-words">
                                {Array.isArray(value) ? (<ul className="list-disc pl-3 sm:pl-5 space-y-1">
                                    {value.map((item, i) => (<li key={i} className="break-words">{item}</li>))}
                                  </ul>) : typeof value === "object" ? (JSON.stringify(value)) : key === "result" ? (value === "true" ? "Yes" : "No") : (value?.toString())}
                              </td>
                            </tr>))}
                        </tbody>
                      </table>
                    </div>) : (<div className="p-4 flex justify-center">
                      <LoadingIndicator />
                    </div>)}
                </div>)}
            </div>
          </div>

          <br /> <br /> <br />
        </div>
      </div>

      {/* Talk to Astrologer Section */}
      <div className="main-container rounded-2xl bg-orange-500 mb-8">
        <div className="text-center border-1 p-4 rounded-xl">
          <h3 className="text-white text-lg sm:text-xl font-semibold mb-4">Connect with an Astrologer on Call or Chat for more personalised detailed predictions.</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="bg-white chat-button px-1 lg:px-9 py-5 rounded-xl hover:bg-gray-100 border-2 border-white duration-300 font-semibold">
              <button className="flex items-center gap-1 lg:gap-3 text-xs lg:text-md text-orange-500" onClick={handleclickTalk}>
                Talk to an Astrologer
                <div className="icon text-xl">
                  <MdPhoneInTalk />
                </div>
              </button>
            </div>
            <div className="bg-white chat-button px-1 lg:px-9 py-5 rounded-xl hover:bg-gray-100 border-2 border-white duration-300 font-semibold">
              <button className="flex items-center gap-1 lg:gap-3 text-xs lg:text-md text-orange-500" onClick={handleclickChat}>
                Chat with an Astrologer
                <div className="icon text-xl">
                  <IoMdChatboxes />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>);
};

export default function FreeKundliDetails() {
    return (<Suspense fallback={<div className="main-container py-10 flex justify-center"><LoadingIndicator /></div>}>
      <FreeKundliDetailsContent />
    </Suspense>);
}
