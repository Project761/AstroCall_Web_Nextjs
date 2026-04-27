"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postWithToken } from "@/app/utils/api";
import { FaUsers, FaUserPlus } from "react-icons/fa";
const Followers = () => {
    const router = useRouter();
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    const [GetFollowstatus, setGetFollowstatus] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFollowers, setTotalFollowers] = useState("");
    const [newFollowers, setNewFollowers] = useState("");
    const itemsPerPage = 20;
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_Data_AstroFollow(GetAstroLoginId);
            Get_TotalFollowers(GetAstroLoginId);
        }
    }, [GetAstroLoginId]);
    const Get_Data_AstroFollow = async () => {
        const val = {
            UserID: '',
            astroID: GetAstroLoginId,
        };
        try {
            const res = await postWithToken("AstroFollow/GetData_AstroFollow", val);
            if (res) {
                setGetFollowstatus(res.filter((item) => item?.AstroflowersID));
            }
        }
        catch (error) {
            console.log("Error fetching follow data:", error);
        }
    };
    const Get_TotalFollowers = async () => {
        const val = {
            astroID: GetAstroLoginId
        };
        try {
            const res = await postWithToken("AstroFollow/GetData_Followers", val);
            if (res) {
                setTotalFollowers(res[0]?.TotalFollowers);
                setNewFollowers(res[0]?.NewFollowers);
            }
        }
        catch (error) {
            console.error("Error fetching or parsing follower data:", error);
        }
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = GetFollowstatus?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(GetFollowstatus?.length / itemsPerPage);
    const followerStats = [
        {
            label: "Total Followers",
            value: totalFollowers,
            change: "5% increase this month",
            color: "text-blue-600",
            icon: <FaUsers className="text-blue-500 w-5 h-5"/>
        },
        {
            label: "New Followers",
            value: newFollowers,
            change: "This month",
            color: "text-orange-600",
            icon: <FaUserPlus className="text-orange-500 w-5 h-5"/>
        },
    ];
    const displayFollowers = currentItems?.slice(0, 4);
    return (<div className="flex-1 lg:ml-0">
        <div className="main-container p-6 mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span><FaUsers className="text-orange-500"/></span> My Followers
            </h2>
            <button className="px-4 py-2 border rounded shadow-sm text-sm font-medium hover:bg-gray-100 flex items-center gap-2">
              Export List
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 w-full">
            {followerStats.map((stat, index) => (<div key={index} className="bg-white p-4 rounded-xl shadow flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-green-500 mt-1">{stat.change}</span>
              </div>))}
          </div>

          {/* Followers Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayFollowers?.length > 0 ? (displayFollowers.map((data, index) => (<div key={index} className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center">
                  {/* Profile Circle */}
                  <div className="w-14 h-14 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img src={data?.ProfilePic
                ? `https://${data?.ProfilePic?.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/60"} alt="Profile" className="w-full h-full object-cover"/>
                  </div>

                  {/* Name + Following Info */}
                  <h4 className="font-semibold mt-3">{data?.NickName}</h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Date of Birth: {data?.DOB || "2010-2-4"}
                  </p>
                </div>))) : (<div className="flex justify-center items-center h-full col-span-full">
                <span className="text-gray-500">No Data Available</span>
              </div>)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (<div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {i + 1}
                </button>))}
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
                Next
              </button>
            </div>)}
        </div>
    </div>);
};
export default Followers;
