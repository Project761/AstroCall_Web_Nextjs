import { format } from "date-fns";
import { serverPost, capitalizeSign } from "./serverApi";

export async function fetchHoroscopeData(
  sign,
  { type = "daily", state = "current", language = "English" } = {}
) {
  if (!sign) return null;

  try {
    const rows = await serverPost("Chat/GetData_Horoscope", {
      Sign: capitalizeSign(sign),
      Date: format(new Date(), "MM/dd/yyyy"),
      Type: type,
      State: state,
      lan: language,
    });

    if (!rows?.[0]?.Response) return null;

    const parsed = JSON.parse(rows[0].Response);
    const data = parsed?.data || parsed;

    let finalData = {};
    let dateFinal = {};

    switch (type) {
      case "daily":
        finalData = data.prediction || data;
        break;
      case "week":
        finalData = data.weekly_horoscope || data;
        dateFinal = data.week || {};
        break;
      case "month":
        finalData = data.monthly_horoscope || data;
        dateFinal = data.month || {};
        break;
      case "year":
        finalData = data.yearly_horoscope || data;
        dateFinal = data.year || {};
        break;
      default:
        break;
    }

    return {
      sign: data.sign || parsed.sign || capitalizeSign(sign),
      ...finalData,
      special: data.special || parsed.special || null,
      dateLabel: dateFinal,
    };
  } catch (error) {
    console.error("fetchHoroscopeData error:", error);
    return null;
  }
}

export function buildHoroscopeSignMetadata(sign, timeframe = "daily") {
  const signName = capitalizeSign(sign);
  const timeframeLabel = timeframe.charAt(0).toUpperCase() + timeframe.slice(1);
  const title = `${signName} ${timeframeLabel} Horoscope - Daily Predictions & Guidance | AstroCall`;
  const description = `Get accurate ${signName} ${timeframe} horoscope predictions for love, career, health, and finance. Read your ${signName} horoscope today.`;
  const canonical = `https://astrocall.live/daily-horoscope/${signName.toLowerCase()}`;

  return {
    title,
    description,
    keywords: `${signName} horoscope, ${signName} ${timeframe} horoscope, ${signName} predictions, ${signName} astrology, zodiac sign ${signName}`,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "AstroCall",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildHoroscopeWebPageSchema(sign, timeframe = "daily") {
  const signName = capitalizeSign(sign);
  const timeframeLabel = timeframe.charAt(0).toUpperCase() + timeframe.slice(1);
  const title = `${signName} ${timeframeLabel} Horoscope - Daily Predictions & Guidance | AstroCall`;
  const description = `Get accurate ${signName} ${timeframe} horoscope predictions for love, career, health, and finance. Read your ${signName} horoscope today.`;
  const url = `https://astrocall.live/daily-horoscope/${signName.toLowerCase()}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
  };
}
