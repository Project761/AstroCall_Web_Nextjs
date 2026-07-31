import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";
import JsonLd from "./components/SEO/JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema, buildSchemaGraph } from "./lib/seo";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FF5C00",
};

export const metadata = {
  metadataBase: new URL("https://astrocall.live"),
  title: {
    default: "AstroCall - Talk to India's Best Astrologers Online",
    template: "%s | AstroCall",
  },
  description:
    "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.",
  keywords:
    "astrology, online astrologers, free kundli, daily horoscope, kundali matching, vedic astrology, talk to astrologer, astrology consultation, horoscope prediction, online puja",
  authors: [{ name: "AstroCall", url: "https://astrocall.live/about-us" }],
  creator: "AstroCall Live Services Private Limited",
  publisher: "AstroCall",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: "AstroCall - Talk to India's Best Astrologers Online",
    description:
      "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.",
    url: "https://astrocall.live/",
    siteName: "AstroCall",
    images: [
      {
        url: "https://astrocall.live/images/astrocall-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroCall - Online Astrology Consultation",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroCall - Talk to India's Best Astrologers Online",
    description:
      "Consult India's top astrologers online at AstroCall. Get free kundli, daily horoscope, and predictions for love, career, marriage, and finance via chat or call.",
    images: ["https://astrocall.live/images/astrocall-og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://astrocall.live/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": "#FF5C00",
  },
};

const globalSchema = buildSchemaGraph(buildOrganizationSchema(), buildWebSiteSchema());

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${plusJakarta.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://api.astrocall.live" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://liveapi.astrocall.live" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.astrocall.live" />
        <link rel="dns-prefetch" href="https://liveapi.astrocall.live" />
      </head>
      <body className="flex min-h-full flex-col font-body">
        <JsonLd data={globalSchema} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
