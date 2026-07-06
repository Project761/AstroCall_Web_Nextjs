"use client";
import React, { useEffect, useState } from 'react';
import { postWithToken } from '../utils/api';
import { FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import { UserPanelPage, PanelCard, OrangeButton, StatusBadge } from '../components/UserPanelPage';

const WaitList = () => {
  const UserLoginId = typeof window !== 'undefined' && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";
  const [WaitingListData, setWaitingListData] = useState([]);

  useEffect(() => {
    if (!UserLoginId) return;

    let cancelled = false;

    postWithToken('WaitingList/GetData_WaitingListUser', { AstroId: "", UserId: UserLoginId })
      .then((res) => {
        if (!cancelled && res) setWaitingListData(res);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [UserLoginId]);

  return (
    <UserPanelPage title="Wait List" subtitle="View your position and session details.">
      {WaitingListData.length > 0 ? (
        <div className="space-y-3">
          {WaitingListData.map((item, index) => (
            <PanelCard key={index} className="!p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src={item?.AstroImageUrl ? `https://${item.AstroImageUrl.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="" className="h-14 w-14 rounded-full object-cover border-2 border-orange-100" />
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{item.AstroName}</p>
                    <p className="text-xs text-gray-500">{item.Type} · ₹{item.AstroRate}/min</p>
                    <p className="mt-1 text-xs text-[#FF5C00] font-semibold">You are #{index + 1} in wait list</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    <FaCalendarAlt className="mr-1 inline text-[#FF5C00]" />{item.CreatedDate}
                    <span className="ml-3"><FaRegClock className="mr-1 inline text-[#FF5C00]" />{item.Type}</span>
                  </div>
                  <StatusBadge status={item.Status} />
                  <OrangeButton outline>View Status</OrangeButton>
                </div>
              </div>
            </PanelCard>
          ))}
        </div>
      ) : (
        <PanelCard className="py-12 text-center text-sm text-gray-500">No waitlist data found.</PanelCard>
      )}
    </UserPanelPage>
  );
};

export default WaitList;
