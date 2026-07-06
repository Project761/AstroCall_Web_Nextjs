import CreateReelClient from "./CreateReelClient";

export const metadata = {
  title: "Create Reel - AstroCall",
  description: "Create a new astrology reel",
  robots: { index: false, follow: false },
};

export default function CreateReelPage() {
  return <CreateReelClient />;
}
