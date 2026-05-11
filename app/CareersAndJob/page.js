"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";

import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const CareersAndJob = () => {
    const { isMenuOpen } = useContext(MenuContext);

    const [careerData, setCareerData] = useState(undefined);

    useEffect(() => {
        getCareerData();
    }, []);

    const getCareerData = async () => {
        const payload = {
            IsActive: "1",
            Category: "Career & Jobs",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter((data) => data?.Category);
                setCareerData(filteredData);
            } else {
                setCareerData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setCareerData([]);
        }
    };

    return (
        <>
            <SEO
                title="Career Astrology Predictions & Job Guidance Online"
                description="Get expert career astrology guidance on AstroCall. Discover job opportunities, promotions, business growth, and remedies for long-term professional success."
                keywords="career astrology, job astrology, career guidance, career predictions, job opportunities, professional astrology, career counseling astrology"
                canonical="https://astrocall.live/career-and-jobs-astrology"
                type="service"
            />

            <div className="bg-[#F973160D]">
                <div className="main-container text-left py-5 mt-16">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold">
                                    Astrology for Career & Jobs | Professional Guidance &
                                    Predictions
                                </h1>
                            </div>

                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Unlock your professional potential with our astrology for career
                                services. Get personalized insights into your ideal job,
                                professional strengths, and auspicious periods for growth from
                                expert astrologers.
                            </p>

                            <div className="w-8 h-[2px] bg-white mt-4"></div>
                        </div>
                    </div>
                </div>

                <div
                    className={`content ${isMenuOpen ? "blur" : ""
                        } flex justify-center`}
                >
                    <div className="mt-1 w-full">
                        {careerData === undefined ? (
                            <div className="flex justify-center">
                                <OrbitProgress color="#6b716b" size="medium" />
                            </div>
                        ) : careerData.length === 0 ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <p className="text-center text-gray-600 text-lg font-medium">
                                    No data available
                                </p>
                            </div>
                        ) : (
                            careerData.map((item, index) => (
                                <div className="main-container" key={index}>
                                    <div className="text-center flex flex-col justify-center my-6">
                                        <h1 className="text-3xl font-semibold">
                                            {item?.Category}
                                        </h1>

                                        <div className="w-[20%] h-[3px] m-auto rounded-full bg-primaryColor mt-1" />
                                    </div>

                                    <div className="paragraph px-2 md:px-6">
                                        <div
                                            className="ml-5 text-justify leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    item?.PrivacyPolicyhtml || ""
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CareersAndJob;