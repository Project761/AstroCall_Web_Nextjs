import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/RelationCounceling`;

export const metadata = {
  title: "Relationship Counselling & Astrology Guidance",
  description:
    "Get relationship counselling on AstroCall. Talk to astrologers for love, marriage issues, breakups, compatibility concerns, and emotional healing support.",
  keywords:
    "relationship counseling, relationship therapy, couple counseling, relationship problems, marriage counseling, relationship advice astrology",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Relationship Counselling & Astrology Guidance",
    description:
      "Get relationship counselling on AstroCall. Talk to astrologers for love, marriage issues, breakups, compatibility concerns, and emotional healing support.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relationship Counselling & Astrology Guidance",
    description:
      "Get relationship counselling on AstroCall. Talk to astrologers for love, marriage issues, breakups, compatibility concerns, and emotional healing support.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Relationship Counseling" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function RelationCouncelingPage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroTitle="Relationship Counseling & Therapy Services | Expert Guidance"
      heroSubtitle="Strengthen your bond with our professional Relationship Counseling services. Our expert therapists provide a safe space for couples to resolve conflicts, improve communication, and build a lasting, healthy partnership."
    />
  );
}
