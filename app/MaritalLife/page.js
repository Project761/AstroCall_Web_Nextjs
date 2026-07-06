import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/MaritalLife`;

export const metadata = {
  title: "Marital Life Astrology Consultation | AstroCall Live",
  description:
    "Get expert astrology predictions for your marital life. Consult top astrologers on AstroCall Live for marriage compatibility, delays, and harmony in relationships.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Marital Life Astrology Consultation | AstroCall Live",
    description:
      "Get expert astrology predictions for your marital life. Consult top astrologers on AstroCall Live for marriage compatibility, delays, and harmony in relationships.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marital Life Astrology Consultation | AstroCall Live",
    description:
      "Get expert astrology predictions for your marital life. Consult top astrologers on AstroCall Live for marriage compatibility, delays, and harmony in relationships.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Marital Life" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function MaritalLifePage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroTitle="Astrology for Love & Relationships | Compatibility & Guidance"
      heroSubtitle="Unlock a deeper understanding of your relationships with our astrology for love services. Get personalized compatibility analysis, relationship red flags, and guidance from our expert astrologers."
    />
  );
}
