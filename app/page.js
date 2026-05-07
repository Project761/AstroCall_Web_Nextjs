"use client";
import { useEffect, lazy, useMemo, useCallback } from "react";
import SEO from "./components/SEO/page";
import IconsBar from "./components/topIconbar/page";
import CommonAstrologicalServices from "./components/CommonAstrologicalServices/page";
import LazyInView from "./components/LazyInView/page";
import Carousel from "./components/carousel/page";
import { useMenuContext } from "./hooks/useMenuContext";
import Image from "next/image";
import Head from "next/head";
// Critical above-the-fold components - load immediately
import AstrocallHomepage from "./components/AstrocallHomepage/page";
import AstrologyStats from "./components/AstrologyStats/page";
import WhyAstrocall from "./components/whyAstrocall/page";

// Below-the-fold components - lazy load for performance
const Astrologers = lazy(() => import("./components/astrologers/page"));
const CustomersFeedback = lazy(() => import("./components/reviews/page"));
const CelebritiesReview = lazy(() => import("./components/celebritiesReviews/page"));
const HomeOnlinepuja = lazy(() => import("./components/onlinePuja/page"));
const ZodiacGrid = lazy(() => import("./components/zodiacgrid/page"));
const BlogSection = lazy(() => import("./components/blog/page"));
const AstrologySection = lazy(() => import("./components/AstrologySection/page"));
const HomeFAQ = lazy(() => import("./components/FAQ/page"));
const SupportSection = lazy(() => import("./components/SupportSection/page"));
const Footer = lazy(() => import("./components/Footer/page"));


function HomepageContent() {
  const { isMenuOpen, setLanguageStatus, setAstroNameHomePageCall, setAstroNameHomePage, settwominchatpopup } = useMenuContext();

  // Memoize sessionStorage cleanup function
  const clearSessionStorage = useCallback(() => {
    const keysToRemove = [
      "category", "AstroLoginId", "activeMenu", "MuhuratID",
      "VratUpvaasID", "OnlineStatus", "HoroscopeName", "AstroIDCallChat",
      "PujaID", "GemstoneID", "AddressLocationID", "WalletPackageID"
    ];
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }, []);

  // Memoize context setters
  const initializeContext = useCallback(() => {
    setLanguageStatus(true);
    setAstroNameHomePageCall('');
    settwominchatpopup(false);
    setAstroNameHomePage('');
  }, [setLanguageStatus, setAstroNameHomePageCall, settwominchatpopup, setAstroNameHomePage]);

  useEffect(() => {
    clearSessionStorage();
    initializeContext();
  }, [clearSessionStorage, initializeContext]);
  // Memoize schema data to prevent re-creation
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://astrocall.live/#organization",
        "name": "AstroCall",
        "url": "https://astrocall.live/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://astrocall.live/logo.png"
        },
        "description": "India's Most Trusted Astrology Platform. Connect with certified astrologers 24/7 via call or chat. Free Kundli, Daily Horoscope, Kundali Matching & more.",
        "foundingLocation": { "@type": "Place", "name": "India" },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "url": "https://astrocall.live/contact",
          "availableLanguage": ["English", "Hindi"]
        },
        "sameAs": [
          "https://www.facebook.com/astrocall.live",
          "https://www.instagram.com/astrocall.live",
          "https://twitter.com/astrocall_live"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://astrocall.live/#website",
        "url": "https://astrocall.live/",
        "name": "AstroCall — Talk to India's Best Astrologers Online",
        "publisher": { "@id": "https://astrocall.live/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://astrocall.live/talk-to-astrologers?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://astrocall.live/#webpage",
        "url": "https://astrocall.live/",
        "name": "AstroCall — Talk to India's Best Astrologers Online | Free Kundli & Daily Horoscope",
        "description": "Connect instantly with certified astrologers on AstroCall. Accurate predictions, Free Kundli, Daily Horoscope, Kundali Matching & online Pujas — 24/7.",
        "isPartOf": { "@id": "https://astrocall.live/#website" },
        "about": { "@id": "https://astrocall.live/#organization" },
        "inLanguage": "en-IN"
      }
    ]
  }), []);
  return (<div className="homepage-root">
    <Head>
      <link rel="preload" href="/images/logo1.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/logo.png" as="image" type="image/png" />
      <link rel="preload" href="/images/customar-before.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/iconbar-2.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/iconbar-3.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/iconbar-4.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/iconbar-5.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/iconbar-7.webp" as="image" type="image/webp" />
      <link rel="preload" href="/images/kundli.webp" as="image" type="image/webp" />
      {/* Preload critical pages */}
      <link rel="prefetch" href="/talk-to-astrologers" />
      <link rel="prefetch" href="/chat-to-astrologers" />
      <link rel="prefetch" href="/freekundli" />
      <link rel="prefetch" href="/kundali-matching" />
      <link rel="prefetch" href="/daily-horoscope" />
      <link rel="prefetch" href="/astrology-blog" />
    </Head>
    <SEO
      title="AstroCall - Talk to India's Best Astrologers Online Now"
      description="Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call."
      canonical="https://astrocall.live/"
      type="website"
      schema={schema}
      keywords="astrology, online astrologers, free kundli, daily horoscope, kundali matching, vedic astrology, talk to astrologer, astrology consultation, horoscope prediction, online puja"
      author="AstroCall"
      image="https://astrocall.live/images/astrocall-og-image.jpg"
    />

    <div className={`content mt-16 ${isMenuOpen ? "blur" : ""}`}>
      <div className="bg-[#ffff]">
        <div className="main-orangeGradient py-2 text-center relative overflow-hidden">
          <Carousel />
        </div>

        <div className="relative px-4 -mt-[12px]">
          <div className="bg-white rounded-xl shadow__md__lists max-w-7xl mx-auto">
            <IconsBar />
          </div>
        </div>

        {/* Critical above-the-fold content - load immediately */}
        <AstrocallHomepage />
      </div>

      <div className="services bg-[#F973160D] orangeLight pb-10 p-2 relative" style={{ minHeight: "549px" }}>
        <div className="absolute bottom-[0] right-[-90px] right-image" style={{ width: '300px', height: '200px' }}>
          <Image 
            src="/images/customar-before.webp" 
            alt="" 
            width={300} 
            height={200}
            loading="eager" 
            decoding="async"
            fetchPriority="high"
            priority={true}
            className="object-cover"
            style={{ position: 'absolute', bottom: 0, right: '-90px' }}
          />
        </div>
        <CommonAstrologicalServices />
      </div>

      {/* Critical stats section - load immediately */}
      <AstrologyStats />

      {/* Critical why section - load immediately */}
      <WhyAstrocall />

      {/* Below-the-fold content - lazy load with smooth transitions */}
      <LazyInView fallback={null}>
        <ZodiacGrid />
      </LazyInView>

      <div className="bg-[#FFF6F0] py-8 relative" style={{ minHeight: '400px' }}>
        <div className="absolute bottom-[0] right-[-100px] right-image" style={{ width: '300px', height: '200px' }}>
          <Image 
            src="/images/customar-before.webp" 
            alt="" 
            width={300} 
            height={200}
            loading="eager" 
            decoding="async"
            fetchPriority="high"
            priority={true}
            className="object-cover"
            style={{ position: 'absolute', bottom: 0, right: '-100px' }}
          />
        </div>
        <LazyInView fallback={null}>
          <Astrologers />
        </LazyInView>
      </div>

      <div className="bg-[#FECEAD] relative py-10" style={{ minHeight: '400px' }}>
        <div className="absolute bottom-0 right-[-100px] right-image" style={{ width: '300px', height: '200px' }}>
          <Image 
            src="/images/customar-before.webp" 
            alt="" 
            width={300} 
            height={200}
            loading="eager" 
            decoding="async"
            fetchPriority="high"
            priority={true}
            className="object-cover"
            style={{ position: 'absolute', bottom: 0, right: '-100px' }}
          />
        </div>
        <LazyInView fallback={null}>
          <HomeOnlinepuja />
        </LazyInView>
      </div>

      <LazyInView fallback={null}>
        <CustomersFeedback />
      </LazyInView>

      <LazyInView fallback={null}>
        <CelebritiesReview />
      </LazyInView>

      <LazyInView fallback={null}>
        <BlogSection />
      </LazyInView>

      <LazyInView fallback={null}>
        <AstrologySection />
      </LazyInView>

      <LazyInView fallback={null}>
        <HomeFAQ />
      </LazyInView>

      <LazyInView fallback={null}>
        <SupportSection />
      </LazyInView>
    </div>


  </div>);
}
export default function Home() {
  return <HomepageContent />;
}
