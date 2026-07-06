import MyFollowingClient from "./MyFollowingClient";

export const metadata = {
  title: "My Following - AstroCall",
  description: "Astrologers you follow on AstroCall",
  robots: { index: false, follow: false },
};

export default function MyFollowingPage() {
  return <MyFollowingClient />;
}
