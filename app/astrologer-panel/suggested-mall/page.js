import SuggestedMallClient from "./SuggestedMallClient";

export const metadata = {
  title: "Suggested Mall - AstroCall",
  description: "Suggested mall items",
  robots: { index: false, follow: false },
};

export default function SuggestedMallPage() {
  return <SuggestedMallClient />;
}
