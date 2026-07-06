import { serverPost, slugifyText } from "./serverApi";

export { slugifyText as blogSlugFromMetaKeywords };

export async function fetchBlogList() {
  const rows = await serverPost("Blog/GetData_Blog", { IsActive: "1" });
  return Array.isArray(rows) ? rows : [];
}

export async function fetchBlogCategories() {
  const rows = await serverPost("BlogCategory/GetData_BlogCategory", { IsActive: "1" });
  return Array.isArray(rows) ? rows : [];
}

export async function fetchBlogBySlug(slug) {
  if (!slug) return null;
  const rows = await serverPost("Blog/GetSingleData_Blog", {
    BlogsID: "0",
    MetaKeywords: `/${slug}`,
  });
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
}

export async function fetchBlogSlugs() {
  const blogs = await fetchBlogList();
  return blogs
    .map((blog) => slugifyText(blog?.MetaKeywords))
    .filter(Boolean);
}

export function getBlogImageUrl(imageUrl) {
  if (!imageUrl) return null;
  return `https://${String(imageUrl).replace(/\\/g, "/")}`;
}

export function buildBlogMetadata(blog, slug) {
  const title = blog?.MetaTitle || blog?.Title || "Astrology Blog";
  const description =
    blog?.MetaDescription ||
    (blog?.ShortDescription || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ||
    "Read expert astrology articles on AstroCall.";
  const canonical = `https://astrocall.live/astrology-blog/${slug}`;
  const image = getBlogImageUrl(blog?.Imageurl);

  return {
    title,
    description,
    keywords: blog?.MetaKeywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: "AstroCall",
      locale: "en_IN",
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function buildBlogPostingSchema(blog, slug) {
  const title = blog?.MetaTitle || blog?.Title || "Astrology Blog";
  const description = blog?.MetaDescription || "";
  const image = getBlogImageUrl(blog?.Imageurl);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: blog?.AuthorName || "AstroCall",
    },
    datePublished: blog?.CreatedDtTm,
    image: image || "https://astrocall.live/default.jpg",
    publisher: {
      "@type": "Organization",
      name: "AstroCall",
      logo: {
        "@type": "ImageObject",
        url: "https://astrocall.live/assets/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://astrocall.live/astrology-blog/${slug}`,
    },
  };
}
