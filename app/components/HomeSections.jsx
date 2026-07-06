import Link from "next/link";
import Image from "next/image";
import { ORANGE, CREAM, CREAM_ALT } from "@/app/lib/siteTheme";
import {
  FaFire, FaMapMarkerAlt, FaPhoneAlt, FaSearch, FaCheckCircle,
  FaComments,
  FaStar,
} from "react-icons/fa";

const SIGNS = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];

const cities = [
  {
    name: "Delhi",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    astrologers: "120+",
  },
  {
    name: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
    astrologers: "110+",
  },
  {
    name: "Bangalore",
    image:
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2",
    astrologers: "95+",
  },
  // {
  //   name: "Hyderabad",
  //   image:
  //     "https://images.unsplash.com/photo-1633321088353-3844f1d53c62",
  //   astrologers: "90+",
  // },
  {
    name: "Pune",
    image:
      "https://images.unsplash.com/photo-1627894483216-2138af692e32",
    astrologers: "85+",
  },
  {
    name: "Chennai",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
    astrologers: "80+",
  },
  {
    name: "Kolkata",
    image:
      "https://images.unsplash.com/photo-1558431382-27e303142255",
    astrologers: "75+",
  },
  {
    name: "Amritsar",
    image:
      "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16",
    astrologers: "70+",
  },
  {
    name: "Jaipur",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245",
    astrologers: "65+",
  },
  // {
  //   name: "Varanasi",
  //   image:
  //     "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
  //   astrologers: "60+",
  // },
];

export function StatsBar() {
  return (
    <section className="py-6 sm:py-8" style={{ backgroundColor: CREAM_ALT }}>
      <div className="main-container grid grid-cols-2 gap-4 px-3 text-center sm:gap-6 sm:px-4 md:grid-cols-3 lg:grid-cols-5">
        {[
          { value: "20 Lakh+", label: "Happy Customers" },
          { value: "1500+", label: "Verified Astrologers" },
          { value: "5 Crore+", label: "Minutes Consulted" },
          { value: "4.9", label: "Average Rating" },
          { value: "10+", label: "Years Experience" },
        ].map((s) => (
          <div key={s.label} className="last:col-span-2 last:mx-auto last:max-w-[200px] md:last:col-span-1 md:last:max-w-none">
            <p className="text-xl font-extrabold sm:text-2xl md:text-3xl" style={{ color: ORANGE }}>{s.value}</p>
            <p className="mt-0.5 text-[10px] text-[#555] sm:mt-1 sm:text-xs md:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CitySection() {
  return (
    <section
      className="py-12 md:py-16"
      style={{ backgroundColor: CREAM }}
    >
      <div className="main-container px-4">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#111827]">
              Talk to{" "}
              <span style={{ color: ORANGE }}>
                Astrologer
              </span>{" "}
              in Your City
            </h2>

            <p className="mt-4 max-w-2xl text-gray-600 text-lg">
              Connect with verified astrologers near you for
              accurate predictions and personalized guidance.
            </p>
          </div>

          <Link
            href="/talk-to-astrologers"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition hover:bg-[#F16322] hover:text-white"
            style={{
              color: ORANGE,
              borderColor: "#FED7AA",
            }}
          >
            View All Cities →
          </Link>
        </div>

        {/* Cities Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <Link
              href="/talk-to-astrologers"
              key={city.name}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden rounded-2xl">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                  <FaMapMarkerAlt className="text-[#F16322]" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-[#1A1A1A]">
                  {city.name}
                </h3>

                <p className="mt-1 text-gray-500">
                  {city.astrologers} Astrologers
                </p>

                <button
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 font-semibold transition hover:bg-[#F16322] hover:text-white"
                  style={{
                    color: ORANGE,
                    borderColor: "#FED7AA",
                  }}
                >
                  <FaPhoneAlt />
                  Talk Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ZodiacSection() {
  return (
    <section
      className="py-4 md:py-6"
      style={{ backgroundColor: CREAM }}
    >
      <div className="main-container px-4">
        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#F16322]">
            Daily Horoscope
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#1A1A1A] md:text-4xl">
            Horoscope by Zodiac Sign
          </h2>

          <p className="mt-3 text-gray-500">
            Get your daily horoscope prediction based on your zodiac sign.
          </p>
        </div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SIGNS.map((sign) => (
            <Link
              key={sign}
              href={`/daily-horoscope/${sign}`}
              className="group cursor-pointer"
            >
              <div
                className="relative overflow-hidden rounded-3xl bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  border: "1px solid rgba(241,99,34,0.12)",
                }}
              >
                {/* Background Glow */}
                <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-orange-100 opacity-50 blur-xl" />

                {/* Zodiac Image */}
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-100">
                  <Image
                    src={`/horoimg/${sign}.png`}
                    alt={sign}
                    width={60}
                    height={60}
                    className="object-contain transition duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Name */}
                <h3 className="mt-4 text-base font-bold capitalize text-[#1A1A1A] group-hover:text-[#F16322]">
                  {sign}
                </h3>

                {/* CTA */}
                <p className="mt-1 text-xs text-gray-500">
                  View Horoscope →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularSearchSection() {
  const searches = [
    "When Will I Get Married?",
    "Career Prediction 2026",
    "Love Compatibility Check",
    "Financial Astrology Reading",
    "Health Horoscope Analysis",
    "Business Success Timing",
    "Property Purchase Muhurat",
    "Education Guidance",
    "Relationship Problems",
    "Kundli Matching",
    "Job Change Prediction",
    "Foreign Travel Yoga",
  ];

  return (
    <section
      className="py-8"
      style={{ backgroundColor: CREAM }}
    >
      <div className="main-container px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#F16322]">
            <FaFire />
            Trending Searches
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#1A1A1A]">
            Popular Astrology Searches
          </h2>

          <p className="mt-2 text-gray-500">
            Explore what people are asking astrologers today
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {searches.map((search, index) => (
            <Link
              key={index}
              href={`/talk-to-astrologers?q=${encodeURIComponent(search)}`}
              className="group cursor-pointer"
            >
              <div className="flex items-center gap-3 rounded-full border border-orange-100 bg-white px-5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#F16322] hover:shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                  <FaSearch
                    className="text-sm"
                    style={{ color: ORANGE }}
                  />
                </div>

                <span className="text-sm font-medium text-[#333] group-hover:text-[#F16322]">
                  {search}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AppDownloadBlock() {
  return (
    <section className="py-5">
      <div
        className="main-container overflow-hidden rounded-[30px] px-10 py-12"
        style={{
          background:
            "linear-gradient(135deg,#f5570f 0%, #ff7329 40%, #FFF4EC 100%)",
        }}
      >
        <div className="grid items-center p-3 gap-10 md:grid-cols-2">
          {/* Left Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[4px] text-white/80">
              ASTROCALL FOR IOS & ANDROID
            </p>

            <h2 className="text-2xl font-extrabold leading-tight text-white md:text-5xl">
              India’s #1 Astrology 
              {/* <br />
              Astrology App. */}
              <br />
             App. Always With You.
            </h2>

            <p className="mt-2max-w-lg text-lg text-white/90">
              Chat with astrologers anytime. Get daily horoscopes,
              free kundli, compatibility reports & remedies —
              all in one app.
            </p>

            <div className="flex flex-wrap gap-4">
              <Image
                src="/images/app-store-apple.svg"
                width={170}
                height={50}
                alt=""
              />

              <Image
                src="/images/google-play-badge.svg"
                width={170}
                height={50}
                alt=""
              />
            </div>

            <div className="flex gap-10">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  4.9★
                </h3>
                <p className="text-white/80">
                  Average Rating
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">
                  20L+
                </h3>
                <p className="text-white/80">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>

          {/* Right Mobile */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full " />

              <div className="relative z-2 overflow-hidden rounded-[45px] border-[4px] border-black ">
                <Image
                  src="/images/app-mockup.webp.png"
                  alt="AstroCall App"
                  width={250}
                  height={200}
                  className="object-cover"
                />

                {/* Notch */}
                {/* <div className="absolute left-1/2 top-3 h-6 w-28 -translate-x-1/2 rounded-full bg-black" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

