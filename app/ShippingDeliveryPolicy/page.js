"use client";

import React, { useContext, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { OrbitProgress } from "react-loading-indicators";

import { MenuContext } from "../context/MenuContext";
import { postWithToken } from "../utils/api";
import SEO from "../components/SEO/page";

const ShippingDeliveryPolicy = () => {
    const { isMenuOpen } = useContext(MenuContext);
    const [privacyData, setPrivacyData] = useState(undefined);

    useEffect(() => {
        getDataPrivacyPolicy();
    }, []);

    const getDataPrivacyPolicy = async () => {
        const payload = {
            IsActive: "1",
            Category: "Shipping & Delivery Policy",
        };

        try {
            const res = await postWithToken(
                "PrivacyPolicy/GetData_PrivacyPolicy",
                payload
            );
            console.log(res, "res");
            if (res) {
                const filtered = res.filter(
                    (data) => data?.Category === "Shipping & Delivery Policy"
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
                title="Shipping & Delivery Policy | AstroCall Live"
                description="Read AstroCall Live's Shipping and Delivery Policy for gemstones and products. Learn about delivery timelines and charges."
                canonical="https://astrocall.live/shipping-delivery-policy"
                type="website"
            />

            <div className="bg-white mt-16 mb-20">
                <div
                    className={`content ${isMenuOpen ? "blur" : ""
                        } flex justify-center`}
                >
                    <div className="mt-1 w-full">
                        {privacyData === undefined ? (
                            <div className="flex justify-center">
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
        </>
    );
};

export default ShippingDeliveryPolicy;