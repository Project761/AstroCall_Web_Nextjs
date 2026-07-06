"use client";

import { useEffect, useCallback } from "react";
import LazyInView from "./components/LazyInView";
import { useMenuContext } from "./hooks/useMenuContext";
import HeroBanner from "./components/HeroBanner";
import IconsBar from "./components/topIconbar";
import PromoBanners from "./components/PromoBanners";
import StickyMobileBar from "./components/StickyMobileBar";
import ScrollToTop from "./components/ScrollToTop";
import { CitySection, ZodiacSection, PopularSearchSection, AppDownloadBlock } from "./components/HomeSections";
import { CREAM } from "./lib/siteTheme";
import HomeOnlinepuja from "./components/onlinePuja";
import CustomersFeedback from "./components/reviews";
import AstrologySection from "./components/AstrologySection";
import CommonAstrologicalServices from "./components/CommonAstrologicalServices";
import AstrocallHomepage from "./components/AstrocallHomepage";
import Astrologers from "./components/astrologers";
import WhyAstrocall from "./components/whyAstrocall";
import HomeFAQ from "./components/FAQ";
import HomeReelsSection from "./components/HomeReelsSection";
import HomeBlogCompact from "./components/HomeBlogCompact";

export default function HomePageClient() {
  const { isMenuOpen, setLanguageStatus, setAstroNameHomePageCall, setAstroNameHomePage, settwominchatpopup } = useMenuContext();

  const clearSessionStorage = useCallback(() => {
    ["category", "AstroLoginId", "activeMenu", "MuhuratID", "VratUpvaasID", "OnlineStatus", "HoroscopeName", "AstroIDCallChat", "PujaID", "GemstoneID", "AddressLocationID", "WalletPackageID"]
      .forEach((k) => sessionStorage.removeItem(k));
  }, []);

  const initializeContext = useCallback(() => {
    setLanguageStatus(true);
    setAstroNameHomePageCall("");
    settwominchatpopup(false);
    setAstroNameHomePage("");
  }, [setLanguageStatus, setAstroNameHomePageCall, settwominchatpopup, setAstroNameHomePage]);

  useEffect(() => {
    clearSessionStorage();
    initializeContext();
  }, [clearSessionStorage, initializeContext]);

  return (
    <div className="homepage-v2 overflow-x-hidden bg-white">
      <div className={`content mt-[72px] pb-[72px] lg:pb-0 ${isMenuOpen ? "blur-sm" : ""}`}>
        <HeroBanner />
        {/* <HomeStatsStrip /> */}

        {/* Services */}
        <section className="py-6">
          <div className="main-container">
            <IconsBar />
          </div>
        </section>
        {/* Top Astrologers + Offer Banner */}
        <section className="bg-white py-6 md:py-8">
          <div className="main-container overflow-hidden">
            <LazyInView fallback={null}>
              <Astrologers />
            </LazyInView>
          </div>
        </section>

        {/* Trust */}
        <WhyAstrocall />


        <section className="py-6 sm:py-8 md:py-10" style={{ backgroundColor: CREAM }}>
          <div className="main-container">
            <AstrocallHomepage variant="home-v2" />
          </div>
        </section>

        <PromoBanners />
        <CommonAstrologicalServices />

        <LazyInView fallback={null}>
          <HomeReelsSection variant="grid" />
        </LazyInView>

        <LazyInView fallback={null}>
          <HomeBlogCompact variant="grid" />
        </LazyInView>

        <LazyInView fallback={null}>
          <HomeOnlinepuja />
        </LazyInView>

        <LazyInView>
          <CustomersFeedback />
        </LazyInView>

        <CitySection />
        <ZodiacSection />
        <PopularSearchSection />
        <AppDownloadBlock />
        <AstrologySection />

        <LazyInView fallback={null}><HomeFAQ variant="home-v2" /></LazyInView>
      </div>
      <StickyMobileBar />
      <ScrollToTop />
    </div>
  );
}
