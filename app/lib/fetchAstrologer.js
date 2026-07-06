import { serverPost, slugifyText, slugToApiName } from "./serverApi";
import { SITE_URL } from "./siteConstants";

export async function fetchAstrologerList() {
  const rows = await serverPost("Astrologer/UserGetData_Astrologer", { IsActive: "1" });
  return Array.isArray(rows) ? rows.filter((row) => row?.DisplayName) : [];
}

export async function fetchAstrologerBySlug(slug) {
  if (!slug) return null;

  const apiName = slugToApiName(slug);
  const rows = await serverPost("Astrologer/UserGetData_Astrologer", {
    AstrologerName: apiName,
    IsActive: "1",
  });

  if (Array.isArray(rows) && rows.length > 0) {
    return rows.find((row) => row?.ID) || rows[0];
  }

  const list = await fetchAstrologerList();
  return (
    list.find(
      (item) =>
        slugifyText(item?.DisplayName) === slugifyText(slug) ||
        item?.DisplayName?.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim() === apiName
    ) || null
  );
}

export async function fetchAstrologerSlugs() {
  const list = await fetchAstrologerList();
  return list.map((item) => slugifyText(item?.DisplayName)).filter(Boolean);
}

export function getAstrologerSeoFields(astrologer) {
  const astrologerName =
    astrologer?.DisplayName || astrologer?.name || astrologer?.FirstName || "Astrologer";
  const astrologerSkills = astrologer?.skillsValue || "Astrology";
  const astrologerRating = astrologer?.Review || "4.5";
  const title = `${astrologerName} - Expert ${astrologerSkills} Astrologer | AstroCall`;
  const description = `Consult with ${astrologerName}, an expert ${astrologerSkills} astrologer with ${astrologerRating} star rating. Get accurate predictions and guidance for your life problems.`;

  return { astrologerName, astrologerSkills, astrologerRating, title, description };
}

export function buildAstrologerProfileMetadata(astrologer, slug, routePrefix) {
  const { title, description } = getAstrologerSeoFields(astrologer);
  const canonical = `${SITE_URL}${routePrefix}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "AstroCall",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildAstrologerPersonSchema(astrologer, slug, routePrefix) {
  const { astrologerName, description } = getAstrologerSeoFields(astrologer);
  const url = `${SITE_URL}${routePrefix}/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: astrologerName,
    description,
    url,
  };
}
