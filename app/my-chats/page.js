import MyChatsClient from "./MyChatsClient";

export const metadata = {
  title: "My Chats - AstroCall",
  description: "View your chat history with astrologers",
  robots: { index: false, follow: false },
};

export default function MyChatsPage() {
  return <MyChatsClient />;
}
