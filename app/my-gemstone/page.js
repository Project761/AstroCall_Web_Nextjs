"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postWithToken } from '../utils/api';
import { FaGem } from 'react-icons/fa';
import { PiCertificateLight } from 'react-icons/pi';
import { format } from 'date-fns';

const MyGemStone = () => {
    const router = useRouter();
    const UserLoginId = localStorage.getItem("UserLoginId") || "";
    const [bookingGemStone, setBookingGemStone] = useState([]);
    const [activeTab, setActiveTab] = useState('My Orders');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (UserLoginId) {
            Get_Data_Gemstone();
        }
    }, [UserLoginId]);

    const Get_Data_Gemstone = async () => {
        const val = { UserID: UserLoginId, IsActive: '1' };
        try {
            const res = await postWithToken('GemstoneOrder/GetData_GemstoneOrder', val);
            if (res) setBookingGemStone(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = ['My Orders', 'Certificates'];

    return (
        <div className="min-h-screen p-4">
            <div className=" main-container mx-auto">
                <h1 className="text-2xl  text-orange-500 font-semibold mb-1">My Gemstones</h1>
                <p className="text-gray-600 text-sm mb-6">View your gemstone purchases, authenticity certificates, and recommended gemstones.</p>
                
                {/* Tabs */}
                <div className="flex border-b mb-6 space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-sm font-medium ${activeTab === tab
                                ? 'text-orange-500 border-b-2 border-orange-500'
                                : 'text-gray-500 hover:text-orange-500'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        {bookingGemStone.length > 0 ? (
                            <div className="space-y-6">
                                {bookingGemStone?.map((order) => (
                                    <div
                                        key={order.GemstoneOrderID}
                                        className="bg-white border border-orange-100 shadow-sm rounded-xl p-5"
                                    >
                                        {/* Header */}
                                        <div className="flex justify-between text-sm text-gray-500 mb-3">
                                            <span>Order #{order.GemstoneOrderID}</span>
                                            <div className="flex items-center space-x-2">
                                                <span> {format(new Date(order.CreatedDtTm), "yyyy-MM-dd HH:mm")}</span>
                                                <span
                                                    className={`${order?.OrderStatus === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        } text-xs px-2 py-0.5 rounded-full font-medium`}
                                                >
                                                    {order?.OrderStatus}
                                                </span>

                                            </div>
                                        </div>

                                        {/* Product */}
                                        <div className="flex gap-4">
                                            <img
                                                src={order?.Image1 ? `https://${order?.Image1?.replace(/\\/g, "/")}` : '/gemstone-placeholder.jpg'}
                                                alt={order.GemstoneName}
                                                className="w-20 h-20 object-cover rounded border"
                                            />
                                            <div>
                                                <h3 className="text-gray-800 font-semibold text-sm">{order.GemstoneName}</h3>
                                                <p className="text-orange-600 font-semibold text-sm mt-1">₹{order.Amt}</p>
                                                <p className="text-xs text-gray-500">Quantity: {order.Qty}</p>
                                            </div>
                                        </div>

                                        {/* Certificate */}
                                        <div className="mt-4 bg-orange-50 border border-dashed border-orange-200 p-4 rounded-md flex items-start gap-3">
                                            <FaGem className="text-orange-400 text-lg mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-orange-900">Authenticity Certificate</h4>
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    Your gemstone comes with an authenticity certificate. You can download it from the Certificates tab.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-4 flex justify-between items-center">
                                            <p className="text-sm font-medium text-gray-700">
                                                Total: <span className="text-black">₹{order.Amt || '2,100'}</span>
                                            </p>
                                            <div className="space-x-2">
                                                <button 
                                                    onClick={() => router.push(`/gemstone?Gemstone-to-astrologersGT=${order?.GemstoneId}`)}
                                                    className="px-4 py-1.5 border text-sm rounded text-orange-500 border-orange-300 hover:bg-orange-100"
                                                >
                                                    Details
                                                </button>

                                                <button 
                                                    onClick={() => router.push(`/gemstone?Gemstone-to-astrologersGT=${order?.GemstoneId}`)}
                                                    className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                                                >
                                                    Buy Again
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 text-gray-500">
                                <FaGem className="mx-auto text-5xl mb-4 text-orange-200" />
                                <h2 className="text-lg font-semibold text-gray-700">No Orders Found</h2>
                                <p className="text-sm">You haven't purchased any gemstones yet.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyGemStone;
