"use client";

import { useEffect, useRef } from "react";
import { logRender } from "@/app/lib/performance";

/** Dev-only render counter — pass name="Header" etc. */
export default function PerfRenderMark({ name, children }) {
  const count = useRef(0);
  count.current += 1;

  useEffect(() => {
    logRender(name);
  });

  return children;
}
