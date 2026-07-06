"use client";

import { FaCheckCircle, FaStar, FaUsers } from "react-icons/fa";

/* ── Data ── */
const features = [
  {
    title: "Authentic Vedic Tradition",
    desc: "Our astrologers are trained in traditional Sanskrit texts and ancient methodologies",
  },
  {
    title: "Personalized Approach",
    desc: "Every consultation is tailored to your unique birth chart and life circumstances",
  },
  {
    title: "Scientific Accuracy",
    desc: "We use precise astronomical calculations for chart preparation and predictions",
  },
  {
    title: "Holistic Guidance",
    desc: "Our advice encompasses all life aspects – career, relationships, health, and spiritual growth",
  },
  {
    title: "24/7 Availability",
    desc: "Connect with expert astrologers anytime, anywhere in the world",
  },
  {
    title: "Confidential Service",
    desc: "All consultations are completely private and secure",
  },
];

const services = [
  {
    id: 1,
    name: "Birth Chart Analysis",
    desc: "Comprehensive analysis of your natal chart revealing personality traits, life purpose, and karmic patterns that shape your destiny.",
    icon: (
      <svg className="w-6 h-6 text-[#FF5C00]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Kundli Matching",
    desc: "Traditional compatibility analysis for marriage and relationships using the proven Ashta-Koota system of Vedic astrology.",
    icon: (
      <svg className="w-6 h-6 text-[#FF5C00]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Career Guidance",
    desc: "Professional consultation to identify the most suitable career paths based on planetary positions and Dasha periods.",
    icon: (
      <svg className="w-6 h-6 text-[#FF5C00]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
];

const stats = [
  { value: "50,000+", label: "Happy Clients" },
  { value: "100+", label: "Expert Astrologers" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "24/7", label: "Available Service" },
];

const dailyFeatures = [
  "Detailed daily horoscope for all 12 zodiac signs",
  "Lucky numbers, colors, and directions for each day",
  "Relationship and career-focused predictions",
  "Health and wellness guidance based on planetary positions",
  "Monthly and yearly forecasts for long-term planning",
  "Special predictions for festivals and important dates",
];

/* ── Component ── */
export default function AstrologySection() {
  return (
    <section className="bg-[#F8F9FA] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Hero heading ── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111] mb-4 leading-snug">
            Your Gateway to{" "}
            <span className="text-[#FF5C00] underline underline-offset-4 decoration-[#FF5C00]">
              Cosmic Wisdom
            </span>{" "}
            and Astrological Excellence
          </h1>
          <p className="text-[#666] text-sm md:text-base leading-relaxed">
            Discover the profound mysteries of the universe through authentic Vedic
            astrology, personalized consultations, and time-tested cosmic guidance
            that transforms lives across the globe.
          </p>
        </div>

        {/* ── Main content card ── */}
        <div className="bg-white rounded-2xl border-l-4 border-[#FF5C00] shadow-sm p-7 md:p-10 space-y-8">

          {/* 1. Ancient Science */}
          <div>
            <SectionTitle>Understanding the Ancient Science of Astrology</SectionTitle>
            <BodyText>
              <strong className="text-[#111]">Astrology</strong> is not merely a
              belief system—it&apos;s an ancient science that has guided humanity for
              over 5,000 years. At AstroCall, we bridge the gap between traditional
              Vedic wisdom and modern life challenges, offering insights that are both
              profound and practical. Our{" "}
              <strong className="text-[#111]">certified astrologers</strong> combine
              deep knowledge of planetary movements, birth chart analysis, and cosmic
              energies to provide accurate predictions and meaningful guidance.
            </BodyText>
          </div>

          <Divider />

          {/* 2. Power of Vedic */}
          <div>
            <SubTitle>The Power of Vedic Astrology in Modern Times</SubTitle>
            <BodyText>
              In today&apos;s fast-paced world, people often feel disconnected from
              their true purpose.{" "}
              <strong className="text-[#111]">Vedic astrology</strong> offers a
              roadmap to understanding your inherent strengths, challenges, and the
              most auspicious times for important decisions. Unlike Western astrology,
              Vedic astrology uses the sidereal zodiac system, which accounts for the
              precession of equinoxes, making it more astronomically accurate.
            </BodyText>
          </div>

          <Divider />

          {/* 3. What makes AstroCall different */}
          <div>
            <OrangeTitle>What Makes AstroCall Different?</OrangeTitle>
            <ul className="space-y-3">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <FaCheckCircle className="text-[#FF5C00] mt-1 flex-shrink-0" />
                  <p className="text-[13.5px] text-[#555] leading-relaxed">
                    <strong className="text-[#111]">{item.title}:</strong>{" "}
                    {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <Divider />

          {/* 4. Quote */}
          <QuoteBox author="Ancient Vedic Wisdom">
            The stars do not compel, they incline. Astrology reveals the cosmic
            influences, but free will determines how we navigate our destiny.
          </QuoteBox>

          <Divider />

          {/* 5. Comprehensive services */}
          <div>
            <SubTitle>Comprehensive Astrological Services</SubTitle>
            <BodyText>
              Our platform offers a complete range of astrological services designed
              to address every aspect of your life — whether you&apos;re seeking
              clarity about your{" "}
              <strong className="text-[#111]">career path</strong>, looking for{" "}
              <strong className="text-[#111]">relationship compatibility</strong>,
              planning important life events, or seeking{" "}
              <strong className="text-[#111]">spiritual guidance</strong>.
            </BodyText>

            {/* Service cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white border border-[#EFEFEF] border-l-4 border-l-[#FF5C00] rounded-xl p-5 text-center hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#FFF0E6] rounded-full flex items-center justify-center mx-auto mb-3">
                    {svc.icon}
                  </div>
                  <p className="text-sm font-bold text-[#111] mb-1.5">{svc.name}</p>
                  <p className="text-xs text-[#777] leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* 6. Science behind predictions */}
          <div>
            <SubTitle>The Science Behind Astrological Predictions</SubTitle>
            <BodyText>
              Many skeptics question the validity of astrology, but scientific research
              has shown correlations between celestial movements and earthly phenomena.
              The gravitational forces of planets, particularly the Moon&apos;s effect
              on ocean tides and human behavior, demonstrate the interconnectedness of
              cosmic and terrestrial events.{" "}
              <strong className="text-[#111]">Vedic astrology</strong> takes this
              further by mapping how planetary energies influence individual
              consciousness and life patterns.
            </BodyText>
            <BodyText>
              Our astrologers use sophisticated software for precise calculations,
              considering{" "}
              <strong className="text-[#111]">planetary transits</strong>,{" "}
              <strong className="text-[#111]">Dasha systems</strong>, and{" "}
              <strong className="text-[#111]">annual predictions</strong> to provide
              comprehensive guidance.
            </BodyText>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#FF5C00] text-white rounded-xl p-5 text-center"
                >
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-xs mt-1.5 opacity-90">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* 7. Remedial Astrology */}
          <div>
            <SubTitle>Remedial Astrology and Gemstone Therapy</SubTitle>
            <BodyText>
              One unique aspect of{" "}
              <strong className="text-[#111]">Vedic astrology</strong> is its emphasis
              on remedial measures. Our expert astrologers recommend{" "}
              <strong className="text-[#111]">
                authentic gemstones, mantras, yantras, and pujas
              </strong>{" "}
              based on your specific planetary configurations.
            </BodyText>
            <BodyText>
              <strong className="text-[#111]">Gemstone therapy</strong> is particularly
              effective in balancing planetary energies. Each gemstone is associated with
              specific planets and can strengthen weak planetary positions in your birth
              chart. We provide only certified, natural gemstones with proper
              energization procedures to ensure maximum benefit.
            </BodyText>
          </div>

          <Divider />

          {/* 8. Daily Horoscope */}
          <div>
            <SubTitle>Daily Horoscope and Panchang</SubTitle>
            <BodyText>
              Stay connected with cosmic energies through our daily horoscope updates and
              traditional Panchang system. Our{" "}
              <strong className="text-[#111]">daily predictions</strong> are based on
              current planetary transits and their effects on your zodiac sign. The
              Panchang provides essential information about auspicious and inauspicious
              times, helping you plan important activities in harmony with cosmic rhythms.
            </BodyText>

            <OrangeTitle className="mt-4">
              Features of Our Daily Astrological Guidance:
            </OrangeTitle>
            <ul className="space-y-2.5 mt-2">
              {dailyFeatures.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <FaStar className="text-[#FF5C00] mt-1 flex-shrink-0 text-xs" />
                  <span className="text-[13.5px] text-[#555] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Divider />

          {/* 9. Future of consultation */}
          <div>
            <SubTitle>The Future of Astrological Consultation</SubTitle>
            <BodyText>
              Technology has revolutionized how we access astrological guidance. At
              AstroCall, we leverage modern communication platforms while preserving the
              authenticity of traditional wisdom. Our astrologers are available through{" "}
              <strong className="text-[#111]">video calls</strong>,{" "}
              <strong className="text-[#111]">phone consultations</strong>, and{" "}
              <strong className="text-[#111]">chat services</strong>, making expert
              guidance accessible regardless of geographical boundaries.
            </BodyText>
            <BodyText>
              We&apos;re also developing AI-assisted tools that can provide preliminary
              chart analysis while ensuring that complex predictions and personalized
              guidance remain the domain of our human experts.
            </BodyText>
          </div>

          <Divider />

          {/* 10. Why Choose AstroCall */}
          <div>
            <SubTitle>Why Choose AstroCall for Your Spiritual Journey?</SubTitle>
            <BodyText>
              In a world filled with uncertainty,{" "}
              <strong className="text-[#111]">AstroCall</strong> stands as a beacon of
              authentic guidance rooted in ancient wisdom yet relevant to modern
              challenges. Our commitment to accuracy, authenticity, and customer
              satisfaction has made us the preferred choice for thousands of individuals
              seeking clarity and direction.
            </BodyText>
            <BodyText>
              Whether you&apos;re at a crossroads in your career, seeking your soulmate,
              planning an important venture, or simply wanting to understand your
              life&apos;s purpose better, our expert astrologers are here to guide you.
            </BodyText>

            {/* Final testimonial box */}
            <div className="bg-[#FFF5EE] border-l-4 border-[#FF5C00] rounded-xl p-6 mt-4">
              <FaUsers className="text-[#FF5C00] text-2xl mb-3" />
              <p className="text-[13.5px] text-[#555] italic leading-relaxed">
                &ldquo;Start your journey of self-discovery today. The stars have been
                waiting to share their wisdom with you, and we&apos;re here to translate
                their cosmic language into practical guidance for your life.&rdquo;
              </p>
              <p className="text-[#FF5C00] text-sm font-semibold mt-3">
                — AstroCall Team
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Reusable sub-components ── */
const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-extrabold text-[#111] mb-3 leading-snug">
    {children}
  </h2>
);

const SubTitle = ({ children }) => (
  <h3 className="text-base font-bold text-[#111] mb-3 leading-snug mt-1">
    {children}
  </h3>
);

const OrangeTitle = ({ children }) => (
  <p className="text-sm font-bold text-[#FF5C00] mb-3">{children}</p>
);

const BodyText = ({ children }) => (
  <p className="text-[13.5px] text-[#555] leading-relaxed mb-3">{children}</p>
);

const Divider = () => (
  <div className="h-px bg-[#F3F3F3]" />
);

const QuoteBox = ({ children, author }) => (
  <div className="bg-[#FFF5EE] border-l-4 border-[#FF5C00] rounded-xl p-6">
    <span className="text-3xl text-[#FF5C00] font-bold font-serif leading-none block mb-2">
      &ldquo;
    </span>
    <p className="text-[13.5px] text-[#555] italic leading-relaxed">{children}</p>
    <p className="text-[#FF5C00] text-sm font-semibold mt-3">— {author}</p>
  </div>
);
