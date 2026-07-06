import WaitListClient from "./WaitListClient";

export const metadata = {
  title: "Waiting List - AstroCall",
  description: "View your waiting list sessions",
  robots: { index: false, follow: false },
};

export default function WaitListPage() {
  return <WaitListClient />;
}
