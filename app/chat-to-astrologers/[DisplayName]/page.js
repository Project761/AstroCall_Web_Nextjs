import {
  buildAstrologerPersonSchema,
  buildAstrologerProfileMetadata,
  fetchAstrologerBySlug,
  fetchAstrologerSlugs,
} from "@/app/lib/fetchAstrologer";
import ChatAstrologerProfileClientWrapper from "./ChatAstrologerProfileClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchAstrologerSlugs();
  return slugs.map((DisplayName) => ({ DisplayName }));
}

export async function generateMetadata({ params }) {
  const { DisplayName } = await params;
  const astrologer = await fetchAstrologerBySlug(DisplayName);

  if (!astrologer) {
    return {
      title: "Astrologer Profile | AstroCall",
      description: "Consult with expert astrologers on AstroCall.",
    };
  }

  return buildAstrologerProfileMetadata(astrologer, DisplayName, "/chat-to-astrologers");
}

export default async function ChatAstrologerProfilePage({ params }) {
  const { DisplayName } = await params;
  const astrologer = await fetchAstrologerBySlug(DisplayName);
  const schema = astrologer
    ? buildAstrologerPersonSchema(astrologer, DisplayName, "/chat-to-astrologers")
    : null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      <ChatAstrologerProfileClientWrapper />
    </>
  );
}
