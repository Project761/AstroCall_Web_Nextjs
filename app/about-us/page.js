import AboutUsClient from "./AboutUsClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/about-us`;

export const metadata = {
  title: "About Us — India's Trusted Online Astrology Platform",
  description:
    "Learn about AstroCall — India's trusted astrology platform connecting you with verified astrologers for kundli, horoscope, tarot, gemstones, puja, and personalized life guidance online.",
  keywords:
    "about AstroCall, online astrology India, Vedic astrology platform, talk to astrologer, chat with astrologer, kundli matching, daily horoscope",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "About AstroCall — India's Trusted Online Astrology Platform",
    description:
      "AstroCall connects millions with verified astrologers for authentic Vedic guidance — chat, call, kundli, horoscope, and more.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
    images: [
      {
        url: `${SITE}/images/astrocall-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "About AstroCall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About AstroCall — India's Trusted Online Astrology Platform",
    description:
      "Discover AstroCall's mission to make authentic astrology accessible, affordable, and secure for everyone in India.",
    images: [`${SITE}/images/astrocall-og-image.jpg`],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About AstroCall",
  description:
    "AstroCall is India's trusted online astrology platform offering consultations with verified astrologers.",
  url: CANONICAL,
  mainEntity: {
    "@type": "Organization",
    name: "AstroCall",
    url: SITE,
    logo: `${SITE}/images/logo1.webp`,
    description:
      "Online astrology platform for kundli, horoscope, tarot, gemstones, puja, and expert consultations.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@astrocall.live",
      availableLanguage: ["English", "Hindi"],
    },
  },
};

export default function AboutUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutUsClient />
    </>
  );
}
