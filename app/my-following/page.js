"use client";
import React, { useEffect, useState } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { postWithToken } from "../utils/api";

const UserFollowing = () => {
    const UserLoginId = localStorage.getItem("UserLoginId") || "";

    const [GetFollowstatus, setGetFollowstatus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalFollowers, setTotalFollowers] = useState("");
    const [newFollowers, setNewFollowers] = useState("");
    const itemsPerPage = 20;

    const totalPages = Math.ceil(GetFollowstatus?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = GetFollowstatus?.slice(indexOfFirstItem, indexOfLastItem);
    const displayFollowers = currentItems;

    useEffect(() => {
        if (UserLoginId) {
            fetchFollowData();
            fetchFollowerStats();
        }
    }, [UserLoginId]);

    const fetchFollowData = async () => {
        try {
            const res = await postWithToken("AstroFollow/GetData_AstroFollow", {
                UserID: UserLoginId,
                astroID: "",
            });
            if (res) {
                setGetFollowstatus(res.filter((item) => item?.AstroflowersID));
            }
        } catch (err) {
            console.error("Follow Data Error", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowerStats = async () => {
        try {
            const res = await postWithToken("AstroFollow/GetData_Followers", {
                UserID: UserLoginId,
            });
            if (res?.[0]) {
                setTotalFollowers(res[0].TotalFollowers);
                setNewFollowers(res[0].NewFollowers);
            }
        } catch (err) {
            console.error("Follower Stats Error", err);
        }
    };

    const followerStats = [
        {
            label: "Total Followers",
            value: totalFollowers,
            icon: <FaUsers className="text-blue-500 w-6 h-6" />,
            color: "text-blue-600",
        },
        {
            label: "New Followers",
            value: newFollowers,
            icon: <FaUserPlus className="text-orange-500 w-6 h-6" />,
            color: "text-orange-600",
        },
    ];

    return (
        <div className="min-h-screen p-4">
            <div className=" main-container mx-auto">
                <h1 className="text-2xl  text-orange-500 font-semibold mb-1">My Following</h1>
                <p className="text-gray-600 text-sm mb-6">Your Following astrologers are saved here for quick access to consultations.</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {followerStats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                {stat.icon}
                                <span className="font-medium">{stat.label}</span>
                            </div>
                            <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value || 0}</div>
                        </div>
                    ))}
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-10 text-gray-500">Loading...</div>
                    ) : displayFollowers?.length > 0 ? (
                        displayFollowers.map((data, index) => (
                            <div key={index} className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                                    <img
                                        src={
                                            data?.AvatarUrl
                                                ? `https://${data?.AvatarUrl?.replace(/\\/g, "/")}` 
                                                : "/images/profile pic.webp"
                                        }
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="mt-3 text-lg font-semibold text-gray-700">{data?.DisplayName} ({data?.astroID})</h4>
                                <p className="text-sm text-gray-500">₹{data?.PricePerMin} / Min</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">No followers to display.</div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-2 rounded-lg ${currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserFollowing;
