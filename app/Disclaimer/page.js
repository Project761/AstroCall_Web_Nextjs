import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/Disclaimer`;

export const metadata = {
  title: "Disclaimer | AstroCall Live",
  description:
    "Read the official Disclaimer of AstroCall Live. Understand limitations of astrology services and liability policies.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Disclaimer | AstroCall Live",
    description:
      "Read the official Disclaimer of AstroCall Live. Understand limitations of astrology services and liability policies.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | AstroCall Live",
    description:
      "Read the official Disclaimer of AstroCall Live. Understand limitations of astrology services and liability policies.",
  },
};

async function getDisclaimerItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
    Category: "Disclaimer",
  });

  if (!res) {
    return [];
  }

  return res.filter((data) => data?.Category);
}

export default async function DisclaimerPage() {
  const items = await getDisclaimerItems();

  return <PolicyPageClient items={items} layoutVariant="plain" />;
}
