import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/StoreRefundPolicy`;

export const metadata = {
  title: "Store Refund Policy – AstroCall Astrology Services",
  description:
    "Review AstroCall's store refund policy. Learn when you are eligible for a refund on astrology consultations, reports or services purchased through our platform.",
  keywords:
    "AstroCall refund policy, store refund policy, astrology service refunds, return policy, refund eligibility, refund process",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Store Refund Policy – AstroCall Astrology Services",
    description:
      "Review AstroCall's store refund policy. Learn when you are eligible for a refund on astrology consultations, reports or services purchased through our platform.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store Refund Policy – AstroCall Astrology Services",
    description:
      "Review AstroCall's store refund policy. Learn when you are eligible for a refund on astrology consultations, reports or services purchased through our platform.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
    Category: "Store Refund Policy",
  });
  if (!res) return [];
  return res.filter((data) => data?.Category === "Store Refund Policy");
}

export default async function StoreRefundPolicyPage() {
  const items = await getItems();
  return <PolicyPageClient items={items} layoutVariant="plain" />;
}
