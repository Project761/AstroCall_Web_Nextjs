import { Suspense } from "react";
import ReelsPageClient from "./ReelsPageClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/reels`;

export const metadata = {
  title: "AstroCall Reels – Astrology Videos & Remedies",
  description: "Watch astrology reels, remedies, tarot, zodiac insights",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "AstroCall Reels – Astrology Videos & Remedies",
    description: "Watch astrology reels, remedies, tarot, zodiac insights",
    url: CANONICAL,
    type: "website", 
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: { 
    card: "summary_large_image",
    title: "AstroCall Reels – Astrology Videos & Remedies",
    description: "Watch astrology reels, remedies, tarot, zodiac insights",
  },
};

export default function ReelsPage() {
  return (
    <Suspense fallback={<div className="main-container py-10 text-center">Loading reels...</div>}>
      <ReelsPageClient />
    </Suspense>
  );
}
