import Link from "next/link";
import HomePageClient from "./HomePageClient";

export const revalidate = 3600;

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/`;
const OG_IMAGE = `${SITE}/images/astrocall-og-image.jpg`;

const TITLE = "Talk to India's Best Astrologers Online | Free Kundli & Horoscope";
const DESCRIPTION =
  "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, kundali matching, and predictions for love, career, marriage & finance via chat or call — 24/7.";
const KEYWORDS =
  "talk to astrologer online, best astrologers India, free kundli, daily horoscope, kundali matching, vedic astrology, chat with astrologer, astrology consultation, online puja";

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
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: CANONICAL,
      name: TITLE,
      description: DESCRIPTION,
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
        <h1>Talk to India&apos;s Best Astrologers Online — Free Kundli &amp; Daily Horoscope</h1>
        <p>
          Consult verified astrologers via chat or call. Free kundli, daily horoscope, kundali matching,
          online puja, gemstones, and expert astrology guidance — available 24/7 across India.
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
