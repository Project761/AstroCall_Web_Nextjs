import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/LoveAndRelation";
const TITLE = "Astrology for Love & Relationships | Compatibility & Guidance";
const DESCRIPTION =
  "Unlock a deeper understanding of your relationships with our astrology for love services. Get personalized compatibility analysis, relationship red flags, and guidance from our expert astrologers.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Love & Relationships" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function LoveAndRelationPage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Love & Relationships"
      heroTitle={TITLE}
      heroSubtitle={DESCRIPTION}
    />
  );
}
