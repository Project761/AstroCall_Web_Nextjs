import SuggestedPujaClient from "./SuggestedPujaClient";

export const metadata = {
  title: "Suggested Puja - AstroCall",
  description: "Suggested puja items",
  robots: { index: false, follow: false },
};

export default function SuggestedPujaPage() {
  return <SuggestedPujaClient />;
}
