"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getPostData, postWithToken } from "../utils/api";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  FaSearch, FaChevronRight, FaChevronLeft, FaPaperPlane, FaCommentDots,
  FaBookOpen, FaStar, FaLightbulb, FaSync, FaUserGraduate, FaShieldAlt, FaGift,
  FaUserCheck,
  FaLock,
  FaBolt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import {
  IoSparkles, IoPlanet, IoBook, IoHeart, IoCash, IoSchool, IoCalendar,
} from "react-icons/io5";
import DOMPurify from "dompurify";
import Image from "next/image";
import PageBanner from "@/app/components/PageBanner";
import CommonLoader from "../components/Common/Loader";

const ORANGE = "#FF5C00";

const CATEGORY_ICONS = [IoSparkles, IoPlanet, IoBook, IoHeart, IoCash, IoSchool, IoCalendar, IoPlanet];
const POPULAR_TAGS = ["#ZodiacSigns", "#Horoscope", "#Remedies", "#VastuTips", "#Numerology", "#TarotReading", "#Kundli", "#Panchang", "#Muhurat", "#Gemstones"];
const HERO_FEATURES = [
  { icon: FaUserGraduate, label: "Expert Astrologers" },
  { icon: FaShieldAlt, label: "Authentic Content" },
  { icon: FaLightbulb, label: "Spiritual Insights" },
  { icon: FaSync, label: "Updated Regularly" },
];
const BOTTOM_FEATURES = [
  { icon: FaUserGraduate, title: "Expert Authors", sub: "Articles by verified astrologers" },
  { icon: FaShieldAlt, title: "Authentic & Accurate", sub: "Trusted knowledge you can rely on" },
  { icon: FaSync, title: "Regular Updates", sub: "Fresh content every week" },
  { icon: FaGift, title: "100% Free to Read", sub: "Knowledge for everyone" },
];

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

const getSlug = (card) =>
  card?.MetaKeywords?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") || "";

const getCategoryName = (blog, categories) => {
  const cat = categories?.find((c) => c.BlogCategoryID == blog?.BlogCategoryID);
  return cat?.Description || "Astrology";
};

export default function BlogClient() {
  const router = useRouter();
  const getSessionValue = (key) =>
    typeof window !== "undefined" ? sessionStorage.getItem(key) || "" : "";

  const urlCategory =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("category")
      : null;

  const [blogData, setBlogData] = useState([]);
  const [manualSelectedCategory, setManualSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [itemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const BlogCategory = getSessionValue("category");

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await postWithToken("Blog/GetData_Blog", { IsActive: "1" });
      if (res) setBlogData(res || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getPostData("BlogCategory/GetData_BlogCategory", { IsActive: "1" });
      if (res) setCategoryData(res || []);
    } catch (e) { console.error(e); }
  }, []);

  const urlMatchedCategory = useMemo(() => {
    if (!urlCategory || categoryData.length === 0) return null;
    return categoryData.find((cat) => {
      const slug = cat.Description?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      return slug === urlCategory;
    }) ?? null;
  }, [categoryData, urlCategory]);

  const selectedCategory = manualSelectedCategory ?? urlMatchedCategory;

  useEffect(() => {
    queueMicrotask(() => {
      fetchBlogs();
      fetchCategories();
    });
  }, [fetchBlogs, fetchCategories]);

  useEffect(() => {
    if (urlMatchedCategory && typeof window !== "undefined") {
      sessionStorage.setItem("category", urlMatchedCategory.BlogCategoryID);
    }
  }, [urlMatchedCategory]);

  const getCategoryCount = (catId) =>
    blogData.filter((b) => b.BlogCategoryID == catId).length;

  const filteredBlogs = useMemo(() => {
    let blogs = [...blogData];
    const catId = getSessionValue("category") || BlogCategory;
    if (catId) blogs = blogs.filter((b) => b.BlogCategoryID == catId);
    if (searchVal) blogs = blogs.filter((b) => b.Title?.toLowerCase().includes(searchVal.toLowerCase()));
    if (sortBy === "latest") blogs.sort((a, b) => new Date(b.CreatedDtTm) - new Date(a.CreatedDtTm));
    else if (sortBy === "oldest") blogs.sort((a, b) => new Date(a.CreatedDtTm) - new Date(b.CreatedDtTm));
    else if (sortBy === "popular") blogs.sort((a, b) => (b.CountReViews || 0) - (a.CountReViews || 0));
    return blogs;
  }, [BlogCategory, searchVal, blogData, sortBy]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;

  const navigateToBlog = (card) => router.push(`/astrology-blog/${getSlug(card)}`);

  const selectCategory = (cat) => {
    if (cat) {
      setManualSelectedCategory(cat);
      sessionStorage.setItem("category", cat.BlogCategoryID);
    } else {
      setManualSelectedCategory(null);
      sessionStorage.removeItem("category");
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white pt-[72px]">

      <PageBanner
        bannerSrc="/Banner/BlogBennar test.png"
        bannerAlt="AstroCall Blog"
        currentPage="Blog"
        backHref="/"
        backLabel="Home"
        title={
          <>
            AstroCall Blog
            <span className="page-banner__accent">
              Knowledge. Guidance. Transformation.
            </span>
          </>
        }
        subtitle="Explore cosmic wisdom through insightful astrological articles, guides, and predictions to illuminate your spiritual journey."
      >
        <ul className="page-banner__features">
          {HERO_FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="page-banner__feature-item">
              <span className="page-banner__feature-icon">
                <Icon style={{ width: "0.95em", height: "0.95em" }} />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </PageBanner>

      {/* Main layout */}
      <div className="main-container px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="space-y-5 lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
            {/* Search */}
            <div>
              <h3 className="mb-2 text-sm font-bold text-[#0F172A]">Search</h3>
              <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchVal}
                  onChange={(e) => { setSearchVal(e.target.value); setCurrentPage(1); }}
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <button type="button" className="flex items-center justify-center px-3 text-white" style={{ backgroundColor: ORANGE }}>
                  <FaSearch size={14} />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => selectCategory(null)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${!selectedCategory && !BlogCategory ? "bg-[#FF5C00] font-semibold text-white" : "text-gray-600 hover:bg-orange-50 hover:text-[#FF5C00]"}`}
                  >
                    <span className="flex items-center gap-2"><IoSparkles size={14} /> All Categories</span>
                    <span className="text-xs opacity-75">{blogData.length}</span>
                  </button>
                </li>
                {categoryData.map((cat, i) => {
                  const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
                  const active = BlogCategory == cat.BlogCategoryID || selectedCategory?.BlogCategoryID == cat.BlogCategoryID;
                  return (
                    <li key={cat.BlogCategoryID}>
                      <button
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active ? "bg-[#FF5C00] font-semibold text-white" : "text-gray-600 hover:bg-orange-50 hover:text-[#FF5C00]"}`}
                      >
                        <span className="flex items-center gap-2 line-clamp-1"><Icon size={14} /> {cat.Description}</span>
                        <span className="text-xs opacity-75">{getCategoryCount(cat.BlogCategoryID)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#FF5C00] hover:underline">
                View All Categories <FaChevronRight size={9} />
              </button>
            </div>

            {/* Popular Tags */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <span key={tag} className="cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 transition hover:border-[#FF5C00] hover:text-[#FF5C00]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Newsletter</h3>
              <p className="mt-1 text-xs text-gray-500">Get weekly astrology insights in your inbox.</p>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5C00]"
              />
              <button type="button" className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                <FaPaperPlane size={12} /> Subscribe
              </button>
            </div>

            {/* Talk to Expert */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="relative h-32">
                <Image src="/images/profile pic.webp" alt="Expert astrologer" fill className="object-cover" sizes="300px" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#0F172A]">Talk to an Expert</h3>
                <p className="mt-1 text-xs text-gray-500">Get personalized guidance from verified astrologers.</p>
                <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                  <FaCommentDots size={13} /> Chat Now
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-9">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-serif text-xl font-bold text-[#0F172A] sm:text-2xl">All Blog Posts</h2>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>Showing {filteredBlogs.length ? indexOfFirst + 1 : 0} – {Math.min(indexOfLast, filteredBlogs.length)} of {filteredBlogs.length} Posts</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#FF5C00]"
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="popular">Sort by: Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <CommonLoader size="medium" message="Finding latest articles for you..." color="orange" />
            ) : currentItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {currentItems.map((card, idx) => {
                  const catName = getCategoryName(card, categoryData);
                  const excerpt = stripHtml(card?.ShortDescription || "");
                  return (
                    <article
                      key={idx}
                      onClick={() => navigateToBlog(card)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={card.Imageurl ? `https://${card.Imageurl.replace(/\\/g, "/")}` : "/default-image.jpg"}
                          alt={card.Title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          onError={(e) => { e.target.src = "/default-image.jpg"; }}
                        />
                        <span className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: ORANGE }}>
                          {catName}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="text-[11px] text-gray-400">{format(new Date(card.CreatedDtTm), "MMM d, yyyy")}</p>
                        <h3 className="mt-1 font-serif text-sm font-bold leading-snug text-[#0F172A] line-clamp-2 group-hover:text-[#FF5C00]">
                          {card.Title}
                        </h3>
                        <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-500 line-clamp-3">{excerpt}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                          <div className="flex items-center gap-2">
                            <div className="relative h-6 w-6 overflow-hidden rounded-full bg-orange-100">
                              <Image src="/images/profile pic.webp" alt="" fill className="object-cover" sizes="24px" />
                            </div>
                            <span className="text-[11px] font-semibold text-gray-700">{card.AuthorName || "Acharya Dev Sharma"}</span>
                            <MdVerified size={12} className="text-[#3B82F6]" />
                          </div>
                          <span className="flex items-center gap-1 text-[10px] text-gray-400">
                            <FaBookOpen size={9} /> 5 min read
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-gray-500">
                {searchVal ? `No articles found for "${searchVal}"` : "No articles found in this category."}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-[#FF5C00] hover:text-[#FF5C00] disabled:opacity-40"
                >
                  <FaChevronLeft size={12} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${currentPage === page ? "text-white" : "border border-gray-200 text-gray-600 hover:border-[#FF5C00]"}`}
                      style={currentPage === page ? { backgroundColor: ORANGE } : {}}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-gray-400">...</span>}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-[#FF5C00] hover:text-[#FF5C00] disabled:opacity-40"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom feature bar */}
      <section className="border-t border-orange-50 bg-[#FFFBF7] py-8">
        <div className="main-container grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {BOTTOM_FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Icon size={16} className="text-[#FF5C00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
