"use client";

import React, { useCallback, useEffect } from "react";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { postWithToken } from "@/app/utils/api";
import { PanelPageHeader, PanelCard, StatCard } from "@/app/components/AstrologerPanelUi";

export default function AssignPuja() {
  const GetAstroLoginId =
    typeof window !== "undefined" && localStorage.getItem("AstroLoginId")
      ? localStorage.getItem("AstroLoginId")
      : "";

  const Get_SingleData_User = useCallback(async () => {
    try {
      const val = {
        IsActiveCreatedTo: "1",
        CreatedFrom: "",
        PujaStatus: "0",
        AstroID: GetAstroLoginId,
        UserID: "0",
      };
      await postWithToken("BookingPuja/GetData_BookingPuja", val);
    } catch (error) {
      console.log(error);
    }
  }, [GetAstroLoginId]);

  useEffect(() => {
    if (GetAstroLoginId) Get_SingleData_User();
  }, [GetAstroLoginId, Get_SingleData_User]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="Assign Online Puja"
        breadcrumbs={["Dashboard", "Assign Puja"]}
        description="Manage and assign online pujas to users."
      />

      <PanelCard>
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <MdOutlineAssignmentTurnedIn className="text-3xl text-[#FF5C00]" />
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A]">Puja Assignment Dashboard</h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Manage and assign online pujas to users. Data fetching runs in the background.
          </p>
          <div className="mt-5 rounded-xl border border-orange-100 bg-[#FFF0E6] px-4 py-3 text-sm text-orange-800">
            <strong>Feature Status:</strong> Puja assignment functionality is being prepared.
          </div>
        </div>
      </PanelCard>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending Assignments" value="0" iconBg="bg-orange-50" sub="Awaiting action" />
        <StatCard label="Completed Today" value="0" iconBg="bg-green-50" sub="Successfully assigned" />
        <StatCard label="Total Active" value="0" iconBg="bg-orange-50" sub="Active assignments" />
      </div>
    </div>
  );
}
