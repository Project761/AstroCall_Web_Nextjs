import PlansClient from "./PlansClient";

const SITE = "https://astrocall.live";
const CANONICAL = "https://astrocall.live/plans";

export const metadata = {
  title: "Recharge Plans - AstroCall",
  description: "Explore astrology consultation and wallet recharge plans",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Recharge Plans - AstroCall",
    description: "Explore astrology consultation and wallet recharge plans",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN", 
  },
  twitter: {
    card: "summary_large_image",
    title: "Recharge Plans - AstroCall",
    description: "Explore astrology consultation and wallet recharge plans",
  },
  robots: { index: true, follow: true },
};

export default function PlansPage() {
  return <PlansClient />;
}
