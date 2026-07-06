import { HOROSCOPE_SIGNS } from "@/app/lib/siteConstants";
import {
  buildHoroscopeSignMetadata,
  buildHoroscopeWebPageSchema,
  fetchHoroscopeData,
} from "@/app/lib/fetchHoroscope";
import HoroscopeSignClient from "./HoroscopeSignClient";

export const revalidate = 3600;

export async function generateStaticParams() {
  return HOROSCOPE_SIGNS.map((sign) => ({ sign }));
}

export async function generateMetadata({ params }) {
  const { sign } = await params;
  return buildHoroscopeSignMetadata(sign, "daily");
}

export default async function HoroscopeSignPage({ params }) {
  const { sign } = await params;
  const schema = buildHoroscopeWebPageSchema(sign, "daily");
  const initialHoroscopeData = await fetchHoroscopeData(sign, {
    type: "daily",
    state: "current",
    language: "English",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HoroscopeSignClient initialHoroscopeData={initialHoroscopeData} />
    </>
  );
}
