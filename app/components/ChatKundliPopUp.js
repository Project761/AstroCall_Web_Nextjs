"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MenuContext } from "../context/MenuContext";
import { format } from "date-fns";
// import { formatTobToHHmmss } from "../../Utility/dateTimeFormat";
import { RiCloseLargeFill } from "react-icons/ri";
import { TokenWithDeleteUpadateAdd, getPostData, postWithToken } from "../utils/api";
import { useParams } from "next/navigation";

// Simple Loading Component
const LoadingSpinner = ({ size = "medium" }) => {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12"
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin`}></div>
        </div>
    );
};


const CustomModal = ({ isOpen, onClose, children, className = "" }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-2 sm:px-4 py-4"
            onClick={onClose}
        >
            <div
                className={`relative w-[95vw] sm:w-[90vw] md:w-full max-w-7xl h-[80vh] sm:h-[85vh] md:h-[80vh] overflow-y-auto bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 pointer-events-auto ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

const ChatKundliPopUp = ({ isOpen, onClose, activeTab, setActiveTab }) => {

    const { LanguageDropdown, setLanguageDropdown, astroParsedData, setAstroParsedData, callPopupData } = useContext(MenuContext);
    const GetAstroLoginId = localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    // const popupData = sessionStorage.getItem("parsedDataAstro") ? sessionStorage.getItem("parsedDataAstro") : '';
    // const astroParsedData = popupData ? JSON.parse(popupData) : null;

    const { id } = useParams();
    const isFetchingRef = useRef(false);
    // const [activeTab, setActiveTab] = useState("Basic");
    const [onclickdata, setonclickdata] = useState();
    const [region, setRegion] = useState("north");
    const [regionkundli, setRegionkundli] = useState("north");
    const [lonData, setlonData] = useState()
    const [latData, setlatData] = useState()
    const [datetimeData, setdatetimeData] = useState()
    const [p1_place, setp1_place] = useState();
    const [p1_gender, setp1_gender] = useState();
    const [p1_full_name, setp1_full_name] = useState();
    const [UserChatData, setUserChatData] = useState()

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
    const [kalsarpadata, setkalsarpadata] = useState()

    const [currentLevel, setCurrentLevel] = useState("maha_dasha");
    const [currentData, setCurrentData] = useState([]);
    const [selectedMaha, setSelectedMaha] = useState(null);
    const [selectedAntar, setSelectedAntar] = useState(null);
    const [selectedsookshma, setSelectedsookshma] = useState(null);

    // -----------------------Kundli-------------------------
    const [PlanetData, setPlanetData] = useState()
    // console.log(PlanetData, 'PlanetData')
    // -----------------------Sade Sati----------------------
    const [SadeSatiData, setSadeSatiData] = useState()
    // ----------------------Mangal Dosha--------------------
    const [MangalDoshaData, setMangalDoshaData] = useState()
    // -------------------------------------------------


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


    //     const formatTobToHHmmss=(tobStr) {
    //   const d = parseTobStringToDate(tobStr);
    //   if (!d) return "00:00:00";
    //   return format(d, "HH:mm:ss");
    // }




    useEffect(() => {
        if (astroParsedData?.ChatUserBioID ? astroParsedData?.ChatUserBioID : callPopupData?.ChatUserBioID) {
            Get_Single_CHATINTAKEFORM_Data(astroParsedData?.ChatUserBioID ? astroParsedData?.ChatUserBioID : callPopupData?.ChatUserBioID)
        }
    }, [astroParsedData, callPopupData])


    const Get_Single_CHATINTAKEFORM_Data = async () => {
        try {
            const val = { ChatUserBioID: astroParsedData?.ChatUserBioID ? astroParsedData?.ChatUserBioID : callPopupData?.ChatUserBioID };
            const res = await postWithToken('CHATINTAKEFORM/GetSinglaData_CHATINTAKEFORM', val)
            // console.log(res, 'res')
            if (res && Array.isArray(res) && res.length > 0) {
                const [firstItem] = res;
                setUserChatData(res);
                // console.log(firstItem, 'firstItem')
                // Insert_Free_Fundli(firstItem?.latitude, firstItem?.longitude, firstItem?.DOB, firstItem?.TOB);
                Get_Data_Kundli(firstItem)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const Get_Data_Kundli = async (detailsData) => {
        let dob = detailsData?.DOB;
        let tob = detailsData?.TOB || "00:00 AM";

        // DOB format fix
        if (dob.includes("-")) {
            const parts = dob.split("-");

            // dd-MM-yyyy -> yyyy-MM-dd
            if (parts[0].length === 2 && parts[2].length === 4) {
                dob = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            }

            // yyyy-M-d -> yyyy-MM-dd
            else {
                dob = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
            }
        }

        // TOB convert into HH:mm:ss
        const convertTo24Hour = (time12h) => {
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes] = time.split(":");
            hours = parseInt(hours, 10);
            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            }
            if (modifier === "AM" && hours === 12) {
                hours = 0;
            }
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
        };

        const parsedTime = convertTo24Hour(tob);
        const dateTime = `${dob}T${parsedTime}`;
        const val = {
            p1_Date: dateTime,
            p1_full_name: detailsData?.Name,
            p1_gender: detailsData?.Gender,
            p1_place: detailsData?.POB,
            p1_lat: detailsData?.latitude,
            p1_lon: detailsData?.longitude,
            p1_tzone: "5.5",
            lan: "en",
        };

        try {
            const res = await TokenWithDeleteUpadateAdd(
                "KundaliMatchMaking/Basic_Astrologer_Details",
                val
            );

            const { data } = res;
            const parseData = JSON.parse(data);
            if (parseData) {
                setonclickdata(parseData?.data);

                setlonData(parseFloat(parseData?.data.longitude).toFixed(6));
                setlatData(parseFloat(parseData?.data.latitude).toFixed(6));

                setdatetimeData(
                    `${parseData?.data?.year}-${String(parseData?.data?.month).padStart(
                        2,
                        "0"
                    )}-${String(parseData?.data?.day).padStart(
                        2,
                        "0"
                    )}T${String(parseData?.data?.hour).padStart(
                        2,
                        "0"
                    )}:${String(parseData?.data?.minute).padStart(2, "0")}:00`
                );

                setp1_place(parseData?.data.place);
                setp1_gender(parseData?.data.gender);
                setp1_full_name(parseData?.data.full_name);
            }
        } catch (error) {
            console.error("Error fetching data for Kundli Matching:", error);
        }
    };


    // ---------------------------------- Other Api useEffect---------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            if (GetAstroLoginId && datetimeData && latData && lonData && activeTab && regionkundli && LanguageDropdown) {
                isFetchingRef.current = true;
                try {
                    const promises = [];

                    // Run these API calls only when activeTab is "Kundli" and regionkundli is NOT only change
                    if (activeTab === "Kundli" && prevRegionKundliRef.current === regionkundli) {
                        promises.push(Get_Data_PlanetPanchang());
                        // promises.push(Get_Data_vimshottari_dasha());
                        // promises.push(Get_Data_vimshottari_dasha("maha-dasha"));
                        promises.push(Get_Data_vimshottari_dasha("maha-dasha", null, null, null));
                    }

                    // Only call these APIs when regionkundli changes, without re-calling previous ones
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

                    // Update previous regionkundli reference
                    prevRegionKundliRef.current = regionkundli;

                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    isFetchingRef.current = false;
                }
            }
        };

        fetchData();
    }, [GetAstroLoginId, datetimeData, latData, lonData, LanguageDropdown, activeTab, regionkundli]);


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
                setD9Chartkundli(Data?.svg);
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

    useEffect(() => {
        const fetchData = async () => {
            if (GetAstroLoginId && datetimeData && latData && lonData && region && LanguageDropdown) {
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
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    isFetchingRef.current = false;
                }
            }
        };
        fetchData();
    }, [GetAstroLoginId, datetimeData, latData, lonData, region, LanguageDropdown, activeTab]);

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
            // console.log(row.planet, 'row.planet')
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


    return (

        <>

            <CustomModal
                isOpen={isOpen}
                onClose={onClose}
            // className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl w-[95vw] sm:w-[90vw] md:w-full max-w-6xl h-[80vh] sm:h-[85vh] md:h-[80vh] overflow-y-auto relative border border-gray-200 mx-2 sm:mx-4"
            // className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl w-[95vw] sm:w-[90vw] md:w-full max-w-6xl h-[80vh] sm:h-[85vh] md:h-[80vh] overflow-y-auto relative border border-gray-200 mx-2 sm:mx-4"
            // overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-[80] px-2 sm:px-4 pt-[60px] sm:pt-0"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 bg-white shadow-lg border-2 border-gray-300 text-gray-700 hover:text-red-600 active:text-red-700 hover:border-red-400 active:border-red-500 transition-all z-[9999] flex items-center justify-center p-0 rounded-full hover:bg-red-50 active:bg-red-100 w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] md:w-[52px] md:h-[52px] overflow-hidden"
                    style={{ touchAction: 'manipulation' }}
                    aria-label="Close"
                >
                    <RiCloseLargeFill className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 flex-shrink-0 text-gray-700 hover:text-red-600 active:text-red-700" />
                </button>

                <div className="flex border-b mb-4 sm:mb-6 overflow-x-auto lg:justify-center justify-start scrollbar-hide" style={{ maxWidth: '100%', }}>
                    {["Basic", "Kundli", "Charts", "Sade Sati", "Mangal Dosha", "Kalsarpa Doshas"].map(
                        (tab) => (
                            <button
                                key={tab}
                                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-sm sm:text-base md:text-lg lg:text-xl font-[500] ${activeTab === tab
                                    ? "border-b-2 border-yellow-500 text-yellow-500"
                                    : "text-gray-600 hover:text-yellow-800"
                                    } whitespace-nowrap flex-shrink-0`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                </div>

                <div>
                    {activeTab === "Basic" && (
                        <div>
                            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                                {/* Left Section: Basic Details */}
                                <div className="flex-1 border rounded-lg shadow-md bg-white overflow-x-auto">
                                    <h2 className="text-base sm:text-lg font-semibold mb-2 text-center p-2">Basic Details</h2>
                                    {onclickdata ? (
                                        <table className="table-auto w-full border-collapse border-y border-gray-200 text-sm sm:text-base">
                                            <tbody>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Name</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 break-words">{onclickdata?.full_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Date</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2">
                                                        {onclickdata?.day}/{onclickdata?.month}/{onclickdata?.year}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Time</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2">
                                                        {onclickdata?.hour}:{onclickdata?.minute}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Place</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 break-words">{onclickdata?.place}</td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Latitude</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2">
                                                        {onclickdata?.latitude ? Number(onclickdata?.latitude).toFixed(6) : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Longitude</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2">
                                                        {onclickdata?.longitude ? Number(onclickdata?.longitude).toFixed(6) : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Timezone</td>
                                                    <td className="border border-gray-200 p-1.5 sm:p-2">GMT+{onclickdata?.timezone}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        <LoadingSpinner size="medium" />
                                    )}
                                </div>

                                {/* Right Section: Panchang Details */}
                                <div className="flex-1 border rounded-lg shadow-md bg-white overflow-x-auto">
                                    <h2 className="text-base sm:text-lg font-semibold mb-2 text-center p-2">Panchang Details</h2>
                                    <table className="table-auto w-full border-collapse border-y border-gray-200 text-sm sm:text-base">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Tithi</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.tithi}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Yoga</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.yoga}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Nakshatra</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.nakshatra}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Karana</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.karana}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Sunrise</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.sunrise}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Sunset</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.sunset}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Moonrise</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.moonrise || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-200 p-1.5 sm:p-2 font-medium">Moonset</td>
                                                <td className="border border-gray-200 p-1.5 sm:p-2">{onclickdata?.moonset || "N/A"}</td>
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

                    {activeTab === "Kundli" && (
                        <div>

                            <div>
                                <ul className="my-4 sm:my-6 flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-16">
                                    {['North Indian', 'South Indian'].map((buttonName) => (
                                        <li key={buttonName}>
                                            <div
                                                className={`bg px-2 sm:px-3 py-1.5 sm:py-2 text-primaryColor rounded-lg sm:rounded-xl border-2 border-orange-400 duration-300 font-[600] 
                                                            ${regionkundli === (buttonName === "North Indian" ? "north" : "south") ? "bg-primaryColor text-white" : "text-primaryColor"}`}
                                            >
                                                <button
                                                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base w-full"
                                                    onClick={() => HandleclickchartstyleKundli(buttonName)}
                                                >
                                                    {buttonName}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className='flex gap-4 sm:gap-6 md:gap-10 m-4 sm:m-6 md:m-10 flex-wrap' style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <div className="w-full sm:w-auto">
                                    <h6 className="text-sm sm:text-base font-semibold mb-2">Lagna Chart</h6>

                                    {
                                        D1ChartKundli?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D1ChartKundli }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="w-full sm:w-auto">
                                    <h6 className="text-sm sm:text-base font-semibold mb-2">Navamsa Chart</h6>
                                    {
                                        D9Chartkundli?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D9Chartkundli }} /> : <LoadingSpinner size="medium" />
                                    }

                                </div>

                            </div>

                            {PlanetData?.planets && (
                                <div className="overflow-x-auto mt-10 sm:mt-16 md:mt-20 mb-10 sm:mb-16 md:mb-20">
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 capitalize px-2">Planets</h1>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md text-xs sm:text-sm md:text-base">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Planet</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Sign</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Sign No</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">House</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Longitude</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Nakshatra</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Nakshatra Pada</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Rashi Lord</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Sub Lord</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Retrograde</th>
                                                    <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Combusted</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {PlanetData.planets.map((planet, i) => (
                                                    <tr key={i} className="hover:bg-gray-50">
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold whitespace-nowrap">{planet?.name}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.sign}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.sign_no}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.house}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.longitude}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.nakshatra}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.nakshatra_pada}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.rashi_lord}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{planet?.sub_lord}</td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">
                                                            {planet?.is_retro === "true" ? "Yes" : "No"}
                                                        </td>
                                                        <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">
                                                            {planet?.is_combusted === "true" ? "Yes" : "No"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}


                            {/* Stepper Header */}
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-7 capitalize px-2">Vimshottari Dasha</h1>
                            <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap px-2">
                                {steps.map((step, i) => (
                                    <div
                                        key={step.key}
                                        className={`flex items-center gap-1 sm:gap-2 ${currentLevel === step.key ? "text-orange-500 font-bold" : "text-gray-500"
                                            }`}
                                    >
                                        <span
                                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full border-2 text-xs sm:text-sm ${currentLevel === step.key
                                                ? "border-orange-500 bg-orange-500 text-white"
                                                : "border-gray-400"
                                                }`}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className="text-xs sm:text-sm md:text-base">{step.label}</span>
                                        {i !== steps.length - 1 && (
                                            <span className="w-6 sm:w-8 md:w-12 h-[1px] bg-gray-400"></span>
                                        )}
                                    </div>
                                ))}
                            </div>


                            {/* Table */}
                            <div className="overflow-x-auto px-2">
                                <table className="min-w-full bg-white border text-sm sm:text-base">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border whitespace-nowrap">Planet</th>
                                            <th className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border whitespace-nowrap">Start Date</th>
                                            <th className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border whitespace-nowrap">End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData?.map((row, i) => (
                                            <tr
                                                key={i}
                                                className="cursor-pointer hover:bg-yellow-50"
                                                onClick={() => { handleRowClick(row, currentLevel); }}
                                            >
                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold whitespace-nowrap">{row.planet}</td>
                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{row.start}</td>
                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 flex items-center justify-between">
                                                    <span className="whitespace-nowrap">{row.end}</span>
                                                    <IoIosArrowForward className="text-gray-500 flex-shrink-0 ml-2" />
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {currentLevel !== "maha_dasha" && (
                                <div className="flex justify-center mt-4 sm:mt-6 px-2">
                                    <button
                                        onClick={handleBack}
                                        className="w-full sm:w-auto min-w-[200px] sm:min-w-[320px] py-2 sm:py-3 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition duration-300 text-sm sm:text-base"
                                    >
                                        ⬅ Back
                                    </button>
                                </div>
                            )}







                        </div>
                    )}

                    {activeTab === "Charts" && (
                        <div>
                            <div>
                                <ul className="my-4 sm:my-6 flex justify-center flex-wrap gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-16">
                                    {['North Indian', 'South Indian'].map((buttonName) => (
                                        <li key={buttonName}>
                                            <div
                                                className={`bg px-2 sm:px-3 py-1.5 sm:py-2 text-primaryColor rounded-lg sm:rounded-xl border-2 border-orange-400 duration-300 font-[600] 
                                                        ${region === (buttonName === "North Indian" ? "north" : "south") ? "bg-primaryColor text-white" : "text-primaryColor"}`}
                                            >
                                                <button
                                                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base w-full"
                                                    onClick={() => Handleclickchartstyle(buttonName)}
                                                >
                                                    {buttonName}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-1">

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2"> Chalit Chart</h4>
                                    {
                                        ChalitChart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: ChalitChart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>


                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Sun Chart</h4>
                                    {
                                        SUNChart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: SUNChart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Moon Chart</h4>
                                    {
                                        MOONChart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: MOONChart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Lagna Chart</h4>
                                    {
                                        D1Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D1Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Hora Chart</h4>
                                    {
                                        D2Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D2Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Drekkana Chart</h4>
                                    {
                                        D3Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D3Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div>
                                    <h4>Chaturthamsa Chart (Turyamsa)</h4>
                                    {
                                        D4Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D4Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Saptamsa Chart</h4>
                                    {
                                        D7Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D7Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Navamsa Chart</h4>
                                    {
                                        D9Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D9Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Dasamsa Chart (Karma Chart)</h4>
                                    {
                                        D10Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D10Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Dvadasamsa Chart</h4>
                                    {
                                        D12Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D12Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Shodashamsa Chart (Kalamsa)</h4>
                                    {
                                        D16Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D16Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Vishamansha Chart</h4>
                                    {
                                        D20Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D20Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Chaturvimshamsha Chart</h4>
                                    {
                                        D24Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D24Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>


                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Bhamsha Chart</h4>
                                    {
                                        D27Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D27Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Trishamansha Chart</h4>
                                    {
                                        D30Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D30Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Khavedamsha Chart</h4>
                                    {
                                        D40Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D40Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Akshvedansha Chart</h4>
                                    {
                                        D45Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D45Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>

                                <div className="text-center">
                                    <h4 className="text-sm sm:text-base font-semibold mb-2">Shastiamsa (Summary of charts)</h4>
                                    {
                                        D60Chart?.length > 0 ? <div dangerouslySetInnerHTML={{ __html: D60Chart }} /> : <LoadingSpinner size="medium" />
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Sade Sati" && (
                        <div className="py-3 sm:py-4 md:py-6">
                            {/* <h1 className="text-2xl font-bold mb-4">Sade Sati Report</h1> */}
                            <div className="space-y-4 sm:space-y-6">
                                {SadeSatiData ? (
                                    <>
                                        {/* -------- Basic Info -------- */}
                                        <div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 px-2">General Information</h2>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 text-sm sm:text-base">
                                                    <tbody>
                                                        {Object.entries(SadeSatiData?.sadhesati || {}).map(([key, value]) => (
                                                            <tr key={key} className="hover:bg-gray-50">
                                                                <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 capitalize font-medium">
                                                                    {key.replace(/_/g, " ")}
                                                                </td>
                                                                <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2">
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
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 px-2">Sadhesati Life Analysis</h2>
                                            <div className="overflow-x-auto bg-white">
                                                <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Sign</th>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Phase</th>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Date</th>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Retro</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {SadeSatiData?.sadhesati_life_analysis?.map((item, i) => (
                                                            <tr key={i} className="hover:bg-gray-50">
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.sign_name}</td>
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.phase}</td>
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.date}</td>
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.is_retro === "true" ? "Yes" : "No"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* -------- Small Panoti -------- */}
                                        <div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 px-2">Small Panoti</h2>
                                            <div className="overflow-x-auto bg-white">
                                                <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Sign</th>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Phase</th>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Date</th>
                                                            <th className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">Retro</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {SadeSatiData?.small_panoti?.map((item, i) => (
                                                            <tr key={i} className="hover:bg-gray-50">
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.sign_name}</td>
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.phase}</td>
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.date}</td>
                                                                <td className="border px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap">{item.is_retro === "true" ? "Yes" : "No"}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* -------- Remedies -------- */}
                                        <div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 mt-8 sm:mt-12 md:mt-16 px-2">Remedies</h2>
                                            <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-sm sm:text-base px-2">
                                                {SadeSatiData?.remedies?.map((remedy, i) => (
                                                    <li key={i}>{remedy}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* -------- Content -------- */}
                                        <div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 mt-8 sm:mt-12 md:mt-16 px-2">{SadeSatiData?.content?.title}</h2>
                                            <div className="px-2">
                                                {SadeSatiData?.content?.description?.map((desc, i) => (
                                                    <p key={i} className="text-gray-700 mb-2 text-sm sm:text-base">{desc}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <LoadingSpinner size="medium" />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "Mangal Dosha" && (
                        <div>
                            <div className="py-3 sm:py-4 md:py-6">
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">Manglik Report</h1>
                                {MangalDoshaData ? (
                                    <div className="overflow-x-auto px-2">
                                        <table className="min-w-full bg-white border-collapse border border-gray-200 text-sm sm:text-base">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">Criteria</th>
                                                    <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left">Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(MangalDoshaData).map(([key, value], index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 capitalize font-medium whitespace-nowrap">
                                                            {key.replace(/_/g, " ")}
                                                        </td>
                                                        <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2">
                                                            {Array.isArray(value) ? (
                                                                value.length > 0 ? (
                                                                    <ul className="list-disc list-inside">
                                                                        {value.map((item, i) => (
                                                                            <li key={i}>{item}</li>
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
                                    <LoadingSpinner size="medium" />
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "Kalsarpa Doshas" && (
                        <div className="py-3 sm:py-4 md:py-6">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">KalSarpa Dosha</h1>
                            {kalsarpadata ? (
                                <div className="overflow-x-auto px-2">
                                    <table className="min-w-full bg-white border-collapse border border-gray-200 text-sm sm:text-base">
                                        <tbody>
                                            {Object.entries(kalsarpadata).map(([key, value]) => (
                                                <tr key={key}>
                                                    <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 font-semibold capitalize whitespace-nowrap">
                                                        {key}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2">
                                                        {Array.isArray(value) ? (
                                                            <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base">
                                                                {value.map((item, i) => (
                                                                    <li key={i}>{item}</li>
                                                                ))}
                                                            </ul>
                                                        ) : typeof value === "object" ? (
                                                            <span className="text-xs sm:text-sm break-all">{JSON.stringify(value)}</span>
                                                        ) : key === "result" ? (
                                                            value === "true" ? "Yes" : "No"
                                                        ) : (
                                                            <span className="break-words">{value?.toString()}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <LoadingSpinner size="medium" />
                            )}
                        </div>
                    )}

                </div>

            </CustomModal >
        </>
    );
};

export default ChatKundliPopUp;
