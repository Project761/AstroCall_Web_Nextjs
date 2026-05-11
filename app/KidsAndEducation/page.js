"use client";
import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";
import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const KidsAndEducation = () => {
    const { isMenuOpen } = useContext(MenuContext);
    const [kidsEducationData, setKidsEducationData] = useState(undefined);

    useEffect(() => {
        getKidsEducationData();
    }, []);

    const getKidsEducationData = async () => {
        const payload = {
            IsActive: "1",
            Category: "Kids & Education",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );

            if (res) {
                const filteredData = res.filter((data) => data?.Category);
                setKidsEducationData(filteredData);
            } else {
                setKidsEducationData([]);
            }
        } catch (error) {
            console.log(error, "error");
            setKidsEducationData([]);
        }
    };

    return (
        <>
            <SEO
                title="Kids Education Astrology – Career Guidance & Insights"
                description="Help your child achieve academic success with astrology. Consult astrologers at AstroCall Live for education horoscope, learning challenges, and career guidance for kids."
                keywords="kids astrology, children astrology, education astrology, child future, career guidance for kids, education guidance astrology"
                canonical="https://astrocall.live/astrology-for-kids-and-education"
            />

            <div className="bg-[#F973160D]">
                <div className="main-container text-left py-5 ">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4 mt-18">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold">
                                    Astrology for Kids & Education | Guidance for Your Child’s
                                    Future
                                </h1>
                            </div>

                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Get expert astrology for kids & education services. Our
                                consultations provide insights into your child&apos;s natural
                                talents, academic potential, and ideal career path for a bright
                                future.
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
                        {kidsEducationData === undefined ? (
                            <div className="flex justify-center">
                                <OrbitProgress color="#6b716b" size="medium" />
                            </div>
                        ) : kidsEducationData.length === 0 ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <p className="text-center text-gray-600 text-lg font-medium">
                                    No data available
                                </p>
                            </div>
                        ) : (
                            kidsEducationData.map((item, index) => (
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

export default KidsAndEducation;