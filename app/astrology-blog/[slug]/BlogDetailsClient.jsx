"use client";

import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPostData } from "../../utils/api";
import { sanitizeHtml } from "@/app/lib/sanitizeHtml";
import { format } from "date-fns";
import {
  FaChevronRight, FaClock, FaEye, FaCommentDots, FaPaperPlane,
  FaFacebookF, FaTwitter, FaWhatsapp, FaLink,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import CommonLoader from "../../components/Common/Loader";
import { MenuContext } from "../../context/MenuContext";
import Image from "next/image";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const POPULAR_TAGS = ["#Remedies", "#VastuTips", "#Numerology", "#ZodiacSigns", "#Horoscope", "#Kundli", "#TarotReading", "#Panchang", "#Muhurat", "#Gemstones"];

const ZODIAC_SIGNS = [
  { name: "Aries", dates: "March 21 – April 19", color: "#EF4444", symbol: "♈", desc: "Bold, ambitious, and energetic. Aries leads with courage and passion." },
  { name: "Taurus", dates: "April 20 – May 20", color: "#22C55E", symbol: "♉", desc: "Reliable, patient, and devoted. Taurus values stability and comfort." },
  { name: "Gemini", dates: "May 21 – June 20", color: "#EAB308", symbol: "♊", desc: "Curious, adaptable, and witty. Gemini thrives on communication." },
  { name: "Cancer", dates: "June 21 – July 22", color: "#3B82F6", symbol: "♋", desc: "Intuitive, emotional, and protective. Cancer nurtures deep connections." },
];

const getSlug = (item) =>
  item?.MetaKeywords?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") || "";

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

export default function BlogDetailsClient() {
  const { setLanguageStatus } = useContext(MenuContext);
  const { slug } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [blogData, setBlogData] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    queueMicrotask(() => setLanguageStatus(false));
    getPostData("BlogCategory/GetData_BlogCategory", { IsActive: "1" })
      .then((res) => { if (res) setCategories(res); })
      .catch(console.error);
  }, [setLanguageStatus]);

  const fetchBlogBySlug = useCallback(async () => {
    try {
      setError(null);
      const [res, allBlogsRes] = await Promise.all([
        getPostData("Blog/GetSingleData_Blog", { BlogsID: "0", MetaKeywords: `/${slug}` }),
        getPostData("Blog/GetData_Blog", { IsActive: "1" }),
      ]);
      if (res?.length > 0) {
        setBlogData(res[0]);
        if (allBlogsRes) setAllBlogs(allBlogsRes);
      } else {
        setBlogData(null);
        setError("Blog not found");
      }
    } catch (err) {
      console.error(err);
      setBlogData(null);
      setError("Failed to load blog.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
      fetchBlogBySlug();
    });

    return () => {
      cancelled = true;
    };
  }, [slug, fetchBlogBySlug]);

  const categoryName = useMemo(() => {
    if (!blogData || !categories.length) return "Astrology";
    return categories.find((c) => c.BlogCategoryID == blogData.BlogCategoryID)?.Description || "Astrology";
  }, [blogData, categories]);

  const relatedArticles = useMemo(() => {
    if (!blogData || !allBlogs.length) return [];
    return allBlogs
      .filter((b) => b.BlogsID !== blogData.BlogsID)
      .sort((a, b) => {
        const aMatch = a.BlogCategoryID == blogData.BlogCategoryID ? 1 : 0;
        const bMatch = b.BlogCategoryID == blogData.BlogCategoryID ? 1 : 0;
        return bMatch - aMatch;
      })
      .slice(0, 5);
  }, [blogData, allBlogs]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(shareUrl);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-20">
        <CommonLoader color="orange" size="medium" message="Loading blog..." />
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Blog Not Found</h2>
          <button type="button" onClick={() => router.push("/astrology-blog")} className="mt-4 text-sm font-semibold text-[#FF5C00] hover:underline">
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const card = blogData;
  const authorName = card.AuthorName || "Acharya Dev Sharma";
  const cleanHtml = sanitizeHtml(`${card?.ShortDescription || ""}${card?.Blog || ""}${card?.Description || ""}`);
  const subtitle = stripHtml(card?.ShortDescription || "").slice(0, 200);
  const imageSrc = card?.Imageurl
    ? `https://${card.Imageurl.replace(/\\/g, "/")}`
    : card?.Photo
      ? `https://${card.Photo.replace(/\\/g, "/")}`
      : "/default-image.jpg";
  const showZodiac = categoryName.toLowerCase().includes("zodiac") || card.Title?.toLowerCase().includes("zodiac");

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.blog}
        currentPage={card.Title}
        crumbs={[
          { label: "Blog", href: "/astrology-blog" },
        ]}
        title={card.MetaTitle || card.Title}
        subtitle={subtitle || undefined}
        titleClassName="font-heading text-xl font-bold leading-snug text-[#1A1A1A] sm:text-2xl md:text-3xl"
        subtitleClassName="mt-2 font-body text-sm leading-relaxed text-gray-600 sm:text-base"
      />
      <div className="main-container px-4 py-6">

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main content */}
          <main className="lg:col-span-8">
            <span className="inline-block rounded-md px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>
              {categoryName}
            </span>

            <h1 className="mt-3 font-serif text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-3xl md:text-4xl lg:hidden">
              {card.MetaTitle || card.Title}
            </h1>

            {subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base lg:hidden">{subtitle}</p>
            )}

            {/* Author & share bar */}
            <div className="mt-5 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-orange-100">
                  <Image src="/images/profile pic.webp" alt={authorName} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm font-bold text-[#0F172A]">
                    {authorName} <MdVerified size={14} className="text-[#3B82F6]" />
                  </p>
                  <p className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>{format(new Date(card.CreatedDtTm), "MMMM d, yyyy")}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><FaClock size={10} /> 5 min read</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><FaEye size={10} /> {card.CountReViews || "0"} views</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Share this article</span>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-green-600 hover:border-green-400">
                  <FaWhatsapp size={14} />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-blue-600 hover:border-blue-400">
                  <FaFacebookF size={13} />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-sky-500 hover:border-sky-400">
                  <FaTwitter size={13} />
                </a>
                <button type="button" onClick={copyLink} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-[#FF5C00] hover:text-[#FF5C00]">
                  <FaLink size={13} />
                </button>
              </div>
            </div>

            {/* Featured image */}
            <div className="relative mt-6 aspect-[16/7] overflow-hidden rounded-2xl bg-gray-100">
              <Image src={imageSrc} alt={card.Title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 800px" priority />
            </div>

            {/* Article body */}
            <div
              className="prose prose-sm sm:prose-base mt-8 max-w-none leading-relaxed text-gray-700 prose-headings:font-serif prose-headings:text-[#0F172A] prose-a:text-[#FF5C00]"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />

            {/* Zodiac list (for zodiac articles) */}
            {showZodiac && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-bold text-[#0F172A]">The 12 Zodiac Signs at a Glance</h2>
                <div className="mt-4 space-y-3">
                  {ZODIAC_SIGNS.map((z) => (
                    <div key={z.name} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ backgroundColor: z.color }}>
                        {z.symbol}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[#0F172A]">{z.name} ({z.dates})</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{z.desc}</p>
                      </div>
                      <button type="button" className="shrink-0 text-xs font-semibold text-[#FF5C00] hover:underline">
                        Read More →
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-4 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#FF5C00] hover:text-[#FF5C00]">
                  Explore All 12 Zodiac Signs in Detail ↓
                </button>
              </div>
            )}

            {/* CTA Banner */}
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl p-5 text-white sm:flex-row sm:p-6" style={{ backgroundColor: ORANGE }}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl">✦</div>
              <p className="flex-1 text-center text-sm leading-relaxed sm:text-left sm:text-base">
                Want a Deep Insight into Your Birth Chart? Chat with our expert astrologers and unlock the secrets of your stars.
              </p>
              <button
                type="button"
                onClick={() => router.push("/chat-to-astrologers")}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#FF5C00] shadow-sm hover:bg-orange-50"
              >
                <FaCommentDots size={14} /> Chat Now
              </button>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
              <span className="text-sm font-semibold text-[#0F172A]">Tags:</span>
              {POPULAR_TAGS.slice(0, 6).map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-20 lg:self-start">
            {/* About Author */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A]">About the Author</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-orange-100">
                  <Image src="/images/profile pic.webp" alt={authorName} fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <p className="flex items-center gap-1 text-sm font-bold text-[#0F172A]">
                    {authorName} <MdVerified size={14} className="text-[#3B82F6]" />
                  </p>
                  <p className="text-xs text-gray-500">Vedic Astrologer</p>
                  <p className="text-xs font-semibold text-[#FF5C00]">12+ Years Experience</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                Renowned Vedic astrologer specializing in Kundli analysis, remedies, and personalized spiritual guidance.
              </p>
              <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="mt-4 w-full rounded-lg border-2 py-2 text-sm font-bold text-[#FF5C00] transition hover:bg-orange-50" style={{ borderColor: ORANGE }}>
                View Profile
              </button>
            </div>

            {/* Related Articles */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A]">Related Articles</h3>
              <ul className="mt-4 space-y-4">
                {relatedArticles.length > 0 ? relatedArticles.map((item) => (
                  <li key={item.BlogsID}>
                    <Link href={`/astrology-blog/${getSlug(item)}`} className="group flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.Imageurl ? `https://${item.Imageurl.replace(/\\/g, "/")}` : "/default-image.jpg"}
                          alt={item.Title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = "/default-image.jpg"; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-snug text-[#0F172A] line-clamp-2 group-hover:text-[#FF5C00]">{item.Title}</p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {format(new Date(item.CreatedDtTm), "MMM d, yyyy")} · 5 min read
                        </p>
                      </div>
                    </Link>
                  </li>
                )) : (
                  <li className="text-xs text-gray-400">No related articles found.</li>
                )}
              </ul>
              <Link href="/astrology-blog" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#FF5C00] hover:underline">
                View All Articles <FaChevronRight size={9} />
              </Link>
            </div>

            {/* Popular Tags */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A]">Popular Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <span key={tag} className="cursor-pointer rounded-full border border-gray-200 px-2.5 py-1 text-[11px] text-gray-600 transition hover:border-[#FF5C00] hover:text-[#FF5C00]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="relative overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
              <div className="pointer-events-none absolute -right-2 -top-2 text-4xl opacity-20">✉</div>
              <h3 className="text-sm font-bold text-[#FF5C00]">Stay Updated with Astrology Insights!</h3>
              <p className="mt-1 text-xs text-gray-500">Subscribe for weekly cosmic wisdom delivered to your inbox.</p>
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
          </aside>
        </div>
      </div>
    </div>
  );
}
