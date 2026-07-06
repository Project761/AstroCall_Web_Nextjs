import CheckoutAddressClient from "./CheckoutAddressClient";

export const metadata = {
  title: "Checkout Address - AstroCall",
  description: "Enter delivery address for your order",
  robots: { index: false, follow: false },
};

export default function CheckoutAddressPage() {
  return <CheckoutAddressClient />;
}
