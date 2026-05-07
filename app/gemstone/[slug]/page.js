"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { getPostData } from "../../utils/api.js";
import { useRouter, useParams } from 'next/navigation';
import { useMenuContext } from "../../hooks/useMenuContext";
import { FaStar, FaCheck, FaStarHalf } from "react-icons/fa6";
import Footer from "../../components/Footer/page.js";
import Header from "../../components/Header/page.js";
import DOMPurify from 'dompurify';
import { FaGem } from "react-icons/fa";
import SEO from "../../components/SEO/page.js";
import axios from "axios";
// Simple Loading Indicator component (replacement for OrbitProgress)
const LoadingIndicator = ({ color = "#6b716b", size = "medium" }) => {
    const sizeClass = size === "small" ? "w-8 h-8" : size === "large" ? "w-16 h-16" : "w-12 h-12";
    return (<div className="flex justify-center items-center">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-${color} rounded-full animate-spin`} style={{ borderTopColor: color }}></div>
    </div>);
};
const GemstoneDetails = () => {
    const router = useRouter();
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const { isModalOpen, setIsModalOpen, GetData_ActivityLog } = useMenuContext();
    const [gemstoneData, setGemstoneData] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [certificateCost, setCertificateCost] = useState(0);
    const { slug } = useParams();
    useEffect(() => {
        if (slug) {
            GetsinglaData_Gemstone();
        }
    }, [slug]);
    useEffect(() => {
        if (UserLoginId && GetData_ActivityLog) {
            GetData_ActivityLog("Gemstone Detail", `looking at ${slug} (Gemstone) Detail`);
        }
    }, [UserLoginId, GetData_ActivityLog, slug]);
    const GetsinglaData_Gemstone = async () => {
        const val = {
            'GemstoneID': '0',
            'HeadingDescription': (typeof slug === 'string' ? slug : slug?.[0])?.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim(),
        };
        try {
            const urlSet = typeof window !== 'undefined' ? window.location.origin : '';
            const res = await axios.post(urlSet === 'https://astrocall.live'
                ? `https://api.astrocall.live/api/Gemstone/GetsinglaData_Gemstone`
                : `https://liveapi.astrocall.live/api/Gemstone/GetsinglaData_Gemstone`, val);
            const { data } = res;
            const parseData = JSON.parse(data?.data);
            const Resdata = parseData?.Table;
            if (Resdata) {
                setGemstoneData(Resdata);
                setLoading(false);
            }
        }
        catch (error) {
            if (error?.response?.status == 400 && error?.response?.data?.Message === "No Data Available") {
                const res = await getPostData("Gemstone/GetData_Gemstone", { "IsActive": "1" });
                if (res) {
                    const filteredgemstone = res?.find((item) => item?.HeadingDescription);
                    setGemstoneData(filteredgemstone ? [filteredgemstone] : []);
                    setLoading(false);
                }
            }
        }
    };
    const selectedGemstone = gemstoneData.find(item => item.HeadingDescription) || {};
    const filteredData = useMemo(() => gemstoneData.filter(item => item?.HeadingDescription), [gemstoneData, slug]);
    const seoData = useMemo(() => {
        const gemstoneName = selectedGemstone?.HeadingDescription?.trim() || "Gemstone";
        const cleanDescription = (selectedGemstone?.ShortDescription || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const slugValue = slug || gemstoneName.toLowerCase().replace(/\s+/g, "-");
        const canonicalUrl = `https://astrocall.live/gemstone/${slugValue}`;
        return {
            title: `${gemstoneName} | AstroCall Gemstone`,
            description: cleanDescription || `Get complete details, benefits, pricing and authenticity information for ${gemstoneName} on AstroCall.`,
            canonical: canonicalUrl,
            keywords: `${gemstoneName}, ${gemstoneName} benefits, buy ${gemstoneName} online, astrocall gemstones`,
        };
    }, [selectedGemstone, slug]);
    useEffect(() => {
        if (selectedGemstone?.Image1)
            setMainImage(selectedGemstone?.Image1);
    }, [selectedGemstone]);
    const finalPrice = (selectedGemstone?.CurrentPrice || 0) + certificateCost;
    const handleBuyNow = (item) => {
        if (UserLoginId) {
            // Store product data in sessionStorage for address page
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('selectedGemstone', JSON.stringify(item));
            }
            router.push("/checkout/address");
        }
        else {
            setIsModalOpen(true);
        }
    };
    return (<>
            <SEO title={seoData.title} description={seoData.description} canonical={seoData.canonical} type="website" schema={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: seoData.title,
            description: seoData.description,
            url: seoData.canonical
        }}/>
            {/* <Header /> */}
            <div>
                <div className="bg-[#F973160D] py-8 sm:py-12 md:py-16 lg:py-20 relative">
                    <div className="absolute bottom-[0] left-[30%] right-image">
                        {/* <img className="" src={gemstone_1} alt="" /> */}
                    </div>
                    <div className="main-container px-3 sm:px-4">
                        <div className="bg-primaryColor text-white text-center py-6 sm:py-8 md:py-10 rounded-lg sm:rounded-xl shadow-sm">
                            {/* Icon and Title */}
                            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 px-2">
                                <div className="text-xl sm:text-2xl mt-1">
                                    <FaGem />
                                </div>
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                                    Astrological Gemstones
                                </h2>
                            </div>

                            {/* Description */}
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-xl mx-auto opacity-90 px-2">
                                Discover the mystical power of gemstones and their connection to
                                your zodiac sign. Each gemstone carries unique energies that can
                                enhance specific aspects of your life.
                            </p>

                            {/* Underline */}
                            <div className="w-10 sm:w-12 h-[2px] bg-white mx-auto mt-4 sm:mt-5 rounded-full"></div>
                        </div>
                    </div>
                    {loading ? (<div className="flex justify-center py-20">
                            <LoadingIndicator color="#6b716b" size="medium"/>
                        </div>) : (<div className="py-6 sm:py-8 md:py-10 bg-[#fffaf5]">
                            {gemstoneData?.map((item) => {
                return (<div className="main-container px-3 sm:px-4" key={item.GemstoneID}>
                                            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12">
                                                {/* Image Section */}
                                                <div className="w-full md:w-[45%]">
                                                    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg sm:rounded-xl overflow-hidden shadow-md">
                                                        <img src={mainImage ? `https://${mainImage.replace(/\\/g, "/")}` : "default-image-url.jpg"} alt="Gemstone" className="w-full h-full object-cover" width="800" height="600" loading="lazy" fetchPriority="low" decoding="async" onError={(e) => {
                        e.target.src = "default-image-url.jpg";
                    }}/>
                                                    </div>

                                                    <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center overflow-x-auto pb-2 scrollbar-hide">
                                                        {["Image1", "Image2", "Image3", "Image4", "Image5"].map((imgKey, idx) => item[imgKey] && (<img key={idx} src={`https://${item[imgKey]?.replace(/\\/g, "/")}`} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-all flex-shrink-0" onClick={() => setMainImage(item[imgKey])} alt={`Thumbnail ${idx + 1}`} width="128" height="128" loading="lazy" decoding="async"/>))}
                                                    </div>
                                                </div>

                                                {/* Details Section */}
                                                <div className="w-full md:w-[50%]">
                                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-orange-500 mb-2 line-clamp-2">
                                                        {item?.HeadingDescription}
                                                    </h1>
                                                    <p className="mt-3 sm:mt-4 text-gray-700 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.ShortDescription || "") }}/>

                                                    <div className="mt-4 flex flex-wrap mb-3 items-center gap-2 sm:gap-4">
                                                        <span className="text-2xl sm:text-3xl font-bold text-red-600">₹{finalPrice || 0}</span>
                                                        {item?.CurrentPrice !== item?.originalPrice && item?.originalPrice && (<span className="text-gray-400 line-through text-base sm:text-lg">
                                                                ₹{item.originalPrice}
                                                            </span>)}
                                                    </div>
                                                    <div className="flex items-center flex-wrap mt-1 gap-1 text-yellow-400">
                                                        {Array.from({ length: 5 }).map((_, i) => {
                        const rating = item?.StarCount || 0;
                        if (i + 1 <= Math.floor(rating))
                            return <FaStar key={i} className="text-sm sm:text-base"/>;
                        else if (i < rating)
                            return <FaStarHalf key={i} className="text-sm sm:text-base"/>;
                        return null;
                    })}
                                                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">
                                                            {item?.TotalReview || 0} Customer Reviews
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-xs sm:text-sm text-gray-700">Availability: In stock</p>

                                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6">
                                                        {UserLoginId ? (<button type="button" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition font-semibold text-sm sm:text-base shadow-md hover:shadow-lg" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBuyNow(item);
                        }}>
                                                                Buy now
                                                            </button>) : (<button type="button" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition font-semibold text-sm sm:text-base shadow-md hover:shadow-lg" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}>
                                                                Buy now
                                                            </button>)}
                                                    </div>

                                                    <div className="mt-5 sm:mt-6 text-xs sm:text-sm text-gray-800 space-y-2">
                                                        <p className="flex items-center gap-2">
                                                            <FaCheck className="text-orange-500 flex-shrink-0"/>
                                                            <span>Free Lab Certificate</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <FaCheck className="text-orange-500 flex-shrink-0"/>
                                                            <span>Free Shipping (orders over ₹4000)</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <FaCheck className="text-orange-500 flex-shrink-0"/>
                                                            <span>Authenticity Certificate</span>
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <FaCheck className="text-orange-500 flex-shrink-0"/>
                                                            <span>This image is for reference only</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Descriptions */}
                                            <div className="bg-orange-100 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md text-gray-700 italic max-w-5xl mx-auto mb-6 sm:mb-8 md:mb-10 mt-6 sm:mt-8">
                                                <p className="text-xs sm:text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(filteredData[0]?.DetailDescription || "") }}/>
                                            </div>

                                            {/* Benefits */}
                                            {filteredData[0]?.Benefits?.length > 0 && (<div className="bg-orange-100 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md text-gray-700 italic max-w-5xl mx-auto mb-6 sm:mb-8 md:mb-10">
                                                    <h2 className="text-xl sm:text-2xl font-semibold text-orange-500 mb-2 sm:mb-3">Benefits</h2>
                                                    <p className="text-xs sm:text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(filteredData[0]?.Benefits || "") }}/>
                                                </div>)}

                                            {/* Additional Sections */}
                                            {[
                        { key: "EstimateDelivery", label: "Estimated Delivery" },
                        { key: "Certification", label: "Certification" },
                        { key: "AuthenticateGemstone", label: "Authenticate Gemstone" },
                        { key: "FAQ", label: "FAQ" },
                    ].map(({ key, label }) => (filteredData[0]?.[key]?.length > 0 && (<div key={key} className="bg-orange-100 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md text-gray-700 italic max-w-5xl mx-auto mb-6 sm:mb-8 md:mb-10">
                                                        <h2 className="text-lg sm:text-xl font-semibold text-orange-500 mb-2 sm:mb-3">{label}</h2>
                                                        <p className="text-xs sm:text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(filteredData[0]?.[key]) }}/>
                                                    </div>)))}
                                        </div>);
            })}
                        </div>)}
                </div>
            </div>
            <Footer />
        </>);
};
export default GemstoneDetails;
