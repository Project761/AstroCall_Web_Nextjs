import BankDetailsClient from "./BankDetailsClient";

export const metadata = {
  title: "Bank Details - AstroCall",
  description: "Manage astrologer bank details",
  robots: { index: false, follow: false },
};

export default function BankDetailsPage() {
  return <BankDetailsClient />;
}
