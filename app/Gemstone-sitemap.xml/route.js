import { getGemstoneSitemapEntries } from "@/app/lib/sitemap/data";
import { buildUrlSetXml, sitemapXmlResponse } from "@/app/lib/sitemap/xml";

export const revalidate = 3600;

export async function GET() {
  const urls = await getGemstoneSitemapEntries();
  return sitemapXmlResponse(buildUrlSetXml(urls));
}
