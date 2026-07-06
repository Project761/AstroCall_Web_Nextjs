import GemstonePageClient from "./GemstonePageClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/gemstone`;

export const metadata = {
  title: "Buy Astrological Gemstones Online – Certified Stones",
  description:
    "Shop certified astrological gemstones on AstroCall Live. Get gemstone recommendations from expert astrologers based on your birth chart for luck, health, and success.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Buy Astrological Gemstones Online – Certified Stones",
    description:
      "Shop certified astrological gemstones on AstroCall Live. Get gemstone recommendations from expert astrologers based on your birth chart for luck, health, and success.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Astrological Gemstones Online – Certified Stones",
    description:
      "Shop certified astrological gemstones on AstroCall Live. Get gemstone recommendations from expert astrologers based on your birth chart for luck, health, and success.",
  },
};

const gemstoneSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "AstroCall",
      url: `${SITE}/`,
      logo: `${SITE}/assets/logo.png`,
    },
    {
      "@type": "WebSite",
      url: `${SITE}/`,
      name: "AstroCall",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Gemstone", item: CANONICAL },
      ],
    },
    {
      "@type": "Product",
      name: "Astrological Gemstones",
      brand: { "@type": "Brand", name: "AstroCall" },
      offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
    },
  ],
};

export default function GemstonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gemstoneSchema) }}
      />
      <GemstonePageClient />
    </>
  );
}
