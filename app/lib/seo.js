/**
 * Central SEO utilities — metadata, JSON-LD, sitemap filters.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */

export const SITE_URL = "https://astrocall.live";
export const SITE_NAME = "AstroCall";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/astrocall-og-image.jpg`;
export const DEFAULT_LOCALE = "en_IN";
export const DEFAULT_LANGUAGE = "en-IN";

/** Routes that must NOT appear in sitemap (noindex / redirect / auth). */
export const SITEMAP_EXCLUDED_PATHS = new Set([
  "/wait-list",
  "/suggested",
  "/astrologer-login",
  "/astrologer-register-update",
  "/notification",
]);

/** Additional indexable static paths not in legacy STATIC_SITEMAP_ROUTES. */
export const EXTRA_INDEXABLE_PATHS = [
  "/freekundli/basic-detail",
  "/kundali-matching/matching-details",
];

/** Crawl blocks for robots.txt (private / transactional areas). */
export const ROBOTS_DISALLOW = [
  "/my-account",
  "/my-calls",
  "/my-chats",
  "/my-favorites",
  "/my-following",
  "/my-gemstone",
  "/my-online-puja",
  "/my-wallet",
  "/checkout",
  "/user-chat/chat",
  "/chat-to-astrologers/user-chat-home",
  "/talk-to-astrologers/user-talk-home",
  "/astrologer-panel",
  "/astrologer-register-update",
  "/wait-list",
  "/suggested",
  "/notification",
  "/plans/",
];

export const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const INDEX_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

/** Trim title to ~60 chars for SERP (word-safe). */
export function trimTitle(title, max = 60) {
  const t = String(title || "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

/** Trim description to ~160 chars. */
export function trimDescription(desc, max = 160) {
  const d = String(desc || "").trim();
  if (d.length <= max) return d;
  const cut = d.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export function buildCanonical(path = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${p}`.replace(/\/+$/, "") || `${SITE_URL}/`;
}

/**
 * Production-ready page metadata builder (Open Graph + Twitter + canonical).
 */
export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  titleAbsolute = false,
}) {
  const canonical = buildCanonical(path);
  const safeTitle = trimTitle(title);
  const safeDesc = trimDescription(description);

  const ogImages = [
    {
      url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
      width: 1200,
      height: 630,
      alt: `${safeTitle} — ${SITE_NAME}`,
    },
  ];

  const metadata = {
    description: safeDesc,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: safeTitle,
      description: safeDesc,
      url: canonical,
      type: ogType,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDesc,
      images: [ogImages[0].url],
    },
    robots: noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS,
  };

  if (titleAbsolute) {
    metadata.title = { absolute: safeTitle };
  } else {
    metadata.title = safeTitle;
  }

  return metadata;
}

export function buildPrivateMetadata(title, description) {
  return {
    title,
    description: trimDescription(description, 120),
    robots: NOINDEX_ROBOTS,
  };
}

/** BreadcrumbList JSON-LD */
export function buildBreadcrumbSchema(crumbs) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : buildCanonical(crumb.url),
    })),
  };
}

/** WebPage JSON-LD */
export function buildWebPageSchema({ name, description, path, breadcrumbs }) {
  const url = buildCanonical(path);
  const schema = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: trimTitle(name, 110),
    description: trimDescription(description, 320),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    inLanguage: DEFAULT_LANGUAGE,
  };
  if (breadcrumbs?.length) {
    schema.breadcrumb = buildBreadcrumbSchema(breadcrumbs);
  }
  return schema;
}

/** FAQPage JSON-LD */
export function buildFAQSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

/** Organization (site-wide reference) */
export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/logo1.webp`,
      width: 512,
      height: 512,
    },
    description:
      "India's trusted online astrology platform — verified astrologers, free kundli, daily horoscope, kundali matching, gemstones, and online puja.",
    foundingLocation: { "@type": "Place", name: "India" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@astrocall.live",
      telephone: "+91-9876543210",
      url: buildCanonical("/contact"),
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://www.facebook.com/share/1AZyAfVdjE/",
      "https://www.instagram.com/astrocall.live",
      "https://www.youtube.com",
      "https://twitter.com",
    ],
  };
}

/** WebSite + SearchAction */
export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: `${SITE_NAME} — Talk to India's Best Astrologers Online`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: DEFAULT_LANGUAGE,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/talk-to-astrologers?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Combine schemas into @graph document */
export function buildSchemaGraph(...nodes) {
  const flat = nodes.flat().filter(Boolean);
  if (!flat.length) return null;
  return {
    "@context": "https://schema.org",
    "@graph": flat,
  };
}

/** Standard public page: WebPage + Breadcrumb */
export function buildPublicPageSchemas({ title, description, path, breadcrumbLabel }) {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: breadcrumbLabel || title, url: path },
  ];
  return buildSchemaGraph(
    buildWebPageSchema({ name: title, description, path, breadcrumbs: crumbs }),
    buildBreadcrumbSchema(crumbs)
  );
}

/** Filter static routes for sitemap.xml */
export function filterIndexableStaticRoutes(routes) {
  const merged = [...new Set([...routes, ...EXTRA_INDEXABLE_PATHS])];
  return merged.filter((path) => !SITEMAP_EXCLUDED_PATHS.has(path));
}
