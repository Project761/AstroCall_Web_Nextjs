import CheckoutPaymentClient from "./CheckoutPaymentClient";

export const metadata = {
  title: "Checkout Payment - AstroCall",
  description: "Complete your gemstone purchase",
  robots: { index: false, follow: false },
};

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentClient />;
}
