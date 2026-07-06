import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/KidsAndEducation`;

export const metadata = {
  title: "Kids Education Astrology – Career Guidance & Insights",
  description:
    "Help your child achieve academic success with astrology. Consult astrologers at AstroCall Live for education horoscope, learning challenges, and career guidance for kids.",
  keywords:
    "kids astrology, children astrology, education astrology, child future, career guidance for kids, education guidance astrology",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Kids Education Astrology – Career Guidance & Insights",
    description:
      "Help your child achieve academic success with astrology. Consult astrologers at AstroCall Live for education horoscope, learning challenges, and career guidance for kids.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kids Education Astrology – Career Guidance & Insights",
    description:
      "Help your child achieve academic success with astrology. Consult astrologers at AstroCall Live for education horoscope, learning challenges, and career guidance for kids.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Kids & Education" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function KidsAndEducationPage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroTitle="Astrology for Kids & Education | Guidance for Your Child's Future"
      heroSubtitle="Get expert astrology for kids & education services. Our consultations provide insights into your child's natural talents, academic potential, and ideal career path for a bright future."
    />
  );
}
