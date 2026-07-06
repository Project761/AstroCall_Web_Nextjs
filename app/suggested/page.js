import { redirect } from "next/navigation";

export const metadata = {
  title: "Suggested Items - AstroCall",
  description: "Personalized suggestions",
  robots: { index: false, follow: false },
};

export default function SuggestedPage() {
  redirect("/my-account/suggested");
}
