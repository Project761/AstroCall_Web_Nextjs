import PalmReadingClient from "./PalmReadingClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/PalmReading`;

export const metadata = {
  title: "Palm Reading Online – Expert Palm Readers on AstroCall",
  description:
    "Get accurate palm reading online on AstroCall. Talk to expert palm readers for insights on career, love, marriage, health, wealth and your future.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Palm Reading Online – Expert Palm Readers on AstroCall",
    description:
      "Get accurate palm reading online on AstroCall. Talk to expert palm readers for insights on career, love, marriage, health, wealth and your future.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Palm Reading Online – Expert Palm Readers on AstroCall",
    description:
      "Get accurate palm reading online on AstroCall. Talk to expert palm readers for insights on career, love, marriage, health, wealth and your future.",
  },
};

export default function PalmReadingPage() {
  return <PalmReadingClient />;
}
