import FollowersClient from "./FollowersClient";

export const metadata = {
  title: "Followers - AstroCall",
  description: "View your followers",
  robots: { index: false, follow: false },
};

export default function FollowersPage() {
  return <FollowersClient />;
}
