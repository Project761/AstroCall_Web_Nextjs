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

const PrivacyPolicy = () => {
    const { isMenuOpen } = useContext(MenuContext);
    const [privacyData, setPrivacyData] = useState(undefined);

    useEffect(() => {
        getDataPrivacyPolicy();
    }, []);

    const getDataPrivacyPolicy = async () => {
        const payload = {
            IsActive: "1",
            Category: "Privacy Policy",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter(
                    (item) => item?.Category === "Privacy Policy"
                );
                setPrivacyData(filteredData);
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
                title="Privacy Policy – AstroCall Data Protection & Security"
                description="Read AstroCall’s privacy policy. Understand how your personal data, chat history and payment information are collected, used, stored and protected on our platform."
                keywords="AstroCall privacy policy, data protection, user privacy, personal information, online privacy, data security"
                canonical="https://astrocall.live/PrivacyPolicy"
                type="website"
                schema={{
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "WebPage",
                            name: "Privacy Policy — AstroCall",
                            url: "https://astrocall.live/PrivacyPolicy",
                            description:
                                "Read AstroCall's Privacy Policy to understand how we collect, use, and protect your personal information when you use our astrology services.",
                            inLanguage: "en-IN",
                            isPartOf: { "@id": "https://astrocall.live/#website" },
                            about: { "@id": "https://astrocall.live/#organization" },
                        },
                        {
                            "@type": "BreadcrumbList",
                            itemListElement: [
                                {
                                    "@type": "ListItem",
                                    position: 1,
                                    name: "Home",
                                    item: "https://astrocall.live/",
                                },
                                {
                                    "@type": "ListItem",
                                    position: 2,
                                    name: "Privacy Policy",
                                    item: "https://astrocall.live/PrivacyPolicy",
                                },
                            ],
                        },
                    ],
                }}
            />

            {/* <Header /> */}

            <div className="bg-white mt-16 mb-20">
                <div
                    className={`content ${isMenuOpen ? "blur" : ""
                        } flex justify-center`}
                >
                    <div className="orangeGradient mt-1 w-full">
                        <div className="bg-white">
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

export default PrivacyPolicy;