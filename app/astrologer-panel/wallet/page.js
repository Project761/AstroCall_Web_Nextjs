import AstrologerWalletClient from "./AstrologerWalletClient";

export const metadata = {
  title: "Astrologer Wallet - AstroCall",
  description: "Manage your earnings wallet",
  robots: { index: false, follow: false },
};

export default function AstrologerWalletPage() {
  return <AstrologerWalletClient />;
}
