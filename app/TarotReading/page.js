"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";

import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const TarotReading = () => {
    const { isMenuOpen } = useContext(MenuContext);

    const [tarotData, setTarotData] = useState(undefined);

    useEffect(() => {
        getTarotData();
    }, []);

    const getTarotData = async () => {
        const payload = {
            IsActive: "1",
            Category: "Tarot Reading",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter((data) => data?.Category);
                setTarotData(filteredData);
            } else {
                setTarotData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setTarotData([]);
        }
    };

    return (
        <>
            <SEO
                title="Tarot Reading Online – Accurate Tarot Predictions"
                description="Get a personalised tarot reading on AstroCall. Talk to expert tarot readers online for clarity on love, relationships, career, finances and important life choices."
                keywords="tarot reading, tarot cards, tarot reader, tarot reading online, tarot card reading, tarot predictions, tarot guidance"
                canonical="https://astrocall.live/tarot-reading-services"
                type="service"
            />

            <div className="bg-[#F973160D]">
                <div className="main-container text-left py-5 mt-16">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold">
                                    Tarot Reading Services | Get a Personalized Tarot Reading
                                </h1>
                            </div>

                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Unlock the guidance of the cards with our professional Tarot
                                Reading services. Our expert readers provide deep insights into
                                your past, present, and future for clarity and direction.
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
                        {tarotData === undefined ? (
                            <div className="flex justify-center">
                                <OrbitProgress color="#6b716b" size="medium" />
                            </div>
                        ) : tarotData.length === 0 ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <p className="text-center text-gray-600 text-lg font-medium">
                                    No data available
                                </p>
                            </div>
                        ) : (
                            tarotData.map((item, index) => (
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

export default TarotReading;