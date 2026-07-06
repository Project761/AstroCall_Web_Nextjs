import AstroChatClient from "./AstroChatClient";

export const metadata = {
  title: "Astrologer Chat - AstroCall",
  description: "Chat with users",
  robots: { index: false, follow: false },
};

export default function AstroChatPage() {
  return <AstroChatClient />;
}
