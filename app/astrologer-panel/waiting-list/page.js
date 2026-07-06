import WaitingListClient from "./WaitingListClient";

export const metadata = {
  title: "Waiting List - AstroCall",
  description: "Manage waiting list",
  robots: { index: false, follow: false },
};

export default function WaitingListPage() {
  return <WaitingListClient />;
}
