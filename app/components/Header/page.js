"use client";

import React, { useState, useContext, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import OTPInput from "react-otp-input";

import Loader from "../LoaderPages/Loader";
import ProfileCard from "../ProfileCard/page";
import LanguageDropdown from "../LanguageDropdown/page";

import { MenuContext } from "@/app/context/MenuContext";
import { postWithToken, getPostData, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { toastifySuccess } from "@/app/utils/utility";

import { RiUserShared2Fill } from "react-icons/ri";
import { IoIosCloseCircleOutline, IoMdChatboxes } from "react-icons/io";
import { MdPhoneInTalk, MdAccessTime } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  FaWallet,
  FaHeart,
  FaGem,
  FaPray,
  FaComments,
  FaPhone,
  FaUser,
  FaHandsHelping,
  FaChevronRight,
  FaGlobeAmericas,
} from "react-icons/fa";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import { SlUserFollowing } from "react-icons/sl";

const Modal = dynamic(() => import("react-modal"), { ssr: false });

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  

  const {
    isMenuOpen,
    toggleMenu,
    setchattalkstatus,
    loginstatus,
    setLoginstatus,
    isModalOpen,
    setIsModalOpen,
    isOpen,
    setIsOpen,
    LanguageStatus,
    ws,
    HandleUser,
    ChatPopUpStatus,
    setChatPopUpStatus,
    reviewstatus,
    setreviewstatus,
    loginUserData,
    isLogin,
    setisLogin,
    loadingUserData,
    Get_SingleData_User,
    setLoginUserData,
    twominchatpopup,
    settwominchatpopup,
    popupData,
    setPopupData,
    userMessage,
    logoutOtherUser,
  } = useContext(MenuContext);

  const [UserLoginId, setUserLoginId] = useState("");
  const [url, setUrl] = useState("");
  const [showAccountBar, setShowAccountBar] = useState(false);
  const [phone, setPhone] = useState("");
  const [enteredOtp, setenteredOtp] = useState("");
  const [otpStatus, setOtpStatus] = useState(false);
  const [expireOtp, setExpireOtp] = useState(true);
  const [numstatus, setnumstatus] = useState(true);
  const [errors, setErrors] = useState({ phone: "" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessModel, setErrorMessModel] = useState("");
  const [NamePopUpStatus, setNamePopUpStatus] = useState(false);
  const [name, setName] = useState("");
  const [phonenumname, setphonenumname] = useState("");
  const [nameerror, setnameerror] = useState("");
  const [sec, setSec] = useState("00");
  const [min, setMin] = useState("00");
  const [timerOn, setTimerOn] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [clickbuttonloading, setclickbuttonloading] = useState(true);
  const [error, setError] = useState("");

  const menuRef = useRef(null);
  const ProfileCardRef = useRef(null);
  const inputRef = useRef(null);
  const toggleMenuRef = useRef(toggleMenu);
  const timerRef = useRef(null);

  const amount = loginUserData?.WalletAmt || 0;
  const page = searchParams.get("page");
  const shouldShowPopup = page !== "chat-to-astro";

  useEffect(() => {
    setUserLoginId(localStorage.getItem("UserLoginId") || "");
    setUrl(window.location.origin);
  }, []);

  useEffect(() => {
    toggleMenuRef.current = toggleMenu;
  }, [toggleMenu]);

  const startTimer = (duration) => {
    let remaining = duration;

    const countdown = () => {
      if (remaining <= 0) {
        setTimerOn(false);
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerOn]);

  useEffect(() => {
    if (sec === "01") {
      setenteredOtp("");
      setExpireOtp(false);
    }
  }, [sec]);

  useEffect(() => {
    if (!loginUserData && UserLoginId) {
      Get_SingleData_User(UserLoginId);
    }
  }, [loginUserData, UserLoginId]);

  useEffect(() => {
    if (!loadingUserData && loginUserData && UserLoginId) {
      setNamePopUpStatus(!loginUserData?.FirstName?.trim());
    }
  }, [loadingUserData, loginUserData, UserLoginId]);

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ProfileCardRef.current && !ProfileCardRef.current.contains(event.target)) {
        setShowAccountBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loginId = localStorage.getItem("UserLoginId");
    if (loginId) setisLogin(true);
  }, [setisLogin]);

  const goTo = (path) => router.push(path);

  const handleclickTalk = () => {
    router.push("/talk-to-astrologers");
    setchattalkstatus(true);
  };

  const handleclickChat = (e) => {
    e?.preventDefault();
    router.push("/chat-to-astrologers");
    setchattalkstatus(false);
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setenteredOtp("");
    setErrors({});
    setErrorMessModel("");
    setErrorMessage("");
  };

  const HandleChangeNumber = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    setphonenumname(numericValue);
    setPhone(numericValue);
  };

  const checkValidationErrors = () => {
    const newErrors = {};

    if (!phone) newErrors.phone = "Please Enter Your Mobile Number *";
    else if (phone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits *";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) Check_Mobile_Registered();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkValidationErrors();
    }
  };

  const Check_Mobile_Registered = async () => {
    try {
      const res = await getPostData("Astrologer/CheckIfMobileRegistered", {
        MobileNo: phone,
      });

      if (res[0]?.Message === "Astrologer Found") {
        setPhone("");
        setErrorMessModel("Number is not Registered with the User Account.");
      } else {
        Get_OTP();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Get_OTP = async () => {
    try {
      const res = await axios.post("SMS/GetData_SMS", { MobileNo: phone });

      if (res?.data?.success === true) {
        setExpireOtp(true);
        setTimerOn(true);
        setnumstatus(false);
        setOtpStatus(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpChange = (otp) => {
    setenteredOtp(otp);
    if (otp?.length === 4) OtpVerify(otp);
  };

  const OtpVerify = async (otpValue) => {
    if (!expireOtp) {
      setErrorMessage("The OTP has expired. Please request a new one.");
      return;
    }

    try {
      const res = await getPostData("SMS/Check_Otp", {
        Otp: otpValue,
        MobileNo: phone,
      });

      if (res[0]?.Status === true || res[0]?.Status === "true") {
        Get_astro();
      } else {
        setErrorMessage("The OTP you’ve entered is incorrect. Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Get_astro = async () => {
    try {
      const visitor_Id = localStorage.getItem("visitor_Id");

      const res = await axios.post(
        url === "https://astrocall.live"
          ? "https://api.astrocall.live/api/Astrologer/Astrologer_Login"
          : "https://liveapi.astrocall.live/api/Astrologer/Astrologer_Login",
        {
          MobileNo: phone,
          grant_type: "password",
          Type: "U",
          Medium: "Web",
        },
        {
          headers: {
            FingerPrintJsKey: visitor_Id,
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.status === 204) return;

      const parseData = JSON.parse(res?.data?.data);
      const Resdata = parseData?.Table;

      if (Resdata[0]?.Astro === "0") {
        await logoutOtherUser("user");

        localStorage.setItem("UserLoginId", Resdata[0]?.ID);
        localStorage.setItem("LoginTokenData", JSON.stringify(Resdata[0]));
        localStorage.setItem("IsLogin", "true");

        Get_SingleData_User(Resdata[0]?.ID);
        HandleUser();

        setPhone("");
        setenteredOtp("");
        setIsModalOpen(false);
        setnumstatus(true);
        setOtpStatus(false);
        setLoginstatus(true);
        setMobileMenuOpen(false);
        setShowAccountBar(false);
      } else {
        setPhone("");
        setErrorMessModel("Number is not Registered with the User Account.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addrecharge = (e) => {
    e?.preventDefault();
    router.push("/plans");
  };

  const handleLogout = async () => {
    try {
      const loginId = localStorage.getItem("UserLoginId");

      if (loginId && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(`{ "UserId":"WU${loginId}","Status":"RemoveRecord","messageId":"NewRequest"}`);
      }

      HandleUser(1);
      setLoginstatus(false);
      setisLogin(false);
      setLoginUserData("");
      setShowAccountBar(false);
      setMobileMenuOpen(false);

      const visitorId = localStorage.getItem("visitor_Id");
      sessionStorage.clear();
      localStorage.clear();

      if (visitorId) localStorage.setItem("visitor_Id", visitorId);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const profileImage = loginUserData?.ProfilePic
    ? `https://${loginUserData?.ProfilePic?.replace(/\\/g, "/")}`
    : "/images/profile-pic.webp";

  return (
    <>
      <div className="bg-white shadow-customn w-full fixed top-0 z-10">
        <div className="flex justify-between m-auto items-center main-container max-h-[90px] px-2 sm:px-4 py-2">
          <Link href="/" className="flex-shrink-0 min-w-0">
            <div className="flex items-center logo">
              <Image
                src="/images/logo1.webp"
                alt="Logo"
                width={60}
                height={60}
                className="w-[35px] sm:w-[50px] h-[35px] sm:h-[50px] aspect-[1/1] object-contain flex-shrink-0"
              />
              <span style={{ marginTop: "-10px" }} className="logo-span ml-1 sm:ml-2 text-base sm:text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
                AstroCall
              </span>
            </div>
          </Link>

          <div className="justify-end direct_links gap-6 items-center xl:flex lg:hidden hidden ml-2">
            <div className="group bg-[#ff6500] border-2 border-[#ff6500] rounded-xl text-white duration-300 hover:bg-white hover:text-[#ff6500] px-4 py-2">
              <button
                className="flex text-xs gap-1 items-center font-[600] lg:gap-3 lg:text-md Talk-to-Astrologers cursor-pointer"
                onClick={handleclickTalk}
                type="button"
              >
                Talk to an Astrologer
                <span className="text-xl icon">
                  <MdPhoneInTalk />
                </span>
              </button>
            </div>

            <div className="group bg-[#ff6500] border-2 border-[#ff6500] rounded-xl text-white duration-300 hover:bg-white hover:text-[#ff6500] px-4 py-2">
              <button
                className="flex text-xs gap-1 items-center font-[600]  lg:gap-3 lg:text-md Chat-with-Astrologers cursor-pointer"
                onClick={handleclickChat}
                type="button"
              >
                Chat with an Astrologer
                <span className="text-xl icon">
                  <IoMdChatboxes />
                </span>
              </button>
            </div>

            <div className="flex gap-4 items-center">
              {(LanguageStatus === true || LanguageStatus === "true") && <LanguageDropdown />}

              {loadingUserData ? (
                <Loader />
              ) : isLogin ? (
                <button
                  onClick={addrecharge}
                  className="inline-flex items-center gap-2 border-2 border-orange-200 rounded-md px-3 py-2 transition hover:bg-orange-50 cursor-pointer"
                  type="button"
                >
                  <FaWallet />
                  <span className="text-black">₹{amount}</span>
                </button>
              ) : null}

              <div
                ref={ProfileCardRef}
                className="text-sm account hover:cursor-pointer md:text-2xl relative"
                onClick={(e) => {
                  e.stopPropagation();
                  isLogin || loginstatus ? setShowAccountBar(!showAccountBar) : openModal();
                }}
              >
                {isLogin || loginstatus ? (
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-orange-300 shadow-lg">
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                ) : (
                  <CgProfile className="text-black text-[25px]" />
                )}

                {showAccountBar && (isLogin || loginstatus) && (
                  <div
                    className="absolute right-0 top-12 z-50 transition duration-300"
                    style={{ minWidth: "260px", maxWidth: "90vw" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ProfileCard />
                  </div>
                )}
              </div>

              {!loginstatus && !isLogin && (
                <button
                  className="flex gap-2 hover:cursor-pointer hover:underline items-center signin text-black text-md"
                  onClick={openModal}
                  type="button"
                >
                  <RiUserShared2Fill />
                  <span>Signup</span>
                </button>
              )}
            </div>
          </div>

          <div className="xl:hidden flex items-center gap-2">
            {(LanguageStatus === true || LanguageStatus === "true") && <LanguageDropdown />}

            {loadingUserData ? (
              <Loader />
            ) : isLogin ? (
              <>
                <button
                  onClick={addrecharge}
                  className="inline-flex items-center gap-1 border-2 border-orange-200 rounded-md px-2 py-1.5 bg-orange-50"
                  type="button"
                >
                  <FaWallet className="text-sm text-orange-600" />
                  <span className="text-xs font-semibold text-orange-600">₹{amount}</span>
                </button>

                <button
                  className="text-primaryColor p-1.5 hover:bg-orange-50 rounded-md transition"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  type="button"
                >
                  <Image src="/images/menu.webp" width={24} height={24} alt="Menu Icon" />
                </button>
              </>
            ) : (
              <button
                className="bg-[#FF8800] text-white px-3 py-2 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center gap-1.5 shadow-sm"
                onClick={openModal}
                type="button"
              >
                <CgProfile className="text-base" />
                <span className="text-xs sm:text-sm">Signup</span>
              </button>
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          contentLabel="Signup Modal"
          className="modal-content animate-slide-down"
          overlayClassName="modal-overlay"
        >
          <div className="modal-body m-auto">
            {numstatus && (
              <>
                <div>
                  <div className="flex modal-header bg-primaryColor  justify-between items-center pb-2">
                    <h2
                      style={{
                        width: "28rem",
                        fontSize: "12px",
                        color: "white",
                      }}
                      className="text-center text-xl font-semibold"
                    >
                      Continue with Phone
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-white text-xl close-button font-bold"
                    >
                      X
                    </button>
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    <div className="mt-4">
                      <label
                        htmlFor=""
                        style={{ width: "20.5em", margin: "auto" }}
                        className="m-auto text-center text-md font-medium mt-5"
                      >
                        You will receive a 4 digit code <br /> for verification
                      </label>
                      {/* <label className="text-left text-md block font-medium mt-6">
                        {t('enterYourPhoneNumber')}
                        </label> */}
                    </div>

                    <div
                      style={{ width: "20.5em" }}
                      className="flex border rounded-lg shadow-sm items-center mb-2 mt-8"
                    >
                      <div className="flex items-center ml-2 pl-3">
                        {/* <FaFlag className="text-red-600 mr-2" /> */}
                        {/* <img width={25} src={indianicon} alt="" /> */}
                        <span className="text-gray-600 ml-2 mr-2">+91</span>
                        <input
                          ref={inputRef}
                          type="tel"
                          inputMode="numeric"
                          name="contact"
                          onChange={HandleChangeNumber}
                          value={phone}
                          maxLength={10}
                          className=" border-none m-0 rounded w-full fs-5 py-2 outline-none"
                          placeholder="Enter Mobile Number"
                          autoComplete="off"
                          required
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      </div>
                    </div>

                    {errors?.phone && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "13px",
                          margin: "0px",
                          padding: "0px",
                        }}
                        className="error-message"
                      >
                        {errors?.phone}
                      </p>
                    )}
                    {errorMessModel && (<div style={{ color: "red", fontSize: "13px", }}> {errorMessModel}</div>)}
                    <button
                      type="button"
                      className="bg-primaryColor rounded text-white duration-300 hover:bg-orange-500 mt-2 py-2 font-semibold relative transition"
                      style={{ width: "20.5em" }}
                      onClick={checkValidationErrors}
                    >
                      <span className="absolute right-4 top-3">
                        <FaChevronRight />
                      </span>
                      {/* {t('sendOtp')} */}
                      Get Otp
                    </button>
                    <p className="text-[12px] pt-3">
                      {" "}
                      By signing in, you agree to our{" "}
                      <span
                        className="border-b-2 text-[#ff6600] cursor-pointer hover:text-[red]"
                        onClick={() => window.open("/TermsOfUse")}
                      >
                        Terms Of Use{" "}
                      </span>{" "}
                      and{" "}
                      <span
                        className="border-b-2 text-[#ff6600] cursor-pointer hover:text-[red]"
                        onClick={() => window.open("/PrivacyPolicy")}
                      >
                        {" "}
                        Privacy Policy{" "}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </>
            )}

            {otpStatus && (
              <>
                <div className="flex flex-col justify-center items-center">
                  <div className="modal-header bg-primaryColor border-b pb-2">
                    {/* <span><IoMdArrowRoundBack fontSize={20} color="white" /></span> */}
                    {!expireOtp ? (
                      <span>
                        <IoMdArrowRoundBack
                          fontSize={20}
                          color="white"
                          onClick={toggleModal}
                        />
                      </span>
                    ) : (
                      <></>
                    )}
                    <h2
                      style={{
                        width: "32rem",
                        fontSize: "12px",
                        color: "white",
                      }}
                      className="text-center text-xl font-semibold"
                    >
                      Verify Phone
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-white text-xl close-button font-bold"
                    >
                      X
                    </button>
                  </div>
                  {/* <div>OTP sent to +91-7990586879</div> */}
                  <h6 className="text-2xl font-[700] mt-3">
                    OTP sent to +91-<span>{phone}</span>
                  </h6>
                  <div className="relative">
                    {otpStatus && (
                      <div>
                        <div className="flex flex-col justify-between items-center">
                          <OTPInput
                            value={enteredOtp}
                            onChange={handleOtpChange}
                            numInputs={4}
                            shouldAutoFocus
                            separator={<span>--</span>}
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
                          <div
                            style={{
                              color: "red",
                              marginTop: "10px",
                              fontSize: "12px",
                              textAlign: "center",
                            }}
                          >
                            {errorMessage}
                          </div>
                        )}
                        <br />

                        <div className="flex flex-col justify-center items-center mt-2">
                          <button
                            className={`py-2 rounded ${enteredOtp?.length < 4
                              ? "bg-[#ccc] text-black"
                              : "bg-primaryColor text-white"
                              }`}
                            disabled={!expireOtp}
                            onClick={() => OtpVerify(enteredOtp)}
                            style={{
                              width: "20.5em",
                              cursor:
                                enteredOtp?.length < 4
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" &&
                                enteredOtp?.length >= 4
                              ) {
                                OtpVerify(enteredOtp);
                              }
                            }}
                          >
                            LOGIN
                          </button>
                        </div>
                        <div>
                          <div
                            style={{
                              marginTop: "18px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >


                            {!expireOtp ? (
                              <label className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                {t("Resend OTP available")}
                                <span id="timeRemain" className="font-semibold text-gray-800"></span>
                              </label>
                            ) : (
                              <>
                                {sec === '01' ? (
                                  ''
                                ) : (
                                  <div className="flex justify-between items-center py-2" style={{ fontSize: '13px', width: '100%' }}>
                                    <div>OTP Expires in: {min}:{sec}</div>
                                    <div className="text-right">
                                      <p
                                        onClick={() => { setOtpStatus(false); setnumstatus(true); setenteredOtp(''); setTimerOn(false); setErrorMessage(""); }}
                                        className="text-blue-600 underline cursor-pointer"
                                      >
                                        Change Number?
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {!expireOtp ? (
                              <button
                                className="px-3 py-1 text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 rounded-md shadow-sm"
                                onClick={() => { Get_OTP(); setenteredOtp(''); setErrorMessage(""); }}
                              >
                                {/* {t("resendOtp")} */}
                                Resend Otp
                              </button>
                            ) : null}

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>

        {reviewstatus && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
              {/* Close Button */}
              <button
                onClick={reviewsCloseFun}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>

              <div className="p-6 flex flex-col items-center">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 w-full mb-6">
                  <img
                    src={
                      popupData?.AvatarUrl
                        ? `https://${popupData.AvatarUrl.replace(/\\/g, "/")}`
                        : profilepic
                    }
                    alt="Astrologer Avatar"
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {popupData?.AstroName}
                  </h2>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setRating(star);
                        setError(""); // clear error on selection
                      }}
                      className={`text-5xl transition-colors duration-200 ${star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Comment Textarea */}
                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setError(""); // clear error when typing
                  }}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none mb-2"
                  rows="4"
                />

                {/* Error Message */}
                {error && (
                  <p className="text-red-500 text-sm font-medium mb-4">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium px-6 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
        {twominchatpopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-orange-400 text-center">

              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold transition"
                onClick={() => settwominchatpopup(false)}
              >
                &times;
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 text-orange-600 rounded-full p-3 shadow-inner">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Waitlist Locked
              </h2>

              {/* Description */}
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                You’ve already sent a request to the astrologer. <br />
                Please wait for{" "}
                <span className="font-semibold text-orange-600">1 minutes</span>{" "}
                before you can remove it.
              </p>

              {/* Button */}
              <button
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-2.5 rounded-full font-semibold shadow-md transition duration-300"
                onClick={() => settwominchatpopup(false)}
              >
                Okay
              </button>
            </div>
          </div>


        )}
      </div>
    </>
  );
}