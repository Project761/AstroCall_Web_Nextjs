import BasicDetailClient from "./BasicDetailClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/freekundli`;

export const metadata = {
  title: "Free Kundli Online – Generate Janam Kundli Instantly",
  description:
    "Generate your free kundli online on AstroCall. Get an instant Vedic Janam Kundli based on your date, time and place of birth with basic life insights.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Kundli Online – Generate Janam Kundli Instantly",
    description:
      "Generate your free kundli online on AstroCall. Get an instant Vedic Janam Kundli based on your date, time and place of birth with basic life insights.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Kundli Online – Generate Janam Kundli Instantly",
    description:
      "Generate your free kundli online on AstroCall. Get an instant Vedic Janam Kundli based on your date, time and place of birth with basic life insights.",
  },
};

const freeKundliSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free Kundli Generator — AstroCall",
      url: CANONICAL,
      applicationCategory: "AstrologyApplication",
      operatingSystem: "Web Browser",
      description:
        "Generate your free Janam Kundli (birth chart) online by date of birth, time, and place. Get detailed Vedic astrology chart with planetary positions, doshas & yogas.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      provider: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a Kundli?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A Kundli (Janam Kundali) is a Vedic birth chart based on your date, time, and place of birth. It maps planetary positions and predicts key life events.",
          },
        },
        {
          "@type": "Question",
          name: "Is the Kundli on AstroCall free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. AstroCall offers a 100% free Kundli generation tool. Simply enter your birth details to receive an accurate Vedic birth chart instantly.",
          },
        },
        {
          "@type": "Question",
          name: "What details do I need to generate my Kundli?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You need your date of birth, exact time of birth, and place of birth to generate an accurate Janam Kundli on AstroCall.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Free Kundli", item: CANONICAL },
      ],
    },
  ],
};

export default function BasicDetailPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(freeKundliSchema) }}
      />
      <BasicDetailClient />
    </>
  );
}
