"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postWithToken } from '../utils/api';
import { FaGem } from 'react-icons/fa';
import { PiCertificateLight } from 'react-icons/pi';
import { format } from 'date-fns';
import { UserPanelPage, PanelCard, PanelTabs, PanelLoader, OrangeButton } from '../components/UserPanelPage';

const MyGemStone = () => {
    const router = useRouter();
     const UserLoginId = typeof window !== 'undefined' && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";;
    const [bookingGemStone, setBookingGemStone] = useState([]);
    const [activeTab, setActiveTab] = useState('My Orders');
    const [loading, setLoading] = useState(true);

    const Get_Data_Gemstone = useCallback(async () => {
        const val = { UserID: UserLoginId, IsActive: '1' };
        try {
            const res = await postWithToken('GemstoneOrder/GetData_GemstoneOrder', val);
            if (res) setBookingGemStone(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [UserLoginId]);

    useEffect(() => {
        if (UserLoginId) {
            queueMicrotask(() => { Get_Data_Gemstone(); });
        }
    }, [UserLoginId, Get_Data_Gemstone]);

    const tabs = ['My Orders', 'Certificates'];

    return (
        <UserPanelPage title="My Gemstone" subtitle="View your gemstone purchases and authenticity certificates.">
            <PanelCard>
                <PanelTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
                {loading ? <PanelLoader /> : bookingGemStone.length > 0 ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bookingGemStone.map((order) => (
                            <div key={order.GemstoneOrderID} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <img src={order?.Image1 ? `https://${order.Image1.replace(/\\/g, "/")}` : "/gemstone-placeholder.jpg"} alt={order.GemstoneName} className="h-40 w-full object-cover" />
                                <div className="p-4">
                                    <h3 className="font-bold text-[#1A1A1A]">{order.GemstoneName}</h3>
                                    <p className="mt-1 text-sm font-bold text-[#FF5C00]">₹{order.Amt}</p>
                                    <p className="text-[11px] text-gray-500">Qty: {order.Qty} · {format(new Date(order.CreatedDtTm), "dd MMM yyyy")}</p>
                                    <div className="mt-3 flex gap-2">
                                        <OrangeButton outline className="flex-1" onClick={() => router.push(`/gemstone?Gemstone-to-astrologersGT=${order?.GemstoneId}`)}>Details</OrangeButton>
                                        <OrangeButton className="flex-1" onClick={() => router.push(`/gemstone?Gemstone-to-astrologersGT=${order?.GemstoneId}`)}>Buy Again</OrangeButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <FaGem className="mx-auto mb-3 text-4xl text-orange-200" />
                        <p className="font-semibold text-gray-800">No gemstones yet</p>
                        <OrangeButton className="mt-4" onClick={() => router.push("/gemstone")}>Browse Gemstones</OrangeButton>
                    </div>
                )}
            </PanelCard>
        </UserPanelPage>
    );
};

export default MyGemStone;
