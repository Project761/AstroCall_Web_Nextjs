import VedicAstrologyClient from "./VedicAstrologyClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/VedicAstrology`;

export const metadata = {
  title: "Vedic Astrology Services - Birth Chart & Predictions",
  description:
    "Consult Vedic astrologers on AstroCall for detailed birth chart analysis, life predictions, remedies and guidance on love, career, marriage and finance.",
  keywords:
    "vedic astrology, jyotish, birth chart, kundli, vedic astrology services, indian astrology, hindu astrology, planetary positions, life predictions",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Vedic Astrology Services - Birth Chart & Predictions",
    description:
      "Consult Vedic astrologers on AstroCall for detailed birth chart analysis, life predictions, remedies and guidance on love, career, marriage and finance.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedic Astrology Services - Birth Chart & Predictions",
    description:
      "Consult Vedic astrologers on AstroCall for detailed birth chart analysis, life predictions, remedies and guidance on love, career, marriage and finance.",
  },
};

export default function VedicAstrologyPage() {
  return <VedicAstrologyClient />;
}
