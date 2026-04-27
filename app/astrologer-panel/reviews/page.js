"use client";
import React, { useEffect, useState } from "react";
import { postWithToken } from "@/app/utils/api";
import { LuStar, LuMessageSquare, LuThumbsUp } from 'react-icons/lu';
import { FaStar, FaStarHalf } from "react-icons/fa6";
const Reviews = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [allFeedback, setAllFeedback] = useState([]);
    const [filteredFeedback, setFilteredFeedback] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Type");
    const options = ["Show All Reviews", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"];
    useEffect(() => {
        if (GetAstroLoginId) {
            fetchFeedback(GetAstroLoginId);
        }
    }, [GetAstroLoginId]);
    const fetchFeedback = async () => {
        const val = {
            AstroId: GetAstroLoginId,
            Status: ""
        };
        try {
            const res = await postWithToken("Feedback/GetData_Feedback", val);
            if (res) {
                setAllFeedback(res);
                setFilteredFeedback(res);
            }
        }
        catch (error) {
            console.error("Failed to fetch feedback:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredData = filteredFeedback?.filter(item => {
        const matchesName = item?.UserName?.toLowerCase().includes(searchName.toLowerCase());
        const matchesStatus = statusFilter === "All Type"
            ? true
            : item?.Type?.toLowerCase() === statusFilter.toLowerCase();
        return matchesName && matchesStatus;
    });
    const handleOptionChange = (e) => {
        const selected = e.target.value;
        setSelectedOption(selected);
        if (selected === "Show All Reviews") {
            setFilteredFeedback(allFeedback);
        }
        else {
            const starCount = parseInt(selected.split(" ")[0], 10);
            const filtered = allFeedback.filter((item) => item.StarCount === starCount);
            setFilteredFeedback(filtered);
        }
    };
    return (<div className="w-full">
                <div className="main-container p-6 w-full">
                    <div className="mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <LuStar className="w-6 h-6 text-orange-500 fill-orange-500"/>
                                <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Overall Rating */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border">
                                <div className="flex items-center gap-2 mb-2">
                                    <LuStar className="w-5 h-5 text-orange-500 fill-orange-500"/>
                                    <span className="text-lg font-semibold">4.8</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">Overall Rating</div>
                                <div className="text-xs text-green-600">6.2 increase from month</div>
                            </div>

                            {/* Total Reviews */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border">
                                <div className="flex items-center gap-2 mb-2">
                                    <LuMessageSquare className="w-5 h-5 text-blue-500"/>
                                    <span className="text-lg font-semibold">142</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
                                <div className="text-xs text-green-600">12 new this month</div>
                            </div>

                            {/* 5-Star Reviews */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border">
                                <div className="flex items-center gap-2 mb-2">
                                    <LuThumbsUp className="w-5 h-5 text-green-500"/>
                                    <span className="text-lg font-semibold">92%</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-1">5-Star Reviews</div>
                                <div className="text-xs text-gray-500">65% of total reviews</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-container p-6 w-full">
                    <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center justify-between mb-6">
                        <div className="flex flex-wrap gap-2">
                            <input type="text" placeholder="Search by name..." className="border rounded px-3 py-2 text-sm" onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
        }}/>

                            <div className="flex items-start w-[200px] gap-3 p-4 border rounded px-3 py-2 shadow-sm">
                                <select className="search-input p-0 text-black flex gap-2 items-center focus:outline-none hover:cursor-pointer" value={selectedOption} onChange={handleOptionChange}>
                                    {options?.map((option, index) => (<option key={index} value={option}>
                                            {option}
                                        </option>))}
                                </select>
                            </div>

                            <select className="border rounded px-3 py-2 text-sm" value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
        }}>
                                <option>All Type</option>
                                <option>Chat</option>
                                <option>Call</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="main-container p-6 w-full">
                    <div className="mx-auto p-6 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-500 text-lg">🔔</span>
                                <h2 className="text-lg font-medium text-gray-800">Recent Reviews</h2>
                            </div>
                        </div>

                        {/* Reviews */}
                        {loading ? (<div className="flex justify-center mt-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                            </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredData?.length > 0 ? (filteredData?.map((review) => {
                const formattedDate = new Date(review.CreatedDtTm).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });
                return (<div key={review.FeedbackID} className="p-4 rounded-xl shadow-md border-t-4 border-orange-300 bg-white">
                                                <p className="text-xs font-medium text-gray-600 mb-1">Order ID: {review.FeedbackID}</p>

                                                <div className="flex items-start gap-3">
                                                    {/* Avatar Circle */}
                                                    <div className="Reviewslogo profile-img rounded-full w-[50px] h-[50px] border flex items-center justify-center">
                                                        {review?.UserName?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg">
                                                            <strong>{review.UserName}</strong>
                                                            <span className="ml-2 text-sm text-gray-500">(<strong>{review.UserID}</strong>)</span>
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Service: <span className="text-green-600 font-semibold">{review.Type}</span>
                                                        </p>

                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center justify-center space-x-[2px] text-yellow-500" style={{ lineHeight: '1', height: '22px' }}>
                                                                {Array.from({ length: 5 }).map((_, i) => {
                        const rating = review?.StarCount || 0;
                        if (i + 1 <= Math.floor(rating))
                            return <FaStar key={i} className="text-[16px]"/>;
                        else if (i < rating)
                            return <FaStarHalf key={i} className="text-[16px]"/>;
                        return null;
                    })}
                                                            </div>
                                                            <span className="text-xs text-gray-500">{formattedDate}</span>
                                                        </div>

                                                        {review.Comments && (<p className="text-sm text-gray-700 mt-2">{review.Comments}</p>)}
                                                    </div>
                                                </div>
                                            </div>);
            })) : (<div className="col-span-full text-center text-gray-500">No Data Available</div>)}
                            </div>)}
                    </div>
                </div>
        </div>);
};
export default Reviews;
