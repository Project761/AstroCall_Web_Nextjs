import { serverPost, slugifyText, slugToApiName } from "./serverApi";

export async function fetchGemstoneList() {
  const rows = await serverPost("Gemstone/GetData_Gemstone", { IsActive: "1" });
  return Array.isArray(rows) ? rows : [];
}

export async function fetchGemstoneBySlug(slug) {
  const rows = await fetchGemstoneRowsBySlug(slug);
  if (!rows?.length) return null;
  return rows.find((item) => item?.HeadingDescription) || rows[0];
}

export async function fetchGemstoneRowsBySlug(slug) {
  if (!slug) return [];

  const rows = await serverPost("Gemstone/GetsinglaData_Gemstone", {
    GemstoneID: "0",
    HeadingDescription: slugToApiName(slug),
  });

  if (Array.isArray(rows) && rows.length > 0) {
    return rows;
  }

  const fallback = await fetchGemstoneList();
  const item = fallback.find((entry) => entry?.HeadingDescription);
  return item ? [item] : [];
}

export async function fetchGemstoneSlugs() {
  const list = await fetchGemstoneList();
  return list
    .map((item) => slugifyText(item?.HeadingDescription))
    .filter(Boolean);
}

export function buildGemstoneMetadata(gemstone, slug) {
  const gemstoneName = gemstone?.HeadingDescription?.trim() || "Gemstone";
  const cleanDescription = (gemstone?.ShortDescription || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const slugValue = slug || slugifyText(gemstoneName);
  const canonical = `https://astrocall.live/gemstone/${slugValue}`;
  const title = `${gemstoneName} | AstroCall Gemstone`;
  const description =
    cleanDescription ||
    `Get complete details, benefits, pricing and authenticity information for ${gemstoneName} on AstroCall.`;

  return {
    title,
    description,
    keywords: `${gemstoneName}, ${gemstoneName} benefits, buy ${gemstoneName} online, astrocall gemstones`,
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

export function buildGemstoneProductSchema(gemstone, slug) {
  const meta = buildGemstoneMetadata(gemstone, slug);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: meta.title,
    description: meta.description,
    url: meta.alternates.canonical,
  };
}
