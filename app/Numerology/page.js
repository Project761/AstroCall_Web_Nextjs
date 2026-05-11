"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";

import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const Numerology = () => {
    const { isMenuOpen } = useContext(MenuContext);

    const [numerologyData, setNumerologyData] = useState(undefined);

    useEffect(() => {
        getNumerologyData();
    }, []);

    const getNumerologyData = async () => {
        const payload = {
            IsActive: "1",
            Category: "Numerology",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter((data) => data?.Category);
                setNumerologyData(filteredData);
            } else {
                setNumerologyData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setNumerologyData([]);
        }
    };

    return (
        <>
            <SEO
                title="Numerology Services - Life Path, Name & Compatibility"
                description="Get personalised numerology services on AstroCall. Discover your life path number, name numerology and relationship compatibility with guidance from expert numerologists."
                canonical="https://astrocall.live/numerology-services"
                type="service"
            />

            <div className="bg-[#F973160D]">
                <div className="main-container text-left py-5 ">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4 mt-18">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold">
                                    Numerology Services | Life Path, Name & Compatibility
                                    Analysis
                                </h1>
                            </div>

                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Unlock your life's purpose with our professional Numerology
                                services. We provide a detailed analysis of your Life Path,
                                Expression, and Soul Urge numbers for clarity and guidance.
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
                        <div>
                            {numerologyData === undefined ? (
                                <div className="flex justify-center">
                                    <OrbitProgress color="#6b716b" size="medium" />
                                </div>
                            ) : numerologyData.length === 0 ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <p className="text-center text-gray-600 text-lg font-medium">
                                        No data available
                                    </p>
                                </div>
                            ) : (
                                numerologyData.map((item, index) => (
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
            </div>
        </>
    );
};

export default Numerology;