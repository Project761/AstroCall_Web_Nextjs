import NumerologyClient from "./NumerologyClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/Numerology`;

export const metadata = {
  title: "Numerology Services - Life Path, Name & Compatibility",
  description:
    "Get personalised numerology services on AstroCall. Discover your life path number, name numerology and relationship compatibility with guidance from expert numerologists.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Numerology Services - Life Path, Name & Compatibility",
    description:
      "Get personalised numerology services on AstroCall. Discover your life path number, name numerology and relationship compatibility with guidance from expert numerologists.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Numerology Services - Life Path, Name & Compatibility",
    description:
      "Get personalised numerology services on AstroCall. Discover your life path number, name numerology and relationship compatibility with guidance from expert numerologists.",
  },
};

export default function NumerologyPage() {
  return <NumerologyClient />;
}
