"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaPhone } from "react-icons/fa";
import { postWithToken } from "../utils/api";
import { UserPanelPage, PanelCard, PanelLoader, OrangeButton } from "../components/UserPanelPage";


export default function MyCalls() {

   const UserLoginId = typeof window !== 'undefined' && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";;

  const router = useRouter();
  const userData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const loginData = localStorage.getItem("LoginTokenData");
      return loginData ? JSON.parse(loginData) : null;
    } catch {
      return null;
    }
  }, []);
  const [calls, setCalls] = useState([]);

  const fetchCalls = useCallback(async () => {
    try {
      const response = await postWithToken("Astrologer/CallHistory", {
        UserId: UserLoginId,
        Type: "call",
        IsActive: "1",
      });
      if (response) setCalls(response);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [UserLoginId]);

  useEffect(() => {
    if (!userData) {
      router.push("/");
      return;
    }
    queueMicrotask(() => { fetchCalls(); });
  }, [userData, router, fetchCalls]);

  if (!userData) return <PanelLoader />;

  return (
    <UserPanelPage title="My Calls" subtitle="Review your call history with astrologers"
      action={<span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#FF5C00]">{calls.length} calls</span>}>
      {calls?.length === 0 ? (
        <PanelCard className="py-16 text-center">
          <FaPhone className="mx-auto mb-3 text-4xl text-gray-300" />
          <p className="font-semibold text-gray-800">No call history yet</p>
          <OrangeButton className="mt-4" onClick={() => router.push("/talk-to-astrologers")}>Start Calling</OrangeButton>
        </PanelCard>
      ) : (
        <div className="space-y-3">
          {calls.map((call) => (
            <PanelCard key={call.ID} className="!p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={call.Astro_ProfilePic ? `https://${call.Astro_ProfilePic.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-orange-100" />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#1A1A1A]">{call.AstroName}</p>
                    <p className="text-xs text-gray-500">{call.Duration || "0"} min · ₹{call.Amt || 0}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">{call.Date ? new Date(call.Date).toLocaleString() : ""}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${call.Status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{call.Status}</span>
                </div>
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </UserPanelPage>
  );
}
