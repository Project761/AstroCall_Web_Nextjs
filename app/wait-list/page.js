"use client";
import React, { useEffect, useState } from 'react';
import { postWithToken } from '../utils/api';
import { FaCalendarAlt, FaMoneyBill, FaPhoneAlt, FaRegClock } from 'react-icons/fa';
const WaitList = () => {
  const UserLoginId = localStorage.getItem("UserLoginId") || '';
  const [WaitingListData, setWaitingListData] = useState([]);

  useEffect(() => {
    if (UserLoginId) {
      Get_WaitingList_History();
    }
  }, [UserLoginId]);

  const Get_WaitingList_History = async () => {
    const val = { "AstroId": "", "UserId": UserLoginId };
    try {
      const res = await postWithToken('WaitingList/GetData_WaitingListUser', val);
      if (res) setWaitingListData(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className=" main-container mx-auto">
        <h1 className="text-2xl  text-orange-500 font-semibold mb-1">Waiting List</h1>
        <p className="text-gray-600 text-sm mb-6">View your position and session details.</p>

        {WaitingListData.length > 0 ? (
          <div className="space-y-4 ">
            {WaitingListData.map((item, index) => (
              <div key={index} className="w-full bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                  {/* Profile Info */}
                  <div className="flex items-center gap-4 w-full sm:w-1/3">
                    <img
                      src={item?.AstroImageUrl ? `https://${item?.AstroImageUrl.replace(/\\/g, "/")}` : "/images/profile pic.webp"}
                      alt="Astrologer"
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.AstroName} <span className="text-sm text-gray-500">({item?.AstroID})</span></h2>
                      <p className="text-xs text-gray-400">Waitlist ID: {item.WaitingListId}</p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="w-full sm:w-2/3 grid sm:grid-cols-4 grid-cols-2 gap-3 text-sm text-gray-700">
                    <div><FaCalendarAlt className="inline text-orange-500 mr-1" /> <span className="font-medium">Date:</span> {item.CreatedDate}</div>
                    <div><FaRegClock className="inline text-orange-500 mr-1" /> <span className="font-medium">Type:</span> {item.Type}</div>
                    <div><FaMoneyBill className="inline text-orange-500 mr-1" /> <span className="font-medium">Rate:</span> ₹{item.AstroRate}/min</div>
                    <div className={`${item.Status === 'Pending' ? 'text-yellow-600' : 'text-green-600'} font-semibold`}>
                      Status: {item.Status}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-lg">No waitlist data found.</div>
        )}
      </div>
    </div>
  );
};

export default WaitList;
