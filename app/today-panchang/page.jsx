import TodayPanchangClient from './TodayPanchangClient';

// SEO Metadata for Next.js
export const metadata = {
    title: "Today's Panchang – Daily Hindu Calendar | AstroCall Live",
    description: "Check today's Panchang on AstroCall Live. Get accurate daily Hindu calendar with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and auspicious timings for every day.",
    openGraph: {
        title: "Today's Panchang – Daily Hindu Calendar | AstroCall Live",
        description: "Check today's Panchang on AstroCall Live. Get accurate daily Hindu calendar with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and auspicious timings for every day.",
        url: "https://astrocall.live/today-panchang",
        type: "website",
    },
    alternates: {
        canonical: "https://astrocall.live/today-panchang",
    },
};

export default function TodayPanchang() {
    return <TodayPanchangClient />;
}
