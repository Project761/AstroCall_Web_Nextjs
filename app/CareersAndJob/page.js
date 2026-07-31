import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/CareersAndJob";
const TITLE = "Career Astrology Predictions & Job Guidance Online";
const DESCRIPTION =
  "Get expert career astrology guidance on AstroCall. Discover job opportunities, promotions, business growth, and remedies for long-term professional success.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords:
    "career astrology, job astrology, career guidance, career predictions, job opportunities, professional astrology, career counseling astrology",
});

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Career & Jobs" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function CareersAndJobPage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Career & Jobs"
      breadcrumbLabel="Career & Jobs"
      heroTitle="Astrology for Career & Jobs | Professional Guidance & Predictions"
      heroSubtitle="Unlock your professional potential with our astrology for career services. Get personalized insights into your ideal job, professional strengths, and auspicious periods for growth from expert astrologers."
    />
  );
}
