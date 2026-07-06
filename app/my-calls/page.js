import MyCallsClient from "./MyCallsClient";

export const metadata = {
  title: "My Calls - AstroCall",
  description: "View your call history with astrologers",
  robots: { index: false, follow: false },
};

export default function MyCallsPage() {
  return <MyCallsClient />;
}
