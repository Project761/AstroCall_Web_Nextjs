import MyGemstoneClient from "./MyGemstoneClient";

export const metadata = {
  title: "My Gemstone Orders - AstroCall",
  description: "Track your gemstone orders",
  robots: { index: false, follow: false },
};

export default function MyGemstonePage() {
  return <MyGemstoneClient />;
}
