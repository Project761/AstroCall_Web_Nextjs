import MyAccountClient from "../MyAccountClient";

export const metadata = {
  title: "My Profile - AstroCall",
  description: "Manage your personal information and preferences",
  robots: { index: false, follow: false },
};

export default function EditProfilePage() {
  return <MyAccountClient />;
}
