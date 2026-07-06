import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/Cheating`;

export const metadata = {
  title: "Cheating & Affairs Astrology – Truth & Insights",
  description:
    "Are you suspicious of cheating or facing infidelity issues? Consult expert astrologers on AstroCall Live for astrological insights into affairs and relationship betrayal.",
  keywords:
    "cheating astrology, affairs astrology, infidelity astrology, relationship problems, trust issues astrology, marital problems",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cheating & Affairs Astrology – Truth & Insights",
    description:
      "Are you suspicious of cheating or facing infidelity issues? Consult expert astrologers on AstroCall Live for astrological insights into affairs and relationship betrayal.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheating & Affairs Astrology – Truth & Insights",
    description:
      "Are you suspicious of cheating or facing infidelity issues? Consult expert astrologers on AstroCall Live for astrological insights into affairs and relationship betrayal.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Cheating & Affairs" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function CheatingPage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroTitle="Astrology for Cheating & Affairs | Understanding Infidelity"
      heroSubtitle="Gain insight into the astrological factors behind infidelity with our astrology for cheating & affairs service. Our expert astrologers provide a compassionate and confidential reading to help you understand and heal."
    />
  );
}
