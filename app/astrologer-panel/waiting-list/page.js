"use client";
import React, { useEffect, useState } from "react";
import { postWithToken } from "@/app/utils/api";

const WaitingList = () => {
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [loading, setLoading] = useState(true);
    const [WaitinglistData, setWaitinglistData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_Data_Waitinglist_History();
        }
    }, [GetAstroLoginId]);
    const Get_Data_Waitinglist_History = async () => {
        const val = {
            "AstroId": GetAstroLoginId,
            "UserId": ""
        };
        try {
            const res = await postWithToken("WaitingList/GetData_WaitingListUser", val);
            if (res) {
                setWaitinglistData(res);
            }
            setLoading(false);
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = WaitinglistData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(WaitinglistData?.length / itemsPerPage);
    return (<div className="main-container mx-auto mt-4 p-4">
          <div>
            <div className="main-container rounded-xl w-[400px] mx-auto" style={{ backgroundColor: '#ff6600' }}>
              <div className="text-center text-white rounded-xl p-3">
                <h3 className="text-xl font-semibold">Waiting List</h3>
              </div>
            </div>
          </div>

          {loading ? (<div className="flex justify-center mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-10 max-w-6xl">
              {WaitinglistData && WaitinglistData.length > 0 ? (WaitinglistData.map((item) => (<div key={item.WaitingListId} className="bg-white rounded-2xl shadow-md hover:shadow-lg sellerCard box-seller border border-gray-200 p-6 transition duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={item?.UserImage ? `https://${item.UserImage.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="User" className="w-16 h-16 rounded-full object-cover border border-gray-300"/>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.UserName}
                          <span className="ml-2 text-sm text-gray-500">({item?.UserID})</span>
                        </h3>
                        <p className="text-sm text-gray-500">ID: {item.WaitingListId}</p>
                      </div>
                    </div>

                    <div className="text-sm space-y-1 text-gray-700">
                      <p><span className="font-medium">Date:</span> {item.CreatedDate}</p>
                      <p><span className="font-medium">Type:</span> {item.Type}</p>
                      <p style={{ color: 'green' }}>
                        <span className="font-medium">Status:</span> {item.Status}
                      </p>
                    </div>
                  </div>))) : (<div className="col-span-full text-center text-gray-500 text-lg font-medium py-20">
                  No data available
                </div>)}
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
        </div>);
};
export default WaitingList;
