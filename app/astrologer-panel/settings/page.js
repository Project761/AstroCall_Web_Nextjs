import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings - AstroCall",
  description: "Astrologer panel settings",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsClient />;
}
