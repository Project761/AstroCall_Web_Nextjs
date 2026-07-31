"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { postWithToken } from "@/app/utils/api";
import { IoCloudOffline } from "react-icons/io5";
import {
  FaChevronRight,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaBriefcase,
  FaHeart,
  FaCommentDots,
  FaShieldAlt,
  FaLock,
  FaBolt,
  FaStar,
  FaCheckCircle,
  FaPhone,
} from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { MdVerified, MdInfoOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import socketService from "@/app/services/socketService";
import { toastifyInfo } from "@/app/utils/utility";
import Image from "next/image";
import { ORANGE, CREAM, CREAM_ALT, PEACH } from "@/app/lib/siteTheme";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";

const VARIANTS = {
  chat: {
    listPath: "/chat-to-astrologers",
    listLabel: "Chat to Astrologers",
    consultationLabel: "Live Chat Consultation",
    ConsultIcon: IoMdChatboxes,
    step2Title: "Start Chat",
    step2Sub: "Connect with astrologer",
    submitLabel: "Start Chat with Astrologer",
    SubmitIcon: IoMdChatboxes,
    offlineMsg: "Your chat will start when the astrologer comes online",
    heroEyebrow: "Start Your Consultation",
    trustInstant: "Start chat quickly",
  },
  call: {
    listPath: "/talk-to-astrologers",
    listLabel: "Talk to Astrologers",
    consultationLabel: "Voice Call Consultation",
    ConsultIcon: FaPhone,
    step2Title: "Start Call",
    step2Sub: "Connect via voice call",
    submitLabel: "Start Call with Astrologer",
    SubmitIcon: FaPhone,
    offlineMsg: "Your call will start when the astrologer comes online",
    heroEyebrow: "Start Your Voice Consultation",
    trustInstant: "Connect on call quickly",
  },
};

const inputCls =
  "font-body w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition placeholder:text-gray-400 focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100";

const labelCls = "font-body mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#374151] sm:text-sm";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? ORANGE : "#E5E7EB",
    borderRadius: "0.75rem",
    minHeight: "42px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(255,92,0,0.12)" : "none",
    "&:hover": { borderColor: ORANGE },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? ORANGE : state.isFocused ? CREAM_ALT : "white",
    color: state.isSelected ? "white" : "#1A1A1A",
    fontSize: "14px",
  }),
  placeholder: (base) => ({ ...base, color: "#9CA3AF", fontSize: "14px" }),
  singleValue: (base) => ({ ...base, fontSize: "14px", color: "#1A1A1A" }),
};

function SectionHead({ icon: Icon, title, sub }) {
  return (
    <div className="mb-4 flex items-start gap-3 border-l-4 border-[#FF5C00] pl-3 sm:mb-5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
        <Icon className="text-sm text-[#FF5C00]" />
      </div>
      <div>
        <h3 className="font-heading text-sm font-bold text-[#1A1A1A] sm:text-base">{title}</h3>
        {sub && <p className="font-body text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-body rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
        active
          ? "border-[#FF5C00] bg-[#FF5C00] text-white shadow-sm"
          : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50"
      }`}
    >
      {children}
    </button>
  );
}

const parseTobStringToDate = (tobString) => {
  if (!tobString) return null;
  try {
    const [time, period] = tobString.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    const date = new Date();
    date.setHours(hour, parseInt(minutes), 0, 0);
    return date;
  } catch {
    return null;
  }
};

const formatTobValue = (date) => {
  if (!date) return "";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export default function ConsultationIntakeClient({ variant = "chat" }) {
  const cfg = VARIANTS[variant] || VARIANTS.chat;
  const { ConsultIcon, SubmitIcon } = cfg;

  const searchParams = useSearchParams();
  const router = useRouter();
  const UserLoginId =
    typeof window !== "undefined" && localStorage.getItem("UserLoginId")
      ? localStorage.getItem("UserLoginId")
      : "";

  const AstroId = searchParams.get("AstroId");
  const Type = searchParams.get("Type");
  const IsHomePage = searchParams.get("IsHomePage");

  const [errors, setErrors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [astrodata, setastrodata] = useState();
  const [WaitingListAdd, setWaitingListAdd] = useState(false);
  const [astroname, setastroname] = useState();
  const [astroimage, setastroimage] = useState();
  const [ChatUserBioID, setChatUserBioID] = useState();
  const [TOB, setTOB] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [Editval, setEditval] = useState([]);
  const [loginUserData, setLoginUserData] = useState(null);

  const [value, setValue] = useState({
    UserID: "",
    NickName: "",
    Name: "",
    DOB: "",
    TOB: "",
    POB: "",
    Gender: "",
    Occupation: "",
    Marital: "",
    TopicofConcern: "",
    CreatedByUser: "",
    longitude: "",
    latitude: "",
  });

  const STEPS = [
    { n: 1, title: "Enter Details", sub: "Share birth & personal info" },
    { n: 2, title: cfg.step2Title, sub: cfg.step2Sub },
  ];

  const TRUST_ITEMS = [
    { icon: FaShieldAlt, title: "100% Secure", sub: "Encrypted & protected" },
    { icon: FaLock, title: "Confidential", sub: "Details stay private" },
    { icon: FaBolt, title: "Instant Connect", sub: cfg.trustInstant },
  ];

  const HOW_IT_WORKS = [
    { icon: FaUser, text: "Fill in your accurate birth details" },
    { icon: variant === "call" ? FaPhone : FaCommentDots, text: "Astrologer reads your chart" },
    { icon: FaCheckCircle, text: "Get personalised guidance instantly" },
  ];

  useEffect(() => {
    queueMicrotask(() => {
      const mockLoginData = { FirstName: "John", LastName: "Doe", ProfilePic: null };
      setLoginUserData(mockLoginData);
    });
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      if (Editval && Editval.length > 0) {
        setValue({
          UserID: Editval[0]?.UserID || "",
          NickName: Editval[0]?.NickName || "",
          Name: Editval[0]?.FirstName ? `${Editval[0]?.FirstName} ${Editval[0]?.LastName}`.trim() : "",
          DOB: Editval[0]?.DOB || "",
          TOB: Editval[0]?.TOB || "",
          POB: Editval[0]?.POB || "",
          Gender: Editval[0]?.Gender || "",
          Occupation: Editval[0]?.Occupation || "",
          Marital: Editval[0]?.Marital || "",
          TopicofConcern: Editval[0]?.TopicofConcern || "",
          longitude: Editval[0]?.longitude || "",
          latitude: Editval[0]?.latitude || "",
          CreatedByUser: Editval[0]?.CreatedByUser || "",
        });
        setTOB(Editval[0]?.TOB ? parseTobStringToDate(Editval[0]?.TOB) : null);
      } else {
        setValue({
          UserID: "",
          NickName: "",
          Name: "",
          DOB: "",
          TOB: "",
          POB: "",
          Gender: "",
          Occupation: "",
          Marital: "",
          TopicofConcern: "",
          CreatedByUser: "",
          longitude: "",
          latitude: "",
        });
      }
    });
  }, [Editval, loginUserData]);

  useEffect(() => {
    if (WaitingListAdd) {
      const timer = setTimeout(() => {
        setWaitingListAdd(false);
        router.push(cfg.listPath);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [WaitingListAdd, cfg.listPath, router]);

  const handleChange = (e) => {
    const { name, value: val } = e.target;
    setValue((prevData) => ({ ...prevData, [name]: val }));
  };

  const validate = () => {
    const newErrors = {};
    if (!value.NickName) newErrors.NickName = "Name is required.";
    if (!/^[A-Za-z ]*$/.test(value.NickName)) newErrors.NickName = "Only alphabets are allowed";
    if (!value.TOB) newErrors.TOB = "Time of Birth is required.";
    if (!value.Gender) newErrors.Gender = "Gender is required.";
    if (!value.Occupation) newErrors.Occupation = "Occupation is required.";
    if (!value.TopicofConcern) newErrors.TopicofConcern = "Topic of concern is required.";
    if (!value.Marital) newErrors.Marital = "Marital status is required.";
    if (!value.POB) {
      newErrors.POB = "Birth Place is required.";
    } else if (!value.latitude || !value.longitude) {
      newErrors.POB = "Please select a valid Birth Place from the list.";
    }
    if (!value.DOB) newErrors.DOB = "Date of Birth is required.";
    return newErrors;
  };

  const GetData_Astrologer = useCallback(async () => {
    await Promise.resolve();
    try {
      setIsLoading(true);
      const val = { IsActive: "1" };
      const res = await postWithToken("Astrologer/UserGetData_Astrologer", val);
      if (res?.length > 0) {
        const filterAstroData = res?.filter((data) => data?.ID == AstroId);
        if (filterAstroData?.length > 0) {
          setastrodata(filterAstroData);
          setastroimage(filterAstroData[0]?.AvatarUrl);
          setastroname(filterAstroData[0]?.DisplayName);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [AstroId]);

  useEffect(() => {
    if (UserLoginId && AstroId) void (async () => { await GetData_Astrologer(); })();
  }, [UserLoginId, AstroId, GetData_Astrologer]);

  const navigateAfterSubmit = () => {
    const chatPath = "/chat-to-astrologers";
    const callPath = "/talk-to-astrologers";

    if (Type === "chat") {
      router.push(chatPath);
      return;
    }
    if (Type === "call") {
      router.push(callPath);
      return;
    }
    if (IsHomePage === "true" || IsHomePage === true) {
      if (astrodata?.[0]?.IsChat === "true" || astrodata?.[0]?.IsChat === true) router.push(chatPath);
      else if (astrodata?.[0]?.IsCall === "true" || astrodata?.[0]?.IsCall === true) router.push(callPath);
      else router.push("/");
      return;
    }
    if (astrodata?.[0]?.IsChat === "true" || astrodata?.[0]?.IsChat === true) router.push(chatPath);
    else if (astrodata?.[0]?.IsCall === "true" || astrodata?.[0]?.IsCall === true) router.push(callPath);
    else setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const astroOnline =
      astrodata?.[0]?.IsChat === "true" ||
      astrodata?.[0]?.IsChat === true ||
      astrodata?.[0]?.IsCall === "true" ||
      astrodata?.[0]?.IsCall === true;

    const shouldOpenWaitlistModal =
      !Type && !(IsHomePage === "true" || IsHomePage === true) && !astroOnline;

    if (shouldOpenWaitlistModal) {
      setIsOpen(true);
      setErrors({});
      return;
    }

    InsertWaitingList();

    if (Type === "chat") {
      router.push("/chat-to-astrologers");
      setErrors({});
      return;
    }
    if (Type === "call") {
      router.push("/talk-to-astrologers");
      setErrors({});
      return;
    }
    if (IsHomePage === "true" || IsHomePage === true) {
      navigateAfterSubmit();
      setErrors({});
      return;
    }

    navigateAfterSubmit();
    setErrors({});
  };

  const InsertWaitingList = () => {
    if (!ChatUserBioID) {
      Insert_UserChat_Data();
      return;
    }
    const payload = {
      AstroId: `WA${AstroId}`,
      UserId: `WU${UserLoginId}`,
      Status: "InsertWaitingList",
      Type: Type,
      ChatUserBioID: ChatUserBioID,
      messageId: "NewRequest",
    };

    if (!socketService.isUserConnected()) {
      socketService.ensureUserConnected(UserLoginId, "ConsultationIntakeClient");
      const sent = socketService.sendUser(payload);
      if (!sent) {
        toastifyInfo("Connecting… your request will be sent shortly.");
        const retry = setInterval(() => {
          if (socketService.sendUser(payload)) {
            clearInterval(retry);
            UpDate_CHATINTAKEFORM_Data();
          }
        }, 1500);
        setTimeout(() => clearInterval(retry), 30000);
        return;
      }
    } else {
      socketService.sendUser(payload);
    }
    UpDate_CHATINTAKEFORM_Data();
  };

  const Get_CHATINTAKEFORM_UserData = useCallback(async () => {
    await Promise.resolve();
    try {
      if (!UserLoginId) {
        if (loginUserData) setEditval([loginUserData]);
        return;
      }
      const val = { UserID: UserLoginId, IsActive: "1" };
      const res = await postWithToken("CHATINTAKEFORM/GetData_CHATINTAKEFORM", val);
      if (res?.length > 0) {
        setChatUserBioID(res[0]?.ChatUserBioID);
        setEditval(res);
      } else if (loginUserData) {
        setEditval([loginUserData]);
      } else {
        setEditval([]);
      }
    } catch (error) {
      console.error("Error fetching chat intake form data:", error);
      if (loginUserData) setEditval([loginUserData]);
    }
  }, [UserLoginId, loginUserData]);

  const Insert_UserChat_Data = async () => {
    try {
      const val = {
        UserID: UserLoginId,
        Name: value?.NickName,
        DOB: value.DOB,
        TOB: value.TOB,
        POB: value.POB,
        Gender: value.Gender,
        Occupation: value.Occupation,
        Marital: value.Marital,
        TopicofConcern: value.TopicofConcern,
        CreatedByUser: "1",
        latitude: value?.latitude,
        longitude: value?.longitude,
      };
      const res = await postWithToken("CHATINTAKEFORM/Insert_CHATINTAKEFORM", val);
      if (!res?.ChatUserBioID) return;
      Get_CHATINTAKEFORM_UserData();
      socketService.sendUser({
        AstroId: `WA${AstroId}`,
        UserId: `WU${UserLoginId}`,
        Status: "InsertWaitingList",
        Type: Type,
        ChatUserBioID: res.ChatUserBioID,
        messageId: "NewRequest",
      });
    } catch (error) {
      console.error("Insert_UserChat_Data error:", error);
    }
  };

  useEffect(() => {
    if (UserLoginId && loginUserData) void (async () => { await Get_CHATINTAKEFORM_UserData(); })();
  }, [UserLoginId, loginUserData, Get_CHATINTAKEFORM_UserData]);

  const UpDate_CHATINTAKEFORM_Data = async () => {
    try {
      const val = {
        UserID: UserLoginId,
        Name: value.NickName,
        DOB: value.DOB,
        TOB: value.TOB,
        POB: value.POB,
        Gender: value.Gender,
        Occupation: value.Occupation,
        Marital: value.Marital,
        TopicofConcern: value.TopicofConcern,
        ChatUserBioID: ChatUserBioID,
        ModifiedByUser: "1",
        latitude: value?.latitude,
        longitude: value?.longitude,
      };
      const res = await postWithToken("CHATINTAKEFORM/Update_CHATINTAKEFORM", val);
      if (res) Get_CHATINTAKEFORM_UserData();
    } catch (error) {
      console.log(error);
    }
  };

  const button2Ref = useRef(null);

  const reset = () => {
    setValue({
      UserID: "",
      NickName: "",
      Name: "",
      DOB: "",
      TOB: "",
      POB: "",
      Gender: "",
      Occupation: "",
      Marital: "",
      TopicofConcern: "",
      CreatedByUser: "",
      longitude: "",
      latitude: "",
    });
    setTOB(null);
    setErrors({});
  };

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchLocationData = useCallback(async (place, isInitial = false) => {
    await Promise.resolve();
    try {
      const val = { address: place };
      const response = await postWithToken("Location/GetLocation", val);
      if (response?.length > 0 && !isInitial) {
        setSuggestions(response);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }, []);

  useEffect(() => {
    if (value.POB) void (async () => { await fetchLocationData(value.POB, true); })();
  }, [value.POB, fetchLocationData]);

  const AddType = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  const OccupationType = [
    { value: "Student", label: "Student" },
    { value: "Engineer", label: "Engineer" },
    { value: "Doctor", label: "Doctor" },
    { value: "Artist", label: "Artist" },
    { value: "Other", label: "Other" },
  ];
  const MaritalType = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];
  const TopicofConcernType = [
    { value: "Career", label: "Career" },
    { value: "Health", label: "Health" },
    { value: "Relationships", label: "Relationships" },
    { value: "Finance", label: "Finance" },
    { value: "Other", label: "Other" },
  ];

  const astro = astrodata?.[0];
  const filledCount = [
    value.NickName,
    value.DOB,
    value.TOB,
    value.POB && value.latitude,
    value.Gender,
    value.Occupation,
    value.Marital,
    value.TopicofConcern,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <section
        className="relative overflow-hidden border-b border-orange-100/80 px-3 pb-6 pt-[4.5rem] sm:px-4 sm:pb-8 sm:pt-20"
        style={{ background: `linear-gradient(165deg, ${PEACH} 0%, ${CREAM_ALT} 35%, ${CREAM} 100%)` }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${ORANGE} 0%, transparent 70%)` }}
          aria-hidden
        />
        <div className="main-container relative">
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-gray-500 sm:text-sm">
            <Link href="/" className="hover:text-[#FF5C00]">
              Home
            </Link>
            <FaChevronRight className="text-[10px]" />
            <Link href={cfg.listPath} className="hover:text-[#FF5C00]">
              {cfg.listLabel}
            </Link>
            <FaChevronRight className="text-[10px]" />
            <span className="font-medium text-[#FF5C00]">Enter Details</span>
          </nav>

          <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
            {STEPS.map((step, i) => (
              <React.Fragment key={step.n}>
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 ${
                    i === 0 ? "bg-white shadow-sm ring-1 ring-orange-100" : "bg-white/60"
                  }`}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white sm:h-7 sm:w-7"
                    style={{ backgroundColor: i === 0 ? ORANGE : "#D1D5DB" }}
                  >
                    {step.n}
                  </span>
                  <div className="hidden min-[400px]:block">
                    <p className={`font-heading text-xs font-bold sm:text-sm ${i === 0 ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                      {step.title}
                    </p>
                    <p className="hidden text-[10px] text-gray-400 sm:block">{step.sub}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="h-px max-w-12 flex-1 bg-orange-200 sm:max-w-20" />}
              </React.Fragment>
            ))}
          </div>

          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5C00]/80 sm:text-xs">{cfg.heroEyebrow}</p>
            <h1 className="font-heading mt-1 text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl md:text-4xl">
              Enter Details to <span className="text-[#FF5C00]">Continue</span>
            </h1>
            <p className="font-body mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              Accurate birth details help your astrologer prepare a precise reading before your{" "}
              {variant === "call" ? "call" : "chat"} begins.
            </p>
          </div>
        </div>
      </section>

      <section className="main-container px-3 py-6 sm:px-4 sm:py-8 md:py-10">
        <div className="grid gap-5 lg:grid-cols-[300px_1fr] lg:gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_24px_rgba(255,92,0,0.08)]">
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${ORANGE}, #FFB380, ${ORANGE})` }} />
              <div className="p-4 sm:p-5">
                {isLoading && !astro ? (
                  <div className="animate-pulse space-y-3">
                    <div className="mx-auto h-20 w-20 rounded-2xl bg-orange-100" />
                    <div className="mx-auto h-4 w-32 rounded bg-orange-50" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative">
                        {/* <Image
                          src={toCdnSrcOrFallback(astro?.AvatarUrl || astroimage || "/images/profile pic.webp")}
                          alt={astro?.DisplayName || astroname || "Astrologer"}
                          width={88}
                          height={88}
                          className="h-20 w-20 rounded-2xl object-cover ring-4 ring-orange-50 sm:h-[88px] sm:w-[88px]"
                          unoptimized={!!(astro?.AvatarUrl || astroimage)}
                        /> */}
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 ring-2 ring-white">
                          <span className="h-2 w-2 rounded-full bg-white" />
                        </span>
                      </div>
                      <h3 className="font-heading mt-3 flex items-center gap-1 text-base font-bold text-[#1A1A1A] sm:text-lg">
                        {astro?.DisplayName || astroname || "Astrologer"}
                        <MdVerified className="text-[#FF5C00]" />
                      </h3>
                      {astro?.Specialization && (
                        <p className="font-body mt-0.5 line-clamp-2 text-xs text-gray-500">
                          {astro.Specialization.split(",").slice(0, 2).join(", ")}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-[#FF5C00]">
                          <FaStar className="text-yellow-400" />
                          {astro?.StarCount || "4.9"}
                        </span>
                        {astro?.Experience && (
                          <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs text-gray-600">{astro.Experience}+ Yrs Exp.</span>
                        )}
                      </div>
                      <div className="font-heading mt-3 rounded-xl px-4 py-2 text-sm font-bold" style={{ backgroundColor: PEACH, color: ORANGE }}>
                        {astro?.FreeState === "Free" ? (
                          variant === "call" ? "Free Call" : "Free Chat"
                        ) : (
                          <>
                            ₹{astro?.PricePerMin || "—"}
                            <span className="text-xs font-normal text-gray-500">/min</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 px-3 py-2.5">
                      <ConsultIcon className="text-lg text-[#FF5C00]" />
                      <span className="font-body text-xs font-semibold text-gray-700 sm:text-sm">{cfg.consultationLabel}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-4 sm:p-5">
              <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">How it works</h4>
              <ul className="mt-3 space-y-3">
                {HOW_IT_WORKS.map(({ icon: Icon, text }, i) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: ORANGE }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 shrink-0 text-xs text-[#FF5C00]" />
                      <p className="font-body text-xs leading-relaxed text-gray-600 sm:text-sm">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2.5 rounded-2xl border border-orange-100 bg-[#FFF9F1] p-4">
              <MdInfoOutline className="mt-0.5 shrink-0 text-lg text-[#FF5C00]" />
              <p className="font-body text-xs leading-relaxed text-gray-700 sm:text-sm">
                <span className="font-semibold text-[#1A1A1A]">Tip:</span> Exact birth time improves prediction accuracy. Check your birth certificate if unsure.
              </p>
            </div>

            <Link
              href={cfg.listPath}
              className="hidden items-center justify-center gap-1 rounded-xl border border-orange-100 bg-white py-2.5 text-sm font-medium text-gray-600 transition hover:border-orange-200 hover:text-[#FF5C00] lg:flex"
            >
              ← Back to astrologers
            </Link>
          </aside>

          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_30px_rgba(255,92,0,0.08)] sm:rounded-3xl">
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ORANGE}, #FFB380)` }} />
            <div className="border-b border-orange-50 px-4 py-4 sm:px-6 sm:py-5" style={{ backgroundColor: CREAM_ALT }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#1A1A1A] sm:text-lg">Consultation Intake Form</h2>
                  <p className="font-body mt-0.5 text-xs text-gray-500 sm:text-sm">
                    All fields marked <span className="text-red-500">*</span> are required
                  </p>
                </div>
                <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-orange-100">
                  <span className="text-[#FF5C00]">{filledCount}/8</span> completed
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-orange-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${(filledCount / 8) * 100}%`, backgroundColor: ORANGE }}
                />
              </div>
            </div>

            <form className="p-4 sm:p-6 md:p-8" onSubmit={handleSubmit}>
              <SectionHead icon={FaCalendarAlt} title="Birth Details" sub="Required for accurate kundli analysis" />
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
                <div className="flex flex-col">
                  <label className={labelCls}>
                    <FaCalendarAlt className="text-[#FF5C00]" /> Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input type="date" name="DOB" value={value.DOB} onChange={handleChange} className={inputCls} />
                  {errors.DOB && <p className="mt-1 text-xs text-red-500">{errors.DOB}</p>}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>
                    <FaClock className="text-[#FF5C00]" /> Time of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="TOB"
                    name="TOB"
                    selected={TOB}
                    dateFormat="h:mm aa"
                    autoComplete="off"
                    onChange={(date) => {
                      setTOB(date);
                      setValue({ ...value, TOB: date ? formatTobValue(date) : "" });
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={10}
                    timeCaption="Time"
                    placeholderText={TOB ? formatTobValue(TOB) : "Select time"}
                    isClearable={!!TOB}
                    className={`${inputCls} !mt-0`}
                  />
                  {errors?.TOB && <p className="mt-1 text-xs text-red-500">{errors.TOB}</p>}
                </div>

                <div className="flex flex-col sm:col-span-2">
                  <label className={labelCls}>
                    <FaMapMarkerAlt className="text-[#FF5C00]" /> Birth Place <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="POB"
                      placeholder="Type city name — e.g. Mumbai, Delhi"
                      value={value.POB}
                      autoComplete="off"
                      onChange={(e) => {
                        const val = e.target.value;
                        setValue((prev) => ({ ...prev, POB: val, latitude: "", longitude: "" }));
                        if (val.length >= 3) fetchLocationData(val, false);
                        else {
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }
                      }}
                      className={inputCls}
                    />
                    {errors?.POB && <p className="mt-1 text-xs text-red-500">{errors?.POB}</p>}
                    {showSuggestions && suggestions?.length > 0 && (
                      <ul className="absolute z-20 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-orange-100 bg-white py-1 shadow-lg">
                        {suggestions?.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setValue((prev) => ({
                                ...prev,
                                POB: item.display_name,
                                latitude: item.lat,
                                longitude: item.lon,
                              }));
                              setSuggestions([]);
                              setShowSuggestions(false);
                            }}
                            className="cursor-pointer px-3 py-2 text-sm text-gray-700 transition hover:bg-orange-50"
                          >
                            {item.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <SectionHead icon={FaUser} title="Personal Details" sub="Tell us a little about yourself" />
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="flex flex-col sm:col-span-2">
                  <label className={labelCls}>
                    <FaUser className="text-[#FF5C00]" /> Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="NickName"
                    autoComplete="off"
                    value={value.NickName}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter your full name"
                  />
                  {errors.NickName && <p className="mt-1 text-xs text-red-500">{errors.NickName}</p>}
                </div>

                <div className="flex flex-col sm:col-span-2">
                  <label className={labelCls}>
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AddType.map((g) => (
                      <PillButton key={g.value} active={value.Gender === g.value} onClick={() => setValue({ ...value, Gender: g.value })}>
                        {g.label}
                      </PillButton>
                    ))}
                  </div>
                  {errors.Gender && <p className="mt-1 text-xs text-red-500">{errors.Gender}</p>}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>
                    <FaBriefcase className="text-[#FF5C00]" /> Occupation <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="Occupation"
                    options={OccupationType}
                    isClearable
                    placeholder="Select occupation"
                    styles={selectStyles}
                    value={OccupationType?.filter((obj) => obj.value === value?.Occupation)}
                    onChange={(selectedOption) => setValue({ ...value, Occupation: selectedOption ? selectedOption.value : "" })}
                  />
                  {errors.Occupation && <p className="mt-1 text-xs text-red-500">{errors.Occupation}</p>}
                </div>

                <div className="flex flex-col">
                  <label className={labelCls}>
                    <FaHeart className="text-[#FF5C00]" /> Marital Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="Marital"
                    options={MaritalType}
                    isClearable
                    placeholder="Select status"
                    styles={selectStyles}
                    value={MaritalType?.filter((obj) => obj.value === value?.Marital)}
                    onChange={(selectedOption) => setValue({ ...value, Marital: selectedOption ? selectedOption.value : "" })}
                  />
                  {errors.Marital && <p className="mt-1 text-xs text-red-500">{errors.Marital}</p>}
                </div>
              </div>

              <SectionHead icon={FaCommentDots} title="Topic of Concern" sub="What would you like guidance on?" />
              <div className="mb-2 flex flex-wrap gap-2 sm:gap-2.5">
                {TopicofConcernType.map((t) => (
                  <PillButton
                    key={t.value}
                    active={value.TopicofConcern === t.value}
                    onClick={() => setValue({ ...value, TopicofConcern: t.value })}
                  >
                    {t.label}
                  </PillButton>
                ))}
              </div>
              {errors.TopicofConcern && <p className="mb-4 text-xs text-red-500">{errors.TopicofConcern}</p>}

              <div
                className="mt-6 rounded-2xl border border-orange-100 p-4 sm:mt-8 sm:p-5"
                style={{ background: `linear-gradient(135deg, ${CREAM} 0%, ${PEACH} 100%)` }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-center sm:text-left">
                    <p className="font-heading text-sm font-bold text-[#1A1A1A]">Ready to connect?</p>
                    <p className="font-body text-xs text-gray-500">
                      Your astrologer will receive these details before {variant === "call" ? "the call" : "chat"} starts
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={reset}
                      className="order-2 text-xs font-medium text-gray-500 underline-offset-2 hover:text-[#FF5C00] hover:underline sm:order-1 sm:mr-3 sm:text-sm"
                    >
                      Clear form
                    </button>
                    <button
                      type="submit"
                      ref={button2Ref}
                      disabled={isLoading}
                      className="font-heading order-1 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:w-auto sm:min-w-[280px]"
                      style={{
                        background: isLoading ? "#9CA3AF" : `linear-gradient(135deg, ${ORANGE} 0%, #FF7A33 100%)`,
                      }}
                    >
                      <SubmitIcon className="text-lg" />
                      {isLoading ? "Please wait..." : cfg.submitLabel}
                    </button>
                  </div>
                </div>
                <Link
                  href={cfg.listPath}
                  className="mt-3 block text-center text-xs font-medium text-gray-500 transition hover:text-[#FF5C00] sm:hidden"
                >
                  ← Back to astrologers
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Icon className="text-lg text-[#FF5C00]" />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-[#1A1A1A]">{title}</p>
                <p className="font-body text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          {astrodata?.map((card, index) => (
            <div key={index} className="w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-xl">
              <div className="mx-auto h-1 w-16 rounded-full" style={{ backgroundColor: ORANGE }} />
              {/* <Image
                src={card?.AvatarUrl ? toCdnSrcOrFallback(card?.AvatarUrl) : "/images/profile pic.webp"}
                alt={card?.DisplayName || "Astrologer"}
                width={80}
                height={80}
                className="mx-auto mt-4 h-20 w-20 rounded-2xl object-cover ring-2 ring-orange-100"
                unoptimized={!!card?.AvatarUrl}
              /> */}
              <h2 className="font-heading mt-3 text-lg font-bold text-[#1A1A1A]">{card?.DisplayName}</h2>
              <p className="font-body mt-2 text-sm leading-relaxed text-gray-600">
                If you join the waitlist, we will notify <span className="font-semibold text-[#FF5C00]">{card?.DisplayName}</span> to take the session, if possible.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  className="font-heading flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition hover:brightness-105"
                  style={{ backgroundColor: ORANGE }}
                  onClick={() => {
                    InsertWaitingList();
                    setIsOpen(false);
                    setWaitingListAdd(true);
                  }}
                >
                  Join Waitlist
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {WaitingListAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-6 shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              onClick={() => {
                setWaitingListAdd(false);
                router.push(cfg.listPath);
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <IoCloudOffline className="text-2xl text-[#FF5C00]" />
            </div>
            <h2 className="font-heading text-center text-lg font-bold text-[#1A1A1A]">Waitlist Joined!</h2>
            <div className="mt-5 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                {/* <Image
                  src={loginUserData?.ProfilePic ? toCdnSrcOrFallback(loginUserData?.ProfilePic) : "/images/profile pic.webp"}
                  alt="User"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border-2 border-orange-100 object-cover"
                  unoptimized={!!loginUserData?.ProfilePic}
                /> */}
                <p className="mt-1 text-xs font-medium text-gray-600">
                  {loginUserData?.FirstName} {loginUserData?.LastName}
                </p>
              </div>
              <ConsultIcon className="text-lg text-[#FF5C00]" />
              <div className="flex flex-col items-center">
                {/* <Image
                  src={astroimage ? toCdnSrcOrFallback(astroimage) : "/images/profile pic.webp"}
                  alt={astroname || "Astrologer"}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border-2 border-orange-100 object-cover"
                  unoptimized={!!astroimage}
                /> */}
                <p className="mt-1 text-xs font-semibold text-[#1A1A1A]">{astroname}</p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-semibold text-[#FF5C00]">{astroname} is Offline</p>
            <p className="mt-1 text-center text-xs text-gray-500 sm:text-sm">{cfg.offlineMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
