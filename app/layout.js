import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";

const plusJakarta = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export const metadata = {
    title: {
        default: "AstroCall - Talk to India's Best Astrologers Online",
        template: "%s | AstroCall"
    },
    description: "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.",
    keywords: "astrology, online astrologers, free kundli, daily horoscope, kundali matching, vedic astrology, talk to astrologer, astrology consultation, horoscope prediction, online puja",
    authors: [{ name: "AstroCall" }],
    openGraph: {
        title: "AstroCall - Talk to India's Best Astrologers Online",
        description: "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.",
        url: "https://astrocall.live/",
        siteName: "AstroCall",
        images: [
            {
                url: "https://astrocall.live/images/astrocall-og-image.jpg",
                width: 1200,
                height: 630,
                alt: "AstroCall - Online Astrology Consultation"
            }
        ],
        locale: "en_IN",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "AstroCall - Talk to India's Best Astrologers Online",
        description: "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.",
        images: ["https://astrocall.live/images/astrocall-og-image.jpg"]
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    metadataBase: new URL("https://astrocall.live"),
    other: {
        'theme-color': '#F97316',
        'msapplication-TileColor': '#F97316',
    }
};

export default function RootLayout({ children, }) {
    return (<html lang="en" className={`${plusJakarta.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>);
}
