import { serverPost, slugifyText, slugToApiName } from "./serverApi";

export async function fetchPujaList() {
  const rows = await serverPost("Puja/GetData_Puja", { IsActive: "1" });
  return Array.isArray(rows) ? rows : [];
}

export async function fetchPujaBySlug(slug) {
  const rows = await fetchPujaRowsBySlug(slug);
  if (!rows?.length) return null;
  return rows.find((item) => item?.PujaName) || rows[0];
}

export async function fetchPujaRowsBySlug(slug) {
  if (!slug) return [];

  const rows = await serverPost("Puja/GetsinglaData_Puja", {
    PujaID: "0",
    PujaName: slugToApiName(slug),
  });

  if (Array.isArray(rows) && rows.length > 0) {
    return rows;
  }

  const fallback = await fetchPujaList();
  const item = fallback.find((entry) => entry?.PujaName);
  return item ? [item] : [];
}

export async function fetchPujaSlugs() {
  const list = await fetchPujaList();
  return list.map((item) => slugifyText(item?.PujaName)).filter(Boolean);
}

export function buildPujaMetadata(puja, slug) {
  const pujaTitle = puja?.PujaName?.trim() || "Online Puja";
  const cleanDescription = (puja?.ShortDescription || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const slugValue = slug || slugifyText(pujaTitle);
  const canonical = `https://astrocall.live/online-puja/${slugValue}`;
  const title = `${pujaTitle} | AstroCall Online Puja`;
  const description =
    cleanDescription ||
    `Book ${pujaTitle} online with trusted priests. Get complete rituals, benefits and booking details on AstroCall.`;

  return {
    title,
    description,
    keywords: `${pujaTitle}, ${pujaTitle} online, online puja booking, astrocall puja`,
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

export function buildPujaServiceSchema(puja, slug) {
  const meta = buildPujaMetadata(puja, slug);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: meta.title,
    description: meta.description,
    url: meta.alternates.canonical,
    provider: {
      "@type": "Organization",
      name: "AstroCall",
    },
  };
}
