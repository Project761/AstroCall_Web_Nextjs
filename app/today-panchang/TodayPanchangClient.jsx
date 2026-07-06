"use client";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  WiSunrise, WiSunset, WiMoonrise, WiMoonset,
} from "react-icons/wi";
import {
  FaChevronRight, FaChevronLeft, FaShieldAlt, FaStar, FaOm, FaClock,
  FaMapMarkerAlt, FaCommentDots, FaPhone, FaVideo, FaArrowUp, FaCheckCircle,
  FaCalendarAlt, FaSun, FaMoon,
} from "react-icons/fa";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api";
import { MenuContext } from "../context/MenuContext";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";
const CARD = "rounded-xl border border-gray-100 bg-white shadow-sm";

const SIDEBAR_LINKS = [
  { label: "Today's Panchang", href: "/today-panchang", active: true },
  { label: "Panchang Calendar", href: "/today-panchang" },
  { label: "Muhurat", href: "/Muhurat", badge: "New" },
  { label: "Festivals", href: "/VratUpvaas" },
  { label: "Vrata & Vrat Katha", href: "/VratUpvaas" },
  { label: "Choghadiya", href: "/today-panchang" },
];

const TRUST_ITEMS = [
  { icon: FaCheckCircle, title: "100% Accurate", sub: "Vedic calculations" },
  { icon: FaStar, title: "Personalized", sub: "Location based" },
  { icon: FaClock, title: "Timely Updates", sub: "Daily refresh" },
  { icon: FaShieldAlt, title: "Private & Secure", sub: "Your data safe" },
];

const INAUSPICIOUS_KEYS = ["rahu", "yamaganda", "gulika", "dur", "varjyam"];

const formatTill = (dateStr) => {
  if (!dateStr) return "";
  try {
    return `till ${format(new Date(dateStr), "hh:mm a")}`;
  } catch {
    return "";
  }
};

const parseTimeToMins = (t) => {
  if (!t || t === "--") return null;
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
};

const TodayPanchangClient = () => {
  const router = useRouter();
  const { LanguageDropdown, Get_find_sun_moon, sunmoonData, FindTithiData, Get_find_tithi, Get_find_Nakshatra,
    nakshatraData, Get_find_yoga, yogaData } = useContext(MenuContext);

  const defaultLocation = {
    city: "New Delhi, Delhi, India",
    latitude: "28.6139",
    longitude: "77.2090",
  };

  const [value, setValue] = useState({ BirthPlace: defaultLocation.city });
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
  const [isClient, setIsClient] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const today = new Date();

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue({ ...value, [e.target.name]: inputValue });
    if (typeof inputValue === "string") {
      setLength(inputValue.length);
      if (inputValue?.length === 0) setLocationdata([]);
    } else {
      setLength(null);
    }
  };

  const handleSelect = (description, lat, lon) => {
    setValue({ ...value, BirthPlace: description });
    setLatitudedata(lat);
    setLongitudedata(lon);
    setp1placeData(description);
    setLocationdata([]);
    setShowLocationEdit(false);
  };

  const Get_Data_Location = useCallback(async () => {
    const val = { address: value?.BirthPlace };
    try {
      const res = await postWithToken("Location/GetLocation", val);
      if (res) setLocationdata(res?.filter((item) => item?.display_name));
    } catch (error) {
      console.log(error);
    }
  }, [value?.BirthPlace]);

  const buildApiVal = useCallback(() => ({
    p1_Date: format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
    p1_year: format(new Date(selectedDate), "yyyy"),
    p1_month: format(new Date(selectedDate), "MM"),
    p1_day: format(new Date(selectedDate), "dd"),
    p1_lat: latitudedata,
    p1_lon: longitudedata,
    p1_tzone: "5.5",
    p1_place: p1placeData,
    lan: LanguageDropdown,
  }), [selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown]);

  const Get_find_karana = useCallback(async () => {
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_karana", buildApiVal());
      const parseData = JSON.parse(res.data);
      if (parseData?.data) setkaranaData(parseData.data);
    } catch (error) {
      console.error("Error fetching karana:", error);
    }
  }, [buildApiVal]);

  const Get_find_samvat = useCallback(async () => {
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_samvat", buildApiVal());
      const parseData = JSON.parse(res.data);
      if (parseData?.data) setsamvatData(parseData.data);
    } catch (error) {
      console.error("Error fetching samvat:", error);
    }
  }, [buildApiVal]);

  const Get_find_choghadiya = useCallback(async () => {
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_choghadiya", buildApiVal());
      const parseData = JSON.parse(res.data);
      if (parseData?.data) setchoghadiyaData(parseData.data);
    } catch (error) {
      console.error("Error fetching choghadiya:", error);
    }
  }, [buildApiVal]);

  const Get_auspicious_timings = useCallback(async () => {
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/auspicious_timings", buildApiVal());
      const parseData = JSON.parse(res.data);
      if (parseData?.data) setauspiciousData(parseData.data);
    } catch (error) {
      console.error("Error fetching timings:", error);
    }
  }, [buildApiVal]);

  useEffect(() => { queueMicrotask(() => setIsClient(true)); }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (length > 3) void (async () => { await Get_Data_Location(); })();
  }, [length, Get_Data_Location]);

  useEffect(() => {
    void (async () => {
      Get_find_tithi(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
      Get_find_sun_moon(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
      Get_find_Nakshatra(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
      Get_find_yoga(selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown);
      await Promise.all([
        Get_find_karana(),
        Get_find_samvat(),
        Get_find_choghadiya(),
        Get_auspicious_timings(),
      ]);
    })();
  }, [LanguageDropdown, latitudedata, longitudedata, selectedDate, p1placeData, Get_find_tithi, Get_find_sun_moon, Get_find_Nakshatra, Get_find_yoga, Get_find_karana, Get_find_samvat, Get_find_choghadiya, Get_auspicious_timings]);

  const todayTithi = isClient && FindTithiData?.tithis?.find((t) => {
    const start = new Date(t.start_time);
    const end = new Date(t.end_time);
    return today >= start && today <= end;
  });

  useEffect(() => {
    if (!isClient || !karanaData?.karnas) return;
    queueMicrotask(() => {
      const now = new Date();
      const found = karanaData.karnas.find((k) => {
        const start = new Date(k.start_time);
        const end = new Date(k.end_time);
        return now >= start && now <= end;
      });
      setTodayKarana(found);
    });
  }, [karanaData, isClient]);

  const currentNakshatra = nakshatraData?.nakshatras?.nakshatra_list?.[0] || "—";
  const currentYoga = yogaData?.yogas?.[0]?.yoga_name || "—";
  const currentTithi = todayTithi?.tithi || FindTithiData?.tithis?.[0]?.tithi || "—";
  const currentKarana = todayKarana?.karana_name || "—";
  const paksha = currentTithi?.toLowerCase?.().includes("shukla") ? "Shukla Paksha" : currentTithi?.toLowerCase?.().includes("krishna") ? "Krishna Paksha" : "—";

  const quickInfo = [
    { label: "Tithi", val: currentTithi, sub: formatTill(todayTithi?.end_time || FindTithiData?.tithis?.[0]?.end_time) },
    { label: "Nakshatra", val: currentNakshatra, sub: formatTill(nakshatraData?.nakshatras?.end_time) },
    { label: "Yoga", val: currentYoga, sub: formatTill(yogaData?.yogas?.[0]?.end_time) },
    { label: "Karana", val: currentKarana, sub: formatTill(todayKarana?.end_time) },
    { label: "Paksha", val: paksha, sub: "" },
    { label: "Weekday", val: isClient ? format(new Date(selectedDate), "EEEE") : "—", sub: "" },
  ];

  const panchangLeft = [
    { icon: FaOm, label: "Tithi", val: currentTithi },
    { icon: FaStar, label: "Nakshatra", val: currentNakshatra },
    { icon: FaSun, label: "Yoga", val: currentYoga },
    { icon: FaMoon, label: "Karana", val: currentKarana },
    { icon: FaCalendarAlt, label: "Paksha", val: paksha },
  ];

  const panchangRight = [
    { icon: WiSunrise, label: "Sunrise", val: sunmoonData?.sunrise || "—" },
    { icon: WiSunset, label: "Sunset", val: sunmoonData?.sunset || "—" },
    { icon: WiMoonrise, label: "Moonrise", val: sunmoonData?.moonrise || "—" },
    { icon: WiMoonset, label: "Moonset", val: sunmoonData?.moonset || "—" },
    { icon: FaSun, label: "Vikram Samvat", val: samvatData ? `${samvatData.vikram_year || ""} ${samvatData.vikram_name || ""}`.trim() : "—" },
  ];

  const extraDetails = showMoreDetails ? [
    { label: "Shaka Samvat", val: samvatData ? `${samvatData.shaka_year || ""} ${samvatData.shaka_name || ""}`.trim() : "—" },
    { label: "Weekday", val: isClient ? format(new Date(selectedDate), "EEEE") : "—" },
  ] : [];

  const { auspiciousList, inauspiciousList } = useMemo(() => {
    const aus = [];
    const inaus = [];
    if (!auspiciousData) return { auspiciousList: aus, inauspiciousList: inaus };
    Object.entries(auspiciousData).forEach(([key, val]) => {
      if (["date", "sunrise", "sunset"].includes(key)) return;
      const label = key.replace(/_/g, " ");
      if (val && typeof val === "object" && !Array.isArray(val) && val.start_time) {
        const item = { label, time: `${val.start_time} – ${val.end_time || ""}` };
        if (INAUSPICIOUS_KEYS.some((k) => key.toLowerCase().includes(k))) inaus.push(item);
        else aus.push(item);
      }
    });
    return { auspiciousList: aus, inauspiciousList: inaus };
  }, [auspiciousData]);

  const choghadiyaList = useMemo(() => {
    if (!choghadiyaData?.day_choghadiyas) return [];
    return Object.entries(choghadiyaData.day_choghadiyas).map(([name, time]) => ({ name, time }));
  }, [choghadiyaData]);

  const dayNight = useMemo(() => {
    const sr = parseTimeToMins(sunmoonData?.sunrise);
    const ss = parseTimeToMins(sunmoonData?.sunset);
    if (sr == null || ss == null) return null;
    const dayMins = ss > sr ? ss - sr : (24 * 60 - sr) + ss;
    const nightMins = 24 * 60 - dayMins;
    const fmt = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;
    return { day: fmt(dayMins), night: fmt(nightMins), dayPct: Math.round((dayMins / (24 * 60)) * 100) };
  }, [sunmoonData]);

  const calendarDays = useMemo(() => {
    const d = new Date(selectedDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);
    return cells;
  }, [selectedDate]);

  const dateDisplay = isClient && selectedDate
    ? {
      weekday: format(new Date(selectedDate), "EEEE"),
      day: format(new Date(selectedDate), "d"),
      monthYear: format(new Date(selectedDate), "MMMM yyyy"),
    }
    : { weekday: "—", day: "—", monthYear: "—" };

  return (
    <div className="min-h-screen bg-[#F5F6F8] pt-[72px] pb-28">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.Panchang}
        currentPage="Today's Panchang"
        title="Today's Panchang"
        subtitle="Accurate Panchang based on Vedic calculations for your city and date."
      />

      <div className="main-container px-4 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

          {/* Mobile nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {SIDEBAR_LINKS.map(({ label, href, active, badge }) => (
              <button key={label} type="button" onClick={() => router.push(href)} className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${active ? "text-white" : "border border-gray-200 bg-white text-gray-600"}`} style={active ? { backgroundColor: ORANGE } : {}}>
                {label}{badge && <span className="ml-1 rounded bg-green-500 px-1 text-[8px] text-white">{badge}</span>}
              </button>
            ))}
          </div>

          {/* Left sidebar */}
          <aside className="hidden w-52 shrink-0 space-y-4 lg:block xl:w-56">
            <button type="button" onClick={() => router.push("/")} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF5C00]">
              <FaChevronLeft size={12} /> Back to Home
            </button>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Panchang</p>
            <nav className="space-y-1">
              {SIDEBAR_LINKS.map(({ label, href, active, badge }) => (
                <button key={label} type="button" onClick={() => router.push(href)} className={`relative flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${active ? "bg-orange-50 text-[#FF5C00]" : "text-gray-600 hover:bg-gray-50"}`}>
                  {active && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r" style={{ backgroundColor: ORANGE }} />}
                  <FaOm size={13} className={active ? "text-[#FF5C00]" : "text-gray-400"} />
                  {label}
                  {badge && <span className="ml-auto rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-bold text-white">{badge}</span>}
                </button>
              ))}
            </nav>
            <div className={`overflow-hidden ${CARD}`}>
              <div className="relative h-24 bg-orange-50">
                <Image src="/images/ChatBanner.png" alt="" fill className="object-cover opacity-80" sizes="220px" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#0F172A]">Plan Your Auspicious Moments</p>
                <button type="button" onClick={() => router.push("/Muhurat")} className="mt-2 w-full rounded-lg py-2 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>View Muhurat</button>
              </div>
            </div>
            <div className={`p-3 ${CARD}`}>
              <p className="text-[10px] text-gray-400">Panchang based on Vedic calculations</p>
            </div>
            <div className={`p-3 ${CARD}`}>
              <p className="text-xs font-bold text-[#0F172A]">Need Help?</p>
              <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="mt-2 w-full rounded-lg border py-2 text-xs font-bold text-[#FF5C00]" style={{ borderColor: ORANGE }}>Chat Now</button>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Location + date header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Today&apos;s Panchang</h2>
                <p className="text-xs text-gray-500">Accurate Panchang based on Vedic calculations</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-[#FF5C00]" size={14} />
                <span className="font-semibold text-gray-700">{value?.BirthPlace?.split(",")[0] || "New Delhi"}</span>
                <button type="button" onClick={() => setShowLocationEdit((v) => !v)} className="text-xs font-bold text-[#FF5C00] hover:underline">Change</button>
              </div>
            </div>

            {showLocationEdit && (
              <div className={`relative p-4 ${CARD}`}>
                <input type="text" name="BirthPlace" value={value?.BirthPlace} onChange={handleInputChange} placeholder="Enter city name" className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00]" autoComplete="off" />
                {Locationdata?.length > 0 && (
                  <ul className="absolute left-4 right-4 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-white shadow-lg">
                    {Locationdata.map((item, i) => (
                      <li key={i} onClick={() => handleSelect(item.display_name, item.lat, item.lon)} className="cursor-pointer p-2.5 text-sm hover:bg-orange-50">{item.display_name}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Hero summary card */}
            <div className={`overflow-hidden p-5 ${CARD}`} style={{ borderColor: "#FFE4CC" }}>
              <div className="grid items-center gap-4 lg:grid-cols-[160px_1fr_140px]">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-semibold text-gray-500">{dateDisplay.weekday}</p>
                  <p className="text-5xl font-extrabold text-[#FF5C00]">{dateDisplay.day}</p>
                  <p className="text-sm font-bold text-[#0F172A]">{dateDisplay.monthYear}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-bold text-[#0F172A]">{currentTithi}</p>
                  <p className="text-gray-600">Vikram Samvat {samvatData?.vikram_year || "—"} {samvatData?.vikram_name || ""}</p>
                  <p className="text-gray-600">Shaka Samvat {samvatData?.shaka_year || "—"} {samvatData?.shaka_name || ""}</p>
                  <DatePicker selected={selectedDate} onChange={(d) => setSelectedDate(d)} className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none" dateFormat="dd MMM yyyy" />
                </div>
                <div className="relative mx-auto h-24 w-32">
                  <Image src="/horoimg/1.png" alt="" fill className="object-contain" sizes="130px" />
                </div>
              </div>
            </div>

            {/* Quick info icons */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {quickInfo.map(({ label, val, sub }) => (
                <div key={label} className={`p-3 text-center ${CARD}`}>
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                    <FaOm size={14} className="text-[#FF5C00]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">{label}</p>
                  <p className="mt-0.5 truncate text-xs font-bold text-[#0F172A]">{val}</p>
                  {sub && <p className="text-[9px] text-gray-400">{sub}</p>}
                </div>
              ))}
            </div>

            {/* Panchang details */}
            <div className={`p-5 ${CARD}`}>
              <h3 className="mb-4 text-sm font-bold text-[#0F172A]">Panchang Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  {panchangLeft.map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
                      <Icon size={14} className="shrink-0 text-[#FF5C00]" />
                      <span className="w-24 text-xs font-semibold text-gray-500">{label}</span>
                      <span className="text-sm font-bold text-[#0F172A]">{val}</span>
                    </div>
                  ))}
                  {showMoreDetails && extraDetails.map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
                      <FaCalendarAlt size={14} className="shrink-0 text-[#FF5C00]" />
                      <span className="w-24 text-xs font-semibold text-gray-500">{label}</span>
                      <span className="text-sm font-bold text-[#0F172A]">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {panchangRight.map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
                      <Icon size={16} className="shrink-0 text-[#FF5C00]" />
                      <span className="w-24 text-xs font-semibold text-gray-500">{label}</span>
                      <span className="text-sm font-bold text-[#0F172A]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => setShowMoreDetails((v) => !v)} className="mt-4 w-full rounded-lg border py-2.5 text-xs font-bold text-[#FF5C00] transition hover:bg-orange-50" style={{ borderColor: ORANGE }}>
                {showMoreDetails ? "Show Less ↑" : "View More Panchang Details ↓"}
              </button>
            </div>

            {/* Timings */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className={`overflow-hidden ${CARD}`}>
                <div className="flex items-center gap-2 border-b border-green-100 bg-green-50 px-4 py-3">
                  <FaClock className="text-green-600" size={14} />
                  <h3 className="text-sm font-bold text-green-700">Auspicious Timings</h3>
                </div>
                <ul className="divide-y divide-gray-50 p-2">
                  {auspiciousList.length > 0 ? auspiciousList.map(({ label, time }) => (
                    <li key={label} className="flex items-center justify-between px-2 py-2.5">
                      <span className="text-xs font-semibold capitalize text-gray-700">{label}</span>
                      <span className="text-xs font-bold text-green-600">{time}</span>
                    </li>
                  )) : (
                    <li className="px-2 py-4 text-center text-xs text-gray-400">Loading timings...</li>
                  )}
                </ul>
              </div>
              <div className={`overflow-hidden ${CARD}`}>
                <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-3">
                  <FaClock className="text-red-500" size={14} />
                  <h3 className="text-sm font-bold text-red-600">Inauspicious Timings</h3>
                </div>
                <ul className="divide-y divide-gray-50 p-2">
                  {inauspiciousList.length > 0 ? inauspiciousList.map(({ label, time }) => (
                    <li key={label} className="flex items-center justify-between px-2 py-2.5">
                      <span className="text-xs font-semibold capitalize text-gray-700">{label}</span>
                      <span className="text-xs font-bold text-red-500">{time}</span>
                    </li>
                  )) : (
                    <li className="px-2 py-4 text-center text-xs text-gray-400">Loading timings...</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Festivals placeholder */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Today&apos;s Festival</h3>
                <div className="flex items-start gap-3 rounded-lg bg-orange-50 p-3">
                  <FaOm className="mt-1 shrink-0 text-[#FF5C00]" size={20} />
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{currentTithi !== "—" ? `${currentTithi} Observance` : "No major festival today"}</p>
                    <p className="mt-1 text-xs text-gray-500">Check Vrat & festival calendar for detailed observances.</p>
                    <button type="button" onClick={() => router.push("/VratUpvaas")} className="mt-2 text-xs font-bold text-[#FF5C00] hover:underline">View Vrat Katha →</button>
                  </div>
                </div>
              </div>
              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Upcoming Festivals</h3>
                <ul className="space-y-2 text-xs">
                  {["Pradosh Vrat", "Purnima", "Nirjala Ekadashi"].map((f, i) => (
                    <li key={f} className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="font-semibold text-gray-700">{f}</span>
                      <span className="text-gray-400">{format(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + (i + 1) * 3), "d MMM yyyy")}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => router.push("/VratUpvaas")} className="mt-3 text-xs font-bold text-[#FF5C00] hover:underline">View All Festivals →</button>
              </div>
            </div>

            {/* Night choghadiya (full width below on mobile) */}
            {isClient && choghadiyaData?.night_choghadiyas && (
              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Night Choghadiya</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(choghadiyaData.night_choghadiyas).map(([name, time]) => (
                    <div key={name} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                      <span className="font-semibold text-gray-700">{name}</span>
                      <span className="text-gray-500">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="w-full shrink-0 space-y-4 lg:w-64 xl:w-72">
            {/* Mini calendar */}
            <div className={`p-4 ${CARD}`}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A]">Panchang Calendar</h3>
                <span className="text-xs text-gray-500">{format(new Date(selectedDate), "MMMM yyyy")}</span>
              </div>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const isToday = day === selectedDate.getDate();
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!day}
                      onClick={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                      className={`flex h-7 items-center justify-center rounded-full text-xs font-semibold ${!day ? "invisible" : isToday ? "text-white" : "text-gray-700 hover:bg-orange-50"}`}
                      style={isToday ? { backgroundColor: ORANGE } : {}}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day & Night */}
            {dayNight && (
              <div className={`p-4 text-center ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Day &amp; Night Duration</h3>
                <div className="relative mx-auto mb-3 h-16 w-full max-w-[200px] overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-full bg-gradient-to-r from-orange-300 via-yellow-200 to-purple-300 opacity-60" />
                  <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-full border-4 border-transparent" style={{ borderTopColor: ORANGE, clipPath: `inset(0 ${100 - dayNight.dayPct}% 0 0)` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <div><p className="font-bold text-orange-600">Day</p><p className="text-gray-600">{dayNight.day}</p><p className="text-[10px] text-gray-400">{sunmoonData?.sunrise}</p></div>
                  <div className="text-right"><p className="font-bold text-purple-600">Night</p><p className="text-gray-600">{dayNight.night}</p><p className="text-[10px] text-gray-400">{sunmoonData?.sunset}</p></div>
                </div>
              </div>
            )}

            {/* Sun & Moon info */}
            <div className={`p-4 ${CARD}`}>
              <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Sun &amp; Moon Info</h3>
              <ul className="space-y-2 text-xs">
                {[
                  { label: "Sun Sign", val: "—" },
                  { label: "Moon Sign", val: "—" },
                  { label: "Sun Nakshatra", val: currentNakshatra },
                  { label: "Moon Nakshatra", val: currentNakshatra },
                ].map(({ label, val }) => (
                  <li key={label} className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600">{label}</span>
                    <span className="font-bold text-[#0F172A]">{val}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Choghadiya */}
            {choghadiyaList.length > 0 && (
              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Choghadiya (Today)</h3>
                <ul className="space-y-1.5">
                  {choghadiyaList.map(({ name, time }) => {
                    const isGood = /amrit|labh|shubh|char/i.test(name);
                    return (
                      <li key={name} className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs ${isGood ? "bg-green-50" : "bg-gray-50"}`}>
                        <span className={`font-bold ${isGood ? "text-green-700" : "text-gray-700"}`}>{name}</span>
                        <span className="text-gray-500">{time}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
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

      {/* Sticky bottom */}
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
  );
};

export default TodayPanchangClient;
