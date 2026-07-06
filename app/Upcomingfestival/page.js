import Upcomingfestival from "@/app/components/upcomingfestival/Upcomingfestival";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/Upcomingfestival`;

export const metadata = {
  title: "Upcoming Hindu Festivals 2025 | Dates & Significance | AstroCall",
  description:
    "Explore upcoming Hindu festivals, vrat dates, and auspicious celebrations for 2025. Know festival timings, significance, and rituals on AstroCall Live.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Upcoming Hindu Festivals 2025 | Dates & Significance | AstroCall",
    description:
      "Explore upcoming Hindu festivals, vrat dates, and auspicious celebrations for 2025. Know festival timings, significance, and rituals on AstroCall Live.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Hindu Festivals 2025 | Dates & Significance | AstroCall",
    description:
      "Explore upcoming Hindu festivals, vrat dates, and auspicious celebrations for 2025. Know festival timings, significance, and rituals on AstroCall Live.",
  },
};

const festivalSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Upcoming Festivals — AstroCall",
      url: CANONICAL,
      description:
        "Explore upcoming Hindu festivals, vrat dates, and auspicious celebrations with dates and significance.",
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Upcoming Festivals", item: CANONICAL },
      ],
    },
  ],
};

export default function UpcomingFestivalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(festivalSchema) }}
      />
      <Upcomingfestival />
    </>
  );
}
