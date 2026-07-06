import LoveCalculatorClient from "./LoveCalculatorClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/love-calculator`;

export const metadata = {
  title: "Love Calculator Online – Check Compatibility Score",
  description:
    "Use AstroCall’s free love calculator to check name‑based love compatibility. Get a quick score and basic insights about your relationship potential.",
  keywords:
    "love calculator, love compatibility, relationship calculator, love percentage, compatibility test, love match calculator",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Love Calculator Online – Check Compatibility Score",
    description:
      "Use AstroCall’s free love calculator to check name‑based love compatibility. Get a quick score and basic insights about your relationship potential.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Calculator Online – Check Compatibility Score",
    description:
      "Use AstroCall’s free love calculator to check name‑based love compatibility. Get a quick score and basic insights about your relationship potential.",
  },
};

const loveCalculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Love Calculator — AstroCall",
      url: CANONICAL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web Browser",
      description:
        "Free online love compatibility calculator on AstroCall. Enter two names to instantly calculate your love percentage and compatibility score.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      provider: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Love Calculator", item: CANONICAL },
      ],
    },
  ],
};

export default function LoveCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loveCalculatorSchema) }}
      />
      <LoveCalculatorClient />
    </>
  );
}
