import {
  buildAstrologerPersonSchema,
  buildAstrologerProfileMetadata,
  fetchAstrologerBySlug,
  fetchAstrologerSlugs,
} from "@/app/lib/fetchAstrologer";
import TalkAstrologerProfileClient from "./TalkAstrologerProfileClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchAstrologerSlugs();
  return slugs.map((name) => ({ name }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const astrologer = await fetchAstrologerBySlug(name);

  if (!astrologer) { 
    return {
      title: "Astrologer Profile | AstroCall",
      description: "Consult with expert astrologers on AstroCall.",
    };
  }

  return buildAstrologerProfileMetadata(astrologer, name, "/talk-to-astrologers");
}

export default async function TalkAstrologerProfilePage({ params }) {
  const { name } = await params;
  const astrologer = await fetchAstrologerBySlug(name);
  const schema = astrologer
    ? buildAstrologerPersonSchema(astrologer, name, "/talk-to-astrologers")
    : null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <TalkAstrologerProfileClient />
    </>
  );
}
