import HoroscopeSignClient from "./[sign]/HoroscopeSignClient";
import { fetchHoroscopeData } from "@/app/lib/fetchHoroscope";
import "./styles.css";

const SITE = "https://astrocall.live";
const CANONICAL = `${SITE}/daily-horoscope`;

export const metadata = {
  title: "Today's Horoscope – Daily Astrology Predictions",
  description: "Read your free daily horoscope on AstroCall.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Today's Horoscope – Daily Astrology Predictions",
    description: "Read your free daily horoscope on AstroCall.",
    url: CANONICAL,
    type: "website",
    siteName: "AstroCall",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Today's Horoscope – Daily Astrology Predictions",
    description: "Read your free daily horoscope on AstroCall.",
  },
};

export default async function DailyHoroscopePage() {
  const initialHoroscopeData = await fetchHoroscopeData("aries", {
    type: "daily",
    state: "current",
    language: "English",
  });

  return (
    <HoroscopeSignClient
      initialHoroscopeData={initialHoroscopeData}
      defaultSign="aries"
    />
  );
}
