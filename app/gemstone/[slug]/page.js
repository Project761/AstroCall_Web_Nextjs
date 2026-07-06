import {
  buildGemstoneMetadata,
  buildGemstoneProductSchema,
  fetchGemstoneBySlug,
  fetchGemstoneRowsBySlug,
  fetchGemstoneSlugs,
} from "@/app/lib/fetchGemstone";
import GemstoneDetailsClient from "./GemstoneDetailsClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchGemstoneSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const gemstone = await fetchGemstoneBySlug(slug);

  if (!gemstone) {
    return {
      title: "Gemstone Not Found | AstroCall",
      description: "The requested gemstone details could not be found.",
    };
  }

  return buildGemstoneMetadata(gemstone, slug);
}

export default async function GemstoneSlugPage({ params }) {
  const { slug } = await params;
  const initialGemstoneRows = await fetchGemstoneRowsBySlug(slug);
  const gemstone = initialGemstoneRows.find((item) => item?.HeadingDescription) || initialGemstoneRows[0];
  const schema = gemstone ? buildGemstoneProductSchema(gemstone, slug) : null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <GemstoneDetailsClient initialGemstoneRows={initialGemstoneRows.length ? initialGemstoneRows : null} />
    </>
  );
}
