import Link from "next/link";
import { buildPageMetadata } from "./lib/seo";

export const metadata = buildPageMetadata({
  title: "Page Not Found — 404",
  description:
    "The page you are looking for does not exist on AstroCall. Browse our astrology services, free kundli, daily horoscope, or contact support.",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FFF9F1] px-4 pt-[72px] text-center">
      <p className="font-heading text-7xl font-extrabold text-[#FF5C00] sm:text-8xl">404</p>
      <h1 className="font-heading mt-4 text-2xl font-bold text-[#1A1A1A] sm:text-3xl">Page Not Found</h1>
      <p className="font-body mt-3 max-w-md text-sm text-gray-600 sm:text-base">
        Sorry, we couldn&apos;t find that page. It may have been moved or removed.
      </p>
      <nav className="mt-8 flex flex-wrap justify-center gap-3" aria-label="404 helpful links">
        <Link
          href="/"
          className="font-heading rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Go to Homepage
        </Link>
        <Link
          href="/contact"
          className="font-heading rounded-xl border-2 border-[#FF5C00] px-6 py-3 text-sm font-semibold text-[#FF5C00] transition hover:bg-orange-50"
        >
          Contact Support
        </Link>
      </nav>
      <ul className="font-body mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
        <li>
          <Link href="/freekundli" className="hover:text-[#FF5C00]">
            Free Kundli
          </Link>
        </li>
        <li>
          <Link href="/daily-horoscope" className="hover:text-[#FF5C00]">
            Daily Horoscope
          </Link>
        </li>
        <li>
          <Link href="/chat-to-astrologers" className="hover:text-[#FF5C00]">
            Chat with Astrologers
          </Link>
        </li>
        <li>
          <Link href="/talk-to-astrologers" className="hover:text-[#FF5C00]">
            Talk to Astrologers
          </Link>
        </li>
      </ul>
    </main>
  );
}
