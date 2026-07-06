"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";
import { postWithToken } from "@/app/utils/api";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  PanelPageHeader, PanelCard, PanelTabs, PanelPagination,
  ServiceBadge, StatusBadge, StatCard, RightWidget,
} from "@/app/components/AstrologerPanelUi";
import { AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

export default function PendingList() {
  const GetAstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";
  const [PendingListData, setPendingList] = useState([]);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Type");
  const [activeTab, setActiveTab] = useState("all");
  const listFilterKey = `${searchDate}|${endDate}|${statusFilter}`;
  const [pageByFilter, setPageByFilter] = useState({});
  const currentPage = pageByFilter[listFilterKey] ?? 1;
  const setCurrentPage = (pageOrFn) => {
    setPageByFilter((prev) => {
      const current = prev[listFilterKey] ?? 1;
      const next = typeof pageOrFn === "function" ? pageOrFn(current) : pageOrFn;
      return { ...prev, [listFilterKey]: next };
    });
  };

  const Get_Data_PendingList = useCallback(async (from = "", to = "") => {
    setLoading(true);
    const val = {
      AstroID: GetAstroLoginId,
      State: statusFilter === "All Type" ? "" : statusFilter,
      Datetimefrom: from,
      Datetimeto: to,
      UserID: "",
    };
    try {
      const res = await postWithToken("ChatHistory/PendingList", val);
      if (res) setPendingList(res);
    } catch (error) {
      console.log("Error fetching pending list:", error);
    } finally {
      setLoading(false);
    }
  }, [GetAstroLoginId, statusFilter]);

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const timer = setTimeout(() => {
      Get_Data_PendingList();
    }, 0);
    return () => clearTimeout(timer);
  }, [GetAstroLoginId, Get_Data_PendingList]);

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const from = searchDate ? `${searchDate} 00:00:00` : "";
    const to = endDate ? `${endDate} 23:59:59` : "";
    const timer = setTimeout(() => {
      Get_Data_PendingList(from, to);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchDate, endDate, statusFilter, GetAstroLoginId, Get_Data_PendingList]);

  const filteredData = useMemo(() => {
    let list = PendingListData?.filter((item) =>
      item?.UserName?.toLowerCase().includes(searchName.toLowerCase())
    ) || [];
    if (activeTab === "chat") list = list.filter((i) => /chat/i.test(i.State || i.Status || ""));
    if (activeTab === "call") list = list.filter((i) => /call/i.test(i.State || i.Status || ""));
    return list;
  }, [PendingListData, searchName, activeTab]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const tabs = [
    { id: "all", label: "All", count: PendingListData?.length || 0 },
    { id: "chat", label: "Chat", count: (PendingListData || []).filter((i) => /chat/i.test(i.State || "")).length },
    { id: "call", label: "Call", count: (PendingListData || []).filter((i) => /call/i.test(i.State || "")).length },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="Consultations"
        breadcrumbs={["Dashboard", "Consultations"]}
        description="View and manage all your consultation requests."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={PendingListData?.length || 0} iconBg="bg-purple-50" />
        <StatCard label="Chat" value={tabs[1].count} iconBg="bg-green-50" />
        <StatCard label="Call" value={tabs[2].count} iconBg="bg-orange-50" />
        <StatCard label="This Week" value={filteredData.length} iconBg="bg-orange-50" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <PanelCard>
          <PanelTabs tabs={tabs} active={activeTab} onChange={(id) => { setActiveTab(id); setCurrentPage(1); }} />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <input
              type="date"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <input
              type="date"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by name..."
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
              value={searchName}
              onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
            />
            <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Type</option>
              <option>Chat</option>
              <option>Call</option>
            </select>
            <button type="button" className={`${AP_BTN_OUTLINE} text-xs`}>
              <FaFilter /> Filter
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#FF5C00]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                    <th className="px-3 py-3">Client</th>
                    <th className="px-3 py-3">Order ID</th>
                    <th className="px-3 py-3">Date & Time</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, idx) => (
                      <tr key={item?.ID ?? item?.OrderID ?? `${item?.UserID}-${idx}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={toCdnSrcOrFallback(item?.UserImage)}
                              alt={item.UserName || "User"}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                              unoptimized={!!item?.UserImage}
                            />
                            <div>
                              <p className="font-semibold">{item.UserName}</p>
                              <p className="text-xs text-gray-400">{item.UserID}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-xs">{item.ID}</td>
                        <td className="px-3 py-4 text-xs text-gray-500">
                          {item.Date ? format(new Date(item.Date), "dd MMM yyyy, HH:mm") : "—"}
                        </td>
                        <td className="px-3 py-4">
                          <ServiceBadge type={item.State || "Chat"} />
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge status={item.Status || item.State || "Pending"} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-gray-400">
                        No consultations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <PanelPagination
            page={currentPage}
            totalPages={totalPages}
            total={filteredData.length}
            pageSize={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </PanelCard>

        <RightWidget title="Quick Filters">
          <div className="space-y-3 text-sm">
            <button type="button" className={`${AP_BTN_OUTLINE} w-full text-xs`} onClick={() => { setSearchDate(""); setEndDate(""); setSearchName(""); }}>
              <FaCalendarAlt /> Clear Filters
            </button>
            <p className="text-xs text-gray-500">Use date range and type filters to find specific consultations quickly.</p>
          </div>
        </RightWidget>
      </div>
    </div>
  );
}
