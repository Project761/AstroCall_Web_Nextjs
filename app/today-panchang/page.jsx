import TodayPanchangClient from './TodayPanchangClient';
import PageSeoSchemas from '@/app/components/SEO/PageSeoSchemas';
import { buildPageMetadata } from '@/app/lib/seo';

const PATH = '/today-panchang';
const TITLE = "Today's Panchang – Daily Hindu Calendar";
const DESCRIPTION =
  "Check today's Panchang on AstroCall. Accurate daily Hindu calendar with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and auspicious timings for your city.";

export const metadata = buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function TodayPanchang() {
  return (
    <>
      <PageSeoSchemas title={TITLE} description={DESCRIPTION} path={PATH} breadcrumbLabel="Today's Panchang" />
      <TodayPanchangClient />
    </>
  );
}
