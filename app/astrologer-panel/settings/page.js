"use client";
import React, { useEffect, useState } from 'react';
import { GrGallery } from "react-icons/gr";
import { IoMdStats } from 'react-icons/io';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
// Gallery component implementation
const AstroGallery = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : '';
    const [file, setFile] = useState(null);
    const [GalleryData, setGalleryData] = useState([]);
    const [galleryid, setgalleryid] = useState('');
    const [isPopUPOpen, setIsPopupOpen] = useState(false);
    const [lengthImage, setlengthImage] = useState(false);
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
    useEffect(() => {
        if (file) {
            Insert_AstrologerGallery(file);
        }
    }, [file]);
    const Insert_AstrologerGallery = async (file) => {
        if (!file) {
            console.error("File is missing!");
            return;
        }
        const formData = new FormData();
        const dataObject = {
            'AstroId': GetAstroLoginId,
            'CreatedByUser': '1'
        };
        formData.append('Data', JSON.stringify(dataObject));
        formData.append('file', file);
        try {
            // Note: TokenImageUpload needs to be implemented or imported
            console.log('Upload functionality needs TokenImageUpload API');
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
    };
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_AstrologerGallery_Data(GetAstroLoginId);
        }
    }, [GetAstroLoginId]);
    const Get_AstrologerGallery_Data = async (astroId) => {
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
    };
    useEffect(() => {
        Get_AstrologerGallery_Data();
    }, []);
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
    const [isOn, setIsOn] = useState(false);
    const [toggleStates, setToggleStates] = useState({});
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
    return (<>
            <div className="main-container rounded-xl mt-16 w-[300px]" style={{ backgroundColor: '#ff6600' }}>
                <div className="text-center text-white  rounded-xl">
                    <h3>Gallery</h3>
                </div>
            </div>
            <div className="p-10" style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
                <div className="bg-orange-100 text-center p-2 rounded text-sm mb-4">
                    Admin takes up to 7 days to approve the image. Your image shall be visible to customers when you enable at least 3 images.
                </div>

                <div className='bg-gray-300 flex justify-center p-2 items-center'>
                    <div className="flex items-center gap-4 rounded-lg w-full">
                        <div className="ml-auto">
                            <button className="border-2 border-orange-500 bg-white text-black px-10 py-2 rounded-md" onClick={() => document.getElementById('fileInput')?.click()}>
                                + Upload Image
                            </button>
                            <input type="file" id="fileInput" accept="image/*" onChange={fileHandler} style={{ display: 'none' }}/>
                        </div>
                    </div>
                </div>

                <div className='flex grid grid-cols-1 md:grid-cols-3 gap-6  w-full'>
                    {GalleryData?.length > 0 && GalleryData ? (GalleryData?.map((items) => (<div className=" bg-cover bg-center flex items-center justify-center  p-4" style={{ backgroundImage: "url('/background.jpg')" }}>
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
            </div>

            {/* Custom Modal Component instead of react-modal */}
            {isPopUPOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h5 className="text-xl mb-4">Are you sure you want to Delete?</h5>
                        <div className="flex gap-4 justify-center">
                            <button onClick={closeModal} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                                No
                            </button>
                            <button onClick={() => { if (galleryid) {
            Delete_AstrologerGallery_Data();
        } }} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                Yes
                            </button>
                        </div>
                    </div>
                </div>)}

            {lengthImage && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <div className="flex justify-end">
                            <button onClick={() => { setlengthImage(false); }} className="text-red-500 text-xl font-bold">X</button>
                        </div>
                        <h5 className="text-xl">You can only upload up to 6 images.</h5>
                    </div>
                </div>)}
        </>);
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
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_PaymentchangeRequest_Data();
        }
    }, [GetAstroLoginId]);
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
    const Get_PaymentchangeRequest_Data = async () => {
        try {
            const val = { AstroId: GetAstroLoginId, CreatedDateTo: '', CreatedDateFrom: '' };
            const res = await postWithToken("PaymentchangeRequest/GetData_PaymentchangeRequest", val);
            if (res)
                setRequests(res);
        }
        catch (error) {
            console.error("Error fetching payment change request data:", error);
        }
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
    return (<>
            <div className="main-container rounded-xl mt-16 w-[380px] bg-orange-500">
                <div className="text-center text-white font-extrabold rounded-xl">
                    <h3>PRICE CHANGE REQUEST</h3>
                </div>
            </div>

            <div className="container mx-auto p-5">
                <div className="flex justify-between items-center">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-400" onClick={handleRequestClick}>
                        Request for new price
                    </button>
                </div>

                <div className="w-full max-w-7xl grid grid-cols-1 mt-8 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            }} className={`w-full px-4 py-2 rounded-lg border ${errors.ChangedPrice ? "border-orange-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-orange-500`}/>
                                {errors.ChangedPrice && (<p className="text-sm text-red-500 mt-1">{errors.ChangedPrice}</p>)}
                            </div>

                            <div className="flex justify-end mt-6 space-x-3">
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg transition" onClick={CheckValidationErrors} disabled={loading}>
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
                            <button className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg" onClick={() => setShowAlert(false)}>
                                Okay
                            </button>
                        </div>
                    </div>)}
            </div>
        </>);
};
// Login History component implementation
const AstroLoginHistory = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [ChatStatusdata, setChatStatusdata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    useEffect(() => {
        if (GetAstroLoginId) {
            GetData_UserAstrologerStatus();
        }
    }, [GetAstroLoginId]);
    const GetData_UserAstrologerStatus = async () => {
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
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ChatStatusdata?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ChatStatusdata?.length / itemsPerPage);
    return (<>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h5 className="text-center font-semibold bg-orange-500 p-3 rounded-full sm:w-96 mx-auto">
                    Login History
                </h5>
                <br /> <br />
                <div className=" mx-auto bg-white shadow-lg rounded-2xl p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-600">
                            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
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
                </div>
                {totalPages > 1 && (<div className="flex justify-center overflow-x-auto mt-10 space-x-2">
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
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"}`} onClick={() => setCurrentPage(page)}>
                                            {page}
                                        </button>
                                    </React.Fragment>);
            })}

                        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>)}
            </div>
        </>);
};
// Terms & Conditions component implementation
const AstroTermsConditions = () => {
    const [privacyData, setPrivacyData] = useState([]);
    useEffect(() => {
        fetchPrivacyPolicy();
    }, []);
    const fetchPrivacyPolicy = async () => {
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
    };
    // Custom loading spinner component to replace OrbitProgress
    const CustomSpinner = () => (<div className="flex justify-center items-center h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>);
    return (<div className="min-h-screen px-4 py-8 md:px-16">
      {!privacyData || privacyData.length === 0 ? (<CustomSpinner />) : (privacyData.map((item, index) => (<div key={index} className="rounded-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Terms and Conditions</h1>
              <div className="h-1 w-24 bg-orange-500 mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-justify text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: item?.PrivacyPolicyhtml || '' }}/>
            </div>
          </div>)))}
    </div>);
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
    return (<div className='main-container p-6 w-full'>
          {!activeMenu ? (<>
              <div className="rounded-xl mt-10 w-[300px] mx-auto" style={{ backgroundColor: '#ff6600' }}>
                <div className="text-center text-white p-3 rounded-xl">
                  <h3>SETTINGS</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-10 w-full">
                <button onClick={() => handleMenuClick("AstroGallery")}>
                  <div className="sellerCard box-seller flex gap-7 p-4 rounded-xl duration-300 relative flex flex-col items-center transform hover:scale-90 transition-all duration-300 hover:bg-orange-50 bg-white shadow-md">
                    <div className="text-5xl text-orange-500">
                      <GrGallery />
                    </div>
                    <h6 className="mt-2 text-lg font-semibold text-center">Gallery</h6>
                  </div>
                </button>

                <button onClick={() => handleMenuClick("AstroPriceChangeRequest")}>
                  <div className="sellerCard box-seller flex gap-7 p-4 rounded-xl duration-300 relative flex flex-col items-center transform hover:scale-90 transition-all duration-300 hover:bg-orange-50 bg-white shadow-md">
                    <div className="text-5xl text-orange-500">
                      <GrGallery />
                    </div>
                    <h6 className="mt-2 text-lg font-semibold text-center">Price Change Request</h6>
                  </div>
                </button>

                <button onClick={() => handleMenuClick("AstroLoginHistory")}>
                  <div className="sellerCard box-seller flex gap-7 p-4 rounded-xl duration-300 relative flex flex-col items-center transform hover:scale-90 transition-all duration-300 hover:bg-orange-50 bg-white shadow-md">
                    <div className="text-5xl text-orange-500">
                      <IoMdStats />
                    </div>
                    <h6 className="mt-2 text-lg font-semibold text-center">Login History</h6>
                  </div>
                </button>

                <button onClick={() => handleMenuClick("AstroTermsConditions")}>
                  <div className="sellerCard box-seller flex gap-7 p-4 rounded-xl duration-300 relative flex flex-col items-center transform hover:scale-90 transition-all duration-300 hover:bg-orange-50 bg-white shadow-md">
                    <div className="text-5xl text-orange-500">
                      <IoMdStats />
                    </div>
                    <h6 className="mt-2 text-lg font-semibold text-center">Terms & Conditions</h6>
                  </div>
                </button>
              </div>
            </>) : null}

          <div>
            {activeMenu ? renderComponent() : ''}
          </div>
        </div>);
};
export default Settings;
