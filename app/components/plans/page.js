"use client";

import React, { useEffect, useState } from "react";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../../utils/api.js";
import { useRouter } from "next/navigation.js";
import { MdLocalOffer } from "react-icons/md";
import { useMenuContext } from "@/app/hooks/useMenuContext";


const Plans = () => {
    const router = useRouter();
    const [UserLoginId, setUserLoginId] = useState("");
    const { Get_SingleData_User, PlanSuccessPopup, setPlanSuccessPopup } = useMenuContext();
    const [plansdata, setplansdata] = useState();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUserLoginId(localStorage.getItem("UserLoginId") || "");
        }
    }, []);

    useEffect(() => {
        Get_Data_WalletPackage();
    }, []);

    const Get_Data_WalletPackage = async () => {
        const val = { 'IsActive': '1' };
        try {
            const res = await postWithToken('WalletPackage/GetData_WalletPackage', val);
            if (res) {
                setplansdata(res?.filter((data) => data?.PackageAmt));
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };

    useEffect(() => {
        const checkPhonePePaymentStatus = async () => {
            const orderId = typeof window !== 'undefined' && sessionStorage.getItem("MerchantIdPlans");
            if (orderId) {
                try {
                    const val = { MerchantOrderId: orderId };
                    const res = await TokenWithDeleteUpadateAdd("PhonePay/OrderStatus", val);
                    if (res?.state === "COMPLETED") {
                        sessionStorage.removeItem("MerchantIdPlans");
                        Get_SingleData_User(localStorage.getItem("UserLoginId"));
                        setPlanSuccessPopup(true);
                    } else {
                        console.log("Payment status:", res?.state);
                    }
                } catch (err) {
                    console.error("Failed to check PhonePe status", err);
                }
            }
        };

        checkPhonePePaymentStatus();
    }, []);

    return (
        <>
          
            <div className="bg-[#F973160D]">
                {/* Payment Details */}
                <div className="main-container text-left py-5 mt-16">
                    <div className="bg-orange-500 rounded-md w-full text-white text-center py-10 px-4">
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-3">
                                <MdLocalOffer className="text-white text-3xl" />
                                <h1 className="text-2xl font-extrabold">Popular Plans</h1>
                            </div>
                            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed">
                                Explore our most subscribed astrology, puja, and consultation plans curated for your needs.
                            </p>
                            <div className="w-8 h-[2px] bg-white mt-4"></div>
                        </div>
                    </div>
                </div>

                {plansdata?.length > 0 ? (
                    <div className="card-section main-container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
                        {plansdata?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    sessionStorage.setItem("WalletPackageID", item?.WalletPackageID);
                                    router.push(`/plans/recharge-${item?.PackageAmt}`);
                                }}
                                className="transition-transform transform hover:scale-105 cursor-pointer"
                            >
                                <div className="bg-white border border-solid border-orange-500 w-full p-4 rounded-xl shadow-md hover:shadow-xl flex flex-col h-full transition-all duration-300 ease-in-out">
                                    <div className="text-center space-y-4">
                                        <div className="text-lg font-semibold text-gray-800">Recharge</div>
                                        <div className="prices flex justify-center items-baseline gap-2 text-xl text-orange-600 font-bold">
                                            ₹{item?.PackageAmt}
                                        </div>
                                    </div>
                                    <div className="flex-grow" />
                                    {item?.BonusAmt !== undefined && item?.BonusAmt > 0 && (
                                        <div className="w-full bg-green-100 text-green-800 text-sm font-medium py-2 rounded-b-lg text-center mt-4">
                                            ₹{item.BonusAmt} Extra
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-600 text-lg font-medium">
                        Currently, no recharge plans are available.
                    </div>
                )}

                {PlanSuccessPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="relative bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
                            {/* Close Button */}
                            <button
                                onClick={() => { setPlanSuccessPopup(false); }}
                                className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
                            >
                                <span className="text-2xl font-bold">&times;</span>
                            </button>

                            <h2 className="text-2xl font-bold text-green-600 mb-2">Recharge Successful!</h2>
                            <p className="text-gray-700">Your recharge has been completed successfully.</p>

                            <button
                                onClick={() => { setPlanSuccessPopup(false); }}
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
           
        </>
    );
};

export default Plans;
