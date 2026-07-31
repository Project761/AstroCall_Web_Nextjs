import VedicAstrologyClient from "./VedicAstrologyClient";
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/VedicAstrology";
const TITLE = "Vedic Astrology Services - Birth Chart & Predictions";
const DESCRIPTION =
  "Consult Vedic astrologers on AstroCall for detailed birth chart analysis, life predictions, remedies and guidance on love, career, marriage and finance.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: "vedic astrology, jyotish, birth chart, kundli, vedic astrology services, indian astrology, hindu astrology, planetary positions, life predictions",
});

export default function VedicAstrologyPage() {
  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="Vedic Astrology" />
      <VedicAstrologyClient />
    </>
  );
}
