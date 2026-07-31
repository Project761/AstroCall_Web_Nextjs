import ContactClient from "./ContactClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/contact`;

export const metadata = {
  title: "Contact AstroCall Live – Get in Touch | Customer Support",
  description:
    "Contact AstroCall Live for queries, support, or feedback. Reach our customer service team for help with astrology consultations and services.",
  keywords:
    "contact AstroCall, AstroCall support, astrology customer service, AstroCall help, contact astrologer platform",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Contact AstroCall Live – Get in Touch | Customer Support",
    description:
      "Contact AstroCall Live for queries, support, or feedback. Reach our customer service team for help with astrology consultations and services.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
    images: [
      {
        url: `${SITE}/images/astrocall-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact AstroCall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact AstroCall Live – Get in Touch",
    description:
      "Get in touch with AstroCall's support team for help with consultations, payments, and technical issues.",
    images: [`${SITE}/images/astrocall-og-image.jpg`],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      name: "Contact AstroCall",
      url: CANONICAL,
      description:
        "Get in touch with AstroCall's support team for help with consultations, payments, astrologer queries, and technical issues.",
      isPartOf: { "@id": `${SITE}/#website` },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#localbusiness`,
      name: "AstroCall",
      url: SITE,
      description:
        "India's Most Trusted Online Astrology Platform — Talk or Chat with certified astrologers 24/7.",
      image: `${SITE}/images/logo1.webp`,
      priceRange: "₹",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@astrocall.live",
        telephone: "+91-9876543210",
        url: CANONICAL,
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Contact", item: CANONICAL },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
