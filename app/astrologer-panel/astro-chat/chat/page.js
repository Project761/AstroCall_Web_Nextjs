import AstroChatSessionClient from "./AstroChatSessionClient";

export const metadata = {
  title: "Live Chat - AstroCall",
  description: "Live chat session",
  robots: { index: false, follow: false },
};

export default function AstroChatSessionPage() {
  return <AstroChatSessionClient />;
}
