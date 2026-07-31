"use client";

import { useEffect, useState } from "react";
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
  FaMapMarkerAlt,
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
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact" },
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
    { label: "Contact Us", href: "/contact" },
    { label: "Help & Support", href: "/support" },
    { label: "FAQs", href: "/#faq" },
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
  { value: "1500+", label: "Verified Astrologers" },
  { value: "5 Crore+", label: "Minutes Consulted" },
  { value: "4.9★", label: "Average Rating" },
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

const CONTACT = [
  { icon: FaPhoneAlt, label: "Call Support", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: FaEnvelope, label: "Email Us", value: "support@astrocall.live", href: "mailto:support@astrocall.live" },
  { icon: FaClock, label: "Available", value: "24×7 — Chat, Call & Puja", href: null },
  { icon: FaMapMarkerAlt, label: "Location", value: "India — Pan India Service", href: null },
];

function LinkList({ links }) {
  return (
    <ul className="space-y-2">
      {links.map((l) => (
        <li key={l.label}>
          <Link
            href={l.href}
            className="font-body inline-block text-[13px] text-gray-600 transition hover:translate-x-0.5 hover:text-[#FF5C00]"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterColumn({ title, links, astroPanelHref }) {
  const columnLinks =
    title === "Support & Legal"
      ? [
          ...links.slice(0, 2),
          { label: "Astrologer Login", href: astroPanelHref },
          { label: "Join as Astrologer", href: astroPanelHref },
          ...links.slice(2),
        ]
      : links;

  return (
    <div className="hidden md:block">
      <h3 className="font-heading mb-3 text-sm font-bold text-[#1A1A1A]">
        <span className="inline-block border-b-2 pb-1" style={{ borderColor: ORANGE }}>
          {title}
        </span>
      </h3>
      <LinkList links={columnLinks} />
    </div>
  );
}

function FooterAccordion({ title, links, astroPanelHref }) {
  const columnLinks =
    title === "Support & Legal"
      ? [
          ...links.slice(0, 2),
          { label: "Astrologer Login", href: astroPanelHref },
          { label: "Join as Astrologer", href: astroPanelHref },
          ...links.slice(2),
        ]
      : links;

  return (
    <details className="group border-b border-orange-100/80 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="font-heading text-sm font-bold text-[#1A1A1A]">{title}</span>
        <FaChevronDown className="text-xs text-gray-400 transition group-open:rotate-180" />
      </summary>
      <div className="pb-4 pl-1">
        <LinkList links={columnLinks} />
      </div>
    </details>
  );
}

export default function SiteFooterLight({ showAppDownload = true, mobileBottomPad = false }) {
  const [astroPanelHref, setAstroPanelHref] = useState("/astrologer-login");

  useEffect(() => {
    const id = localStorage.getItem("AstroLoginId");
    setAstroPanelHref(id ? "/astrologer-panel/dashboard" : "/astrologer-login");
  }, []);

  return (
    <footer className="mt-auto border-t border-orange-100/60">
      {/* Quick actions — matches WhyAstrocall trust bar */}
      <section className="py-0">
        <div className="main-container py-4 sm:py-5">
          <div className="overflow-hidden rounded-xl bg-gradient-to-r from-[#FF5A00] via-[#FF6400] to-[#FF7A00] shadow-lg sm:rounded-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {ACTIONS.map(({ icon: Icon, label, href }, index) => (
                <Link
                  key={label}
                  href={href}
                  className={`font-heading flex items-center justify-center gap-2.5 px-3 py-4 text-xs font-semibold text-white transition hover:bg-white/10 sm:py-5 sm:text-sm ${
                    index !== ACTIONS.length - 1 ? "sm:border-r sm:border-white/20" : ""
                  } ${index % 2 === 0 ? "border-r border-white/15" : ""} ${index < 2 ? "border-b border-white/15 sm:border-b-0" : ""}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm sm:h-10 sm:w-10">
                    <Icon size={15} />
                  </span>
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main body */}
      <div style={{ backgroundColor: CREAM }}>
        <div className="main-container py-8 sm:py-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Brand + contact */}
            <div className="space-y-8 lg:col-span-4">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <Image
                    src="/images/logo1.webp"
                    alt="AstroCall"
                    width={48}
                    height={48}
                    className="h-11 w-11 rounded-xl shadow-sm sm:h-12 sm:w-12"
                  />
                  <div>
                    <p className="font-heading text-xl font-bold leading-none sm:text-2xl" style={{ color: ORANGE }}>
                      AstroCall
                    </p>
                    <p className="font-body mt-1 text-[11px] text-gray-400">Your Guide to a Better Tomorrow</p>
                  </div>
                </Link>

                <p className="font-body mt-4 max-w-sm text-[13px] leading-relaxed text-gray-600">
                  India&apos;s trusted platform for Vedic astrology — chat, call, or consult verified astrologers anytime,
                  anywhere.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-105"
                      style={{ backgroundColor: ORANGE }}
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact card */}
              <div
                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
                style={{ boxShadow: "0 4px 24px rgba(255,92,0,0.06)" }}
              >
                <h3 className="font-heading mb-4 text-sm font-bold text-[#1A1A1A]">
                  <span className="inline-block border-b-2 pb-1" style={{ borderColor: ORANGE }}>
                    Contact Us
                  </span>
                </h3>
                <ul className="space-y-3">
                  {CONTACT.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: CREAM_ALT, color: ORANGE }}
                      >
                        <Icon size={13} />
                      </span>
                      <div>
                        <p className="font-body text-[11px] font-medium text-gray-400">{label}</p>
                        {href ? (
                          <a href={href} className="font-body text-[13px] font-semibold text-[#1A1A1A] hover:text-[#FF5C00]">
                            {value}
                          </a>
                        ) : (
                          <p className="font-body text-[13px] font-semibold text-[#1A1A1A]">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="font-heading mt-4 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: ORANGE }}
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8">
              <div className="md:hidden">
                {Object.entries(COLUMNS).map(([title, links]) => (
                  <FooterAccordion key={title} title={title} links={links} astroPanelHref={astroPanelHref} />
                ))}
              </div>

              <div className="hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6 xl:grid-cols-4 xl:p-7">
                {Object.entries(COLUMNS).map(([title, links]) => (
                  <FooterColumn key={title} title={title} links={links} astroPanelHref={astroPanelHref} />
                ))}
              </div>
            </div>
          </div>

          {/* Stats — matches homepage StatsBar */}
          <div
            className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-orange-100 px-4 py-6 text-center sm:grid-cols-4 sm:gap-6 sm:px-6"
            style={{ backgroundColor: CREAM_ALT }}
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-lg font-extrabold sm:text-xl md:text-2xl" style={{ color: ORANGE }}>
                  {s.value}
                </p>
                <p className="font-body mt-1 text-[10px] text-gray-500 sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App download — hidden on homepage (already has AppDownloadBlock) */}
      {showAppDownload && (
        <section className="py-6 sm:py-8" style={{ backgroundColor: CREAM }}>
          <div className="main-container">
            <div
              className="overflow-hidden rounded-[24px] px-6 py-8 sm:rounded-[30px] sm:px-10 sm:py-10"
              style={{
                background: "linear-gradient(135deg,#f5570f 0%, #ff7329 45%, #FFF4EC 100%)",
              }}
            >
              <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[3px] text-white/80">AstroCall App</p>
                  <h2 className="font-heading mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    Horoscope, Kundli & Chat — All In One App
                  </h2>
                  <p className="font-body mt-2 max-w-md text-sm text-white/90">
                    Download now for daily predictions, free kundli, and instant astrologer consultations.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/wait-list" className="transition hover:opacity-90">
                    <Image
                      src="/images/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width={150}
                      height={44}
                      className="h-10 w-auto sm:h-11"
                    />
                  </Link>
                  <Link href="/wait-list" className="transition hover:opacity-90">
                    <Image
                      src="/images/app-store-apple.svg"
                      alt="Download on App Store"
                      width={150}
                      height={44}
                      className="h-10 w-auto sm:h-11"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Copyright */}
      <div
        className={`bg-[#1A1A1A] px-4 py-4 ${mobileBottomPad ? "pb-[72px] lg:pb-4" : ""}`}
      >
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
