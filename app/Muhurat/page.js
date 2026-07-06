import MuhuratClient from "./MuhuratClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/Muhurat`;

export const metadata = {
  title: "Auspicious Muhurat Dates & Times 2025 | AstroCall Live",
  description:
    "Find the most auspicious Muhurat for weddings, griha pravesh, business starts, and more on AstroCall Live. Get accurate Vedic Muhurat timings for all important life events.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Auspicious Muhurat Dates & Times 2025 | AstroCall Live",
    description:
      "Find the most auspicious Muhurat for weddings, griha pravesh, business starts, and more on AstroCall Live. Get accurate Vedic Muhurat timings for all important life events.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auspicious Muhurat Dates & Times 2025 | AstroCall Live",
    description:
      "Find the most auspicious Muhurat for weddings, griha pravesh, business starts, and more on AstroCall Live. Get accurate Vedic Muhurat timings for all important life events.",
  },
};

const muhuratSchema = {
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
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shubh Muhurat",
          item: CANONICAL,
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "Shubh Muhurat",
      url: CANONICAL,
    },
  ],
};

export default function MuhuratPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(muhuratSchema) }}
      />
      <MuhuratClient />
    </>
  );
}
