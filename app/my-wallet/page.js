import MyWalletClient from "./MyWalletClient";

export const metadata = {
  title: "My Wallet - AstroCall",
  description: "Manage your AstroCall wallet balance and transactions",
  robots: { index: false, follow: false },
};

export default function MyWalletPage() {
  return <MyWalletClient />;
}
