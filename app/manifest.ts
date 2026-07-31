import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AstroCall — Online Astrology",
    short_name: "AstroCall",
    description:
      "Talk to verified astrologers online. Free kundli, daily horoscope, kundali matching, gemstones, and online puja.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9F1",
    theme_color: "#FF5C00",
    orientation: "portrait-primary",
    lang: "en-IN",
    categories: ["lifestyle", "entertainment"],
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
