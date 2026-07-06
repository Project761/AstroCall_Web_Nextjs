import {
  buildPujaMetadata,
  buildPujaServiceSchema,
  fetchPujaBySlug,
  fetchPujaRowsBySlug,
  fetchPujaSlugs,
} from "@/app/lib/fetchPuja";
import OnlinePujaDetailsClient from "./OnlinePujaDetailsClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchPujaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const puja = await fetchPujaBySlug(slug);

  if (!puja) {
    return {
      title: "Online Puja Not Found | AstroCall",
      description: "The requested online puja details could not be found.",
    };
  }

  return buildPujaMetadata(puja, slug);
}

export default async function OnlinePujaSlugPage({ params }) {
  const { slug } = await params;
  const initialPujaRows = await fetchPujaRowsBySlug(slug);
  const puja = initialPujaRows.find((item) => item?.PujaName) || initialPujaRows[0];
  const schema = puja ? buildPujaServiceSchema(puja, slug) : null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <OnlinePujaDetailsClient initialPujaRows={initialPujaRows.length ? initialPujaRows : null} />
    </>
  );
}
