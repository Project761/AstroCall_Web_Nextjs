"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { postWithToken } from "@/app/utils/api";
import { FaWallet, FaUniversity, FaChartPie } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import {
  PanelPageHeader, PanelCard, StatCard, PanelPagination, StatusBadge, RightWidget,
} from "@/app/components/AstrologerPanelUi";
import { AP_BTN_PRIMARY, AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

export default function Wallet() {
  const AstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";
  const [walletData, setWalletData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedOption, setSelectedOption] = useState("today");
  const [companyData, setCompanyData] = useState([]);
  const [astroWalletSummary, setAstroWalletSummary] = useState(null);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const generateLastSixMonths = (count = 6) =>
    Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        value: `${i + 1}_months_ago`,
        label: `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`,
        date,
      };
    });

  const getDateRange = (value) => {
    const date = new Date();
    let from = new Date();
    let to = formatDate(new Date());
    if (value === "today") {
      from.setDate(from.getDate());
      from = formatDate(from);
    } else if (value === "yesterday") {
      from.setDate(from.getDate() - 1);
      to = formatDate(from);
      from = formatDate(from);
    } else if (value === "month") {
      date.setDate(1);
      from = formatDate(date);
    } else {
      const selectedMonth = generateLastSixMonths().find((month) => month.value === value);
      if (selectedMonth) {
        const firstDay = new Date(selectedMonth.date.getFullYear(), selectedMonth.date.getMonth(), 1);
        const lastDay = new Date(selectedMonth.date.getFullYear(), selectedMonth.date.getMonth() + 1, 0);
        from = formatDate(firstDay);
        to = formatDate(lastDay);
      }
    }
    return { from, to };
  };

  const fetchWalletTransactions = useCallback(async (from, to) => {
    try {
      const val = { AstroID: AstroLoginId, TransactionDateFrom: from, TransactionDateTo: to };
      const res = await postWithToken("AstroWalletTransaction/GetData_AstroWalletTransaction", val);
      setWalletData(res);
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
    }
  }, [AstroLoginId]);

  const fetchCompanyData = useCallback(async (from, to) => {
    try {
      const val = { astroid: AstroLoginId, TransactionDateFrom: from, TransactionDateTo: to };
      const res = await postWithToken("CompanyTransaction/Getdata_AstroWallet", val);
      setCompanyData(res);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  }, [AstroLoginId]);

  const Get_AstroWalletSummary = useCallback(async (id) => {
    try {
      const val = { AstroID: id };
      const res = await postWithToken("AstroWalletTransaction/AstroWalletSummary", val);
      if (res?.length > 0) setAstroWalletSummary(res[0]);
    } catch (error) {
      console.error("Error fetching wallet summary:", error);
    }
  }, []);

  useEffect(() => {
    if (!AstroLoginId) return;
    const timer = setTimeout(() => {
      Get_AstroWalletSummary(AstroLoginId);
      const { from, to } = getDateRange(selectedOption);
      fetchCompanyData(from, to);
      fetchWalletTransactions(from, to);
    }, 0);
    return () => clearTimeout(timer);
  }, [AstroLoginId, selectedOption, Get_AstroWalletSummary, fetchCompanyData, fetchWalletTransactions]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = walletData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((walletData?.length || 0) / itemsPerPage);

  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="Wallet"
        breadcrumbs={["Dashboard", "Wallet"]}
        description="Manage your earnings, balance and withdrawal requests."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={FaWallet}
              iconBg="bg-orange-50"
              label="Current Balance"
              value={`₹${astroWalletSummary?.walletBalance || 0}`}
              sub="Available for withdrawal"
            />
            <StatCard
              icon={MdOutlinePendingActions}
              iconBg="bg-yellow-50"
              label="Pending Settlement"
              value={`₹${astroWalletSummary?.pendingAmount || 0}`}
              sub="Will be added to balance"
            />
            <StatCard
              icon={FaChartPie}
              iconBg="bg-purple-50"
              label="Lifetime Earnings"
              value={`₹${astroWalletSummary?.totalEarning || 0}`}
              sub="Total earnings till date"
            />
            <StatCard
              icon={FaUniversity}
              iconBg="bg-green-50"
              label="This Month"
              value={`₹${astroWalletSummary?.totalEarningMonth || 0}`}
              sub={`${astroWalletSummary?.totalEarningConsultent || 0}% vs last month`}
            />
          </div>

          <PanelCard
            title="Wallet Transactions"
            action={
              <select
                className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
                value={selectedOption}
                onChange={handleOptionChange}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                {generateLastSixMonths().map((month) => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            }
          >
            {companyData?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {companyData.map((item, index) => (
                  <div key={index} className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    Payable: <strong className="text-[#FF5C00]">₹{item?.PayableAmount}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FFF9F1] text-xs font-semibold uppercase text-gray-500">
                    <th className="px-3 py-3">#</th>
                    <th className="px-3 py-3">Description</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={item.orderId || index} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-3 py-3 text-xs">{indexOfFirstItem + index + 1}</td>
                        <td className="px-3 py-3">{item?.Description}</td>
                        <td className="px-3 py-3">
                          <StatusBadge status={item?.Category || "Credit"} />
                        </td>
                        <td className={`px-3 py-3 font-semibold ${item?.PayableAmount < 0 ? "text-red-600" : "text-green-600"}`}>
                          ₹ {item?.PayableAmount}
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500">
                          {item?.TransactionDateTime
                            ? format(new Date(item.TransactionDateTime), "dd MMM yyyy, HH:mm")
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No transactions available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PanelPagination
              page={currentPage}
              totalPages={totalPages}
              total={walletData?.length || 0}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </PanelCard>
        </div>

        <aside className="space-y-4">
          <RightWidget title="Withdrawal">
            <p className="text-xs text-gray-500">Current Balance</p>
            <p className="text-2xl font-extrabold text-[#FF5C00]">
              ₹{astroWalletSummary?.walletBalance || 0}
            </p>
            <button type="button" className={`${AP_BTN_PRIMARY} mt-4 w-full`}>
              Request Withdrawal
            </button>
            <button type="button" className={`${AP_BTN_OUTLINE} mt-2 w-full text-xs`}>
              Withdrawal History
            </button>
          </RightWidget>

          <RightWidget title="Bank Details">
            <div className="flex items-center gap-2">
              <FaUniversity className="text-[#FF5C00]" />
              <span className="text-sm font-semibold">Bank Account</span>
              <StatusBadge status="Approved" />
            </div>
            <Link href="/astrologer-panel/bank-details" className={`${AP_BTN_OUTLINE} mt-3 w-full text-xs`}>
              Manage Bank Details
            </Link>
          </RightWidget>

          <RightWidget title="Wallet Summary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Chat Earnings</span>
                <span className="font-semibold">₹{astroWalletSummary?.chatEarning || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Call Earnings</span>
                <span className="font-semibold">₹{astroWalletSummary?.callEarning || "—"}</span>
              </div>
            </div>
          </RightWidget>
        </aside>
      </div>
    </div>
  );
}
