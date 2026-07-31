import AIAstrologerClient from "./AIAstrologerClient";
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/AIAstrologer";
const TITLE = "AI Astrologer – Coming Soon";
const DESCRIPTION =
  "AI Astrologer is coming soon on AstroCall. Get accurate predictions, personalized guidance and instant answers powered by AI and Vedic astrology.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function AIAstrologerPage() {
  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="AI Astrologer" />
      <AIAstrologerClient />
    </>
  );
}
