import { fetchPujaSlugs } from "@/app/lib/fetchPuja";
import OnlinepujaPlansDetailsClient from "./OnlinepujaPlansDetailsClient";

const SITE = "https://astrocall.live";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchPujaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pujaTitle = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Online Puja";
  const title = `${pujaTitle} Plans | AstroCall`;
  const description = `View online puja plan details and pricing for ${pujaTitle} on AstroCall.`;
  const canonical = `${SITE}/online-puja/${slug}/OnlinepujaPlansDetails`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "AstroCall",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const plansSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online Puja Plans Details",
  description: "Online puja plans details.",
  url: `${SITE}/online-puja`,
  provider: { "@type": "Organization", name: "AstroCall" },
};

export default function OnlinepujaPlansDetailsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(plansSchema) }}
      />
      <OnlinepujaPlansDetailsClient />
    </>
  );
}
