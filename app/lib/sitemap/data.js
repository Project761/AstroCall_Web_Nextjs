import { fetchAstrologerSlugs } from "@/app/lib/fetchAstrologer";
import { fetchBlogList, blogSlugFromMetaKeywords } from "@/app/lib/fetchBlog";
import { fetchGemstoneSlugs } from "@/app/lib/fetchGemstone";
import { fetchPujaSlugs } from "@/app/lib/fetchPuja";
import { HOROSCOPE_SIGNS, STATIC_SITEMAP_ROUTES } from "@/app/lib/siteConstants";
import { filterIndexableStaticRoutes, SITE_URL } from "@/app/lib/seo";

function toEntry(path, lastModified = new Date(), changeFrequency = "weekly", priority = 0.7) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return {
    loc: normalized === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export function getPagesSitemapEntries() {
  const lastModified = new Date();
  const routes = filterIndexableStaticRoutes(STATIC_SITEMAP_ROUTES);
  return routes.map((path) =>
    toEntry(
      path,
      lastModified,
      path === "" ? "daily" : "weekly",
      path === "" ? 1 : path === "/daily-horoscope" ? 0.9 : 0.7
    )
  );
}

export function getHoroscopeSitemapEntries() {
  const lastModified = new Date();
  return [
    toEntry("/daily-horoscope", lastModified, "daily", 0.9),
    ...HOROSCOPE_SIGNS.map((sign) =>
      toEntry(`/daily-horoscope/${sign}`, lastModified, "daily", 0.8)
    ),
  ];
}

export async function getBlogSitemapEntries() {
  const lastModified = new Date();
  try {
    const blogs = await fetchBlogList();
    const posts = blogs
      .map((blog) => {
        const slug = blogSlugFromMetaKeywords(blog?.MetaKeywords);
        if (!slug) return null;
        return toEntry(
          `/astrology-blog/${slug}`,
          blog?.UpdatedDate ? new Date(blog.UpdatedDate) : lastModified,
          "weekly",
          0.75
        );
      })
      .filter(Boolean);

    return [toEntry("/astrology-blog", lastModified, "daily", 0.8), ...posts];
  } catch {
    return [toEntry("/astrology-blog", lastModified, "daily", 0.8)];
  }
}

export async function getAstrologerSitemapEntries() {
  const lastModified = new Date();
  try {
    const slugs = await fetchAstrologerSlugs();
    const unique = [...new Set(slugs.filter(Boolean))];
    return [
      toEntry("/talk-to-astrologers", lastModified, "daily", 0.85),
      toEntry("/chat-to-astrologers", lastModified, "daily", 0.85),
      ...unique.flatMap((slug) => [
        toEntry(`/talk-to-astrologers/${slug}`, lastModified, "weekly", 0.75),
        toEntry(`/chat-to-astrologers/${slug}`, lastModified, "weekly", 0.75),
      ]),
    ];
  } catch {
    return [
      toEntry("/talk-to-astrologers", lastModified, "daily", 0.85),
      toEntry("/chat-to-astrologers", lastModified, "daily", 0.85),
    ];
  }
}

export async function getGemstoneSitemapEntries() {
  const lastModified = new Date();
  try {
    const slugs = await fetchGemstoneSlugs();
    const unique = [...new Set(slugs.filter(Boolean))];
    return [
      toEntry("/gemstone", lastModified, "weekly", 0.8),
      ...unique.map((slug) => toEntry(`/gemstone/${slug}`, lastModified, "weekly", 0.7)),
    ];
  } catch {
    return [toEntry("/gemstone", lastModified, "weekly", 0.8)];
  }
}

export async function getOnlinePujaSitemapEntries() {
  const lastModified = new Date();
  try {
    const slugs = await fetchPujaSlugs();
    const unique = [...new Set(slugs.filter(Boolean))];
    return [
      toEntry("/online-puja", lastModified, "weekly", 0.8),
      ...unique.flatMap((slug) => [
        toEntry(`/online-puja/${slug}`, lastModified, "weekly", 0.7),
        toEntry(`/online-puja/${slug}/OnlinepujaPlansDetails`, lastModified, "weekly", 0.65),
      ]),
    ];
  } catch {
    return [toEntry("/online-puja", lastModified, "weekly", 0.8)];
  }
}

export function getSitemapIndexEntries() {
  const lastModified = new Date();
  return [
    { loc: `${SITE_URL}/`, lastModified },
    { loc: `${SITE_URL}/Pages-sitemap.xml`, lastModified },
    { loc: `${SITE_URL}/blog-sitemap.xml`, lastModified },
    { loc: `${SITE_URL}/horoscope-sitemap.xml`, lastModified },
    { loc: `${SITE_URL}/Astrologer-sitemap.xml`, lastModified },
    { loc: `${SITE_URL}/Gemstone-sitemap.xml`, lastModified },
    { loc: `${SITE_URL}/OnlinePuja-sitemap.xml`, lastModified },
  ];
}
