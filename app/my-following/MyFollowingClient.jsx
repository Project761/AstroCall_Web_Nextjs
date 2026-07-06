"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { postWithToken } from "../utils/api";
import { UserPanelPage, PanelCard, PanelLoader, StatusBadge } from "../components/UserPanelPage";

const UserFollowing = () => {
    const UserLoginId = typeof window !== "undefined" && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";
    const [GetFollowstatus, setGetFollowstatus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalFollowers, setTotalFollowers] = useState("");
    const [newFollowers, setNewFollowers] = useState("");
    const itemsPerPage = 20;

    const totalPages = Math.ceil(GetFollowstatus?.length / itemsPerPage);
    const currentItems = GetFollowstatus?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const fetchFollowData = useCallback(async () => {
        try {
            const res = await postWithToken("AstroFollow/GetData_AstroFollow", { UserID: UserLoginId, astroID: "" });
            if (res) setGetFollowstatus(res.filter((item) => item?.AstroflowersID));
        } catch (err) { console.error("Follow Data Error", err); }
        finally { setLoading(false); }
    }, [UserLoginId]);

    const fetchFollowerStats = useCallback(async () => {
        try {
            const res = await postWithToken("AstroFollow/GetData_Followers", { UserID: UserLoginId });
            if (res?.[0]) { setTotalFollowers(res[0].TotalFollowers); setNewFollowers(res[0].NewFollowers); }
        } catch (err) { console.error("Follower Stats Error", err); }
    }, [UserLoginId]);

    useEffect(() => {
        if (UserLoginId) { queueMicrotask(() => { fetchFollowData(); fetchFollowerStats(); }); }
    }, [UserLoginId, fetchFollowData, fetchFollowerStats]);

    return (
        <UserPanelPage title="My Following" subtitle="Astrologers you follow for quick access to consultations.">
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <PanelCard className="!p-4">
                    <div className="flex items-center gap-3 text-gray-500"><FaUsers className="text-blue-500" /><span className="text-sm">Total Following</span></div>
                    <p className="mt-1 text-2xl font-bold text-blue-600">{totalFollowers || GetFollowstatus.length || 0}</p>
                </PanelCard>
                <PanelCard className="!p-4">
                    <div className="flex items-center gap-3 text-gray-500"><FaUserPlus className="text-[#FF5C00]" /><span className="text-sm">New This Week</span></div>
                    <p className="mt-1 text-2xl font-bold text-[#FF5C00]">{newFollowers || 0}</p>
                </PanelCard>
            </div>

            {loading ? <PanelLoader /> : currentItems?.length > 0 ? (
                <div className="space-y-3">
                    {currentItems.map((data, index) => (
                        <PanelCard key={index} className="!p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <img src={data?.AvatarUrl ? `https://${data.AvatarUrl.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-orange-100" />
                                    <div>
                                        <p className="font-bold text-[#1A1A1A]">{data?.DisplayName}</p>
                                        <p className="text-xs text-gray-500">₹{data?.PricePerMin}/min</p>
                                    </div>
                                </div>
                                <StatusBadge status="Following" />
                            </div>
                        </PanelCard>
                    ))}
                </div>
            ) : (
                <PanelCard className="py-12 text-center text-sm text-gray-500">No astrologers followed yet.</PanelCard>
            )}

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded-lg bg-gray-100 px-4 py-2 text-sm disabled:opacity-50">Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${currentPage === i + 1 ? "bg-[#FF5C00] text-white" : "bg-gray-100"}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded-lg bg-gray-100 px-4 py-2 text-sm disabled:opacity-50">Next</button>
                </div>
            )}
        </UserPanelPage>
    );
};

export default UserFollowing;
