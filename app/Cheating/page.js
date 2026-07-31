import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/Cheating";
const TITLE = "Cheating & Affairs Astrology – Truth & Insights";
const DESCRIPTION =
  "Are you suspicious of cheating or facing infidelity issues? Consult expert astrologers on AstroCall Live for astrological insights into affairs and relationship betrayal.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: "cheating astrology, affairs astrology, infidelity astrology, relationship problems, trust issues astrology, marital problems",
});

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Cheating & Affairs" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function CheatingPage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Cheating & Affairs"
      heroTitle="Astrology for Cheating & Affairs | Understanding Infidelity"
      heroSubtitle="Gain insight into the astrological factors behind infidelity with our astrology for cheating & affairs service. Our expert astrologers provide a compassionate and confidential reading to help you understand and heal."
    />
  );
}
