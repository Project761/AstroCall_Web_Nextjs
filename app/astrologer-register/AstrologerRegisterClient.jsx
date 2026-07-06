"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import Image from "next/image";

const AstroRegister = () => {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [value, setValue] = useState({ 
        'FirstName': '', 
        'LastName': '', 
        'EmailID': '', 
        'RegMobileNo': '', 
        'CreatedByUserID': '' 
    });

    const handleChange = (e) => {
        const { name, value: val } = e.target;
        setValue((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const auth = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("LoginTokenData") || "{}") : {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const checkValidationErrors = () => {
        const newErrors = {};
        if (!value?.FirstName) {
            newErrors.FirstName = 'required *';
        }
        if (!value?.LastName) {
            newErrors.LastName = 'required *';
        }
        if (!value?.EmailID) {
            newErrors.EmailID = 'required *';
        } else if (!emailRegex.test(value.EmailID)) {
            newErrors.EmailID = "Invalid email address *";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            Update_Astrologer_Data();
        }
    };

    const HandleChangeInput = (e) => {
        if (e.target.name === 'RegMobileNo') {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setValue({ ...value, [e.target.name]: ele });
        } else if (e.target.name === 'EmailID') {
            let ele = e.target.value.replace(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{4,}$/, "");
            setValue({ ...value, [e.target.name]: ele });
        }
    };

    
    const Update_Astrologer_Data = () => {
        const { FirstName, LastName, EmailID } = value;
        const val = { 
            FirstName: FirstName, 
            LastName: LastName, 
            EmailID: EmailID, 
            'AstroID': auth?.Astro 
        };
        
        TokenWithDeleteUpadateAdd('Astrologer/UpdateAstrologerDetails', val).then((res) => {
            if (res?.success === true) {
                router.push('/astrologer-register-update');
            } else {
                console.log(res, 'error');
            }
        }).catch((error) => {
            console.log(error, 'error');
        });
    };

    return (
        <>
            <div>
                <div>
                    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-4">
                        <div className="flex mt-10">
                            <div className="md:w-1/2 p-10">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    BECOME &quot;AstroCall ASTRO VERIFIED&quot; ASTROLOGER:
                                    <span className="text-orange-600"> JOIN NOW!</span>
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    AstroCall Astro, one of the best online astrology portals, gives you a chance
                                    to be a part of its community of best and top-notch Astrologers.
                                </p>
                                <div className="mt-6 flex flex-col md:flex-row gap-4">
                                    <div className="border rounded-lg w-[200px] p-4 text-center shadow-lg bg-orange-100">
                                        <span className="text-orange-600 text-2xl">✔</span>
                                        <p className="font-bold">Verified Expert</p>
                                        <p className="text-sm text-gray-500">Astrologers</p>
                                    </div>
                                    <div className="border rounded-lg w-[200px] p-4 text-center shadow-lg bg-orange-100">
                                        <span className="text-orange-600 text-2xl">👥</span>
                                        <p className="font-bold">1500+ Trusted</p>
                                        <p className="text-sm text-gray-500">Astrologers</p>
                                    </div>
                                    <div className="border rounded-lg w-[200px] p-4 text-center shadow-lg bg-orange-100">
                                        <span className="text-orange-600 text-2xl">⏳</span>
                                        <p className="font-bold">24/7</p>
                                        <p className="text-sm text-gray-500">Availability</p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 sellerCard box-seller rounded-lg flex flex-col p-6">
                                <h2 className="text-xl font-bold text-gray-800 text-center">Astrologer Sign Up</h2>
                                <div className="mt-4">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="FirstName">First Name*</label>
                                        <input 
                                            type="text" 
                                            id="FirstName" 
                                            name='FirstName' 
                                            placeholder='First Name' 
                                            maxLength="60" 
                                            className="form-control rounded w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                                            value={value?.FirstName} 
                                            onChange={handleChange} 
                                        />
                                        {errors.FirstName && <p className="text-red-500 text-xs">{errors.FirstName}</p>}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="LastName">Last Name*</label>
                                        <input 
                                            type="text" 
                                            id="LastName" 
                                            name='LastName' 
                                            placeholder='Last Name' 
                                            maxLength="60" 
                                            className="form-control rounded w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                                            value={value?.LastName} 
                                            onChange={handleChange} 
                                        />
                                        {errors.LastName && <p className="text-red-500 text-xs">{errors.LastName}</p>}
                                    </div>

                                    <div className="col-6 mb-3">
                                        <label htmlFor="EmailID">Email Address*</label>
                                        <input 
                                            type="text" 
                                            id="EmailID" 
                                            name='EmailID' 
                                            placeholder='Enter Email' 
                                            className="form-control rounded w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" 
                                            value={value?.EmailID} 
                                            onChange={HandleChangeInput} 
                                        />
                                        {errors.EmailID && <p className="text-red-500 text-xs">{errors.EmailID}</p>}
                                    </div>

                                    <div className="col-6 mb-3">
                                        <label htmlFor="RegMobileNo">Mobile*</label>
                                        <div className="flex mt-1 border rounded-lg items-center overflow-hidden shadow-sm">
                                            <div className="flex items-center pl-3 ml-2">
                                                <Image 
                                                    src="/images/indian.webp" 
                                                    alt="indian flag" 
                                                    width={25} 
                                                    height={25} 
                                                />
                                                <span className="text-gray-600 ml-2">+91</span>
                                                <input
                                                    type="text"
                                                    id="RegMobileNo"
                                                    name='RegMobileNo'
                                                    value={auth?.MobileNo || ''}
                                                    onChange={HandleChangeInput}
                                                    readOnly
                                                    className="w-full p-2 outline-none bg-gray-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="chat-button flex my-6">
                                        <button
                                            className="bg-backgroundColor flex gap-2 items-center text-primaryColor border-2 px-20 py-2 border-orange-400 rounded-2xl m-auto hover:bg-primaryColor hover:text-white duration-300"
                                            onClick={() => { checkValidationErrors() }}
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default AstroRegister;
