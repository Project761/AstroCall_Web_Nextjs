"use client";

import { useEffect, useState } from "react";

/** Render children only after mount — avoids next/dynamic ssr:false bailout in HTML source. */
export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  if (!mounted) return fallback;
  return children;
}
