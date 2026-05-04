"use client";
import React, { useEffect, useState } from "react";
import { postWithToken } from "../../utils/api.js";
import { useRouter, useParams } from "next/navigation";
import { GiStarsStack, GiLotus } from "react-icons/gi";
import { FaHeart, FaChartBar, FaPlane, FaSmile, FaStar } from "react-icons/fa";
import { format } from "date-fns";
import SEO from "../../components/SEO/page.js";
const HoroscopeDetails = () => {
  const router = useRouter();
  const { sign } = useParams();
  const [activeButton, setActiveButton] = useState("daily");
  const [horoscopedata, sethoroscopedata] = useState(null);
  const [horoscopename, sethoroscopename] = useState(sign ? sign : "Aries");
  const [Datehoroscope, setDatehoroscope] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");
  const [activeDays, setActiveDays] = useState("current");
  const [activeCategory, setActiveCategory] = useState("Personal");
  const [buttonName2status, setbuttonName2status] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    month: "",
    date: "",
    year: "",
  });
  const categories = [
    { name: "Personal", key: "personal", icon: <GiLotus /> },
    { name: "Health", key: "health", icon: <FaHeart /> },
    { name: "Profession", key: "profession", icon: <FaChartBar /> },
    { name: "Emotions", key: "emotions", icon: <FaSmile /> },
    { name: "Travel", key: "travel", icon: <FaPlane /> },
    { name: "Luck", key: "luck", icon: <FaStar /> },
  ];
  const buttonName1 = [
    { name: "Weekly", value: "week" },
    { name: "Monthly", value: "month" },
    { name: "Yearly", value: "year" },
  ];
  const buttonName2 = [
    { name: "Today", value: "current" },
    { name: "Yesterday", value: "prev" },
    { name: "Tomorrow", value: "next" },
  ];
  const Horoscopeimages = [
    { name: "Aries", img: "/horoimg/aries.png" },
    { name: "Taurus", img: "/horoimg/taurus.png" },
    { name: "Aquarius", img: "/horoimg/aquarius.png" },
    { name: "Cancer", img: "/horoimg/cancer.png" },
    { name: "Capricorn", img: "/horoimg/capricorn.png" },
    { name: "Gemini", img: "/horoimg/gemini.png" },
    { name: "Leo", img: "/horoimg/leo.png" },
    { name: "Libra", img: "/horoimg/libra.png" },
    { name: "Pisces", img: "/horoimg/pisces.png" },
    { name: "Sagittarius", img: "/horoimg/sagittarius.png" },
    { name: "Scorpio", img: "/horoimg/scorpio.png" },
    { name: "Virgo", img: "/horoimg/virgo.png" },
  ];
  useEffect(() => {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const date = today.getDate().toString();
    const year = today.getFullYear().toString();
    setCurrentDate({ month, date, year });
    setSelectedTimeFrame(`${month} ${date}, ${year}`);
  }, []);
  const handleButtonClick = (buttonName, signName = horoscopename) => {
    setActiveButton(buttonName);
    router.push(`/daily-horoscope/${signName}`);
    if (buttonName === "daily") {
      const { month, date, year } = currentDate;
      setSelectedTimeFrame(`${month} ${date}, ${year}`);
    }
  };
  useEffect(() => {
    if (sign) {
      Chat_GetData_Horoscope();
      sethoroscopename(sign);
    }
  }, [sign, activeButton, activeDays]);
  const Chat_GetData_Horoscope = async () => {
    try {
      const val = {
        Sign: sign,
        Date: format(new Date(), "MM/dd/yyyy"),
        Type: activeButton,
        State: activeDays,
        "lan": "en"
      };
      const res = await postWithToken("Chat/GetData_Horoscope", val);
      if (res) {
        const parsed = JSON.parse(res[0]?.Response);
        if (parsed) {
          let finalData = {};
          let Datefinal = {};
          switch (activeButton) {
            case "daily":
              finalData = parsed.data.prediction || {};
              Datefinal = selectedTimeFrame || {};
              break;
            case "week":
              finalData = parsed.data.weekly_horoscope || {};
              Datefinal = parsed.data.week || {};
              break;
            case "month":
              finalData = parsed.data.monthly_horoscope || {};
              Datefinal = parsed.data.month || {};
              break;
            case "year":
              finalData = parsed.data.yearly_horoscope || {};
              Datefinal = parsed.data.year || {};
              break;
            default:
              break;
          }
          sethoroscopedata({
            sign: parsed.data.sign,
            ...finalData,
            special: parsed.data.special || null,
          });
          setDatehoroscope(Datefinal);
        }
      }
    }
    catch (error) {
      console.log(error, "error");
    }
  };
  // const filteredDataFAQ = sign ? FAQData?.filter((item: any) => item?.HoroscopeName === sign) : '';
  const HeadlebuttonName2status = () => {
    setbuttonName2status(!buttonName2status);
  };
  const horoscopeSign = sign || horoscopename || "Aries";
  const horoscopeTitle = `${horoscopeSign} ${activeButton.charAt(0).toUpperCase() + activeButton.slice(1)} Horoscope`;
  return (<>
    <SEO title={`${horoscopeTitle} - Daily Predictions & Guidance | AstroCall`} description={`Get accurate ${horoscopeSign} ${activeButton} horoscope predictions for love, career, health, and finance. Read your ${horoscopeSign} horoscope today.`} canonical={`https://astrocall.live/daily-horoscope/${horoscopeSign}`} type="WebPage" schema={{
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${horoscopeTitle} - Daily Predictions & Guidance | AstroCall`,
      description: `Get accurate ${horoscopeSign} ${activeButton} horoscope predictions for love, career, health, and finance. Read your ${horoscopeSign} horoscope today.`,
      url: `https://astrocall.live/daily-horoscope/${horoscopeSign}`
    }} />
    <div className="bg-[#F973160D]">
      <div className="main-container px-3 sm:px-4">
        <div className="bg-orange-500 mt-16 sm:mt-[4.500rem] rounded-md w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <GiStarsStack className="text-white text-2xl sm:text-3xl" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">
                {activeButton.charAt(0).toUpperCase() + activeButton.slice(1)} Horoscope
              </h1>
            </div>
            <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed px-2">
              Get astrology-based guidance. Choose your zodiac sign to see love,
              career, and health insights.
            </p>
            <div className="w-8 h-[2px] bg-white mt-3 sm:mt-4"></div>
          </div>
        </div>
      </div>

      <div>
        <div className="relative">
          <div className="main-container relative px-3 sm:px-4">
            <div className="text-center my-3 sm:my-4 md:my-5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[600] mt-3 sm:mt-4 md:mt-5 text-center px-2">
                {horoscopedata ? (<>
                  <span style={{ color: "#ff4500c7" }}>
                    {horoscopedata?.sign}
                  </span>{" "}
                  Horoscope ({typeof Datehoroscope === "string" ? Datehoroscope : selectedTimeFrame})
                </>) : ("Today's Horoscope")}
              </h1>
              <div className="w-[100px] sm:w-[120px] md:w-[150px] h-[2px] sm:h-[3px] m-auto rounded-full bg-primaryColor my-2 sm:my-3"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
          <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl w-full max-w-6xl overflow-hidden">

            <div className="md:w-1/3 bg-gradient-to-b from-orange-500 to-orange-600 text-white p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-5 md:space-y-6">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Choose Your Sign:</h2>
                <select value={horoscopename} onChange={(e) => {
                  sethoroscopename(e.target.value);
                  router.push(`/daily-horoscope/${e.target.value}`);
                }} className="w-full rounded-xl sm:rounded-2xl border border-orange-300 bg-orange-100 text-orange-800 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold cursor-pointer shadow-sm hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {Horoscopeimages?.map((btn) => (<option key={btn.name} value={btn.name}>{btn.name}</option>))}
                </select>
              </div>
              <div className="w-full h-[1px] bg-white"></div>

              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2">Horoscope</h2>

                {/* Daily Button & Dropdown */}
                <div className="bg-white/20 rounded-lg sm:rounded-xl overflow-hidden">
                  <button onClick={() => handleButtonClick("daily")} className={`w-full flex justify-between items-center rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2 text-orange-800 text-sm sm:text-base font-semibold cursor-pointer shadow-sm hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeButton === "daily" ? "border-orange-400 bg-orange-200" : "border-orange-300 bg-orange-100"}`}>
                    Daily
                    <span onClick={(e) => {
                      e.stopPropagation();
                      HeadlebuttonName2status();
                    }} className="text-xs sm:text-sm">
                      {activeButton === "daily" && buttonName2status ? "▲" : "▼"}
                    </span>
                  </button>

                  {activeButton === "daily" && buttonName2status && (<div className="bg-white/10 px-2 sm:px-3 py-2 space-y-1 sm:space-y-2">
                    {buttonName2?.map((btn) => (<button key={btn.value} onClick={() => {
                      setActiveDays(btn.value);
                      if (activeButton === "daily")
                        handleButtonClick("daily");
                    }} className="w-full rounded-xl sm:rounded-2xl border border-orange-300 bg-orange-100 px-3 sm:px-4 py-1.5 sm:py-2 text-orange-800 text-sm sm:text-base font-semibold cursor-pointer shadow-sm hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400">
                      {btn.name}
                    </button>))}
                  </div>)}
                </div>

                {/* Quick Buttons */}
                <div className="space-y-1.5 sm:space-y-2">
                  {buttonName1?.map((btn) => (<button key={btn.value} onClick={() => {
                    setActiveButton(btn.value);
                    handleButtonClick(btn.value);
                  }} className={`w-full rounded-xl sm:rounded-2xl border border-orange-300 px-3 sm:px-4 py-2 text-orange-800 text-sm sm:text-base font-semibold cursor-pointer shadow-sm hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeButton === btn.value ? "bg-orange-200 border-orange-400" : "bg-orange-100"}`}>
                    {btn.name}
                  </button>))}
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-2/3 p-4 sm:p-6 md:p-8">
              {horoscopedata ? (categories.map((cat) => (<div key={cat.key} className="mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">{cat.icon}</span>
                  {cat.name}
                </h3>
                {cat.key === "luck" ? (<ul className="list-disc pl-5 sm:pl-6 text-gray-600 space-y-1 text-sm sm:text-base">
                  {horoscopedata.luck?.map((item, idx) => (<li key={idx}>{item}</li>))}
                </ul>) : (<p className="text-gray-600 leading-relaxed text-sm sm:text-base">{horoscopedata[cat.key] || ""}</p>)}
              </div>))) : (<div className="flex items-center justify-center py-10 sm:py-20">
                <p className="text-gray-500 text-sm sm:text-base">No data available...</p>
              </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* {filteredDataFAQ && filteredDataFAQ?.length > 0 && (
          <div className="main-container mb-8 sm:mb-10 px-3 sm:px-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <div className="space-y-3 sm:space-y-4">
                {filteredDataFAQ?.map((faq: any, index: number) => (
                  <div key={index} className="border-b pb-3 sm:pb-4 last:border-b-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">{faq?.HoroscopeName} FAQs</h3>
                    <p
                      className="text-gray-700 text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq?.HoroscopeDetailsHTML) }}
                    ></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
    </div>

  </>);
};
export default HoroscopeDetails;
