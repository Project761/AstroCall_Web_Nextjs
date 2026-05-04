"use client";
import { useEffect, Suspense, lazy } from "react";
import SEO from "./components/SEO/page";
import IconsBar from "./components/topIconbar/page";
import CommonAstrologicalServices from "./components/CommonAstrologicalServices/page";
import LazyInView from "./components/LazyInView/page";
import Carousel from "./components/carousel/page";
import { useMenuContext } from "./hooks/useMenuContext";
// Lazy loaded components
const Astrologers = lazy(() => import("./components/astrologers/page"));
const AstrocallHomepage = lazy(() => import("./components/AstrocallHomepage/page"));
const CustomersFeedback = lazy(() => import("./components/reviews/page"));
const CelebritiesReview = lazy(() => import("./components/celebritiesReviews/page"));
const HomeOnlinepuja = lazy(() => import("./components/onlinePuja/page"));
const ZodiacGrid = lazy(() => import("./components/zodiacgrid/page"));
const WhyAstrocall = lazy(() => import("./components/whyAstrocall/page"));
const BlogSection = lazy(() => import("./components/blog/page"));
const AstrologyStats = lazy(() => import("./components/AstrologyStats/page"));
const AstrologySection = lazy(() => import("./components/AstrologySection/page"));
const HomeFAQ = lazy(() => import("./components/FAQ/page"));
const SupportSection = lazy(() => import("./components/SupportSection/page"));
const Footer = lazy(() => import("./components/Footer/page"));
function HomepageContent() {
    const { isMenuOpen, setLanguageStatus, setAstroNameHomePageCall, setAstroNameHomePage, settwominchatpopup } = useMenuContext();
    useEffect(() => {
        sessionStorage.removeItem("category");
        sessionStorage.removeItem("AstroLoginId");
        sessionStorage.removeItem("activeMenu");
        sessionStorage.removeItem("MuhuratID");
        sessionStorage.removeItem("VratUpvaasID");
        sessionStorage.removeItem("OnlineStatus");
        sessionStorage.removeItem("HoroscopeName");
        sessionStorage.removeItem("AstroIDCallChat");
        sessionStorage.removeItem("PujaID");
        sessionStorage.removeItem("GemstoneID");
        sessionStorage.removeItem("AddressLocationID");
        sessionStorage.removeItem("WalletPackageID");
        setLanguageStatus(true);
        setAstroNameHomePageCall('');
        settwominchatpopup(false);
        setAstroNameHomePage('');
    }, [setLanguageStatus, setAstroNameHomePageCall, settwominchatpopup, setAstroNameHomePage]);
    const schema = {
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
    };
    return (<div className="homepage-root">
      <SEO title="AstroCall - Talk to India's Best Astrologers Online Now" description="Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call." canonical="https://astrocall.live/" type="website" schema={schema}/>

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

          <LazyInView fallback={<div className="min-h-[520px]"></div>}>
            <Suspense fallback={<div className="min-h-[520px]"></div>}>
              <AstrocallHomepage />
            </Suspense>
          </LazyInView>
        </div>

        <div className="services bg-[#F973160D] orangeLight pb-10 p-2 relative" style={{ minHeight: "549px" }}>
          <div className="absolute bottom-[0] right-[-90px] right-image">
            <img src="/images/customar-before.webp" alt="" loading="lazy" decoding="async" fetchPriority="low"/>
          </div>
          <CommonAstrologicalServices />
        </div>

        <LazyInView fallback={<div className="min-h-[200px]"></div>}>
          <Suspense fallback={<div className="min-h-[200px]"></div>}>
            <AstrologyStats />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[200px]"></div>}>
          <Suspense fallback={<div className="min-h-[200px]"></div>}>
            <WhyAstrocall />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[300px]"></div>}>
          <Suspense fallback={<div className="min-h-[300px]"></div>}>
            <ZodiacGrid />
          </Suspense>
        </LazyInView>

        <div className="bg-[#FFF6F0] py-8 relative">
          <div className="absolute bottom-[0] right-[-100px] right-image">
            <img src="/images/customar-before.webp" alt="" loading="lazy" decoding="async" fetchPriority="low"/>
          </div>
          <LazyInView fallback={<div className="min-h-[400px]"></div>}>
            <Suspense fallback={<div className="min-h-[400px]"></div>}>
              <Astrologers />
            </Suspense>
          </LazyInView>
        </div>

        <div className="bg-[#FECEAD] relative">
          <div className="absolute bottom-0 right-[-100px] right-image">
            <img src="/images/customar-before.webp" alt="" loading="lazy" decoding="async" fetchPriority="low"/>
          </div>
          <LazyInView fallback={<div className="min-h-[300px]"></div>}>
            <Suspense fallback={<div className="min-h-[300px]"></div>}>
              <HomeOnlinepuja />
            </Suspense>
          </LazyInView>
        </div>

        <LazyInView fallback={<div className="min-h-[300px]"></div>}>
          <Suspense fallback={<div className="min-h-[300px]"></div>}>
            <CustomersFeedback />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[300px]"></div>}>
          <Suspense fallback={<div className="min-h-[300px]"></div>}>
            <CelebritiesReview />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[300px]"></div>}>
          <Suspense fallback={<div className="min-h-[300px]"></div>}>
            <BlogSection />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[300px]"></div>}>
          <Suspense fallback={<div className="min-h-[300px]"></div>}>
            <AstrologySection />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[300px]"></div>}>
          <Suspense fallback={<div className="min-h-[300px]"></div>}>
            <HomeFAQ />
          </Suspense>
        </LazyInView>

        <LazyInView fallback={<div className="min-h-[200px]"></div>}>
          <Suspense fallback={<div className="min-h-[200px]"></div>}>
            <SupportSection />
          </Suspense>
        </LazyInView>
      </div>

 
    </div>);
}
export default function Home() {
    return <HomepageContent />;
}
