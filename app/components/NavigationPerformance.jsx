"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { dumpPerfSummary, isPerfEnabled, logNavReady } from "@/app/lib/performance";

/** Logs page navigation timing in dev / when NEXT_PUBLIC_PERF_LOG=1 */
export default function NavigationPerformance() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const navStart = useRef(typeof performance !== "undefined" ? performance.now() : 0);

  useEffect(() => {
    if (!isPerfEnabled()) return;

    const start = performance.now();
    navStart.current = start;

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        logNavReady(pathname, start);
      });
    });

    if (prevPath.current !== pathname) {
      console.log(`[PERF:Nav] route ${prevPath.current} → ${pathname}`);
      prevPath.current = pathname;
    }

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    if (!isPerfEnabled()) return;
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        dumpPerfSummary();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
