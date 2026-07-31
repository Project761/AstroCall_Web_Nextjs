import TarotReadingClient from "./TarotReadingClient";
import PageSeoSchemas from "@/app/components/SEO/PageSeoSchemas";
import { buildPageMetadata } from "@/app/lib/seo";

const PATH = "/TarotReading";
const TITLE = "Tarot Reading Online – Accurate Tarot Predictions";
const DESCRIPTION =
  "Get a personalised tarot reading on AstroCall. Talk to expert tarot readers online for clarity on love, relationships, career, finances and important life choices.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: "tarot reading, tarot cards, tarot reader, tarot reading online, tarot card reading, tarot predictions, tarot guidance",
});

export default function TarotReadingPage() {
  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="Tarot Reading" />
      <TarotReadingClient />
    </>
  );
}
