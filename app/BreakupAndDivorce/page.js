import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/BreakupAndDivorce";
const TITLE = "Breakup & Divorce Astrology – Remedies & Guidance";
const DESCRIPTION =
  "Dealing with a breakup or divorce? Get astrology-based solutions and remedies for heartbreak, separation, and divorce from experienced astrologers at AstroCall Live.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords:
    "breakup astrology, divorce astrology, relationship healing, separation astrology, marriage problems, relationship counseling astrology",
});

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Break-ups & Divorce" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function BreakupAndDivorcePage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Breakup & Divorce"
      heroTitle="Astrology for Break-ups & Divorce | Healing & Guidance"
      heroSubtitle="Find a path to healing and self-discovery with our astrology for break-ups & divorce service. Gain insight into the cosmic lessons of your relationship and find the clarity to move forward."
    />
  );
}
