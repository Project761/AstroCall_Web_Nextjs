import {
  buildBlogMetadata,
  buildBlogPostingSchema,
  fetchBlogBySlug,
  fetchBlogSlugs,
} from "@/app/lib/fetchBlog";
import BlogDetailsClient from "./BlogDetailsClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | AstroCall",
      description: "The requested astrology blog article could not be found.",
    };
  }

  return buildBlogMetadata(blog, slug);
}

export default async function BlogSlugPage({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);
  const schema = blog ? buildBlogPostingSchema(blog, slug) : null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <BlogDetailsClient />
    </>
  );
}
