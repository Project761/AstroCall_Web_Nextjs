"use client";
import React, { useState, useEffect } from "react";
import { postWithToken } from "@/app/utils/api";
import { GiLotus } from "react-icons/gi";
import { format } from "date-fns";
const SuggestedPuja = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [SuggestionsData, setSuggestionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDate, setSearchDate] = useState('');
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [searchName, setSearchName] = useState('');
    const [statusFilter, setStatusFilter] = useState("All Status");
    useEffect(() => {
        if (GetAstroLoginId) {
            fetchSuggestions();
        }
    }, [GetAstroLoginId]);
    const fetchSuggestions = async () => {
        try {
            const res = await postWithToken("Suggestions/GetData_Suggestions", {
                AstrologerId: GetAstroLoginId,
                UseriD: "0",
                ProductType: "Puja",
                SuggestId: '0'
            });
            if (res) {
                setSuggestionsData(res);
            }
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const filteredData = SuggestionsData?.filter(item => {
        const matchesName = item?.UserName?.toLowerCase().includes(searchName.toLowerCase());
        const matchesDate = (!searchDate || item.CreatedAt >= searchDate) &&
            (!endDate || item.CreatedAt <= endDate);
        const matchesStatus = statusFilter === "All Status"
            ? true
            : item?.Status?.toLowerCase() == statusFilter.toLowerCase();
        return matchesName && matchesDate && matchesStatus;
    });
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    return (<div className="main-container w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-orange-600 flex items-center gap-2">
              <GiLotus className="text-5xl text-orange-600"/>
              Suggested Online Puja
            </div>
          </div>

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

              <select className="border rounded px-3 py-2 text-sm" value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
        }}>
                <option>All Status</option>
                <option>completed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {loading ? (<div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>) : (<>
              {/* Recently Recommended */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {currentItems?.map((item, idx) => {
                const date = item?.CreatedAt ? format(new Date(item?.CreatedAt), "dd MMM yy, hh:mm") : "N/A";
                return (<div key={idx} className="bg-white shadow rounded-xl p-4 border-b-4 border-orange-200 relative">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={`https://${item?.ProductImage}`} alt={item.ProductName} className="w-14 h-14 rounded-full object-cover border"/>
                        <div>
                          <h4 className="text-md font-semibold">{item.ProductName}</h4>
                          <p className="text-xs text-gray-500">{item.Type}</p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 mb-2">
                        <p className="text-lg font-semibold">
                          <strong>{item.UserName}</strong>
                          <span className="ml-2 text-sm text-gray-500">(<strong>{item.UseriD}</strong>)</span>
                        </p>
                        <p><strong>Date:</strong> {date}</p>
                        <p><strong>Amount:</strong> ₹{item.TotalAmt}</p>
                        <span className={`${item?.Status === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs px-2 py-0.5 rounded-full font-medium`}>
                          {item?.Status}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <strong>Description:</strong> {item.SuggestedText || "N/A"}
                      </div>
                    </div>);
            })}
              </div>

              {currentItems?.length === 0 && (<div className="text-center py-20 text-gray-500 text-lg font-medium">
                  No data available
                </div>)}

              {/* Pagination */}
              {totalPages > 1 && (<div className="flex justify-center mt-10 space-x-2">
                  <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, index) => (<button key={index + 1} className={`px-4 py-2 rounded-md ${currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"}`} onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>))}
                  <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>)}
            </>)}
        </div>);
};
export default SuggestedPuja;
