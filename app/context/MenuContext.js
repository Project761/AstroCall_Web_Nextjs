"use client";
import React, { createContext, useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { postWithToken, GetWithToken, TokenWithDeleteUpadateAdd, getPostData } from "../utils/api";
import { format } from "date-fns";
export const MenuContext = createContext();


export const MenuProvider = ({ children }) => {
    const pathname = usePathname();
    const [UserLoginId, setUserLoginId] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : ""
    );
    const [GetAstroLoginId, setGetAstroLoginId] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") || "" : ""
    );
    // State management
    const [isMenuOpen, setisMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [loginUserData, setLoginUserData] = useState(null);
    const [loginAstrologerData, setLoginAstrologerData] = useState([]);
    const [orderid, setorderid] = useState();
    const [LanguageDropdown, setLanguageDropdown] = useState("en");
    const [LanguageStatus, setLanguageStatus] = useState(true);

    const [astroCheckEndedChat, setAstroCheckEndedChat] = useState(null)
    const [UserCheckEndedChat, setUserCheckEndedChat] = useState(null)
    const [astroParsedData, setAstroParsedData] = useState(null);

    const [Astropageload, setAstropageload] = useState(false);
    const [userCalculateTime, setUserCalculateTime] = useState("");
    const [AstroCalculateTime, setAstroCalculateTime] = useState("");
    const [ChatPopUpStatus, setChatPopUpStatus] = useState(false);
    const [userMessage, setUsermessage] = useState("");
    const [ChatCallTrue, setChatCallTrue] = useState(false);
    const [AstroNameHomePage, setAstroNameHomePage] = useState();
    const [AstroNameHomePageCall, setAstroNameHomePageCall] = useState();
    const [Gemstonereviewstatus, setGemstonereviewstatus] = useState(false);
    const [PlanSuccessPopup, setPlanSuccessPopup] = useState(false);
    const [FAQData, setFAQData] = useState([]);
    const [isLogin, setisLogin] = useState(() => {
        if (typeof window === "undefined") return false;
        return Boolean(
            localStorage.getItem("LoginTokenData") &&
            localStorage.getItem("UserLoginId")
        );
    });
    const [loadingUserData, setloadingUserData] = useState(false);







    const [MuhuratData, setMuhuratData] = useState();
    const [VratUpvaasData, setVratUpvaasData] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [ws, setWs] = useState(null);
    const [astrows, setastroWs] = useState(null);
    const [pingIntervalWS, setpingIntervalWS] = useState();
    const [reviewstatus, setreviewstatus] = useState(false);
    const [popupAceept, setpopupAceept] = useState(false);
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
    const [AstroBusyMap, setAstroBusyMap] = useState({});
    const [AstroNotBusyStatus, setAstroNotBusyStatus] = useState(false);
    const [AstroNotBusy, setAstroNotBusy] = useState('');
    const [AstroNotBusyCall, setAstroNotBusyCall] = useState('');
    const [isLoadingAstrologerData, setIsLoadingAstrologerData] = useState(false);
    const [visitorId, setVisitorId] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("visitor_Id") || "" : ""
    );

    const toggleMenu = () => setisMenuOpen(prev => !prev);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setUserLoginId(localStorage.getItem("UserLoginId") || "");
        setGetAstroLoginId(localStorage.getItem("AstroLoginId") || "");
    }, [isLogin]);

    const Get_SingleData_User = useCallback(async (id) => {
        if (!id)
            return;
        setloadingUserData(true);
        try {
            const res = await postWithToken("User/GetSingleData_User", { UserID: id });
            if (res && res.length > 0) {
                setLoginUserData(res[0]);
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setloadingUserData(false);
        }
    }, []);

    const Get_SingleData_Astrologer = useCallback(async (id) => {
        try {
            const res = await postWithToken("Astrologer/GetSingleData_Astrologer", { AstrologerID: id });
            if (res) {
                setLoginAstrologerData(res[0]);
            }
        }
        catch (err) {
            console.error(err);
        }
    }, []);

    const Get_Data_GetDataAgoraKey = useCallback(async () => {
        // Only proceed if user is authenticated
        if (!isLogin && !GetAstroLoginId) {
            return;
        }
        try {
            const res = await GetWithToken("RazorPay/GetDataAgoraKey");
            if (res?.success === true) {
                setGetAgoraKey(res?.data);
            }
        }
        catch (err) {
            console.error(err);
        }
    }, [isLogin, GetAstroLoginId]);

    useEffect(() => {
        void (async () => {
            await Get_SingleData_User(UserLoginId);
        })();
    }, [UserLoginId, Get_SingleData_User]);

    useEffect(() => {
        if (isLogin || GetAstroLoginId) {
            void (async () => {
                await Get_Data_GetDataAgoraKey();
            })();
        }
    }, [isLogin, GetAstroLoginId, Get_Data_GetDataAgoraKey]);

    useEffect(() => {
        if (GetAstroLoginId) {
            void (async () => {
                await Get_SingleData_Astrologer(GetAstroLoginId);
            })();
        }
    }, [GetAstroLoginId, Get_SingleData_Astrologer]);

    // Get_Data_RazorPayKey function
    const Get_Data_RazorPayKey = async () => {
        // Only proceed if user is authenticated
        if (!isLogin && !GetAstroLoginId) {
            return;
        }
        try {
            const res = await GetWithToken("RazorPay/GetDataRazorPayKey");
            if (res?.success === true) {
                setRazorPayKey(res?.data);
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    // Get_Data_GetDataAgoraKey function — defined above with useCallback

    const Get_Data_Muhurat = useCallback(async () => {
        try {
            // Check if data is cached (simple 1-hour cache)
            // const cachedData = typeof window !== 'undefined' ? localStorage.getItem("muhurat_data") : null;
            // const cachedTime = typeof window !== 'undefined' ? localStorage.getItem("muhurat_time") : null;
            // const now = new Date().getTime();
            // // Cache for 1 hour (3600000 ms)
            // if (cachedData && cachedTime && (now - parseInt(cachedTime)) < 3600000) {
            //     setMuhuratData(JSON.parse(cachedData));
            //     return;
            // }
            // Fetch fresh data
            const res = await getPostData("Muhurat/GetData_Muhurat", { IsActive: "1" });
            // console.log(res, "res")
            setMuhuratData(res);
            // Cache for 1 hour
            // if (typeof window !== 'undefined') {
            //     localStorage.setItem("muhurat_data", JSON.stringify(res));
            //     localStorage.setItem("muhurat_time", now.toString());
            //     localStorage.setItem("muhurat_called", "true");
            // }
        }
        catch (err) {
            console.error(err);
            // Use cached data if API fails
            // const cachedData = typeof window !== 'undefined' ? localStorage.getItem("muhurat_data") : null;
            // if (cachedData) {
            //     setMuhuratData(JSON.parse(cachedData));
            // }
        }
    }, []);

    // Get_Data_VratandUpvaas function
    const Get_Data_VratandUpvaas = useCallback(async () => {
        try {
            // Check if data is cached (simple 1-hour cache)
            // const cachedData = typeof window !== 'undefined' ? localStorage.getItem("vratupvaas_data") : null;
            // const cachedTime = typeof window !== 'undefined' ? localStorage.getItem("vratupvaas_time") : null;
            // const now = new Date().getTime();
            // // Cache for 1 hour (3600000 ms)
            // if (cachedData && cachedTime && (now - parseInt(cachedTime)) < 3600000) {
            //     setVratUpvaasData(JSON.parse(cachedData));
            //     return;
            // }
            // Fetch fresh data
            const res = await getPostData("VratUpvaas/GetData_VratUpvaas", { IsActive: "1" });
            if (res) {
                setVratUpvaasData(res);
                // Cache for 1 hour
                // if (typeof window !== 'undefined') {
                //     localStorage.setItem("vratupvaas_data", JSON.stringify(res));
                //     localStorage.setItem("vratupvaas_time", now.toString());
                //     localStorage.setItem("VratUpvaas_called", "true");
                // }
            }
        }
        catch (err) {
            console.error(err);
            // Use cached data if API fails
            // const cachedData = typeof window !== 'undefined' ? localStorage.getItem("vratupvaas_data") : null;
            // if (cachedData) {
            //     setVratUpvaasData(JSON.parse(cachedData));
            // }
        }
    }, []);

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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("Get_Data_Astrologer error:", error);
        }
        finally {
            setIsLoadingAstrologerData(false);
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
                setSkillsData(Resdata.map((sponsor) => ({
                    value: sponsor.SkillsID,
                    label: sponsor.Description
                })));
            }
        }
        catch (error) {
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
                setLanguagesData(Resdata.map((sponsor) => ({
                    value: sponsor.LanguagesID,
                    label: sponsor.Description
                })));
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    // GetDropDownData_AstrologersCategory function
    const GetDropDownData_AstrologersCategory = async () => {
        try {
            const res = await fetch("https://liveapi.astrocall.live/api/AstrologersCategory/GetDropDownData_AstrologersCategory", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const json = await res.json();
            // API sometimes returns { data: "<json-string>" } and sometimes already-object
            const raw = json?.data ?? json;
            const parsedData = typeof raw === "string" ? JSON.parse(raw) : raw;
            const categoryList = parsedData?.Table ?? parsedData?.data?.Table ?? parsedData?.Data?.Table;
            if (categoryList) {
                setCategoryData(categoryList.map((sponsor) => ({
                    value: sponsor.CategoryID,
                    label: sponsor.Description
                })));
            }
        }
        catch (error) {
            console.error("Dropdown category fetch error:", error);
        }
    };
    // GetData_ActivityLog function
    const GetData_ActivityLog = async (Action, Description) => {
        const urlSet = typeof window !== 'undefined' ? window.location.origin : "";
        const apiUrl = urlSet === "https://astrocall.live"
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

    useEffect(() => {
        if (pathname === "/")
            return;
        if (visitorId)
            return;
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
            }
            catch (error) {
                console.error("Fingerprint error:", error);
            }
        };
        loadFingerprint();
    }, [visitorId, pathname]);

    useEffect(() => {
        void (async () => {
            if (pathname === "/Muhurat") {
                await Get_Data_Muhurat();
            }
            if (pathname === "/VratUpvaas" || pathname === "/Upcomingfestival") {
                await Get_Data_VratandUpvaas();
            }
        })();
    }, [pathname, Get_Data_Muhurat, Get_Data_VratandUpvaas]);

    return (<MenuContext.Provider value={{
        // User IDs
        UserLoginId, setUserLoginId, GetAstroLoginId,
        // Menu and UI states
        isMenuOpen, setisMenuOpen, toggleMenu,
        isModalOpen, setIsModalOpen, isOpen, setIsOpen,
        // User and Astrologer data
        loginAstrologerData, setLoginAstrologerData, Get_SingleData_Astrologer,
        loginUserData, setLoginUserData, Get_SingleData_User, Get_find_tithi, Get_find_sun_moon, Get_find_Nakshatra, Get_find_yoga,
        // Cart and orders
        orderid, setorderid,
        // Language and localization
        LanguageDropdown, setLanguageDropdown, LanguageStatus, setLanguageStatus,
        // WebSocket and real-time data
        ws, setWs, astrows, setastroWs, popupData, setPopupData,
        pingIntervalWS, setpingIntervalWS,
        // Astrologer states
        AstroNameHomePage, setAstroNameHomePage, AstroNameHomePageCall, setAstroNameHomePageCall,
        astrologerToggleStatus, setAstrologerToggleStatus, AstroBusyMap, setAstroBusyMap,
        // Chat and call states
        ChatPopUpStatus, setChatPopUpStatus, userMessage, setUsermessage,
        ChatCallTrue, setChatCallTrue,

        popupAceept, setpopupAceept, Gemstonereviewstatus, setGemstonereviewstatus,
        chatOffline, setchatOffline, chatonline, setchatonline, reviewstatus, setreviewstatus,
        PlanSuccessPopup, setPlanSuccessPopup,
        // Login and loading states
        isLogin, setisLogin, loadingUserData, setloadingUserData,
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
        BusyTimes, setBusyTimes, AstroNotBusy, setAstroNotBusy, AstroNotBusyCall, setAstroNotBusyCall,
        // Utility functions
        Get_Data_Muhurat, Get_Data_VratandUpvaas, Get_Data_RazorPayKey, Get_Data_GetDataAgoraKey,
        Get_Data_Astrologer, GetDropDownData_Skills, GetDropDownData_lstLanguages,
        GetDropDownData_AstrologersCategory, GetData_ActivityLog, visitorId, setVisitorId, astroCheckEndedChat, setAstroCheckEndedChat, astroParsedData, setAstroParsedData, UserCheckEndedChat, setUserCheckEndedChat

        , Astropageload, setAstropageload, userCalculateTime, setUserCalculateTime, AstroCalculateTime, setAstroCalculateTime


    }}>
        {children}
    </MenuContext.Provider>);
};
