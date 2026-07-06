"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FaUsers, FaUserPlus } from "react-icons/fa";
import { postWithToken } from "@/app/utils/api";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  PanelPageHeader, PanelCard, StatCard, PanelPagination, PanelEmpty, PanelLoading,
} from "@/app/components/AstrologerPanelUi";
import { AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

export default function Followers() {
  const GetAstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";
  const [GetFollowstatus, setGetFollowstatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFollowers, setTotalFollowers] = useState("");
  const [newFollowers, setNewFollowers] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  const Get_Data_AstroFollow = useCallback(async () => {
    const val = { UserID: "", astroID: GetAstroLoginId };
    try {
      const res = await postWithToken("AstroFollow/GetData_AstroFollow", val);
      if (res) setGetFollowstatus(res.filter((item) => item?.AstroflowersID));
    } catch (error) {
      console.log("Error fetching follow data:", error);
    } finally {
      setLoading(false);
    }
  }, [GetAstroLoginId]);

  const Get_TotalFollowers = useCallback(async () => {
    try {
      const res = await postWithToken("AstroFollow/GetData_Followers", { astroID: GetAstroLoginId });
      if (res) {
        setTotalFollowers(res[0]?.TotalFollowers);
        setNewFollowers(res[0]?.NewFollowers);
      }
    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  }, [GetAstroLoginId]);

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const timer = setTimeout(() => {
      Get_Data_AstroFollow();
      Get_TotalFollowers();
    }, 0);
    return () => clearTimeout(timer);
  }, [GetAstroLoginId, Get_Data_AstroFollow, Get_TotalFollowers]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = GetFollowstatus?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((GetFollowstatus?.length || 0) / itemsPerPage);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="My Followers"
        breadcrumbs={["Dashboard", "My Followers"]}
        description="Users who follow your astrology profile."
        action={<button type="button" className={AP_BTN_OUTLINE}>Export List</button>}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={FaUsers} iconBg="bg-orange-50" label="Total Followers" value={totalFollowers || 0} sub="All time" />
        <StatCard icon={FaUserPlus} iconBg="bg-orange-50" label="New Followers" value={newFollowers || 0} sub="This month" />
      </div>

      <PanelCard title="Follower List">
        {loading ? (
          <PanelLoading />
        ) : currentItems?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentItems.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl border border-gray-100 bg-[#FFF9F1] p-5 text-center transition hover:border-orange-200 hover:shadow-sm"
                >
                  <Image
                    src={toCdnSrcOrFallback(data?.ProfilePic)}
                    alt={data?.NickName || "Follower"}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-md"
                    unoptimized={!!data?.ProfilePic}
                  />
                  <h4 className="mt-3 font-semibold text-[#1A1A1A]">{data?.NickName}</h4>
                  <p className="mt-1 text-xs text-gray-500">DOB: {data?.DOB || "—"}</p>
                </div>
              ))}
            </div>
            <PanelPagination
              page={currentPage}
              totalPages={totalPages}
              total={GetFollowstatus?.length || 0}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <PanelEmpty message="No followers yet" />
        )}
      </PanelCard>
    </div>
  );
}
