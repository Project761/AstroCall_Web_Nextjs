import NumerologyClient from "./NumerologyClient";
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/Numerology";
const TITLE = "Numerology Services - Life Path, Name & Compatibility";
const DESCRIPTION =
  "Get personalised numerology services on AstroCall. Discover your life path number, name numerology and relationship compatibility with guidance from expert numerologists.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function NumerologyPage() {
  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="Numerology" />
      <NumerologyClient />
    </>
  );
}
