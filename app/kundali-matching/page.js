"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { GiScrollUnfurled } from "react-icons/gi";
import { useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import { format } from "date-fns";
import { FaSearch } from "react-icons/fa";
import SEO from "../components/SEO/page.js";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api.js";
// const ChatCallPopup = lazy(() => import("../../components/ChatCallPopup/ChatCallPopup.js"));
// const CommonServies = lazy(() => import("../../components/ChatCallPopup/CommonServies.js"));
// const CommanHoroscope = lazy(() => import("../../components/ChatCallPopup/CommanHoroscope.js"));
// const Footer = lazy(() => import("../../components/Footer/page.js"));
// const Header = lazy(() => import("../../components/Header/page.js"));
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
// Custom Modal component (replacement for react-modal)
const CustomModal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md mx-auto p-6 relative w-full max-w-lg">
        {title && (<div className="flex justify-between items-center border-b pb-3 mb-4">
            <h4 className="text-lg font-bold text-gray-800">{title}</h4>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">
              ✕
            </button>
          </div>)}
        {children}
      </div>
    </div>);
};
const KundliMatching = () => {
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const router = useRouter();
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
                setIsModalOpen(true);
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
    useEffect(() => {
        if (UserLoginId) {
            Get_Data_Kundli_Partners(UserLoginId);
        }
    }, [UserLoginId]);
    const Get_Data_Kundli_Partners = async () => {
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
    };
    useEffect(() => {
        if (EditvalMale?.Gender === "male") {
            setValue({
                ...value,
                'BName': EditvalMale?.Name, 'BDay': EditvalMale?.Day, 'BMonth': EditvalMale?.Month, 'BYear': EditvalMale?.Year, 'BHour': EditvalMale?.Hours, 'BMinute': EditvalMale?.Minute,
                'BSecond': EditvalMale?.Second, 'BBirthPlace': EditvalMale?.PlaceOfBirth, 'Blon': EditvalMale?.Longitude, 'Blat': EditvalMale?.Latitude,
            });
            setBSelectedDay(EditvalMale?.Day || '1');
            const selectedMonthB = MONTHS.find((month) => month.number === EditvalMale?.Month);
            setBSelectedmonth(selectedMonthB?.name ? selectedMonthB?.name : 'January');
            setBStartDate(new Date(EditvalMale?.Year || new Date().getFullYear(), EditvalMale?.Month - 1 || 0, EditvalMale?.Day || 1));
            setBSelectedHour(EditvalMale?.Hours || '0');
            setBSelectedMinute(EditvalMale?.Minute || '0');
            setBSelectedSecond(EditvalMale?.Second || '0');
        }
        else if (EditvalMale?.Gender === "female") {
            setValue({
                ...value,
                'GName': EditvalMale?.Name, 'GDay': EditvalMale?.Day, 'GMonth': EditvalMale?.Month, 'GYear': EditvalMale?.Year, 'GHour': EditvalMale?.Hour, 'GMinute': EditvalMale?.Minute, 'GSecond': EditvalMale?.Second, 'GBirthPlace': EditvalMale?.PlaceOfBirth, 'Glon': EditvalMale?.Longitude, 'Glat': EditvalMale?.Latitude,
            });
            setGSelectedDay(EditvalMale?.Day || '1');
            const selectedMonthG = MONTHS.find((month) => month.number === EditvalMale?.Month);
            setGSelectedmonth(selectedMonthG?.name ? selectedMonthG?.name : 'January');
            setGStartDate(new Date(EditvalMale?.Year || new Date().getFullYear(), EditvalMale?.Month - 1 || 0, EditvalMale?.Day || 1));
            setGSelectedHour(EditvalMale?.Hours || '0');
            setGSelectedMinute(EditvalMale?.Minute || '0');
            setGSelectedSecond(EditvalMale?.Second || '0');
        }
        else {
            setValue({
                ...value,
                'BName': '', 'BGenderID': '', 'BDay': '', 'BMonth': '', 'BYear': '', 'BHour': '', 'BMinute': '', 'BSecond': '', 'BBirthPlace': '', 'GName': '', 'GGenderID': '', 'GDay': '', 'GMonth': '', 'GYear': '', 'GHour': '', 'GMinute': '', 'GSecond': '', 'GBirthPlace': '', 'CreatedByUser': '', 'coordinates': '', 'Blon': '', 'Blat': '', 'Glon': '', 'Glat': '', 'datetime': '', 'BDOB': '', 'GDOB': ''
            });
        }
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
        if (debounceTimersRef.current.B)
            clearTimeout(debounceTimersRef.current.B);
        if (debounceTimersRef.current.G)
            clearTimeout(debounceTimersRef.current.G);
    }, []);
    return (<>
      <SEO title="Kundli Matching for Marriage – Free Guna Milan Tool" description="Use AstroCall's free kundli matching tool for marriage. Match horoscopes of bride and groom by Vedic Guna Milan and get insights on compatibility and married life." canonical="https://astrocall.live/kundali-matching" type="website" schema={{
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "SoftwareApplication",
                    "name": "Free Kundali Matching — AstroCall",
                    "url": "https://astrocall.live/kundali-matching",
                    "applicationCategory": "AstrologyApplication",
                    "operatingSystem": "Web Browser",
                    "description": "Free Kundali Matching (Kundali Milan) for marriage compatibility. Check Ashtakoot Guna Milan score, Mangal Dosha, and compatibility report for boy & girl.",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
                    "provider": { "@id": "https://astrocall.live/#organization" }
                },
                {
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What is Kundali Matching?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Kundali Matching (also called Kundali Milan or Horoscope Matching) is a Vedic astrology method that assesses marriage compatibility between two individuals using Ashtakoot Gun Milan scoring."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How many Gunas are needed for a good match?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "In Ashtakoot Milan, a score of 18 out of 36 is considered the minimum acceptable match. A score of 24 or above is considered a good match for marriage."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Is Kundali Matching free on AstroCall?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, AstroCall provides free Kundali Matching. Enter birth details of both individuals to get an instant compatibility report."
                            }
                        }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://astrocall.live/" },
                        { "@type": "ListItem", "position": 2, "name": "Kundali Matching", "item": "https://astrocall.live/kundali-matching" }
                    ]
                }
            ]
        }}/>

      {/* <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Header />
        </Suspense> */}

      <div className="bg-[#F973160D]">
        <div className="main-container text-left py-5 ">
          <div className="bg-orange-500 rounded-md w-full text-white text-center py-5 px-4 mt-18">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-3">
                <GiScrollUnfurled className="text-white text-3xl"/>
                <h1 className="text-2xl font-extrabold">Kundli Matching</h1>
              </div>
              <h2 className="text-2xl font-[550] mt-2">Free Horoscope Matching for Marriage</h2>
              <h3>
                <p className="mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
                  Kundli Matching helps evaluate the compatibility between two individuals based on their birth charts. It plays a vital role in ensuring a harmonious and prosperous married life in Vedic astrology.
                </p>
              </h3>
              <div className="w-8 h-[2px] bg-white mt-4"></div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="main-container grid grid-cols-1 lg:grid-cols-12 gap-8 py-2 relative">
            <div className="col-span-1 lg:col-span-8 mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="flex flex-row flex-wrap lg:flex-nowrap gap-4 items-center justify-center">
                {/* Boys Form */}
                <div className="flex justify-center items-center md:col-span-2">
                  <form className="bg-white p-8 shadow-md rounded-lg border-orange-500 border-2" onSubmit={handleSubmit}>
                    <h2 className="lg:text-xl font-semibold text-center text-primaryColor">
                      Boy's Birth Details
                    </h2>
                    <div className="w-[8vw] h-[2px] m-auto rounded-full bg-primaryColor my-1"></div>

                    {/* Name Input */}
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-800">Name <span className="text-red-500">*</span></label>
                      <input type="text" id="BName" name="BName" autoComplete="off" placeholder="Enter Boy Name" value={value?.BName} onChange={handleChange} className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200" required/>
                      {errors.BName && <p className="text-red-600 text-sm mt-1">{errors.BName}</p>}
                    </div>

                    {/* Date of Birth Input */}
                    <div className="mb-4 flex grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="BDay" className="block text-sm font-bold text-gray-800">Day</label>
                        <select name="BDay" id="BDay" className="w-full px-4 py-1 border rounded-md focus:ring" value={BselectedDay} onChange={handleChangeDayB}>
                          {days.map((Day) => (<option key={Day} value={Day}>{Day}</option>))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Month</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={Bselectedmonth} onChange={handleChangemonthB}>
                          {MONTHS?.map((month, index) => (<option key={index}>{month?.name}</option>))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Year</label>
                        <DatePicker className="w-full px-4 py-1 border rounded-md focus:ring" selected={BstartDate} onChange={(date) => setBStartDate(date)} showYearPicker dateFormat="yyyy" yearItemNumber={9}/>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Hour</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" id="hour-select" value={BselectedHour} onChange={handleHourChangeB}>
                          {[...Array(24).keys()]?.map(hour => (<option key={hour} value={hour}>
                              {hour}
                            </option>))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Minute</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={BselectedMinute} onChange={handleChangeMinuteB}>
                          {minutes?.map((minute) => (<option key={minute} value={minute}>{minute}</option>))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Second</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={BselectedSecond} onChange={handleChangeSecondB}>
                          {seconds?.map((Second) => (<option key={Second} value={Second}>{Second}</option>))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-sm font-bold text-gray-800">
                        Birth Place <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input type="text" name="BBirthPlace" placeholder="Birth Place" autoComplete="off" value={value.BBirthPlace} onChange={(e) => {
            const val = e.target.value;
            setValue((prev) => ({ ...prev, BBirthPlace: val, Blat: "", Blon: "" }));
            if (val.length >= 3) {
                scheduleLocationLookup("B", val);
            }
            else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }} className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"/>

                        {errors?.BBirthPlace && (<p className="text-red-600 text-sm mt-1">{errors?.BBirthPlace}</p>)}

                        {showSuggestions && suggestions?.length > 0 && (<ul className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-white shadow-xl rounded-xl mt-2 z-50">
                            {suggestions?.map((item, index) => (<li key={index} onClick={() => {
                    setValue((prev) => ({
                        ...prev,
                        BBirthPlace: item.display_name,
                        Blat: item.lat,
                        Blon: item.lon,
                    }));
                    setSuggestions([]);
                    setShowSuggestions(false);
                }} className="p-3 hover:bg-gray-200 cursor-pointer">
                                {item.display_name}
                              </li>))}
                          </ul>)}
                      </div>
                    </div>
                  </form>
                </div>

                {/* Girls Form */}
                <div className="flex justify-center items-center md:col-span-2">
                  <form className="bg-white p-8 shadow-md rounded-lg border-orange-500 border-2" onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold mb-1 text-center text-primaryColor">Girl's Birth Details</h2>
                    <div className="w-[8vw] h-[2px] m-auto rounded-full bg-primaryColor my-1"></div>

                    {/* Name Input */}
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-bold text-gray-800">Name <span className="text-red-500">*</span></label>
                      <input type="text" id="GName" autoComplete="off" placeholder="Enter Girl Name" name="GName" value={value?.GName} onChange={handleChange} className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200" required/>
                      {errors.GName && <p className="text-red-600 text-sm mt-1">{errors.GName}</p>}
                    </div>

                    <div className="mb-4 grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Day</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={GselectedDay} onChange={handleChangeDayG}>
                          {days.map((Day) => (<option key={Day} value={Day}>{Day}</option>))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Month</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={Gselectedmonth} onChange={handleChangemonthG}>
                          {MONTHS?.map((month, index) => (<option key={index}>{month?.name}</option>))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Year</label>
                        <DatePicker className="w-full px-4 py-1 border rounded-md focus:ring" selected={GstartDate} onChange={(date) => setGStartDate(date)} showYearPicker dateFormat="yyyy" yearItemNumber={9}/>
                      </div>
                    </div>

                    <div className="mb-4 flex grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Hour</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" id="hour-select" value={GselectedHour} onChange={handleHourChangeG}>
                          {[...Array(24).keys()]?.map(hour => (<option key={hour} value={hour}>
                              {hour}
                            </option>))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Minute</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={GselectedMinute} onChange={handleChangeMinuteG}>
                          {minutes?.map((minute) => (<option key={minute} value={minute}>{minute}</option>))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="tob" className="block text-sm font-bold text-gray-800">Second</label>
                        <select className="w-full px-4 py-1 border rounded-md focus:ring" value={GselectedSecond} onChange={handleChangeSecondG}>
                          {seconds?.map((Second) => (<option key={Second} value={Second}>{Second}</option>))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-sm font-bold text-gray-800">
                        Birth Place <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input type="text" name="GBirthPlace" autoComplete="off" placeholder="Birth Place" value={value.GBirthPlace} onChange={(e) => {
            const val = e.target.value;
            setValue((prev) => ({ ...prev, GBirthPlace: val, Glat: "", Glon: "" }));
            if (val.length >= 3) {
                scheduleLocationLookup("G", val);
            }
            else {
                setSuggestionsG([]);
                setShowSuggestionsG(false);
            }
        }} className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"/>

                        {errors?.GBirthPlace && (<p className="text-red-600 text-sm mt-1">{errors?.GBirthPlace}</p>)}

                        {showSuggestionsG && suggestionsG?.length > 0 && (<ul className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-white shadow-xl rounded-xl mt-2 z-50">
                            {suggestionsG?.map((item, index) => (<li key={index} onClick={() => {
                    setValue((prev) => ({
                        ...prev,
                        GBirthPlace: item.display_name,
                        Glat: item.lat,
                        Glon: item.lon,
                    }));
                    setSuggestionsG([]);
                    setShowSuggestionsG(false);
                }} className="p-3 hover:bg-gray-200 cursor-pointer">
                                {item.display_name}
                              </li>))}
                          </ul>)}
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button className="px-12 py-2 w-[400px] rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={checkValidationErrors}>
                  Submit
                </button>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-4 mt-8 p-4 bg-white from-gray-50 to-white border border-gray-200 rounded-2xl shadow-lg">
              {UserLoginId ? (<>
                  <div className="flex justify-center mb-3">
                    <div className="flex items-center w-full rounded-full px-5 py-2 shadow-sm border border-gray-200">
                      <FaSearch className="text-gray-400 mr-3"/>
                      <input type="text" placeholder="Search Kundli" value={searchVal} onChange={handleSearchChange} className="w-full bg-transparent focus:outline-none text-gray-700"/>
                    </div>
                  </div>

                  <p className="text-lg font-semibold text-gray-700 mb-1">
                    Recently Opened
                  </p>
                  <div className="space-y-6 overflow-y-auto h-[400px] pr-2 custom-scrollbar">
                    {filteredData && filteredData.length > 0 ? (filteredData.map((item) => (<div key={item?.Id} className="space-y-4">
                          <button type="button" onClick={() => { setEditvalMale(item); }} className="w-full text-left">
                            <div className="relative flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition from-yellow-50 to-white">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                  {item?.Name?.charAt(0)?.toUpperCase()}
                                </div>

                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {item?.Name}, <span className="text-blue-500">{item?.Gender}</span>
                                  </div>
                                  <div className="text-sm text-gray-500 leading-snug">
                                    {item?.Day && item?.Month && item?.Year ? (format(new Date(item?.Year, item?.Month - 1, item?.Day, item?.Hours || 0, item?.Minute || 0), "dd MMM, yyyy hh:mm a")) : ("")}
                                    <br />
                                    <span className="text-gray-400">{item?.PlaceOfBirth}</span>
                                  </div>
                                </div>
                              </div>

                              <button onClick={(e) => {
                    setKundliDeleteId(item?.Id);
                    setIsPopupOpen(true);
                }} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition">
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </button>
                        </div>))) : (<h6 className="text-center text-gray-500">No Data Available</h6>)}
                  </div>
                </>) : (<div className="flex flex-col items-center justify-center py-40 text-center">
                  <h3 className="text-gray-700">Login to Check Horoscope</h3>
                  <div className="chat-button flex my-6">
                    <button className="bg-orange-50 flex gap-2 items-center text-orange-600 border-2 px-5 py-2 border-orange-400 rounded-full m-auto hover:bg-orange-500 hover:text-white duration-300">
                      Login
                    </button>
                  </div>
                </div>)}
            </div>

            <div>
              <CustomModal isOpen={isPopUPOpen} onClose={closeModal} title="Delete Kundli">
                <div className="py-3 text-center">
                  <h5 className="text-lg text-gray-700">Are you sure you want to delete this Kundli?</h5>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                  <button onClick={closeModal} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold">
                    Cancel
                  </button>
                  <button onClick={Delete_KundliPartners_Data} className="px-6 py-2 rounded-lg bg-orange-500 text-white transition font-semibold">
                    OK
                  </button>
                </div>
              </CustomModal>
            </div>
          </div>

          {/* FAQ Section */}
          {/* {FAQData && FAQData?.length > 0 && (
          <div className="main-container mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                {FAQData?.map((faq: any, index: number) => (
                  <div key={index} className="border-b pb-4">
                    <h3 className="text-2xl font-semibold mb-4">{faq?.HoroscopeName} FAQs</h3>
                    <p
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq?.HoroscopeDetailsHTML) }}
                    ></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
        </div>
      </div>

      {/* <Suspense fallback={<div className="min-h-10" />}>
          <ChatCallPopup />
          <CommonServies />
          <CommanHoroscope />
          <Footer />
        </Suspense> */}
    </>);
};
export default KundliMatching;
