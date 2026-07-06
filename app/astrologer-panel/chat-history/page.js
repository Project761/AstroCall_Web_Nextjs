import ChatHistoryClient from "./ChatHistoryClient";

export const metadata = {
  title: "Chat History - AstroCall",
  description: "View your chat history",
  robots: { index: false, follow: false },
};

export default function ChatHistoryPage() {
  return <ChatHistoryClient />;
}
