import MatchingDetailsClient from "./MatchingDetailsClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/kundali-matching`;

export const metadata = {
  title: "Kundli Matching for Marriage – Free Guna Milan Tool",
  description:
    "Use AstroCall's free kundli matching tool for marriage. Match horoscopes of bride and groom by Vedic Guna Milan and get insights on compatibility and married life.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Kundli Matching for Marriage – Free Guna Milan Tool",
    description:
      "Use AstroCall's free kundli matching tool for marriage. Match horoscopes of bride and groom by Vedic Guna Milan and get insights on compatibility and married life.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kundli Matching for Marriage – Free Guna Milan Tool",
    description:
      "Use AstroCall's free kundli matching tool for marriage. Match horoscopes of bride and groom by Vedic Guna Milan and get insights on compatibility and married life.",
  },
};

const kundaliMatchingSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free Kundali Matching — AstroCall",
      url: CANONICAL,
      applicationCategory: "AstrologyApplication",
      operatingSystem: "Web Browser",
      description:
        "Free Kundali Matching (Kundali Milan) for marriage compatibility. Check Ashtakoot Guna Milan score, Mangal Dosha, and compatibility report for boy & girl.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      provider: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Kundali Matching?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kundali Matching (also called Kundali Milan or Horoscope Matching) is a Vedic astrology method that assesses marriage compatibility between two individuals using Ashtakoot Gun Milan scoring.",
          },
        },
        {
          "@type": "Question",
          name: "How many Gunas are needed for a good match?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "In Ashtakoot Milan, a score of 18 out of 36 is considered the minimum acceptable match. A score of 24 or above is considered a good match for marriage.",
          },
        },
        {
          "@type": "Question",
          name: "Is Kundali Matching free on AstroCall?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, AstroCall provides free Kundali Matching. Enter birth details of both individuals to get an instant compatibility report.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Kundali Matching", item: CANONICAL },
      ],
    },
  ],
};

export default function MatchingDetailsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kundaliMatchingSchema) }}
      />
      <MatchingDetailsClient />
    </>
  );
}
