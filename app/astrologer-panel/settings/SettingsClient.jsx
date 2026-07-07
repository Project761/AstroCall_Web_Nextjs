"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { GrGallery } from "react-icons/gr";
import { IoMdStats } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
import { PanelPageHeader, PanelCard, PanelLoading } from "@/app/components/AstrologerPanelUi";
import { AP_BTN_PRIMARY, AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";
// Gallery component implementation
const AstroGallery = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : '';
    const [file, setFile] = useState(null);
    const [GalleryData, setGalleryData] = useState([]);
    const [galleryid, setgalleryid] = useState('');
    const [isPopUPOpen, setIsPopupOpen] = useState(false);
    const [lengthImage, setlengthImage] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [toggleStates, setToggleStates] = useState({});
    const fileHandler = (e) => {
        const selectedFile = e.target.files?.[0];
        if (GalleryData?.length >= 6) {
            setlengthImage(true);
            return;
        }
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const Get_AstrologerGallery_Data = useCallback(async () => {
        try {
            const val = {
                AstroId: GetAstroLoginId,
                IsActive: "1"
            };
            const res = await postWithToken("AstrologerGallery/GetSinglaData_AstrologerGallery", val);
            if (res?.length > 0) {
                setGalleryData(res); 
                const initialToggleStates = {};
                res.forEach((item) => {
                    initialToggleStates[item.GalleryID] = item.IsVisible === true;
                });
                setToggleStates(initialToggleStates);
            }
        }
        catch (error) {
            console.log("Error fetching gallery:", error);
        }
    }, [GetAstroLoginId]);

    const Insert_AstrologerGallery = useCallback(async (uploadFile) => {
        if (!uploadFile) {
            console.error("File is missing!");
            return;
        }
        const formData = new FormData();
        const dataObject = {
            'AstroId': GetAstroLoginId,
            'CreatedByUser': '1'
        };
        formData.append('Data', JSON.stringify(dataObject));
        formData.append('file', uploadFile);
        try {
            // Note: TokenImageUpload needs to be implemented or imported
            // const res = await TokenImageUpload('AstrologerGallery/Insert_AstrologerGallery', formData);
            const res = { success: true }; // Placeholder
            if (res) {
                setFile(null);
                Get_AstrologerGallery_Data();
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [GetAstroLoginId, Get_AstrologerGallery_Data]);

    useEffect(() => {
        if (!file) return;
        const timer = setTimeout(() => {
            Insert_AstrologerGallery(file);
        }, 0);
        return () => clearTimeout(timer);
    }, [file, Insert_AstrologerGallery]);

    useEffect(() => {
        if (!GetAstroLoginId) return;
        const timer = setTimeout(() => {
            Get_AstrologerGallery_Data();
        }, 0);
        return () => clearTimeout(timer);
    }, [GetAstroLoginId, Get_AstrologerGallery_Data]);

    const Delete_AstrologerGallery_Data = async () => {
        const val = {
            IsActive: '0',
            GalleryID: galleryid,
            DeleteByUser: '0',
        };
        try {
            const res = await postWithToken('AstrologerGallery/Delete_AstrologerGallery', val);
            if (res) {
                Get_AstrologerGallery_Data();
                setIsPopupOpen(false);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const handleToggle = async (galleryId) => {
        const currentValue = toggleStates[galleryId] || false;
        const newValue = !currentValue;
        setToggleStates((prev) => ({
            ...prev,
            [galleryId]: newValue,
        }));
        const val = {
            IsVisible: newValue ? "1" : "0",
            GalleryID: galleryId,
        };
        try {
            const res = await postWithToken("AstrologerGallery/UpdateIsVisibleGallery", val);
            if (res[0]?.Message === "Update Successfully") {
                console.log(res[0]?.Message); // Replace with toastifySuccess
                // toastifySuccess(res[0]?.Message)
                Get_AstrologerGallery_Data();
            }
            else if (res[0]?.Message === "Sorry This Gallery is not verify by Admin") {
                console.log("Sorry This Gallery is not verify by Admin"); // Replace with toastifyInfo
                // toastifyInfo("Sorry This Gallery is not verify by Admin")
            }
        }
        catch (error) {
            console.log("Error updating visibility:", error);
        }
    };
    const closeModal = () => {
        setIsPopupOpen(false);
    };
    return (<PanelCard title="Gallery">
            <div className="rounded-xl bg-[#FFF9F1] p-3 text-center text-sm text-gray-600 mb-4">
                Admin takes up to 7 days to approve the image. Your image shall be visible to customers when you enable at least 3 images.
            </div>

            <div className="mb-6 flex justify-end">
                <button type="button" className={AP_BTN_PRIMARY} onClick={() => document.getElementById('fileInput')?.click()}>
                    + Upload Image
                </button>
                <input type="file" id="fileInput" accept="image/*" onChange={fileHandler} className="hidden" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {GalleryData?.length > 0 && GalleryData ? (GalleryData?.map((items) => (<div key={items.GalleryID} className=" bg-cover bg-center flex items-center justify-center  p-4" style={{ backgroundImage: "url('/background.jpg')" }}>
                                <div className=" ">
                                    <div className=" shadow-lg rounded-lg p-2 bg-gray-500 relative">
                                        <div className="text-center">
                                            <img src={items?.ImageUrl ? `https://${items?.ImageUrl.replace(/\\/g, "/")}` : ''} alt="Event 1" className="w-[30em] h-[25em] rounded-lg"/>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 p-2 bg-gray-100 rounded-lg">
                                            <p className={`text-sm font-medium px-3 py-1 rounded-full w-fit
                                                           ${items?.IsVerify === false
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"}`}>
                                                {items?.IsVerify === false ? "Pending" : "Verified"}
                                            </p>

                                            <label className="flex items-center space-x-2">
                                                <div key={items.GalleryID} className="flex items-center gap-2">
                                                    <span className="text-gray-600">
                                                        {toggleStates[items.GalleryID] ? "On" : "Off"}
                                                    </span>
                                                    <input type="checkbox" checked={toggleStates[items.GalleryID] || false} onChange={() => handleToggle(items.GalleryID)} className="toggle-checkbox"/>
                                                </div>

                                                <button className="text-red-500 hover:text-red-700">
                                                    <RiDeleteBin5Line size={20} onClick={() => { setIsPopupOpen(true); setgalleryid(items?.GalleryID); }}/>
                                                </button>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>))) : (<div className='font-[500]'>
                            <h3>No Images...</h3>
                        </div>)}
            </div>

            {isPopUPOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h5 className="mb-4 text-lg font-semibold">Are you sure you want to Delete?</h5>
                        <div className="flex justify-center gap-3">
                            <button type="button" onClick={closeModal} className={AP_BTN_OUTLINE}>No</button>
                            <button type="button" onClick={() => { if (galleryid) Delete_AstrologerGallery_Data(); }} className={AP_BTN_PRIMARY}>Yes</button>
                        </div>
                    </div>
                </div>
            )}

            {lengthImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <button type="button" onClick={() => setlengthImage(false)} className="mb-2 ml-auto block text-red-500">✕</button>
                        <h5 className="text-lg">You can only upload up to 6 images.</h5>
                    </div>
                </div>
            )}
        </PanelCard>);
};
// Price Change Request component implementation
const AstroPriceChangeRequest = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : '';
    const [requests, setRequests] = useState([]);
    const [errors, setErrors] = useState({});
    const [pagestatus, setpagestatus] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState({
        AstroId: GetAstroLoginId,
        ServiceType: "",
        CurrentPrice: "",
        ChangedPrice: "",
        Status: "Pending",
    });

    const Get_PaymentchangeRequest_Data = useCallback(async () => {
        try {
            const val = { AstroId: GetAstroLoginId, CreatedDateTo: '', CreatedDateFrom: '' };
            const res = await postWithToken('PaymentchangeRequest/GetData_PaymentchangeRequest', val);
            if (res) setRequests(res);
        }
        catch (error) {
            console.log(error);
        }
    }, [GetAstroLoginId]);

    useEffect(() => {
        if (!GetAstroLoginId) return;
        const timer = setTimeout(() => {
            Get_PaymentchangeRequest_Data();
        }, 0);
        return () => clearTimeout(timer);
    }, [GetAstroLoginId, Get_PaymentchangeRequest_Data]);

    const handleInputChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    };
    const reset = () => {
        setValue({
            ...value,
            ServiceType: "",
            CurrentPrice: '',
            ChangedPrice: "",
            Status: "",
        });
    };
    const Insert_PaymentchangeRequest = async () => {
        setLoading(true);
        try {
            // Note: TokenWithDeleteUpadateAdd needs to be implemented or imported
            console.log('Insert functionality needs TokenWithDeleteUpadateAdd API');
            // const res = await TokenWithDeleteUpadateAdd("PaymentchangeRequest/Insert_PaymentchangeRequest", value);
            const res = { success: true }; // Placeholder
            if (res) {
                setpagestatus(false);
                Get_PaymentchangeRequest_Data();
                reset();
            }
        }
        catch (error) {
            console.error("Error inserting payment change request:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const CheckValidationErrors = () => {
        const newErrors = {};
        if (!value.ChangedPrice)
            newErrors.ChangedPrice = 'Required *';
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            Insert_PaymentchangeRequest();
        }
    };
    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };
    const handleRequestClick = () => {
        if (!requests || requests.length === 0) {
            setpagestatus(true);
            return;
        }
        // Find the latest entry by highest Id
        const latestRequest = requests.reduce((max, item) => (item.Id > max.Id ? item : max), requests[0]);
        if (latestRequest?.Status === "Pending") {
            setShowAlert(true);
        }
        else {
            setValue((prev) => ({
                ...prev,
                ServiceType: "Chat",
                CurrentPrice: prev.CurrentPrice,
            }));
            setpagestatus(true);
        }
    };
    return (<PanelCard title="Price Change Request">
            <div className="mb-6 flex justify-end">
                <button type="button" className={AP_BTN_PRIMARY} onClick={handleRequestClick}>
                    Request for new price
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {requests.length > 0 ? (requests.map((chat) => (<div key={chat.Id} className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Price Update</h3>
                                        <p className="text-xs text-gray-500">
                                            {format(new Date(chat.CreatedDatetime), "dd MMM yyyy, hh:mm a")}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${chat.Status === "APPROVED"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"}`}>
                                        {chat.Status}
                                    </div>
                                </div>

                                <div className="mt-2 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Price:</span>
                                        <span className="font-semibold text-black">₹{chat.CurrentPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Request Price:</span>
                                        <span className="font-semibold text-black">₹{chat.Changedprice}</span>
                                    </div>
                                </div>
                            </div>))) : (<div className="col-span-full text-gray-400 font-semibold py-40 text-center">
                            <h2>No Data Available...</h2>
                        </div>)}
                </div>

                {/* Price Change Modal */}
                {pagestatus && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
                            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                                Update Price
                            </h2>

                            <div className="mb-5">
                                <label className="block text-sm text-gray-500 mb-1">Current Price:</label>
                                <p className="text-xl font-bold text-gray-700">
                                    ₹{value.CurrentPrice}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="ChangedPrice" className="block text-sm text-gray-500 mb-1">
                                    Changed Price
                                </label>
                                <input type="text" name="ChangedPrice" id="ChangedPrice" placeholder="Enter new price" value={value.ChangedPrice} onChange={(e) => {
                const inputValue = e.target.value;
                const regex = /^[0-9]*$/;
                if (regex.test(inputValue)) {
                    handleInputChange(e);
                }
            }} className={`w-full px-4 py-2 rounded-lg border ${errors.ChangedPrice ? "border-[#FF5C00]" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF5C00]`}/>
                                {errors.ChangedPrice && (<p className="text-sm text-red-500 mt-1">{errors.ChangedPrice}</p>)}
                            </div>

                            <div className="flex justify-end mt-6 space-x-3">
                                <button className="bg-[#FF5C00] hover:bg-[#E85500] text-white px-5 py-2 rounded-lg transition" onClick={CheckValidationErrors} disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                                <button className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition" onClick={() => { setpagestatus(false); setErrors({}); }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>)}

                {/* Alert Modal if request is already pending */}
                {showAlert && (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Request Already Pending</h3>
                            <p className="text-gray-600">
                                You already have a pending price change request. Please wait until it is processed before submitting another.
                            </p>
                            <button className="mt-6 bg-[#FF5C00] hover:bg-[#E85500] text-white px-5 py-2 rounded-lg" onClick={() => setShowAlert(false)}>
                                Okay
                            </button>
                        </div>
                    </div>)}
        </PanelCard>);
};
// Login History component implementation
const AstroLoginHistory = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [ChatStatusdata, setChatStatusdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const GetData_UserAstrologerStatus = useCallback(async () => {
        try {
            const today = new Date();
            const toDate = new Date(today);
            const fromDate = new Date(today);
            toDate.setMonth(toDate.getMonth() + 1);
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}/${month}/${day}`;
            };
            const val = {
                "user_Astro_Type": "A",
                "user_AstroId": GetAstroLoginId,
                "FromDate": formatDate(fromDate),
                "ToDate": formatDate(toDate)
            };
            const res = await postWithToken("ChatHistory/GetData_UserAstrologerStatus", val);
            if (res) {
                setChatStatusdata(res);
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [GetAstroLoginId]);

    useEffect(() => {
        if (!GetAstroLoginId) return;
        const timer = setTimeout(() => {
            GetData_UserAstrologerStatus();
        }, 0);
        return () => clearTimeout(timer);
    }, [GetAstroLoginId, GetData_UserAstrologerStatus]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ChatStatusdata?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ChatStatusdata?.length / itemsPerPage);
    return (<PanelCard title="Login History">
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="min-w-full text-sm text-left text-gray-600">
                            <thead className="bg-[#FFF9F1] text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Start Time</th>
                                    <th className="px-4 py-3">End Time</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.map((entry) => (<tr key={entry.Id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{entry.Type}</td>
                                        <td className="px-4 py-3">{entry.StartOnlineTime}</td>
                                        <td className="px-4 py-3">{entry.EndOnlineTime}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${entry.IsOnline && entry.IsOffline
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'}`}>
                                                {entry.IsOnline && entry.IsOffline ? 'Online/Offline' : 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </div>
                {totalPages > 1 && (<div className="flex justify-center overflow-x-auto mt-6 space-x-2">
                        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                return (page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2));
            })
                .map((page, index, arr) => {
                const prev = arr[index - 1];
                const showEllipsis = prev && page - prev > 1;
                return (<React.Fragment key={page}>
                                        {showEllipsis && (<span className="px-2 py-2 text-gray-400 select-none">...</span>)}
                                        <button className={`px-4 py-2 rounded-md ${currentPage === page
                        ? "bg-[#FF5C00] text-white"
                        : "bg-gray-200 hover:bg-gray-300"}`} onClick={() => setCurrentPage(page)}>
                                            {page}
                                        </button>
                                    </React.Fragment>);
            })}

                        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>)}
        </PanelCard>);
};
// Terms & Conditions component implementation
const AstroTermsConditions = () => {
    const [privacyData, setPrivacyData] = useState([]);

    const fetchPrivacyPolicy = useCallback(async () => {
        const payload = {
            IsActive: '1',
        };
        try {
            const response = await postWithToken('PrivacyPolicy/GetData_PrivacyPolicy', payload);
            if (response) {
                const filtered = response.filter((data) => data?.Category === 'Terms of Condition Astrologer');
                setPrivacyData(filtered);
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPrivacyPolicy();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchPrivacyPolicy]);

    // Custom loading spinner component to replace OrbitProgress
    const CustomSpinner = () => (<div className="flex justify-center items-center h-[300px]">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-orange-100 border-t-[#FF5C00]"></div>
    </div>);
    return (<PanelCard title="Terms & Conditions">
      {!privacyData || privacyData.length === 0 ? (<PanelLoading />) : (privacyData.map((item, index) => (
            <div key={index} className="prose prose-sm max-w-none text-justify text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: item?.PrivacyPolicyhtml || '' }}/>
            </div>
          )))}
    </PanelCard>);
};
const Settings = () => {
    const [activeMenu, setActiveMenu] = useState('');
    useEffect(() => {
        const handleBackButton = () => {
            setActiveMenu('');
        };
        window.addEventListener("popstate", handleBackButton);
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, []);
    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName);
        window.history.pushState({ menu: menuName }, '', `#${menuName}`);
    };
    const renderComponent = () => {
        switch (activeMenu) {
            case "AstroGallery":
                return <AstroGallery />;
            case "AstroPriceChangeRequest":
                return <AstroPriceChangeRequest />;
            case "AstroLoginHistory":
                return <AstroLoginHistory />;
            case "AstroTermsConditions":
                return <AstroTermsConditions />;
            default:
                return <p className="text-center mt-4 text-gray-500">Select an option</p>;
        }
    };
    return (<div className="mx-auto max-w-[1400px]">
          {!activeMenu ? (<>
              <PanelPageHeader title="Settings" breadcrumbs={["Dashboard", "Settings"]} description="Manage gallery, pricing, login history and terms." />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { id: "AstroGallery", label: "Gallery", icon: GrGallery, desc: "Upload profile gallery images" },
                  { id: "AstroPriceChangeRequest", label: "Price Change", icon: GrGallery, desc: "Request rate updates" },
                  { id: "AstroLoginHistory", label: "Login History", icon: IoMdStats, desc: "View account login activity" },
                  { id: "AstroTermsConditions", label: "Terms & Conditions", icon: IoMdStats, desc: "Platform terms for astrologers" },
                ].map(({ id, label, icon: Icon, desc }) => (
                  <button key={id} type="button" onClick={() => handleMenuClick(id)} className="text-left">
                    <PanelCard className="h-full transition hover:border-orange-200 hover:shadow-md">
                      <div className="flex flex-col items-center gap-3 py-2 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl text-[#FF5C00]">
                          <Icon />
                        </div>
                        <h6 className="font-semibold text-[#1A1A1A]">{label}</h6>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                    </PanelCard>
                  </button>
                ))}
              </div>
            </>) : (
              <div>
                <button type="button" onClick={() => { setActiveMenu(''); window.history.back(); }} className={`${AP_BTN_OUTLINE} mb-4 gap-2`}>
                  <IoArrowBack /> Back to Settings
                </button>
                {renderComponent()}
              </div>
            )}
        </div>);
};
export default Settings;
