import MyReelsClient from "./MyReelsClient";

export const metadata = {
  title: "My Reels - AstroCall",
  description: "Manage your reels",
  robots: { index: false, follow: false },
};

export default function MyReelsPage() {
  return <MyReelsClient />;
}
