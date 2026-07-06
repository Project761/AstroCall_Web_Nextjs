"use client";

import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { postWithToken } from "@/app/utils/api";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";
import {
  PanelPageHeader, PanelCard, PanelFilterBar, PanelLoading, PanelEmpty,
  PanelPagination, StatusBadge,
} from "@/app/components/AstrologerPanelUi";
import { AP_INPUT } from "@/app/lib/astrologerPanelTheme";

export default function SuggestedMall() {
  const GetAstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";
  const [SuggestionsData, setSuggestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await postWithToken("Suggestions/GetData_Suggestions", {
        AstrologerId: GetAstroLoginId,
        UseriD: "0",
        ProductType: "GemStone",
        SuggestId: "0",
      });
      if (res) setSuggestionsData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [GetAstroLoginId]);

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 0);
    return () => clearTimeout(timer);
  }, [GetAstroLoginId, fetchSuggestions]);

  const filteredData = SuggestionsData?.filter((item) => {
    const matchesDate =
      (!searchDate || item.CreatedAt >= searchDate) &&
      (!endDate || item.CreatedAt <= endDate);
    const matchesStatus =
      statusFilter === "All Status" ||
      item?.Status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesDate && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="Suggested Mall Items"
        breadcrumbs={["Dashboard", "Suggested Mall"]}
        description="Gemstones and mall products you suggested to clients."
      />

      <PanelCard title="Recent Suggestions">
        <PanelFilterBar>
          <input type="date" className={AP_INPUT} value={searchDate} onChange={(e) => { setSearchDate(e.target.value); setCurrentPage(1); }} />
          <input type="date" className={AP_INPUT} value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
          <select className={AP_INPUT} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option>All Status</option>
            <option>completed</option>
            <option>Pending</option>
          </select>
        </PanelFilterBar>

        {loading ? (
          <PanelLoading />
        ) : currentItems?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 bg-[#FFF9F1] p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={toCdnSrcOrFallback(item?.ProductImage)}
                      alt={item.ProductName}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover"
                      unoptimized={!!item?.ProductImage}
                    />
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A]">{item.ProductName}</h4>
                      <p className="text-xs text-gray-500">{item.Type}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><strong>{item.UserName}</strong></p>
                    <p className="text-xs text-gray-500">{item?.CreatedAt ? format(new Date(item.CreatedAt), "dd MMM yy") : "N/A"}</p>
                    <p className="font-semibold text-[#FF5C00]">₹{item.TotalAmt}</p>
                    <StatusBadge status={item?.Status || "Pending"} />
                  </div>
                </div>
              ))}
            </div>
            <PanelPagination page={currentPage} totalPages={totalPages} total={filteredData?.length || 0} pageSize={itemsPerPage} onPageChange={setCurrentPage} />
          </>
        ) : (
          <PanelEmpty />
        )}
      </PanelCard>
    </div>
  );
}
