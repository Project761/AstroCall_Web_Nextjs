import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/ShippingDeliveryPolicy`;

export const metadata = {
  title: "Shipping & Delivery Policy | AstroCall Live",
  description:
    "Read AstroCall Live's Shipping and Delivery Policy for gemstones and products. Learn about delivery timelines and charges.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Shipping & Delivery Policy | AstroCall Live",
    description:
      "Read AstroCall Live's Shipping and Delivery Policy for gemstones and products. Learn about delivery timelines and charges.",
    url: CANONICAL, 
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image", 
    title: "Shipping & Delivery Policy | AstroCall Live",
    description:
      "Read AstroCall Live's Shipping and Delivery Policy for gemstones and products. Learn about delivery timelines and charges.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
    Category: "Shipping & Delivery Policy",
  });
  if (!res) return [];
  return res.filter((data) => data?.Category === "Shipping & Delivery Policy");
}

export default async function ShippingDeliveryPolicyPage() {
  const items = await getItems();
  return <PolicyPageClient items={items} layoutVariant="plain" />;
}
