"use client";

import { useState, useRef, useEffect } from "react";
import OTPInput from "react-otp-input";
import { toastifySuccess } from "../../utils/utility";
import { getPostData } from "@/app/utils/api";
import axios from "axios";
import { useMenuContext } from "@/app/hooks/useMenuContext";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {

  const { loginUserData, loadingUserData, Get_SingleData_User } = useMenuContext();


  const [phone, setPhone] = useState("");
  const [enteredOtp, setenteredOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(false);
  const [expireOtp, setExpireOtp] = useState(true);
  const [numstatus, setnumstatus] = useState(true);
  const [errors, setErrors] = useState({ phone: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [sec, setSec] = useState("00");
  const [min, setMin] = useState("00");
  const [timerOn, setTimerOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  let timerId;

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
      setenteredOtp('');
      setExpireOtp(false);
    }
  }, [sec]);

  useEffect(() => {
    if (numstatus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [numstatus]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkValidationErrors();
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
    if (Object.keys(newErrors).length === 0) {
      Check_Mobile_Registered();
    }
  };

  const handleOtpChange = (otp) => {
    setenteredOtp(otp);
    if (otp?.length === 4) {
      OtpVerify(otp);
    }
  };

  const HandleChangeNumber = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    setPhone(numericValue);
  };

  const Check_Mobile_Registered = async () => {
    try {
      const val = { MobileNo: phone };
      const res = await getPostData("Astrologer/CheckIfMobileRegistered", val);
      // console.log(res, 'res')
      if (res[0]?.Message === "Astrologer Found") {
        // console.log("click1")
        setPhone("");
        setErrorMessage("Number is not Registered with the User Account.");
      } else if (res[0]?.Message === "User Found") {
        // console.log("click2")
        Get_OTP()
      } else if (res[0]?.Message === "No data available") {
        Get_OTP()
        console.log("click3")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Get_OTP = async () => {
    try {
      const val = { MobileNo: phone };

      // Use the actual SMS API endpoint
      const res = await axios.post("https://liveapi.astrocall.live/api/SMS/GetData_SMS", val);
      // console.log(res,'res')
      if (res?.data?.success === true) {
        // setTime(59);
        setExpireOtp(true);
        setTimerOn(true);
        setnumstatus(false);
        setOtpStatus(true);
        toastifySuccess("OTP sent successfully!");
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };

  const OtpVerify = async (enteredOtp) => {
    if (!expireOtp) {
      setErrorMessage("The OTP has expired. Please request a new one.");
      return;
    }

    try {
      const val = { Otp: enteredOtp, MobileNo: phone };

      // Use the actual API endpoint
      const res = await getPostData('SMS/Check_Otp', val);

      // const res = await response.json();
      // console.log(res);
      if (res[0]?.Status === true || res[0]?.Status === "true") {
        Get_astro();
        setPhone("");
        setenteredOtp("");
        onClose();
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
        "MobileNo": phone,
        "grant_type": "password",
        "Type": "U",
        "Medium": "Web"
      };

      const visitor_Id = localStorage.getItem("visitor_Id") || "web_user";

      // Use the actual API endpoint
      const res = await getPostData('/Astrologer/Astrologer_Login', val);

      if (res?.error === "204" || res?.error === "204") {
        setErrorMessage("No user found. Please check your number.");
      } else if (res && res.length > 0) {
        const userData = res[0];

        if (userData?.error === "200" && userData?.error_description === "Successfully Login") {
          if (userData?.Astro === "0") {
            // User login successful
            Get_SingleData_User(userData?.ID);
            localStorage.setItem("UserLoginId", userData?.ID);
            localStorage.setItem("LoginTokenData", JSON.stringify(userData));
            localStorage.setItem("IsLogin", true);
            localStorage.setItem("access_token", userData?.access_token);
            localStorage.setItem("refresh_token", userData?.refresh_token);

            if (onLoginSuccess) {
              onLoginSuccess(userData);
            }

            toastifySuccess("Successfully Logged In!");
            onClose();
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
      console.log(error, 'error');
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const toggleModal = () => {
    setnumstatus(true);
    setOtpStatus(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {numstatus ? "Continue with Phone" : "Verify Phone"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {numstatus && (
            <>
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  You will receive a 4 digit code for verification
                </p>
              </div>

              <div className="flex items-center border rounded-lg mb-4">
                <div className="flex items-center px-3 border-r">
                  <span className="text-gray-600">+91</span>
                </div>
                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={HandleChangeNumber}
                  maxLength={10}
                  className="flex-1 px-4 py-3 outline-none"
                  placeholder="Enter Mobile Number"
                  autoComplete="off"
                  required
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>

              {errors?.phone && (
                <p className="text-red-500 text-sm mt-2">{errors?.phone}</p>
              )}

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}

              <button
                type="button"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                onClick={checkValidationErrors}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Get OTP'}
              </button>

              <p className="text-xs text-gray-600 mt-4 text-center">
                By signing in, you agree to our{' '}
                <button
                  onClick={() => window.open("/terms")}
                  className="text-orange-500 hover:text-orange-600 underline"
                >
                  Terms Of Use
                </button>
                {' '}and{' '}
                <button
                  onClick={() => window.open("/privacy")}
                  className="text-orange-500 hover:text-orange-600 underline"
                >
                  Privacy Policy
                </button>
              </p>
            </>
          )}

          {otpStatus && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  OTP sent to +91-{phone}
                </h3>
              </div>

              <div className="flex justify-center mb-4">
                <OTPInput
                  value={enteredOtp}
                  onChange={setenteredOtp}
                  numInputs={4}
                  shouldAutoFocus
                  separator={<span className="mx-2">--</span>}
                  inputStyle={{
                    width: "3.5rem",
                    height: "3.5rem",
                    margin: "0px 5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginTop: "20px",
                  }}
                  isInputNum
                  renderInput={(props) => <input {...props} inputMode="numeric" />}
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
              )}

              <div className="flex justify-between items-center mt-4">
                {!expireOtp ? (
                  <div className="text-sm text-blue-600">
                    Resend OTP available in <span className="font-semibold">{min}:{sec}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">OTP Expires in: {min}:{sec}</span>
                    <button
                      onClick={() => {
                        setOtpStatus(false);
                        setnumstatus(true);
                        setenteredOtp('');
                        setTimerOn(false);
                        setErrorMessage("");
                      }}
                      className="text-blue-600 underline text-sm"
                    >
                      Change Number?
                    </button>
                  </div>
                )}

                {!expireOtp && (
                  <button
                    className="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-md"
                    onClick={Get_OTP}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-colors ${enteredOtp?.length < 4
                  ? "bg-gray-300 text-gray-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                disabled={!expireOtp || enteredOtp?.length < 4}
                onClick={() => OtpVerify(enteredOtp)}
              >
                LOGIN
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
