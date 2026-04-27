"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postWithToken } from "@/app/utils/api";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
const AssignPuja = () => {
    const router = useRouter();
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId") ? localStorage.getItem("AstroLoginId") : "";
    useEffect(() => {
        if (GetAstroLoginId) {
            Get_SingleData_User();
        }
    }, [GetAstroLoginId]);
    const Get_SingleData_User = async () => {
        try {
            const val = {
                IsActiveCreatedTo: '1',
                CreatedFrom: '',
                PujaStatus: '0',
                AstroID: GetAstroLoginId,
                UserID: '0',
            };
            const res = await postWithToken("BookingPuja/GetData_BookingPuja", val);
            console.log(res, 'Assign Puja Data');
        }
        catch (error) {
            console.log(error);
        }
    };
    return (<div className="flex-1 lg:ml-0">
        <div className="main-container p-6 w-full">
          <div className="mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MdOutlineAssignmentTurnedIn className="w-10 h-10 text-orange-500 fill-orange-500"/>
                <h1 className="text-2xl font-bold text-gray-900">Assign Online Puja</h1>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center py-12">
                <div className="mb-6">
                  <MdOutlineAssignmentTurnedIn className="w-16 h-16 text-orange-500 mx-auto mb-4"/>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Puja Assignment Dashboard
                </h2>
                <p className="text-gray-600 mb-6">
                  Manage and assign online pujas to users
                </p>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-orange-800">
                    <strong>Feature Status:</strong> Puja assignment functionality is being prepared. 
                    Data fetching is active in the background.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <h3 className="font-semibold text-gray-800 mb-2">Pending Assignments</h3>
                <p className="text-2xl font-bold text-orange-600">0</p>
                <p className="text-sm text-gray-600 mt-1">Puja assignments awaiting action</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-800 mb-2">Completed Today</h3>
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600 mt-1">Successfully assigned pujas</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <h3 className="font-semibold text-gray-800 mb-2">Total Active</h3>
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600 mt-1">Active puja assignments</p>
              </div>
            </div>
          </div>
        </div>
    </div>);
};
export default AssignPuja;
