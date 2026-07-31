import { redirect } from "next/navigation";

export const metadata = {
  title: "Free Kundli - AstroCall",
  description: "View your free kundli details on AstroCall",
  robots: { index: false, follow: false },
};

export default async function FreeKundliRedirect({ params }) {
  const { id } = await params;
  redirect(`/freekundli/basic-detail?FreekundliID=${encodeURIComponent(id)}`);
}
 