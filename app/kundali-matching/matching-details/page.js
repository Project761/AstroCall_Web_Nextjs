"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GiScrollUnfurled } from "react-icons/gi";
import { TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import SEO from "@/app/components/SEO/page.js";
// Custom Loading Indicator Component
const LoadingIndicator = ({ size = "medium" }) => {
    return (<div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>);
};
const KundliMatchingDetailsContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const BidGET = typeof window !== 'undefined' ? localStorage.getItem("Bid") || '' : '';
    const GidGET = typeof window !== 'undefined' ? localStorage.getItem("Gid") || '' : '';
    // Get Bid and Gid from URL params or localStorage
    const Bid = searchParams.get('Bid') || BidGET;
    const Gid = searchParams.get('Gid') || GidGET;
    const [apiResponse, setapiResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [MaleData, setMaleData] = useState();
    const [FemaleData, setFemaleData] = useState();
    const handleclickTalk = () => { router.push('/talk-to-astrologers'); };
    const handleclickChat = () => { router.push('/chat-to-astrologers'); };
    useEffect(() => {
        if (Bid && Gid) {
            Get_Data_Kundli_Partners();
        }
    }, [Bid, Gid]);
    useEffect(() => {
        if (UserLoginId) {
            // GetData_ActivityLog("Kundli Matching Result", `Viewing Kundli Matching Details`);
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
                const filteredMaleData = raw?.filter(item => item?.Id == Bid);
                const filteredFeMaleData = raw?.filter(item => item?.Id == Gid);
                Get_Ashtakoot_Milan(filteredMaleData[0], filteredFeMaleData[0]);
                if (filteredMaleData.length > 0) {
                    setMaleData(filteredMaleData[0]);
                }
                if (filteredFeMaleData.length > 0) {
                    setFemaleData(filteredFeMaleData[0]);
                }
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const Get_Ashtakoot_Milan = async (MaleData, FemaleData) => {
        setLoading(true);
        const val = {
            "p1_Date": `${MaleData?.Year}-${String(MaleData?.Month).padStart(2, "0")}-${String(MaleData?.Day).padStart(2, "0")}T${String(MaleData?.Hours).padStart(2, "0")}:${String(MaleData?.Minute).padStart(2, "0")}:${String(MaleData?.Second).padStart(2, "0")}`,
            "p1_full_name": MaleData?.Name,
            "p1_year": MaleData?.Year,
            "p1_month": MaleData?.Month,
            "p1_day": MaleData?.Day,
            "p1_gender": MaleData?.Gender,
            "p1_place": MaleData?.PlaceOfBirth,
            "p1_lat": MaleData?.Latitude,
            "p1_lon": MaleData?.Longitude,
            "p1_tzone": "5.5",
            "p1_sec": MaleData?.Second,
            "p1_min": MaleData?.Minute,
            "p1_hour": MaleData?.Hours,
            "p2_Date": `${FemaleData?.Year}-${String(FemaleData?.Month).padStart(2, "0")}-${String(FemaleData?.Day).padStart(2, "0")}T${String(FemaleData?.Hours).padStart(2, "0")}:${String(FemaleData?.Minute).padStart(2, "0")}:${String(FemaleData?.Second).padStart(2, "0")}`,
            "p2_full_name": FemaleData?.Name,
            "p2_year": FemaleData?.Year,
            "p2_month": FemaleData?.Month,
            "p2_day": FemaleData?.Day,
            "p2_gender": FemaleData?.Gender,
            "p2_place": FemaleData?.PlaceOfBirth,
            "p2_lat": FemaleData?.Latitude,
            "p2_lon": FemaleData?.Longitude,
            "p2_tzone": "5.5",
            "p2_sec": FemaleData?.Second,
            "p2_min": FemaleData?.Minute,
            "p2_hour": FemaleData?.Hours,
            "lan": "en"
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/ashtakoot_milan", val);
            const parsed = JSON.parse(res.data);
            const raw = parsed?.data;
            if (raw) {
                setLoading(false);
                setapiResponse(raw);
            }
        }
        catch (error) {
            console.error("Error fetching Kundli Matching details:", error);
            setLoading(false);
        }
    };
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

      <div className="bg-orange-50">
        <div className="main-container text-left py-3 sm:py-4 md:py-5 mt-16 px-3 sm:px-4">
          <div className="bg-orange-500 rounded-md w-full text-white text-center py-6 sm:py-8 md:py-10 px-3 sm:px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <GiScrollUnfurled className="text-white text-2xl sm:text-3xl"/>
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold">Kundli Matching</h1>
              </div>
              <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed px-2">
                Kundli Matching helps evaluate the compatibility between two individuals based on their birth charts. It plays a vital role in ensuring a harmonious and prosperous married life in Vedic astrology.
              </p>
              <div className="w-8 h-[2px] bg-white mt-3 sm:mt-4"></div>
            </div>
          </div>
        </div>

        <div className="p-1 py-0 bg-orange-50">
          <div className="mx-auto main-container p-3 sm:p-4 md:p-6">
            <>
              <div className="py-6 sm:py-8 md:py-10">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-center justify-center text-center">
                  <div className="border-2 border-[#f60] p-2 sm:p-3 rounded-xl w-full sm:w-auto">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold break-words">{MaleData?.Name}</h3>
                  </div>
                  <div className="flex-shrink-0">
                    <img src="https://aws.astrotalk.com/assets/images/rings.webp" height="50" width="50" className="sm:h-[60px] sm:w-[60px] md:h-[70px] md:w-[70px]" alt="match making engagement ring"/>
                  </div>
                  <div className="border-2 border-[#f60] p-2 sm:p-3 rounded-xl w-full sm:w-auto">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold break-words">{FemaleData?.Name}</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="w-full max-w-[500px] mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
                  <div className="bg-primaryColor flex items-center justify-between p-3 sm:p-4 rounded-t-lg">
                    <h2 className="text-base sm:text-lg font-bold text-white">Basic Details</h2>
                    <span className="px-2 py-1 text-xs sm:text-sm font-semibold text-white bg-gray-800 rounded-full">
                      {MaleData?.Gender}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Name</span>
                      <span className="text-gray-800 text-xs sm:text-sm break-words">{MaleData?.Name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Birth Date & Time</span>
                      <span className="text-gray-800 text-xs sm:text-sm break-words">
                        {MaleData?.Year && MaleData?.Month && MaleData?.Day
            ? `${MaleData?.Day}-${MaleData?.Month}-${MaleData?.Year} ${MaleData?.Hours}:${MaleData?.Minute}:${MaleData?.Second}`
            : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Birth Place</span>
                      <span className="text-gray-800 text-xs sm:text-sm break-words">{MaleData?.PlaceOfBirth}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Longitude</span>
                      <span className="text-gray-800 text-xs sm:text-sm">
                        {MaleData?.Longitude ? Number(MaleData?.Longitude).toFixed(6) : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Latitude</span>
                      <span className="text-gray-800 text-xs sm:text-sm">
                        {MaleData?.Latitude ? Number(MaleData?.Latitude).toFixed(6) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-[500px] mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
                  <div className="bg-primaryColor flex items-center justify-between p-3 sm:p-4 rounded-t-lg">
                    <h2 className="text-base sm:text-lg font-bold text-white">Basic Details</h2>
                    <span className="px-2 py-1 text-xs sm:text-sm font-semibold text-white bg-gray-800 rounded-full">
                      {FemaleData?.Gender}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Name</span>
                      <span className="text-gray-800 text-xs sm:text-sm break-words">{FemaleData?.Name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Birth Date & Time</span>
                      <span className="text-gray-800 text-xs sm:text-sm break-words">
                        {FemaleData?.Year && FemaleData?.Month && FemaleData?.Day
            ? `${FemaleData?.Day}-${FemaleData?.Month}-${FemaleData?.Year} ${FemaleData?.Hours}:${FemaleData?.Minute}:${FemaleData?.Second}`
            : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Birth Place</span>
                      <span className="text-gray-800 text-xs sm:text-sm break-words">{FemaleData?.PlaceOfBirth}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Longitude</span>
                      <span className="text-gray-800 text-xs sm:text-sm">
                        {FemaleData?.Longitude ? Number(FemaleData?.Longitude).toFixed(6) : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b gap-1 sm:gap-0">
                      <span className="font-medium text-gray-600 text-xs sm:text-sm">Latitude</span>
                      <span className="text-gray-800 text-xs sm:text-sm">
                        {FemaleData?.Latitude ? Number(FemaleData?.Latitude).toFixed(6) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>

            {loading ? (<div className="flex justify-center items-center py-8 sm:py-10">
                <LoadingIndicator size="medium"/>
              </div>) : (<div className="p-3 sm:p-4 md:p-6 main-container space-y-6 sm:space-y-8">
                {apiResponse?.ashtakoot_milan && (<div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 px-2">Ashtakoot Milan</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg text-xs sm:text-sm md:text-base">
                        <thead>
                          <tr className="bg-gray-200 text-gray-700">
                            <th className="p-2 border whitespace-nowrap">Koota</th>
                            <th className="p-2 border whitespace-nowrap">Male</th>
                            <th className="p-2 border whitespace-nowrap">Female</th>
                            <th className="p-2 border whitespace-nowrap">Points</th>
                            <th className="p-2 border whitespace-nowrap">Max Points</th>
                            <th className="p-2 border whitespace-nowrap">Area of Life</th>
                            <th className="p-2 border whitespace-nowrap">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(apiResponse.ashtakoot_milan).map(([key, value]) => (<tr key={key} className="text-center border-t hover:bg-gray-100">
                              <td className="p-2 border capitalize whitespace-nowrap">{key.replace("_", " ")}</td>
                              <td className="p-2 border">{value.p1}</td>
                              <td className="p-2 border">{value.p2}</td>
                              <td className="p-2 border font-semibold">{value.points_obtained}</td>
                              <td className="p-2 border">{value.max_ponits}</td>
                              <td className="p-2 border">{value.area_of_life}</td>
                              <td className="p-2 border text-left">{value.description}</td>
                            </tr>))}
                        </tbody>
                      </table>
                    </div>
                  </div>)}

                {apiResponse?.ashtakoot_milan_result && (<div className="bg-orange-100 border border-green-300 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2 mb-3 sm:mb-4">
                      Match Result
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
                      {/* Score Card */}
                      <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                        <span className="text-xs sm:text-sm text-gray-500">Ashtakoot</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-green-600">
                          {apiResponse.ashtakoot_milan_result.points_obtained} /{" "}
                          {apiResponse.ashtakoot_milan_result.max_ponits}
                        </span>
                      </div>

                      {/* Compatibility */}
                      <div className="flex flex-col items-center justify-center bg-white shadow-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                        <span className="text-xs sm:text-sm text-gray-500">Compatibility</span>
                        <span className={`mt-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full ${apiResponse.ashtakoot_milan_result.is_compatible === "true"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"}`}>
                          {apiResponse.ashtakoot_milan_result.is_compatible === "true"
                    ? "Compatible "
                    : "Not Compatible"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4">
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {apiResponse.ashtakoot_milan_result.content}
                      </p>
                    </div>
                  </div>)}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition">
                    <div className="bg-orange-500 text-white p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">Manglik Dosha</h3>
                    </div>
                    <div className="p-4 sm:p-5 text-gray-700 space-y-2">
                      <p className="text-xs sm:text-sm"><b>Male:</b> {apiResponse?.manglik_dosha?.p1}</p>
                      <p className="text-xs sm:text-sm"><b>Female:</b> {apiResponse?.manglik_dosha?.p2}</p>
                      <p className="mt-2 font-medium text-red-600 text-xs sm:text-sm">Important check for marriage compatibility</p>
                    </div>
                  </div>

                  {/* Nadi Dosha */}
                  <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition">
                    <div className="bg-orange-500 text-white p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-bold flex items-center gap-2"> Nadi Dosha</h3>
                    </div>
                    <div className="p-4 sm:p-5 text-gray-700 space-y-2">
                      <p className={`font-semibold text-xs sm:text-sm ${apiResponse?.nadi_dosha === "true" ? "text-yellow-700" : "text-green-700"}`}>
                        {apiResponse?.nadi_dosha === "true"
                ? "Nadi Dosha Present"
                : "No Nadi Dosha"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">This affects health & progeny in marital life.</p>
                    </div>
                  </div>

                  {/* Bhakoot Dosha */}
                  <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition">
                    <div className="bg-orange-500 text-white p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">Bhakoot Dosha</h3>
                    </div>
                    <div className="p-4 sm:p-5 text-gray-700 space-y-2">
                      <p className={`font-semibold text-xs sm:text-sm ${apiResponse?.bhakoot_dosha === "true" ? "text-indigo-700" : "text-green-700"}`}>
                        {apiResponse?.bhakoot_dosha === "true"
                ? "Bhakoot Dosha Present"
                : " No Bhakoot Dosha"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">This impacts emotional bonding & relationship harmony.</p>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </>);
};

export default function KundliMatchingDetails() {
    return (<Suspense fallback={<div className="main-container py-10 flex justify-center"><LoadingIndicator /></div>}>
      <KundliMatchingDetailsContent />
    </Suspense>);
}
