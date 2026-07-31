import NotificationClient from "./NotificationClient";
import { buildPrivateMetadata } from "@/app/lib/seo";

export const metadata = buildPrivateMetadata(
  "Notifications",
  "View your AstroCall notifications for consultations, offers, and account updates."
);

export default function NotificationPage() {
  return <NotificationClient />;
}
