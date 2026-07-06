import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/privacy-policy`;

export const metadata = {
  title: "Privacy Policy – AstroCall Data Protection & Security",
  description:
    "Read AstroCall's privacy policy. Understand how your personal data, chat history and payment information are collected, used, stored and protected on our platform.",
  keywords:
    "AstroCall privacy policy, data protection, user privacy, personal information, online privacy, data security",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Privacy Policy – AstroCall Data Protection & Security",
    description:
      "Read AstroCall's privacy policy. Understand how your personal data, chat history and payment information are collected, used, stored and protected on our platform.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – AstroCall Data Protection & Security",
    description:
      "Read AstroCall's privacy policy. Understand how your personal data, chat history and payment information are collected, used, stored and protected on our platform.",
  },
};

const privacySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Privacy Policy — AstroCall",
      url: CANONICAL,
      description:
        "Read AstroCall's Privacy Policy to understand how we collect, use, and protect your personal information when you use our astrology services.",
      inLanguage: "en-IN",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Privacy Policy",
          item: CANONICAL,
        },
      ],
    },
  ],
};

async function getPrivacyPolicyItems() {
  const res = await fetchPolicyPageData({
    IsActive: "1",
    Category: "Privacy Policy",
  });

  if (!res) {
    return [];
  }

  return res.filter((item) => item?.Category === "Privacy Policy");
}

export default async function PrivacyPolicyPage() {
  const items = await getPrivacyPolicyItems();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <PolicyPageClient items={items} layoutVariant="gradient" pageTitle="Privacy Policy" />
    </>
  );
}
