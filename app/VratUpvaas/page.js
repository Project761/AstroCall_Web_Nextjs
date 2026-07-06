import VratUpvaasClient from "./VratUpvaasClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/VratUpvaas`;

export const metadata = {
  title: "Vrat & Upvaas (Fasts) 2025 | Hindu Religious Fasting Guide | AstroCall",
  description:
    "Learn about important Hindu Vrats and Upvaas (fasts) in 2025. Get dates, significance, and spiritual benefits of various religious fasts from certified astrologers on AstroCall Live.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Vrat & Upvaas (Fasts) 2025 | Hindu Religious Fasting Guide | AstroCall",
    description:
      "Learn about important Hindu Vrats and Upvaas (fasts) in 2025. Get dates, significance, and spiritual benefits of various religious fasts from certified astrologers on AstroCall Live.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vrat & Upvaas (Fasts) 2025 | Hindu Religious Fasting Guide | AstroCall",
    description:
      "Learn about important Hindu Vrats and Upvaas (fasts) in 2025. Get dates, significance, and spiritual benefits of various religious fasts from certified astrologers on AstroCall Live.",
  },
};

const vratUpvaasSchema = {
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
          name: "Vrat & Upvaas",
          item: CANONICAL,
        },
      ],
    },
    {
      "@type": "WebPage",
      name: "Vrat & Upvaas",
      url: CANONICAL,
    },
  ],
};

export default function VratUpvaasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vratUpvaasSchema) }}
      />
      <VratUpvaasClient />
    </>
  );
}
