import MyFavoritesClient from "./MyFavoritesClient";

export const metadata = {
  title: "My Favorites - AstroCall",
  description: "View and manage your favorite astrologers",
  robots: { index: false, follow: false },
};

export default function MyFavoritesPage() {
  return <MyFavoritesClient />;
}
