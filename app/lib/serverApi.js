const normalizeBaseUrl = (baseUrl) => {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};

export const getServerApiUrl = () =>
  normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://liveapi.astrocall.live/api/"
  );

/**
 * Server-side POST matching client getPostData / postWithToken Table parsing.
 */
export async function serverPost(url, postData, { revalidate = 3600 } = {}) {
  try {
    const response = await fetch(`${getServerApiUrl()}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        FingerPrintJsKey: "",
        "User-Agent": "Mozilla/5.0 (compatible; AstroCall/1.0; +https://astrocall.live)",
      },
      body: JSON.stringify(postData),
      next: { revalidate },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    let parsed = data?.data;

    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    return parsed?.Table ?? parsed ?? null;
  } catch (error) {
    console.error(`serverPost ${url} error:`, error);
    return null;
  }
}

export function slugifyText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function slugToApiName(slug) {
  if (!slug) return "";
  return slug.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

export function capitalizeSign(sign) {
  if (!sign) return "Aries";
  return sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
}
