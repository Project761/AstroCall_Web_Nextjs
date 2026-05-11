"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { IoLanguage } from "react-icons/io5";
import { MdOutlineCases } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import { TokenWithDeleteUpadateAdd, getPostData, postWithToken } from "@/app/utils/api";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { FaStar, FaStarHalf, FaTelegram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { LiaAwardSolid } from "react-icons/lia";
import { TbCurrencyRupee } from "react-icons/tb";
import SEO from "@/app/components/SEO/page.js";
import { toastifySuccess } from "@/app/utils/utility";
// Custom Modal Component
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg sm:text-xl font-semibold">{title}</h5>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">✕</button>
                </div>
                {children}
            </div>
        </div>);
};
// Toast notification utility

const AstrologerDetailContent = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const { name } = params;
    // Get data from sessionStorage
    const astrologersData = typeof window !== 'undefined' && sessionStorage.getItem('selectedAstrologer') ? JSON.parse(sessionStorage.getItem('selectedAstrologer') || '') : null;
    const AstroId = typeof window !== 'undefined' ? sessionStorage.getItem("AstroIDCallChat") || astrologersData?.ID || '' : '';
    const [astrologerdata, setastrologerdata] = useState([]);
    const [statusmodel, setstatusmodel] = useState(false);
    const [userfeedback, setuserfeedback] = useState([]);
    const [userstar, setuserstar] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ---------------Favourites State-----------------------------------
    const [favourites, setfavourites] = useState(true);
    const [favouriteDataID, setfavouriteDataID] = useState([]);
    const [Editval, setEditval] = useState([]);
    const FavouritesIDFilter = favouriteDataID[0]?.FavouritesID;
    const [favouritesID, setFavouritesID] = useState("");
    const Popupref = useRef(null);
    // Mock translation function - replace with actual translation if needed
    const t = (key) => {
        const translations = {
            "perMinute": "per minute"
        };
        return translations[key] || key;
    };
    useEffect(() => {
        Get_Data_Astrologer();
    }, []);
    useEffect(() => {
        if (AstroId) {
            Get_Data_Feedback(AstroId);
            Get_Data_StarCount(AstroId);
        }
    }, [AstroId]);
    const Get_Data_Astrologer = async () => {
        const val = { "AstrologerName": name, 'IsActive': '1' };
        try {
            const res = await postWithToken('Astrologer/UserGetData_Astrologer', val);
            if (res) {
                setastrologerdata(res?.filter((data) => data?.ID));
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const filterskills = astrologerdata && astrologerdata[0]?.skillsValue?.split(',');
    const Get_Data_Feedback = async (astroId) => {
        const val = {
            'AstroId': AstroId,
            'Status': ''
        };
        try {
            const res = await getPostData('Feedback/GetData_Feedback', val);
            if (res) {
                setuserfeedback(res?.filter((data) => data?.AstroId == AstroId));
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const Get_Data_StarCount = async (astroId) => {
        const val = {
            'AstroId': AstroId,
        };
        try {
            const res = await postWithToken('Feedback/GetData_StarCount', val);
            if (res) {
                setuserstar(res?.filter((data) => data?.AverageStar));
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const closeModal = () => {
        setstatusmodel(false);
    };
    const APKUrl = "https://play.google.com/store/apps/details?id=app.astrocall.live";
    const IOSUrl = "https://www.apple.com/app-store/";
    const isFilled5 = userstar && userstar[0]?.star5;
    const TotalCountstar = userstar && userstar[0]?.TotalCount;
    const calculateWidth = (starCount) => {
        return TotalCountstar > 0 ? `${(starCount / TotalCountstar) * 100}%` : '0%';
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (Popupref.current && !Popupref.current.contains(event.target) && showPopup) {
                setShowPopup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);
    useEffect(() => {
        if (UserLoginId) {
            Get_Data_favouriteslist();
        }
    }, [UserLoginId]);
    useEffect(() => {
        if (Editval && Editval?.length > 0) {
            setFavouritesID(Editval[0]?.FavouritesID);
        }
        else {
            setFavouritesID("");
        }
    }, [Editval]);
    useEffect(() => {
        if (FavouritesIDFilter) {
            Get_SinglaData_favouriteslist(FavouritesIDFilter);
        }
    }, [FavouritesIDFilter]);
    useEffect(() => {
        if (favouriteDataID?.length === 0) {
            setfavourites(false);
        }
        else {
            setfavourites(true);
            setFavouritesID(favouriteDataID[0]?.FavouritesID || '');
        }
    }, [favouriteDataID]);
    const Get_Insert_favouriteslist = async () => {
        const val = {
            'UserID': UserLoginId,
            'AstroID': AstroId,
            'CreatedByUser': '1',
        };
        try {
            const res = await TokenWithDeleteUpadateAdd('Astrofavouriteslist/Insert_Astrofavouriteslist', val);
            if (res) {
                toastifySuccess('Astrologer Added to Favorites!');
                Get_Data_favouriteslist();
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const Get_SinglaData_favouriteslist = async (FavouritesID) => {
        const val = { FavouritesID: FavouritesID };
        try {
            const res = await postWithToken("Astrofavouriteslist/GetSinglaData_Astrofavouriteslist", val);
            if (res) {
                setEditval(res);
            }
            else {
                setEditval([]);
            }
        }
        catch (error) {
            console.log(error, "error");
        }
    };
    const Get_Data_favouriteslist = async () => {
        const val = { 'UserID': UserLoginId, 'IsActive': '1' };
        try {
            const res = await postWithToken('Astrofavouriteslist/GetData_Astrofavouriteslist', val);
            if (res) {
                if (AstroId) {
                    setfavouriteDataID(res?.filter((item) => item?.AstroID == AstroId));
                }
                else {
                    console.log('astrologerID is not defined');
                }
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const favouriteslist_Delete = async () => {
        const val = {
            'FavouritesID': FavouritesIDFilter,
            'DeleteByUser': '',
            'IsActive': '0',
        };
        try {
            const res = await TokenWithDeleteUpadateAdd('Astrofavouriteslist/Delete_Astrofavouriteslist', val);
            if (res) {
                setfavourites(false);
                setFavouritesID('');
                Get_Data_favouriteslist();
                toastifySuccess('Astrologer Removed From "My Favorites"');
            }
        }
        catch (error) {
            console.error('Error deleting favourite:', error);
        }
    };
    const getCards = () => {
        return (<div className="main-container h-auto">
                <div className="bg-white w-[150px] profile-card border-2 border-orange-500">
                    <div className="list">
                        <ul>
                            <li className="hover:bg-backgroundColor">
                                <hr />
                                <div className="flex gap-4 px-5 py-2">
                                    <div className="icon text-xl"><FaTelegram /></div>
                                    <div className="name font-semibold text-sm">Telegram</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="list">
                        <ul>
                            <li className="hover:bg-backgroundColor">
                                <hr />
                                <div className="flex gap-4 px-5 py-2">
                                    <div className="icon text-xl"><FaFacebook /></div>
                                    <div className="name font-semibold text-sm">Facebook</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="list">
                        <ul>
                            <li className="hover:bg-backgroundColor">
                                <hr />
                                <div className="flex gap-4 px-5 py-2">
                                    <div className="icon text-xl"><IoLogoWhatsapp /></div>
                                    <div className="name font-semibold text-sm">Whatsapp</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="list">
                        <ul>
                            <li className="hover:bg-backgroundColor">
                                <hr />
                                <div className="flex gap-4 px-5 py-2">
                                    <div className="icon text-xl"><FaTelegram /></div>
                                    <div className="name font-semibold text-sm">Account</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>);
    };
    // -----------------------------AstroFollow---------------------------
    const [FollowStatus, setFollowStatus] = useState(false);
    const [GetFollowstatus, setGetFollowstatus] = useState(false);
    const Insert_AstroFollow = async (status) => {
        const val = {
            UserID: UserLoginId,
            astroID: AstroId,
            Follow: status,
        };
        try {
            const res = await TokenWithDeleteUpadateAdd("AstroFollow/Insert_AstroFollow", val);
            if (res) {
                Get_Data_AstroFollow();
            }
        }
        catch (error) {
            console.error("Error updating follow status:", error);
        }
    };
    useEffect(() => {
        if (UserLoginId) {
            Get_Data_AstroFollow();
        }
    }, [UserLoginId, AstroId]);
    const Get_Data_AstroFollow = async () => {
        const val = {
            UserID: UserLoginId,
            astroID: AstroId,
        };
        try {
            const res = await postWithToken("AstroFollow/GetData_AstroFollow", val);
            if (res && Array.isArray(res) && res.length > 0 && (res[0]?.Follow === true || res[0]?.Follow === 'true')) {
                setGetFollowstatus(true);
            }
            else {
                setGetFollowstatus(false);
            }
        }
        catch (error) {
            console.log("Error fetching follow data:", error);
            setGetFollowstatus(false);
        }
    };
    const HandleClickFollow = () => {
        setGetFollowstatus(!GetFollowstatus);
        Insert_AstroFollow(!GetFollowstatus);
    };
    useEffect(() => {
        if (AstroId) {
            Get_AstrologerGallery_Data();
        }
    }, [AstroId]);
    const [GalleryData, setGalleryData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(3);
    const Get_AstrologerGallery_Data = async () => {
        const val = {
            AstroId: AstroId,
            IsActive: '1',
            IsVisible: "1"
        };
        try {
            const res = await postWithToken('AstrologerGallery/GetSinglaData_AstrologerGallery', val);
            if (res) {
                setGalleryData(res);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => prevIndex === 0 ? GalleryData.length - cardsToShow : prevIndex - 1);
    };
    const handleNext = () => {
        setCurrentIndex((prevIndex) => prevIndex + cardsToShow >= GalleryData.length ? 0 : prevIndex + 1);
    };
    const ImagesData = GalleryData?.slice(currentIndex, currentIndex + cardsToShow);
    const astrologerName = astrologerdata?.[0]?.DisplayName || astrologerdata?.[0]?.FirstName || "Astrologer";
    const astrologerSkills = astrologerdata?.[0]?.skillsValue || "Astrology";
    const astrologerRating = astrologerdata?.[0]?.Review || "4.5";
    return (<>
            <SEO title={`${astrologerName} - Expert ${astrologerSkills} Astrologer | AstroCall`} description={`Consult with ${astrologerName}, an expert ${astrologerSkills} astrologer with ${astrologerRating} star rating. Get accurate predictions and guidance for your life problems.`} canonical={`https://astrocall.live/chat-to-astrologers/${name}`} type="service" schema={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: astrologerName,
            description: `Consult with ${astrologerName}, an expert ${astrologerSkills} astrologer with ${astrologerRating} star rating. Get accurate predictions and guidance for your life problems.`,
            url: `https://astrocall.live/chat-to-astrologers/${name}`
        }}/>

            <div className="mt-16">
                <div className="banner py-3 sm:py-4 md:py-5">
                    <div className="main-container z-10">
                        <div className="heading">
                            <h2 className="text-black text-xl sm:text-2xl md:text-3xl flex flex-wrap items-center gap-2">
                                <span>Our Astrologers:</span>
                                <span className="text-orange-500 font-bold">
                                    {astrologerdata ? astrologerdata[0]?.DisplayName : ''}
                                </span>
                            </h2>
                            <div className="w-[40vw] sm:w-[30vw] md:w-[12vw] h-[2px] sm:h-[3px] rounded-full bg-orange-500 my-2"></div>
                        </div>
                    </div>
                </div>

                {astrologerdata && astrologerdata ? (astrologerdata?.map((item, index) => (<div key={item?.AstrologerID || index} className="bg-orange-50">
                            <div className="main-container profile-bar py-4 sm:py-6 md:py-8 px-2 sm:px-4">
                                <div className="profile-card relative flex flex-col justify-center gap-2 items-start bg-white border-orange-500 border-2 p-3 sm:p-4 md:p-6 pr-3 sm:pr-6 md:pr-10 rounded-xl">
                                    <div className="date-card verified flex gap-2 items-center text-xs sm:text-sm">
                                        Verified
                                        <div className="tick">
                                            <MdVerified className="text-base sm:text-lg"/>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-4 sm:gap-5 pt-4 sm:pt-6 md:pt-8 w-full">
                                        <div className="text-center flex flex-col justify-center items-center w-full sm:w-auto">
                                            <div className="profile-pic flex justify-center rounded-full bg-orange-50 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] mx-auto">
                                                <img className="rounded-full w-full h-full object-cover" src={item?.AvatarUrl ? `https://${item?.AvatarUrl?.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt=""/>
                                            </div>

                                            <div className="chat-button py-2 flex justify-center w-full">
                                                <button className="bg-orange-500 flex items-center text-white border-2 px-4 sm:px-6 py-1.5 sm:py-2 border-orange-400 rounded-2xl duration-300 text-sm sm:text-base font-medium" onClick={() => {
                if (!UserLoginId) {
                    setIsModalOpen(true);
                }
                else {
                    HandleClickFollow();
                }
            }}>
                                                    {GetFollowstatus ? <>Following</> : <>Follow</>}
                                                </button>
                                            </div>

                                            <div className="ratings my-1 w-full">
                                                <div className="flex items-center justify-center space-x-[2px] text-yellow-500" style={{ lineHeight: '1', height: '18px' }}>
                                                    {Array.from({ length: 5 }).map((_, i) => {
                const rating = item?.Review || 0;
                if (i + 1 <= Math.floor(rating))
                    return <FaStar key={i} className="text-sm sm:text-base"/>;
                else if (i < rating)
                    return <FaStarHalf key={i} className="text-sm sm:text-base"/>;
                return null;
            })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-description mt-1 w-full sm:flex-1">
                                            <div className="name font-[700] text-lg sm:text-xl md:text-2xl items-center gap-3 sm:gap-4 md:gap-6 flex flex-wrap mb-2">
                                                <h1 className="break-words"> {item?.DisplayName} </h1>

                                                <div className="items-center gap-2 sm:gap-4 flex">
                                                    {UserLoginId ? (<>
                                                            <button style={{ backgroundColor: '#e4e7e4' }} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex-shrink-0">
                                                                {favourites ? (<div onClick={favouriteslist_Delete} className="cursor-pointer">
                                                                        <MdFavorite style={{ color: '#e60000' }} className="text-lg sm:text-xl"/>
                                                                    </div>) : (<div onClick={Get_Insert_favouriteslist} className="cursor-pointer">
                                                                        <MdFavoriteBorder className="text-lg sm:text-xl"/>
                                                                    </div>)}
                                                            </button>
                                                        </>) : (<div onClick={() => { setIsModalOpen(true); }}></div>)}
                                                </div>
                                            </div>

                                            <div className="specs flex flex-col gap-2 sm:gap-3 w-full">
                                                <div className="lang flex items-center gap-2 flex-wrap">
                                                    <div className="icon text-base sm:text-lg">
                                                        <LiaAwardSolid />
                                                    </div>
                                                    <p className="font-[500] text-sm sm:text-base break-words">{item?.skillsValue || "N/A"}</p>
                                                </div>
                                                <div className="lang flex items-center gap-2 flex-wrap">
                                                    <div className="icon text-base sm:text-lg">
                                                        <IoLanguage />
                                                    </div>
                                                    <p className="font-[500] text-sm sm:text-base break-words">{item?.LanguageValue || "N/A"}</p>
                                                </div>

                                                <div className="experience flex items-center gap-2">
                                                    <div className="icon text-base sm:text-lg">
                                                        <MdOutlineCases />
                                                    </div>
                                                    <p className="font-[500] text-sm sm:text-base">
                                                        {item?.ExperiencedYears} Years
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="experience flex items-center gap-2">
                                                        {item?.FreeState === "Free" ? (<div>
                                                                <p className="text-red-600 font-semibold text-sm sm:text-base">Free Chat</p>
                                                            </div>) : (<div className="flex items-center gap-2 flex-wrap">
                                                                <TbCurrencyRupee className="text-sm sm:text-base"/>
                                                                {item?.OriginalPricePerMin && item?.PricePerMin !== item?.OriginalPricePerMin ? (<>
                                                                        <p className="text-sm sm:text-base">{item?.PricePerMin} {t("perMinute")}</p>
                                                                        <p className="line-through text-gray-500 text-xs sm:text-sm">
                                                                            {item?.OriginalPricePerMin} {t("perMinute")}
                                                                        </p>
                                                                    </>) : (<p className="text-sm sm:text-base">{item?.PricePerMin || "N/A"} {t("perMinute")}</p>)}
                                                            </div>)}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-10 items-stretch sm:items-center mt-3 w-full">
                                                        {item?.IsCall === true && (<div className="chat-button my-2 sm:my-4 flex justify-center w-full sm:w-auto">
                                                                <button onClick={() => setstatusmodel(true)} className="flex items-center gap-2 px-4 sm:px-6 py-2 w-full sm:w-auto sm:min-w-[200px] md:min-w-[300px] justify-center rounded-xl border-2 border-orange-500 bg-orange-500 text-white text-base sm:text-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300">
                                                                    <IoMdCall className="text-lg sm:text-xl"/>
                                                                    <span>Call Now</span>
                                                                </button>
                                                            </div>)}

                                                        {item?.IsChat === true && (<div className="chat-button my-2 sm:my-4 flex justify-center w-full sm:w-auto">
                                                                <button onClick={() => setstatusmodel(true)} className="flex items-center gap-2 px-4 sm:px-6 py-2 w-full sm:w-auto sm:min-w-[200px] md:min-w-[300px] justify-center rounded-xl border-2 border-orange-500 bg-orange-500 text-white text-base sm:text-lg font-bold hover:bg-white hover:text-orange-500 transition duration-300">
                                                                    <IoChatbubbleEllipses className="text-lg sm:text-xl"/>
                                                                    <span>Chat Now</span>
                                                                </button>
                                                            </div>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="main-container pb-4 sm:pb-6 md:pb-8 flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center items-center px-2 sm:px-4">
                                        {astrologerdata && astrologerdata[0]?.Aboutme ? (<>
                                                <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left w-full">About</h2>
                                                <p className="my-1 text-justify text-sm sm:text-base leading-relaxed">
                                                    {astrologerdata ? astrologerdata[0]?.Aboutme : ''}
                                                </p>
                                            </>) : null}
                                    </div>

                                    <div className="px-2 sm:px-4">
                                        <div className="carousel2 flex justify-center mt-4 sm:mt-6 md:mt-8 overflow-hidden" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                            <div className="relative flex lg:gap-5 gap-2 sm:gap-3 items-center w-full">
                                                {ImagesData?.length >= 3 ? (<button onClick={handlePrevious} className="carousel-button flex justify-center items-center flex-shrink-0 z-10" aria-label="Previous">
                                                        <img src="/images/arrow.webp" alt="Previous" className="next__icon transform -scale-x-100 object-contain w-6 h-6 sm:w-8 sm:h-8"/>
                                                    </button>) : ''}
                                                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 justify-center w-full">
                                                    {ImagesData?.map((items) => (<div key={items.id} className="w-full">
                                                            <div className="card h-[200px] sm:h-[250px] md:h-[300px] lg:h-[330px] bg-[#ffffff] border-2 border-orange-500 rounded-lg flex flex-col gap-2 sm:gap-5 justify-center items-center overflow-hidden">
                                                                <img src={items?.ImageUrl ? `https://${items.ImageUrl.replace(/\\/g, "/")}` : ''} alt="Event 1" className="w-full h-full object-cover rounded-lg"/>
                                                            </div>
                                                        </div>))}
                                                </div>
                                                {ImagesData?.length >= 3 ? (<button onClick={handleNext} className="carousel-button flex justify-center items-center flex-shrink-0 z-10" aria-label="Next">
                                                        <img className="next__icon w-6 h-6 sm:w-8 sm:h-8 object-contain" src="/images/arrow.webp" alt="Next"/>
                                                    </button>) : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <CustomModal isOpen={statusmodel} onClose={closeModal} title="Download App">
                                        <div className="text-center">
                                            <p className="mb-4">Download our app to continue with this service:</p>
                                            <div className="flex gap-4 justify-center">
                                                <a href={APKUrl} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                                                    Download for Android
                                                </a>
                                                <a href={IOSUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                                    Download for iOS
                                                </a>
                                            </div>
                                        </div>
                                    </CustomModal>
                                </div>
                            </div>
                        </div>))) : (<p className="ml-2">Loading...</p>)}

                <div className="bg-orange-50 marigin_bottom">
                    {filterskills && (<div className="main-container py-4 sm:py-6 md:py-8 px-2 sm:px-4">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Specialization:</h2>
                            <div className="specialization flex flex-wrap gap-2 sm:gap-3 md:gap-5 my-4 sm:my-6 md:my-8">
                                {filterskills.map((item, index) => (<div key={index} className="speciality bg-orange-500 text-xs sm:text-sm md:text-[15px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white whitespace-nowrap">
                                        {item}
                                    </div>))}
                            </div>
                        </div>)}

                    <div className="main-container mb-5 px-2 sm:px-4">
                        <div className="cards-section flex flex-col lg:flex-row justify-center lg:justify-start gap-4 sm:gap-5">
                            {/* Rating & Reviews Card */}
                            <div className="card w-full lg:w-[400px] min-h-[250px] sm:min-h-[300px] max-h-[400px] rounded-xl p-3 sm:p-4 md:p-5 shadow-md overflow-y-auto bg-gray-100">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Rating & Reviews</h2>
                                {astrologerdata && astrologerdata[0]?.Review || isFilled5 || astrologerdata && astrologerdata[0]?.Rating ? (<>
                                        <div className="clientProfile flex items-center mb-3 sm:mb-4">
                                            {astrologerdata && astrologerdata[0]?.Review ? (<>
                                                    <span className="text-base sm:text-lg md:text-xl font-semibold">Reviews:</span>
                                                    <span className="text-orange-500 ml-2 text-base sm:text-lg md:text-xl">
                                                        {astrologerdata ? astrologerdata[0]?.Review : ''}
                                                    </span>
                                                </>) : null}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center justify-center space-x-[2px] text-yellow-500" style={{ lineHeight: '1', height: '20px' }}>
                                                {Array.from({ length: 5 }).map((_, i) => {
                const rating = astrologerdata ? astrologerdata[0]?.Review : 0 || 0;
                if (i + 1 <= Math.floor(rating))
                    return <FaStar key={i} className="text-lg sm:text-xl md:text-[25px]"/>;
                else if (i < rating)
                    return <FaStarHalf key={i} className="text-lg sm:text-xl md:text-[25px]"/>;
                return null;
            })}
                                            </div>
                                        </div>

                                        {/* Progress Bars for each rating */}
                                        {isFilled5 ? (<>
                                                <div className="w-full mt-3 sm:mt-4">
                                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                                        <span className="mr-2 text-sm sm:text-base">5</span>
                                                        <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
                                                            <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{
                    width: isFilled5 ? calculateWidth(userstar[0]?.star5) : '0%',
                }}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                                        <span className="mr-2 text-sm sm:text-base">4</span>
                                                        <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
                                                            <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{
                    width: isFilled5 ? calculateWidth(userstar[0]?.star4) : '0%',
                }}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                                        <span className="mr-2 text-sm sm:text-base">3</span>
                                                        <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
                                                            <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{
                    width: isFilled5 ? calculateWidth(userstar[0]?.star3) : '0%',
                }}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                                        <span className="mr-2 text-sm sm:text-base">2</span>
                                                        <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
                                                            <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{
                    width: isFilled5 ? calculateWidth(userstar[0]?.star2) : '0%',
                }}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center mb-1.5 sm:mb-2">
                                                        <span className="mr-2 text-sm sm:text-base">1</span>
                                                        <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
                                                            <div className="bg-orange-500 h-1.5 sm:h-2 rounded-full" style={{
                    width: isFilled5 ? calculateWidth(userstar[0]?.star1) : '0%',
                }}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>) : null}
                                    </>) : (<h4 className="text-center text-sm sm:text-base">No Rating & Reviews...</h4>)}
                            </div>

                            {/* User Feedback Section */}
                            <div className="card flex-1 lg:w-[580px] min-h-[250px] sm:min-h-[300px] max-h-[400px] overflow-y-auto rounded-xl p-3 sm:p-4 md:p-5 pb-6 sm:pb-10">
                                {userfeedback && userfeedback?.length > 0 ? (userfeedback.map((item, index) => (<div key={index} className="my-3 sm:my-4">
                                            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gray-100 shadow-sm">
                                                <div className="Reviewslogo profile-img rounded-full w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] border flex items-center justify-center flex-shrink-0 text-sm sm:text-base font-semibold">
                                                    {item?.UserName?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm sm:text-base truncate">{item?.UserName}</p>
                                                    <div className="flex mb-2">
                                                        {Array.from({ length: item?.StarCount }).map((_, starIndex) => (<FaStar key={starIndex} width={12} height={12} className="sm:w-[15px] sm:h-[15px] text-yellow-500"/>))}
                                                    </div>
                                                    {item.Comments && (<div className="reviewText p-2 sm:p-3 bg-white rounded-lg shadow">
                                                            <p className="text-xs sm:text-sm text-justify break-words">
                                                                {item.Comments?.length > 200 ? `${item.Comments.substring(0, 130)}...` : item.Comments}
                                                            </p>
                                                        </div>)}
                                                </div>
                                            </div>
                                        </div>))) : (<h1 className="text-center p-20 sm:p-40 text-sm sm:text-base">No Reviews...</h1>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Login Required">
                <h5 className="text-lg sm:text-xl mb-4 sm:mb-5 text-center">Please login to continue</h5>
                <div className="flex justify-center">
                    <button className="bg-orange-500 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow hover:shadow-lg transition duration-300 text-sm sm:text-base" onClick={() => {
            router.push('/login');
        }}>
                        Go to Login
                    </button>
                </div>
            </CustomModal>
        </>);
};

export default function AstrologerDetail() {
    return (<Suspense fallback={<div className="main-container py-10 text-center">Loading...</div>}>
      <AstrologerDetailContent />
    </Suspense>);
}
