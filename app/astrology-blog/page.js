import BlogClient from "./BlogClient";
import ServicePageHero from "../components/ServicePageHero";
import { BLOG_HERO } from "../lib/pageHeroConfigs";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/astrology-blog`;

export const metadata = {
  title: "AstroCall Astrology Blog – Vedic Tips, Remedies & Insights",
  description:
    "Read expert astrology blogs on love, career, festivals, doshas & remedies. Stay spiritually informed.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "AstroCall Astrology Blog – Vedic Tips, Remedies & Insights",
    description:
      "Read expert astrology blogs on love, career, festivals, doshas & remedies. Stay spiritually informed.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroCall Astrology Blog – Vedic Tips, Remedies & Insights",
    description:
      "Read expert astrology blogs on love, career, festivals, doshas & remedies. Stay spiritually informed.",
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Astrology Blog",
  url: CANONICAL,
  logo: `${SITE}/assets/logo.png`,
  sameAs: [
    "https://www.facebook.com/AstroCall",
    "https://www.instagram.com/AstroCall",
    "https://twitter.com/astrocall",
  ],
};

export default function AstrologyBlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {/* <ServicePageHero {...BLOG_HERO} /> */}
      <BlogClient />
    </>
  );
}
