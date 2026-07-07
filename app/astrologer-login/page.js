import AstrologerLoginClient from "./AstrologerLoginClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/astrologer-login`;

export const metadata = {
  title: "Astrologer Login - AstroCall",
  description: "Login to your astrologer account and start consultations",
  alternates: { canonical: CANONICAL },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Astrologer Login - AstroCall", 
    description: "Login to your astrologer account and start consultations",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrologer Login - AstroCall",
    description: "Login to your astrologer account and start consultations",
  },
};

const loginSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Astrologer Login - AstroCall",
  description: "Login to your astrologer account and start consultations",
  url: CANONICAL,
};

export default function AstrologerLoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loginSchema) }}
      />
      <AstrologerLoginClient />
    </>
  );
}
