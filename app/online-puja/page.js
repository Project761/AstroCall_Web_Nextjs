import OnlinePujaPageClient from "./OnlinePujaPageClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/online-puja`;

export const metadata = {
  title: "Book Online Puja & Religious Rituals | AstroCall Live",
  description:
    "Book authentic online Puja services at AstroCall Live. Get personalised Vedic rituals performed by experienced pandits for health, prosperity, and peace of mind.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Book Online Puja & Religious Rituals | AstroCall Live",
    description:
      "Book authentic online Puja services at AstroCall Live. Get personalised Vedic rituals performed by experienced pandits for health, prosperity, and peace of mind.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Online Puja & Religious Rituals | AstroCall Live",
    description:
      "Book authentic online Puja services at AstroCall Live. Get personalised Vedic rituals performed by experienced pandits for health, prosperity, and peace of mind.",
  },
};

const onlinePujaSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Online Religious Puja",
  provider: { "@type": "Organization", name: "AstroCall" },
  "@graph": [
    {
      "@type": "Organization",
      name: "AstroCall",
      url: SITE,
      logo: `${SITE}/assets/logo.png`,
    },
    {
      "@type": "WebSite",
      url: SITE,
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
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Online Pooja", item: CANONICAL },
      ],
    },
  ],
};

export default function OnlinePujaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(onlinePujaSchema) }}
      />
      <OnlinePujaPageClient />
    </>
  );
}
