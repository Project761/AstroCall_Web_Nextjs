"use client";

import { useState, useRef, useEffect } from "react";
import OTPInput from "react-otp-input";
import {
  FaShieldAlt,
  FaUsers,
  FaLock,
  FaPencilAlt,
  FaChevronDown,
  FaCommentDots,
} from "react-icons/fa";
import { toastifySuccess } from "../../utils/utility";
import { getPostData, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import axios from "axios";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import Image from "next/image";
import { ORANGE, CREAM_ALT } from "@/app/lib/siteTheme";
import socketService from "@/app/services/socketService";
import { notifyUserSessionChange } from "@/app/lib/wsUrl";

const LOGIN_TRUST = [
  { icon: FaShieldAlt, title: "100% Secure" },
  { icon: FaCommentDots, title: "Chat, Call & Consult" },
  { icon: FaUsers, title: "20L+ Happy Users" },
];

function formatPhoneDisplay(num) {
  if (!num || num.length < 10) return `+91 ${num}`;
  return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
}

function BrandHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <Image src="/images/logo1.webp" alt="AstroCall" width={52} height={52} className="rounded-xl" />
      <p className="font-heading mt-3 text-[1.35rem] font-extrabold tracking-tight" style={{ color: ORANGE }}>
        AstroCall
      </p>
      <p className="font-body mt-0.5 text-[11px] text-gray-500">Your Guide to a Better Tomorrow</p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-orange-200" />
        <span className="text-[10px] leading-none" style={{ color: ORANGE }}>
          ✦
        </span>
        <span className="h-px w-10 bg-orange-200" />
      </div>
    </div>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onSignUpClick,
}) {
  const {
    loginUserData,
    loadingUserData,
    Get_SingleData_User,
    setisLogin,
    setUserLoginId,
  } = useMenuContext();

  const [phone, setPhone] = useState("");
  const [enteredOtp, setenteredOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(false);
  const [expireOtp, setExpireOtp] = useState(false);
  const [numstatus, setnumstatus] = useState(true);

  const [errors, setErrors] = useState({ phone: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const [sec, setSec] = useState("00");
  const [min, setMin] = useState("00");
  const [timerOn, setTimerOn] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [NamePopUpStatus, setNamePopUpStatus] = useState(false);
  const [name, setName] = useState("");
  const [nameerror, setnameerror] = useState("");

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const UserLoginId =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginId") || ""
      : "";

  const isRegister = isOpen === "register";

  const startTimer = (duration) => {
    let remaining = duration;
    clearInterval(timerRef.current);

    const countdown = () => {
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setTimerOn(false);
        setExpireOtp(true);
        setMin("00");
        setSec("00");
        return;
      }

      setMin(Math.floor(remaining / 60).toString().padStart(2, "0"));
      setSec((remaining % 60).toString().padStart(2, "0"));
      remaining--;
    };

    countdown();
    timerRef.current = setInterval(countdown, 1000);
  };

  useEffect(() => {
    if (timerOn) startTimer(60);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  useEffect(() => {
    if (!loadingUserData && loginUserData && UserLoginId) {
      const fullNameMissing =
        !loginUserData?.FullName || loginUserData?.FullName?.trim() === "";
      queueMicrotask(() => setNamePopUpStatus(fullNameMissing));
    }
  }, [loadingUserData, loginUserData, UserLoginId]);

  useEffect(() => {
    if (numstatus && inputRef.current) inputRef.current.focus();
  }, [numstatus]);

  const resetForm = () => {
    setnumstatus(true);
    setOtpStatus(false);
    setPhone("");
    setenteredOtp("");
    setErrorMessage("");
    setErrors({});
    setExpireOtp(false);
    setTimerOn(false);
    setMin("00");
    setSec("00");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (enteredOtp && enteredOtp.length === 4) {
        OtpVerify(enteredOtp);
      } else {
        checkValidationErrors();
      }
    }
  };

  const checkValidationErrors = () => {
    const newErrors = {};
    if (!phone) {
      newErrors.phone = "Please Enter Your Mobile Number *";
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits *";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) Check_Mobile_Registered();
  };

  const handleOtpChange = (otp) => {
    setenteredOtp(otp);
    if (otp?.length === 4) {
      setTimeout(() => OtpVerify(otp), 100);
    }
  };

  const HandleChangeNumber = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    setPhone(numericValue);
    setErrors({});
    setErrorMessage("");
  };

  const goBackToPhone = () => {
    setOtpStatus(false);
    setnumstatus(true);
    setenteredOtp("");
    setTimerOn(false);
    setErrorMessage("");
  };

  const Check_Mobile_Registered = async () => {
    try {
      setIsLoading(true);
      const val = { MobileNo: phone };
      const res = await getPostData("Astrologer/CheckIfMobileRegistered", val);

      if (res[0]?.Message === "Astrologer Found") {
        setPhone("");
        setErrorMessage("Number is not Registered with the User Account.");
      } else if (
        res[0]?.Message === "User Found" ||
        res[0]?.Message === "No data available"
      ) {
        Get_OTP();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const Get_OTP = async () => {
    try {
      const val = { MobileNo: phone };
      const res = await axios.post(
        "https://liveapi.astrocall.live/api/SMS/GetData_SMS",
        val
      );

      if (res?.data?.success === true) {
        setExpireOtp(false);
        setTimerOn(true);
        setnumstatus(false);
        setOtpStatus(true);
        setenteredOtp("");
        setErrorMessage("");
        toastifySuccess("OTP sent successfully!");
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const OtpVerify = async (otp) => {
    if (expireOtp) {
      setErrorMessage("The OTP has expired. Please request a new one.");
      return;
    }

    try {
      const val = { Otp: otp, MobileNo: phone };
      const res = await getPostData("SMS/Check_Otp", val);

      if (res[0]?.Status === true || res[0]?.Status === "true") {
        await Get_astro();
        setenteredOtp("");
        setnumstatus(true);
        setOtpStatus(false);
      } else {
        setErrorMessage("The OTP you've entered is incorrect. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("OTP verification failed. Please try again.");
    }
  };

  

  const Get_astro = async () => {
    try {
      const val = {
        MobileNo: phone,
        grant_type: "password",
        Type: "U",
        Medium: "Web",
      };

      const res = await getPostData("/Astrologer/Astrologer_Login", val);

      if (res?.error === "204") {
        setErrorMessage("No user found. Please check your number.");
      } else if (res && res.length > 0) {
        const userData = res[0];

        if (
          userData?.error === "200" &&
          userData?.error_description === "Successfully Login"
        ) {
          if (userData?.Astro === "0") {
            localStorage.setItem("UserLoginId", userData?.ID);
            localStorage.setItem("LoginTokenData", JSON.stringify(userData));
            localStorage.setItem("IsLogin", true);
            localStorage.setItem("access_token", userData?.access_token);
            localStorage.setItem("refresh_token", userData?.refresh_token);

            setUserLoginId(String(userData?.ID));
            setisLogin(true);
            socketService.connectUser(String(userData?.ID));
            socketService.setupVisibilityHandler(String(userData?.ID), null);
            notifyUserSessionChange();
            await Get_SingleData_User(userData?.ID);

            const fullNameMissing =
              !userData?.FullName || userData?.FullName?.trim() === "";

            if (fullNameMissing) {
              setNamePopUpStatus(true);
            } else {
              toastifySuccess("Login successful! Welcome to AstroCall.");
              if (onLoginSuccess) onLoginSuccess(userData);
              handleClose();
            }
          } else if (userData?.Astro === "1") {
            setErrorMessage("Number is not Registered with User Account.");
            setPhone("");
          }
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("No user found. Please check your number.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const Update_User_Data = async () => {
    if (!name || name?.trim() === "") {
      setnameerror("Please Enter Your Name");
      return;
    }
    if (!/^[A-Za-z ]+$/.test(name)) {
      setnameerror("Only alphabets are allowed");
      return;
    }

    try {
      const val = {
        MobileNo: phone,
        FirstName: name,
        UserID: UserLoginId,
      };

      const updateRes = await TokenWithDeleteUpadateAdd("User/Update_User", val);

      if (updateRes) {
        await Get_SingleData_User(UserLoginId);
        toastifySuccess("Name updated successfully!");
        setNamePopUpStatus(false);
        setName("");
        setnameerror("");
        if (onLoginSuccess) onLoginSuccess(loginUserData);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      setnameerror("Failed to update name. Please try again.");
    }
  };

  const NamePopUp = () =>
    NamePopUpStatus && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1A1A1A]">Complete Your Profile</h2>
              <p className="text-sm text-[#666]">Add your name to complete login.</p>
            </div>
            <button type="button" onClick={() => setNamePopUpStatus(false)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <label className="mb-2 block text-xs font-medium text-[#666]">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100"
            value={name}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[A-Za-z ]*$/.test(val)) {
                setName(val);
                setnameerror("");
              } else {
                setnameerror("Only alphabets are allowed");
              }
            }}
          />
          {nameerror && <p className="mt-2 text-sm text-red-500">{nameerror}</p>}
          <button
            type="button"
            className="mt-6 w-full rounded-xl py-3 text-sm font-bold text-white"
            style={{ backgroundColor: ORANGE }}
            onClick={Update_User_Data}
          >
            Submit
          </button>
        </div>
      </div>
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 text-lg leading-none text-gray-400 transition hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="px-6 pb-2 pt-7">
          <BrandHeader />

          {numstatus && (
            <div className="mt-6 text-center">
              <h2 className="font-heading text-[1.65rem] font-bold leading-tight text-[#1A1A1A]">
                {isRegister ? "Create Account" : "Login / Join"}
              </h2>
              <p className="font-body mt-2 text-sm text-gray-500">
                {isRegister ? "Sign up to start your cosmic journey" : "Enter your mobile number to continue"}
              </p>

              <div className="mt-5 text-left">
                <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-[#FAFAFA] focus-within:border-[#FF5C00] focus-within:ring-2 focus-within:ring-orange-100">
                  <div className="flex shrink-0 items-center gap-1 border-r border-gray-200 bg-[#F3F4F6] px-3 py-3.5 text-sm font-semibold text-[#333]">
                    +91 <FaChevronDown className="text-[10px] text-gray-400" />
                  </div>
                  <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    autoFocus
                    onChange={HandleChangeNumber}
                    maxLength={10}
                    placeholder="Enter Mobile Number"
                    className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-[#1A1A1A] outline-none placeholder:text-gray-400"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {(errors?.phone || errorMessage) && (
                  <p className="mt-2 text-center text-xs text-red-500">{errors?.phone || errorMessage}</p>
                )}

                <button
                  type="button"
                  className="font-heading mt-4 flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60"
                  style={{ backgroundColor: ORANGE }}
                  onClick={checkValidationErrors}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Sending OTP..." : "Get OTP"}</span>
                  <span className="text-lg leading-none">→</span>
                </button>

                <p className="font-body mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-500">
                  <FaLock className="shrink-0 text-[10px] text-gray-400" />
                  We will send you a 4 digit OTP to verify your number
                </p>

                {!isRegister && onSignUpClick && (
                  <p className="mt-4 text-center text-xs text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={onSignUpClick} className="font-semibold hover:underline" style={{ color: ORANGE }}>
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {otpStatus && (
            <div className="mt-6 text-center">
              <h2 className="font-heading text-[1.65rem] font-bold leading-tight text-[#1A1A1A]">Verify OTP</h2>
              <p className="font-body mt-3 text-sm leading-relaxed text-gray-500">
                We have sent a 4 digit OTP to{" "}
                <span className="font-semibold text-[#333]">{formatPhoneDisplay(phone)}</span>{" "}
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
                  value={enteredOtp}
                  onChange={handleOtpChange}
                  numInputs={4}
                  shouldAutoFocus
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
                {expireOtp ? (
                  <button
                    type="button"
                    onClick={() => {
                      Get_OTP();
                      setenteredOtp("");
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
                className="font-heading mt-5 flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: ORANGE }}
                disabled={expireOtp || enteredOtp?.length < 4}
                onClick={() => OtpVerify(enteredOtp)}
              >
                <span>Verify &amp; Continue</span>
                <span className="text-lg leading-none">→</span>
              </button>
            </div>
          )}
        </div>

        {numstatus ? (
          <div className="mt-4 px-4 py-4" style={{ backgroundColor: CREAM_ALT }}>
            <div className="grid grid-cols-3 divide-x divide-orange-200/70">
              {LOGIN_TRUST.map(({ icon: Icon, title }) => (
                <div key={title} className="flex flex-col items-center px-2 text-center">
                  <Icon className="text-base" style={{ color: ORANGE }} />
                  <p className="font-body mt-1.5 text-[10px] font-semibold leading-tight text-[#333]">{title}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-2 px-4 py-4" style={{ backgroundColor: CREAM_ALT }}>
            <FaShieldAlt className="text-sm" style={{ color: ORANGE }} />
            <p className="font-body text-[11px] font-medium text-gray-600">
              Your privacy &amp; security is our priority
            </p>
          </div>
        )}
      </div>

      {NamePopUp()}
    </div>
  );
}
