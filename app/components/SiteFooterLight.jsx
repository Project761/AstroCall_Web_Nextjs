import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCommentDots,
  FaVideo,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import { ORANGE, CREAM, CREAM_ALT } from "@/app/lib/siteTheme";

const COLUMNS = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Daily Horoscope", href: "/daily-horoscope" },
    { label: "Chat with Astrologer", href: "/chat-to-astrologers" },
    { label: "Talk to Astrologer", href: "/talk-to-astrologers" },
    { label: "Online Puja", href: "/online-puja" },
    { label: "Gemstones", href: "/gemstone" },
    { label: "Astrology Blog", href: "/astrology-blog" },
    { label: "Reels", href: "/reels" },
    { label: "Plans & Recharge", href: "/plans" },
  ],
  "Free Tools": [
    { label: "Free Kundli", href: "/freekundli" },
    { label: "Kundli Matching", href: "/kundali-matching" },
    { label: "Love Calculator", href: "/love-calculator" },
    { label: "Today Panchang", href: "/today-panchang" },
    { label: "Muhurat", href: "/Muhurat" },
    { label: "Vrat & Upvaas", href: "/VratUpvaas" },
    { label: "Vedic Astrology", href: "/VedicAstrology" },
    { label: "Numerology", href: "/Numerology" },
    { label: "Tarot Reading", href: "/TarotReading" },
    { label: "Palm Reading", href: "/PalmReading" },
    { label: "AI Astrologer", href: "/AIAstrologer" },
    { label: "Upcoming Festivals", href: "/Upcomingfestival" },
  ],
  Consultations: [
    { label: "Love & Relationships", href: "/LoveAndRelation" },
    { label: "Marital Life", href: "/MaritalLife" },
    { label: "Career & Jobs", href: "/CareersAndJob" },
    { label: "Break Up & Divorce", href: "/BreakupAndDivorce" },
    { label: "Kids & Education", href: "/KidsAndEducation" },
    { label: "Cheating & Affairs", href: "/Cheating" },
    { label: "Relationship Counseling", href: "/RelationCounceling" },
  ],
  "Support & Legal": [
    { label: "Help & Support", href: "/support" },
    { label: "FAQs", href: "/#faq" },
    { label: "Astrologer Login", href: "/astrologer-login" },
    { label: "Join as Astrologer", href: "/astrologer-login" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/TermsOfUse" },
    { label: "Refund Policy", href: "/RefundCancellation" },
    { label: "Disclaimer", href: "/Disclaimer" },
    { label: "Cookie Policy", href: "/CookiePolicy" },
    { label: "Store Refund Policy", href: "/StoreRefundPolicy" },
    { label: "Shipping Policy", href: "/ShippingDeliveryPolicy" },
  ],
};

const STATS = [
  { value: "20 Lakh+", label: "Happy Customers" },
  { value: "1500+", label: "Astrologers" },
  { value: "5 Crore+", label: "Mins Consulted" },
  { value: "4.9★", label: "Avg. Rating" },
];

const ACTIONS = [
  { icon: FaCommentDots, label: "Chat Now", href: "/chat-to-astrologers" },
  { icon: FaPhoneAlt, label: "Call Now", href: "/talk-to-astrologers" },
  { icon: FaVideo, label: "Video Call", href: "/talk-to-astrologers" },
  { icon: FaCalendarAlt, label: "Book Puja", href: "/online-puja" },
];

const SOCIALS = [
  { icon: FaFacebookF, href: "https://www.facebook.com/share/1AZyAfVdjE/", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/astrocall.live", label: "Instagram" },
  { icon: FaYoutube, href: "https://www.youtube.com", label: "YouTube" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
];

function LinkList({ links }) {
  return (
    <ul className="space-y-2 sm:space-y-2.5">
      {links.map((l) => (
        <li key={l.label}>
          <Link
            href={l.href}
            className="font-body inline-block cursor-pointer text-[13px] text-gray-600 transition hover:translate-x-0.5 hover:text-[#FF5C00]"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="hidden md:block">
      <h3 className="font-heading mb-4 text-sm font-bold text-[#1A1A1A]">
        <span className="inline-block border-b-2 border-[#FF5C00] pb-1">{title}</span>
      </h3>
      <LinkList links={links} />
    </div>
  );
}

function FooterAccordion({ title, links }) {
  return (
    <details className="group border-b border-orange-100/80 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="font-heading text-sm font-bold text-[#1A1A1A]">{title}</span>
        <FaChevronDown className="text-xs text-gray-400 transition group-open:rotate-180" />
      </summary>
      <div className="pb-4 pl-1">
        <LinkList links={links} />
      </div>
    </details>
  );
}

export default function SiteFooterLight() {
  return (
    <footer className="mt-auto border-t border-orange-100/80">
      {/* Quick actions — mobile 2x2, desktop 4 col */}
      <div className="bg-gradient-to-r from-[#FF5C00] to-[#FF7A33]">
        <div className="main-container">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/15 sm:grid-cols-4 sm:divide-y-0">
            {ACTIONS.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-heading flex cursor-pointer items-center justify-center gap-2 px-2 py-3.5 text-xs font-semibold text-white transition hover:bg-black/10 sm:py-4 sm:text-sm"
              >
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main body */}
      <div style={{ backgroundColor: CREAM }}>
        <div className="main-container py-8 sm:py-10 md:py-12">
          <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_4px_24px_rgba(255,92,0,0.06)] sm:rounded-3xl">
            <div className="p-5 sm:p-7 lg:p-9">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
                {/* Brand */}
                <div className="lg:col-span-3">
                  <Link href="/" className="inline-flex items-center gap-3">
                    <Image
                      src="/images/logo1.webp"
                      alt="AstroCall"
                      width={48}
                      height={48}
                      className="h-11 w-11 rounded-xl shadow-sm sm:h-12 sm:w-12"
                    />
                    <div>
                      <p className="font-heading text-xl font-bold leading-none text-[#FF5C00] sm:text-2xl">
                        AstroCall
                      </p>
                      <p className="font-body mt-1 text-[11px] text-gray-400">
                        Your Guide to a Better Tomorrow
                      </p>
                    </div>
                  </Link>

                  <p className="font-body mt-4 max-w-sm text-[13px] leading-relaxed text-gray-600">
                    India&apos;s trusted platform for Vedic astrology — chat, call, or consult verified astrologers 24/7.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {SOCIALS.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5C00] text-white shadow-sm transition hover:scale-105 hover:bg-[#E85500]"
                      >
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Mobile accordions */}
                <div className="md:hidden">
                  {Object.entries(COLUMNS).map(([title, links]) => (
                    <FooterAccordion key={title} title={title} links={links} />
                  ))}
                </div>

                {/* Desktop link columns */}
                <div className="hidden gap-6 md:grid md:grid-cols-2 lg:col-span-5 lg:grid-cols-2 xl:grid-cols-4">
                  {Object.entries(COLUMNS).map(([title, links]) => (
                    <FooterColumn key={title} title={title} links={links} />
                  ))}
                </div>

                {/* Contact */}
                <div className="lg:col-span-4">
                  <div
                    className="h-full rounded-2xl border border-orange-100 p-4 sm:p-5"
                    style={{ backgroundColor: CREAM_ALT }}
                  >
                    <h3 className="font-heading mb-4 text-sm font-bold text-[#1A1A1A]">
                      <span className="inline-block border-b-2 border-[#FF5C00] pb-1">Contact Us</span>
                    </h3>
                    <ul className="space-y-3.5 sm:space-y-4">
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF5C00] shadow-sm">
                          <FaPhoneAlt size={13} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Phone
                          </p>
                          <p className="font-body text-sm font-semibold text-[#333]">+91 99999 99999</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF5C00] shadow-sm">
                          <FaEnvelope size={13} />
                        </span>
                        <div className="min-w-0 break-all">
                          <p className="font-heading text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Email
                          </p>
                          <p className="font-body text-sm font-semibold text-[#333]">support@astrocall.live</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#FF5C00] shadow-sm">
                          <FaClock size={13} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Hours
                          </p>
                          <p className="font-body text-sm font-semibold text-[#333]">Mon – Sun, 9 AM – 9 PM</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 border-t border-orange-100 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="border-b border-r border-orange-100 bg-[#FFFBF7] px-3 py-4 text-center last:border-r-0 sm:border-b-0 sm:px-4 sm:py-5 nth-[2n]:border-r-0 sm:nth-[2n]:border-r"
                >
                  <p className="font-heading text-base font-bold text-[#FF5C00] sm:text-lg md:text-xl">
                    {s.value}
                  </p>
                  <p className="font-body mt-0.5 text-[10px] text-gray-500 sm:text-[11px]">{s.label}</p>
                </div>
              ))}
            </div>

            {/* App download */}
            <div className="flex flex-col items-center gap-4 border-t border-orange-100 px-5 py-5 sm:flex-row sm:justify-between sm:px-8 sm:py-6">
              <div className="text-center sm:text-left">
                <p className="font-heading text-base font-bold text-[#1A1A1A] sm:text-lg">
                  Download the AstroCall App
                </p>
                <p className="font-body mt-1 text-xs text-gray-500">
                  Horoscope, Kundli, Chat &amp; Call — all in one app
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/wait-list" className="transition hover:opacity-90">
                  <Image
                    src="/images/google-play-badge.svg"
                    alt="Get it on Google Play"
                    width={130}
                    height={40}
                    className="h-9 w-auto sm:h-10"
                  />
                </Link>
                <Link href="/wait-list" className="transition hover:opacity-90">
                  <Image
                    src="/images/app-store-apple.svg"
                    alt="Download on App Store"
                    width={130}
                    height={40}
                    className="h-9 w-auto sm:h-10"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#1A1A1A] px-4 py-4 pb-[88px] sm:pb-4 lg:pb-4">
        <div className="main-container flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-4">
          <p className="font-body text-center text-[11px] text-gray-400 sm:text-left sm:text-[12px]">
            © {new Date().getFullYear()} AstroCall Live Services Private Limited. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {[
              { label: "Privacy", href: "/privacy-policy" },
              { label: "Terms", href: "/TermsOfUse" },
              { label: "Disclaimer", href: "/Disclaimer" },
              { label: "Cookies", href: "/CookiePolicy" },
              { label: "Support", href: "/support" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-body text-[11px] text-gray-500 transition hover:text-white sm:text-[12px]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
