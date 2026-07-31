import { getPagesSitemapEntries } from "@/app/lib/sitemap/data";
import { buildUrlSetXml, sitemapXmlResponse } from "@/app/lib/sitemap/xml";

export const revalidate = 3600;

export async function GET() {
  const urls = getPagesSitemapEntries();
  return sitemapXmlResponse(buildUrlSetXml(urls));
}
