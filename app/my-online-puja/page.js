import MyOnlinePujaClient from "./MyOnlinePujaClient";

export const metadata = {
  title: "My Online Puja - AstroCall",
  description: "View your online puja bookings and spiritual services",
  robots: { index: false, follow: false },
};

export default function MyOnlinePujaPage() {
  return <MyOnlinePujaClient />;
}
