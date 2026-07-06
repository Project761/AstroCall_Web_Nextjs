import {
  FaBolt,
  FaLock,
  FaUserCheck,
  FaHeadset,
  FaPhoneAlt,
  FaWifi,
  FaCertificate,
  FaFlask,
  FaShippingFast,
  FaPrayingHands,
  FaVideo,
  FaGift,
  FaHome,
} from "react-icons/fa";

export const CHAT_HERO = {
  title: "Chat to Astrologers",
  subtitle: "Get instant astrology guidance from verified experts — private, secure, and available 24/7.",
  features: [
    { icon: FaBolt, label: "Instant Response" },
    { icon: FaLock, label: "100% Private Chat" },
    { icon: FaUserCheck, label: "Verified Astrologers" },
    { icon: FaHeadset, label: "24x7 Available" },
  ],
  imageSrc: "/images/app-mockup.webp.png",
  imageAlt: "Chat with astrologer on mobile",
};



export const HOROSCOPE_HERO = {
  title: "Daily Horoscope",
  subtitle: "Discover what the stars have in store for you today. Select your zodiac sign for personalised predictions.",
  imageSrc: "/horoimg/1.png",
  imageAlt: "Zodiac wheel",
};

export const GEMSTONE_HERO = {
  title: "Gemstones",
  subtitle: "Shop 100% certified astrological gemstones energised for your birth chart and planetary remedies.",
  features: [
    { icon: FaCertificate, label: "100% Certified" },
    { icon: FaFlask, label: "Lab Tested" },
    { icon: FaShippingFast, label: "Fast Delivery" },
    { icon: FaPrayingHands, label: "Energized & Purified" },
  ],
  imageSrc: "/horoimg/2.png",
  imageAlt: "Astrological gemstones",
};

export const PUJA_HERO = {
  title: "Online Puja",
  subtitle: "Book authentic Vedic pujas performed by verified pandits — live streaming and prasad at your doorstep.",
  features: [
    { icon: FaUserCheck, label: "Verified Pandits" },
    { icon: FaVideo, label: "Live Puja & Video" },
    { icon: FaHome, label: "Temple Trusted" },
    { icon: FaGift, label: "Doorstep Prasad" },
  ],
  imageSrc: "/horoimg/3.png",
  imageAlt: "Online puja thali",
};

export const BLOG_HERO = {
  title: "Astrology Blog",
  subtitle: "Explore Vedic wisdom, festival guides, remedies, and cosmic insights from expert astrologers.",
  imageSrc: "/horoimg/4.png",
  imageAlt: "Astrology blog",
};
