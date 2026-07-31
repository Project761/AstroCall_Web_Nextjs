import PalmReadingClient from "./PalmReadingClient";
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/PalmReading";
const TITLE = "Palm Reading Online – Expert Palm Readers on AstroCall";
const DESCRIPTION =
  "Get accurate palm reading online on AstroCall. Talk to expert palm readers for insights on career, love, marriage, health, wealth and your future.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function PalmReadingPage() {
  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="Palm Reading" />
      <PalmReadingClient />
    </>
  );
}
