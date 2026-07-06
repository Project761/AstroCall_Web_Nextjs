"use client";

import LazyInView from "./LazyInView";
import HoroscopeCompact from "./HoroscopeCompact";
import { CREAM } from "@/app/lib/siteTheme";

export default function HomeContentGrid() {
  return (
    <section className="py-10 md:py-12" style={{ backgroundColor: CREAM }}>
      <div className="main-container px-4">
        <div
          className="mx-auto max-w-2xl rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:max-w-3xl"
          style={{ border: "1px solid rgba(241,99,34,0.1)" }}
        >
          <HoroscopeCompact />
        </div>
      </div>
    </section>
  );
}
