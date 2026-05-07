"use client";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaSearch, FaShoppingCart, FaStar } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaFire, FaHeart, FaCalendarAlt, FaCheck } from "react-icons/fa";
import { toastifySuccess } from "../utils/utility.js";
import SEO from "../components/SEO/page.js";
import LazyInView from "../components/LazyInView/page.js";
import { getPostData, TokenWithDeleteUpadateAdd, fetchData } from "../utils/api.js";
// Simple Loading Indicator component (replacement for react-loading-indicators)
const LoadingIndicator = ({ color = "#f97316", size = "medium" }) => {
  const sizeMap = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };
  return (<div className="flex justify-center items-center py-8">
    <div className={`${sizeMap[size]} border-4 border-gray-200 border-t-${color} rounded-full animate-spin`}></div>
  </div>);
};
// Simple Select component (replacement for react-select)
const SimpleSelect = ({ value, onChange, options, placeholder, className }) => {
  return (<select className={`w-full border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${className}`} value={value} onChange={(e) => onChange({ value: e.target.value, label: e.target.value })}>
    <option value="">{placeholder}</option>
    {options?.map((item, index) => (<option key={index} value={item?.value}>
      {item?.label}
    </option>))}
  </select>);
};
// MenuContext (simplified version)
const MenuContext = React.createContext({
  pujareviewstatus: false,
  setpujareviewstatus: () => { }
});
const OnlinePuja = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchVal, setSearchVal] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [PujaForsdata, setPujaForsdata] = useState();
  const [pujareviewdata, setpujareviewdata] = useState();
  const [allPujaData, setAllPujaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [opD, setopD] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || "" : "";
  const MerchantId = typeof window !== 'undefined' ? sessionStorage.getItem("MerchantId") || '' : '';
  const pujaID = typeof window !== 'undefined' ? sessionStorage.getItem("PujaID") || '' : '';
  useEffect(() => {
    Get_Data_OnlinePuja();
    Get_Data_PujaFor();
  }, []);
  const Get_Data_OnlinePuja = async () => {
    const val = {
      IsActive: "1",
    };
    setLoading(true);
    try {
      const res = await getPostData("Puja/GetData_Puja", val);
      if (res) {
        const dataArray = Array.isArray(res) ? res : (res.data || []);
        setAllPujaData(dataArray);
        setpujareviewdata(dataArray?.filter((item) => String(item?.PujaID) === pujaID));
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };
  const Get_Data_PujaFor = async () => {
    try {
      const visitor_Id = typeof window !== 'undefined' ? localStorage.getItem("visitor_Id") : '';
      const urlSet = typeof window !== 'undefined' ? window.location.origin : '';
      const apiUrl = urlSet === 'https://astrocall.live' ? "https://api.astrocall.live/api/PujaFor/GetDropDownData_PujaFor" :
        "https://liveapi.astrocall.live/api/PujaFor/GetDropDownData_PujaFor";

      const res = await fetchData(apiUrl);
      const parseData = JSON.parse(res?.data);
      const Resdata = parseData?.Table;
      setPujaForsdata(Resdata);
    }
    catch (error) {
      console.log(error);
    }
  };
  const gridData = new Map([
    [1, {
      icon: <FaFire size={32} className="text-primaryColor mx-auto mb-4 text-5xl" />,
      title: 'Authentic Rituals',
      text: 'All ceremonies are performed with the same traditional practices and mantras as in-person poojas at sacred temples.'
    }],
    [2, {
      icon: <FaHeart size={32} className="text-primaryColor mx-auto mb-4 text-5xl" />,
      title: 'Personal Connection',
      text: 'The priest will perform the pooja in your name, creating a direct spiritual connection despite the physical distance.'
    }],
    [3, {
      icon: <FaCalendarAlt size={32} className="text-primaryColor mx-auto mb-4 text-5xl" />,
      title: 'Convenience',
      text: 'Participate in sacred ceremonies from anywhere in the world, at a time that works for your schedule.'
    }],
    [4, {
      icon: <FaCheck size={32} className="text-primaryColor mx-auto mb-4 text-5xl" />,
      title: 'Complete Package',
      text: 'Receive prasad and blessed items delivered to your doorstep after the ceremony is completed.'
    }]
  ]);
  const faqs = [
    { question: "How does an online pooja work?", answer: "Astrological predictions are based on celestial patterns and can offer valuable insights, but outcomes may vary depending on interpretation and individual circumstances." },
    { question: "Is online pooja as effective as physically attending?", answer: "You typically need your full birth date, exact birth time, and place of birth to generate an accurate kundli." },
    { question: "What do I need to prepare for an online pooja?", answer: "Compatibility is analyzed based on planetary positions, elements (fire, water, etc.), and emotional alignment between zodiac signs." },
    { question: "Can I request a specific date and time?", answer: "Vedic astrology (Jyotish) is sidereal and includes lunar constellations, while Western astrology is tropical and solar-based." },
    { question: "Will I receive prasad after the pooja?", answer: "Consulting during major life decisions or transitions is common—monthly or yearly reviews are also helpful for guidance." }
  ];
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const Insert_BookingPuja_reviews = async () => {
    try {
      const val = {
        StarCount: rating,
        Comment: comment,
        BookingPujaID: pujaID
      };
      const res = await TokenWithDeleteUpadateAdd('BookingPuja/Update', val);
      if (res) {
        toastifySuccess("Submit Successfully");
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("GemstoneOrder");
          sessionStorage.removeItem("PujaID");
        }
      }
    }
    catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (UserLoginId && MerchantId) {
      PhonePe_handlePayment(MerchantId);
    }
  }, [MerchantId]);
  const PhonePe_handlePayment = async (MerchantId) => {
    try {
      const val = {
        MerchantOrderId: MerchantId
      };
      const res = await TokenWithDeleteUpadateAdd("PhonePay/OrderStatus", val);
      if (res?.state === "COMPLETED") {
        // console.log(res, "res");
        setpujareviewstatus(true);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("MerchantId");
        }
      }
    }
    catch (error) {
      console.error("Payment Error:", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterChange = (selectedOption) => {
    setSelectedCategory(selectedOption ? selectedOption.value : "all");
    setCurrentPage(1);
  };
  const filteredPujaData = useMemo(() => {
    if (!Array.isArray(allPujaData))
      return [];
    return allPujaData.filter((item) => {
      const matchesName = item?.PujaName?.toLowerCase().includes(searchVal?.toLowerCase());
      const categoryObj = PujaForsdata?.find((pf) => pf?.PujaFors?.toLowerCase() === selectedCategory?.toLowerCase());
      const matchesCategory = selectedCategory === "all" ||
        item?.PujaFor?.toLowerCase() === selectedCategory?.toLowerCase() ||
        item?.PujaForID === categoryObj?.PujaForID;
      return item?.PujaID && matchesName && matchesCategory;
    });
  }, [allPujaData, searchVal, selectedCategory, PujaForsdata]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPujaData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPujaData.length / itemsPerPage);
  const isCurrentItemsLoading = loading;
  return (<>
    <SEO title="Book Online Puja & Religious Rituals | AstroCall Live" description="Book authentic online Puja services at AstroCall Live. Get personalised Vedic rituals performed by experienced pandits for health, prosperity, and peace of mind." canonical="https://astrocall.live/online-puja" type="website" schema={{
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Online Religious Puja",
      "provider": {
        "@type": "Organization",
        "name": "AstroCall"
      },
      "@graph": [
        {
          "@type": "Organization",
          "name": "AstroCall",
          "url": "https://astrocall.live",
          "logo": "https://astrocall.live/assets/logo.png"
        },
        {
          "@type": "WebSite",
          "url": "https://astrocall.live",
          "name": "AstroCall",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://astrocall.live/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://astrocall.live" },
            { "@type": "ListItem", "position": 2, "name": "Online Pooja", "item": "https://astrocall.live/online-puja" }
          ]
        }
      ]
    }} />



    <div className="py-6 sm:py-8 relative" style={{ backgroundColor: 'rgba(249, 115, 22, 0.05)' }}>
      <div className="absolute bottom-[0] right-[-90px] right-image hidden md:block">
        <img className="carousel-image" src="/assets/images/customar-before.webp" alt="" loading="lazy" width="800" height="450" decoding="async" />
      </div>
      <div className="bg-[#F973160D] pt-20 lg:pt-24">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 main-container rounded-lg sm:rounded-xl text-white text-center py-8 sm:py-10 md:py-12 px-3 sm:px-4 mt-4 sm:mt-6 shadow-lg">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold px-2">
            Online Pooja Services – Book Your Pooja Easily
          </h1>

          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-[550] mt-2 px-2">
            Benefits of Performing Pooja Online
          </h2>

          <h3>
            <p className="text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-w-xl mx-auto leading-relaxed px-2">
              Experience authentic traditional poojas performed by expert priests, streaming live
              to you from sacred temples across India. Seek divine blessings from the comfort of
              your home.
            </p>
          </h3>
        </div>

        <div className="p-3 sm:p-4 md:p-5 rounded-lg mt-4 sm:mt-5 shadow-md main-container">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:flex-1 sm:max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-sm sm:text-base" />
              <input type="text" className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search Pooja..." value={searchVal} onChange={handleSearchChange} />
            </div>

            <div className="w-full max-w-xs">
              <SimpleSelect onChange={handleFilterChange} value={selectedCategory} options={PujaForsdata?.map((item) => ({ value: item?.PujaFors, label: item?.PujaFors })) || []} placeholder="Select Category" className="w-full" />
            </div>
          </div>
        </div>

        <div className="carousel2 flex justify-between mt-6 sm:mt-8 w-full">
          <div className="relative flex items-center w-full m-auto">
            <div className="main-container px-3 sm:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-4 sm:my-5 w-full">

                {isCurrentItemsLoading ? (<div className="col-span-full">
                  <LoadingIndicator color="#f97316" size="medium" />
                </div>) : currentItems?.length > 0 ? (currentItems?.map((card, index) => (<div key={card?.PujaID} className="card-puja cursor-pointer bg-white shadow-lg h-auto p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full" onClick={() => {
                  const slug = card?.PujaName
                    ?.toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]+/g, "");
                  router.push(`/online-puja/${slug}`);
                  setopD(card?.PujaName);
                }}>
                  {/* Image */}
                  <div className="m-auto w-full rounded-lg sm:rounded-xl overflow-hidden relative">
                    <img src={card?.PujaImage
                      ? `https://${card.PujaImage.replace(/\\/g, "/")}`
                      : "/default-image.jpg"} alt={card?.PujaName || "Puja"} className="hover:scale-105 duration-300 rounded-lg sm:rounded-xl w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] object-cover" width="800" height="600" loading={index === 0 ? "eager" : "lazy"} decoding="async" onError={(e) => {
                        const target = e.target;
                        target.src = "/default-image.jpg";
                      }} />
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-md">
                      Most Popular
                    </div>
                  </div>

                  <div className="text my-2 sm:my-3 p-2 sm:p-3 m-auto text-center">
                    <div className="puja-heading text-left text-primaryColor text-base sm:text-lg md:text-xl my-2 font-[700] line-clamp-2">
                      <h4>{card.PujaName}</h4>
                    </div>

                    <div className="text-gray-600 text-xs sm:text-sm md:text-base my-2 text-left line-clamp-3">
                      <p>
                        {card?.ShortDescription ||
                          "Invite wealth and prosperity with this dedicated pooja to Goddess Laxmi."}
                      </p>
                    </div>

                    {/* Price & Duration */}
                    <div className="flex justify-between items-center">
                      <div className="prices my-3 sm:my-4 flex text-sm sm:text-base md:text-lg lg:text-xl justify-center gap-2 sm:gap-3">
                        {card.CurrentAmt === card.Amt ? (<p className="font-[800] text-[#1A2B4C] text-base sm:text-lg md:text-xl lg:text-2xl">
                          ₹ {card.Amt || 0}
                        </p>) : (<>
                          <p className="font-[800] text-[#1A2B4C] text-base sm:text-lg md:text-xl lg:text-2xl">
                            ₹ {card.Amt || 0}
                          </p>
                          <p className="font-[600] text-gray-500 line-through decoration-black text-sm sm:text-base">
                            ₹ {card.CurrentAmt || 0}
                          </p>
                        </>)}
                      </div>
                    </div>

                    <div className="p-2 sm:p-2.5 my-3 sm:my-4 bg-orange-500 w-full flex justify-center items-center py-2 sm:py-2.5 text-white rounded-lg hover:bg-orange-600 duration-300 font-[600] shadow-md hover:shadow-lg">
                      <button className="flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base">
                        <FaShoppingCart className="text-sm sm:text-base" />
                        Book Now
                      </button>
                    </div>

                  </div>
                </div>))) : (<div className="col-span-full flex flex-col justify-center items-center py-10 sm:py-16 text-center">
                  <div className="text-gray-400 mb-4">
                    {(selectedCategory !== "all" && selectedCategory) || searchVal ? (<img src="/images/pandit.webp" alt="Pooja" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain" />) : (<FaSearch className="text-5xl sm:text-6xl mx-auto" />)}
                  </div>
                  <div className="text-base sm:text-lg md:text-xl text-gray-500">
                    {searchVal
                      ? <>
                        <p className="font-medium mb-2">No puja services found for "{searchVal}"</p>
                        <p className="text-sm text-gray-400">Try searching with different keywords</p>
                      </>
                      : selectedCategory !== "all" && selectedCategory
                        ? <>
                          <p className="font-medium mb-2">No puja services found in "{selectedCategory}" category</p>
                          <p className="text-sm text-gray-400">Try selecting a different category</p>
                        </>
                        : <>
                          <p className="font-medium mb-2">No puja services found</p>
                          <p className="text-sm text-gray-400">Please check back later</p>
                        </>}
                  </div>
                </div>)}
              </div>
            </div>
          </div>
        </div>

        {totalPages > 1 && (<div className="main-container px-3 sm:px-4">
          <div className="flex justify-center overflow-x-auto mt-6 sm:mt-8 md:mt-10 space-x-1 sm:space-x-2 items-center pb-4">
            {/* Prev Arrow */}
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="text-gray-500 hover:text-black disabled:opacity-40 text-lg sm:text-xl px-2 sm:px-3 py-1 transition" aria-label="Previous page">
              &#8249;
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1));
              })
              .map((page, index, arr) => {
                const prev = arr[index - 1];
                const showEllipsis = prev && page - prev > 1;
                return (<React.Fragment key={page}>
                  {showEllipsis && (<span className="px-1 sm:px-2 text-gray-400 select-none text-sm sm:text-base">...</span>)}
                  <button onClick={() => setCurrentPage(page)} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs sm:text-sm font-medium border border-gray-200 transition ${currentPage === page
                    ? "bg-orange-500 text-white border-orange-500"
                    : "text-gray-800 hover:bg-gray-200"}`}>
                    {page}
                  </button>
                </React.Fragment>);
              })}

            {/* Next Arrow */}
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="text-gray-500 hover:text-black disabled:opacity-40 text-lg sm:text-xl px-2 sm:px-3 py-1 transition" aria-label="Next page">
              &#8250;
            </button>
          </div>
        </div>)}

        <div className="main-container px-3 sm:px-4">
          <div className="text-center mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primaryColor px-2">
              Benefits of Online Pooja
            </h2>
            <p className="mt-2 sm:mt-3 text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed px-2">
              Experience the same spiritual benefits as in-person ceremonies with added convenience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 py-4 sm:py-6">
              {[...gridData].map(([key, value]) => (<div key={key} className="bg-white p-4 sm:p-5 md:p-6 shadow-lg rounded-lg sm:rounded-xl text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="text-3xl sm:text-4xl md:text-5xl text-primaryColor">
                    {value.icon}
                  </div>
                </div>
                <h4 className="text-sm sm:text-base md:text-lg lg:text-xl my-2 font-[700] text-primaryColor mb-2">
                  {value.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                  {value.text}
                </p>
              </div>))}
            </div>
          </div>
        </div>

        <section className="main-container px-3 sm:px-4 py-8 sm:py-10 md:py-12 text-center">
          <div className="mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primaryColor mb-6 sm:mb-8 px-2">
              What Our Devotees Say
            </h2>

            <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 relative text-gray-700 text-sm sm:text-base md:text-lg italic leading-relaxed">
              <span className="absolute top-2 sm:top-4 left-2 sm:left-4 text-primaryColor text-2xl sm:text-3xl">"</span>
              <p className="relative max-w-4xl mx-auto px-6 sm:px-8">
                I was skeptical about online poojas at first, but after experiencing
                the Navagraha Shanti Pooja, I felt a remarkable shift in my life.
                The priest was very knowledgeable and performed the ceremony with
                such devotion. Within weeks, obstacles that had been troubling me
                for months started to resolve.
              </p>
              <span className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-primaryColor text-2xl sm:text-3xl">"</span>

              <div className="mt-4 sm:mt-6 text-center">
                <p className="font-semibold text-orange-600 text-sm sm:text-base">Rahul Sharma</p>
                <p className="text-xs sm:text-sm text-gray-500">Mumbai, Maharashtra</p>
                <div className="flex justify-center mt-2 gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, index) => (<FaStar key={index} size={14} className="sm:w-4 sm:h-4 text-primaryColor" />))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="main-container px-3 sm:px-4 py-6 sm:py-8 md:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 mb-4 sm:mb-6 px-2">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 sm:space-y-4 text-left">
              {faqs.map((faq, index) => (<div key={index} className="bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
                <div className="flex justify-between items-center gap-3" onClick={() => toggleFAQ(index)}>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 flex-1 pr-2">
                    {faq.question}
                  </h3>
                  <div className="text-gray-500 bg-orange-100 rounded-full p-1.5 sm:p-2 overflow-hidden transition-all duration-300 ease-in-out hover:bg-orange-200 flex-shrink-0">
                    <div className={`transition-all duration-300 transform ${openIndex === index ? "rotate-180 scale-110 opacity-100" : "rotate-0 scale-100 opacity-100"}`}>
                      {openIndex === index ? <FaMinus className="text-xs sm:text-sm" /> : <FaPlus className="text-xs sm:text-sm" />}
                    </div>
                  </div>
                </div>
                {openIndex === index && (<p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed pr-8">
                  {faq.answer}
                </p>)}
              </div>))}
            </div>
          </div>
        </section>
      </div>
    </div>



    <LazyInView fallback={<div className="min-h-10" />}>
      <Suspense fallback={<div className="flex justify-center items-center min-h-[160px]">
        Loading...
      </div>}>
      </Suspense>
    </LazyInView>
  </>);
};
// Wrap component with MenuContext provider
export default function OnlinePujaPage() {
  const [pujareviewstatus, setpujareviewstatus] = useState(false);
  return (<MenuContext.Provider value={{ pujareviewstatus, setpujareviewstatus: () => setpujareviewstatus(!pujareviewstatus) }}>
    <OnlinePuja />
  </MenuContext.Provider>);
}
