"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GiOpenBook } from "react-icons/gi";
import { MdDeleteOutline } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SEO from "@/app/components/SEO/page.js";
import { TokenWithDeleteUpadateAdd, postWithToken } from "@/app/utils/api";
// Custom Modal Component
const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen)
    return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg sm:text-xl font-semibold">{title}</h5>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>);
};
const FreeKundli = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      router.push(`/freekundli/basic-detail?FreekundliID=${res?.Id}`);
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
  }, [UserLoginId]);
  const Get_Data_Kundli = async () => {
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
  };
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
        setIsModalOpen(true);
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
    }} />

    <div className="bg-[#F973160D]">
      <div className="main-container text-left py-5 ">
        <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4 mt-18">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3">
              <GiOpenBook className="text-white text-3xl" />
              <h1 className="text-2xl font-extrabold">Free Kundli Online</h1>
            </div>
            <h2 className="text-xl mt-2 font-[600]">Generate your free Kundli instantly based on your date, time, and place of birth.</h2>
            <h3>
              <p className="mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
                Know planetary positions and life predictions.
              </p>
            </h3>
            <div className="w-8 h-[2px] bg-white mt-4"></div>
          </div>
        </div>
      </div>

      <div>
        <div className="py-4 sm:py-5 md:py-6 relative">
          <div className=" max-w-4xl mx-auto px-3 sm:px-4">

            {/* Tabs */}
            <div className="flex border-b border-gray-300 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 sm:gap-6 md:gap-8 min-w-max">
                <button onClick={() => setActiveTab("New Kundli")} className={`px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-[700] whitespace-nowrap transition-all duration-200 flex-shrink-0 ${activeTab === "New Kundli"
                  ? "border-b-[3px] border-yellow-500 text-yellow-500"
                  : "text-gray-600 hover:text-yellow-800"}`}>
                  New Kundli
                </button>
                <button onClick={() => setActiveTab("Saved Kundli")} className={`px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg font-[700] whitespace-nowrap transition-all duration-200 flex-shrink-0 ${activeTab === "Saved Kundli"
                  ? "border-b-[3px] border-yellow-500 text-yellow-500"
                  : "text-gray-600 hover:text-yellow-800"}`}>
                  Saved Kundli
                </button>
              </div>
            </div>

            {/* New Kundli Tab Content */}
            {activeTab === "New Kundli" && (<div className="bg-white p-4 sm:p-5 md:p-6 shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl w-full">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                    Name*
                  </label>

                  <input id="Name" name="Name" autoComplete="off" value={value?.Name} onChange={handleChange} placeholder="Enter name" className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200" />

                  {errors?.Name && (<p className="text-red-500 text-xs sm:text-sm mt-1">{errors?.Name}</p>)}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                    Gender*
                  </label>
                  <select name="Gender" value={Genderstatus} onChange={(e) => setGenderstatus(e.target.value)} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200 appearance-none bg-white cursor-pointer" style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}>
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
                      <select className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}>
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
                      <select className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer" value={selectedmonth} onChange={(e) => setSelectedmonth(e.target.value)} style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}>
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
                      <DatePicker className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" selected={startDate} onChange={(date) => setStartDate(date)} showYearPicker dateFormat="yyyy" placeholderText="Year" />
                    </div>

                    {/* Hour */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2">
                        Hour*
                      </label>
                      <select className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer" value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}>
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
                      <select className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer" value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)} style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}>
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
                      <select className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer" value={selectedSecond} onChange={(e) => setSelectedSecond(e.target.value)} style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}>
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
                    }} className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200" />

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
                  <button className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" onClick={checkValidationErrors}>
                    Generate Kundli
                  </button>
                </div>
              </div>
            </div>)}

            {/* Saved Kundli Tab Content */}
            {activeTab === "Saved Kundli" && (<div className="bg-white p-4 sm:p-6 md:p-10 shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl w-full">
              <div>
                {UserLoginId ? (<>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="flex items-center w-full rounded-full px-3 sm:px-4 md:px-5 py-2 shadow-sm border border-gray-200">
                      <FaSearch className="text-gray-400 mr-2 sm:mr-3 text-sm sm:text-base" />
                      <input type="text" placeholder="Search Kundli" value={searchVal} onChange={handleSearchChange} className="w-full bg-transparent focus:outline-none text-gray-700 text-sm sm:text-base" />
                    </div>
                  </div>

                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                      Recently Opened
                    </p>
                    <div className="h-[300px] sm:h-[350px] md:h-[400px] overflow-y-auto pr-2 space-y-3 sm:space-y-4">
                      {filteredData && filteredData?.length > 0 ? (filteredData?.map((item, index) => (<div key={index} className="flex items-center cursor-pointer justify-between gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-200 shadow hover:shadow-md transition duration-200">
                        <div onClick={() => {
                          router.push(`/freekundli/basic-detail?FreekundliID=${item?.Id}`);
                          if (typeof window !== 'undefined') {
                            localStorage.setItem("BasicDetailID", item?.Id);
                          }
                        }} className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-md flex-shrink-0">
                            {item?.Name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">
                              {item?.Name},{" "}
                              {item?.Gender?.charAt(0)?.toUpperCase()}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 break-words">
                              {`DOB: ${item?.Day}-${item?.Month}-${item?.Year} | Time: ${String(item?.Hours)?.padStart(2, "0")}:${String(item?.Minute)?.padStart(2, "0")}:${String(item?.Second)?.padStart(2, "0")}`}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {item?.PlaceOfBirth}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button onClick={() => {
                          setKundliDeleteId(item?.Id);
                          setIsPopupOpen(true);
                        }} className="p-1.5 sm:p-2 rounded-full hover:bg-red-100 transition flex-shrink-0">
                          <MdDeleteOutline className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                        </button>
                      </div>))) : (<h6 className="text-center text-gray-500 py-8 sm:py-10 text-sm sm:text-base">
                        No Data Available
                      </h6>)}
                    </div>
                  </div>
                </>) : (<div className="flex flex-col justify-center items-center py-16 sm:py-24 md:py-32 text-center px-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                    Login to Check Horoscope!
                  </h3>
                  <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow hover:shadow-lg transition duration-300 text-sm sm:text-base" onClick={() => {
                    setIsModalOpen(true);
                  }}>
                    Login
                  </button>
                </div>)}
              </div>
            </div>)}
          </div>

          <div>
            <CustomModal isOpen={isPopUPOpen} onClose={closeModal} title="Confirm Delete Kundli">
              <h5 className="text-lg sm:text-xl mb-4 sm:mb-5 text-center">Are you sure you want to delete this Kundli?</h5>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button className="flex items-center justify-center gap-1 w-full py-2 sm:py-2.5 px-6 sm:px-8 text-white rounded-lg sm:rounded-xl bg-orange-500 hover:bg-orange-600 transition font-[600] text-sm sm:text-base" onClick={closeModal}>
                  Cancel
                </button>
                <button className="flex items-center justify-center gap-1 w-full py-2 sm:py-2.5 px-6 sm:px-8 text-white rounded-lg sm:rounded-xl bg-gray-600 hover:bg-gray-700 transition font-[600] text-sm sm:text-base" onClick={() => {
                  Delete_Kundli_Data();
                }}>
                  Delete
                </button>
              </div>
            </CustomModal>

            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Login Required">
              <h5 className="text-lg sm:text-xl mb-4 sm:mb-5 text-center">Please login to generate your Kundli</h5>
              <div className="flex justify-center">
                <button className="bg-orange-500 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow hover:shadow-lg transition duration-300 text-sm sm:text-base" onClick={() => {
                  router.push('/login');
                }}>
                  Go to Login
                </button>
              </div>
            </CustomModal>
          </div>
        </div>
      </div>
    </div>
  </>);
};
export default FreeKundli;
