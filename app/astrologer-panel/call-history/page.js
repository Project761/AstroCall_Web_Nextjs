import CallHistoryClient from "./CallHistoryClient";

export const metadata = {
  title: "Call History - AstroCall",
  description: "View your call history",
  robots: { index: false, follow: false },
};

export default function CallHistoryPage() {
  return <CallHistoryClient />;
}
