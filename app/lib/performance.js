"use client";

const ENABLED =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_PERF_LOG === "1");

const apiStats = new Map();
const renderStats = new Map();

export function isPerfEnabled() {
  return ENABLED && typeof window !== "undefined";
}

export function logNavReady(pathname, startMs) {
  if (!isPerfEnabled()) return;
  const ms = Math.round(performance.now() - startMs);
  const level = ms > 800 ? "warn" : "log";
  console[level](`[PERF:Nav] ${pathname} → interactive ~${ms}ms`);
}

export function logApiTiming(endpoint, ms, ok = true) {
  if (!isPerfEnabled()) return;
  const key = endpoint.replace(/\?.*$/, "");
  const prev = apiStats.get(key) || { count: 0, total: 0, max: 0 };
  prev.count += 1;
  prev.total += ms;
  prev.max = Math.max(prev.max, ms);
  apiStats.set(key, prev);

  if (ms >= 300) {
    console.warn(`[PERF:API] ${key} ${ms}ms${ok ? "" : " (failed)"}`);
  } else if (ms >= 150) {
    console.log(`[PERF:API] ${key} ${ms}ms`);
  }
}

export function logRender(componentName) {
  if (!isPerfEnabled()) return;
  const n = (renderStats.get(componentName) || 0) + 1;
  renderStats.set(componentName, n);
  if (n <= 3 || n % 10 === 0) {
    console.log(`[PERF:Render] ${componentName} #${n}`);
  }
}

export function dumpPerfSummary() {
  if (!isPerfEnabled()) return;
  const apis = [...apiStats.entries()]
    .map(([name, s]) => ({
      name,
      count: s.count,
      avg: Math.round(s.total / s.count),
      max: s.max,
    }))
    .sort((a, b) => b.max - a.max);

  if (apis.length) {
    console.table(apis);
  }
}

export async function measureApi(label, fn) {
  const start = performance.now();
  try {
    const result = await fn();
    logApiTiming(label, Math.round(performance.now() - start), true);
    return result;
  } catch (err) {
    logApiTiming(label, Math.round(performance.now() - start), false);
    throw err;
  }
}

export function runWhenIdle(fn, timeout = 2000) {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => fn(), { timeout });
  } else {
    setTimeout(fn, 100);
  }
}
