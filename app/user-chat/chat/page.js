import UserChatSessionClient from "./UserChatSessionClient";

export const metadata = {
  title: "Live Chat - AstroCall",
  description: "Live chat session",
  robots: { index: false, follow: false },
};

export default function UserChatSessionPage() {
  return <UserChatSessionClient />;
}
