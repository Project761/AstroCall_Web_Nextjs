import { SITE_URL } from "@/app/lib/seo";

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XSL_HREF = "/sitemap.xsl";

export function formatSitemapDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapIndexXml(entries) {
  const body = entries
    .map(
      (entry) =>
        `  <sitemap>\n    <loc>${xmlEscape(entry.loc)}</loc>\n    <lastmod>${formatSitemapDate(entry.lastModified)}</lastmod>\n  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${XSL_HREF}"?>
<sitemapindex xmlns="${SITEMAP_NS}">
${body}
</sitemapindex>`;
}

export function buildUrlSetXml(urls) {
  const body = urls
    .map((entry) => {
      const parts = [`    <loc>${xmlEscape(entry.loc)}</loc>`];
      if (entry.lastModified) {
        parts.push(`    <lastmod>${formatSitemapDate(entry.lastModified)}</lastmod>`);
      }
      if (entry.changeFrequency) {
        parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
      }
      if (entry.priority != null) {
        parts.push(`    <priority>${entry.priority}</priority>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${XSL_HREF}"?>
<urlset xmlns="${SITEMAP_NS}">
${body}
</urlset>`;
}

export function sitemapXmlResponse(xml) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

/** Sub-sitemap files listed in the root sitemap index (matches production AstroCall). */
export const SITEMAP_INDEX_ENTRIES = [
  { loc: `${SITE_URL}/`, key: "home" },
  { loc: `${SITE_URL}/Pages-sitemap.xml`, key: "pages" },
  { loc: `${SITE_URL}/blog-sitemap.xml`, key: "blog" },
  { loc: `${SITE_URL}/horoscope-sitemap.xml`, key: "horoscope" },
  { loc: `${SITE_URL}/Astrologer-sitemap.xml`, key: "astrologer" },
  { loc: `${SITE_URL}/Gemstone-sitemap.xml`, key: "gemstone" },
  { loc: `${SITE_URL}/OnlinePuja-sitemap.xml`, key: "puja" },
];
