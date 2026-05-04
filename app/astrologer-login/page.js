"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OTPInput from "react-otp-input";
import axios from "axios";
import SEO from "@/app/components/SEO/page.js";
import { postWithToken } from "@/app/utils/api";
// Custom Modal Component
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>);
};
// Toast notification utilities
const toastifySuccess = (message) => {
    alert("✅ " + message);
};
const toastifyError = (message) => {
    alert("❌ " + message);
};
const AstrologerLogin = () => {
    const router = useRouter();
    const GetAstroLoginId = typeof window !== 'undefined' ? localStorage.getItem("AstroLoginId") || '' : '';
    const fireBaseToken = typeof window !== 'undefined' ? sessionStorage.getItem("fireBaseToken") || "" : "";
    let timerId;
    const [sendOtp, setSendOtp] = useState(false);
    const [mobileOtp, setMobileOtp] = useState("");
    const [numstatus, setnumstatus] = useState(true);
    const [value, setValue] = useState({ 'phoneNumber': '' });
    const [errors, setErrors] = useState({ 'phoneNumber': '' });
    const [sec, setSec] = useState("00");
    const [min, setMin] = useState("00");
    const [timerOn, setTimerOn] = useState(false);
    const [isPopUPOpen, setIsPopupOpen] = useState(false);
    const [expireOtp, setExpireOtp] = useState(true);
    const [errorMessModel, setErrorMessModel] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [AddAstroId, setAddAstroId] = useState(null);
    useEffect(() => {
        if (GetAstroLoginId) {
            // Get_SingleData_Astrologer(GetAstroLoginId) - to be implemented
        }
    }, [GetAstroLoginId]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem("activeMenu");
        }
    }, []);
    const handleOtpChange = (otp) => {
        setMobileOtp(otp);
        if (otp?.length === 4) {
            OtpVerify(otp);
        }
    };
    const HandleChangeInput = (e) => {
        if (e.target.name === 'phoneNumber') {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setValue({
                ...value,
                [e.target.name]: ele
            });
        }
    };
    const checkValidationErrors = () => {
        const newErrors = {};
        if (!value?.phoneNumber) {
            newErrors.phoneNumber = 'Please Enter Your Phone Number *';
        }
        else if (value?.phoneNumber.length !== 10) {
            newErrors.phoneNumber = 'phone number must be exactly 10 digits *';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            Check_Mobile_Registered();
        }
    };
    const startTimer = (duration) => {
        let remaining = duration;
        const countdown = () => {
            if (remaining <= 0) {
                setTimerOn(false);
                return;
            }
            const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
            const seconds = (remaining % 60).toString().padStart(2, "0");
            setMin(minutes);
            setSec(seconds);
            remaining -= 1;
        };
        countdown();
        timerId = setInterval(countdown, 1000);
    };
    useEffect(() => {
        if (timerOn) {
            startTimer(60);
        }
        return () => clearInterval(timerId);
    }, [timerOn]);
    useEffect(() => {
        if (sec === '01') {
            setMobileOtp('');
            setExpireOtp(false);
        }
    }, [sec]);
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const Check_Mobile_Registered = async () => {
        try {
            const val = { MobileNo: value?.phoneNumber };
            const res = await postWithToken("Astrologer/CheckIfMobileRegistered", val);
            if (res?.[0]?.Message === "Astrologer Found" || res?.[0]?.Message === "No data available") {
                Get_OTP();
            }
            else if (res?.[0]?.Message === "User Found") {
                setErrorMessModel("Number is not Registered with the Astrologer Account.");
                setValue({ ...value, phoneNumber: '' });
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const Get_OTP = async () => {
        try {
            const { phoneNumber } = value;
            const val = { MobileNo: phoneNumber };
            const res = await axios.post(`${url === 'https://astrocall.live' ? 'https://api.astrocall.live' : 'https://liveapi.astrocall.live'}/api/SMS/GetData_SMS`, val);
            if (res?.data?.success === true) {
                setExpireOtp(true);
                setTimerOn(true);
                setnumstatus(false);
                setSendOtp(true);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const OtpVerify = async (mobileOtp) => {
        if (!expireOtp) {
            setErrorMessage("The OTP has expired. Please request a new one.");
            return;
        }
        try {
            const { phoneNumber } = value;
            const val = { Otp: mobileOtp, MobileNo: phoneNumber };
            const res = await postWithToken("SMS/Check_Otp", val);
            if (res?.[0]?.Status === true || res?.[0]?.Status === 'true') {
                Get_astro();
                setTimeout(() => {
                    // setChatCallTrue(true) - to be implemented
                }, 3000);
            }
            else {
                setErrorMessage('The OTP you have entered is incorrect. Please try again');
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const Get_astro = async () => {
        const val = {
            'MobileNo': value?.phoneNumber,
            "grant_type": "password",
            "Type": "A",
            "Medium": "Web"
        };
        try {
            const visitor_Id = typeof window !== 'undefined' ? localStorage.getItem("visitor_Id") : '';
            const res = await axios.post(url === 'https://astrocall.live' ? 'https://api.astrocall.live/api/Astrologer/Astrologer_Login' : 'https://liveapi.astrocall.live/api/Astrologer/Astrologer_Login', val, {
                headers: {
                    "FingerPrintJsKey": visitor_Id,
                    "Content-Type": "application/json"
                }
            });
            const { data } = res;
            const parseData = JSON.parse(data?.data);
            const Resdata = parseData?.Table;
            if (Resdata?.[0]?.FullName === "") {
                router.push("/astrologer-register");
                if (typeof window !== 'undefined') {
                    localStorage.setItem("LoginTokenData", JSON.stringify(Resdata[0]));
                    localStorage.setItem("AstroLoginId", Resdata[0]?.Astro);
                    setAddAstroId(Resdata[0]?.Astro);
                }
            }
            else if (Resdata?.[0]?.FullName?.length > 0 && Resdata?.[0]?.IsVerified === "1") {
                // Logout User if logged in - to be implemented
                if (typeof window !== 'undefined') {
                    localStorage.setItem("LoginTokenData", JSON.stringify(Resdata[0]));
                    localStorage.setItem("AstroLoginId", Resdata[0]?.Astro);
                    setAddAstroId(Resdata[0]?.Astro);
                }
                setSendOtp(false);
                toastifySuccess("Successfully LogIn");
                router.push('/astrologer-panel/dashboard');
                // requestForToken(Resdata[0]?.Astro) - to be implemented
               
            }
            else if (Resdata?.[0]?.IsVerified === "0") {
                // Logout User if logged in - to be implemented
                if (typeof window !== 'undefined') {
                    localStorage.setItem("LoginTokenData", JSON.stringify(Resdata[0]));
                    localStorage.setItem("AstroLoginId", Resdata[0]?.Astro);
                    setAddAstroId(Resdata[0]?.Astro);
                }
                router.push('/astrologer-panel/dashboard');
                // requestForToken(Resdata[0]?.Astro) - to be implemented
                
            }
        }
        catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                try {
                    const parseData = JSON.parse(data?.data);
                    const Resdata = parseData?.Table;
                    if (Resdata?.[0]?.error_description === "Blocked Your Id .Please Contact to Admin.") {
                        toastifyError("Blocked Your Id .Please Contact to Admin.");
                        setValue({ ...value, phoneNumber: '' });
                        setnumstatus(true);
                        setSendOtp(false);
                        setMobileOtp('');
                    }
                }
                catch (parseError) {
                    console.error("Failed to parse error data", parseError);
                    toastifyError("Unexpected error response format.");
                }
            }
            else if (error.request) {
                toastifyError("No response from server. Please check your internet connection.");
            }
            else {
                toastifyError("Request error: " + error.message);
            }
        }
    };
    const OpenInsertStatus = () => {
        setValue({ ...value, phoneNumber: '' });
        setIsPopupOpen(true);
        setTimeout(() => {
            setIsPopupOpen(false);
        }, 5000);
    };
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkValidationErrors();
        }
    };
    const saveTokenToServer = async (Id) => {
        const payload = {
            Id: "",
            WebFCMTokenID: fireBaseToken,
            CurrentAstrologerId: Id,
        };
        try {
            await axios.post(url === "https://astrocall.live"
                ? "https://api.astrocall.live/api/Users/UpdateWebFCMToken"
                : "https://liveapi.astrocall.live/api/Users/UpdateWebFCMToken", payload);
        }
        catch (error) {
            console.error("❌ Token save failed:", error);
        }
    };
    return (<>
      <SEO title="Astrologer Login - AstroCall" description="Login to your astrologer account and start consultations" type="website" canonical="https://astrocall.live/astrologer-login" schema={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Astrologer Login - AstroCall",
            description: "Login to your astrologer account and start consultations",
            url: "https://astrocall.live/astrologer-login"
        }}/>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-orange-400" style={{ position: 'relative' }}>
        <div className="bg-white shadow-lg rounded-xl p-6 w-full border-t-4 border-orange-500" style={{ maxWidth: '24rem' }}>
          <ul className="list-none flex gap-3">
            <li>
              <img src="/images/logo1.webp" className="w-16 mb-5" alt="AstroCall Logo"/>
            </li>
            <li>
              <p className="font-[600]" style={{ fontSize: '33px' }}>AstroCall</p>
              <p className="font-[500]" style={{ fontSize: '13px' }}>Consult Online Astrologers AstroCall</p>
            </li>
          </ul>

          {numstatus && (<>
              <h4 className="text-center text-lg font-semibold text-orange-600">Login with Phone Number</h4>
              <div className="mt-4">
                <label className="block text-sm text-gray-700">Enter your phone number</label>
                <div className="flex mt-1 border rounded-lg items-center overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-orange-400">
                  <div className="flex items-center pl-3 ml-2">
                    <img width={25} src="/images/indian.webp" alt="India Flag"/>
                    <span className="text-gray-600 ml-2">+91</span>
                    <input type="tel" inputMode="numeric" id="phoneNumber" name='phoneNumber' value={value?.phoneNumber} onChange={HandleChangeInput} onKeyDown={handleKeyDown} maxLength={10} placeholder="Enter Mobile Number" className="w-full p-2 outline-none" required autoFocus/>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }} className="">
                  {errors?.phoneNumber && <p style={{ color: 'red', fontSize: '13px', margin: '0px' }} className="error-message">{errors?.phoneNumber}</p>}
                  {errorMessModel && (<div style={{ color: 'red', fontSize: '13px', margin: '0px' }}> {errorMessModel} </div>)}
                </div>
                <button type="submit" className="mt-4 w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2" onClick={checkValidationErrors}>
                  GET OTP ➜
                </button>
              </div>
              <p className="text-xs text-gray-600 text-center mt-2">
                By signing in, you agree to our
                <button onClick={() => window.open('/terms-of-use', '_blank')} className="text-orange-500 font-semibold hover:underline">
                  terms and conditions
                </button>
              </p>
              <p className="text-sm text-center mt-2">
                Don't have an account?
                <button onClick={() => router.push('/astrologer-register')} className="text-orange-500 font-semibold ml-1 hover:underline">
                  Sign Up
                </button>
              </p>
            </>)}

          <div>
            {sendOtp && (<>
                <p className="text-center text-sm text-gray-600">
                  You will receive a 4 digit code for verification
                </p>
                <div style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <h5 className="font-[500] mt-1">OTP sent to +91-<span>{value?.phoneNumber}</span></h5>
                </div>

                <div className="mb-3 flex flex-col items-center justify-between">
                  <div className='py-2'>
                    <OTPInput value={mobileOtp} onChange={handleOtpChange} shouldAutoFocus numInputs={4} inputStyle={{ width: '3rem', height: '3rem', border: '1px solid #ccc', borderRadius: '6px', marginRight: '12px' }} renderInput={(props) => <input {...props} inputMode="numeric"/>}/>
                  </div>
                  {errorMessage && (<div style={{ color: 'red', marginTop: '10px', fontSize: '12px', textAlign: 'center' }}>
                      {errorMessage}
                    </div>)}

                  <button className="mt-4 w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2" type="submit" disabled={!mobileOtp} onClick={() => OtpVerify(mobileOtp)} onKeyDown={(e) => {
                if (e.key === "Enter" && mobileOtp?.length >= 4) {
                    OtpVerify(mobileOtp);
                }
            }}>
                    LOGIN
                  </button>
                  {sec === '01' ? '' : <div style={{ fontSize: "13px" }} className="py-2"> OTP Expires in: {min}:{sec}</div>}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {!expireOtp ? (<label style={{ color: 'blue' }}>Resend OTP available <span id="timeRemain"></span> </label>) : (<></>)}

                  {!expireOtp ? (<button style={{ padding: "2.9px" }} className=" bg-orange-500 text-white text-[14px] rounded-md hover:bg-orange-600" onClick={() => { Get_OTP(); setMobileOtp(''); setErrorMessage(""); }}>
                      Resend OTP
                    </button>) : (<></>)}
                </div>
              </>)}
          </div>
        </div>

        <div className="my-4" style={{ position: 'absolute', bottom: '0' }}>
          <div className="text-center">
            <h6 className="text-gray-800">© Copyright 2025 by Astrocall Live Services Private Limited. All rights reserved.</h6>
          </div>
        </div>
      </div>

      <CustomModal isOpen={isPopUPOpen} onClose={() => setIsPopupOpen(false)} title="Status">
        <div className="text-center py-4">
          <p>Operation completed successfully!</p>
        </div>
      </CustomModal>
    </>);
};
export default AstrologerLogin;
