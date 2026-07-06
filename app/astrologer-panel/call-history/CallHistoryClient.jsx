"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  PanelPageHeader, PanelCard, StatCard, PanelFilterBar, PanelLoading, PanelEmpty,
  PanelPagination, StatusBadge, ServiceBadge,
} from "@/app/components/AstrologerPanelUi";
import { AP_INPUT, AP_BTN_OUTLINE, AP_BTN_PRIMARY } from "@/app/lib/astrologerPanelTheme";

const CallHistory = () => {
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

    const Get_Data_CallHistory = useCallback(async () => {
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
    }, [GetAstroLoginId]);

    const Get_Data_gemstone = useCallback(async () => {
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
    }, []);

    const Get_Data_OnlinePuja = useCallback(async () => {
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
    }, []);

    const Get_Data_ChatCallHistory = useCallback(async () => {
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
    }, [GetAstroLoginId]);

    useEffect(() => {
        if (!GetAstroLoginId) return;
        const timer = setTimeout(() => {
            Get_Data_CallHistory();
            Get_Data_ChatCallHistory();
            Get_Data_gemstone();
            Get_Data_OnlinePuja();
        }, 0);
        return () => clearTimeout(timer);
    }, [GetAstroLoginId, Get_Data_CallHistory, Get_Data_ChatCallHistory, Get_Data_gemstone, Get_Data_OnlinePuja]);

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
    return (
        <div className="mx-auto max-w-[1400px]">
            <PanelPageHeader
                title="Call Requests"
                breadcrumbs={["Dashboard", "Call Requests"]}
                description="View call history and suggest remedies to clients."
            />

            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Calls" value={TotalChatsdata?.TotalChatsCalls || 0} sub={`${TotalChatsdata?.ChatCallIncreaseMonth || 0} this month`} iconBg="bg-green-50" />
                <StatCard label="Total Duration" value={TotalChatsdata?.TotalDuration || 0} sub={`Avg. ${TotalChatsdata?.AvgDuration || 0} min`} iconBg="bg-orange-50" />
                <StatCard label="Total Earnings" value={`₹${TotalChatsdata?.TotalEarning || 0}`} sub={`${TotalChatsdata?.TotalEarningPer || 0}% increase`} iconBg="bg-orange-50" />
                <StatCard label="Avg. Rating" value={TotalChatsdata?.AvgRating || 0} sub="Client ratings" iconBg="bg-yellow-50" />
            </div>

            <PanelCard title="Call History">
                <PanelFilterBar>
                    <input type="date" className={AP_INPUT} value={searchDate} onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }} />
                    <input type="date" className={AP_INPUT} value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
                    <input type="text" placeholder="Search by name..." className={AP_INPUT} onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }} />
                    <select className={AP_INPUT} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                        <option>All Status</option>
                        <option>completed</option>
                        <option>in-progress</option>
                        <option>Pending</option>
                        <option>busy</option>
                        <option>no-answer</option>
                    </select>
                </PanelFilterBar>

                {loading ? (<PanelLoading />) : (<>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {currentItems?.length > 0 ? (currentItems?.map((item) => (
                            <div key={item.OrderID} className="rounded-xl border border-gray-100 bg-[#FFF9F1] p-5 transition hover:border-orange-200 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <Image src={toCdnSrcOrFallback(item?.UserImage)} alt={item.UserName} width={48} height={48} className="h-12 w-12 rounded-full object-cover ring-2 ring-orange-50" unoptimized={!!item?.UserImage} />
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A]">{item.UserName}</h3>
                                        <p className="text-xs text-gray-400">Order #{item.Id}</p>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1 text-xs text-gray-600">
                                    <p>{format(new Date(item.Datetime), "dd MMM yyyy, HH:mm")}</p>
                                    <p>Rate: ₹{item.Rate > 0 ? item.Rate : 0}/min · {item.Duration > 0 ? item.Duration : 0} min</p>
                                    <p className="font-semibold text-[#FF5C00]">₹{item.PayableAmount > 0 ? item.PayableAmount : 0}</p>
                                    <ServiceBadge type="call" />
                                    <StatusBadge status={item.Status === "completed" || item.Status === "Completed" ? "Completed" : "Pending"} />
                                </div>
                                <button type="button" className={`${AP_BTN_OUTLINE} mt-3 w-full text-xs`} onClick={() => { setSuggestStatus(true); setSuggestUserId(item?.UserId); }}>
                                    Suggest Remedy
                                </button>
                            </div>
                        ))) : (<PanelEmpty />)}
                    </div>

                    <PanelPagination page={currentPage} totalPages={totalPages} total={filteredData.length} pageSize={itemsPerPage} onPageChange={setCurrentPage} />

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
                                                                    <h5 className="mt-1 text-sm font-medium text-[#FF5C00]">
                                                                        ₹{product.TotalAmt}
                                                                    </h5>
                                                                </div>
                                                                <button className="ml-auto rounded-full border border-[#FF5C00] px-4 py-1.5 text-sm font-medium text-[#FF5C00] transition hover:bg-orange-50" onClick={() => { Insert_Suggestions(product); }}>
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
                                    <button className={`${AP_BTN_PRIMARY} rounded-full px-6 py-2 text-sm`} onClick={() => setSuggestStatusAdd(true)}>
                                        + Add
                                    </button>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>)}
                        </>)}
            </PanelCard>
        </div>
    );
};
export default CallHistory;
