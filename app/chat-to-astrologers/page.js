import ChatToAstrologersClient from "./ChatToAstrologersClient";
import ServicePageHero from "../components/ServicePageHero";
import { CHAT_HERO } from "../lib/pageHeroConfigs";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/chat-to-astrologers`;

export const metadata = {
  title: "Chat with Expert Astrologers Online | AstroCall Live",
  description:
    "Chat with certified astrologers online anytime on AstroCall Live. Get instant astrology guidance on love, career, finance, and health from trusted Jyotish experts.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Chat with Expert Astrologers Online | AstroCall Live",
    description:
      "Chat with certified astrologers online anytime on AstroCall Live. Get instant astrology guidance on love, career, finance, and health from trusted Jyotish experts.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with Expert Astrologers Online | AstroCall Live",
    description:
      "Chat with certified astrologers online anytime on AstroCall Live. Get instant astrology guidance on love, career, finance, and health from trusted Jyotish experts.",
  },
};

const chatSchema = {
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
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Chat to Astrologer",
          item: `${SITE}/chat-to-astrologers`,
        },
      ],
    },
    {
      "@type": "Service",
      serviceType: "Astrology Chat Consultation",
      provider: { "@type": "Organization", name: "AstroCall", url: `${SITE}/` },
    },
  ],
};

export default function ChatToAstrologersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(chatSchema) }} />
      {/* <ServicePageHero {...CHAT_HERO} /> */}
      <ChatToAstrologersClient />
    </>
  );
}
