"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";
import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

// import { MenuContext } from "@/app/menuContext/MenuContext";
// import { postWithToken } from "@/app/ApiMethods/ApiMethods";

// import Header from "@/app/components/header/Header";
// import Footer from "@/app/components/footer/Footer";
// import SEO from "@/app/components/SEO/SEO";

const RefundCancellation = () => {
    const { isMenuOpen } = useContext(MenuContext);

    const [privacyData, setPrivacyData] = useState(undefined);

    useEffect(() => {
        getDataPrivacyPolicy();
    }, []);

    const getDataPrivacyPolicy = async () => {
        const payload = {
            IsActive: "1",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filtered = res.filter(
                    (item) => item?.Category === "Refund & Cancellation"
                );

                setPrivacyData(filtered);
            } else {
                setPrivacyData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setPrivacyData([]);
        }
    };

    return (
        <>
            <SEO
                title="Refund & Cancellation Policy | AstroCall Live"
                description="Review AstroCall Live's Refund and Cancellation Policy. Learn about eligibility, timelines, and refund process."
                canonical="https://astrocall.live/refund-cancellation"
                type="website"
            />

            {/* <Header /> */}

            <div className="bg-white mt-16 mb-20">
                <div
                    className={`content ${isMenuOpen ? "blur" : ""
                        } flex justify-center`}
                >
                    <div className="mt-1 w-full">
                        <div>
                            {privacyData === undefined ? (
                                <div className="flex justify-center py-10">
                                    <OrbitProgress color="#6b716b" size="medium" />
                                </div>
                            ) : privacyData.length === 0 ? (
                                <div className="flex justify-center items-center h-[300px]">
                                    <p className="text-center text-gray-600 text-lg font-medium">
                                        No data available
                                    </p>
                                </div>
                            ) : (
                                privacyData.map((item, index) => (
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

            {/* <Footer /> */}
        </>
    );
};

export default RefundCancellation;