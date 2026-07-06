import ReviewsClient from "./ReviewsClient";

export const metadata = {
  title: "Reviews - AstroCall",
  description: "View customer reviews",
  robots: { index: false, follow: false },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
