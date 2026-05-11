"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";

import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const BreakupAndDivorce = () => {
    const { isMenuOpen } = useContext(MenuContext);
    const [breakupData, setBreakupData] = useState(undefined);

    useEffect(() => {
        getBreakupData();
    }, []);

    const getBreakupData = async () => {
        const payload = {
            IsActive: "1",
            Category: "Break-ups & Divorce",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter((data) => data?.Category);
                setBreakupData(filteredData);
            } else {
                setBreakupData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setBreakupData([]);
        }
    };

    return (
        <>
            <SEO
                title="Breakup & Divorce Astrology – Remedies & Guidance"
                description="Dealing with a breakup or divorce? Get astrology-based solutions and remedies for heartbreak, separation, and divorce from experienced astrologers at AstroCall Live."
                keywords="breakup astrology, divorce astrology, relationship healing, separation astrology, marriage problems, relationship counseling astrology"
                canonical="https://astrocall.live/astrology-for-breakups-and-divorce"
            />

            <div className="bg-[#F973160D]">
                <div className="main-container text-left py-5">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4 mt-18">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold">
                                    Astrology for Break-ups & Divorce | Healing & Guidance
                                </h1>
                            </div>

                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Find a path to healing and self-discovery with our astrology for
                                break-ups & divorce service. Gain insight into the cosmic
                                lessons of your relationship and find the clarity to move
                                forward.
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
                        {breakupData === undefined ? (
                            <div className="flex justify-center">
                                <OrbitProgress color="#6b716b" size="medium" />
                            </div>
                        ) : breakupData.length === 0 ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <p className="text-center text-gray-600 text-lg font-medium">
                                    No data available
                                </p>
                            </div>
                        ) : (
                            breakupData.map((item, index) => (
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

export default BreakupAndDivorce;