"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { postWithToken } from "@/app/utils/api";
import { ORANGE, CREAM } from "@/app/lib/siteTheme";

function getBlogImage(blog) {
  const url = blog?.Imageurl ;

  if (!url) return null;

  return url.startsWith("http")
    ? url
    : `https://${String(url).replace(/\\/g, "/")}`;
}

function BlogCard({ blog }) {
  const href = `/astrology-blog/${blog?.Slug || blog?.BlogID}`;
  const imgSrc = getBlogImage(blog);

  return (
    <Link
      href={href}
      className="group cursor-pointer overflow-hidden rounded-3xl bg-white border border-orange-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={blog?.Title || "Blog"}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-orange-50 text-orange-500 font-bold">
            Blog
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#F16322] shadow">
          Astrology
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {blog?.CreatedDate && (
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
            <FaCalendarAlt className="text-[#F16322]" />
            {format(new Date(blog.CreatedDate), "MMM dd, yyyy")}
          </div>
        )}

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#1A1A1A] transition group-hover:text-[#F16322]">
          {blog?.Title}
        </h3>

        <div className="mt-5 flex items-center font-semibold text-[#F16322]">
          Read More
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomeBlogCompact() {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await postWithToken(
        "Blog/GetData_Blog",
        {
          IsActive: "1",
          IsHomePage: "true",
        }
      );

      if (res) {
        // console.log(res, 'res')
        setBlogData((res || []).slice(0, 4));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchBlogs();
    });
  }, [fetchBlogs]);

  return (
    <section
      className="py-2 md:py-6"
      style={{ backgroundColor: CREAM }}
    >
      <div className="main-container px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#F16322]">
            Astrology Insights
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#1A1A1A] md:text-4xl">
            Latest From Our Blog
          </h2>

          <p className="mt-3 text-gray-500">
            Expert astrology guidance, remedies and predictions.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl bg-white border border-orange-100"
              >
                <div className="h-52 animate-pulse bg-orange-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded bg-orange-100" />
                  <div className="h-5 w-full animate-pulse rounded bg-orange-100" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-orange-50" />
                </div>
              </div>
            ))}
          </div>
        ) : blogData.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {blogData.map((blog) => (
                <BlogCard
                  key={blog?.BlogID || blog?.Slug}
                  blog={blog}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/astrology-blog"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full px-8 py-3 text-white font-semibold transition hover:scale-105"
                style={{ backgroundColor: ORANGE }}
              >
                View All Blogs →
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-white py-12 text-center shadow-sm">
            <p className="text-gray-500">
              No blog posts available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}