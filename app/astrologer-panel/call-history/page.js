"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
// Custom loading spinner component
const CustomSpinner = () => (<div className="flex justify-center mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>);
// SummaryCard component
const SummaryCard = ({ label, value, subtext }) => (<div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-green-600 mt-1">{subtext}</div>
    </div>);
const CallHistory = () => {
    const router = useRouter();
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [CallData, setCallData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [SuggestUserId, setSuggestUserId] = useState('');
    const [endDate, setEndDate] = useState("");
    const [SuggestStatus, setSuggestStatus] = useState(false);
    const [SuggestStatusAdd, setSuggestStatusAdd] = useState(false);
    const [productId, setProductId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [TotalChatsdata, setTotalChatsdata] = useState();
    // Sidebar is rendered by `app/astrologer-panel/layout.js`
    const products = [
        { id: 1, title: "Gemstone", image: "api.astrocall.live/Imagefolder/ddb0e298-3f24-4e02-8550-2dbac61b4b15_download_thumb.jpg" },
        { id: 2, title: "Online Puja", image: "api.astrocall.live/Imagefolder/3b692eac-4fe8-48b8-ab76-5ace0fae4b29_Delay In Marriage Due Destructive Shani Mangal Yog Poja_thumb.jpg" }
    ];
    const [gemstonedata, setgemstonedata] = useState([]);
    const [pujadata, setpujadata] = useState([]);
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_Data_CallHistory();
            Get_Data_ChatCallHistory();
            Get_Data_gemstone();
            Get_Data_OnlinePuja();
        }
    }, [GetAstroLoginId]);
    const Get_Data_CallHistory = async () => {
        const val = {
            IsActive: "1",
            AstroId: GetAstroLoginId,
            Type: "call"
        };
        try {
            const res = await postWithToken("ChatHistory/GetData_ChatHistory", val);
            if (res) {
                setCallData(res);
            }
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const Get_Data_gemstone = async () => {
        const val = { IsActive: "1" };
        try {
            const res = await postWithToken("Gemstone/GetData_Gemstone", val);
            if (res) {
                setgemstonedata(res?.filter((item) => item?.GemstoneID));
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const Get_Data_OnlinePuja = async () => {
        const val = { IsActive: "1" };
        try {
            const res = await postWithToken("Puja/GetData_Puja", val);
            if (res) {
                setpujadata(res.filter((item) => item?.PujaID));
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const Insert_Suggestions = async (product) => {
        const val = {
            AstrologerId: GetAstroLoginId,
            UseriD: SuggestUserId,
            ProductId: product.GemstoneID,
            Type: productId === 1 ? "GemStone" : "Puja",
            SuggestedText: "test",
            Status: "Pending ",
        };
        try {
            // Note: TokenWithDeleteUpadateAdd needs to be implemented or imported
            console.log('Insert functionality needs TokenWithDeleteUpadateAdd API');
            // const res = await TokenWithDeleteUpadateAdd("Suggestions/Insert_Suggestions", val);
            const res = { success: true }; // Placeholder
            if (res) {
                setSuggestStatus(false);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const Get_Data_ChatCallHistory = async () => {
        const val = {
            AstroID: GetAstroLoginId,
            Type: "call"
        };
        try {
            const res = await postWithToken("AstroWalletTransaction/ChatCallHistory", val);
            if (res) {
                setTotalChatsdata(res[0]);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const filteredData = CallData?.filter(item => {
        const itemDate = new Date(item.Datetime);
        const matchesName = item?.UserName?.toLowerCase().includes(searchName.toLowerCase());
        const matchesDate = searchDate || endDate
            ? (!searchDate || itemDate >= new Date(searchDate)) &&
                (!endDate || itemDate <= new Date(endDate))
            : itemDate >= sevenDaysAgo && itemDate <= today;
        const matchesStatus = statusFilter === "All Status"
            ? true
            : item?.Status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesName && matchesDate && matchesStatus;
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    return (<div className="flex-1 lg:ml-0">
                <div className="min-h-screen main-container p-6 space-y-6 font-sans">
                    <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Call History</h1>
                    <div className="w-32 h-1 bg-orange-500 rounded-full mx-auto my-2"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div>
                            <SummaryCard label="Total Calls" value={TotalChatsdata?.TotalChatsCalls || 0} subtext={`${TotalChatsdata?.ChatCallIncreaseMonth || 0} increase this month`}/>
                        </div>

                        <div>
                            <SummaryCard label="Total Duration" value={TotalChatsdata?.TotalDuration || 0} subtext={`Avg. ${TotalChatsdata?.AvgDuration || 0} min per chat`}/>
                        </div>

                        <div>
                            <SummaryCard label="Total Earnings" value={TotalChatsdata?.TotalEarning || 0} subtext={`${TotalChatsdata?.TotalEarningPer || 0}% increase this month`}/>
                        </div>

                        <div>
                            <SummaryCard label="Avg. Rating" value={TotalChatsdata?.AvgRating || 0} subtext={`From ${TotalChatsdata?.AvgRating || 0} ratings`}/>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center justify-between mb-6">
                        <div className="flex flex-wrap gap-2">
                            <input type="date" className="border rounded px-3 py-2 text-sm" value={searchDate} onChange={(e) => {
            setSearchDate(e.target.value);
            setCurrentPage(1);
        }}/>
                            <input type="date" className="border rounded px-3 py-2 text-sm" value={endDate} onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
        }}/>
                            <input type="text" placeholder="Search by name..." className="border rounded px-3 py-2 text-sm" onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
        }}/>
                            <select className="border rounded px-3 py-2 text-sm" value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
        }}>
                                <option>All Status</option>
                                <option>completed</option>
                                <option>in-progress</option>
                                <option>Pending</option>
                                <option>busy</option>
                                <option>no-answer</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (<CustomSpinner />) : (<>
                            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                {currentItems?.length > 0 ? (currentItems?.map((item) => (<div key={item.OrderID} className="p-6 rounded-xl border-t-4 border-orange-400 shadow-md hover:shadow-xl transform hover:scale-105 transition-all bg-white">
                                            <div className="flex items-center space-x-4">
                                                <img src={item.UserImage ? `https://${item.UserImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="Profile" className="w-16 h-16 rounded-full border-2 border-orange-400 hover:border-orange-600 transition"/>
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        <strong>{item.UserName}</strong>
                                                        <span className="ml-2 text-sm text-gray-500">(<strong>{item.UserId}</strong>)</span>
                                                    </h3>
                                                    <p className="text-sm text-gray-500">Order ID: <strong>{item.Id}</strong></p>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-sm text-gray-600">
                                                {format(new Date(item.Datetime), "yyyy-MM-dd HH:mm")}
                                            </div>
                                            <div className="mt-2 text-sm text-gray-700">Rate: ₹{item.Rate > 0 ? item.Rate : 0} /min</div>
                                            <div className="mt-1 text-sm text-gray-700">Duration: {item.Duration > 0 ? item.Duration : 0} minutes</div>
                                            <div className="mt-1 text-sm text-gray-700">Amount: ₹{item.PayableAmount > 0 ? item.PayableAmount : 0}</div>

                                            <div className={`text-sm mt-1 font-semibold ${item.Status === 'completed' || "Completed" ? 'text-green-500' : 'text-red-500'}`}>
                                                {item.Status}
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <button className="flex items-center gap-2 border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 font-medium px-5 py-1 rounded-full" onClick={() => { setSuggestStatus(true); setSuggestUserId(item?.UserId); }}>
                                                    Suggest Remedy
                                                </button>
                                            </div>
                                        </div>))) : (<div className="text-center col-span-full py-20 text-gray-400 font-semibold">
                                        No Data Available...
                                    </div>)}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (<div className="flex justify-center mt-10 space-x-2 overflow-x-auto">
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
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'}`} onClick={() => setCurrentPage(page)}>
                                                        {page}
                                                    </button>
                                                </React.Fragment>);
                })}

                                    <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                                        Next
                                    </button>
                                </div>)}

                            {/* Suggest Remedy Modal */}
                            {SuggestStatus && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white w-full max-w-md rounded-lg h-[80vh] sm:h-[600px] shadow-lg relative overflow-hidden">
                                        {SuggestStatusAdd && productId ? (<div className="flex flex-col h-full">
                                                <div className="bg-orange-100 flex items-center px-4 py-3 font-semibold text-lg relative shadow-sm rounded-t-xl">
                                                    <button className="text-3xl text-gray-700" onClick={() => {
                        setProductId(null);
                    }}>
                                                        <IoArrowBack />
                                                    </button>
                                                    <div className="flex-1 text-center text-gray-800 -ml-6">
                                                        {productId === 1 ? "Gemstone" : "Online Puja"}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-5 overflow-auto">
                                                    {productId === 1
                        ? gemstonedata.map((product) => (<div key={product.GemstoneID} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl shadow-md bg-white">
                                                                <img src={product?.Image1
                                ? `https://${product?.Image1?.replace(/\\/g, "/")}`
                                : "/images/default-image.jpg"} alt="Gemstone" className="w-20 h-20 object-cover rounded-lg border"/>
                                                                <div className="flex flex-col justify-between flex-1">
                                                                    <h3 className="font-semibold text-gray-900 text-base">
                                                                        {product.HeadingDescription}
                                                                    </h3>
                                                                    <h5 className="text-orange-600 font-medium mt-1 text-sm">
                                                                        ₹{product.TotalAmt}
                                                                    </h5>
                                                                </div>
                                                                <button className="ml-auto border border-orange-600 text-orange-600 hover:bg-orange-100 transition px-4 py-1.5 rounded-full text-sm font-medium" onClick={() => { Insert_Suggestions(product); }}>
                                                                    SUGGEST
                                                                </button>
                                                            </div>))
                        : pujadata.map((product) => (<div key={product.PujaID} className="flex items-center gap-4 p-3 border rounded-xl shadow-sm">
                                                                <img src={product?.PujaImage ? `https://${product?.PujaImage?.replace(/\\/g, "/")}` : "/images/default-image.jpg"} alt="Puja" className="w-20 h-20 object-cover rounded-md"/>
                                                                <div>
                                                                    <h3 className="font-medium text-gray-800">
                                                                        {product.PujaName}
                                                                    </h3>
                                                                    <h5 className="font-medium text-gray-800">
                                                                        ₹{product.TotalAmt}
                                                                    </h5>
                                                                </div>
                                                            </div>))}
                                                </div>
                                            </div>) : SuggestStatusAdd ? (<div className="flex flex-col h-full">
                                                <div className="bg-orange-100 flex items-center px-4 py-3 font-semibold text-lg relative shadow-sm rounded-t-xl">
                                                    <button className="text-3xl text-gray-700" onClick={() => {
                        setSuggestStatusAdd(false);
                    }}>
                                                        <IoArrowBack />
                                                    </button>
                                                    <div className="flex-1 text-center text-gray-800 -ml-6">
                                                        Astromall
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-5 overflow-auto">
                                                    {products.map((product) => (<div key={product.id} className="flex items-center gap-4 p-3 border rounded-xl shadow-sm cursor-pointer" onClick={() => {
                            setProductId(product.id);
                        }}>
                                                            <img src={product?.image ? `https://${product?.image?.replace(/\\/g, "/")}` : "/images/default-image.jpg"} alt={product.title} className="w-20 h-20 object-cover rounded-md"/>
                                                            <h3 className="font-medium text-gray-800">{product.title}</h3>
                                                        </div>))}
                                                </div>
                                            </div>) : (<div className="flex flex-col h-full">
                                                <div className="bg-orange-100 text-center py-3 px-4 font-semibold text-lg relative" id="suggest-remedy-title">
                                                    Suggest Remedy
                                                    <button onClick={() => setSuggestStatus(false)} className="absolute right-3 top-3 text-gray-500 hover:text-black text-xl">
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="flex-1 p-4 overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-4">
                                                    <p>You can suggest any remedy to the customer (like a doctor).</p>
                                                    <p>It can be a free mantra, advice, etc.</p>
                                                    <p>
                                                        Or a paid product like gemstone, online puja, healing, etc. which
                                                        you can sell or refer to Astromall.
                                                    </p>
                                                    <p>
                                                        You get 50% revenue if customer buys from you. If you refer to
                                                        Astromall, you get 10%.
                                                    </p>
                                                </div>

                                                <div className="p-4 border-t text-center">
                                                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium" onClick={() => setSuggestStatusAdd(true)}>
                                                        + Add
                                                    </button>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>)}
                        </>)}
                </div>
        </div>);
};
export default CallHistory;
