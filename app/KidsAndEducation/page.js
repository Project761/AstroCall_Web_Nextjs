import ServicePageWithSeo from "@/app/components/SEO/ServicePageWithSeo";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/KidsAndEducation";
const TITLE = "Kids Education Astrology – Career Guidance & Insights";
const DESCRIPTION =
  "Help your child achieve academic success with astrology. Consult astrologers at AstroCall Live for education horoscope, learning challenges, and career guidance for kids.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: "kids astrology, children astrology, education astrology, child future, career guidance for kids, education guidance astrology",
});

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Kids & Education" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function KidsAndEducationPage() {
  const items = await getItems();
  return (
    <ServicePageWithSeo
      items={items}
      seoTitle={TITLE}
      seoDescription={DESCRIPTION}
      path={PATH}
      currentPage="Kids & Education"
      heroTitle="Astrology for Kids & Education | Guidance for Your Child's Future"
      heroSubtitle="Get expert astrology for kids & education services. Our consultations provide insights into your child's natural talents, academic potential, and ideal career path for a bright future."
    />
  );
}
