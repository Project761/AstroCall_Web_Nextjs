"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaClock, FaFilter, FaVolumeUp } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { postWithToken } from "@/app/utils/api";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  PanelPageHeader, PanelCard, PanelTabs, PanelPagination,
  ServiceBadge, StatusBadge, RightWidget, PanelToggle, MiniStat,
} from "@/app/components/AstrologerPanelUi";
import { AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

export default function WaitingList() {
  const GetAstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";
  const [loading, setLoading] = useState(true);
  const [WaitinglistData, setWaitinglistData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [soundAlert, setSoundAlert] = useState(true);
  const itemsPerPage = 8;

  const Get_Data_Waitinglist_History = useCallback(async () => {
    const val = { AstroId: GetAstroLoginId, UserId: "" };
    try {
      const res = await postWithToken("WaitingList/GetData_WaitingListUser", val);
      if (res) setWaitinglistData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [GetAstroLoginId]);

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const timer = setTimeout(() => {
      Get_Data_Waitinglist_History();
    }, 0);
    return () => clearTimeout(timer);
  }, [GetAstroLoginId, Get_Data_Waitinglist_History]);

  const filtered = useMemo(() => {
    if (activeTab === "all") return WaitinglistData || [];
    if (activeTab === "waiting") return (WaitinglistData || []).filter((i) => /wait|pending/i.test(i.Status || ""));
    if (activeTab === "accepted") return (WaitinglistData || []).filter((i) => /accept/i.test(i.Status || ""));
    if (activeTab === "missed") return (WaitinglistData || []).filter((i) => /miss|reject|cancel/i.test(i.Status || ""));
    return WaitinglistData || [];
  }, [WaitinglistData, activeTab]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const tabs = [
    { id: "all", label: "All Requests", count: WaitinglistData?.length || 0 },
    { id: "waiting", label: "Waiting", count: (WaitinglistData || []).filter((i) => /wait|pending/i.test(i.Status || "")).length },
    { id: "accepted", label: "Accepted", count: (WaitinglistData || []).filter((i) => /accept/i.test(i.Status || "")).length },
    { id: "missed", label: "Missed", count: (WaitinglistData || []).filter((i) => /miss|reject|cancel/i.test(i.Status || "")).length },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div>
          <PanelPageHeader
            title="Chat Requests"
            breadcrumbs={["Dashboard", "Chat Requests"]}
            description="Manage and respond to user chat consultation requests."
            action={
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                <FaVolumeUp className="text-[#FF5C00]" />
                <span className="text-xs font-semibold text-gray-600">Sound Alert</span>
                <PanelToggle checked={soundAlert} onChange={() => setSoundAlert((v) => !v)} />
              </div>
            }
          />

          <PanelCard>
            <PanelTabs tabs={tabs} active={activeTab} onChange={(id) => { setActiveTab(id); setCurrentPage(1); }} />

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button type="button" className={`${AP_BTN_OUTLINE} text-xs`}>
                <FaFilter className="text-sm" /> Filter
              </button>
              <select className="rounded-lg border border-gray-200 px-3 py-2 text-xs">
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>

            <div className="mb-4 rounded-xl border border-orange-100 bg-[#FFF0E6] px-4 py-3 text-xs text-orange-800 sm:text-sm">
              <FaClock className="mr-1 inline text-[#FF5C00]" />
              Respond to chat requests quickly to provide better service to users.
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
                      <th className="px-3 py-3">User Details</th>
                      <th className="px-3 py-3">Request Info</th>
                      <th className="px-3 py-3">Date</th>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item.WaitingListId} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={toCdnSrcOrFallback(item?.UserImage)}
                                alt={item.UserName || "User"}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-50"
                                unoptimized={!!item?.UserImage}
                              />
                              <div>
                                <p className="font-semibold text-[#1A1A1A]">{item.UserName}</p>
                                <p className="text-xs text-gray-400">ID: {item.UserID}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <p className="text-xs text-gray-600">Request #{item.WaitingListId}</p>
                          </td>
                          <td className="px-3 py-4 text-xs text-gray-500">{item.CreatedDate}</td>
                          <td className="px-3 py-4">
                            <ServiceBadge type={item.Type || "chat"} />
                          </td>
                          <td className="px-3 py-4">
                            <StatusBadge status={item.Status || "Waiting"} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-gray-400">
                          No chat requests available
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
              total={filtered.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </PanelCard>
        </div>

        <aside className="space-y-4">
          <RightWidget title="Today's Chat Overview" action={<span className="text-xs text-[#FF5C00]">View Report</span>}>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat icon={BsChatDots} iconBg="bg-purple-100 text-purple-600" label="Total" value={WaitinglistData?.length || 0} />
              <MiniStat icon={FaClock} iconBg="bg-orange-100 text-[#FF5C00]" label="Waiting" value={tabs[1].count} />
              <MiniStat icon={BsChatDots} iconBg="bg-green-100 text-green-600" label="Accepted" value={tabs[2].count} />
              <MiniStat icon={BsChatDots} iconBg="bg-red-100 text-red-600" label="Missed" value={tabs[3].count} />
            </div>
          </RightWidget>

          <RightWidget title="Your Chat Settings">
            <ul className="space-y-3 text-sm">
              {["Auto Accept", "Sound Alert", "Popup Notification"].map((label, i) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="text-gray-600">{label}</span>
                  <PanelToggle checked={i !== 0} onChange={() => {}} />
                </li>
              ))}
            </ul>
          </RightWidget>
        </aside>
      </div>
    </div>
  );
}
