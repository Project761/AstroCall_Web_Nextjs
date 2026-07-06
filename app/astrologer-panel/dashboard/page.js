import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Astrologer Dashboard - AstroCall",
  description:
    "Manage your astrology consultations, track earnings, and monitor your online status on AstroCall dashboard",
  robots: { index: false, follow: false },
};

export default function AstrologerDashboardPage() {
  return <DashboardClient />;
}
