"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation.js";

import { useRouter } from "next/navigation.js";
import { MdLocalOffer } from "react-icons/md";
import { postWithToken } from "../../utils/api";
import { useMenuContext } from "@/app/hooks/useMenuContext";


const PlansDetailsContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { orderid, setorderid, loginUserData, Get_SingleData_User, PlanSuccessPopup, setPlanSuccessPopup, RazorPayKey, Get_Data_RazorPayKey } = useMenuContext();
    
    const UserLoginId = typeof window !== 'undefined' && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";
    const GetWalletPackageID = typeof window !== 'undefined' && sessionStorage.getItem("WalletPackageID") ? sessionStorage.getItem("WalletPackageID") : "";
    var astrologerWalletPackageID = searchParams?.get("plans_to_astrologersPL");

    const [plansdata, setplansdata] = useState();
    const [totalamt, settotalamt] = useState();
    const [GstAmtdata, setGstAmtdata] = useState();
    const [BonusAmtdata, setBonusAmtdata] = useState();

    useEffect(() => {
        if (GetWalletPackageID) {
            Get_Data_WalletPackage(GetWalletPackageID);
            Get_Data_RazorPayKey();
        }
    }, [GetWalletPackageID]);

    const Get_Data_WalletPackage = async (packageId) => {
        const val = { 'IsActive': '1' };
        try {
            const res = await postWithToken('WalletPackage/GetData_WalletPackage', val);
            if (res) {
                const filteredData = res?.filter((item) => item?.WalletPackageID == packageId);
                setplansdata(filteredData);
                if (filteredData && filteredData.length > 0) {
                    settotalamt(filteredData[0]?.SubTotalAmt);
                    setGstAmtdata(filteredData[0]?.GSTAmt);
                    setBonusAmtdata(filteredData[0]?.BonusAmt);
                }
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };

    useEffect(() => {
        // Dynamically load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        try {
            const val = {
                Amount: totalamt,
                UserId: UserLoginId,
            };
            const response = await TokenWithDeleteUpadateAdd("RazorPay/CreateOrder", val);
            if (response?.OrderId) {
                const options = {
                    key: RazorPayKey,
                    amount: totalamt,
                    currency: "INR",
                    name: "AstroCall",
                    description: "Test Payment",
                    order_id: response.OrderId,
                    notes: {
                        GstAmt: GstAmtdata,
                        BonusAmt: BonusAmtdata || 0,
                        UserId: UserLoginId,
                        PaymentType: "Plans",
                        ProductName: "Plans"
                    },
                    handler: function (paymentResponse) {
                        if (paymentResponse?.razorpay_order_id) {
                            console.log("Payment successful:", paymentResponse);
                            router.push("/plans");
                            Get_SingleData_User(localStorage.getItem("UserLoginId"));
                            setPlanSuccessPopup(true);
                        }
                    },
                    prefill: {
                        name: loginUserData?.NickName,
                        email: loginUserData?.Email,
                        contact: loginUserData?.MobileNo
                    },
                    theme: { color: "#F37254" },
                };
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                console.error("Order creation failed, OrderId not received.");
            }
        } catch (error) {
            console.error("Error initiating payment:", error);
        }
    };

    const PhonePe_handlePayment = async () => {
        try {
            const url = typeof window !== 'undefined' ? window.location.origin : "";
            console.log(url, 'url');
            const val = {
                Amount: totalamt * 100,
                RedirectUrl: `${url}/plans`,
                GstAmt: GstAmtdata,
                BonusAmt: BonusAmtdata || 0,
                UserId: UserLoginId,
                PaymentType: "Phone Pay",
                ProductName: 'Plans'
            };
            const res = await TokenWithDeleteUpadateAdd("PhonePay/CreatePayment", val);
            if (res) {
                sessionStorage.setItem("MerchantIdPlans", res?.MerchantOrderId);
                const paymentUrl = res?.redirectUrl;
                window.location.href = paymentUrl;
            }
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    const PaymentMethodBtn = ({ name, icon, onClick }) => {
        const renderIcon = () => {
            if (name === "PhonePe") {
                return (
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"><circle cx="-25.926" cy="41.954" r="29.873" fill="#5f259f" transform="rotate(-76.714 -48.435 5.641) scale(8.56802)" /><path d="M372.164 189.203c0-10.008-8.576-18.593-18.584-18.593h-34.323l-78.638-90.084c-7.154-8.577-18.592-11.439-30.03-8.577l-27.17 8.577c-4.292 1.43-5.723 7.154-2.862 10.007l85.8 81.508H136.236c-4.293 0-7.154 2.861-7.154 7.154v14.292c0 10.016 8.585 18.592 18.592 18.592h20.015v68.639c0 51.476 27.17 81.499 72.931 81.499 14.292 0 25.739-1.431 40.03-7.146v45.753c0 12.87 10.016 22.886 22.885 22.886h20.015c4.293 0 8.577-4.293 8.577-8.586V210.648h32.893c4.292 0 7.145-2.861 7.145-7.145v-14.3zM280.65 312.17c-8.576 4.292-20.015 5.723-28.591 5.723-22.886 0-34.324-11.438-34.324-37.176v-68.639h62.915v100.092z" fill="#fff" fillRule="nonzero" /></svg>
                );
            } else if (name === "Card") {
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 385.414"><path fill="#3B95D9" fillRule="nonzero" d="M26.217 0h382.258c14.366 0 26.16 11.803 26.16 26.158V264.76c0 14.364-11.796 26.16-26.16 26.16H26.217c-14.384 0-26.16-11.776-26.16-26.16V26.158C.057 11.798 11.859 0 26.217 0z" /><path fill="#42A6F1" d="M26.216 7.674h382.26c10.166 0 18.484 8.356 18.484 18.484v238.603c0 10.128-8.356 18.483-18.484 18.483H26.216c-10.128 0-18.483-8.317-18.483-18.483V26.158c0-10.166 8.317-18.484 18.483-18.484z" /><path fill="#4D5471" d="M0 56.192h434.691v74.811H0z" /><path fill="#D54C3D" fillRule="nonzero" d="M103.585 94.494H485.84c7.197 0 13.737 2.948 18.471 7.682l.47.515c4.467 4.71 7.219 11.051 7.219 17.961v238.602c0 14.364-11.796 26.16-26.16 26.16H103.585c-14.383 0-26.16-11.777-26.16-26.16V120.652c0-7.167 2.939-13.697 7.679-18.449l.049-.048c4.749-4.728 11.273-7.661 18.432-7.661z" /><path fill="#ED5444" d="M103.585 102.168H485.84c10.167 0 18.484 8.356 18.484 18.484v238.602c0 10.128-8.356 18.484-18.484 18.484H103.585c-10.128 0-18.484-8.317-18.484-18.484V120.652c0-10.167 8.317-18.484 18.484-18.484z" /><path fill="#F8D14A" fillRule="nonzero" d="M126.406 283.827a8.33 8.33 0 110-16.661h167.77a8.33 8.33 0 010 16.661h-167.77zm242.263-26.394c12.433 0 23.464 5.995 30.363 15.254 6.9-9.259 17.932-15.254 30.367-15.254 20.9 0 37.845 16.944 37.845 37.844 0 20.902-16.945 37.846-37.845 37.846-12.435 0-23.467-5.997-30.367-15.256-6.899 9.259-17.93 15.256-30.363 15.256-20.903 0-37.846-16.944-37.846-37.846 0-20.9 16.943-37.844 37.846-37.844zm-242.263 65.959a8.331 8.331 0 010-16.661h126.509a8.332 8.332 0 010 16.661H126.406z" /><path fill="#DACD71" d="M139.602 153.639h56.914c7.258 0 13.197 5.939 13.197 13.197v2.883h-83.307v-2.883c0-7.258 5.938-13.197 13.196-13.197zm70.111 20.621v28.134h-25.844V174.26h25.844zm-30.384 28.134h-22.568V174.26h22.568v28.134zm-27.109 0h-25.814V174.26h25.814v28.134zm57.493 4.541v2.928c0 7.257-5.94 13.196-13.197 13.196h-56.914c-7.257 0-13.196-5.938-13.196-13.196v-2.928h83.307z" /></svg>
                );
            } else if (name === "Wallets") {
                return (
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 117.34 122.88" xmlSpace="preserve">
                        <g>
                            <path fillRule="evenodd" clipRule="evenodd" d="M85.14,14.83L43.26,40.28h11.91l30.92-18.79l4.54-2.76l13.09,21.55h7.62 c1.66,0,3.16,0.68,4.25,1.76l0,0c1.09,1.09,1.77,2.59,1.77,4.24v70.59c0,1.65-0.68,3.15-1.76,4.23v0.01 c-1.09,1.09-2.59,1.76-4.25,1.76l-105.33,0c-1.66,0-3.16-0.67-4.25-1.76v-0.01C0.68,120.02,0,118.52,0,116.88V46.28 c0-1.65,0.68-3.16,1.76-4.24c1.09-1.09,2.59-1.76,4.25-1.76h2.5L73.53,0.77v0C74.36,0.27,75.3,0,76.27,0 c0.42,0,0.84,0.05,1.25,0.15c1.36,0.33,2.54,1.19,3.26,2.39v0l6.63,10.91L85.14,14.83z M5.89,45.62 c-0.23,0.25-0.42,0.53-0.56,0.84v8.69h106.68v-8.87c0-0.19-0.07-0.36-0.19-0.47h-0.01c-0.12-0.12-0.29-0.2-0.48-0.2H6.01 C5.97,45.61,5.93,45.61,5.89,45.62z M15.98,84.71h19.05v7.13H15.98V84.71z M15.98,101.59h53.25v6.43H15.98V101.59z M86.21,84.71h19.05v7.13H86.21V84.71z M62.8,84.71h19.05v7.13H62.8V84.71z M39.39,84.71h19.05v7.13H39.39V84.71z M112.01,75.14H5.33v41.73c0,0.19,0.07,0.36,0.2,0.48l0.01,0c0.13,0.13,0.3,0.2,0.47,0.2l105.33,0c0.18,0,0.35-0.08,0.48-0.2 l0,0c0.13-0.13,0.2-0.3,0.2-0.48V75.14z" />
                        </g>
                    </svg>
                );
            } else if (name === "Paytm") {
                return (
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 38.52" style={{ enableBackground: 'new 0 0 122.88 38.52' }} xmlSpace="preserve">
                        <style>{`.st0 { fill: #20336B; } .st1 { fill: #00BAF2; }`}</style>
                        <g>
                            <path className="st1" d="M122.47,11.36c-1.12-3.19-4.16-5.48-7.72-5.48h-0.08c-2.32,0-4.41,0.97-5.9,2.52 c-1.49-1.55-3.58-2.52-5.9-2.52h-0.07c-2.04,0-3.91,0.75-5.34,1.98V7.24c-0.05-0.63-0.56-1.12-1.2-1.12h-5.48 c-0.67,0-1.21,0.54-1.21,1.21v29.74c0,0.67,0.54,1.21,1.21,1.21h5.48c0.61,0,1.12-0.46,1.19-1.04l0-21.35c0-0.08,0-0.14,0.01-0.21 c0.09-0.95,0.79-1.74,1.89-1.83h1.01c0.46,0.04,0.85,0.2,1.15,0.45c0.48,0.38,0.74,0.96,0.74,1.6l0.02,21.24 c0,0.67,0.54,1.22,1.21,1.22h5.48c0.65,0,1.17-0.51,1.2-1.15l0-21.33c0-0.7,0.32-1.34,0.89-1.71c0.28-0.18,0.62-0.3,1.01-0.34h1.01 c1.19,0.1,1.9,1,1.9,2.05l0.02,21.22c0,0.67,0.54,1.21,1.21,1.21h5.48c0.64,0,1.17-0.5,1.21-1.13V13.91 C122.86,12.6,122.69,11.99,122.47,11.36L122.47,11.36z M85.39,6.2h-3.13V1.12c0-0.01,0-0.01,0-0.02C82.26,0.5,81.77,0,81.15,0 c-0.07,0-0.14,0.01-0.21,0.02c-3.47,0.95-2.78,5.76-9.12,6.17h-0.61c-0.09,0-0.18,0.01-0.27,0.03h-0.01l0.01,0 C70.41,6.35,70,6.83,70,7.41v5.48c0,0.67,0.54,1.21,1.21,1.21h3.3l-0.01,23.22c0,0.66,0.54,1.2,1.2,1.2h5.42 c0.66,0,1.2-0.54,1.2-1.2l0-23.22h3.07c0.66,0,1.21-0.55,1.21-1.21V7.41C86.6,6.74,86.06,6.2,85.39,6.2L85.39,6.2z" />
                            <path className="st0" d="M65.69,6.2h-5.48C59.55,6.2,59,6.74,59,7.41v11.33c-0.01,0.7-0.58,1.26-1.28,1.26h-2.29 c-0.71,0-1.29-0.57-1.29-1.28L54.12,7.41c0-0.67-0.54-1.21-1.21-1.21h-5.48c-0.67,0-1.21,0.54-1.21,1.21v12.41 c0,4.71,3.36,8.08,8.08,8.08c0,0,3.54,0,3.65,0.02c0.64,0.07,1.13,0.61,1.13,1.27c0,0.65-0.48,1.19-1.12,1.27 c-0.03,0-0.06,0.01-0.09,0.02l-8.01,0.03c-0.67,0-1.21,0.54-1.21,1.21v5.47c0,0.67,0.54,1.21,1.21,1.21h8.95 c4.72,0,8.08-3.36,8.08-8.07V7.41C66.9,6.74,66.36,6.2,65.69,6.2L65.69,6.2z M34.53,6.23h-7.6c-0.67,0-1.22,0.51-1.22,1.13v2.13 c0,0.01,0,0.03,0,0.04c0,0.02,0,0.03,0,0.05v2.92c0,0.66,0.58,1.21,1.29,1.21h7.24c0.57,0.09,1.02,0.51,1.09,1.16v0.71 c-0.06,0.62-0.51,1.07-1.06,1.12h-3.58c-4.77,0-8.16,3.17-8.16,7.61v6.37c0,4.42,2.92,7.56,7.65,7.56h9.93 c1.78,0,3.23-1.35,3.23-3.01V14.45C43.34,9.41,40.74,6.23,34.53,6.23L34.53,6.23z M35.4,29.09v0.86c0,0.07-0.01,0.14-0.02,0.2 c-0.01,0.06-0.03,0.12-0.05,0.18c-0.17,0.48-0.65,0.83-1.22,0.83h-2.28c-0.71,0-1.29-0.54-1.29-1.21v-1.03c0-0.01,0-0.03,0-0.04 l0-2.75v-0.86l0-0.01c0-0.66,0.58-1.2,1.29-1.2h2.28c0.71,0,1.29,0.54,1.29,1.21V29.09L35.4,29.09z M13.16,6.19H1.19 C0.53,6.19,0,6.73,0,7.38v5.37c0,0.01,0,0.02,0,0.03c0,0.03,0,0.05,0,0.07v24.29c0,0.66,0.49,1.2,1.11,1.21h5.58 c0.67,0,1.21-0.54,1.21-1.21l0.02-8.32h5.24c4.38,0,7.44-3.04,7.44-7.45v-7.72C20.6,9.25,17.54,6.19,13.16,6.19L13.16,6.19z M12.68,16.23v3.38c0,0.71-0.57,1.29-1.28,1.29l-3.47,0v-6.77h3.47c0.71,0,1.28,0.57,1.28,1.28V16.23L12.68,16.23z" />
                        </g>
                    </svg>
                );
            } else if (name === "GPay") {
                return (
                    <svg viewBox="0 0 123.84 104.9" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FDBD00" d="M62.46,26.62l-37.82,65.5l16.56,9.56c10.69,6.17,24.37,2.51,30.54-8.18l24.53-42.49 c3.86-6.68,1.57-15.23-5.12-19.09l-15.37-8.87C71.12,20.35,65.16,21.95,62.46,26.62z" />
                        <path fill="#2DA94F" d="M96.1,10.51L84.38,3.75C71.02-3.97,53.93,0.61,46.21,13.98L24.47,51.62c-3.86,6.68-1.57,15.23,5.12,19.09 l11.72,6.76c6.68,3.86,15.23,1.57,19.09-5.12l25.95-44.95c5.39-9.34,17.33-12.53,26.66-7.14L96.1,10.51z" />
                    </svg>
                );
            } else if (name === "BHIM UPI") {
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333334 199007" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"><path d="M44732 130924h1856l-1738 7215c-265 1061-206 1885 147 2415 354 530 1001 795 1973 795 942 0 1737-265 2356-795 618-531 1031-1355 1296-2415l1737-7215h1885l-1767 7392c-383 1590-1060 2798-2061 3593-972 795-2268 1208-3858 1208s-2680-383-3269-1179c-589-795-707-2002-324-3592l1767-7421zm223507 11868l2826-11868h6449l-383 1649h-4564l-706 2974h4564l-413 1679h-4564l-913 3827h4565l-412 1738h-6449zm-177-8982c-413-470-913-824-1443-1031-531-235-1119-353-1797-353-1266 0-2385 412-3386 1237s-1649 1915-1973 3239c-295 1267-177 2327 413 3181 559 824 1442 1237 2620 1237 677 0 1355-118 2031-383 678-235 1356-619 2062-1119l-530 2179c-589 382-1207 648-1856 825-648 176-1296 265-2002 265-883 0-1679-148-2356-443-678-294-1236-736-1679-1324-441-560-706-1237-824-2002-117-766-88-1590 148-2474 206-883 559-1680 1031-2445 471-766 1089-1443 1796-2002 706-589 1472-1030 2297-1325 824-294 1648-441 2503-441 677 0 1295 88 1885 294 559 207 1089 500 1560 913l-500 1972zm-18317 4300h3209l-530-2710c-29-176-59-383-59-589-30-235-30-471-30-736-118 265-235 500-383 736-118 235-235 442-353 619l-1855 2680zm4093 4682l-589-3062h-4594l-2062 3062h-1972l8539-12338 2650 12338h-1972zm-15548 0l2827-11868h6449l-383 1649h-4565l-706 2945h4563l-412 1679h-4564l-1325 5565h-1885v30zm-5566-6832h353c1001 0 1679-118 2062-354 382-236 648-648 795-1267 146-648 88-1119-207-1384-293-265-913-413-1855-413h-354l-795 3417zm-471 1502l-1267 5300h-1767l2828-11867h2621c766 0 1354 59 1737 148 411 89 736 265 971 500 295 295 471 648 559 1119 89 443 59 943-59 1502-235 943-619 1709-1207 2238-589 530-1326 854-2209 972l2680 5387h-2121l-2562-5300h-206zm-11632 5330l2828-11868h6478l-382 1649h-4565l-706 2974h4564l-411 1679h-4565l-912 3827h4564l-413 1738h-6479zm-2031-10248l-2444 10218h-1884l2444-10218h-3063l383-1649h8010l-382 1649h-3063zm-19170 10248l2945-12338 5595 7244c148 206 294 413 441 648s295 501 471 794l1974-8216h1737l-2945 12310-5713-7392c-147-206-294-412-441-619-147-235-265-442-354-707l-1972 8245h-1737v30zm-4594 0l2827-11868h1884l-2827 11868h-1884zm-13870-2385l1678-707c29 530 176 942 501 1207 324 265 765 413 1354 413 559 0 1031-148 1443-471 412-324 678-736 795-1266 177-707-235-1326-1236-1855-147-89-235-148-325-177-1119-648-1825-1207-2120-1737-294-530-354-1149-176-1884 235-972 736-1738 1530-2356 796-589 1679-913 2740-913 854 0 1530 177 2031 500 501 325 766 825 854 1444l-1648 766c-148-383-325-648-560-825-235-176-530-265-884-265-501 0-942 147-1295 412-354 265-589 619-707 1090-176 707 325 1383 1472 2002 89 59 147 89 207 117 1001 530 1678 1061 1972 1591 295 529 354 1148 178 1943-266 1119-825 2002-1680 2680-853 647-1855 1002-3033 1002-971 0-1737-237-2267-708-589-471-854-1149-824-2002zm-1973-7863l-2444 10218h-1884l2444-10218h-3062l381-1649h8010l-383 1649h-3062zm-19170 10248l2944-12338 5596 7244c147 206 295 413 442 648 146 235 294 501 471 794l1973-8216h1737l-2944 12310-5713-7392c-148-206-294-412-442-619-147-235-265-442-353-707l-1973 8245h-1737v30zm-8599 0l2827-11868h6449l-383 1649h-4564l-707 2974h4564l-412 1679h-4564l-913 3827h4565l-413 1738h-6449zm-3121-5860c0-88 29-354 88-766 30-353 59-618 89-854-118 266-236 530-383 824-147 266-324 560-530 825l-4535 6331-1472-6448c-59-265-118-530-148-766-29-235-59-500-59-736-59 236-147 500-235 794-89 266-206 560-354 855l-2650 5831h-1737l5683-12368 1620 7479c29 118 59 324 89 589 29 266 88 619 147 1031 206-353 471-765 825-1296 88-146 176-235 206-324l5124-7479-177 12368h-1737l148-5890zm-17933 5860l1296-5418-2356-6420h1972l1472 4035c30 117 59 235 118 411 59 178 89 354 147 530 118-176 236-353 354-530 118-176 236-324 353-471l3446-3975h1884l-5506 6390-1296 5417h-1885v30zm-8746-4682h3209l-530-2710c-30-176-59-383-59-589-30-235-30-471-30-736-118 265-236 500-383 736-118 235-235 442-354 619l-1855 2680zm4063 4682l-589-3062h-4594l-2061 3062h-1973l8540-12338 2650 12338h-1973zm-11808-6920h471c1031 0 1767-118 2179-354 412-235 677-647 825-1237 146-618 58-1089-236-1324-324-265-972-383-1943-383h-471l-825 3299zm-501 1590l-1266 5330h-1767l2827-11868h2856c854 0 1443 59 1826 147s678 236 913 471c294 265 500 648 589 1119 88 472 59 972-59 1531-147 560-353 1090-677 1561s-707 854-1119 1119c-353 206-736 382-1148 471-412 88-1060 148-1885 148h-1089v-30zm-17580 3563h1590c854 0 1531-59 2003-176 471-117 883-324 1266-589 530-383 972-854 1325-1443 354-560 619-1237 795-2002 176-766 235-1414 147-1972-88-561-294-1061-648-1444-265-294-589-471-1030-589-442-118-1119-176-2091-176h-1354l-2003 8392zm-2297 1767l2828-11868h2532c1649 0 2798 88 3415 265 619 177 1148 442 1561 854 530 530 884 1208 1031 2002 147 825 88 1767-147 2798-266 1060-648 1972-1178 2796-530 825-1207 1473-2002 2003-589 413-1237 678-1944 854-677 177-1708 265-3063 265h-3033v30zm-8628 0l2827-11868h6449l-383 1649h-4565l-707 2974h4565l-412 1679h-4565l-913 3827h4565l-412 1738h-6449zm-4565 0l2827-11868h1884l-2827 11868h-1885zm-8540 0l2827-11868h6449l-383 1649h-4564l-707 2945h4564l-412 1679h-4565l-1325 5565h-1885v30zm-4565 0l2827-11868h1884l-2827 11868h-1885zm-13015 0l2944-12338 5595 7244c147 206 294 413 442 648 147 235 294 501 471 794l1973-8216h1737l-2944 12310-5713-7392c-147-206-294-412-442-619-147-235-265-442-353-707l-1973 8245h-1737v30z" fill="#3a3734" /><path d="M233961 120588h-12927l17963-64873h12927l-17963 64873zm-107424-4064c-707 2562-3063 4358-5713 4358H54185c-1826 0-3180-619-4064-1855-883-1238-1089-2769-559-4594l16255-58541h12928l-14518 52298h51710l14517-52298h12928l-16844 60632zm100710-58777c-883-1237-2268-1855-4152-1855h-71027l-3504 12721h64608l-3769 13576h-51680v-30h-12927l-10719 38724h12927l7185-25973h58100c1826 0 3534-619 5124-1855 1590-1237 2651-2768 3151-4594l7185-25972c559-1943 383-3504-501-4741z" fill="#716d6a" /><path fill="#0e8635" d="M274245 55833l16344 32510-34365 32510 4087-14747 18794-17763-8941-17785z" /><path fill="#e97208" d="M262762 55833l16343 32510-34395 32510z" /><path d="M31367 0h270601c8631 0 16474 3528 22156 9210 5683 5683 9211 13526 9211 22156v136275c0 8629-3529 16472-9211 22155-5683 5682-13526 9211-22155 9211H31368c-8629 0-16473-3528-22156-9211C3530 184114 2 176272 2 167641V31366c0-8631 3528-16474 9210-22156S22738 0 31369 0zm270601 10811H31367c-5647 0-10785 2315-14513 6043s-6043 8866-6043 14513v136275c0 5646 2315 10784 6043 14512 3729 3729 8867 6044 14513 6044h270601c5645 0 10783-2315 14512-6044 3728-3729 6044-8867 6044-14511V31368c0-5645-2315-10784-6043-14513-3728-3728-8867-6043-14513-6043z" fill="gray" fillRule="nonzero" /></svg>
                );
            } else {
                return icon ? <img src={icon} alt={name} className="w-10 h-10" /> : null;
            }
        };
        return (
            <button
                onClick={onClick}
                className="border p-2 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center transition gap-1 w-24 h-20"
            >
                <div className="w-14 h-14 flex items-center justify-center">
                    {renderIcon()}
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">{name}</span>
            </button>
        );
    };

    return (
        <div className="bg-[#F973160D] min-h-screen">
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

            <div className="heading main-container mt-10 mb-10">
                <h1 className="text-center text-3xl font-[700]">Payment Details</h1>
                <div className="w-[150px] h-[3px] m-auto rounded-full bg-primaryColor my-2"></div>
            </div>

            <div className="main-container flex flex-col lg:flex-row gap-8 mb-40 py-1 px-20">
                {/* Left Side: Payment Details */}
                <div className="lg:w-1/2 w-full bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-lg font-bold mb-4 text-primaryColor">
                        Payment Summary
                    </h2>

                    {plansdata?.length > 0 ? (
                        <>
                            {plansdata?.map((item, index) => (
                                <div key={index} className="space-y-4 text-sm text-gray-700">
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Recharge Amount:</span>
                                        <span>₹ {item?.PackageAmt}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span>GST @18%:</span>
                                        <span>₹ {item?.GSTAmt}</span>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-semibold">₹ {item?.SubTotalAmt}</span>
                                    </div>

                                    <div className="flex justify-between bg-green-50 border p-3 rounded-md items-center">
                                        <span className="text-green-700 text-sm">
                                            ₹ {item?.BonusAmt || 0} cashback in wallet after recharge
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Loading...</p>
                    )}
                </div>

                {/* Right Side: Choose Payment Method */}
                <div className="lg:w-1/2 w-full bg-white p-5 sm:p-6 rounded-2xl shadow-md border">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 text-primaryColor text-center">
                        Choose Payment Method
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                        <PaymentMethodBtn
                            name="Card"
                            icon="/icons/card.svg"
                            onClick={() => handlePayment("card")}
                        />

                        <PaymentMethodBtn
                            name="Wallets"
                            icon="/icons/wallet.svg"
                            onClick={() => handlePayment("wallet")}
                        />

                        <PaymentMethodBtn
                            name="Paytm"
                            icon="/icons/paytm.svg"
                            onClick={() => handlePayment("paytm")}
                        />

                        <PaymentMethodBtn
                            name="GPay"
                            icon="/icons/gpay.svg"
                            onClick={() => handlePayment("gpay")}
                        />

                        <PaymentMethodBtn
                            name="BHIM UPI"
                            icon="/icons/upi.svg"
                            onClick={() => handlePayment("upi")}
                        />

                        <PaymentMethodBtn
                            name="PhonePe"
                            onClick={PhonePe_handlePayment}
                        />
                    </div>
                </div>
            </div>

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
    );
};

export default function PlansDetails() {
    return (<Suspense fallback={<div className="main-container py-10 text-center">Loading...</div>}>
      <PlansDetailsContent />
    </Suspense>);
}
