import UserChatHomeClient from "./UserChatHomeClient";

export const metadata = {
  title: "Start Chat - AstroCall",
  description: "Start a chat with an astrologer",
  robots: { index: false, follow: false },
};

export default function UserChatHomePage() {
  return <UserChatHomeClient />;
}
