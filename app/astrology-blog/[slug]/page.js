
"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getPostData, postWithToken } from '../../utils/api';
import DOMPurify from 'dompurify';
import { MdPhoneInTalk } from 'react-icons/md';
import { IoMdChatboxes } from 'react-icons/io';
import { format } from 'date-fns';
// Image paths from public directory
const fbLogo = "/images/fb.webp";
const igLogo = "/images/ig.webp";
// const linkedinLogo = "/images/linkedin.webp";
import CommonLoader from '../../components/Common/Loader';
import Footer from '../../components/Footer/page';
import Header from '../../components/Header/page';
import { MenuContext } from '../../context/MenuContext';
import SEO from '../../components/SEO/page';
import Image from "next/image";

const BlogDetails = () => {

    const { setLanguageStatus } = useContext(MenuContext);
    const { slug } = useParams();

    const [trendingData, setTrendingData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [blogData, setBlogData] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        setLanguageStatus(false)
        const fetchCategories = async () => {
            try {
                const res = await getPostData('BlogCategory/GetData_BlogCategory', { 'IsActive': '1' });
                if (res) setCategories(res);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (slug) {
            fetchBlogBySlug();
        } else {
            setLoading(false);
        }
    }, [slug]);

    const fetchBlogBySlug = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getPostData('Blog/GetSingleData_Blog', { 'BlogsID': '0', 'MetaKeywords': `/${slug}` });
            if (res && res.length > 0) {
                const blogData = res[0];
                setBlogData(blogData);
                const allBlogsRes = await getPostData('Blog/GetData_Blog', { 'IsActive': '1' });
                if (allBlogsRes) {
                    setAllBlogs(allBlogsRes);
                }
            } else {
                setBlogData(null);
                setError("Blog not found");
            }
        } catch (error) {
            console.error("Error fetching blog:", error);
            setBlogData(null);
            setError("Failed to load blog. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        HandleTrending(allBlogs);
    }, [allBlogs]);

    const HandleTrending = (Trending) => {
        const sortedTarotArray = (Trending || [])?.filter((item) => item?.IsTrending === true);
        setTrendingData(sortedTarotArray);
    };

    return (
        <>
            <Header />
            {(blogData) && (
                <SEO
                    title={blogData?.MetaTitle}
                    description={blogData?.MetaDescription}
                    canonical={`https://astrocall.live/astrology-blog/${slug}`}
                    keywords={blogData?.MetaKeywords}
                    type="article"
                    schema={{
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": blogData?.MetaTitle,
                        "description": blogData?.MetaDescription,
                        "author": {
                            "@type": "Person",
                            "name": blogData?.AuthorName || "AstroCall"
                        },
                        "datePublished": blogData?.CreatedDtTm,
                        "image": blogData?.Imageurl ? `https://${blogData?.Imageurl?.replace(/\\/g, "/")}` : "https://astrocall.live/default.jpg",
                        "publisher": {
                            "@type": "Organization",
                            "name": "AstroCall",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://astrocall.live/assets/logo.png"
                            }
                        }
                    }}
                />
            )}

            <div className="bg-[#F973160D] pt-20 lg:pt-22">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 main-container rounded-lg sm:rounded-xl text-white text-center py-8 sm:py-10 md:py-12 px-3 sm:px-4 mt-4 sm:mt-6 shadow-lg">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2 drop-shadow-lg">AstroCall Blog</h1>
                    <p className="max-w-2xl mx-auto mb-4 sm:mb-6 text-white/90 text-xs sm:text-sm md:text-base px-2 leading-relaxed">
                        Explore the cosmic wisdom of the stars through our collection of insightful astrological articles, guides,
                        and predictions to illuminate your spiritual journey.
                    </p>
                </div>

                <div className='bg-[#FFF9F1] main-container mx-auto blog-details-container'>
                    <div className="flex flex-col lg:flex-row gap-4 mt-8">
                        {/* Sidebar */}
                        <aside className="lg:w-[20%] w-full bg-white p-4 rounded-xl shadow-lg order-2 lg:order-1">
                            <div className="mb-6 sm:mb-8">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                                    Trending Now
                                </h2>
                                <ul className="space-y-3 sm:space-y-4">
                                    {trendingData?.length > 0 ? (
                                        trendingData?.map((item, index) => (

                                            <li
                                                key={index}
                                                className="border-b border-dashed border-gray-300 pb-2 sm:pb-3 "
                                            >
                                                <div
                                                    onClick={() => {
                                                        const itemSlug = item?.MetaKeywords?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
                                                        router.push(`/astrology-blog/${itemSlug}`);
                                                    }}
                                                    className="flex items-center justify-between text-xs sm:text-sm text-gray-700 
                                                hover:text-orange-600 transition cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <span className="text-orange-500 flex-shrink-0">•</span>
                                                        <span className="line-clamp-2">{item?.Title}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs sm:text-sm text-gray-500 text-center py-2">
                                            No trending articles
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                                    Categories
                                </h2>
                                <ul className="space-y-1.5 sm:space-y-2">
                                    <li>
                                        <Link href="/astrology-blog">
                                            <button
                                                className={`w-full text-left px-3 py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition ${activeIndex === null
                                                    ? "bg-orange-600 text-white"
                                                    : "hover:bg-gray-100 hover:text-orange-600 text-gray-700"
                                                    }`}
                                                onClick={() => {
                                                    setActiveIndex(null);
                                                }}
                                            >
                                                All Blogs
                                            </button>
                                        </Link>
                                    </li>

                                    {categories?.map((category, index) => (
                                        <li key={index}>
                                            <Link href={`/astrology-blog?category=${category?.Description?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}`}>
                                                <button
                                                    className={`w-full text-left px-3 py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition ${activeIndex === index
                                                        ? "bg-orange-600 text-white"
                                                        : "hover:bg-gray-100 hover:text-orange-600 text-gray-700"
                                                        }`}
                                                    onClick={() => {
                                                        setActiveIndex(index);
                                                        sessionStorage.setItem("category", category?.BlogCategoryID);
                                                    }}
                                                >
                                                    {category?.Description}
                                                </button>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        <main className="flex-1 w-full space-y-6 order-1 lg:order-2">
                            {loading ? (
                                <div className="flex justify-center items-center h-60">
                                    <CommonLoader color="orange" size="medium" message="Loading blog..." />
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-60">
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Blog Not Found</h2>
                                        {/* <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Blog</h2> */}
                                        {/* <p className="text-gray-500 mb-4">{error}</p> */}
                                    </div>
                                </div>
                            ) : blogData ? (() => {
                                const card = blogData;
                                const cleanHtml = DOMPurify.sanitize(`${card?.ShortDescription || ""}${card?.Blog || ""}${card?.Description || ""}`);

                                return (
                                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg space-y-4 sm:space-y-6">
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                                            {card?.MetaTitle || card?.Title}
                                        </h1>

                                        <div className="relative w-full h-[500px]  overflow-hidden rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center">
                                            <Image
                                                src={
                                                    card?.Imageurl
                                                        ? `https://${card.Imageurl.replace(/\\/g, "/")}`
                                                        : card?.Photo
                                                            ? `https://${card.Photo.replace(/\\/g, "/")}`
                                                            : "/default-image.jpg"
                                                }
                                                alt={card?.MetaTitle || card?.Title || "Blog Image"}
                                                fill
                                                sizes="100vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div
                                            className="prose prose-sm sm:prose-base max-w-none text-xs sm:text-sm md:text-base leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: cleanHtml }}
                                        />

                                        <div className="flex justify-center gap-4 sm:gap-5 mt-4 sm:mt-6">
                                            <a href="https://www.facebook.com/share/1AZyAfVdjE/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
                                                <Image src={fbLogo} alt="Facebook" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
                                            </a>
                                            <a href="https://www.instagram.com/astrocall.live?igsh=MXFrNnpoNnY3ZmVsMA==" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">
                                                {/* <img src={igLogo} alt="Instagram" className="w-6 h-6 sm:w-7 sm:h-7" /> */}
                                                <Image src={igLogo} alt="Instagram" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
                                            </a>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-600 text-center border-t pt-3 sm:pt-4">
                                            <span className="block sm:inline">Posted On - {format(new Date(card?.CreatedDtTm), 'MMMM d, yyyy')}</span>
                                            <span className="hidden sm:inline"> | </span>
                                            <span className="block sm:inline">Posted By - {card?.AuthorName || "AstroCall"}</span>
                                            <span className="hidden sm:inline"> | </span>
                                            <span className="block sm:inline">Read By - {card?.CountReViews || "0"}</span>
                                        </p>
                                    </div>
                                );
                            })() : (
                                <div className="flex justify-center items-center h-60">
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Blog Not Found</h2>
                                    </div>
                                </div>
                            )}


                        </main>
                    </div>

                    <div className="bg-orange-500 mb-8 sm:mb-10 mb-5 rounded-xl sm:rounded-2xl text-white text-center py-4 sm:py-5 md:py-6 mt-6 sm:mt-8 md:mt-10 w-full px-3 sm:px-4">
                        <h3 className="text-sm sm:text-base md:text-lg px-2">
                            Connect with an Astrologer on Call or Chat for more personalized predictions.
                        </h3>
                        <div className="flex flex-col sm:flex-row  justify-center gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-5">
                            <button
                                className="bg-white text-orange-500 px-4 cursor-pointer sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-md hover:shadow-lg text-sm sm:text-base font-medium"
                                onClick={() => router.push('/talk-to-astrologers')}
                            >
                                Talk to Astrologers  <MdPhoneInTalk className="text-lg sm:text-xl" />
                            </button>
                            <button
                                className="bg-white text-orange-500 px-4 cursor-pointer sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-md hover:shadow-lg text-sm sm:text-base font-medium"
                                onClick={() => router.push('/chat-to-astrologers')}
                            >
                                Chat with Astrologers <IoMdChatboxes className="text-lg sm:text-xl" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogDetails;
