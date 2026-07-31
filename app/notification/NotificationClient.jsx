"use client"

import React, { useEffect, useMemo, useState } from "react";
import { postWithToken } from "../utils/api";
import {
    Bell,
    BellOff,
    MessageSquare,
    Calendar,
    Tag,
    Award,
    Wallet,
    User,
    Settings,
    Gift,
} from "lucide-react";
import PageBanner from "../components/PageBanner";
import { FaCommentDots, FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";



const getNotificationMeta = (title = "") => {
    const t = title.toLowerCase();

    if (t.includes("chat") || t.includes("consult")) {
        return {
            icon: MessageSquare,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-500",
            category: "Consultations",
        };
    }
    if (t.includes("horoscope") || t.includes("kundli") || t.includes("report")) {
        return {
            icon: t.includes("horoscope") ? Calendar : Award,
            iconBg: t.includes("horoscope") ? "bg-green-100" : "bg-blue-100",
            iconColor: t.includes("horoscope") ? "text-green-500" : "text-blue-500",
            category: t.includes("horoscope") ? "Account Updates" : "Offers & Deals",
        };
    }
    if (t.includes("offer") || t.includes("discount") || t.includes("off")) {
        return {
            icon: Tag,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
            category: "Offers & Deals",
        };
    }
    if (t.includes("coin") || t.includes("wallet")) {
        return {
            icon: Wallet,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-500",
            category: "Account Updates",
        };
    }
    if (t.includes("profile")) {
        return {
            icon: User,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-500",
            category: "Account Updates",
        };
    }
    if (t.includes("maintenance") || t.includes("system") || t.includes("update")) {
        return {
            icon: Settings,
            iconBg: "bg-teal-100",
            iconColor: "text-teal-500",
            category: "System Updates",
        };
    }
    if (t.includes("welcome")) {
        return {
            icon: Gift,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-500",
            category: "System Updates",
        };
    }
    return {
        icon: Bell,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-500",
        category: "System Updates",
    };
};

// Friendly relative/absolute date, similar to the reference design
// ("2 min ago", "3 hours ago", "Yesterday, 10:30 AM", "23 May 2024, 08:00 PM").
const formatNotificationDate = (dateObj) => {
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);


    const isSameDay = now.toDateString() === dateObj.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === dateObj.toDateString();

    const time = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (isSameDay) {
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }
    if (isYesterday) return `Yesterday, ${time}`;

    const dateStr = dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    return `${dateStr}, ${time}`;
};

const CATEGORY_LIST = [
    { key: "All", label: "All Notifications" },
    { key: "Consultations", label: "Consultations" },
    { key: "Offers & Deals", label: "Offers & Deals" },
    { key: "Account Updates", label: "Account Updates" },
    { key: "System Updates", label: "System Updates" },
];

const Page = () => {
    const UserLoginId =
        typeof window !== "undefined" && localStorage.getItem("UserLoginId")
            ? localStorage.getItem("UserLoginId")
            : "";

    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [notifications, setNotifications] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [notifPermission, setNotifPermission] = useState(
        typeof window !== "undefined" && "Notification" in window
            ? Notification.permission
            : "default"
    );

    useEffect(() => {
        if (UserLoginId) {
            Get_Data_Notifications(UserLoginId);
        }
    }, [UserLoginId]);

    const Get_Data_Notifications = async (id) => {
        const val = {
            ReceiverId: id,
            ReceiverType: "User",
        };
        try {
            const res = await postWithToken("NotificationSegments/GetData_Notification", val);
            if (res) {
                console.log("Notifications fetched:", res);
                const mapped = res?.map((item) => {
                    const sentDate = new Date(item.SendingTime);
                    const meta = getNotificationMeta(item.Title);
                    return {
                        title: item.Title,
                        message: item.Message,
                        date: formatNotificationDate(sentDate),
                        rawDate: sentDate,
                        isNew: (new Date() - sentDate) / 36e5 < 24,
                        ...meta,
                    };
                });
                setNotifications(mapped);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEnableNotifications = async () => {
        if (typeof window === "undefined" || !("Notification" in window)) return;
        const permission = await Notification.requestPermission();
        setNotifPermission(permission);
    };

    const categoryCounts = useMemo(() => {
        const counts = {
            All: notifications.length,
            Consultations: 0,
            "Offers & Deals": 0,
            "Account Updates": 0,
            "System Updates": 0,
        };
        notifications.forEach((n) => {
            if (counts[n.category] !== undefined) counts[n.category] += 1;
        });
        return counts;
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        if (activeCategory === "All") return notifications;
        return notifications.filter((n) => n.category === activeCategory);
    }, [notifications, activeCategory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-[72px]">

            <PageBanner
                bannerSrc="/Banner/Notification.png"
                bannerAlt="AstroCall Notifications"
                currentPage="Notifications"
                backHref="/"
                backLabel="Home"
            >
                <div>
                    <h1 className="font-heading text-4xl font-bold leading-tight sm:text-4xl">
                        Stay Updated with{" "}
                        <span className="block sm:inline text-[#FF5C00]">
                            Your Notifications
                        </span>
                    </h1>

                    {/* <p className="mt-3 text-lg font-medium sm:text-xl text-gray-700">
                        Never miss important updates, offers, consultations, and account activities.
                    </p> */}

                    <p className="font-body mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                        View all your latest notifications in one place. Stay informed about
                        chat requests, call bookings, wallet updates, exclusive offers,
                        horoscope reminders, and important announcements from AstroCall.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/talk-to-astrologers")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C00] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
                    >
                        <FaPhone size={14} />
                        Talk to Astrologer
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/chat-to-astrologers")}
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#FF5C00] bg-white px-5 py-3 text-sm font-bold text-[#FF5C00] transition hover:bg-orange-50"
                    >
                        <FaCommentDots size={14} />
                        Start Chat
                    </button>
                </div>
            </PageBanner>



            <div className="main-container py-10 flex flex-col lg:flex-row gap-6 items-start">
                {/* Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
                    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
                        {CATEGORY_LIST.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => {
                                    setActiveCategory(cat.key);
                                    setCurrentPage(1);
                                }}
                                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${activeCategory === cat.key
                                    ? "bg-orange-50 text-orange-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <span>{cat.label}</span>
                                <span
                                    className={`text-sm rounded-full px-2.5 py-0.5 ${activeCategory === cat.key
                                        ? "bg-orange-200 text-orange-700"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {categoryCounts[cat.key] ?? 0}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 text-center">
                        <div className="text-4xl">🔔</div>
                        <h3 className="font-bold text-gray-900 mt-3">Never Miss an Update!</h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Enable push notifications to get instant alerts.
                        </p>
                        <button
                            onClick={handleEnableNotifications}
                            disabled={notifPermission === "granted"}
                            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 transition-colors"
                        >
                            {notifPermission === "granted" ? "Notifications Enabled" : "Enable Notifications"}
                        </button>
                    </div>
                </div>

                {/* Main list */}
                <div className="flex-1 bg-white rounded-2xl border border-orange-100 shadow-sm p-6 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-900">
                            {activeCategory === "All" ? "All Notifications" : activeCategory}
                        </h2>
                        <button className="text-orange-500 font-semibold text-sm hover:underline">
                            Mark all as read
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {currentItems?.map((note, idx) => {
                            const Icon = note.icon;
                            return (
                                <div key={idx} className="group flex gap-4 py-5">
                                    <div
                                        className={`h-14 w-14 flex-shrink-0 rounded-full ${note.iconBg} flex items-center justify-center`}
                                    >
                                        <Icon className={`h-6 w-6 ${note.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-3">
                                            <h3 className="font-bold text-gray-800">{note.title}</h3>
                                            {note.isNew && (
                                                <span className="text-xs bg-orange-100 text-orange-600 rounded-full px-3 py-1 flex-shrink-0">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-gray-500">{note.message}</p>
                                        <div className="mt-3 flex justify-between items-center">
                                            <span className="text-sm text-gray-400 flex items-center gap-1.5">
                                                {note.isNew && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 inline-block" />
                                                )}
                                                {note.date}
                                            </span>
                                            <button className="text-orange-500 font-semibold text-sm hover:underline">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {currentItems.length === 0 && (
                        <div className="p-14 text-center">
                            <BellOff className="mx-auto h-16 w-16 text-orange-300" />
                            <h2 className="mt-6 text-xl font-bold text-gray-800">No Notifications</h2>
                            <p className="text-gray-500 mt-2">You're all caught up.</p>
                        </div>
                    )}

                    {filteredNotifications.length > 0 && (
                        <p className="text-sm text-gray-400 mt-4">
                            Showing {Math.min(indexOfFirstItem + 1, filteredNotifications.length)} to{" "}
                            {Math.min(indexOfLastItem, filteredNotifications.length)} of{" "}
                            {filteredNotifications.length} notifications
                        </p>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center overflow-x-auto mt-8 space-x-2 items-center">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="text-gray-500 hover:text-black disabled:opacity-40 text-xl px-2"
                            >
                                &#8249;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    );
                                })
                                .map((page, index, arr) => {
                                    const prev = arr[index - 1];
                                    const showEllipsis = prev && page - prev > 1;

                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && (
                                                <span className="px-2 text-gray-400 select-none">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 h-9 rounded-md text-sm font-medium transition ${currentPage === page
                                                    ? "bg-orange-500 text-white"
                                                    : "text-gray-800 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                })}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="text-gray-500 hover:text-black disabled:opacity-40 text-xl px-2"
                            >
                                &#8250;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
