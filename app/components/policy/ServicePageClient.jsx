"use client";

import { useContext } from "react";
import DOMPurify from "dompurify";
import { MenuContext } from "@/app/context/MenuContext";
import PageBanner from "@/app/components/PageBanner";
import { DEFAULT_BANNER_SRC } from "@/app/lib/siteTheme";

/**
 * Client wrapper for SEO service landing pages — hero banner + CMS content.
 */
export default function ServicePageClient({
  items = [],
  heroTitle,
  heroSubtitle,
  currentPage,
  bannerSrc = DEFAULT_BANNER_SRC,
}) {
  const { isMenuOpen } = useContext(MenuContext);

  const content =
    items.length === 0 ? (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-center text-lg font-medium text-gray-600">No data available</p>
      </div>
    ) : (
      items.map((item, index) => (
        <div className="main-container" key={index}>
          <div className="my-6 flex flex-col justify-center text-center">
            <h2 className="text-3xl font-semibold">{item?.Category}</h2>
            <div className="m-auto mt-1 h-[3px] w-[20%] rounded-full bg-primaryColor" />
          </div>
          <div className="paragraph px-2 md:px-6">
            <div
              className="ml-5 text-justify leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item?.PrivacyPolicyhtml || ""),
              }}
            />
          </div>
        </div>
      ))
    );

  return (
    <div className="bg-[#F973160D]">
      <div className={`content pt-[72px] ${isMenuOpen ? "blur" : ""}`}>
        <PageBanner
          bannerSrc={bannerSrc}
          currentPage={currentPage || heroTitle?.split("|")[0]?.trim() || heroTitle}
          title={heroTitle}
          subtitle={heroSubtitle}
          backHref="/"
        />
        <div className="main-container py-5">{content}</div>
      </div>
    </div>
  );
}
