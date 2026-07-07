import UserTalkHomeClient from "./UserTalkHomeClient";

export const metadata = {
  title: "Start Call - AstroCall",
  description: "Start a call with an astrologer",
  robots: { index: false, follow: false },
};

export default function UserTalkHomePage() {
  return <UserTalkHomeClient />;
}
 