"use client";

import React, { useContext, useEffect, useState } from "react";
import { WiSunrise, WiSunset, WiMoonrise, WiMoonset } from "react-icons/wi";
import { FaClock } from "react-icons/fa";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { getPostData, TokenWithDeleteUpadateAdd ,postWithToken} from "@/app/utils/api";


export default function TodayPanchang() {
    const {
        LanguageDropdown,
        Get_find_sun_moon,
        sunmoonData,
        FindTithiData,
        Get_find_tithi,
        Get_find_Nakshatra,
        nakshatraData,
        Get_find_yoga,
        yogaData,
    } = useMenuContext();

    const defaultLocation = {
        city: "New Delhi, India",
        latitude: "28.6139",
        longitude: "77.2090",
    };

    const [value, setValue] = useState({
        BirthPlace: defaultLocation.city,
    });

    const [Locationdata, setLocationdata] = useState([]);
    const [length, setLength] = useState(null);

    const [latitudedata, setLatitudedata] = useState(defaultLocation.latitude);
    const [longitudedata, setLongitudedata] = useState(defaultLocation.longitude);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [p1placeData, setp1placeData] = useState(defaultLocation.city);

    const [karanaData, setkaranaData] = useState();
    const [samvatData, setsamvatData] = useState();
    const [choghadiyaData, setchoghadiyaData] = useState();
    const [auspiciousData, setauspiciousData] = useState();

    const [todayKarana, setTodayKarana] = useState(null);

    const today = new Date();

    // ---------------- Location Search ----------------
    const handleInputChange = (e) => {
        const val = e.target.value;
        setValue({ BirthPlace: val });
        setLength(val.length);
    };

    const handleSelect = (desc, lat, lon) => {
        setValue({ BirthPlace: desc });
        setLatitudedata(lat);
        setLongitudedata(lon);
        setp1placeData(desc);
        setLocationdata([]);
    };

    useEffect(() => {
        if (length > 3) Get_Data_Location();
    }, [length]);

    const Get_Data_Location = async () => {
        try {
            const res = await postWithToken("Location/GetLocation", {
                address: value?.BirthPlace,
            });
            if (res) setLocationdata(res);
        } catch (err) {
            console.log(err);
        }
    };

    // ---------------- Panchang APIs ----------------
    useEffect(() => {
        Get_find_tithi(selectedDate, latitudedata, longitudedata, p1placeData);
        Get_find_sun_moon(selectedDate, latitudedata, longitudedata, p1placeData);
        Get_find_Nakshatra(selectedDate, latitudedata, longitudedata, p1placeData);
        Get_find_yoga(selectedDate, latitudedata, longitudedata, p1placeData);

        Get_find_karana();
        Get_find_samvat();
        Get_find_choghadiya();
        Get_auspicious_timings();
    }, [selectedDate, latitudedata, longitudedata, LanguageDropdown]);

    // ---------------- Extra APIs ----------------
    const createPayload = () => ({
        p1_Date: format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
        p1_year: format(new Date(selectedDate), "yyyy"),
        p1_month: format(new Date(selectedDate), "MM"),
        p1_day: format(new Date(selectedDate), "dd"),
        p1_lat: latitudedata,
        p1_lon: longitudedata,
        p1_tzone: "5.5",
        p1_place: p1placeData,
        lan: LanguageDropdown,
    });

    const commonAPI = async (endpoint, setter) => {
        try {
            const res = await TokenWithDeleteUpadateAdd(endpoint, createPayload());
            const parse = JSON.parse(res?.data);
            setter(parse?.data);
        } catch (e) {
            console.log(e);
        }
    };

    const Get_find_karana = () =>
        commonAPI("KundaliMatchMaking/find_karana", setkaranaData);

    const Get_find_samvat = () =>
        commonAPI("KundaliMatchMaking/find_samvat", setsamvatData);

    const Get_find_choghadiya = () =>
        commonAPI("KundaliMatchMaking/find_choghadiya", setchoghadiyaData);

    const Get_auspicious_timings = () =>
        commonAPI("KundaliMatchMaking/auspicious_timings", setauspiciousData);

    // ---------------- Today Data ----------------
    const todayTithi = FindTithiData?.tithis?.find((t) => {
        const start = new Date(t.start_time);
        const end = new Date(t.end_time);
        return today >= start && today <= end;
    });

    useEffect(() => {
        if (karanaData?.karnas) {
            const now = new Date();
            const found = karanaData.karnas.find((k) => {
                const s = new Date(k.start_time);
                const e = new Date(k.end_time);
                return now >= s && now <= e;
            });
            setTodayKarana(found);
        }
    }, [karanaData]);

    // ---------------- UI ----------------
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 mt-2">
                {/* <h1 className="text-4xl font-bold text-center mb-10">
                    Talk with Astrologers
                </h1> */}
                <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen pb-20">

                    {/* 🔥 HERO SECTION */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 text-center shadow-lg rounded-lg sm:rounded-xl">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Today’s Panchang
                        </h1>
                        <p className="mt-3 text-sm md:text-base opacity-90 max-w-xl mx-auto">
                            Get accurate Hindu calendar details including Tithi, Nakshatra, Yoga & Muhurat
                        </p>
                    </div>

                    {/* 🔥 SEARCH CARD */}
                    <div className="max-w-5xl mx-auto px-4 -mt-12">
                        <div className="backdrop-blur-md bg-white/90 border border-white/30 shadow-2xl rounded-2xl p-6 md:p-8">

                            <div className="grid md:grid-cols-2 gap-6">

                                {/* Date */}
                                <div>
                                    <label className="text-sm text-gray-500">Select Date</label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(d) => setSelectedDate(d)}
                                        className="w-full mt-1 border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="text-sm text-gray-500">Location</label>
                                    <input
                                        value={value.BirthPlace}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        className="w-full mt-1 border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                                    />

                                    {Locationdata?.length > 0 && (
                                        <div className="bg-white shadow-lg rounded-xl mt-2 max-h-40 overflow-y-auto border">
                                            {Locationdata.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 hover:bg-orange-50 cursor-pointer text-sm"
                                                    onClick={() =>
                                                        handleSelect(item.display_name, item.lat, item.lon)
                                                    }
                                                >
                                                    {item.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* 🔥 SUN / MOON CARDS */}
                    <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">

                        {[
                            { title: "Sunrise", value: sunmoonData?.sunrise, icon: <WiSunrise /> },
                            { title: "Sunset", value: sunmoonData?.sunset, icon: <WiSunset /> },
                            { title: "Moonrise", value: sunmoonData?.moonrise, icon: <WiMoonrise /> },
                            { title: "Moonset", value: sunmoonData?.moonset, icon: <WiMoonset /> },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition border border-gray-100"
                            >
                                <div className="text-orange-500 text-4xl mb-2">{item.icon}</div>
                                <p className="text-gray-500 text-sm">{item.title}</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {item.value || "--"}
                                </p>
                            </div>
                        ))}

                    </div>

                    {/* 🔥 PANCHANG TABLE */}
                    <div className="max-w-5xl mx-auto px-4 mt-12">
                        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">

                            <div className="bg-orange-500 text-white px-6 py-4 text-lg font-semibold">
                                Panchang Details
                            </div>

                            <table className="w-full text-sm md:text-base">
                                <tbody>

                                    {[
                                        ["Tithi", todayTithi?.tithi],
                                        ["Nakshatra", nakshatraData?.nakshatras?.nakshatra_list?.[0]],
                                        ["Yoga", yogaData?.yogas?.[0]?.yoga_name],
                                        ["Karana", todayKarana?.karana_name],
                                        ["Weekday", format(new Date(selectedDate), "EEEE")],
                                        ["Shaka Samvat", `${samvatData?.shaka_year || "--"} ${samvatData?.shaka_name || ""}`],
                                        ["Vikram Samvat", `${samvatData?.vikram_year || "--"} ${samvatData?.vikram_name || ""}`],
                                    ].map(([label, value], i) => (
                                        <tr key={i} className="border-b hover:bg-orange-50 transition">
                                            <td className="p-4 text-gray-600 font-medium w-1/3">
                                                {label}
                                            </td>
                                            <td className="p-4 text-gray-900">
                                                {value || "--"}
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 🔥 CHOGHADIYA */}
                    {choghadiyaData && (
                        <div className="max-w-5xl mx-auto px-4 mt-12">

                            <h3 className="text-xl font-semibold text-orange-500 mb-4">
                                Day Choghadiya
                            </h3>

                            <div className="bg-white rounded-xl shadow border overflow-hidden mb-8">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {Object.entries(choghadiyaData.day_choghadiyas || {}).map(([n, t], i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{n}</td>
                                                <td className="p-3">{t}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="text-xl font-semibold text-orange-500 mb-4">
                                Night Choghadiya
                            </h3>

                            <div className="bg-white rounded-xl shadow border overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {Object.entries(choghadiyaData.night_choghadiyas || {}).map(([n, t], i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="p-3">{n}</td>
                                                <td className="p-3">{t}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}

                    {/* 🔥 AUSPICIOUS TIMINGS */}
                    {auspiciousData && (
                        <div className="max-w-5xl mx-auto px-4 mt-12">

                            <h2 className="text-2xl font-bold text-orange-500 mb-6">
                                Auspicious Timings
                            </h2>

                            <div className="bg-white rounded-xl shadow border overflow-hidden">
                                <table className="w-full text-sm">
                                    <tbody>

                                        {Object.entries(auspiciousData).map(([key, val], i) => {

                                            if (["date", "sunrise", "sunset"].includes(key)) return null;

                                            if (typeof val === "object" && !Array.isArray(val)) {
                                                return (
                                                    <tr key={i} className="border-b hover:bg-gray-50">
                                                        <td className="p-3 capitalize">{key.replace(/_/g, " ")}</td>
                                                        <td className="p-3">{val.start_time}</td>
                                                        <td className="p-3">{val.end_time}</td>
                                                    </tr>
                                                );
                                            }

                                            if (Array.isArray(val)) {
                                                return (
                                                    <tr key={i} className="border-b hover:bg-gray-50">
                                                        <td className="p-3 capitalize">{key.replace(/_/g, " ")}</td>
                                                        <td colSpan={2} className="p-3">{val.join(", ")}</td>
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

                </div>
            </div>
        </div>
    );
}