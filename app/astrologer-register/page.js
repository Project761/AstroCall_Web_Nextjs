import AstrologerRegisterClient from "./AstrologerRegisterClient";

const SITE = "https://astrocall.live";
const CANONICAL = "https://astrocall.live/astrologer-login";

export const metadata = {
  title: "Become an Astrologer - AstroCall",
  description: "Register as an astrologer on AstroCall",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Become an Astrologer - AstroCall",
    description: "Register as an astrologer on AstroCall",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Become an Astrologer - AstroCall",
    description: "Register as an astrologer on AstroCall",
  },
  robots: { index: true, follow: true },
};

export default function AstrologerRegisterPage() {
  return <AstrologerRegisterClient />;
}
