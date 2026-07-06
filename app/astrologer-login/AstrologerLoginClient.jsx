"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import OTPInput from "react-otp-input";
import Image from "next/image";
import Link from "next/link";
import {
  FaShieldAlt,
  FaLock,
  FaChevronDown,
  FaCommentDots,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";
import { postWithToken, loginApi, saveAuthToken, getPostData, postData } from "@/app/utils/api";
import { toastifySuccess, toastifyError } from "@/app/utils/utility";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { CREAM, CREAM_ALT, ORANGE } from "@/app/lib/siteTheme";

const LEFT_FEATURES = [
  {
    icon: FaShieldAlt,
    title: "100% Secure",
    sub: "Your privacy and data is completely safe with us.",
  },
  {
    icon: FaCommentDots,
    title: "Connect & Consult",
    sub: "Chat, Call & Consult with thousands of customers.",
  },
  {
    icon: FaUserPlus,
    title: "Grow Your Business",
    sub: "Get more visibility and grow your astrology business.",
  },
];

const LOGIN_TRUST = [
  { icon: FaShieldAlt, title: "100% Secure" },
  { icon: FaCommentDots, title: "Chat, Call & Consult" },
  { icon: FaUsers, title: "20L+ Happy Users" },
];

function formatPhoneDisplay(num) {
  if (!num || num.length < 10) return `+91 ${num}`;
  return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
}

function BrandHeader({ compact = false }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        src="/images/logo1.webp"
        alt="AstroCall"
        width={compact ? 46 : 52}
        height={compact ? 46 : 52}
        className="rounded-xl"
      />
      <p
        className={`font-heading font-extrabold tracking-tight ${compact ? "mt-2 text-xl" : "mt-3 text-[1.35rem]"}`}
        style={{ color: ORANGE }}
      >
        AstroCall
      </p>
      <p className="font-body mt-0.5 text-[11px] text-gray-500">Your Guide to a Better Tomorrow</p>
      <div className={`flex items-center justify-center gap-2 ${compact ? "mt-2.5" : "mt-4"}`}>
        <span className="h-px w-10 bg-orange-200" />
        <span className="text-[10px] leading-none" style={{ color: ORANGE }}>
          ✦
        </span>
        <span className="h-px w-10 bg-orange-200" />
      </div>
    </div>
  );
}

const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AstrologerLogin = () => {
  const router = useRouter();
  const { Get_SingleData_Astrologer } = useMenuContext();

  const fireBaseToken = typeof window !== "undefined" ? sessionStorage.getItem("fireBaseToken") || "" : "";
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const [sendOtp, setSendOtp] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [numstatus, setnumstatus] = useState(true);
  const [value, setValue] = useState({ phoneNumber: "" });
  const [errors, setErrors] = useState({ phoneNumber: "" });
  const [sec, setSec] = useState("00");
  const [min, setMin] = useState("00");
  const [timerOn, setTimerOn] = useState(false);
  const [isPopUPOpen, setIsPopupOpen] = useState(false);
  const [expireOtp, setExpireOtp] = useState(true);
  const [errorMessModel, setErrorMessModel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [AddAstroId, setAddAstroId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("activeMenu");
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (numstatus && inputRef.current) inputRef.current.focus();
  }, [numstatus]);

  const handleOtpChange = (otp) => {
    setMobileOtp(otp);
    if (otp?.length === 4) {
      OtpVerify(otp);
    }
  };

  const HandleChangeInput = (e) => {
    if (e.target.name === "phoneNumber") {
      const ele = e.target.value.replace(/[^0-9]/g, "");
      setValue({ ...value, [e.target.name]: ele });
      setErrorMessModel("");
    }
  };

  const checkValidationErrors = () => {
    const newErrors = {};
    if (!value?.phoneNumber) {
      newErrors.phoneNumber = "Please enter your phone number";
    } else if (value?.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      Check_Mobile_Registered();
    }
  };

  const startTimer = (duration) => {
    let remaining = duration;
    clearInterval(timerRef.current);
    const countdown = () => {
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setTimerOn(false);
        setExpireOtp(false);
        setMin("00");
        setSec("00");
        return;
      }
      setMin(Math.floor(remaining / 60).toString().padStart(2, "0"));
      setSec((remaining % 60).toString().padStart(2, "0"));
      remaining -= 1;
    };
    countdown();
    timerRef.current = setInterval(countdown, 1000);
  };

  useEffect(() => {
    if (timerOn) startTimer(60);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const otpExpired = sec === "00" && min === "00" && !timerOn && sendOtp;
  const displayMobileOtp = otpExpired ? "" : mobileOtp;

  const Check_Mobile_Registered = async () => {
    setIsLoading(true);
    try {
      const val = { MobileNo: value?.phoneNumber };
      const res = await getPostData("Astrologer/CheckIfMobileRegistered", val);
      if (res?.[0]?.Message === "Astrologer Found" || res?.[0]?.Message === "No data available") {
        Get_OTP();
      } else if (res?.[0]?.Message === "User Found") {
        setErrorMessModel("This number is registered as a user account, not an astrologer.");
        setValue({ ...value, phoneNumber: "" });
      }
    } catch (error) {
      console.log("Error in Check_Mobile_Registered:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Get_OTP = async () => {
    try {
      const { phoneNumber } = value;
      const val = { MobileNo: phoneNumber };
      const res = await getPostData("SMS/GetData_SMS", val);
      if (res?.success === true || res?.[0]?.success === true || (res && res.length > 0 && res[0].success === true)) {
        setExpireOtp(true);
        setTimerOn(true);
        setnumstatus(false);
        setSendOtp(true);
        setErrorMessage("");
      } else {
        try {
          const res2 = await postData("SMS/GetData_SMS", val);
          if (res2?.success === true) {
            setExpireOtp(true);
            setTimerOn(true);
            setnumstatus(false);
            setSendOtp(true);
            setErrorMessage("");
          }
        } catch (altError) {
          console.log("Alternative method also failed:", altError);
        }
      }
    } catch (error) {
      console.log("Error in Get_OTP:", error);
    }
  };

  const OtpVerify = async (otp) => {
    if (!expireOtp) {
      setErrorMessage("The OTP has expired. Please request a new one.");
      return;
    }
    try {
      const { phoneNumber } = value;
      const val = { Otp: otp, MobileNo: phoneNumber };
      const res = await postWithToken("SMS/Check_Otp", val);
      if (res?.[0]?.Status === true || res?.[0]?.Status === "true") {
        Get_astro();
      } else {
        setErrorMessage("The OTP you entered is incorrect. Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Get_astro = async () => {
    const val = {
      MobileNo: value?.phoneNumber,
      grant_type: "password",
      Type: "A",
      Medium: "Web",
    };
    try {
      const Resdata = await loginApi(val);
      if (
        Resdata?.[0]?.userName === "" &&
        Resdata?.[0]?.IsVerified === "0" &&
        Resdata?.[0]?.FullName === "" &&
        Resdata?.[0]?.error === "200"
      ) {
        router.push("/astrologer-register");
        saveAuthToken(Resdata[0]);
        setAddAstroId(Resdata[0]?.Astro);
      } else if (Resdata?.[0]?.userName?.length > 0 && Resdata?.[0]?.IsVerified === "1") {
        saveAuthToken(Resdata[0]);
        setAddAstroId(Resdata[0]?.Astro);
        Get_SingleData_Astrologer(Resdata[0]?.Astro);
        setSendOtp(false);
        toastifySuccess("Successfully LogIn");
        router.push("/astrologer-panel/dashboard");
      } else if (
        Resdata?.[0]?.IsVerified === "0" &&
        Resdata?.[0]?.error === "200" &&
        Resdata?.[0]?.userName?.length > 0
      ) {
        saveAuthToken(Resdata[0]);
        setAddAstroId(Resdata[0]?.Astro);
        router.push("/astrologer-panel/profile");
      } else if (
        Resdata?.[0]?.Astro === "0" &&
        Resdata?.[0]?.ID === "0" &&
        Resdata?.[0]?.error_description === "Blocked Your Id .Please Contact to Admin."
      ) {
        toastifyError("Blocked Your Id .Please Contact to Admin.");
        setValue({ ...value, phoneNumber: "" });
        setnumstatus(true);
        setSendOtp(false);
        setMobileOtp("");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        try {
          const parseData = JSON.parse(data?.data);
          const Resdata = parseData?.Table;
          if (Resdata?.[0]?.error_description === "Blocked Your Id .Please Contact to Admin.") {
            toastifyError("Blocked Your Id .Please Contact to Admin.");
            setValue({ ...value, phoneNumber: "" });
            setnumstatus(true);
            setSendOtp(false);
            setMobileOtp("");
          }
        } catch (parseError) {
          console.error("Failed to parse error data", parseError);
          toastifyError("Unexpected error response format.");
        }
      } else if (error.request) {
        toastifyError("No response from server. Please check your internet connection.");
      } else {
        toastifyError("Request error: " + error.message);
      }
    }
  };

  const goBackToPhone = () => {
    setSendOtp(false);
    setnumstatus(true);
    setMobileOtp("");
    setErrorMessage("");
    clearInterval(timerRef.current);
    setTimerOn(false);
    setMin("00");
    setSec("00");
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
      await postWithToken("Users/UpdateWebFCMToken", payload);
    } catch (error) {
      console.error("Token save failed:", error);
    }
  };

  return (
    <>
      <div className="relative h-dvh overflow-hidden" style={{ backgroundColor: CREAM }}>
        <div className="main-container flex h-full items-center px-4 py-4 sm:px-6 lg:py-6">
          <div className="grid h-full max-h-[calc(100dvh-2rem)] w-full min-h-0 items-center gap-6 lg:grid-cols-[1.05fr_420px] lg:gap-10 xl:grid-cols-[1.1fr_440px] xl:gap-14">
            {/* Left — mockup */}



            <div className="relative hidden h-full min-h-0 flex-col justify-center lg:flex lg:pr-4 xl:pr-8">
              <h1 className="font-heading shrink-0 text-[clamp(2rem,3.2vw,2.75rem)] font-bold leading-[1.15] text-[#1A1A1A]">
                Astrologer <span style={{ color: ORANGE }}>Login</span>
              </h1>
              <p className="font-body mt-3 max-w-[34rem] shrink-0 text-[clamp(0.8125rem,1.15vw,0.9375rem)] leading-relaxed text-gray-600">
                Welcome back! Please login to your account to manage your profile, connect with your clients, and grow
                your astrology business with AstroCall.
              </p>

              <ul className="mt-5 shrink-0 space-y-4 xl:mt-6 xl:space-y-5">
                {LEFT_FEATURES.map(({ icon: Icon, title, sub }) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E6] xl:h-11 xl:w-11">
                      <Icon className="text-sm xl:text-base" style={{ color: ORANGE }} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-heading text-sm font-bold text-[#1A1A1A] xl:text-base">{title}</p>
                      <p className="font-body mt-0.5 text-xs leading-relaxed text-gray-500">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none relative mt-4 min-h-[10rem] w-full max-w-[74rem] flex-1 xl:min-h-[12rem]">
                <Image
                  src="/images/AstrologerLogin.png"
                  alt="Astrology illustration"
                  fill
                  className="object-contain object-left-bottom"
                  sizes="(max-width: 1280px) 520px, 640px"
                  priority
                />
              </div>
            </div>

            {/* Right — login card */}
            <div className="mx-auto flex w-full max-w-[400px] items-center justify-center lg:mx-0 lg:max-h-[calc(100dvh-2rem)]">
              <div className="w-full overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                <div className="px-6 pb-2 pt-7 sm:px-7 sm:pt-8">
                  <BrandHeader compact={sendOtp} />

                  {numstatus && (
                    <div className="mt-6 text-center">
                      <h2 className="font-heading text-[1.65rem] font-bold leading-tight text-[#1A1A1A]">
                        Astrologer Login
                      </h2>
                      <p className="font-body mt-2 text-sm text-gray-500">Enter your mobile number to continue</p>

                      <div className="mt-5 text-left">
                        <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-[#FAFAFA] focus-within:border-[#FF5C00] focus-within:ring-2 focus-within:ring-orange-100">
                          <div className="flex shrink-0 items-center gap-1 border-r border-gray-200 bg-[#F3F4F6] px-3 py-3.5 text-sm font-semibold text-[#333]">
                            +91 <FaChevronDown className="text-[10px] text-gray-400" />
                          </div>
                          <input
                            ref={inputRef}
                            type="tel"
                            inputMode="numeric"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={value?.phoneNumber}
                            onChange={HandleChangeInput}
                            onKeyDown={handleKeyDown}
                            maxLength={10}
                            placeholder="Enter Mobile Number"
                            className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-[#1A1A1A] outline-none placeholder:text-gray-400"
                            autoFocus
                            required
                          />
                        </div>

                        {(errors?.phoneNumber || errorMessModel) && (
                          <p className="mt-2 text-center text-xs text-red-500">
                            {errors?.phoneNumber || errorMessModel}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={checkValidationErrors}
                          disabled={isLoading}
                          className="font-heading mt-4 flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60"
                          style={{ backgroundColor: ORANGE }}
                        >
                          <span>{isLoading ? "Sending OTP..." : "Get OTP"}</span>
                          <span className="text-lg leading-none">→</span>
                        </button>

                        <p className="font-body mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-500">
                          <FaLock className="shrink-0 text-[10px] text-gray-400" />
                          We will send you a 4 digit OTP to verify your number
                        </p>
                        <Link
                          href="/"
                          className="font-body mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-500"
                          style={{ color: ORANGE }}
                        >
                          Back to Home
                        </Link>
                      </div>
                    </div>
                  )}

                  {sendOtp && !numstatus && (
                    <div className="mt-6 text-center">
                      <h2 className="font-heading text-[1.65rem] font-bold leading-tight text-[#1A1A1A]">Verify OTP</h2>
                      <p className="font-body mt-3 text-sm leading-relaxed text-gray-500">
                        We have sent a 4 digit OTP to{" "}
                        <span className="font-semibold text-[#333]">{formatPhoneDisplay(value?.phoneNumber)}</span>{" "}
                        <button
                          type="button"
                          onClick={goBackToPhone}
                          className="font-semibold hover:underline"
                          style={{ color: ORANGE }}
                        >
                          Change
                        </button>
                      </p>

                      <div className="mt-6 flex justify-center">
                        <OTPInput
                          value={displayMobileOtp}
                          onChange={handleOtpChange}
                          shouldAutoFocus
                          numInputs={4}
                          inputType="tel"
                          renderSeparator={<span className="w-1.5 sm:w-2" />}
                          inputStyle={{
                            width: "2.5rem",
                            height: "2.75rem",
                            border: "1.5px solid #E5E7EB",
                            borderRadius: "10px",
                            fontSize: "1.05rem",
                            fontWeight: "700",
                            color: "#1A1A1A",
                            backgroundColor: "#fff",
                          }}
                          renderInput={(props) => (
                            <input
                              {...props}
                              inputMode="numeric"
                              className="text-center outline-none transition focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100"
                            />
                          )}
                        />
                      </div>

                      {errorMessage && (
                        <p className="mt-3 text-center text-xs text-red-500">{errorMessage}</p>
                      )}

                      <p className="mt-4 text-center text-xs text-gray-500">
                        Didn&apos;t receive OTP?{" "}
                        {!expireOtp ? (
                          <button
                            type="button"
                            onClick={() => {
                              Get_OTP();
                              setMobileOtp("");
                              setErrorMessage("");
                            }}
                            className="font-semibold hover:underline"
                            style={{ color: ORANGE }}
                          >
                            Resend OTP
                          </button>
                        ) : (
                          <span className="font-semibold" style={{ color: ORANGE }}>
                            Resend OTP in {min}:{sec}
                          </span>
                        )}
                      </p>

                      <button
                        type="button"
                        disabled={!expireOtp || !displayMobileOtp || displayMobileOtp.length < 4}
                        onClick={() => OtpVerify(displayMobileOtp)}
                        className="font-heading mt-5 flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: ORANGE }}
                      >
                        <span>Verify &amp; Continue</span>
                        <span className="text-lg leading-none">→</span>
                      </button>
                    </div>
                  )}
                </div>

                {numstatus ? (
                  <div className="px-4 py-4 sm:px-5 sm:py-4" style={{ backgroundColor: CREAM_ALT }}>
                    <div className="grid grid-cols-3 divide-x divide-orange-200/70">
                      {LOGIN_TRUST.map(({ icon: Icon, title }) => (
                        <div key={title} className="flex flex-col items-center px-2 text-center">
                          <Icon className="text-base" style={{ color: ORANGE }} />
                          <p className="font-body mt-1.5 text-[10px] font-semibold leading-tight text-[#333]">
                            {title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center gap-2 px-4 py-4 sm:px-5"
                    style={{ backgroundColor: CREAM_ALT }}
                  >
                    <FaShieldAlt className="text-sm" style={{ color: ORANGE }} />
                    <p className="font-body text-[11px] font-medium text-gray-600">
                      Your privacy &amp; security is our priority
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <Link
          href="/"
          className="font-body absolute bottom-3 left-1/2 -translate-x-1/2 text-[13px] text-gray-400 hover:underline lg:bottom-6"
          style={{ color: ORANGE }}
        >
          Back to Home 
        </Link> */}
        <div className="font-body absolute bottom-3 left-1/2 -translate-x-1/2 text-[13px] text-gray-700 lg:bottom-6">
          © Copyright 2026 by Astrocall Live Services Private Limited. All rights reserved..
        </div>

      </div>

      <CustomModal isOpen={isPopUPOpen} onClose={() => setIsPopupOpen(false)} title="Status">
        <div className="py-2 text-center text-sm text-gray-600">
          <p>Operation completed successfully!</p>
        </div>
      </CustomModal>
    </>
  );
};

export default AstrologerLogin;
