"use client";
import React, { useContext, useEffect, useState } from "react";
import { WiDayCloudy, WiMoonset, WiSunset } from "react-icons/wi";
import Footer from "../components/Footer/page";
import Header from "../components/Header/page";
import { useTranslation } from "react-i18next";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api";
import Image from "next/image";
import { WiSunrise } from "react-icons/wi";
import { WiMoonrise } from "react-icons/wi";
import { format } from "date-fns";
import { MdPhoneInTalk } from "react-icons/md";
import { IoMdChatboxes } from "react-icons/io";
import { useRouter } from "next/navigation";
import { OrbitProgress } from "react-loading-indicators";
import { MenuContext } from "../context/MenuContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaClock } from "react-icons/fa";
import { FaRegCalendarAlt, FaInfoCircle, FaStar } from "react-icons/fa";

const TodayPanchangClient = () => {
    const { LanguageDropdown, Get_find_sun_moon, sunmoonData, setsunmoonData, FindTithiData, setFindTithiData, Get_find_tithi, Get_find_Nakshatra,
        nakshatraData, setnakshatraData, Get_find_yoga, yogaData, setyogaData } = useContext(MenuContext);

    const defaultLocation = {
        city: "New Delhi, Delhi, India",
        latitude: "28.6139",
        longitude: "77.2090",
        timezone: "5.5",
    };

    const { t } = useTranslation();
    const [value, setValue] = useState({ BirthPlace: defaultLocation.city, });
    const [Locationdata, setLocationdata] = useState([]);
    const [length, setLength] = useState(null);
    const [latitudedata, setLatitudedata] = useState("28.6139");
    const [longitudedata, setLongitudedata] = useState("77.2090");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [p1placeData, setp1placeData] = useState(defaultLocation?.city);
    const [karanaData, setkaranaData] = useState();
    const [samvatData, setsamvatData] = useState();
    const [choghadiyaData, setchoghadiyaData] = useState();
    const [auspiciousData, setauspiciousData] = useState();
    const [todayKarana, setTodayKarana] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const today = new Date();

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setValue({ ...value, [e.target.name]: inputValue });
        if (typeof inputValue === "string") {
            setLength(inputValue.length);
            if (inputValue?.length === 0) {
                setLocationdata([]);
            }
        } else {
            setLength(null);
        }
    };

    const handleSelect = (description, lat, lon) => {
        setValue({ ...value, BirthPlace: description });
        setLatitudedata(lat);
        setLongitudedata(lon);
        setLocationdata([]);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (length > 3) {
            Get_Data_Location();
        }
    }, [length]);

    const Get_Data_Location = async () => {
        const val = { address: value?.BirthPlace };
        try {
            const res = await postWithToken('Location/GetLocation', val);
            console.log(res, 'res')
            if (res) {
                setLocationdata(res?.filter((item) => item?.display_name));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        Get_find_tithi(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
        Get_find_sun_moon(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
        Get_find_Nakshatra(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
        Get_find_yoga(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
        Get_find_karana();
        Get_find_samvat();
        Get_find_choghadiya();
        Get_auspicious_timings();
    }, [LanguageDropdown, latitudedata, longitudedata, selectedDate])

    const Get_find_karana = async () => {
        const val = {
            "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
            "p1_year": format(new Date(selectedDate), "yyyy"),
            "p1_month": format(new Date(selectedDate), "MM"),
            "p1_day": format(new Date(selectedDate), "dd"),
            "p1_lat": latitudedata,
            "p1_lon": longitudedata,
            "p1_tzone": "5.5",
            "p1_place": p1placeData,
            "lan": LanguageDropdown
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_karana", val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const response = parseData?.data;
            if (response) {
                setkaranaData(response);
            }
        } catch (error) {
            console.error("Error fetching horoscope chart:", error);
        }
    };

    const Get_find_samvat = async () => {
        const val = {
            "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
            "p1_year": format(new Date(selectedDate), "yyyy"),
            "p1_month": format(new Date(selectedDate), "MM"),
            "p1_day": format(new Date(selectedDate), "dd"),
            "p1_lat": latitudedata,
            "p1_lon": longitudedata,
            "p1_tzone": "5.5",
            "p1_place": p1placeData,
            "lan": LanguageDropdown
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_samvat", val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const response = parseData?.data;
            if (response) {
                setsamvatData(response);
            }
        } catch (error) {
            console.error("Error fetching horoscope chart:", error);
        }
    };

    const Get_find_choghadiya = async () => {
        const val = {
            "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
            "p1_year": format(new Date(selectedDate), "yyyy"),
            "p1_month": format(new Date(selectedDate), "MM"),
            "p1_day": format(new Date(selectedDate), "dd"),
            "p1_lat": latitudedata,
            "p1_lon": longitudedata,
            "p1_tzone": "5.5",
            "p1_place": p1placeData,
            "lan": LanguageDropdown
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_choghadiya", val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const response = parseData?.data;
            if (response) {
                setchoghadiyaData(response);
            }
        } catch (error) {
            console.error("Error fetching horoscope chart:", error);
        }
    };

    const Get_auspicious_timings = async () => {
        const val = {
            "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
            "p1_year": format(new Date(selectedDate), "yyyy"),
            "p1_month": format(new Date(selectedDate), "MM"),
            "p1_day": format(new Date(selectedDate), "dd"),
            "p1_lat": latitudedata,
            "p1_lon": longitudedata,
            "p1_tzone": "5.5",
            "p1_place": p1placeData,
            "lan": LanguageDropdown
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/auspicious_timings", val);
            const { data } = res;
            const parseData = JSON.parse(data);
            const response = parseData?.data;
            if (response) {
                setauspiciousData(response);
            }
        } catch (error) {
            console.error("Error fetching horoscope chart:", error);
        }
    };

    const todayTithi = isClient && FindTithiData?.tithis?.find((t) => {
        const start = new Date(t.start_time);
        const end = new Date(t.end_time);
        return today >= start && today <= end;
    });

    useEffect(() => {
        if (isClient && karanaData?.karnas) {
            const now = new Date();
            const found = karanaData.karnas.find((k) => {
                const start = new Date(k.start_time);
                const end = new Date(k.end_time);
                return now >= start && now <= end;
            });
            setTodayKarana(found);
        }
    }, [karanaData, isClient]);

    return (
        <>
            {/* <Header /> */}

            <div className="main-container">
                <div className=" bg-primaryColor text-white text-center py-10 sm:py-12 md:py-16 mt-16 sm:mt-20 md:mt-[5rem] rounded-lg sm:rounded-xl shadow-sm px-3 sm:px-4 mt-16">
                    <div className="flex items-center justify-center">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white px-2">
                            Today's Panchang
                        </h2>
                    </div>
                    <p className="text-white mt-2 sm:mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base px-2 leading-relaxed">
                        Explore the traditional Hindu astrological calendar to find auspicious times and
                        plan important activities accordingly
                    </p>
                </div>
            </div>

            <div className="relative form_data rounded-md px-3 sm:px-4">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 w-full max-w-3xl mx-auto mb-6 sm:mb-8 mt-[-1.5rem] sm:mt-[-2rem] border border-gray-100">
                    {/* Top Section: Date & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6">
                        {/* Date Box */}
                        <div className="bg-[#F9F9F9] p-4 sm:p-5 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 border border-gray-200">
                            <span className="text-[#FF6600] text-lg sm:text-xl flex-shrink-0">
                                <i className="fas fa-calendar-alt" />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Select Date</p>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                    }}
                                    dateFormat="MMMM d, yyyy"
                                    className="text-sm sm:text-base font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer w-full"
                                />
                            </div>
                        </div>

                        {/* Location Box */}
                        <div className="bg-[#F9F9F9] p-4 sm:p-5 rounded-lg sm:rounded-xl flex flex-col gap-2 border border-gray-200">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-[#FF6600] text-lg sm:text-xl flex-shrink-0">
                                    <i className="fas fa-map-marker-alt" />
                                </span>
                                <p className="text-xs sm:text-sm text-gray-500 font-medium">Location</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="BirthPlace"
                                    value={value?.BirthPlace}
                                    onChange={handleInputChange}
                                    placeholder="Enter City Name"
                                    className="p-2.5 sm:p-3 w-full text-sm sm:text-base text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] outline-none"
                                    autoComplete="off"
                                />
                                {/* Autocomplete List */}
                                {Locationdata?.length > 0 && (
                                    <div className="absolute left-0 w-full bg-white rounded-lg shadow-lg max-h-[200px] sm:max-h-[220px] overflow-y-auto z-50 mt-2 border border-gray-100">
                                        {Locationdata.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-2.5 sm:p-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer transition text-xs sm:text-sm"
                                                onClick={() => { handleSelect(item?.display_name, item?.lat, item?.lon); setp1placeData(item?.display_name) }}
                                            >
                                                <i className="fas fa-map-pin text-[#FF6600] flex-shrink-0" />
                                                <span className="truncate">{item?.display_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Day Info */}
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 leading-relaxed px-2">
                            {isClient && selectedDate &&
                                new Date(selectedDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            {isClient && value?.BirthPlace && (
                                <>
                                    <span className="hidden sm:inline"> | </span>
                                    <span className="block sm:inline text-[#FF6600] font-semibold">
                                        {value?.BirthPlace}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                <div className="bg-[#FFE7D6] py-6 sm:py-8 relative">
                    <div className="absolute top-[0] left-[-90px] left-image hidden lg:block">
                        <Image
                            className="carousel-image_left"
                            src="/images/customar-position-image.webp"
                            alt="Decorative left image"
                            width={200}
                            height={200}
                        />
                    </div>
                    <div className="absolute bottom-[0] right-[-90px] right-image hidden lg:block">
                        <Image
                            className="carousel-image"
                            src="/images/customar-before.webp"
                            alt="Decorative right image"
                            width={200}
                            height={200}
                        />
                    </div>
                    <div className="main-container relative px-3 sm:px-4">
                        <section className="py-4 sm:py-6 md:py-8">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                <FaClock className="text-[#F97316] text-xl sm:text-2xl flex-shrink-0" />
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F97316]">
                                    Celestial Timings
                                </h2>
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {/* Sunrise */}
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg px-3 sm:px-4 py-3 sm:py-4 md:py-5 flex items-center gap-2 sm:gap-3 md:gap-5 transition">
                                    <div className="flex justify-center flex-shrink-0">
                                        <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-[#FFDF40] to-[#FFA900]">
                                            <WiSunrise className="text-white text-2xl sm:text-3xl md:text-4xl" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Sunrise</span>
                                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                                            {sunmoonData?.sunrise || "--"}
                                        </span>
                                    </div>
                                </div>

                                {/* Sunset */}
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg px-3 sm:px-4 py-3 sm:py-4 md:py-5 flex items-center gap-2 sm:gap-3 md:gap-5 transition">
                                    <div className="flex justify-center flex-shrink-0">
                                        <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-[#FF9A9A] to-[#EF4444]">
                                            <WiSunset className="text-white text-2xl sm:text-3xl md:text-4xl" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Sunset</span>
                                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                                            {sunmoonData?.sunset || "--"}
                                        </span>
                                    </div>
                                </div>

                                {/* Moonrise */}
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg px-3 sm:px-4 py-3 sm:py-4 md:py-5 flex items-center gap-2 sm:gap-3 md:gap-5 transition">
                                    <div className="flex justify-center flex-shrink-0">
                                        <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-[#A5D8FF] to-[#3B82F6]">
                                            <WiMoonrise className="text-white text-2xl sm:text-3xl md:text-4xl" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Moonrise</span>
                                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                                            {sunmoonData?.moonrise || "--"}
                                        </span>
                                    </div>
                                </div>

                                {/* Moonset */}
                                <div className="bg-white rounded-lg shadow-md hover:shadow-lg px-3 sm:px-4 py-3 sm:py-4 md:py-5 flex items-center gap-2 sm:gap-3 md:gap-5 transition">
                                    <div className="flex justify-center flex-shrink-0">
                                        <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-[#CBD5E1] to-[#64748B]">
                                            <WiMoonset className="text-white text-2xl sm:text-3xl md:text-4xl" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Moonset</span>
                                        <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                                            {sunmoonData?.moonset || "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg sm:rounded-xl mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-16 overflow-hidden w-full max-w-6xl mx-auto px-3 sm:px-4">
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-xs sm:text-sm md:text-base">
                        <tbody>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700 w-1/3 sm:w-1/4">
                                    Tithi
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {isClient && (todayTithi ? todayTithi?.tithi : "No Tithi Found")}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Nakshatra
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {nakshatraData?.nakshatras?.nakshatra_list?.[0] || "--"}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Yoga
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {yogaData?.yogas?.[0]?.yoga_name || "--"}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Karana
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {isClient && (todayKarana ? todayKarana.karana_name : "No Karana Found")}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Paksha
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800">--</td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Weekday
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {isClient && format(new Date(selectedDate), "EEEE")}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Shaka Samvat
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {samvatData?.shaka_year || "--"} {samvatData?.shaka_name || ""}
                                </td>
                            </tr>
                            <tr>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold text-gray-700">
                                    Vikram Samvat
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-gray-800 break-words">
                                    {samvatData?.vikram_year || "--"} {samvatData?.vikram_name || ""}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {isClient && choghadiyaData && (
                <div className="w-full max-w-6xl mx-auto my-8 sm:my-12 md:my-16 px-3 sm:px-4">
                    {/* Day Choghadiya */}
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-orange-500 mb-3 sm:mb-4">
                        Day Choghadiya
                    </h3>
                    <div className="overflow-x-auto mb-8 sm:mb-12 md:mb-16">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm min-w-[300px]">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-2 sm:px-3 py-2 text-left">Name</th>
                                    <th className="border px-2 sm:px-3 py-2 text-left">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(choghadiyaData.day_choghadiyas || {}).map(([name, time], idx) => (
                                    <tr key={idx} className="border-t hover:bg-gray-50">
                                        <td className="border px-2 sm:px-3 py-2 font-medium">{name}</td>
                                        <td className="border px-2 sm:px-3 py-2">{time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Night Choghadiya */}
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-orange-500 mb-3 sm:mb-4">
                        Night Choghadiya
                    </h3>
                    <div className="overflow-x-auto mb-8 sm:mb-12 md:mb-16">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm min-w-[300px]">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-2 sm:px-3 py-2 text-left">Name</th>
                                    <th className="border px-2 sm:px-3 py-2 text-left">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(choghadiyaData.night_choghadiyas || {}).map(([name, time], idx) => (
                                    <tr key={idx} className="border-t hover:bg-gray-50">
                                        <td className="border px-2 sm:px-3 py-2 font-medium">{name}</td>
                                        <td className="border px-2 sm:px-3 py-2">{time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isClient && auspiciousData && (
                <div className="w-full max-w-6xl mx-auto my-8 sm:my-12 md:my-16 px-3 sm:px-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500 mb-4 sm:mb-6">
                        Auspicious Timings
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm min-w-[400px]">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-2 sm:px-3 py-2 text-left">Name</th>
                                    <th className="border px-2 sm:px-3 py-2 text-left">Start Time</th>
                                    <th className="border px-2 sm:px-3 py-2 text-left">End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(auspiciousData).map(([key, value], idx) => {
                                    // skip already shown fields
                                    if (["date", "sunrise", "sunset"].includes(key)) return null;

                                    // if value is object with start_time and end_time
                                    if (value && typeof value === "object" && !Array.isArray(value)) {
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border px-2 sm:px-3 py-2 capitalize font-medium">
                                                    {key.replace(/_/g, " ")}
                                                </td>
                                                <td className="border px-2 sm:px-3 py-2">{value.start_time || "--"}</td>
                                                <td className="border px-2 sm:px-3 py-2">{value.end_time || "--"}</td>
                                            </tr>
                                        );
                                    }

                                    // if value is array (like siddhi_yoga, ravi_yoga)
                                    if (Array.isArray(value) && value.length > 0) {
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border px-2 sm:px-3 py-2 capitalize font-medium">
                                                    {key.replace(/_/g, " ")}
                                                </td>
                                                <td colSpan={2} className="border px-2 sm:px-3 py-2 break-words">
                                                    {value.join(", ")}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return null;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default TodayPanchangClient;
