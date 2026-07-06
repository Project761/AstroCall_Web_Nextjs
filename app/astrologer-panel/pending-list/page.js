import PendingListClient from "./PendingListClient";

export const metadata = {
  title: "Pending List - AstroCall",
  description: "View pending sessions",
  robots: { index: false, follow: false },
};

export default function PendingListPage() {
  return <PendingListClient />;
}
