"use client";
import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { FaCartShopping, FaStarHalf } from "react-icons/fa6";
import { getPostData, TokenWithDeleteUpadateAdd } from "../utils/api.js";
import { useRouter } from "next/navigation";
import { useMenuContext } from "../hooks/useMenuContext";
import { FaGem, FaInfoCircle } from "react-icons/fa";
import { FaStar, FaSearch } from "react-icons/fa";
import Header from "../components/Header/page.js";
import DOMPurify from 'dompurify';
import SEO from "../components/SEO/page.js";
import axios from "axios";
import LazyInView from "../components/LazyInView/page.js";
const Footer = lazy(() => import("../components/Footer/page.js"));
// Simple Loading Indicator component (replacement for react-loading-indicators)
const LoadingIndicator = ({ color = "#f97316", size = "medium" }) => {
    const sizeClass = size === "small" ? "w-4 h-4" : size === "large" ? "w-8 h-8" : "w-6 h-6";
    return (<div className="flex justify-center items-center">
      <div className={`${sizeClass} border-2 border-gray-200 border-t-${color} rounded-full animate-spin`} style={{ borderTopColor: color }}></div>
    </div>);
};
// Simple Select component (replacement for react-select)
const SimpleSelect = ({ value, onChange, options, placeholder }) => {
    return (<select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => (<option key={option.value} value={option.value}>
          {option.label}
        </option>))}
    </select>);
};
const Gemstone = () => {
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") : "";
    const { Gemstonereviewstatus, setGemstonereviewstatus, GetData_ActivityLog } = useMenuContext();
    const router = useRouter();
    const [searchVal, setSearchVal] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewsdata, setreviewsdata] = useState();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(false);
    const [CategoryData, setCategoryData] = useState();
    const [allgemstoneData, setAllgemstoneData] = useState([]);
    const [itemsPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const popupData = typeof window !== 'undefined' ? sessionStorage.getItem("GemstoneOrder") : "";
    const MerchantIdGemstone = typeof window !== 'undefined' ? sessionStorage.getItem("MerchantIdGemstone") : "";
    const GemstoneOrder = popupData ? JSON.parse(popupData) : null;
    useEffect(() => {
        Get_Data_gemstone();
    }, []);
    useEffect(() => {
        if (UserLoginId) {
            GetData_ActivityLog("Gemstone", "Gemstone list is fetch Now");
        }
    }, [UserLoginId, GetData_ActivityLog]);
    const Get_Data_gemstone = async () => {
        const val = { IsActive: "1" };
        setLoading(true);
        try {
            const res = await getPostData("Gemstone/GetData_Gemstone", val);
            if (res) {
                setAllgemstoneData(res);
                setreviewsdata(res?.filter((item) => item?.GemstoneID == GemstoneOrder?.GemstoneId));
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };
    const Insert_GemstoneOrder_reviews = async () => {
        try {
            const val = {
                StarCount: rating,
                Comment: comment,
                GemstoneOrderID: GemstoneOrder?.GemstoneOrderID,
            };
            const res = await TokenWithDeleteUpadateAdd("GemstoneOrder/Update", val);
            if (res) {
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem("GemstoneOrder");
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        GetData_GemstoneCategory();
    }, []);
    const GetData_GemstoneCategory = async () => {
        try {
            const urlSet = typeof window !== 'undefined' ? window.location.origin : '';
            const visitor_Id = typeof window !== 'undefined' ? localStorage.getItem("visitor_Id") : "";
            const val = {
                "IsActive": "1"
            };
            const res = await axios.post(urlSet === 'https://astrocall.live'
                ? "https://api.astrocall.live/api/GemstoneCategory/GetData_GemstoneCategory"
                : "https://liveapi.astrocall.live/api/GemstoneCategory/GetData_GemstoneCategory", val, {
                headers: {
                    "FingerPrintJsKey": visitor_Id,
                    "Content-Type": "application/json"
                }
            });
            const { data } = res;
            const parseData = JSON.parse(data?.data);
            const Resdata = parseData?.Table;
            if (Resdata) {
                setCategoryData(Resdata);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (UserLoginId && MerchantIdGemstone) {
            PhonePe_handlePayment(MerchantIdGemstone);
        }
    }, [MerchantIdGemstone, UserLoginId]);
    const PhonePe_handlePayment = async (MerchantIdGemstone) => {
        try {
            const val = {
                MerchantOrderId: MerchantIdGemstone
            };
            const res = await TokenWithDeleteUpadateAdd("PhonePay/OrderStatus", val);
            if (res?.state === "COMPLETED") {
                setGemstonereviewstatus(true);
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem("MerchantIdGemstone");
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
        setSelectedCategory(selectedOption || "all");
        setCurrentPage(1);
    };
    const filteredGemstoneData = useMemo(() => {
        return allgemstoneData.filter((item) => {
            const matchesName = item?.HeadingDescription?.toLowerCase().includes(searchVal?.toLowerCase());
            const categoryObj = CategoryData?.find((pf) => pf?.Category?.toLowerCase() === selectedCategory?.toLowerCase());
            const matchesCategory = selectedCategory === "all" ||
                item?.Category?.toLowerCase() === selectedCategory?.toLowerCase() ||
                item?.GemstoneID === categoryObj?.GemstoneID;
            return item?.GemstoneID && matchesName && matchesCategory;
        });
    }, [allgemstoneData, searchVal, selectedCategory, CategoryData]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredGemstoneData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredGemstoneData.length / itemsPerPage);
    const isCurrentItemsLoading = loading;
    const handleGemstoneClick = (card) => {
        const slug = card?.HeadingDescription.toLowerCase().replace(/\s+/g, "-");
        router.push(`/gemstone/${slug}`);
    };
    const handleBuyNow = (card) => {
        const slug = card?.HeadingDescription.toLowerCase().replace(/\s+/g, "-");
        // Store product data in sessionStorage for address page
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('selectedGemstone', JSON.stringify(card));
        }
        router.push(`/gemstone/${slug}`);
    };
    const handleDetails = (card) => {
        const slug = card?.HeadingDescription.toLowerCase().replace(/\s+/g, "-");
        router.push(`/gemstone/${slug}`);
    };
    return (<>
      <SEO title="Buy Astrological Gemstones Online – Certified Stones" description="Shop certified astrological gemstones on AstroCall Live. Get gemstone recommendations from expert astrologers based on your birth chart for luck, health, and success." canonical="https://astrocall.live/gemstone" type="Product" schema={{
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "name": "AstroCall",
                    "url": "https://astrocall.live/",
                    "logo": "https://astrocall.live/assets/logo.png"
                },
                {
                    "@type": "WebSite",
                    "url": "https://astrocall.live/",
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
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://astrocall.live/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Gemstone",
                            "item": "https://astrocall.live/gemstone"
                        }
                    ]
                },
                {
                    "@type": "Product",
                    "name": "Astrological Gemstones",
                    "brand": {
                        "@type": "Brand",
                        "name": "AstroCall"
                    },
                    "offers": {
                        "@type": "Offer",
                        "availability": "https://schema.org/InStock"
                    }
                }
            ]
        }}/>
      <Header />
      <div>

        <div className="bg-[#F973160D] pt-20 lg:pt-24">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 main-container rounded-lg sm:rounded-xl text-white text-center py-8 sm:py-10 md:py-12 px-3 sm:px-4 mt-4 sm:mt-6 shadow-lg">
            {/* Icon and Title */}
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 px-2">
              <div className="text-xl sm:text-2xl mt-1">
                <FaGem />
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                Buy Gemstones Online – Astrology Gemstones for Your Zodiac
              </h1>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-[550] mt-2 px-2">
              Gemstone Recommendations for Zodiac Signs
            </h2>
            {/* Description */}
            <h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-xl mx-auto opacity-90 px-2">
                Discover the mystical power of gemstones and their connection to
                your zodiac sign. Each gemstone carries unique energies that can
                enhance specific aspects of your life.
              </p>
            </h3>

            {/* Underline */}
            <div className="w-10 sm:w-12 h-[2px] bg-white mx-auto mt-4 sm:mt-5 rounded-full"></div>
          </div>

          <div className="bg-[#F973160D]  main-container p-3 sm:p-4 md:p-5 rounded-lg mt-4 sm:mt-5 shadow-md">
            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Box */}
              <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-sm sm:text-base"/>
                <input type="text" className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search Gemstone" value={searchVal} onChange={handleSearchChange}/>
              </div>

              {/* Category Filter */}
              <div className="w-full max-w-xs">
                <SimpleSelect onChange={handleFilterChange} value={selectedCategory} options={CategoryData?.map((item) => ({ value: item?.Category, label: item?.Category })) || []} placeholder="Select Category"/>
              </div>
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="main-container px-3 sm:px-4">
            <div className="w-full flex items-center justify-start text-primaryColor gap-2 sm:gap-3 mt-4 sm:mt-6 mb-4 sm:mb-6">
              <div className="text-xl sm:text-2xl mt-1">
                <FaGem />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                Astrological Gemstones
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 py-4 sm:py-6 md:py-8 relative">
              {isCurrentItemsLoading ? (<div className="col-span-full">
                  <div className="flex justify-center items-center py-10">
                    <LoadingIndicator size="medium" color="#f97316"/>
                    <p className="ml-3 text-gray-600">Finding best gemstones for you...</p>
                  </div>
                </div>) : currentItems?.length > 0 ? (currentItems?.map((card, index) => (<div key={card?.GemstoneID} onClick={() => handleGemstoneClick(card)} className="relative cursor-pointer bg-[#fff8f3] border border-orange-100 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow p-3 sm:p-4 md:p-5 w-full text-[#1a1a1a] font-sans">
                      <div className="relative overflow-hidden rounded-lg">
                        <img src={card?.Image1
                ? `https://${card?.Image1.replace(/\\/g, "/")}`
                : "default-image-url.jpg"} alt="gemstone" className="w-full h-[150px] sm:h-[170px] md:h-[180px] object-cover rounded-lg hover:scale-105 duration-300 transition-transform" width="600" height="400" loading={index === 0 ? "eager" : "lazy"} fetchpriority={index === 0 ? "high" : undefined} decoding="async" onError={(e) => {
                e.target.src = "default-image-url.jpg";
            }}/>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-orange-500 mt-3 sm:mt-4 line-clamp-1">
                        {card?.HeadingDescription || "Amethyst"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-snug line-clamp-2 mt-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card?.ShortDescription || "") }}/>
                      <div className="flex items-center text-xs sm:text-sm mt-2">
                        <div className="text-primaryColor flex gap-0.5 sm:gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                const rating = card?.StarCount || 0;
                if (i + 1 <= Math.floor(rating))
                    return <FaStar key={i} className="text-sm sm:text-base"/>;
                else if (i < rating)
                    return <FaStarHalf key={i} className="text-sm sm:text-base"/>;
                return null;
            })}
                        </div>
                        <span className="text-gray-500 text-xs ml-1 sm:ml-2">
                          ({card?.TotalReview || 0} reviews)
                        </span>
                      </div>

                      <div className="mt-2">
                        <span className="text-primaryColor font-bold text-lg sm:text-xl">
                          ₹{card?.CurrentPrice || 0}
                        </span>
                        {card?.CurrentPrice !== card?.originalPrice && card?.originalPrice && (<span className="text-gray-400 line-through text-xs sm:text-sm ml-2">
                            ₹{card?.originalPrice}
                          </span>)}
                      </div>

                      {/* Tags */}
                      <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-xs text-primaryColor font-medium flex-wrap">
                        <span className="bg-orange-50 px-2 py-0.5 rounded-full">
                          Protection
                        </span>
                        <span className="bg-orange-50 px-2 py-0.5 rounded-full">
                          Clarity
                        </span>
                        <span className="bg-orange-50 px-2 py-0.5 rounded-full">
                          Peace
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-5">
                        <button onClick={(e) => {
                e.stopPropagation();
                handleBuyNow(card);
            }} className="flex-1 flex items-center justify-center gap-1 text-white bg-primaryColor hover:bg-orange-600 text-xs sm:text-sm px-3 py-2 sm:py-1.5 rounded-lg font-semibold transition-colors">
                          <FaCartShopping className="text-xs sm:text-sm"/>
                          Buy now
                        </button>

                        <button onClick={(e) => {
                e.stopPropagation();
                handleDetails(card);
            }} className="flex-1 flex items-center justify-center gap-1 text-primaryColor border border-primaryColor hover:bg-orange-100 text-xs sm:text-sm px-3 py-2 sm:py-1.5 rounded-lg font-semibold transition-colors">
                          <FaInfoCircle className="text-xs sm:text-sm"/>
                          Details
                        </button>
                      </div>
                    </div>))) : (<div className="col-span-full flex flex-col justify-center items-center py-10 sm:py-16 text-center">
                  <div className="text-gray-400 mb-4">
                    <FaGem className="text-5xl sm:text-6xl mx-auto"/>
                  </div>
                  <div className="text-base sm:text-lg md:text-xl text-gray-500">
                    {searchVal
                ? <>
                        <p className="font-medium mb-2">No astrological gemstones found for "{searchVal}"</p>
                        <p className="text-sm text-gray-400">Try searching with different keywords</p>
                      </>
                : selectedCategory !== "all" && selectedCategory
                    ? <>
                          <p className="font-medium mb-2">No gemstones found in "{selectedCategory}" category</p>
                          <p className="text-sm text-gray-400">Try selecting a different category</p>
                        </>
                    : <>
                          <p className="font-medium mb-2">No astrological gemstones found</p>
                          <p className="text-sm text-gray-400">Please check back later</p>
                        </>}
                  </div>
                </div>)}
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
      </div>

      {Gemstonereviewstatus && (<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button onClick={() => {
                setGemstonereviewstatus(false);
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem("GemstoneOrder");
                }
            }} className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-red-500 text-xl sm:text-2xl font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition" aria-label="Close">
              &times;
            </button>

            <div className="p-4 sm:p-6">
              {/* Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-2">
                Review Your Gemstone
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
                Let us know what you think about your recent purchase.
              </p>

              {/* Gemstone Image and Name */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                {reviewsdata?.map((item, index) => (<React.Fragment key={item?.GemstoneID || index}>
                    <img src={item?.Image1
                    ? `https://${item?.Image1.replace(/\\/g, "/")}`
                    : "default-image-url.jpg"} alt="Gemstone" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-orange-200 flex-shrink-0" width="64" height="64" loading="lazy" decoding="async" onError={(e) => {
                    e.target.src = "default-image-url.jpg";
                }}/>
                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 line-clamp-2">
                      {item?.HeadingDescription}
                    </h3>
                  </React.Fragment>))}
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setRating(star)} className={`text-4xl sm:text-5xl md:text-6xl transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`} aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}>
                    ★
                  </button>))}
              </div>

              {/* Review Textarea */}
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts about the gemstone..." className="w-full border border-gray-300 rounded-lg p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 sm:mb-6 resize-none" rows="4"/>

              {/* Submit Button */}
              <button onClick={() => {
                Insert_GemstoneOrder_reviews();
                setGemstonereviewstatus(false);
            }} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg">
                Submit Review
              </button>
            </div>
          </div>
        </div>)}


      <LazyInView fallback={<div className="min-h-10"/>} rootMargin="220px 0px">
        <Suspense fallback={<div className="flex justify-center items-center min-h-[160px]">
              Loading...
            </div>}>
          <Footer />
        </Suspense>
      </LazyInView>
    </>);
};
export default Gemstone;
