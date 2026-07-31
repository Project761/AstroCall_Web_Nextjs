"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaChevronRight, FaSearch, FaStar, FaShieldAlt, FaBolt, FaCommentDots,
  FaBookOpen, FaChartLine, FaUserAstronaut,
} from "react-icons/fa";
import { MdDeleteOutline, MdPhoneInTalk } from "react-icons/md";
import Image from "next/image";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TokenWithDeleteUpadateAdd, postWithToken } from "@/app/utils/api";
import AuthModal from "../components/AuthModal";
import { IoMdChatboxes } from "react-icons/io";
// Custom Modal Component
 

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";

const inputCls = "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100";
const selectCls = `${inputCls} appearance-none bg-white cursor-pointer`;

const WHY_ITEMS = [
  { icon: FaBookOpen, title: "Vedic Birth Chart", sub: "Accurate Janam Kundli as per scriptures" },
  { icon: FaChartLine, title: "Planetary Positions", sub: "Detailed graha & house analysis" },
  { icon: FaShieldAlt, title: "100% Free", sub: "No hidden charges, instant results" },
  { icon: FaUserAstronaut, title: "Expert Guidance", sub: "Consult astrologers for deeper insights" },
];

const HOW_STEPS = [
  { icon: FaSearch, title: "Enter Details", sub: "Name, DOB, time & birth place" },
  { icon: FaBolt, title: "Generate Kundli", sub: "Instant Vedic chart creation" },
  { icon: FaStar, title: "View Report", sub: "Charts, dasha & dosha analysis" },
  { icon: FaCommentDots, title: "Get Guidance", sub: "Chat with expert astrologers" },
];

const TRUST_BOTTOM = [
  { icon: FaShieldAlt, title: "Secure & Private", sub: "Your data stays protected" },
  { icon: FaBolt, title: "Instant Results", sub: "Kundli in seconds" },
  { icon: FaStar, title: "Vedic Accuracy", sub: "Traditional calculations" },
  { icon: FaUserAstronaut, title: "Expert Astrologers", sub: "Available 24/7" },
];

const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h5 className="text-xl font-bold text-[#0F172A]">{title}</h5>
          <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-[#FF5C00]">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};


const FreeKundliClient = () => {
  const router = useRouter();
  const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || "" : "";
  const [activeTab, setActiveTab] = useState("New Kundli");
  const [Genderstatus, setGenderstatus] = useState("Male");
  const [startDate, setStartDate] = useState(new Date());
  const [Locationdata, setLocationdata] = useState("");
  const [KundliData, setKundliData] = useState();
  const [searchVal, setSearchVal] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedMinute, setSelectedMinute] = useState("0");
  const [selectedSecond, setSelectedSecond] = useState("0");
  const [selectedDay, setSelectedDay] = useState("1");
  const [selectedmonth, setSelectedmonth] = useState("1");
  const [selectedHour, setSelectedHour] = useState("0");
  const [length, setLength] = useState(null);
  const [KundliDeleteId, setKundliDeleteId] = useState();
  const [isPopUPOpen, setIsPopupOpen] = useState(false);


  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');


  const [value, setValue] = useState({
    UserID: "", Name: "", BDay: "", BMonth: "", BYear: "", BHour: "", BMinute: "", BSecond: "", BirthPlace: "", CreatedByUser: "", coordinates: "", la: "", datetime: "", lon: "", lat: "",
  });
  const Days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
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
  useEffect(() => {
    if (UserLoginId) {
      // GetData_ActivityLog("FreeKundli Detail", `looking at FreeKundli Detail`);
    }
  }, [UserLoginId]);
  const selectedMonth = months?.find((month) => month?.name === selectedmonth);
  const onChangeRadioGender = (elements) => {
    setGenderstatus(elements?.target.value);
  };
  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const reset = () => {
    setValue({
      ...value,
      UserID: "",
      Name: "",
      BDay: "",
      BMonth: "",
      BYear: "",
      BHour: "",
      BMinute: "",
      BSecond: "",
      BirthPlace: "",
      CreatedByUser: "",
    });
  };
  const handleHourChange = (selectedOption) => {
    setSelectedHour(selectedOption ? selectedOption.value : '');
  };
  const handleChangeMinute = (selectedOption) => {
    setSelectedMinute(selectedOption ? selectedOption.value : '');
  };
  const handleChangeSecond = (selectedOption) => {
    setSelectedSecond(selectedOption ? selectedOption.value : '');
  };
  const handleChangeDay = (selectedOption) => {
    setSelectedDay(selectedOption ? selectedOption.value : '');
  };
  const handleChangemonth = (selectedOption) => {
    setSelectedmonth(selectedOption ? selectedOption.value : '');
  };
  const Get_Data_Kundli = useCallback(async () => {
    const val = {
      UserId: UserLoginId,
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliDetails/GetData_KundaliDetails", val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Data = parseData?.Table;
      if (res) {
        setKundliData(Data);
      }
    }
    catch (error) {
      console.log(error, "error");
    }
  }, [UserLoginId]);

  const Insert_Free_Fundli = async () => {
    const { Name, BirthPlace, lat, lon } = value;
    const val = {
      UserId: UserLoginId,
      Name: Name,
      Gender: Genderstatus,
      Day: selectedDay,
      Month: selectedMonth?.number ? selectedMonth?.number : "1",
      Year: startDate.getFullYear(),
      Hours: selectedHour,
      Minute: selectedMinute,
      Second: selectedSecond,
      PlaceOfBirth: BirthPlace,
      Latitude: lat,
      lon: lon,
      CreatedDate: "",
    };
    const res = await TokenWithDeleteUpadateAdd("KundaliDetails/Insert_KundaliDetails", val);
    if (res?.Message === "Insert Successfully ") {
      Get_Data_Kundli();
      reset();
      router.push(`/freekundli/basic-detail`);
      if (typeof window !== 'undefined') {
        localStorage.setItem("BasicDetailID", res?.Id);
      }
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("BasicDetailID");
    }
  }, []);
  const isFetchingRef = useRef(false);
  useEffect(() => {
    if (UserLoginId && !isFetchingRef.current) {
      isFetchingRef.current = true;
      Get_Data_Kundli().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [UserLoginId, Get_Data_Kundli]);
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue({ ...value, [e.target.name]: inputValue });
    if (typeof inputValue === "string") {
      setLength(inputValue.length);
      if (inputValue?.length === 0) {
        setLocationdata([]);
      }
    }
    else {
      setLength(null);
    }
  };
  const checkValidationErrors = () => {
    const newErrors = {};
    if (!value?.Name) {
      newErrors.Name = "required *";
    }
    if (!value?.BirthPlace) {
      newErrors.BirthPlace = "Required *";
    }
    else if (value?.BirthPlace?.length <= 3) {
      newErrors.BirthPlace = "Must be more than 3 characters";
    }
    else if (!value?.lat || !value?.lon) {
      newErrors.BirthPlace = "Please select a valid Birth Place from the list.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      if (UserLoginId) {
        Insert_Free_Fundli();
      }
      else {
        setIsAuthModalOpen(true);
        setAuthMode('login');
      }
    }
  };
  const Delete_Kundli_Data = () => {
    const val = { Id: KundliDeleteId };
    TokenWithDeleteUpadateAdd("KundaliDetails/Delete_KundaliDetails", val).then((res) => {
      if (res) {
        setIsPopupOpen(false);
        Get_Data_Kundli();
      }
    });
  };
  const filteredData = KundliData?.filter((item) => item?.Name &&
    typeof item?.Name === "string" &&
    item?.Name?.toLowerCase()?.includes(searchVal.toLowerCase()));
  const closeModal = () => {
    setIsPopupOpen(false);
  };
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fetchLocationData = async (place, isInitial = false) => {
    try {
      const val = { address: place };
      const response = await postWithToken("Location/GetLocation", val);
      if (response?.length > 0) {
        if (isInitial) {
          const match = response?.find((item) => item.display_name === place);
          if (match) {
            setValue((prev) => ({
              ...prev,
              BirthPlace: match.display_name,
              lat: match.lat,
              lon: match.lon,
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
  };
  const GendersType = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const DaysType = Days.map((Day) => ({ value: Day, label: Day }));
  const monthType = months.map((month) => ({ value: month.name, label: month.name.substring(0, 3) }));
  const HoursType = [...Array(24).keys()].map((hour) => ({ value: hour, label: hour }));
  const MinutesType = [...Array(60).keys()].map((minute) => ({ value: minute, label: minute }));
  const SecondsType = [...Array(60).keys()].map((second) => ({ value: second, label: second }));
  const tabCls = (tab) =>
    `px-5 py-3 text-sm font-bold whitespace-nowrap transition ${activeTab === tab ? "border-b-2 border-[#FF5C00] text-[#FF5C00]" : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"}`;

  return (<>
    <div className="min-h-screen bg-white pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.Kundli}
        currentPage="Free Kundli"
        title={
          <>
            Free <span className="text-[#FF5C00]">Kundli</span> Online
            <span className="mt-2 block text-lg font-bold text-[#FF5C00] sm:text-xl">
              Generate Your Janam Kundli Instantly
            </span>
          </>
        }
        subtitle="Enter your birth details to get an accurate Vedic birth chart with planetary positions, houses, and life predictions — 100% free."
      >
        <div className="mt-4 flex flex-wrap gap-4">
          {[{ icon: FaBolt, t: "Instant Generation" }, { icon: FaShieldAlt, t: "100% Accurate Vedic Chart" }, { icon: FaStar, t: "Detailed Predictions" }].map(({ icon: Icon, t }) => (
            <span key={t} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
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

      <div className="main-container px-4 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Tabs */}
          <div className="mb-6 flex border-b border-gray-100">
            <button type="button" onClick={() => setActiveTab("New Kundli")} className={tabCls("New Kundli")}>New Kundli</button>
            <button type="button" onClick={() => setActiveTab("Saved Kundli")} className={tabCls("Saved Kundli")}>Saved Kundli</button>
          </div>

          {/* New Kundli Tab Content */}
          {activeTab === "New Kundli" && (<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                  Name*
                </label>

                <input id="Name" name="Name" autoComplete="off" value={value?.Name} onChange={handleChange} placeholder="Enter name" className={inputCls} />

                {errors?.Name && (<p className="text-red-500 text-xs sm:text-sm mt-1">{errors?.Name}</p>)}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                  Gender*
                </label>
                <select name="Gender" value={Genderstatus} onChange={(e) => setGenderstatus(e.target.value)} className={selectCls}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors?.Gender && (<p className="text-red-500 text-xs sm:text-sm mt-1">{errors?.Gender}</p>)}
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">Birth Details*</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4">
                  {/* Day */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                      Day*
                    </label>
                    <select className={selectCls} value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                      {Days.map((Day) => (<option key={Day} value={Day}>
                        {Day}
                      </option>))}
                    </select>
                  </div>

                  {/* Month */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                      Month*
                    </label>
                    <select className={selectCls} value={selectedmonth} onChange={(e) => setSelectedmonth(e.target.value)}>
                      {months?.map((month, index) => (<option key={index} value={month?.name}>
                        {month?.name.substring(0, 3)}
                      </option>))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                      Year*
                    </label>
                    <DatePicker className={inputCls} selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" placeholderText="Year" />
                  </div>

                  {/* Hour */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                      Hour*
                    </label>
                    <select className={selectCls} value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
                      {[...Array(24).keys()].map((hour) => (<option key={hour} value={hour}>
                        {hour}
                      </option>))}
                    </select>
                  </div>

                  {/* Minute */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                      Minute*
                    </label>
                    <select className={selectCls} value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)}>
                      {[...Array(60).keys()].map((minute) => (<option key={minute} value={minute}>
                        {minute}
                      </option>))}
                    </select>
                  </div>

                  {/* Second */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                      Second*
                    </label>
                    <select className={selectCls} value={selectedSecond} onChange={(e) => setSelectedSecond(e.target.value)}>
                      {[...Array(60).keys()].map((second) => (<option key={second} value={second}>
                        {second}
                      </option>))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                  Birth Place*
                </label>
                <div className="relative">
                  <input type="text" name="BirthPlace" autoComplete="off" placeholder="Enter your birth place" value={value.BirthPlace} onChange={(e) => {
                    const val = e.target.value;
                    setValue((prev) => ({ ...prev, BirthPlace: val, lat: "", lon: "" }));
                    if (val.length >= 3) {
                      fetchLocationData(val, false);
                    }
                    else {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                  }} className={inputCls} />

                  {errors?.BirthPlace && (<p className="text-red-500 text-xs sm:text-sm mt-1">{errors?.BirthPlace}</p>)}

                  {showSuggestions && suggestions?.length > 0 && (<ul className="absolute top-full left-0 w-full max-h-48 sm:max-h-60 overflow-y-auto bg-white shadow-xl rounded-lg sm:rounded-xl mt-2 z-50 border border-gray-200">
                    {suggestions?.map((item, index) => (<li key={index} onClick={() => {
                      setValue((prev) => ({
                        ...prev,
                        BirthPlace: item.display_name,
                        lat: item.lat,
                        lon: item.lon,
                      }));
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }} className="p-2 sm:p-3 hover:bg-gray-200 cursor-pointer text-sm sm:text-base">
                      {item.display_name}
                    </li>))}
                  </ul>)}
                </div>
              </div>

              <div className="flex justify-center pt-4 sm:pt-6">
                <button type="button" className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 sm:w-auto sm:px-12" style={{ backgroundColor: ORANGE }} onClick={checkValidationErrors}>
                  Generate Kundli
                </button>
              </div>
            </div>
          </div>)}

          {/* Saved Kundli Tab Content */}
          {activeTab === "Saved Kundli" && (<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 md:p-8">
            <div>
              {UserLoginId ? (<>
                <div className="mb-5">
                  <div className="flex items-center rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm">
                    <FaSearch className="mr-2 text-gray-400" size={14} />
                    <input type="text" placeholder="Search saved kundli by name..." value={searchVal} onChange={handleSearchChange} className="w-full bg-transparent text-sm text-gray-700 outline-none" />
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-[#0F172A]">Recently Opened</p>
                  <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
                    {filteredData && filteredData?.length > 0 ? (filteredData?.map((item, index) => (<div key={index} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-orange-200 hover:shadow-md">
                      <div onClick={() => {
                        router.push(`/freekundli/basic-detail`);
                        if (typeof window !== 'undefined') {
                          localStorage.setItem("BasicDetailID", item?.Id);
                        }
                      }} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm" style={{ backgroundColor: ORANGE }}>
                          {item?.Name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#0F172A]">
                            {item?.Name},{" "}
                            {item?.Gender?.charAt(0)?.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {`DOB: ${item?.Day}-${item?.Month}-${item?.Year} | Time: ${String(item?.Hours)?.padStart(2, "0")}:${String(item?.Minute)?.padStart(2, "0")}:${String(item?.Second)?.padStart(2, "0")}`}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {item?.PlaceOfBirth}
                          </p>
                        </div>
                      </div>

                      <button type="button" onClick={() => {
                        setKundliDeleteId(item?.Id);
                        setIsPopupOpen(true);
                      }} className="shrink-0 rounded-full p-2 transition hover:bg-red-50">
                        <MdDeleteOutline className="text-lg text-red-500" />
                      </button>
                    </div>))) : (<p className="py-10 text-center text-sm text-gray-400">No saved kundli found</p>)}
                  </div>
                </div>
              </>) : (<div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="mb-4 text-sm font-semibold text-gray-600">Login to view your saved kundlis</p>
                <button type="button" className="rounded-full px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90" style={{ backgroundColor: ORANGE }} onClick={() => {
                  setIsAuthModalOpen(true);
                  setAuthMode('login');
                }}>
                  Login
                </button>
              </div>)}
            </div>
          </div>)}
        </div>

        {/* Why Free Kundli */}
        <section className="mt-12 text-center">
          <h2 className="text-lg font-bold text-[#0F172A]">Why Generate Free Kundli with AstroCall?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ITEMS.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <Icon size={22} className="mx-auto text-[#FF5C00]" />
                <p className="mt-2 text-sm font-bold text-[#0F172A]">{title}</p>
                <p className="mt-1 text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-10 text-center">
          <h2 className="text-lg font-bold text-[#0F172A]">How It Works?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_STEPS.map(({ icon: Icon, title, sub }, i) => (
              <div key={title} className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: ORANGE }}>
                  <Icon size={16} />
                </div>
                <p className="mt-2 text-xs font-bold text-[#0F172A]">{title}</p>
                <p className="mt-1 text-[10px] text-gray-500">{sub}</p>
                {i < HOW_STEPS.length - 1 && <FaChevronRight className="absolute right-0 top-4 hidden text-gray-300 lg:block" size={10} />}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>

    {/* Bottom CTA */}
    <section className="relative overflow-hidden py-10" style={{ backgroundColor: ORANGE }}>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20">
        <Image src="/horoimg/1.png" alt="" fill className="object-contain object-right" sizes="300px" />
      </div>
      <div className="main-container relative flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">Need Personalized Kundli Analysis?</h2>
          <p className="mt-1 text-sm text-white/80">Chat with our expert astrologers for detailed predictions based on your birth chart.</p>
        </div>
        <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#FF5C00] shadow-sm hover:bg-orange-50">
          <FaCommentDots size={14} /> Chat with Astrologer
        </button>
      </div>
    </section>

    {/* Trust footer */}
    <section className="border-t border-orange-50 py-8" style={{ backgroundColor: CREAM }}>
      <div className="main-container grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {TRUST_BOTTOM.map(({ icon: Icon, title, sub }) => (
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

    <CustomModal isOpen={isPopUPOpen} onClose={closeModal} title="Confirm Delete Kundli">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
          <MdDeleteOutline className="text-3xl text-[#FF5C00]" />
        </div>
        <h5 className="mb-2 text-lg font-bold text-[#0F172A]">Delete Kundli?</h5>
        <p className="mb-6 text-sm text-gray-500">This action cannot be undone. Your kundli data will be permanently removed.</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={() => { Delete_Kundli_Data(); }} className="rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: ORANGE }}>
            Delete Kundli
          </button>
        </div>
      </div>
    </CustomModal>

    {isAuthModalOpen && (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    )}

  </>);
};
export default FreeKundliClient;
