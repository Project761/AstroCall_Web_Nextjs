"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GiPrayerBeads } from "react-icons/gi";
import DOMPurify from 'dompurify';
import { getPostData } from '../../utils/api.js';
import SEO from '@/app/components/SEO/page.js';
const OnlinePujaDetails = () => {
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const { slug } = useParams();
    const router = useRouter();
    const [selectedPuja, setSelectedPuja] = useState([]);
    useEffect(() => {
        if (slug && typeof slug === 'string') {
            GetsinglaData_Puja(slug);
        }
    }, [slug]);
    const GetsinglaData_Puja = async (pujaSlug) => {
        const val = {
            'PujaID': '0',
            'PujaName': pujaSlug?.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim(),
        };
        try {
            const res = await getPostData("Puja/GetsinglaData_Puja", val);
            if (res) {
                setSelectedPuja(res);
            }
        }
        catch (error) {
            if (error?.response?.status == 400 && error?.response?.data?.Message === "No Data Available") {
                const res = await getPostData("Puja/GetData_Puja", { "IsActive": "1" });
                if (res) {
                    const filteredPuja = res?.find((item) => item?.PujaName);
                    setSelectedPuja(filteredPuja ? [filteredPuja] : []);
                }
            }
        }
    };
    const seoData = useMemo(() => {
        const selectedPujaItem = selectedPuja.find((item) => item?.PujaName) || {};
        const pujaTitle = selectedPujaItem?.PujaName?.trim() || "Online Puja";
        const cleanDescription = (selectedPujaItem?.ShortDescription || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const slugValue = slug || pujaTitle.toLowerCase().replace(/\s+/g, "-");
        return {
            title: `${pujaTitle} | AstroCall Online Puja`,
            description: cleanDescription || `Book ${pujaTitle} online with trusted priests. Get complete rituals, benefits and booking details on AstroCall.`,
            canonical: `https://astrocall.live/online-puja/${slugValue}`,
            keywords: `${pujaTitle}, ${pujaTitle} online, online puja booking, astrocall puja`,
        };
    }, [selectedPuja, slug]);
    return (<>
        <SEO title={seoData.title} description={seoData.description} canonical="https://astrocall.live/online-puja" type="website" schema={{
            "@context": "https://schema.org",
            "@type": "Service",
            name: seoData.title,
            description: seoData.description,
            url: "https://astrocall.live/online-puja",
            provider: {
                "@type": "Organization",
                name: "AstroCall"
            }
        }} />

        <div className="bg-[#F973160D] pt-20 lg:pt-24">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 main-container rounded-lg sm:rounded-xl text-white text-center py-8 sm:py-10 md:py-12 px-3 sm:px-4 mt-4 sm:mt-6 shadow-lg">
                <div className="rounded-md sm:rounded-lg w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                            <GiPrayerBeads className="text-white text-2xl sm:text-3xl" />
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold px-2 text-white drop-shadow-lg">Online Puja Details</h1>
                        </div>
                        <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed px-2">
                            Book authentic online pujas performed by experienced priests. Get blessings from the comfort of your home with complete rituals and live streaming.
                        </p>
                        <div className="w-8 h-[2px] bg-white mt-3 sm:mt-4"></div>
                    </div>
                </div>
            </div>

            <div className="py-6 sm:py-8 md:py-10">
                <div className="main-container px-3 sm:px-4 flex flex-col gap-6 sm:gap-8 md:gap-10">
                    {selectedPuja ? (<>
                        {selectedPuja?.map((item) => {
                            return (<React.Fragment key={item?.PujaID}>
                                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 shadow-md">
                                    {/* Puja Image */}
                                    <img src={item?.PujaImage ? `https://${item.PujaImage.replace(/\\/g, "/")}` : '/default-image.jpg'} alt="Puja Image" className="w-full lg:w-[400px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-lg sm:rounded-xl flex-shrink-0" width="800" height="600" loading="eager" decoding="async" onError={(e) => {
                                        const target = e.target;
                                        target.src = "/default-image.jpg";
                                    }} />

                                    {/* Puja Content */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primaryColor mb-2 line-clamp-2">
                                                {item?.PujaName}
                                            </h2>
                                            <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 line-clamp-3">
                                                {item?.ShortDescription}
                                            </p>

                                            {/* Price */}
                                            <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                {item.CurrentAmt === item.Amt ? (<p className="text-[#1A2B4C] font-extrabold text-lg sm:text-xl md:text-2xl">
                                                    ₹ {item.Amt || 0}
                                                </p>) : (<>
                                                    <p className="line-through text-gray-500 text-sm sm:text-base">
                                                        ₹ {item.CurrentAmt || 0}
                                                    </p>
                                                    <p className="text-[#1A2B4C] font-extrabold text-lg sm:text-xl md:text-2xl">
                                                        ₹ {item.Amt || 0}
                                                    </p>
                                                </>)}
                                            </div>

                                            {/* Ratings */}
                                            <div className="flex gap-1 items-center mb-3 sm:mb-4">
                                                {Array.from({ length: item?.Rating || 0 }).map((_, index) => (<img key={index} src="/assets/images/star.webp" alt="Star" className="w-4 h-4 sm:w-5 sm:h-5" loading="lazy" decoding="async" />))}
                                            </div>

                                            {/* Book Now Button */}
                                            {UserLoginId?.length > 0 ? (<button type="button" className="bg-orange-500 text-white font-medium px-6 sm:px-8 md:px-16 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-orange-600 transition-all w-full lg:w-auto text-sm sm:text-base shadow-md hover:shadow-lg" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const slug = item?.PujaName
                                                    ?.toLowerCase()
                                                    .trim()
                                                    .replace(/\s+/g, "-")
                                                    .replace(/[^\w-]+/g, "");
                                                router.push(`/online-puja/${slug}/OnlinepujaPlansDetails`);
                                            }} style={{ touchAction: 'manipulation' }}>
                                                Book Now
                                            </button>) : (<button type="button" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }} className="bg-orange-500 text-white font-medium px-6 sm:px-8 md:px-16 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-orange-600 transition-all w-full lg:w-auto text-sm sm:text-base shadow-md hover:shadow-lg" style={{ touchAction: 'manipulation' }}>
                                                Book Now
                                            </button>)}
                                        </div>

                                        {/* Features */}
                                        <ul className="mt-4 sm:mt-6 space-y-2">
                                            {[
                                                { img: "pandit.svg", text: "Experienced Pandits" },
                                                { img: "solutions.svg", text: "20+ Years of Experience" },
                                                { img: "yearsof.svg", text: "Effective Solutions" },
                                                { img: "kalshs.svg", text: "Performed Thousands of Puja" },
                                            ].map((featureItem, index) => (<li key={index} className="flex items-center gap-2 sm:gap-3 bg-orange-50 p-2 sm:p-2.5 rounded-md text-xs sm:text-sm">
                                                <img src={`https://cdn.anytimeastro.com/anytimeastro/puja/prodimg/${featureItem.img}`} alt={featureItem.text} width="24" height="24" className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                                                <span>{featureItem.text}</span>
                                            </li>))}
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.PujaDescription || "") }} />
                                {item?.Benefits?.length > 0 && (<div className="bg-orange-100 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md text-gray-700 italic">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-orange-500 mb-2 sm:mb-3">
                                        Benefits
                                    </h2>
                                    <p className="text-xs sm:text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Benefits || "") }} />
                                </div>)}
                            </React.Fragment>);
                        })}
                    </>) : (<div className="text-center py-10 sm:py-16 text-gray-500 text-sm sm:text-base">
                        No data available
                    </div>)}
                </div>
            </div>
        </div>

    </>);
};
export default OnlinePujaDetails;
