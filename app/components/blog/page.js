"use client";

import React, { useEffect, useState } from "react";
import { FaCalendar, FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { postWithToken } from "../../utils/api.js";
import { useRouter } from "next/navigation.js";
import { format } from "date-fns";

const BlogSection = () => {
    const [blogData, setBlogData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
    const [isPaused, setIsPaused] = useState(false);
    const router = useRouter();

    function getCardsToShow() {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 747) return 2;
            return 1;
        }
        return 3; // Default for SSR
    }

    useEffect(() => {
        const handleResize = () => setCardsToShow(getCardsToShow());
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        Get_Data_Blogs();
    }, []);

    const Get_Data_Blogs = async () => {
        try {
            const val = {
                IsActive: "1",
                IsHomePage: "true"
            };
            const res = await postWithToken("Blog/GetData_Blog", val);
            if (res) setBlogData(res || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Slider logic
    const getVisibleCards = () => {
        if (blogData.length === 0) return [];
        if (currentIndex + cardsToShow <= blogData.length) {
            return blogData.slice(currentIndex, currentIndex + cardsToShow);
        } else {
            return [
                ...blogData.slice(currentIndex),
                ...blogData.slice(0, (currentIndex + cardsToShow) % blogData.length),
            ];
        }
    };
    const visibleCards = getVisibleCards();

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? blogData.length - cardsToShow : prev - 1
        );
    };
    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === blogData.length - cardsToShow ? 0 : prev + 1
        );
    };

    return (
        <section className="bg-white py-16">
            <div className="main-container mx-auto text-center px-0">
                <h2 className="text-3xl font-bold mb-2 text-center">Astrology Blog</h2>
                <p className="text-gray-600 mb-10 text-center">
                    Explore our latest articles on astrology, zodiac signs, and cosmic influences
                </p>
                <div className="relative w-full my-8">
                    <div className="flex justify-between items-center gap-5">
                        <button
                            className="hidden lg:block bg-white border cursor-pointer border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
                            onClick={handlePrev}
                            disabled={blogData.length <= cardsToShow}
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            {visibleCards.map((article, idx) => (
                                <div key={idx} className="flex-shrink-0 w-full" style={{ flexBasis: `${100 / cardsToShow}%` }}>
                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-lg transition h-[420px] flex flex-col justify-between">
                                        <div className="h-48 bg-gray-100 w-full flex justify-center items-center overflow-hidden">
                                            <img
                                                src={
                                                    article?.Imageurl
                                                        ? `https://${article?.Imageurl?.replace(/\\/g, "/")}` 
                                                        : "https://via.placeholder.com/400x200?text=No+Image"
                                                }
                                                alt={article.Title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 p-5 justify-between">
                                            <h3 className="text-lg font-semibold mb-2 text-center overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">
                                                {article.Title || 'No Title'}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 mb-3 gap-4 justify-center">
                                                <span className="flex items-center gap-1"><FaUser /> {article.AuthorName}</span>
                                                <span className="flex items-center gap-1"><FaCalendar />  {format(new Date(article?.CreatedDtTm), "MMMM d, yyyy")}</span>
                                            </div>
                                            <p
                                                className="text-gray-600 text-center break-words whitespace-normal flex-1 mb-4 overflow-hidden text-ellipsis line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: article.ShortDescription || 'No description available' }}
                                            />
                                            <div className="mt-auto flex justify-center">
                                                <button
                                                    onClick={() => router.push("/astrology-blog")}
                                                    className="text-orange-500 font-medium hover:underline"
                                                >
                                                    Read More →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="hidden lg:block bg-white border cursor-pointer border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
                            onClick={handleNext}
                            disabled={blogData.length <= cardsToShow}
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </div>
                    {/* Dots for mobile/tablet only */}
                    {blogData.length > cardsToShow && (
                        <div className="flex justify-center items-center mt-2 lg:hidden">
                            {Array.from({ length: Math.ceil(blogData.length / cardsToShow) }).map((_, dotIdx) => {
                                const dotIndex = dotIdx * cardsToShow;
                                const isActive =
                                    (currentIndex >= dotIndex && currentIndex < dotIndex + cardsToShow) ||
                                    (dotIdx === 0 && currentIndex + cardsToShow > blogData.length);
                                return (
                                    <button
                                        key={dotIdx}
                                        onClick={() => setCurrentIndex(dotIndex)}
                                        className={`mx-1 w-3 h-3 rounded-full border border-orange-500 focus:outline-none transition-all duration-200 ${isActive ? "bg-orange-500" : "bg-white"}`}
                                        aria-label={`Go to slide ${dotIdx + 1}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="flex justify-center text-center mt-8">
                    <button
                        onClick={() => router.push("/astrology-blog")}
                        className="border border-orange-500 text-orange-500 rounded-md px-6 py-2 font-medium cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-200"
                    >
                        View All Articles
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
