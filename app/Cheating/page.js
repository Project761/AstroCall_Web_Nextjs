"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";

import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const Cheating = () => {
    const { isMenuOpen } = useContext(MenuContext);
    const [cheatingData, setCheatingData] = useState(undefined);

    useEffect(() => {
        getCheatingData();
    }, []);

    const getCheatingData = async () => {
        const payload = {
            IsActive: "1",
            Category: "Cheating & Affairs",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter((data) => data?.Category);
                setCheatingData(filteredData);
            } else {
                setCheatingData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setCheatingData([]);
        }
    };

    return (
        <>
            <SEO
                title="Cheating & Affairs Astrology – Truth & Insights"
                description="Are you suspicious of cheating or facing infidelity issues? Consult expert astrologers on AstroCall Live for astrological insights into affairs and relationship betrayal."
                keywords="cheating astrology, affairs astrology, infidelity astrology, relationship problems, trust issues astrology, marital problems"
                canonical="https://astrocall.live/astrology-for-cheating-and-affairs"
            />

            <div className="bg-[#F973160D]">
                <div className="main-container text-left py-5">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4 mt-18">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold">
                                    Astrology for Cheating & Affairs | Understanding Infidelity
                                </h1>
                            </div>

                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Gain insight into the astrological factors behind infidelity
                                with our astrology for cheating & affairs service. Our expert
                                astrologers provide a compassionate and confidential reading to
                                help you understand and heal.
                            </p>

                            <div className="w-8 h-[2px] bg-white mt-4" />
                        </div>
                    </div>
                </div>

                <div
                    className={`content ${isMenuOpen ? "blur" : ""
                        } flex justify-center`}
                >
                    <div className="mt-1 w-full">
                        {cheatingData === undefined ? (
                            <div className="flex justify-center">
                                <OrbitProgress color="#6b716b" size="medium" />
                            </div>
                        ) : cheatingData.length === 0 ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <p className="text-center text-gray-600 text-lg font-medium">
                                    No data available
                                </p>
                            </div>
                        ) : (
                            cheatingData.map((item, index) => (
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

export default Cheating;