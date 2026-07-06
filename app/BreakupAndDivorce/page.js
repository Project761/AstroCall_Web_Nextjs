import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/BreakupAndDivorce`;

export const metadata = {
  title: "Breakup & Divorce Astrology – Remedies & Guidance",
  description:
    "Dealing with a breakup or divorce? Get astrology-based solutions and remedies for heartbreak, separation, and divorce from experienced astrologers at AstroCall Live.",
  keywords:
    "breakup astrology, divorce astrology, relationship healing, separation astrology, marriage problems, relationship counseling astrology",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Breakup & Divorce Astrology – Remedies & Guidance",
    description:
      "Dealing with a breakup or divorce? Get astrology-based solutions and remedies for heartbreak, separation, and divorce from experienced astrologers at AstroCall Live.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Breakup & Divorce Astrology – Remedies & Guidance",
    description:
      "Dealing with a breakup or divorce? Get astrology-based solutions and remedies for heartbreak, separation, and divorce from experienced astrologers at AstroCall Live.",
  },
};
 
async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Break-ups & Divorce" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function BreakupAndDivorcePage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroTitle="Astrology for Break-ups & Divorce | Healing & Guidance"
      heroSubtitle="Find a path to healing and self-discovery with our astrology for break-ups & divorce service. Gain insight into the cosmic lessons of your relationship and find the clarity to move forward."
    />
  );
}
