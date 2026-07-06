import UserChatClient from "./UserChatClient";

export const metadata = {
  title: "User Chat - AstroCall",
  description: "Chat with astrologers",
  robots: { index: false, follow: false },
};

export default function UserChatPage() {
  return <UserChatClient />;
}
