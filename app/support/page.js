import SupportClient from "./SupportClient";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/support`;

export const metadata = {
  title: "Support - AstroCall",
  description: "Get help and support for your AstroCall account",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Support - AstroCall",
    description: "Get help and support for your AstroCall account",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support - AstroCall",
    description: "Get help and support for your AstroCall account",
  },
};

export default function SupportPage() {
  return <SupportClient />;
}
 