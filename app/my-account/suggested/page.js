import MyAccountSuggestedClient from "./MyAccountSuggestedClient";

export const metadata = {
  title: "Suggested Items - AstroCall",
  description: "Personalized suggestions for your account",
  robots: { index: false, follow: false },
};

export default function MyAccountSuggestedPage() {
  return <MyAccountSuggestedClient />;
}
