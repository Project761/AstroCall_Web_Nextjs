"use client";

import { useContext } from "react";
import DOMPurify from "dompurify";
import { MenuContext } from "@/app/context/MenuContext";
import PageBanner from "@/app/components/PageBanner";
import { DEFAULT_BANNER_SRC } from "@/app/lib/siteTheme";

/**
 * Client wrapper for policy/CMS pages — preserves MenuContext blur behaviour only.
 */
export default function PolicyPageClient({
  items = [],
  layoutVariant = "gradient",
  pageTitle,
  pageSubtitle,
  bannerSrc = DEFAULT_BANNER_SRC,
}) {
  const { isMenuOpen } = useContext(MenuContext);

  const displayTitle = pageTitle || items[0]?.Category || "Policy";
  const displaySubtitle =
    pageSubtitle ||
    "Read our policies and understand how AstroCall protects your data and rights.";

  const content =
    items.length === 0 ? (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-center text-lg font-medium text-gray-600">No data available</p>
      </div>
    ) : (
      items.map((item, index) => (
        <div className="main-container" key={index}>
          <div className="my-6 flex flex-col justify-center text-center">
            <h1 className="text-3xl font-semibold">{item?.Category}</h1>
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

  const inner =
    layoutVariant === "gradient" ? (
      <div className="orangeGradient mt-1 w-full">
        <div className="bg-white">{content}</div>
      </div>
    ) : layoutVariant === "plain-nested" ? (
      <div className="mt-1 w-full">
        <div>{content}</div>
      </div>
    ) : (
      <div className="mt-1 w-full">{content}</div>
    );

  return (
    <div className="bg-white">
      <div className={`content pt-[72px] ${isMenuOpen ? "blur" : ""}`}>
        <PageBanner
          bannerSrc={bannerSrc}
          currentPage={displayTitle}
          title={displayTitle}
          subtitle={displaySubtitle}
        />
        <div className="mb-20 flex justify-center">{inner}</div>
      </div>
    </div>
  );
}
