"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { postWithToken } from "@/app/utils/api";
import { FaWallet, FaFileExport } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { BsBank } from "react-icons/bs";
// Sidebar is rendered by `app/astrologer-panel/layout.js`
const Wallet = () => {
    const router = useRouter();
    const AstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [walletData, setWalletData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [selectedOption, setSelectedOption] = useState("today");
    const [companyData, setCompanyData] = useState([]);
    const [astroWalletSummary, setAstroWalletSummary] = useState(null);
    useEffect(() => {
        if (AstroLoginId) {
            Get_AstroWalletSummary(AstroLoginId);
            const { from, to } = getDateRange(selectedOption);
            fetchCompanyData(from, to, AstroLoginId);
            fetchWalletTransactions(from, to, AstroLoginId);
        }
    }, [AstroLoginId, selectedOption]);
    const fetchWalletTransactions = async (from, to) => {
        try {
            const val = { AstroID: AstroLoginId, TransactionDateFrom: from, TransactionDateTo: to };
            const res = await postWithToken("AstroWalletTransaction/GetData_AstroWalletTransaction", val);
            setWalletData(res);
        }
        catch (error) {
            console.error("Error fetching wallet transactions:", error);
        }
    };
    const fetchCompanyData = async (from, to) => {
        try {
            const val = { astroid: AstroLoginId, TransactionDateFrom: from, TransactionDateTo: to };
            const res = await postWithToken("CompanyTransaction/Getdata_AstroWallet", val);
            setCompanyData(res);
        }
        catch (error) {
            console.error("Error fetching company data:", error);
        }
    };
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = walletData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(walletData?.length / itemsPerPage);
    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        const { from, to } = getDateRange(value);
        fetchCompanyData(from, to);
        fetchWalletTransactions(from, to);
    };
    const generateLastSixMonths = (count = 6) => {
        return Array.from({ length: count }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString("default", { month: "long" });
            const year = date.getFullYear();
            return { value: `${i + 1}_months_ago`, label: `${monthName} ${year}`, date };
        });
    };
    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };
    const getDateRange = (value) => {
        const date = new Date();
        let from = new Date();
        let to = formatDate(new Date());
        if (value === "today") {
            from.setDate(from.getDate());
            from = formatDate(from);
        }
        else if (value === "yesterday") {
            from.setDate(from.getDate() - 1);
            to = formatDate(from);
            from = formatDate(from);
        }
        else if (value === "month") {
            date.setDate(1);
            from = formatDate(date);
        }
        else {
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
    const Get_AstroWalletSummary = async (AstroLoginId) => {
        try {
            const val = { AstroID: AstroLoginId };
            const res = await postWithToken("AstroWalletTransaction/AstroWalletSummary", val);
            if (res && res.length > 0) {
                setAstroWalletSummary(res[0]);
            }
        }
        catch (error) {
            console.error("Error fetching wallet summary:", error);
        }
    };
    const cardData = [
        {
            label: "Total Earnings (This Month)",
            amount: `₹${astroWalletSummary?.totalEarningMonth || 0}`,
            badge: `${astroWalletSummary?.totalEarningConsultent || 0}% increase from last month`,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 4a.75.75 0 01.75.75v7.69l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V4.75A.75.75 0 0110 4z" clipRule="evenodd"/>
        </svg>),
            iconBg: "bg-green-100",
            badgeColor: "text-green-700 bg-green-100"
        },
        {
            label: "Total Earnings (All Time)",
            amount: `₹${astroWalletSummary?.totalEarning || 0}`,
            badge: `From ${astroWalletSummary?.totalEarningOneMonthAgo || 0} consultations`,
            icon: <BsBank className="w-4 h-4 text-blue-500"/>,
            iconBg: "bg-blue-100",
            badgeColor: "text-green-700 bg-green-100"
        },
        {
            label: "Pending Payments",
            amount: `₹${astroWalletSummary?.pendingAmount || 0}`,
            badge: "Expected in 2–3 days",
            icon: <MdOutlinePendingActions className="w-4 h-4 text-yellow-500"/>,
            iconBg: "bg-yellow-100",
            badgeColor: "text-gray-600 bg-gray-100"
        }
    ];
    return (<div className="flex-1 lg:ml-0">
        <div className="main-container p-6 space-y-6 font-sans">
          {/* Header & Balance Section */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold flex items-center gap-2">
              <FaWallet className="text-orange-500"/> My Wallet
            </h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
              <FaFileExport /> Export Transactions
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cardData.map((card, index) => (<StatCard key={index} {...card}/>))}
          </div>

          {/* Wallet Transactions Section */}
          <div className="main-container p-6">
            <h5 className="text-center font-semibold bg-orange-500 p-3 rounded-full sm:w-96 mx-auto">
              WALLET TRANSACTIONS
            </h5>

            <div className="flex flex-wrap justify-between items-center mt-6">
              {companyData?.map((item, index) => (<div key={index} className="flex flex-wrap gap-20">
                  <span className="font-bold">PG Charge: ₹ {item?.PGCharge}</span>
                  <span className="font-bold">Sub Total: ₹ {item?.SubTotal}</span>
                  <span className="font-bold">TDS: ₹ {item?.TDS}</span>
                  <span className="font-bold text-green-600">Payable Amount: ₹ {item?.PayableAmount}</span>
                </div>))}
              <select className="border p-2 rounded-md bg-white" value={selectedOption} onChange={handleOptionChange}>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                {generateLastSixMonths().map((month) => (<option key={month.value} value={month.value}>
                    {month.label}
                  </option>))}
              </select>
            </div>

            <div className="relative overflow-x-auto mt-6">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-300 text-black">
                  <tr>
                    {["#", "Description", "Category", "Amount", "Datetime"]?.map((heading, index) => (<th key={index} className="px-6 py-3 font-semibold">
                          {heading}
                        </th>))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems && currentItems?.length > 0 ? (currentItems?.map((item, index) => (<tr key={item.orderId} className="border-b bg-gray-100 hover:bg-gray-200">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{item?.Description}</td>
                        <td className="px-6 py-4">{item?.Category}</td>
                        <td className={`px-6 py-4 ${item?.PayableAmount < 0 ? "text-red-600" : "text-green-600"}`}>₹ {item?.PayableAmount}</td>
                        <td className="px-6 py-4">{item?.TransactionDateTime ? format(new Date(item?.TransactionDateTime), "MMMM d, yyyy hh:mm") : ""}</td>
                      </tr>))) : (<tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No transactions available
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (<div className="flex mt-6 space-x-2" style={{ justifyContent: 'end' }}>
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (<button key={index + 1} className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`} onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>))}
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>)}
          </div>
        </div>
    </div>);
};
const StatCard = ({ label, amount, badge, icon, iconBg, badgeColor }) => {
    return (<div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
      {/* Icon + Label */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`p-2 rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>

      {/* Amount */}
      <div className="text-2xl font-semibold text-gray-900">{amount}</div>

      {/* Badge */}
      <div className={`text-xs px-2 py-1 rounded-full w-fit ${badgeColor}`}>
        {badge}
      </div>
    </div>);
};
export default Wallet;
