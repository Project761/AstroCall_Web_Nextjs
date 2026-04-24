"use client";

import { useState, useEffect } from "react";
import LazyLoadImage from "../LazyLoadImage/page";
import { getData } from "../../utils/api";
import { GooglePlayButton, AppStoreButton } from "../AppButtons/AppStoreButtons";

// ✅ Safe localStorage reader
function readCarouselCache() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem("carouselImages");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ✅ Safe image URL formatter
const getImageUrl = (url) => {
  if (!url) return "";
  return "https://" + url.replace(/\\/g, "/");
};

export default function Carousel() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // ✅ Fix hydration
  useEffect(() => {
    setIsClient(true);

    const cached = readCarouselCache();
    if (cached.length) {
      setImages(cached);
    }
  }, []);

  // ✅ API call
  useEffect(() => {
    Get_Data_WebHomePagesliders();
  }, []);

  // ✅ Auto slide
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  // ✅ Preload first image (LCP boost)
  useEffect(() => {
    if (!isClient || !images[0]?.imagesurl) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = getImageUrl(images[0].imagesurl);
    link.setAttribute("fetchpriority", "high");

    document.head.appendChild(link);

    return () => link.remove();
  }, [images, isClient]);

  const Get_Data_WebHomePagesliders = async () => {
    try {
      const res = await getData(
        "HomePagesliders/GetData_WebHomePagesliders",
        { IsActive: "1" }
      );

      if (res) {
        const filtered = res.filter((i) => i.imagesurl);

        setImages(filtered);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "carouselImages",
            JSON.stringify(filtered)
          );
        }
      }
    } catch (err) {
      console.log("API Error:", err);
    }
  };

  const APKUrl =
    "https://play.google.com/store/apps/details?id=app.astrocall.live";
  const IOSUrl = "https://www.apple.com/app-store/";

  // ✅ Prevent hydration mismatch
  if (!isClient) return null;

  return (
    // <div className="relative w-full overflow-hidden">
    //   <div className="relative w-full min-h-[180px] sm:min-h-[240px] md:min-h-[280px]">

    //     {/* Fallback BG */}
    //     {images.length === 0 && (
    //       <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100" />
    //     )}

    //     {images.map((image, index) => (
    //       <div
    //         key={index}
    //         className={`transition-opacity duration-700 ${
    //           index === currentIndex
    //             ? "opacity-100"
    //             : "opacity-0 absolute inset-0"
    //         }`}
    //       >
    //         {index === 0 ? (
    //           <img
    //             src={getImageUrl(image.imagesurl)}
    //             className="w-full object-cover"
    //             alt={`Slide ${index + 1}`}
    //             loading="eager"
    //             fetchPriority="high"
    //           />
    //         ) : (
    //           <LazyLoadImage
    //             src={getImageUrl(image.imagesurl)}
    //             className="w-full object-cover"
    //             alt={`Slide ${index + 1}`}
    //             effect="blur"
    //           />
    //         )}

    //         {/* Text Overlay */}
    //         <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-center px-4 md:px-10 text-center md:text-left">
    //           <h1 className="text-white md:text-black font-bold text-sm sm:text-lg md:text-2xl lg:text-3xl drop-shadow">
    //             Talk to India's Best Astrologers Online – Kundali, Horoscope & Consultation
    //           </h1>

    //           {/* Desktop Buttons */}
    //           <div className="hidden md:flex flex-col gap-3 ml-auto">
    //             <AppStoreButton url={IOSUrl} theme="dark" />
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Mobile Buttons */}
    //   <div className="flex md:hidden justify-center py-3 gap-3">
    //     <GooglePlayButton url={APKUrl} theme="dark" />
    //     <AppStoreButton url={IOSUrl} theme="dark" />
    //   </div>
    // </div>

    <div className="main-container relative w-full overflow-hidden">
      <div className="relative w-full h-auto min-h-[180px] sm:min-h-[240px] md:min-h-[280px]">
        {images?.length === 0 && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
          // aria-hidden
          />
        )}
        {images?.map((image, index) => (
          <div
            key={index}
            className={`transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
            data-carousel-item
          >
            {index === 0 ? (
              <img
                src={`https://${image?.imagesurl?.replace(/\\/g, "/")}`}
                className="w-full h-auto object-contain sm:object-cover"
                alt={`Slide ${index + 1}`}
                width={1200}
                height={500}
                sizes="100vw"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              <LazyLoadImage
                src={`https://${image?.imagesurl?.replace(/\\/g, "/")}`}
                className="w-full h-auto object-contain sm:object-cover"
                alt={`Slide ${index + 1}`}
                effect="blur"
                loading="lazy"
                decoding="async"
                width={1200}
                height={500}
              />
            )}

            {/* Headline + store buttons: mobile = compact, bottom-weighted, light text on banner */}
            <div className="absolute inset-0 flex flex-col md:flex-row justify-end md:justify-between items-center gap-1.5 md:gap-0 px-3 sm:px-5 md:px-8 lg:px-14 pb-2 sm:pb-3 md:pb-0 pt-6 sm:pt-8 md:pt-0 pointer-events-none">
              <div
                className="hidden md:block w-[38%] lg:w-[40%] shrink-0"
                aria-hidden
              />

              <div className="flex w-full shrink-0 justify-center md:min-w-0 md:flex-1 md:items-center px-1 sm:px-2">
                <h1 className="mx-auto w-full max-w-[min(100%,18.5rem)] text-center font-serif text-balance text-white sm:max-w-[min(100%,22rem)] md:max-w-[500px] lg:max-w-[34rem] md:text-black [text-shadow:0_1px_3px_rgba(0,0,0,0.45)] md:[text-shadow:none] md:drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]">
                  <span className="block text-[0.7rem] leading-snug font-bold tracking-tight sm:text-xs md:inline md:text-xl lg:text-2xl xl:text-[1.75rem] md:font-[700] md:leading-tight">
                    Talk to India&apos;s Best Astrologers Online
                  </span>
                  <span className="mt-0.5 block text-[0.65rem] leading-snug font-medium text-white/95 sm:text-xs md:mt-0 md:ml-1 md:inline md:font-[700] md:text-xl lg:text-2xl xl:text-[1.75rem] md:leading-tight md:text-black">
                    – Kundali, Horoscope &amp; Consultation
                  </span>
                </h1>
              </div>

              <div className="hidden md:flex flex-col gap-3 items-end pointer-events-auto shrink-0">
                {/* <div className="scale-[0.75] lg:scale-90 origin-right">
                  <GooglePlayButton
                    url={APKUrl}
                    theme="dark"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-lg text-xs"
                  />
                </div> */}

                <div className="scale-[0.75] lg:scale-90 origin-right">
                  <AppStoreButton
                    url={IOSUrl}
                    theme="dark"
                    className="transition-all duration-300 hover:scale-105 hover:shadow-lg "
                  />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Mobile Buttons - Below Banner */}
      <div className="flex md:hidden flex-row items-center justify-center py-3">
        <div className="scale-[0.60] sm:scale-[0.65]">
          <GooglePlayButton
            url={APKUrl}
            theme="dark"
            className="custom-style transition-all duration-300 hover:scale-105 hover:shadow-lg text-xs"
          />
        </div>
        <div className="scale-[0.60] sm:scale-[0.65]">
          <AppStoreButton
            url={IOSUrl}
            theme="dark"
            className="custom-style transition-all duration-300 hover:scale-105 hover:shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}