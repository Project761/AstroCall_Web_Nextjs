import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/TermsOfUse`;

export const metadata = {
  title: "Terms of Use | AstroCall Live",
  description:
    "Read the Terms of Use for AstroCall Live. Understand your rights, responsibilities, and conditions governing the platform.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Terms of Use | AstroCall Live",
    description:
      "Read the Terms of Use for AstroCall Live. Understand your rights, responsibilities, and conditions governing the platform.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | AstroCall Live",
    description:
      "Read the Terms of Use for AstroCall Live. Understand your rights, responsibilities, and conditions governing the platform.",
  },
};

async function getTermsOfUseItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
    Category: "Terms Of Use",
  });

  if (!res) {
    return [];
  }

  return res.filter((item) => item?.Category === "Terms Of Use");
}

export default async function TermsOfUsePage() {
  const items = await getTermsOfUseItems();

  return <PolicyPageClient items={items} layoutVariant="gradient" />;
}
