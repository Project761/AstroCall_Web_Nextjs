"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { MenuContext } from "@/app/context/MenuContext";
import { postWithToken } from "@/app/utils/api";
import { OrbitProgress } from "react-loading-indicators";
import DOMPurify from "dompurify";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

export default function VratUpvaasClient() {
  const { VratUpvaasData } = useContext(MenuContext);
  const storedVratId =
    typeof window !== "undefined" ? sessionStorage.getItem("VratUpvaasID") || "" : "";

  const defaultSelection = useMemo(() => {
    if (!VratUpvaasData?.length) return { id: "", tab: "" };

    const match = VratUpvaasData.find((item) => item?.VratUpvaasID == storedVratId);
    const initial = match || VratUpvaasData[0];

    return {
      id: String(initial?.VratUpvaasID ?? ""),
      tab: initial?.Description ?? "",
    };
  }, [VratUpvaasData, storedVratId]);

  const [activeTabOverride, setActiveTabOverride] = useState(null);
  const [vratIdOverride, setVratIdOverride] = useState(null);
  const [DescriptionDocData, setDescriptionDocData] = useState("");

  const effectiveActiveTab = activeTabOverride ?? defaultSelection.tab;
  const effectiveVratId = vratIdOverride ?? defaultSelection.id;

  useEffect(() => {
    if (!effectiveVratId) return;

    let cancelled = false;
    const val = { IsActive: "1", VratUpvaasID: effectiveVratId };

    postWithToken("VratUpvaasMain/GetData_VratUpvaas", val)
      .then((res) => {
        if (!cancelled) setDescriptionDocData(res?.length > 0 ? res : []);
      })
      .catch((error) => {
        console.log(error, "error");
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveVratId]);

  return (
    <>
      <div className="bg-[#F973160D] pt-[72px]">
        <PageBanner
          bannerSrc={PAGE_BANNER_IMAGES.horoscope}
          currentPage="Vrat & Upvaas"
          title="Vrat & Upvaas 2025"
          subtitle="Discover important Hindu Vrats and Upvaas (fasts) for 2025. Know their dates, significance, and spiritual benefits based on Vedic calendar and astrology."
        />

        <div className="main-container px-3 py-4 text-left sm:px-4 sm:py-5 md:py-6">
          {!VratUpvaasData?.length ? (
            <div className="flex justify-center py-20">
              <OrbitProgress color="#FF5C00" size="large" />
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
                {VratUpvaasData.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setActiveTabOverride(tab?.Description);
                      setVratIdOverride(String(tab?.VratUpvaasID));
                      sessionStorage.setItem("VratUpvaasID", tab?.VratUpvaasID);
                    }}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                      effectiveActiveTab === tab?.Description
                        ? "border-transparent bg-[#FF5C00] text-white shadow-md"
                        : "border-orange-100 bg-white text-gray-700 hover:border-orange-200"
                    }`}
                  >
                    {tab?.Description}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
                {DescriptionDocData?.length > 0 ? (
                  DescriptionDocData.map((item, index) => (
                    <div key={index} className="paragraph">
                      <div
                        className="text-justify leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item?.VratUpvaashtml || ""),
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Loading content...</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
