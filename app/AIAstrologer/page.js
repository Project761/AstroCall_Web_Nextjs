import AIAstrologerClient from "./AIAstrologerClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/AIAstrologer`;

export const metadata = {
  title: "AI Astrologer – Coming Soon | AstroCall",
  description:
    "AI Astrologer is coming soon on AstroCall. Get accurate predictions, personalized guidance and instant answers powered by AI and Vedic astrology.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "AI Astrologer – Coming Soon | AstroCall",
    description:
      "AI Astrologer is coming soon on AstroCall. Get accurate predictions, personalized guidance and instant answers powered by AI and Vedic astrology.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Astrologer – Coming Soon | AstroCall",
    description:
      "AI Astrologer is coming soon on AstroCall. Get accurate predictions, personalized guidance and instant answers powered by AI and Vedic astrology.",
  },
};

export default function AIAstrologerPage() {
  return <AIAstrologerClient />;
}
