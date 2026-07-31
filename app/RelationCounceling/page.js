import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/RelationCounceling";
const TITLE = "Relationship Counselling & Astrology Guidance";
const DESCRIPTION =
  "Get relationship counselling on AstroCall. Talk to astrologers for love, marriage issues, breakups, compatibility concerns, and emotional healing support.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: "relationship counseling, relationship therapy, couple counseling, relationship problems, marriage counseling, relationship advice astrology",
});

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Relationship Counseling" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function RelationCouncelingPage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Relationship Counseling"
      heroTitle="Relationship Counseling & Therapy Services | Expert Guidance"
      heroSubtitle="Strengthen your bond with our professional Relationship Counseling services. Our expert therapists provide a safe space for couples to resolve conflicts, improve communication, and build a lasting, healthy partnership."
    />
  );
}
