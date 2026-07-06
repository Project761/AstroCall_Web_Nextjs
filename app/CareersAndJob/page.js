import ServicePageClient from "@/app/components/policy/ServicePageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/CareersAndJob`;

export const metadata = {
  title: "Career Astrology Predictions & Job Guidance Online",
  description:
    "Get expert career astrology guidance on AstroCall. Discover job opportunities, promotions, business growth, and remedies for long-term professional success.",
  keywords:
    "career astrology, job astrology, career guidance, career predictions, job opportunities, professional astrology, career counseling astrology",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Career Astrology Predictions & Job Guidance Online",
    description:
      "Get expert career astrology guidance on AstroCall. Discover job opportunities, promotions, business growth, and remedies for long-term professional success.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Astrology Predictions & Job Guidance Online",
    description:
      "Get expert career astrology guidance on AstroCall. Discover job opportunities, promotions, business growth, and remedies for long-term professional success.",
  },
};

async function getItems() {
  const res = await fetchPolicyPageData({ IsActive: "1", Category: "Career & Jobs" });
  if (!res) return [];
  return res.filter((data) => data?.Category);
}

export default async function CareersAndJobPage() {
  const items = await getItems();
  return (
    <ServicePageClient
      items={items}
      heroMt16
      heroTitle="Astrology for Career & Jobs | Professional Guidance & Predictions"
      heroSubtitle="Unlock your professional potential with our astrology for career services. Get personalized insights into your ideal job, professional strengths, and auspicious periods for growth from expert astrologers."
    />
  );
}
