"use client";

import React, { createContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  postWithToken,
  GetWithToken,
  TokenWithDeleteUpadateAdd,
  getPostData
} from "../utils/api";
import { format } from "date-fns";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const pathname = usePathname();
  const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || "" : "";
  const GetAstroLoginId = typeof window !== 'undefined' ? localStorage.getItem("AstroLoginId") || "" : "";

  // State management
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [chattalkstatus, setchattalkstatus] = useState(false);
  const [loginstatus, setLoginstatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsShoping, setIsShoping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loginUserData, setLoginUserData] = useState(null);
  const [loginAstrologerData, setLoginAstrologerData] = useState([]);
  const [cartdata, setcartdata] = useState([]);
  const [orderid, setorderid] = useState();
  const [LanguageDropdown, setLanguageDropdown] = useState("en");
  const [LanguageStatus, setLanguageStatus] = useState(true);
  const [AcceptedUser, setAcceptedUser] = useState(false);
  const [AstroIDWS, setAstroIDWS] = useState(GetAstroLoginId);
  const [valueset, setValueset] = useState(0);
  const [showinput, setshowinput] = useState(true);
  const [ChatPopUpStatus, setChatPopUpStatus] = useState(false);
  const [userMessage, setUsermessage] = useState("");
  const [ChatCallTrue, setChatCallTrue] = useState(false);
  const [AstroNameHomePage, setAstroNameHomePage] = useState();
  const [AstroNameHomePageCall, setAstroNameHomePageCall] = useState();
  const [Gemstonereviewstatus, setGemstonereviewstatus] = useState(false);
  const [pujareviewstatus, setpujareviewstatus] = useState(false);
  const [PlanSuccessPopup, setPlanSuccessPopup] = useState(false);
  const [FAQData, setFAQData] = useState([]);
  const [isLogin, setisLogin] = useState(false);
  const [loadingAstroData, setloadingAstroData] = useState(false);
  const [loadingUserData, setloadingUserData] = useState(false);
  const [MuhuratData, setMuhuratData] = useState();
  const [VratUpvaasData, setVratUpvaasData] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [ws, setWs] = useState(null);
  const [astrows, setastroWs] = useState(null);
  const [data, setdata] = useState();
  const [Astrodata, setAstrodata] = useState();
  const [userCalculateTime, setUserCalculateTime] = useState("");
  const [AstroCalculateTime, setAstroCalculateTime] = useState("");
  const [pingIntervalWS, setpingIntervalWS] = useState();
  const [reviewstatus, setreviewstatus] = useState(false);
  const [popupAceept, setpopupAceept] = useState(false);
  const [astroParsedData, setAstroParsedData] = useState(null);
  const [astroChatCompleted, setAstroChatCompleted] = useState(null);
  const [astroCheckEndedChat, setAstroCheckEndedChat] = useState(null);
  const [RazorPayKey, setRazorPayKey] = useState();
  const [GetAgoraKey, setGetAgoraKey] = useState();
  const [twominchatpopup, settwominchatpopup] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [BusyTimes, setBusyTimes] = useState({});
  const [showPopupCall, setshowPopupCall] = useState(false);
  const [callPopupData, setcallPopupData] = useState(null);
  const [Callstatus, setCallstatus] = useState(false);
  const [isPopUPOpen, setIsPopupOpen] = useState(false);
  const [sunmoonData, setsunmoonData] = useState();
  const [FindTithiData, setFindTithiData] = useState();
  const [nakshatraData, setnakshatraData] = useState();
  const [yogaData, setyogaData] = useState();
  const [SkillsData, setSkillsData] = useState();
  const [LanguagesData, setLanguagesData] = useState();
  const [CategoryData, setCategoryData] = useState();
  const [astrologers, setAstrologers] = useState([]);
  const [astrologerdata, setastrologerdata] = useState([]);
  const [displayedAstrologers, setDisplayedAstrologers] = useState([]);
  const [chatonline, setchatonline] = useState(false);
  const [chatOffline, setchatOffline] = useState(false);
  const [astrologerToggleStatus, setAstrologerToggleStatus] = useState(null);
  const [AstrologerChatOnline, setAstrologerChatOnline] = useState();
  const [AstrologerChatID, setAstrologerChatID] = useState();
  const [AstroBusyMap, setAstroBusyMap] = useState({});
  const [AstroNotBusyStatus, setAstroNotBusyStatus] = useState(false);
  const [AstroNotBusy, setAstroNotBusy] = useState('');
  const [AstroNotBusyCall, setAstroNotBusyCall] = useState('');
  const [isLoadingAstrologerData, setIsLoadingAstrologerData] = useState(false);
  const [visitorId, setVisitorId] = useState(typeof window !== 'undefined' ? localStorage.getItem("visitor_Id") || "" : "");

  const prevMessageRef = useRef("");
  const socketRef = useRef(null);
  let userpingInterval = null;
  let pingInterval = null;
  const toggleMenu = () => setisMenuOpen(prev => !prev);
  const url = typeof window !== 'undefined' ? window.location.origin : "";
  let reconnectInterval = null;
  let existingSocket = null;
  const urlSet = typeof window !== 'undefined' ? window.location.origin : "";
  let astroSocketRef = null;
  let reconnectTimeout = null;
  let astroReconnectInterval = null;
  const isConnectingRef = useRef(false);
  const hasInitializedConnection = useRef(false);
  const userInitializedRef = useRef(false);
  const lastPongRef = useRef(Date.now());
  const userPongTimeoutRef = useRef(null);
  const AstroLastPongRef = useRef(Date.now());
  const AstroPongTimeoutRef = useRef(null);

  // Get_SingleData_User function

  useEffect(() => {
    Get_SingleData_User(UserLoginId);
  }, [UserLoginId]);

  const Get_SingleData_User = async (id) => {
    if (!id) return;

    setloadingUserData(true);
    try {
      const res = await postWithToken("User/GetSingleData_User", { UserID: id });
      if (res && res.length > 0) {
        setLoginUserData(res[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setloadingUserData(false);
    }
  };

  // Get_SingleData_Astrologer function
  const Get_SingleData_Astrologer = async (id) => {
    setloadingAstroData(true);
    try {
      const res = await postWithToken("Astrologer/GetSingleData_Astrologer", { AstrologerID: id });
      if (res) {
        setLoginAstrologerData(res[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setloadingAstroData(false);
    }
  };

  // Get_Data_RazorPayKey function
  const Get_Data_RazorPayKey = async () => {
    try {
      const res = await GetWithToken("RazorPay/GetDataRazorPayKey");
      if (res?.success === true) {
        setRazorPayKey(res?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Get_Data_GetDataAgoraKey function
  const Get_Data_GetDataAgoraKey = async () => {
    try {
      const res = await GetWithToken("RazorPay/GetDataAgoraKey");
      if (res?.success === true) {
        setGetAgoraKey(res?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Get_Data_Muhurat function
  const Get_Data_Muhurat = async () => {
    try {
      // Check if data is cached (simple 1-hour cache)
      const cachedData = typeof window !== 'undefined' ? localStorage.getItem("muhurat_data") : null;
      const cachedTime = typeof window !== 'undefined' ? localStorage.getItem("muhurat_time") : null;
      const now = new Date().getTime();

      // Cache for 1 hour (3600000 ms)
      if (cachedData && cachedTime && (now - parseInt(cachedTime)) < 3600000) {
        setMuhuratData(JSON.parse(cachedData));
        return;
      }

      // Fetch fresh data
      const res = await getPostData("Muhurat/GetData_Muhurat", { IsActive: "1" });
      setMuhuratData(res);

      // Cache for 1 hour
      if (typeof window !== 'undefined') {
        localStorage.setItem("muhurat_data", JSON.stringify(res));
        localStorage.setItem("muhurat_time", now.toString());
        localStorage.setItem("muhurat_called", "true");
      }

      console.log("Fresh Muhurat data fetched");
    } catch (err) {
      console.error(err);

      // Use cached data if API fails
      const cachedData = typeof window !== 'undefined' ? localStorage.getItem("muhurat_data") : null;
      if (cachedData) {
        setMuhuratData(JSON.parse(cachedData));
        console.log("Using cached data due to error");
      }
    }
  };

  // Get_Data_VratandUpvaas function
  const Get_Data_VratandUpvaas = async () => {
    try {
      // Check if data is cached (simple 1-hour cache)
      const cachedData = typeof window !== 'undefined' ? localStorage.getItem("vratupvaas_data") : null;
      const cachedTime = typeof window !== 'undefined' ? localStorage.getItem("vratupvaas_time") : null;
      const now = new Date().getTime();

      // Cache for 1 hour (3600000 ms)
      if (cachedData && cachedTime && (now - parseInt(cachedTime)) < 3600000) {
        setVratUpvaasData(JSON.parse(cachedData));
        return;
      }

      // Fetch fresh data
      const res = await getPostData("VratUpvaas/GetData_VratUpvaas", { IsActive: "1" });
      if (res) {
        setVratUpvaasData(res);

        // Cache for 1 hour
        if (typeof window !== 'undefined') {
          localStorage.setItem("vratupvaas_data", JSON.stringify(res));
          localStorage.setItem("vratupvaas_time", now.toString());
          localStorage.setItem("VratUpvaas_called", "true");
        }

        console.log("Fresh VratUpvaas data fetched");
      }
    } catch (err) {
      console.error(err);

      // Use cached data if API fails
      const cachedData = typeof window !== 'undefined' ? localStorage.getItem("vratupvaas_data") : null;
      if (cachedData) {
        setVratUpvaasData(JSON.parse(cachedData));
        console.log("Using cached VratUpvaas data due to error");
      }
    }
  };




  const Get_find_sun_moon = async (selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown) => {
    const val = {
      "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
      "p1_year": format(new Date(selectedDate), "yyyy"),
      "p1_month": format(new Date(selectedDate), "MM"),
      "p1_day": format(new Date(selectedDate), "dd"),
      "p1_lat": latitudedata,
      "p1_lon": longitudedata,
      "p1_tzone": "5.5",
      "p1_place": p1placeData,
      "lan": LanguageDropdown
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_sun_and_moon", val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const response = parseData?.data;
      if (response) {
        setsunmoonData(response);
      }
    } catch (error) {
      console.error("Error fetching horoscope chart:", error);
    }
  };

  const Get_find_tithi = async (selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown) => {
    const val = {
      "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
      "p1_year": format(new Date(selectedDate), "yyyy"),
      "p1_month": format(new Date(selectedDate), "MM"),
      "p1_day": format(new Date(selectedDate), "dd"),
      "p1_lat": latitudedata,
      "p1_lon": longitudedata,
      "p1_tzone": "5.5",
      "p1_place": p1placeData,
      "lan": LanguageDropdown
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_tithi", val);
      const { data } = res;

      const parseData = JSON.parse(data);
      const response = parseData?.data;
      if (response) {
        setFindTithiData(response);
      }
    } catch (error) {
      console.error("Error fetching horoscope chart:", error);
    }
  };

  const Get_find_Nakshatra = async (selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown) => {
    const val = {
      "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
      "p1_year": format(new Date(selectedDate), "yyyy"),
      "p1_month": format(new Date(selectedDate), "MM"),
      "p1_day": format(new Date(selectedDate), "dd"),
      "p1_lat": latitudedata,
      "p1_lon": longitudedata,
      "p1_tzone": "5.5",
      "p1_place": p1placeData,
      "lan": LanguageDropdown
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_nakshatra", val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const response = parseData?.data;
      if (response) {
        setnakshatraData(response);
      }
    } catch (error) {
      console.error("Error fetching horoscope chart:", error);
    }
  };

  const Get_find_yoga = async (selectedDate, latitudedata, longitudedata, p1placeData, LanguageDropdown) => {
    const val = {
      "p1_Date": format(new Date(selectedDate), "yyyy-MM-dd'T'HH:mm:ss"),
      "p1_year": format(new Date(selectedDate), "yyyy"),
      "p1_month": format(new Date(selectedDate), "MM"),
      "p1_day": format(new Date(selectedDate), "dd"),
      "p1_lat": latitudedata,
      "p1_lon": longitudedata,
      "p1_tzone": "5.5",
      "p1_place": p1placeData,
      "lan": LanguageDropdown
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("KundaliMatchMaking/find_yoga", val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const response = parseData?.data;
      if (response) {
        setyogaData(response);
      }
    } catch (error) {
      console.error("Error fetching horoscope chart:", error);
    }
  };





  // Get_Data_Astrologer function
  const Get_Data_Astrologer = async () => {
    try {
      setIsLoadingAstrologerData(true);
      const val = { IsActive: "1", Source: "chat" };
      const res = await postWithToken("Astrologer/UserGetData_Astrologer", val);
      if (res) {
        setAstrologers(res);
        setastrologerdata(res);
        setDisplayedAstrologers(res);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("OnlineStatus");
        }
      }
    } catch (error) {
      console.error("Get_Data_Astrologer error:", error);
    } finally {
      setIsLoadingAstrologerData(false);
    }
  };

  // Get_BusyTimes function
  const Get_BusyTimes = async () => {
    try {
      const val = { IsActive: "1", Source: "chat" };
      const res = await postWithToken("Astrologer/UserGetData_Astrologer", val);

      if (res && Array.isArray(res)) {
        const initialBusyMap = {};
        const busyTimeData = {};

        res.forEach(item => {
          const astroId = String(item?.ID || item?.AstroId || item?.AstrologerID || "");
          if (!astroId) return;
          if (item?.Status === "Busy" || item?.Isbusy === true || item?.IsChat === true) {
            initialBusyMap[astroId] = { ...item, Isbusy: !!item?.Isbusy || item?.Status === "Busy" };
            busyTimeData[astroId] = item?.BusyTime || item?.CalculateTime || null;
          }
          if (item?.Status === "Busy" || item?.Isbusy === true || item?.IsCall === true) {
            initialBusyMap[astroId] = { ...item, Isbusy: !!item?.Isbusy || item?.Status === "Busy" };
            busyTimeData[astroId] = item?.BusyTime || item?.CalculateTime || null;
          }
        });
        setAstroBusyMap(initialBusyMap);
        setBusyTimes(busyTimeData);
      }
    } catch (err) {
      console.error("Get_BusyTimes error:", err);
    }
  };

  // GetDropDownData_Skills function
  const GetDropDownData_Skills = async () => {
    const val = { 'IsActive': 'true' };
    try {
      const res = await TokenWithDeleteUpadateAdd('lstSkills/GetData_Skills', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Resdata = parseData?.Table;
      if (Resdata) {
        setSkillsData(Resdata.map((sponsor: any) => ({
          value: sponsor.SkillsID,
          label: sponsor.Description
        })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // GetDropDownData_lstLanguages function
  const GetDropDownData_lstLanguages = async () => {
    const val = { 'IsActive': 'true' };
    try {
      const res = await TokenWithDeleteUpadateAdd('lstLanguages/GetData_Languages', val);
      const { data } = res;
      const parseData = JSON.parse(data);
      const Resdata = parseData?.Table;
      if (Resdata) {
        setLanguagesData(Resdata.map((sponsor: any) => ({
          value: sponsor.LanguagesID,
          label: sponsor.Description
        })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // GetDropDownData_AstrologersCategory function
  const GetDropDownData_AstrologersCategory = async () => {
    try {
      const res = await fetch('https://liveapi.astrocall.live/api/AstrologersCategory/GetDropDownData_AstrologersCategory');
      const { data } = res;
      const parsedData = JSON.parse(data?.data);
      const categoryList = parsedData?.Table;
      if (categoryList) {
        setCategoryData(categoryList.map((sponsor: any) => ({
          value: sponsor.CategoryID,
          label: sponsor.Description
        })));
      }
    } catch (error) {
      console.error("Dropdown category fetch error:", error);
    }
  };

  // GetData_ActivityLog function
  const GetData_ActivityLog = async (Action: string, Description: string) => {
    const urlSet = typeof window !== 'undefined' ? window.location.origin : "";

    const apiUrl =
      urlSet === "https://astrocall.live"
        ? "https://api.astrocall.live/api/Account/GetData_ActivityLog"
        : "https://liveapi.astrocall.live/api/Account/GetData_ActivityLog";

    const payload = {
      UserId: UserLoginId,
      Action,
      Description,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: "No Auth",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  };

  // Helper functions for WebSocket and other utilities
  const setpinguser = (socket: any) => {
    if (userpingInterval) clearInterval(userpingInterval);
    userpingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN && typeof window !== 'undefined' && localStorage.getItem("UserLoginId")) {
        socket.send(JSON.stringify({ UserId: `WU${localStorage.getItem("UserLoginId")}`, Type: "ping" }));
      }
    }, 3000);
  };

  const setpingAstro = (socket: any) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket is null or not open in setpingAstro()");
      return;
    }

    if (pingInterval) clearInterval(pingInterval);

    pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN && typeof window !== 'undefined' && localStorage.getItem("AstroLoginId")) {
        socket.send(JSON.stringify({ UserId: `WA${localStorage.getItem("AstroLoginId")}`, Type: "ping" }));
      }
    }, 3000);
  };

  const logoutOtherUser = async (loginType: string) => {
    try {
      if (loginType === "user") {
        // User is logging in - logout Astrologer
        const astroLoginId = typeof window !== 'undefined' ? localStorage.getItem("AstroLoginId") : null;
        if (astroLoginId) {
          console.log("🔄 User login detected - logging out Astrologer...");

          // Close Astrologer WebSocket
          HandleAstro(1);

          // Clear Astrologer data
          if (typeof window !== 'undefined') {
            localStorage.removeItem("AstroLoginId");
            localStorage.removeItem("AstroChatTokenId");
            sessionStorage.removeItem("AstroChatCompleted");
            sessionStorage.removeItem("UserAccepted");
            sessionStorage.removeItem("parsedDataAstro");
          }

          // Clear intervals
          if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
          }
          if (AstroPongTimeoutRef.current) {
            clearInterval(AstroPongTimeoutRef.current);
            AstroPongTimeoutRef.current = null;
          }
          if (astroReconnectInterval) {
            clearInterval(astroReconnectInterval);
            astroReconnectInterval = null;
          }

          setastroWs(null);
          setAstroParsedData(null);
          setAcceptedUser(false);
          setpopupAceept(false);

          console.log("✅ Astrologer logged out successfully");
        }
      } else if (loginType === "astrologer") {
        // Astrologer is logging in - logout User
        const userLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") : null;
        if (userLoginId) {
          console.log("🔄 Astrologer login detected - logging out User...");

          // Close User WebSocket
          HandleUser(1);

          // Clear User data
          if (typeof window !== 'undefined') {
            localStorage.removeItem("UserLoginId");
            localStorage.removeItem("IsLogin");
            sessionStorage.removeItem("UserChatCompleted");
            sessionStorage.removeItem("popupData");
            sessionStorage.removeItem("UserPopupData");
            sessionStorage.removeItem("Usermessage");
            sessionStorage.removeItem("CheckEndedChat");
          }

          // Clear intervals
          if (userpingInterval) {
            clearInterval(userpingInterval);
            userpingInterval = null;
          }
          if (userPongTimeoutRef.current) {
            clearInterval(userPongTimeoutRef.current);
            userPongTimeoutRef.current = null;
          }
          if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
          }

          setWs(null);
          setPopupData(null);
          setChatPopUpStatus(false);
          setshowinput(true);

          console.log("✅ User logged out successfully");
        }
      }
    } catch (error) {
      console.error("Error in mutual logout:", error);
    }
  };

  // WebSocket handlers (simplified for Next.js)
  const HandleUser = (state = 0) => {
    // Implementation would go here - similar to your React version
    console.log("HandleUser called with state:", state);
  };

  const HandleAstro = (state = 0) => {
    // Implementation would go here - similar to your React version
    console.log("HandleAstro called with state:", state);
  };

  // Effects
  useEffect(() => {
    if (pathname === "/") return;
    if (visitorId) return;

    const loadFingerprint = async () => {
      try {
        // Dynamic import for fingerprintjs
        const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
        if (typeof window !== 'undefined') {
          localStorage.setItem("visitor_Id", result.visitorId);
        }
      } catch (error) {
        console.error("Fingerprint error:", error);
      }
    };

    loadFingerprint();
  }, [visitorId, pathname]);

  useEffect(() => {
    const alreadyCalled = typeof window !== 'undefined' ? localStorage.getItem("muhurat_called") : null;
    const alreadyCalledVratUpvaas = typeof window !== 'undefined' ? localStorage.getItem("VratUpvaas_called") : null;

    if (alreadyCalled) {
      Get_Data_Muhurat();
      if (typeof window !== 'undefined') {
        localStorage.removeItem("muhurat_called");
      }
    } else if (alreadyCalledVratUpvaas) {
      Get_Data_VratandUpvaas();
      if (typeof window !== 'undefined') {
        localStorage.removeItem("VratUpvaas_called");
      }
    }
  }, []);

  return (
    <MenuContext.Provider
      value={{
        // User IDs
        UserLoginId, GetAstroLoginId,

        // Menu and UI states
        isMenuOpen, toggleMenu, chattalkstatus, setchattalkstatus, loginstatus, setLoginstatus,
        isModalOpen, setIsModalOpen, IsShoping, setIsShoping, isOpen, setIsOpen,

        // User and Astrologer data
        loginAstrologerData, setLoginAstrologerData, Get_SingleData_Astrologer,
        loginUserData, setLoginUserData, Get_SingleData_User,Get_find_tithi ,Get_find_sun_moon,Get_find_Nakshatra,Get_find_yoga,

        // Cart and orders
        cartdata, setcartdata, orderid, setorderid,

        // Language and localization
        LanguageDropdown, setLanguageDropdown, LanguageStatus, setLanguageStatus,

        // WebSocket and real-time data
        ws, setWs, astrows, setastroWs, popupData, setPopupData, HandleUser, HandleAstro,
        pingIntervalWS, setpingIntervalWS, setpingAstro, setpinguser,

        // Astrologer states
        AstroNameHomePage, setAstroNameHomePage, AstroNameHomePageCall, setAstroNameHomePageCall,
        astrologerToggleStatus, setAstrologerToggleStatus, AstroBusyMap, setAstroBusyMap,

        // Chat and call states
        ChatPopUpStatus, setChatPopUpStatus, userMessage, setUsermessage,
        ChatCallTrue, setChatCallTrue, AcceptedUser, setAcceptedUser,
        AstroIDWS, setAstroIDWS, valueset, setValueset,

        // Time calculations
        userCalculateTime, setUserCalculateTime, AstroCalculateTime, setAstroCalculateTime,

        // UI states
        showinput, setshowinput, popupAceept, setpopupAceept, Gemstonereviewstatus, setGemstonereviewstatus,
        chatOffline, setchatOffline, chatonline, setchatonline, reviewstatus, setreviewstatus,
        pujareviewstatus, setpujareviewstatus, PlanSuccessPopup, setPlanSuccessPopup,

        // Login and loading states
        isLogin, setisLogin, loadingAstroData, setloadingAstroData, loadingUserData, setloadingUserData,

        // Data states
        MuhuratData, setMuhuratData, VratUpvaasData, setVratUpvaasData, FAQData, setFAQData,
        sunmoonData, setsunmoonData, FindTithiData, setFindTithiData, nakshatraData, setnakshatraData,
        yogaData, setyogaData, SkillsData, setSkillsData, LanguagesData, setLanguagesData,
        CategoryData, setCategoryData,

        // Astrologer data
        astrologers, setAstrologers, astrologerdata, setastrologerdata,
        displayedAstrologers, setDisplayedAstrologers, isLoadingAstrologerData, setIsLoadingAstrologerData,

        // Call and popup states
        Callstatus, setCallstatus, isPopUPOpen, setIsPopupOpen, showPopupCall, setshowPopupCall,
        callPopupData, setcallPopupData, twominchatpopup, settwominchatpopup, playSound, setPlaySound,

        // Keys and tokens
        RazorPayKey, setRazorPayKey, GetAgoraKey, setGetAgoraKey, AstroNotBusyStatus, setAstroNotBusyStatus,
        BusyTimes, AstroNotBusy, setAstroNotBusy, AstroNotBusyCall, setAstroNotBusyCall,

        // Astrologer chat states
        AstrologerChatOnline, setAstrologerChatOnline, AstrologerChatID, setAstrologerChatID,
        astroParsedData, setAstroParsedData, astroChatCompleted, setAstroChatCompleted,
        astroCheckEndedChat, setAstroCheckEndedChat,

        // Utility functions
        Get_Data_Muhurat, Get_Data_VratandUpvaas, Get_Data_RazorPayKey, Get_Data_GetDataAgoraKey,
        Get_Data_Astrologer, Get_BusyTimes, GetDropDownData_Skills, GetDropDownData_lstLanguages,
        GetDropDownData_AstrologersCategory, GetData_ActivityLog, visitorId, setVisitorId,

        // Refs and intervals
        userPongTimeoutRef, reconnectInterval, AstroPongTimeoutRef, logoutOtherUser
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
