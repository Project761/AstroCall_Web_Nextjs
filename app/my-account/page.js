import MyDashboardClient from "./MyDashboardClient";

export const metadata = {
  title: "My Dashboard - AstroCall",
  description: "Your AstroCall user dashboard",
  robots: { index: false, follow: false },
};

export default function MyAccountPage() {
  return <MyDashboardClient />;
}
