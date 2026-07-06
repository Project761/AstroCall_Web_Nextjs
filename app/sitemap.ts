import { fetchAstrologerSlugs } from "./lib/fetchAstrologer";
import { fetchBlogSlugs } from "./lib/fetchBlog";
import { fetchGemstoneSlugs } from "./lib/fetchGemstone";
import { fetchPujaSlugs } from "./lib/fetchPuja";
import { HOROSCOPE_SIGNS, SITE_URL, STATIC_SITEMAP_ROUTES } from "./lib/siteConstants";
import type { MetadataRoute } from "next";

function buildStaticEntries(lastModified: Date): MetadataRoute.Sitemap {
  return STATIC_SITEMAP_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: (path === "" ? "daily" : "weekly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: path === "" ? 1 : path === "/daily-horoscope" ? 0.9 : 0.7,
  }));
}

function buildHoroscopeEntries(lastModified: Date): MetadataRoute.Sitemap {
  return HOROSCOPE_SIGNS.map((sign) => ({
    url: `${SITE_URL}/daily-horoscope/${sign}`,
    lastModified,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
}

function buildSlugEntries(
  slugs: string[],
  pathPrefix: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly",
  priority = 0.7
): MetadataRoute.Sitemap {
  const uniqueSlugs = [...new Set(slugs.filter(Boolean))];
  return uniqueSlugs.map((slug) => ({
    url: `${SITE_URL}${pathPrefix}/${slug}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

function buildPujaPlanEntries(
  slugs: string[],
  lastModified: Date
): MetadataRoute.Sitemap {
  const uniqueSlugs = [...new Set(slugs.filter(Boolean))];
  return uniqueSlugs.map((slug) => ({
    url: `${SITE_URL}/online-puja/${slug}/OnlinepujaPlansDetails`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));
}

async function fetchDynamicSlugs() {
  const [blogSlugs, gemstoneSlugs, pujaSlugs, astrologerSlugs] = await Promise.all([
    fetchBlogSlugs().catch(() => [] as string[]),
    fetchGemstoneSlugs().catch(() => [] as string[]),
    fetchPujaSlugs().catch(() => [] as string[]),
    fetchAstrologerSlugs().catch(() => [] as string[]),
  ]);

  return { blogSlugs, gemstoneSlugs, pujaSlugs, astrologerSlugs };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticEntries = buildStaticEntries(lastModified);
  const horoscopeEntries = buildHoroscopeEntries(lastModified);

  try {
    const { blogSlugs, gemstoneSlugs, pujaSlugs, astrologerSlugs } = await fetchDynamicSlugs();

    const blogEntries = buildSlugEntries(blogSlugs, "/astrology-blog", lastModified, "weekly", 0.7);
    const gemstoneEntries = buildSlugEntries(gemstoneSlugs, "/gemstone", lastModified, "weekly", 0.7);
    const pujaEntries = buildSlugEntries(pujaSlugs, "/online-puja", lastModified, "weekly", 0.7);
    const pujaPlanEntries = buildPujaPlanEntries(pujaSlugs, lastModified);
    const talkAstrologerEntries = buildSlugEntries(
      astrologerSlugs,
      "/talk-to-astrologers",
      lastModified,
      "weekly",
      0.75
    );
    const chatAstrologerEntries = buildSlugEntries(
      astrologerSlugs,
      "/chat-to-astrologers",
      lastModified,
      "weekly",
      0.75
    );

    return [
      ...staticEntries,
      ...horoscopeEntries,
      ...blogEntries,
      ...gemstoneEntries,
      ...pujaEntries,
      ...pujaPlanEntries,
      ...talkAstrologerEntries,
      ...chatAstrologerEntries,
    ];
  } catch (error) {
    console.error("sitemap dynamic slug fetch failed, returning static routes only:", error);
    return [...staticEntries, ...horoscopeEntries];
  }
}
