import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Astrologer Profile - AstroCall",
  description: "Manage your astrologer profile",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
