"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  FaSearch, FaShieldAlt, FaStar, FaHeart, FaLock,
  FaCommentDots, FaPhone, FaVideo, FaOm, FaArrowUp, FaMagic, FaCheckCircle,
  FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes, FaMars, FaVenus,
} from "react-icons/fa";
import { MdDeleteOutline, MdPhoneInTalk } from "react-icons/md";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api.js";
import AuthModal from "../components/AuthModal";
import PageBanner from "@/app/components/PageBanner";
import { ORANGE, CREAM, CREAM_ALT, PEACH, PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";
import { IoMdChatboxes } from "react-icons/io";

const inputCls =
  "font-body w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100";
const selectCls = `${inputCls} appearance-none cursor-pointer`;
const labelCls = "font-body mb-1.5 block text-xs font-semibold text-[#374151] sm:text-sm";

const STEPS = ["Basic Details", "Kundli Details", "Matching", "Report"];

const HERO_FEATURES = [
  { icon: FaOm, t: "As Per Vedic Astrology" },
  { icon: FaStar, t: "Detailed Compatibility" },
  { icon: FaHeart, t: "Personalized Remedies" },
  { icon: FaShieldAlt, t: "100% Secure & Confidential" },
];

const WHY_ITEMS = [
  "Helps in understanding the nature of your relationship",
  "Reveals compatibility for a happy married life",
  "Identifies potential doshas and their remedies",
  "Guides you towards a prosperous future together",
];

const ASHTAKOOTA = [
  { name: "Varna", score: "1 / 1" },
  { name: "Vashya", score: "2 / 2" },
  { name: "Tara", score: "3 / 3" },
  { name: "Yoni", score: "4 / 4" },
  { name: "Graha Maitri", score: "5 / 5" },
  { name: "Gana", score: "6 / 6" },
  { name: "Bhakoot", score: "7 / 7" },
  { name: "Nadi", score: "8 / 8" },
];

const SAMPLE_COMPAT = [
  { label: "Love", val: 85 },
  { label: "Marriage", val: 90 },
  { label: "Trust", val: 80 },
  { label: "Communication", val: 75 },
  { label: "Understanding", val: 85 },
];

const TRUST_ITEMS = [
  { icon: FaCheckCircle, title: "100% Accurate Matching", sub: "Vedic Guna Milan" },
  { icon: FaOm, title: "Based on Vedic Astrology", sub: "Ashtakoot system" },
  { icon: FaStar, title: "Trusted by Millions", sub: "Across India" },
  { icon: FaShieldAlt, title: "Secure & Confidential", sub: "Data protected" },
];

const CustomModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl">
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ORANGE}, #FF7A33)` }} />
        <div className="p-6">
          {title && (
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-heading text-lg font-bold text-[#1A1A1A]">{title}</h4>
              <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-[#FFF9F1] hover:text-[#FF5C00]" aria-label="Close">
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

function StepProgressBar({ steps, active = 0 }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 sm:px-4 ${i === active ? "bg-white shadow-md ring-1 ring-orange-100" : "bg-white/90 ring-1 ring-orange-50"}`}>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white sm:h-8 sm:w-8"
              style={{ backgroundColor: i === active ? ORANGE : "#D1D5DB" }}
            >
              {i + 1}
            </span>
            <span className={`font-heading whitespace-nowrap text-xs font-bold sm:text-sm ${i === active ? "text-[#FF5C00]" : "text-gray-400"}`}>{step}</span>
          </div>
          {i < steps.length - 1 && <div className="hidden h-0.5 w-6 rounded-full bg-orange-200 sm:block md:w-10" />}
        </React.Fragment>
      ))}
    </div>
  );
}
const MONTHS = [
  { name: "January", number: 1 },
  { name: "February", number: 2 },
  { name: "March", number: 3 },
  { name: "April", number: 4 },
  { name: "May", number: 5 },
  { name: "June", number: 6 },
  { name: "July", number: 7 },
  { name: "August", number: 8 },
  { name: "September", number: 9 },
  { name: "October", number: 10 },
  { name: "November", number: 11 },
  { name: "December", number: 12 },
];
const KundaliMatchingClient = () => {
  const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
  const router = useRouter();


  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [BselectedDay, setBSelectedDay] = useState('1');
  const [GselectedDay, setGSelectedDay] = useState('1');
  const [Bselectedmonth, setBSelectedmonth] = useState('');
  const [Gselectedmonth, setGSelectedmonth] = useState('');
  const [BstartDate, setBStartDate] = useState(new Date());
  const [GstartDate, setGStartDate] = useState(new Date());
  const [BselectedHour, setBSelectedHour] = useState('0');
  const [GselectedHour, setGSelectedHour] = useState('0');
  const [BselectedMinute, setBSelectedMinute] = useState('0');
  const [GselectedMinute, setGSelectedMinute] = useState('0');
  const [BselectedSecond, setBSelectedSecond] = useState('0');
  const [GselectedSecond, setGSelectedSecond] = useState('0');
  const [errors, setErrors] = useState('');
  const [isPopUPOpen, setIsPopupOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [bUnknownTime, setBUnknownTime] = useState(false);
  const [gUnknownTime, setGUnknownTime] = useState(false);
  const [KundliData, setKundliData] = useState();
  const [searchVal, setSearchVal] = useState("");
  const [EditvalMale, setEditvalMale] = useState();
  const [KundliDeleteId, setKundliDeleteId] = useState();
  const [value, setValue] = useState({
    'BName': '', 'BGenderID': '', 'BDay': '', 'BMonth': '', 'BYear': '', 'BHour': '', 'BMinute': '', 'BSecond': '', 'BBirthPlace': '', 'GName': '', 'GGenderID': '', 'GDay': '', 'GMonth': '', 'GYear': '', 'GHour': '', 'GMinute': '', 'GSecond': '', 'GBirthPlace': '', 'CreatedByUser': '', 'coordinates': '', 'Blon': '', 'Blat': '', 'Glon': '', 'Glat': '', 'datetime': '', 'BDOB': '', 'GDOB': ''
  });
  const handleChange = (e) => { setValue({ ...value, [e.target.name]: e.target.value }); };
  const handleSubmit = (e) => { e.preventDefault(); console.log("Form Data Submitted:"); };
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const seconds = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const handleChangeDayB = (event) => { setBSelectedDay(event.target.value); };
  const handleChangeDayG = (event) => { setGSelectedDay(event.target.value); };
  const handleChangemonthB = (event) => { setBSelectedmonth(event.target.value); };
  const handleChangemonthG = (event) => { setGSelectedmonth(event.target.value); };
  const handleHourChangeB = (event) => { setBSelectedHour(event.target.value); };
  const handleHourChangeG = (event) => { setGSelectedHour(event.target.value); };
  const handleChangeMinuteB = (event) => { setBSelectedMinute(event.target.value); };
  const handleChangeMinuteG = (event) => { setGSelectedMinute(event.target.value); };
  const handleChangeSecondB = (event) => { setBSelectedSecond(event.target.value); };
  const handleChangeSecondG = (event) => { setGSelectedSecond(event.target.value); };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("Gid");
      localStorage.removeItem("Bid");
    }
  }, []);
  const locationCacheRef = useRef(new Map());
  const debounceTimersRef = useRef({ B: null, G: null });
  const requestCounterRef = useRef({ B: 0, G: 0 });
  const checkValidationErrors = () => {
    const newErrors = {};
    if (!value?.BName) {
      newErrors.BName = 'Required';
    }
    if (!value?.BBirthPlace) {
      newErrors.BBirthPlace = 'Required';
    }
    else if (value?.BBirthPlace?.length <= 3) {
      newErrors.BBirthPlace = "Must be more than 3 characters";
    }
    else if (!value?.Blat || !value?.Blon) {
      newErrors.BBirthPlace = "Please select a valid Birth Place from the list.";
    }
    if (!value?.GBirthPlace) {
      newErrors.GBirthPlace = 'Required';
    }
    else if (value?.GBirthPlace?.length <= 3) {
      newErrors.GBirthPlace = "Must be more than 3 characters";
    }
    else if (!value?.Glat || !value?.Glon) {
      newErrors.GBirthPlace = "Please select a valid Birth Place from the list.";
    }
    if (!value?.GName) {
      newErrors.GName = 'Required';
    }
    setErrors(newErrors);
    if (Object?.keys(newErrors)?.length == 0) {
      if (UserLoginId) {
        insertBothKundli();
      }
      else {
        setIsAuthModalOpen(true);
        setAuthMode('login');
      }
    }
  };
  const closeModal = () => {
    setIsPopupOpen(false);
  };
  const handleSearchChange = (e) => setSearchVal(e.target.value);
  const reset = () => {
    setValue({
      ...value,
      'BName': '', 'BGenderID': '', 'BDay': '', 'BMonth': '', 'BYear': '', 'BHour': '', 'BMinute': '', 'BSecond': '', 'BBirthPlace': '', 'GName': '', 'GGenderID': '', 'GDay': '', 'GMonth': '', 'GYear': '', 'GHour': '', 'GMinute': '', 'GSecond': '', 'GBirthPlace': '', 'CreatedByUser': '', 'coordinates': '', 'Blon': '', 'Blat': '', 'Glon': '', 'Glat': '', 'datetime': '', 'BDOB': '', 'GDOB': ''
    });
  };
  const BselectedMonth = MONTHS.find((month) => month?.name === Bselectedmonth);
  const GselectedMonth = MONTHS.find((month) => month?.name === Gselectedmonth);
  const insertBothKundli = async () => {
    try {
      const { BName, BBirthPlace, GName, GBirthPlace, Blon, Blat, Glon, Glat } = value;
      const maleVal = {
        UserId: UserLoginId,
        Name: BName,
        Gender: "male",
        Day: BselectedDay,
        Month: BselectedMonth?.number ? BselectedMonth?.number : "1",
        Year: BstartDate.getFullYear(),
        Hours: BselectedHour,
        Minute: BselectedMinute,
        Second: BselectedSecond,
        PlaceOfBirth: BBirthPlace,
        Latitude: Blat,
        Longitude: Blon,
        CreatedDate: "",
        Type: "kundali_Matching",
      };
      const femaleVal = {
        UserId: UserLoginId,
        Name: GName,
        Gender: "female",
        Day: GselectedDay,
        Month: GselectedMonth?.number ? GselectedMonth?.number : "1",
        Year: GstartDate.getFullYear(),
        Hours: GselectedHour,
        Minute: GselectedMinute,
        Second: GselectedSecond,
        PlaceOfBirth: GBirthPlace,
        Latitude: Glat,
        Longitude: Glon,
        CreatedDate: "",
        Type: "kundali_Matching",
      };
      const [maleRes, femaleRes] = await Promise.all([
        TokenWithDeleteUpadateAdd("KundaliDetails/Insert_KundaliDetails", maleVal),
        TokenWithDeleteUpadateAdd("KundaliDetails/Insert_KundaliDetails", femaleVal),
      ]);
      if (maleRes?.Message === "Insert Successfully " && femaleRes?.Message === "Insert Successfully ") {
        Get_Data_Kundli_Partners();
        // GetData_ActivityLog("Kundli Matching", `Filling Male & Female Details for Kundli Matching`);
        router.push(`/kundali-matching/matching-details`);
        if (typeof window !== 'undefined') {
          localStorage.setItem("Bid", maleRes?.Id);
          localStorage.setItem("Gid", femaleRes?.Id);
        }
      }
      else {
        console.log("One of the insert failed:", maleRes, femaleRes);
      }
    }
    catch (error) {
      console.log(error, "error");
    }
  };
  const Get_Data_Kundli_Partners = useCallback(async () => {
    const val = {
      UserId: UserLoginId,
      Type: "kundali_Matching"
    };
    try {
      const res = await TokenWithDeleteUpadateAdd('KundaliDetails/GetData_KundaliDetails', val);
      const parsed = JSON.parse(res.data);
      const raw = parsed?.Table;
      if (raw) {
        setKundliData(raw);
      }
      else {
        setKundliData([]);
      }
    }
    catch (error) {
      console.log(error, 'error');
    }
  }, [UserLoginId]);

  useEffect(() => {
    if (UserLoginId) {
      Get_Data_Kundli_Partners();
    }
  }, [UserLoginId, Get_Data_Kundli_Partners]);

  useEffect(() => {
    queueMicrotask(() => {
      if (EditvalMale?.Gender === "male") {
        setValue((prev) => ({
          ...prev,
          'BName': EditvalMale?.Name, 'BDay': EditvalMale?.Day, 'BMonth': EditvalMale?.Month, 'BYear': EditvalMale?.Year, 'BHour': EditvalMale?.Hours, 'BMinute': EditvalMale?.Minute,
          'BSecond': EditvalMale?.Second, 'BBirthPlace': EditvalMale?.PlaceOfBirth, 'Blon': EditvalMale?.Longitude, 'Blat': EditvalMale?.Latitude,
        }));
        setBSelectedDay(EditvalMale?.Day || '1');
        const selectedMonthB = MONTHS.find((month) => month.number === EditvalMale?.Month);
        setBSelectedmonth(selectedMonthB?.name ? selectedMonthB?.name : 'January');
        setBStartDate(new Date(EditvalMale?.Year || new Date().getFullYear(), EditvalMale?.Month - 1 || 0, EditvalMale?.Day || 1));
        setBSelectedHour(EditvalMale?.Hours || '0');
        setBSelectedMinute(EditvalMale?.Minute || '0');
        setBSelectedSecond(EditvalMale?.Second || '0');
      }
      else if (EditvalMale?.Gender === "female") {
        setValue((prev) => ({
          ...prev,
          'GName': EditvalMale?.Name, 'GDay': EditvalMale?.Day, 'GMonth': EditvalMale?.Month, 'GYear': EditvalMale?.Year, 'GHour': EditvalMale?.Hour, 'GMinute': EditvalMale?.Minute, 'GSecond': EditvalMale?.Second, 'GBirthPlace': EditvalMale?.PlaceOfBirth, 'Glon': EditvalMale?.Longitude, 'Glat': EditvalMale?.Latitude,
        }));
        setGSelectedDay(EditvalMale?.Day || '1');
        const selectedMonthG = MONTHS.find((month) => month.number === EditvalMale?.Month);
        setGSelectedmonth(selectedMonthG?.name ? selectedMonthG?.name : 'January');
        setGStartDate(new Date(EditvalMale?.Year || new Date().getFullYear(), EditvalMale?.Month - 1 || 0, EditvalMale?.Day || 1));
        setGSelectedHour(EditvalMale?.Hours || '0');
        setGSelectedMinute(EditvalMale?.Minute || '0');
        setGSelectedSecond(EditvalMale?.Second || '0');
      }
      else {
        setValue((prev) => ({
          ...prev,
          'BName': '', 'BGenderID': '', 'BDay': '', 'BMonth': '', 'BYear': '', 'BHour': '', 'BMinute': '', 'BSecond': '', 'BBirthPlace': '', 'GName': '', 'GGenderID': '', 'GDay': '', 'GMonth': '', 'GYear': '', 'GHour': '', 'GMinute': '', 'GSecond': '', 'GBirthPlace': '', 'CreatedByUser': '', 'coordinates': '', 'Blon': '', 'Blat': '', 'Glon': '', 'Glat': '', 'datetime': '', 'BDOB': '', 'GDOB': ''
        }));
      }
    });
  }, [EditvalMale]);
  const filteredData = useMemo(() => {
    if (!Array.isArray(KundliData) || typeof searchVal !== "string")
      return [];
    const needle = searchVal.toLowerCase();
    return KundliData.filter((item) => item?.Name && typeof item?.Name === "string" && item?.Name.toLowerCase().includes(needle));
  }, [KundliData, searchVal]);
  const Delete_KundliPartners_Data = () => {
    const val = { 'id': KundliDeleteId, };
    TokenWithDeleteUpadateAdd('KundaliDetails/Delete_KundliDetails', val).then((res) => {
      if (res) {
        setIsPopupOpen(false);
        Get_Data_Kundli_Partners();
        reset();
      }
    });
  };
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsG, setSuggestionsG] = useState([]);
  const [showSuggestionsG, setShowSuggestionsG] = useState(false);
  const Get_Data_Location_G = useCallback(async (place, isInitial = false) => {
    const query = place?.trim();
    if (!query || query.length < 3)
      return;
    const requestId = ++requestCounterRef.current.G;
    const cachedResponse = locationCacheRef.current.get(`G:${query.toLowerCase()}`);
    if (cachedResponse) {
      if (requestId !== requestCounterRef.current.G)
        return;
      if (isInitial) {
        const match = cachedResponse?.find((item) => item.display_name === query);
        if (match) {
          setValue((prev) => ({
            ...prev,
            GBirthPlace: match.display_name,
            Glat: match.lat,
            Glon: match.lon,
          }));
          setShowSuggestionsG(false);
        }
      }
      else {
        setSuggestionsG(cachedResponse);
        setShowSuggestionsG(true);
      }
      return;
    }
    try {
      const val = { address: query };
      const response = await postWithToken("Location/GetLocation", val);
      if (response?.length > 0) {
        locationCacheRef.current.set(`G:${query.toLowerCase()}`, response);
        if (requestId !== requestCounterRef.current.G)
          return;
        if (isInitial) {
          const match = response?.find((item) => item.display_name === query);
          if (match) {
            setValue((prev) => ({
              ...prev,
              GBirthPlace: match.display_name,
              Glat: match.lat,
              Glon: match.lon,
            }));
            setShowSuggestionsG(false);
          }
        }
        else {
          setSuggestionsG(response);
          setShowSuggestionsG(true);
        }
      }
    }
    catch (error) {
      console.error("Error fetching location:", error);
    }
  }, []);
  const Get_Data_Location_B = useCallback(async (place, isInitial = false) => {
    const query = place?.trim();
    if (!query || query.length < 3)
      return;
    const requestId = ++requestCounterRef.current.B;
    const cachedResponse = locationCacheRef.current.get(`B:${query.toLowerCase()}`);
    if (cachedResponse) {
      if (requestId !== requestCounterRef.current.B)
        return;
      if (isInitial) {
        const match = cachedResponse?.find((item) => item.display_name === query);
        if (match) {
          setValue((prev) => ({
            ...prev,
            BBirthPlace: match.display_name,
            Blat: match.lat,
            Blon: match.lon,
          }));
          setShowSuggestions(false);
        }
      }
      else {
        setSuggestions(cachedResponse);
        setShowSuggestions(true);
      }
      return;
    }
    try {
      const val = { address: query };
      const response = await postWithToken("Location/GetLocation", val);
      if (response?.length > 0) {
        locationCacheRef.current.set(`B:${query.toLowerCase()}`, response);
        if (requestId !== requestCounterRef.current.B)
          return;
        if (isInitial) {
          const match = response?.find((item) => item.display_name === query);
          if (match) {
            setValue((prev) => ({
              ...prev,
              BBirthPlace: match.display_name,
              Blat: match.lat,
              Blon: match.lon,
            }));
            setShowSuggestions(false);
          }
        }
        else {
          setSuggestions(response);
          setShowSuggestions(true);
        }
      }
    }
    catch (error) {
      console.error("Error fetching location:", error);
    }
  }, []);
  const scheduleLocationLookup = useCallback((type, nextValue) => {
    const key = type === "B" ? "B" : "G";
    if (debounceTimersRef.current[key]) {
      clearTimeout(debounceTimersRef.current[key]);
    }
    debounceTimersRef.current[key] = setTimeout(() => {
      if (key === "B") {
        Get_Data_Location_B(nextValue, false);
      }
      else {
        Get_Data_Location_G(nextValue, false);
      }
    }, 300);
  }, [Get_Data_Location_B, Get_Data_Location_G]);
  useEffect(() => () => {
    if (debounceTimersRef.current.B) clearTimeout(debounceTimersRef.current.B);
    if (debounceTimersRef.current.G) clearTimeout(debounceTimersRef.current.G);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderPersonForm = (type) => {
    const isBoy = type === "B";
    const prefix = isBoy ? "B" : "G";
    const label = isBoy ? "Person 1 (You)" : "Person 2 (Partner)";
    const selectedDay = isBoy ? BselectedDay : GselectedDay;
    const selectedMonth = isBoy ? Bselectedmonth : Gselectedmonth;
    const startDate = isBoy ? BstartDate : GstartDate;
    const selectedHour = isBoy ? BselectedHour : GselectedHour;
    const selectedMinute = isBoy ? BselectedMinute : GselectedMinute;
    const selectedSecond = isBoy ? BselectedSecond : GselectedSecond;
    const unknownTime = isBoy ? bUnknownTime : gUnknownTime;
    const setUnknownTime = isBoy ? setBUnknownTime : setGUnknownTime;
    const nameKey = `${prefix}Name`;
    const placeKey = `${prefix}BirthPlace`;
    const suggestionsList = isBoy ? suggestions : suggestionsG;
    const showSug = isBoy ? showSuggestions : showSuggestionsG;
    const setSug = isBoy ? setSuggestions : setSuggestionsG;
    const setShowSug = isBoy ? setShowSuggestions : setShowSuggestionsG;
    const latKey = isBoy ? "Blat" : "Glat";
    const lonKey = isBoy ? "Blon" : "Glon";

    return (
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-[#FFFBF7] shadow-sm">
        <div
          className="flex items-center gap-3 border-b border-orange-50 px-4 py-3.5"
          style={{ background: isBoy ? `linear-gradient(135deg, ${CREAM} 0%, ${PEACH} 100%)` : `linear-gradient(135deg, #FFF5F7 0%, ${CREAM_ALT} 100%)` }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ background: isBoy ? `linear-gradient(135deg, ${ORANGE}, #FF7A33)` : "linear-gradient(135deg, #EC4899, #F472B6)" }}
          >
            {isBoy ? <FaMars size={14} /> : <FaVenus size={14} />}
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-[#1A1A1A]">{isBoy ? "Groom / Boy" : "Bride / Girl"}</p>
            <p className="font-body text-[11px] text-gray-500">{label}</p>
          </div>
        </div>
        <div className="space-y-4 p-4 sm:p-5">
          <div>
            <label className={labelCls}><FaUser className="mr-1 inline text-[#FF5C00]" /> Full Name <span className="text-red-500">*</span></label>
            <input type="text" id={nameKey} name={nameKey} autoComplete="off" placeholder="Enter full name" value={value?.[nameKey]} onChange={handleChange} className={inputCls} />
            {errors[nameKey] && <p className="mt-1 text-xs text-red-500">{errors[nameKey]}</p>}
          </div>
          <div>
            <label className={labelCls}><FaCalendarAlt className="mr-1 inline text-[#FF5C00]" /> Date of Birth <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <select className={selectCls} value={selectedDay} onChange={isBoy ? handleChangeDayB : handleChangeDayG}>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className={selectCls} value={selectedMonth} onChange={isBoy ? handleChangemonthB : handleChangemonthG}>
                {MONTHS.map((m, i) => <option key={i} value={m.name}>{m.name.substring(0, 3)}</option>)}
              </select>
              <DatePicker className={inputCls} selected={startDate} onChange={(date) => isBoy ? setBStartDate(date) : setGStartDate(date)} showYearPicker dateFormat="yyyy" yearItemNumber={9} />
            </div>
          </div>
          <div>
            <label className={labelCls}><FaClock className="mr-1 inline text-[#FF5C00]" /> Time of Birth <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <select className={selectCls} value={selectedHour} onChange={isBoy ? handleHourChangeB : handleHourChangeG} disabled={unknownTime}>
                {[...Array(24).keys()].map((h) => <option key={h} value={h}>{String(h).padStart(2, "0")}</option>)}
              </select>
              <select className={selectCls} value={selectedMinute} onChange={isBoy ? handleChangeMinuteB : handleChangeMinuteG} disabled={unknownTime}>
                {minutes.map((m) => <option key={m} value={m}>{String(m).padStart(2, "0")}</option>)}
              </select>
              <select className={selectCls} value={selectedSecond} onChange={isBoy ? handleChangeSecondB : handleChangeSecondG} disabled={unknownTime}>
                {seconds.map((s) => <option key={s} value={s}>{String(s).padStart(2, "0")}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}><FaMapMarkerAlt className="mr-1 inline text-[#FF5C00]" /> Place of Birth <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                name={placeKey}
                autoComplete="off"
                placeholder="Type city — e.g. Delhi, Mumbai"
                value={value[placeKey]}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue((prev) => ({ ...prev, [placeKey]: val, [latKey]: "", [lonKey]: "" }));
                  if (val.length >= 3) scheduleLocationLookup(prefix, val);
                  else { setSug([]); setShowSug(false); }
                }}
                className={inputCls}
              />
              {errors?.[placeKey] && <p className="mt-1 text-xs text-red-500">{errors[placeKey]}</p>}
              {showSug && suggestionsList?.length > 0 && (
                <ul className="absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-orange-100 bg-white py-1 shadow-xl">
                  {suggestionsList.map((item, index) => (
                    <li key={index} onClick={() => {
                      setValue((prev) => ({ ...prev, [placeKey]: item.display_name, [latKey]: item.lat, [lonKey]: item.lon }));
                      setSug([]); setShowSug(false);
                    }} className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm hover:bg-orange-50">
                      <FaMapMarkerAlt className="shrink-0 text-xs text-[#FF5C00]" />
                      <span className="truncate">{item.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <label className="font-body flex cursor-pointer items-center gap-2 rounded-xl border border-orange-100 bg-[#FFF9F1] px-3 py-2 text-xs text-gray-600">
            <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} className="rounded border-gray-300 text-[#FF5C00]" />
            I don&apos;t know exact time of birth
          </label>
        </div>
      </div>
    );
  };

  return (<>
    <div className="min-h-screen bg-white pt-[72px]" style={{ backgroundColor: CREAM }}>
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.KundliMatching}
        currentPage="Kundli Matching"
        crumbs={[{ label: "Free Kundli", href: "/freekundli" }]}
        title={
          <>
            Kundli Matching for <span style={{ color: ORANGE }}>Marriage</span>
          </>
        }
        subtitle="Match kundlis using Vedic Ashtakoot Guna Milan. Discover harmony, love, and a prosperous married life together."
        bottomSlot={<StepProgressBar steps={STEPS} active={0} />}
      >
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {HERO_FEATURES.map(({ icon: Icon, t }) => (
            <span key={t} className="font-body flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Icon size={13} className="text-[#FF5C00]" /> {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-row gap-1.5 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/chat-to-astrologers")}
            className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#FF5C00] px-1.5 text-[11px] font-semibold text-white shadow-[0_3px_12px_rgba(255,92,0,0.22)] transition hover:bg-[#E85500] min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <IoMdChatboxes className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
            Chat Now
          </button>

          <button
            type="button"
            onClick={() => router.push("/talk-to-astrologers")}
            className="font-heading flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border-2 border-[#FF5C00] bg-white/95 px-1.5 text-[11px] font-semibold text-[#FF5C00] backdrop-blur-sm transition hover:bg-orange-50 min-[380px]:gap-1.5 min-[380px]:px-2 min-[380px]:text-xs sm:w-full sm:flex-none sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <MdPhoneInTalk className="shrink-0 text-base min-[380px]:text-lg sm:text-lg" />
            Call Now
          </button>
        </div>
      </PageBanner>

      <div className="main-container px-4 py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_30px_rgba(255,92,0,0.08)]">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ORANGE}, #FFB380)` }} />
              <div className="border-b border-orange-50 px-5 py-4 sm:px-6" style={{ backgroundColor: CREAM_ALT }}>
                <h2 className="font-heading text-base font-bold text-[#1A1A1A] sm:text-lg">Enter Details to Match Kundlis</h2>
                <p className="font-body mt-0.5 text-xs text-gray-500">Fill birth details for both partners · Takes ~2 minutes</p>
              </div>
              <form className="p-5 sm:p-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  {renderPersonForm("B")}
                  {renderPersonForm("G")}
                </div>
                <div
                  className="mt-6 rounded-2xl border border-orange-100 p-4 sm:p-5"
                  style={{ background: `linear-gradient(135deg, ${CREAM} 0%, ${PEACH} 100%)` }}
                >
                  <button
                    type="button"
                    onClick={checkValidationErrors}
                    className="font-heading mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200/40 transition hover:brightness-105 sm:w-auto sm:min-w-[280px]"
                    style={{ background: `linear-gradient(135deg, ${ORANGE} 0%, #FF7A33 100%)` }}
                  >
                    <FaMagic size={14} /> Match Kundlis — Free
                  </button>
                  <p className="font-body mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <FaLock size={10} className="text-[#FF5C00]" /> 100% secure & confidential
                  </p>
                </div>
              </form>
            </div>

            {/* <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
              <div className="border-b border-orange-50 px-5 py-4" style={{ backgroundColor: CREAM_ALT }}>
                <h2 className="font-heading text-base font-bold text-[#1A1A1A] sm:text-lg">Sample Matching Result</h2>
                <p className="font-body mt-0.5 text-xs text-gray-500">Preview of what your compatibility report looks like</p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[140px_1fr_180px]">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-[#FF5C00] bg-orange-50 shadow-inner">
                      <div className="text-center">
                        <p className="font-heading text-2xl font-extrabold text-[#FF5C00]">32<span className="text-sm text-gray-400">/36</span></p>
                        <p className="text-[10px] font-bold text-[#FF5C00]">Excellent Match</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-heading mb-1 text-sm font-bold text-[#1A1A1A]">Overall Compatibility</p>
                    <p className="font-body mb-4 text-xs text-gray-500">Based on Ashtakoot Guna Milan — higher score means stronger marital compatibility.</p>
                    <div className="space-y-2.5">
                      {SAMPLE_COMPAT.map(({ label, val }) => (
                        <div key={label}>
                          <div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-gray-600">{label}</span><span className="font-bold text-[#FF5C00]">{val}%</span></div>
                          <div className="h-2 overflow-hidden rounded-full bg-orange-100"><div className="h-full rounded-full" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${ORANGE}, #FF7A33)` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-orange-100 p-4 text-center" style={{ backgroundColor: CREAM_ALT }}>
                    <p className="text-xs font-bold text-gray-500">Verdict</p>
                    <span className="mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: ORANGE }}>Excellent Match</span>
                    <p className="font-body mt-2 text-xs leading-relaxed text-gray-600">Highly favorable for marriage.</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-orange-100 px-4 py-3 sm:flex-row" style={{ background: `linear-gradient(135deg, ${CREAM} 0%, ${PEACH} 100%)` }}>
                  <p className="font-body text-xs font-semibold text-gray-700">Get detailed report with personalized remedies</p>
                  <button type="button" onClick={checkValidationErrors} className="font-heading shrink-0 rounded-xl border-2 px-5 py-2 text-xs font-bold transition hover:bg-white" style={{ borderColor: ORANGE, color: ORANGE }}>
                    View Full Report
                  </button>
                </div>
              </div>
            </div> */}

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
              <div className="border-b border-orange-50 px-4 py-3" style={{ backgroundColor: CREAM_ALT }}>
                <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">Saved Profiles</h3>
              </div>
              <div className="p-4">
                {UserLoginId ? (
                  <>
                    <div className="mb-3 flex items-center rounded-xl border border-orange-100 bg-[#FFF9F1] px-3 py-2">
                      <FaSearch className="mr-2 shrink-0 text-[#FF5C00]" size={12} />
                      <input type="text" placeholder="Search saved profile..." value={searchVal} onChange={handleSearchChange} className="font-body w-full bg-transparent text-xs outline-none placeholder:text-gray-400" />
                    </div>
                    <div className="max-h-52 space-y-2 overflow-y-auto">
                      {filteredData?.length > 0 ? filteredData.map((item) => (
                        <div key={item?.Id} className="flex items-center justify-between rounded-xl border border-orange-50 p-2 transition hover:border-orange-200 hover:bg-orange-50/30">
                          <button type="button" onClick={() => setEditvalMale(item)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF7A33)` }}>
                              {item?.Name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-[#1A1A1A]">{item?.Name}</p>
                              <p className="truncate text-[10px] text-gray-400">{item?.PlaceOfBirth}</p>
                            </div>
                          </button>
                          <button type="button" onClick={() => { setKundliDeleteId(item?.Id); setIsPopupOpen(true); }} className="shrink-0 rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                            <MdDeleteOutline size={16} />
                          </button>
                        </div>
                      )) : <p className="py-4 text-center text-xs text-gray-400">No saved profiles yet</p>}
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <p className="font-body mb-3 text-xs text-gray-500">Login to view saved profiles</p>
                    <button type="button" onClick={() => { setIsAuthModalOpen(true); setAuthMode("login"); }} className="font-heading rounded-xl px-5 py-2 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>Login</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ORANGE}, #FFB380)` }} />
              <div className="p-4 sm:p-5">
                <h3 className="font-heading mb-3 text-sm font-bold text-[#1A1A1A]">Why Match Kundli?</h3>
                <ul className="space-y-2.5">
                  {WHY_ITEMS.map((item) => (
                    <li key={item} className="font-body flex items-start gap-2 text-xs text-gray-600 sm:text-sm">
                      <FaHeart className="mt-0.5 shrink-0 text-[#FF5C00]" size={11} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
              <div className="border-b border-orange-50 px-4 py-3" style={{ backgroundColor: CREAM_ALT }}>
                <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">Ashtakoota Milan</h3>
              </div>
              <ul className="space-y-2 p-4">
                {ASHTAKOOTA.map(({ name, score }) => (
                  <li key={name} className="flex items-center justify-between rounded-lg bg-[#FFF9F1] px-3 py-2 text-xs">
                    <span className="font-semibold text-gray-600">{name}</span>
                    <span className="font-bold text-[#FF5C00]">{score}</span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-orange-50 py-3 text-center text-sm font-extrabold text-[#FF5C00]">Total 36 / 36 Gunas</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <h3 className="font-heading mb-2 text-sm font-bold text-[#1A1A1A]">Need Expert Guidance?</h3>
                <p className="font-body mb-3 text-xs text-gray-500">Discuss compatibility with experienced astrologers.</p>
                <div className="mb-3 flex -space-x-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-orange-100 ring-1 ring-orange-100">
                      <Image src="/images/ChatBanner.png" alt="" fill className="object-cover" sizes="36px" />
                    </div>
                  ))}
                </div>
                <p className="mb-3 flex items-center gap-1 text-xs font-bold text-gray-700"><FaStar className="text-[#FF5C00]" size={12} /> 4.8 (12K+ Reviews)</p>
                <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="font-heading flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105" style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF7A33)` }}>
                  <FaCommentDots size={13} /> Chat with Astrologer
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      <section className="border-t border-orange-100 py-8" style={{ backgroundColor: CREAM_ALT }}>
        <div className="main-container grid grid-cols-2 gap-4 px-4 md:grid-cols-4 md:gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Icon size={16} className="text-[#FF5C00]" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-[#1A1A1A]">{title}</p>
                <p className="font-body text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-orange-100 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
        <div className="main-container flex items-center justify-center gap-1 sm:gap-3">
          {[
            { icon: FaCommentDots, label: "Chat", href: "/chat-to-astrologers" },
            { icon: FaPhone, label: "Call", href: "/talk-to-astrologers" },
            { icon: FaVideo, label: "Video", href: "/talk-to-astrologers" },
            { icon: FaOm, label: "Puja", href: "/online-puja" },
          ].map(({ icon: Icon, label, href }) => (
            <button key={label} type="button" onClick={() => router.push(href)} className="font-body flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition hover:bg-orange-50 sm:max-w-[140px] sm:flex-row sm:gap-2 sm:px-4 sm:py-2">
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

      <CustomModal isOpen={isPopUPOpen} onClose={closeModal} title="Delete Profile">
        <div className="text-center">
          <p className="font-body mb-5 text-sm text-gray-600">Are you sure you want to delete this saved profile?</p>
          <div className="flex justify-center gap-3">
            <button type="button" onClick={closeModal} className="font-body rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={Delete_KundliPartners_Data} className="font-heading rounded-xl px-5 py-2 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>Delete</button>
          </div>
        </div>
      </CustomModal>
    </div>

    {isAuthModalOpen && (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    )}
  </>);
};
export default KundaliMatchingClient;
