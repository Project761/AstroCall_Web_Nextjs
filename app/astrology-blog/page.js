"use client";

import React, { useEffect, useState, useMemo, useContext } from "react";
import { getPostData, postWithToken } from "../utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FaCalendarAlt, FaEye, FaSearch } from "react-icons/fa";
import Footer from "../components/Footer/page";
import Header from "../components/Header/page";
import { MenuContext } from "../context/MenuContext";
import DOMPurify from 'dompurify';
import SEO from "../components/SEO/page";
import Image from "next/image";
import CommonLoader from "../components/Common/Loader";


const Blog = () => {
  const getSessionValue = (key) =>
    typeof window !== "undefined" ? sessionStorage.getItem(key) || "" : "";

  const urlCategory = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('category') : null;
  const BlogCategory = getSessionValue("category");
  // const { setLanguageStatus } = useContext(MenuContext);
  const [blogData, setBlogData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [itemsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    // setLanguageStatus(false)
  }, []);

  useEffect(() => {
    if (categoryData.length > 0 && urlCategory) {
      const matchedCategory = categoryData.find(cat => {
        const categorySlug = cat.Description?.toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "");
        return categorySlug === urlCategory;
      });

      if (matchedCategory) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("category", matchedCategory.BlogCategoryID);
        }
        setSelectedCategory(matchedCategory);
      }
    }
  }, [categoryData, urlCategory]);


  useEffect(() => {
    const cameFromCategory = getSessionValue("fromCategory");
    if (cameFromCategory) {
      return () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("fromCategory");
        }
      };
    }
  }, [BlogCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await postWithToken("Blog/GetData_Blog", { IsActive: "1" });
      if (res) {
        setBlogData(res || []);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getPostData("BlogCategory/GetData_BlogCategory", { IsActive: "1" });
      if (res) {
        setCategoryData(res || []);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    let blogs = blogData;
    const currentBlogCategory = getSessionValue("category") || BlogCategory;
    if (currentBlogCategory) {
      blogs = blogs?.filter((item) => item?.BlogCategoryID == currentBlogCategory);
    }
    if (searchVal) {
      blogs = blogs?.filter((item) => item?.Title?.toLowerCase().includes(searchVal.toLowerCase()));
    }
    return blogs;
  }, [BlogCategory, searchVal, blogData]);

  const handleSearchChange = (e) => { setSearchVal(e.target.value); };


  const tags = [
    "Mercury Retrograde", "Full Moon", "New Moon", "Jupiter Transit", "Solar Eclipse",
    "Venus Retrograde", "Rahu", "Ketu", "Astrology Basics", "Dasha System"
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const isCurrentItemsLoading = loading;

  return (
    <>


      <>
        <SEO
          title="AstroCall Astrology Blog – Vedic Tips, Remedies & Insights"
          description="Read expert astrology blogs on love, career, festivals, doshas & remedies. Stay spiritually informed."
          canonical="https://astrocall.live/astrology-blog"
          type="website"
          schema={{
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Astrology Blog",
            "url": "https://astrocall.live/astrology-blog",
            "logo": "https://astrocall.live/assets/logo.png",
            "sameAs": [
              "https://www.facebook.com/AstroCall",
              "https://www.instagram.com/AstroCall",
              "https://twitter.com/astrocall"
            ]
          }}
        />

        <div className="bg-[#F973160D] pt-10 lg:pt-22">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 main-container rounded-lg sm:rounded-xl text-white text-center py-8 sm:py-10 md:py-12 px-3 sm:px-4 mt-2 sm:mt-3 shadow-lg">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold px-2 text-white drop-shadow-lg">AstroCall Blog</h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 px-2 text-white/95 drop-shadow-md">
              Vedic Guidance, Festival Tips, Astrological Remedies
            </h2>
            <h3>
              <p className="mt-2 sm:mt-3 max-w-2xl mx-auto mb-4 sm:mb-6 text-white/90 text-xs sm:text-sm md:text-base px-2 leading-relaxed drop-shadow-sm">
                Explore the cosmic wisdom of the stars through our collection of insightful astrological articles, guides,
                and predictions to illuminate your spiritual journey.
              </p>
            </h3>

            <div className="max-w-lg mx-auto flex items-center bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-orange-400 transition-all duration-300 px-2 sm:px-0">
              <input
                type="text"
                placeholder="Search for articles..."
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-gray-800 outline-none focus:text-gray-900 placeholder-gray-500"
                value={searchVal}
                onChange={handleSearchChange}
              />
              <button className="px-4 sm:px-5 text-orange-500 hover:text-orange-600 transition bg-orange-50 hover:bg-orange-100 py-3 sm:py-3.5">
                <FaSearch className="text-sm sm:text-base" />
              </button>
            </div>
          </div>


          <div className="bg-[#FFF9F1] py-6 sm:py-8 md:py-10">
            <div className="main-container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-3 sm:px-4">
              <div className="lg:col-span-9 space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 px-2 sm:px-0 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></span>
                  Latest Articles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {isCurrentItemsLoading ? (
                    <div className="col-span-full">
                      <CommonLoader
                        size="medium"
                        message="Finding latest articles for you..."
                        color="orange"
                      />
                    </div>
                  ) : currentItems?.length > 0 ? (
                    currentItems.map((card, idx) => (
                      <div key={idx} className="cursor-pointer">
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const slug = card?.MetaKeywords
                              ?.toLowerCase()
                              .trim()
                              .replace(/\s+/g, "-")
                              .replace(/[^\w-]+/g, "");

                            router.push(`/astrology-blog/${slug}`);
                          }}


                          className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                          <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-t-lg sm:rounded-t-xl bg-gray-100 flex items-center justify-center">
                            <Image
                              src={
                                card.Imageurl
                                  ? `https://${card.Imageurl.replace(/\\/g, "/")}`
                                  : "/default-image.jpg"
                              }
                              alt={card?.Title || "Featured"}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-fit-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-[10px] sm:text-xs rounded-md flex items-center gap-1 shadow-md">
                              <FaEye />
                              <span>{card?.CountReViews || "0"}</span>
                            </div>
                          </div>

                          <div className="p-3 sm:p-4 flex flex-col flex-1">
                            <h4 className="font-bold text-base sm:text-lg md:text-xl text-orange-600 mb-2 sm:mb-3 line-clamp-2 group-hover:text-orange-700 transition-colors">
                              {card.Title}
                            </h4>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mb-3 sm:mb-4">
                              <FaCalendarAlt className="text-orange-500" />
                              <span className="whitespace-nowrap">
                                {format(new Date(card.CreatedDtTm), "MMM d, yyyy")}
                              </span>
                            </div>
                            <p
                              className="text-sm text-gray-600 mb-4 sm:mb-5 line-clamp-3 flex-1 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card?.ShortDescription || "") }}
                            />

                            <button
                              className="bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto"
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center col-span-full text-gray-700 text-base sm:text-lg py-12 sm:py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                          <FaSearch className="text-orange-500 text-2xl" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-800">
                            {searchVal ? (
                              `No articles found for "${searchVal}"`
                            ) : BlogCategory ? (
                              "No articles found in this category."
                            ) : (
                              "No articles available."
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Try adjusting your search or browse different categories
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                {/* Categories */}
                <div className="bg-white shadow-lg rounded-xl p-5 sm:p-6 border border-orange-100">
                  <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Categories
                  </h4>
                  <ul className="text-sm space-y-1">
                    {/* All Category Option */}
                    <li
                      className={`flex justify-between items-center py-3 px-3 rounded-lg cursor-pointer transition-all duration-200 ${!selectedCategory
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCategory(null);
                        sessionStorage.removeItem("category");
                        fetchBlogs();
                      }}
                    >
                      <span className="font-medium">All Blogs</span>
                      <span className="text-xs opacity-75">View All</span>
                    </li>

                    {/* Dynamic Categories */}
                    {categoryData?.map((cat, i) => (
                      <li
                        key={i}
                        className={`flex justify-between items-center py-3 px-3 rounded-lg cursor-pointer transition-all duration-200 
                                            ${BlogCategory == cat.BlogCategoryID
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCategory(cat);
                          sessionStorage.setItem("category", cat?.BlogCategoryID);
                          fetchBlogs();
                        }}
                      >
                        <span className="line-clamp-1 font-medium">{cat.Description}</span>
                        <span className="text-xs opacity-75">→</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-5 sm:p-6 border border-orange-100">
                  <h4 className="text-lg sm:text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Popular Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 cursor-pointer hover:shadow-md transform hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>


              {totalPages > 1 && (
                <div className="lg:col-span-2">
                  <div className="flex justify-center items-center mt-8 sm:mt-10 md:mt-12 space-x-2 pb-6">
                    {/* Prev Arrow */}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                      aria-label="Previous page"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Page Buttons */}
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
                              <span className="px-2 text-gray-400 select-none text-sm font-medium">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm sm:text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${currentPage === page
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg ring-2 ring-orange-300"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                                }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      })}

                    {/* Next Arrow */}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                      aria-label="Next page"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </>


    </>
  );
};

export default Blog;
