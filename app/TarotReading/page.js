import TarotReadingClient from "./TarotReadingClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/TarotReading`;

export const metadata = {
  title: "Tarot Reading Online – Accurate Tarot Predictions",
  description:
    "Get a personalised tarot reading on AstroCall. Talk to expert tarot readers online for clarity on love, relationships, career, finances and important life choices.",
  keywords:
    "tarot reading, tarot cards, tarot reader, tarot reading online, tarot card reading, tarot predictions, tarot guidance",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Tarot Reading Online – Accurate Tarot Predictions",
    description:
      "Get a personalised tarot reading on AstroCall. Talk to expert tarot readers online for clarity on love, relationships, career, finances and important life choices.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarot Reading Online – Accurate Tarot Predictions",
    description:
      "Get a personalised tarot reading on AstroCall. Talk to expert tarot readers online for clarity on love, relationships, career, finances and important life choices.",
  },
};

export default function TarotReadingPage() {
  return <TarotReadingClient />;
}
