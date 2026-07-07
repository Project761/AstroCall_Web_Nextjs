import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/RefundCancellation`;

export const metadata = {
  title: "Refund & Cancellation Policy | AstroCall Live",
  description:
    "Review AstroCall Live's Refund and Cancellation Policy. Learn about eligibility, timelines, and refund process.",
  alternates: {
    canonical: CANONICAL,
  }, 
  openGraph: {
    title: "Refund & Cancellation Policy | AstroCall Live",
    description:
      "Review AstroCall Live's Refund and Cancellation Policy. Learn about eligibility, timelines, and refund process.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund & Cancellation Policy | AstroCall Live",
    description:
      "Review AstroCall Live's Refund and Cancellation Policy. Learn about eligibility, timelines, and refund process.",
  },
};

async function getRefundCancellationItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
  });

  if (!res) {
    return [];
  }

  return res.filter((item) => item?.Category === "Refund & Cancellation");
}

export default async function RefundCancellationPage() {
  const items = await getRefundCancellationItems();

  return <PolicyPageClient items={items} layoutVariant="plain-nested" />;
}
