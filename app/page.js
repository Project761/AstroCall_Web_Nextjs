import Link from "next/link";
import HomePageClient from "./HomePageClient";

export const revalidate = 3600;

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/`;
const OG_IMAGE = `${SITE}/images/astrocall-og-image.jpg`;

const TITLE = "AstroCall - Talk to India's Best Astrologers Online Now";
const DESCRIPTION =
  "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.";
const KEYWORDS =
  "astrology, online astrologers, free kundli, daily horoscope, kundali matching, vedic astrology, talk to astrologer, astrology consultation, horoscope prediction, online puja";

export const metadata = {
  title: {
    absolute: TITLE,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "AstroCall" }],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        alt: "AstroCall - Online Astrology Consultation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "AstroCall",
      url: CANONICAL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/logo.png`,
      },
      description:
        "India's Most Trusted Astrology Platform. Connect with certified astrologers 24/7 via call or chat. Free Kundli, Daily Horoscope, Kundali Matching & more.",
      foundingLocation: { "@type": "Place", name: "India" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${SITE}/support`,
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://www.facebook.com/astrocall.live",
        "https://www.instagram.com/astrocall.live",
        "https://twitter.com/astrocall_live",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: CANONICAL,
      name: "AstroCall — Talk to India's Best Astrologers Online",
      publisher: { "@id": `${SITE}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE}/talk-to-astrologers?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: CANONICAL,
      name: "AstroCall — Talk to India's Best Astrologers Online | Free Kundli & Daily Horoscope",
      description:
        "Connect instantly with certified astrologers on AstroCall. Accurate predictions, Free Kundli, Daily Horoscope, Kundali Matching & online Pujas — 24/7.",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export default async function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      {/* Server-rendered SEO content — always present in view-source */}
      <section className="sr-only" aria-label="AstroCall homepage summary">
        <h1>AstroCall — Talk to India&apos;s Best Astrologers Online</h1>
        <p>
          Consult certified astrologers via chat or call. Free Kundli, daily horoscope, kundali matching,
          online puja, gemstones, and astrology blog.
        </p>
        <nav aria-label="Main services">
          <ul>
            <li><Link href="/chat-to-astrologers">Chat with Astrologers</Link></li>
            <li><Link href="/talk-to-astrologers">Talk to Astrologers</Link></li>
            <li><Link href="/freekundli">Free Kundli</Link></li>
            <li><Link href="/daily-horoscope">Daily Horoscope</Link></li>
            <li><Link href="/kundali-matching">Kundali Matching</Link></li>
            <li><Link href="/online-puja">Online Puja</Link></li>
            <li><Link href="/gemstone">Gemstone Store</Link></li>
          </ul>
        </nav>
      </section>
      <HomePageClient />
    </>
  );
}
