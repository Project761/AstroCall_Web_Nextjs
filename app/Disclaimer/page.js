import PolicyPageClient from "@/app/components/policy/PolicyPageClient";
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import { fetchPolicyPageData } from "@/app/lib/fetchPolicyPage";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/Disclaimer";
const TITLE = "Disclaimer | AstroCall Live";
const DESCRIPTION =
  "Read the official Disclaimer of AstroCall Live. Understand limitations of astrology services and liability policies.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

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

  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="Disclaimer" />
      <PolicyPageClient items={items} layoutVariant="plain" pageTitle="Disclaimer" />
    </>
  );
}
