import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/CookiePolicy`;

export const metadata = {
  title: "Cookie Policy | AstroCall Live",
  description:
    "Learn how AstroCall Live uses cookies to improve browsing experience and manage preferences.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Cookie Policy | AstroCall Live",
    description:
      "Learn how AstroCall Live uses cookies to improve browsing experience and manage preferences.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy | AstroCall Live",
    description:
      "Learn how AstroCall Live uses cookies to improve browsing experience and manage preferences.",
  },
};

async function getCookiePolicyItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
    Category: "Cookie Policy",
  });

  if (!res) {
    return [];
  }

  return res.filter((data) => data?.Category);
}

export default async function CookiePolicyPage() {
  const items = await getCookiePolicyItems();

  return <PolicyPageClient items={items} layoutVariant="plain" />;
}
