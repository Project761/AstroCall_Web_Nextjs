import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/LoveAndRelation`;

export const metadata = {
  title: "Astrology for Love & Relationships | Compatibility & Guidance",
  description:
    "Unlock a deeper understanding of your relationships with our astrology for love services. Get personalized compatibility analysis, relationship red flags, and guidance from our expert astrologers.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Astrology for Love & Relationships | Compatibility & Guidance",
    description:
      "Unlock a deeper understanding of your relationships with our astrology for love services. Get personalized compatibility analysis, relationship red flags, and guidance from our expert astrologers.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology for Love & Relationships | Compatibility & Guidance",
    description:
      "Unlock a deeper understanding of your relationships with our astrology for love services. Get personalized compatibility analysis, relationship red flags, and guidance from our expert astrologers.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Love & Relationships" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function LoveAndRelationPage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroTitle="Astrology for Love & Relationships | Compatibility & Guidance"
      heroSubtitle="Unlock a deeper understanding of your relationships with our astrology for love services. Get personalized compatibility analysis, relationship red flags, and guidance from our expert astrologers."
    />
  );
}
