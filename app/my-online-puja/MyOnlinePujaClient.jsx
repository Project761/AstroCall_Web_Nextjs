"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { FaPray, FaSearch } from "react-icons/fa";
import { postWithToken } from "../utils/api";
import {
  UserPanelPage,
  PanelCard,
  PanelTabs,
  PanelLoader,
  OrangeButton,
  StatusBadge,
  PanelEmpty,
} from "../components/UserPanelPage";

function pujaImageUrl(raw) {
  if (!raw) return "/default-image.jpg";
  const cleaned = String(raw).replace(/\\/g, "/");
  return cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
}

function normalizePuja(item) {
  const statusRaw = String(item?.PujaStatus ?? item?.OrderStatus ?? item?.Status ?? "").toLowerCase();
  let status = "Pending";
  if (statusRaw.includes("complete") || statusRaw === "1") status = "Completed";
  else if (statusRaw.includes("cancel")) status = "Cancelled";
  else if (statusRaw.includes("upcoming") || statusRaw === "0") status = "Upcoming";

  const dateRaw = item?.PujaDate || item?.BookingDate || item?.CreatedDtTm;
  const dateLabel = dateRaw ? format(new Date(dateRaw), "dd MMM yyyy") : "—";

  return {
    id: item?.ID || item?.BookingID || item?.PujaID || item?.OrderNumber,
    name: item?.PujaName || item?.PujaTitle || "Online Puja",
    image: pujaImageUrl(item?.PujaImage || item?.ImageURL),
    date: dateLabel,
    time: item?.PujaTime || item?.TimeSlot || item?.SlotTime || "—",
    duration: item?.Duration || item?.PujaDuration || "—",
    cost: item?.Amt ?? item?.TotalAmt ?? item?.Amount ?? 0,
    status,
    slug: item?.PujaName?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") || "",
  };
}

export default function MyOnlinePuja() {
  const router = useRouter();
  const UserLoginId =
    typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

  const userData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const loginData = localStorage.getItem("LoginTokenData");
      return loginData ? JSON.parse(loginData) : null;
    } catch {
      return null;
    }
  }, []);

  const [pujas, setPujas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pujaTab, setPujaTab] = useState("Upcoming");
  const pujaTabs = ["Upcoming", "Completed", "Cancelled"];

  const fetchPujas = useCallback(async () => {
    setLoading(true);
    try {
      const val = {
        CreatedFrom: "",
        CreatedTo: "",
        OrderStatus: "",
        UserID: UserLoginId,
        PujaStatus: "",
        AstroID: "",
        IsActive: "1",
      };
      const response = await postWithToken("BookingPuja/GetData_BookingPuja", val);
      const list = Array.isArray(response) ? response.map(normalizePuja) : [];
      setPujas(list);
    } catch (error) {
      console.error("Error fetching pujas:", error);
      setPujas([]);
    } finally {
      setLoading(false);
    }
  }, [UserLoginId]);

  useEffect(() => {
    if (!userData) {
      router.push("/");
      return;
    }
    queueMicrotask(() => { fetchPujas(); });
  }, [userData, router, fetchPujas]);

  const tabFiltered = useMemo(() => {
    return pujas.filter((puja) => {
      if (pujaTab === "Upcoming") return puja.status === "Upcoming" || puja.status === "Pending";
      if (pujaTab === "Completed") return puja.status === "Completed";
      return puja.status === "Cancelled";
    });
  }, [pujas, pujaTab]);

  const filteredPujas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return tabFiltered;
    return tabFiltered.filter((puja) => puja.name.toLowerCase().includes(q));
  }, [tabFiltered, searchTerm]);

  if (!userData || loading) return <PanelLoader />;

  return (
    <UserPanelPage
      title="My Online Puja"
      subtitle="View and manage your booked online pujas"
      action={
        <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#FF5C00]">
          {pujas.length}
        </span>
      }
    >
      <PanelCard>
        <PanelTabs tabs={pujaTabs} active={pujaTab} onChange={setPujaTab} underline />
        <div className="relative mt-4">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search pujas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </PanelCard>

      {filteredPujas.length === 0 ? (
        <PanelEmpty
          icon={FaPray}
          title="No pujas booked yet"
          description={`No ${pujaTab.toLowerCase()} pujas found.`}
          action={
            <OrangeButton className="mt-4" onClick={() => router.push("/online-puja")}>
              Browse Pujas
            </OrangeButton>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredPujas.map((puja) => (
            <PanelCard key={puja.id} className="!p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                  <Image src={puja.image} alt={puja.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading truncate font-bold text-[#1A1A1A]">{puja.name}</h3>
                    <StatusBadge status={puja.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {puja.date} · {puja.time} · {puja.duration}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#FF5C00]">₹{puja.cost}</p>
                </div>
                <OrangeButton
                  outline
                  onClick={() => router.push(puja.slug ? `/online-puja/${puja.slug}` : "/online-puja")}
                >
                  View Details
                </OrangeButton>
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </UserPanelPage>
  );
}
