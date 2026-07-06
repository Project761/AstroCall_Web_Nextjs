"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { postWithToken } from "@/app/utils/api";
import {
  PanelPageHeader, PanelCard, StatCard, ServiceBadge, RightWidget, PanelToggle,
} from "@/app/components/AstrologerPanelUi";
import { AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

export default function Reviews() {
  const GetAstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";
  const [allFeedback, setAllFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Show All Reviews");
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Type");
  const options = ["Show All Reviews", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"];

  const fetchFeedback = useCallback(async () => {
    const val = { AstroId: GetAstroLoginId, Status: "" };
    try {
      const res = await postWithToken("Feedback/GetData_Feedback", val);
      if (res) {
        setAllFeedback(res);
        setFilteredFeedback(res);
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoading(false);
    }
  }, [GetAstroLoginId]);

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const timer = setTimeout(() => {
      fetchFeedback();
    }, 0);
    return () => clearTimeout(timer);
  }, [GetAstroLoginId, fetchFeedback]);

  const filteredData = filteredFeedback?.filter((item) => {
    const matchesName = item?.UserName?.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus =
      statusFilter === "All Type" || item?.Type?.toLowerCase() === statusFilter.toLowerCase();
    return matchesName && matchesStatus;
  });

  const avgRating = useMemo(() => {
    if (!allFeedback?.length) return "4.9";
    const sum = allFeedback.reduce((a, r) => a + (Number(r.StarCount) || 0), 0);
    return (sum / allFeedback.length).toFixed(1);
  }, [allFeedback]);

  const fiveStarPct = useMemo(() => {
    if (!allFeedback?.length) return "98%";
    const five = allFeedback.filter((r) => Number(r.StarCount) === 5).length;
    return `${Math.round((five / allFeedback.length) * 100)}%`;
  }, [allFeedback]);

  const handleOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    if (selected === "Show All Reviews") {
      setFilteredFeedback(allFeedback);
    } else {
      const starCount = parseInt(selected.split(" ")[0], 10);
      setFilteredFeedback(allFeedback.filter((item) => item.StarCount === starCount));
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => {
      const r = Number(rating) || 0;
      if (i + 1 <= Math.floor(r)) return <FaStar key={i} className="text-yellow-400" />;
      if (i < r) return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      return <FaStar key={i} className="text-gray-200" />;
    });

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="Reviews & Ratings"
        breadcrumbs={["Dashboard", "Reviews"]}
        description="See what your clients say about your consultations."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={FaStar} iconBg="bg-yellow-50" label="Average Rating" value={`${avgRating} ★`} sub="Excellent rating" />
            <StatCard label="Total Reviews" value={allFeedback?.length || 0} iconBg="bg-purple-50" sub="All time" />
            <StatCard label="Positive Reviews" value={fiveStarPct} iconBg="bg-green-50" sub="5-star reviews" />
          </div>

          <PanelCard title="All Reviews">
            <div className="mb-4 flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Search by name..."
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <select
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
                value={selectedOption}
                onChange={handleOptionChange}
              >
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Type</option>
                <option>Chat</option>
                <option>Call</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#FF5C00]" />
              </div>
            ) : filteredData?.length > 0 ? (
              <div className="space-y-4">
                {filteredData.map((review) => {
                  const formattedDate = new Date(review.CreatedDtTm).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={review.FeedbackID}
                      className="rounded-xl border border-gray-100 bg-[#FFF9F1] p-4 sm:p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-[#FF5C00]">
                            {review?.UserName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A]">{review.UserName}</p>
                            <p className="text-xs text-gray-400">{formattedDate}</p>
                            <div className="mt-1 flex items-center gap-1 text-sm">
                              {renderStars(review.StarCount)}
                              <span className="ml-1 text-xs text-gray-500">{review.StarCount}</span>
                            </div>
                          </div>
                        </div>
                        <ServiceBadge type={review.Type || "Chat"} />
                      </div>
                      {review.Comments && (
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.Comments}</p>
                      )}
                      <button type="button" className={`${AP_BTN_OUTLINE} mt-3 text-xs`}>
                        Reply
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-16 text-center text-gray-400">No reviews available</p>
            )}
          </PanelCard>
        </div>

        <aside className="space-y-4">
          <RightWidget title="Ratings Summary">
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-gray-500">Total Reviews</span><strong>{allFeedback?.length || 0}</strong></li>
              <li className="flex justify-between"><span className="text-gray-500">Average Rating</span><strong>{avgRating}/5</strong></li>
              <li className="flex justify-between"><span className="text-gray-500">5-Star Reviews</span><strong>{fiveStarPct}</strong></li>
            </ul>
          </RightWidget>

          <RightWidget title="Review Settings">
            <ul className="space-y-3 text-sm">
              {["Email Notification", "Sound Alert", "Auto Publish"].map((label, i) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="text-gray-600">{label}</span>
                  <PanelToggle checked={i !== 2} onChange={() => {}} />
                </li>
              ))}
            </ul>
          </RightWidget>
        </aside>
      </div>
    </div>
  );
}
