import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/MaritalLife";
const TITLE = "Marital Life Astrology Consultation | AstroCall Live";
const DESCRIPTION =
  "Get expert astrology predictions for your marital life. Consult top astrologers on AstroCall Live for marriage compatibility, delays, and harmony in relationships.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Marital Life" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function MaritalLifePage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Marital Life"
      heroTitle="Astrology for Marital Life | Marriage Harmony & Guidance"
      heroSubtitle="Strengthen your marriage with expert marital astrology. Get insights on compatibility, conflict resolution, and auspicious timings for a harmonious married life."
    />
  );
}
