"use client";
import React, { useEffect, useState } from "react";
import { postWithToken } from "@/app/utils/api";
import { format } from "date-fns";
const PendingList = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [PendingList, setPendingList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Type");
    const [TotalChatsdata, setTotalChatsdata] = useState();
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_Data_PendingList();
        }
    }, [GetAstroLoginId]);
    const Get_Data_PendingList = async (from = "", to = "") => {
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
            if (res)
                setPendingList(res);
        }
        catch (error) {
            console.log("Error fetching pending list:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const handleFilterChange = () => {
        let from = searchDate ? `${searchDate} 00:00:00` : "";
        let to = endDate ? `${endDate} 23:59:59` : "";
        Get_Data_PendingList(from, to);
        setCurrentPage(1);
    };
    useEffect(() => {
        if (GetAstroLoginId) {
            handleFilterChange();
        }
    }, [searchDate, endDate, statusFilter]);
    const filteredData = PendingList?.filter((item) => item?.UserName?.toLowerCase().includes(searchName.toLowerCase()));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const SummaryCard = ({ label, value, subtext }) => (<div className="bg-white rounded-xl shadow p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-green-600 mt-1">{subtext}</div>
    </div>);
    return (<div className="min-h-screen main-container p-6 space-y-6 font-sans">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Pending List</h1>
          <div className="w-32 h-1 bg-orange-500 rounded-full mx-auto my-2"></div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              <input type="date" className="border rounded px-3 py-2 text-sm" value={searchDate} onChange={(e) => {
            setSearchDate(e.target.value);
            setCurrentPage(1);
        }}/>
              <input type="date" className="border rounded px-3 py-2 text-sm" value={endDate} onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
        }}/>

              <input type="text" placeholder="Search by name..." className="border rounded px-3 py-2 text-sm" onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
        }}/>

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

          {loading ? (<div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>) : (<>
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {currentItems?.length > 0 ? (currentItems?.map((item, idx) => (<div key={item?.ID ?? item?.OrderID ?? `${item?.UserID ?? "user"}-${idx}`} className="p-6 rounded-xl border-t-4 sellerCard box-seller border-orange-400 shadow-md hover:shadow-xl transform hover:scale-105 transition-all bg-white">
                      <div className="flex items-center space-x-4">
                        <img src={item.UserImage ? `https://${item.UserImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="Profile" className="w-16 h-16 rounded-full border-2 border-orange-400 hover:border-orange-600 transition"/>

                        <div>
                          <h3 className="text-lg font-semibold">
                            <strong>{item.UserName}</strong>
                            <span className="ml-2 text-sm text-gray-500">(<strong>{item.UserID}</strong>)</span>
                          </h3>
                          <p className="text-sm text-gray-500">Order ID: <strong>{item.ID}</strong></p>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        {format(new Date(item.Date), "yyyy-MM-dd HH:mm")}
                      </div>
                      <div className="mt-2 text-sm text-gray-700">State: {item.State}</div>
                      <div className={`text-sm mt-1 font-semibold text-red-500`}>
                        {item.Status}
                      </div>
                    </div>))) : (<div className="text-center col-span-full py-20 text-gray-400 font-semibold">
                    No Data Available...
                  </div>)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (<div className="flex justify-center mt-10 space-x-2 overflow-x-auto">
                  <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                    return (page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2));
                })
                    .map((page, index, arr) => {
                    const prev = arr[index - 1];
                    const showEllipsis = prev && page - prev > 1;
                    return (<React.Fragment key={page}>
                          {showEllipsis && (<span className="px-2 py-2 text-gray-400 select-none">...</span>)}
                          <button className={`px-4 py-2 rounded-md ${currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'}`} onClick={() => setCurrentPage(page)}>
                            {page}
                          </button>
                        </React.Fragment>);
                })}

                  <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>)}
            </>)}
        </div>);
};
export default PendingList;
