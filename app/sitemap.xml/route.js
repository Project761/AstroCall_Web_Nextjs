import { getSitemapIndexEntries } from "@/app/lib/sitemap/data";
import { buildSitemapIndexXml, sitemapXmlResponse } from "@/app/lib/sitemap/xml";

export const revalidate = 3600;

export async function GET() {
  const entries = getSitemapIndexEntries();
  return sitemapXmlResponse(buildSitemapIndexXml(entries));
}
