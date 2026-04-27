"use client";

import { FaCheckCircle, FaStar, FaUsers } from "react-icons/fa";

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

const data = [
    {
        id: 1,
        name: "Birth Chart Analysis",
        desc: "Comprehensive analysis of your natal chart revealing personality traits, life purpose, and karmic patterns that shape your destiny.",
        icon: "https://cdn-icons-png.flaticon.com/512/616/616490.png", // sun/star icon
    },
    {
        id: 2,
        name: "Kundli Matching",
        desc: "Traditional compatibility analysis for marriage and relationships using the proven Ashta-Koota system of Vedic astrology.",
        icon: "https://cdn-icons-png.flaticon.com/512/439/439941.png", // approximated star/sun icon
    },
    {
        id: 3,
        name: "Career Guidance",
        desc: "Professional consultation to identify the most suitable career paths based on planetary positions and Dasha periods.",
        icon: "https://cdn-icons-png.flaticon.com/512/535/535239.png", // globe/career icon
    },
];


export default function AstrologySection() {
    return (
        <div className="bg-[#F8F9FA] py-12 px-4">
            <div className="max-w-5xl mx-auto text-center">
                {/* Top Section Title */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center leading-snug">
                        Your Gateway to{" "}
                        <span className="text-orange-500 underline font-extrabold">
                            Cosmic Wisdom
                        </span>{" "}
                        and Astrological Excellence
                    </p>

                    <p className="text-gray-600 mb-10 max-w-2xl  mx-auto text-center leading-snug">
                        Discover the profound mysteries of the universe through authentic Vedic astrology,
                        personalized consultations, and time-tested cosmic guidance that transforms lives
                        across the globe.
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white shadow-md rounded-xl p-6 text-left border-l-4 border-orange-500">
                    <p className="text-2xl font-[800] text-gray-900 mb-3">
                        Understanding the Ancient Science of Astrology
                    </p>
                    <p className="text-gray-700 mb-5">
                        <span className="font-semibold text-gray-900">Astrology</span> is not merely a belief system—it's an ancient
                        science that has guided humanity for over 5,000 years. At AstroCall, we bridge the gap between traditional
                        Vedic wisdom and modern life challenges, offering you insights that are both profound and practical. Our
                        <span className="font-semibold text-gray-900"> certified astrologers</span> combine deep knowledge of
                        planetary movements, birth chart analysis, and cosmic energies to provide accurate predictions and meaningful guidance.
                    </p>

                    <p className="text-xl font-[600] text-gray-900 mb-3">
                        The Power of Vedic Astrology in Modern Times
                    </p>
                    <p className="text-gray-700 mb-5">
                        In today's fast-paced world, people often feel disconnected from their true purpose and struggle with life's complexities.
                        <span className="font-semibold text-gray-900"> Vedic astrology</span> offers a roadmap to understanding your inherent strengths, challenges, and the most auspicious times for important decisions. Unlike Western astrology, Vedic astrology uses the sidereal zodiac system, which accounts for the procession of equinoxes, making it more astronomically accurate.
                    </p>

                    {/* Highlighted Subheading */}
                    <p className="text-lg font-bold text-orange-500 mb-4">What Makes AstroCall Different?</p>

                    {/* Bullet Points using map */}
                    <ul className="space-y-3">
                        {features.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <FaCheckCircle className="text-orange-500 mt-1" />
                                <p className="text-gray-700">
                                    <span className="font-semibold text-gray-900">{item.title}:</span> {item.desc}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="py-3 mt-3">
                        {/* Quote Section */}
                        <div className="bg-orange-50 to-white border-l-4 border-orange-400 rounded-md shadow-sm p-6 mb-10">
                            <div className="text-orange-500 text-3xl font-bold mb-3">❝</div>
                            <p className="text-gray-700 italic text-lg leading-relaxed">
                                "The stars do not compel, they incline. Astrology reveals the cosmic
                                influences, but free will determines how we navigate our destiny."
                            </p>
                            <p className="text-orange-600 font-medium mt-3">
                                - Ancient Vedic Wisdom
                            </p>
                        </div>

                        {/* Services Section */}
                        <div>
                            <p className="text-xl font-[600] text-gray-900 mb-3">
                                Comprehensive Astrological Services
                            </p>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                Our platform offers a complete range of astrological services designed
                                to address every aspect of your life. Whether you're seeking clarity
                                about your{" "}
                                <span className="font-semibold text-gray-800">career path</span>, looking
                                for{" "}
                                <span className="font-semibold text-gray-800">
                                    relationship compatibility
                                </span>
                                , planning important life events, or seeking{" "}
                                <span className="font-semibold text-gray-800">spiritual guidance</span>
                                , our expert astrologers provide detailed insights based on your unique
                                birth chart.
                            </p>
                        </div>
                    </div>



                    <div className="container mx-auto  mt-8">
                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {data.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white shadow-md border border-l-4 border-orange-500 p-6 rounded-xl hover:shadow-lg transition cursor-pointer"
                                >
                                    {/* Icon */}
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src={item.icon}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>

                                    {/* Title */}
                                    <p className="text-lg font-semibold text-center mb-2">
                                        {item.name}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm text-center">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>



                    <div className="mt-3">
                        {/* Heading */}
                        <p className="text-xl font-[600] text-gray-900 mb-3">
                            The Science Behind Astrological Predictions
                        </p>

                        {/* Paragraphs */}
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Many skeptics question the validity of astrology, but scientific
                            research has shown correlations between celestial movements and earthly
                            phenomena. The gravitational forces of planets, particularly the Moon's
                            effect on ocean tides and human behavior, demonstrate the
                            interconnectedness of cosmic and terrestrial events.
                            <span className="font-semibold text-gray-800"> Vedic astrology </span>
                            takes this further by mapping how planetary energies influence
                            individual consciousness and life patterns.
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            Our astrologers use sophisticated software for precise calculations,
                            ensuring that your birth chart reflects the exact planetary positions at
                            your time of birth. This accuracy is crucial for reliable predictions
                            and effective remedial measures. We also consider factors like{" "}
                            <span className="font-semibold text-gray-800">planetary transits</span>,
                            <span className="font-semibold text-gray-800"> Dasha systems</span>, and{" "}
                            <span className="font-semibold text-gray-800">annual predictions</span>{" "}
                            to provide comprehensive guidance.
                        </p>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Card 1 */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md text-center p-6">
                                <p className="text-3xl font-bold">50,000+</p>
                                <p className="mt-2 text-sm">Happy Clients</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md text-center p-6">
                                <p className="text-3xl font-bold">100+</p>
                                <p className="mt-2 text-sm">Expert Astrologers</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md text-center p-6">
                                <p className="text-3xl font-bold">95%</p>
                                <p className="mt-2 text-sm">Accuracy Rate</p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md text-center p-6">
                                <p className="text-3xl font-bold">24/7</p>
                                <p className="mt-2 text-sm">Available Service</p>
                            </div>
                        </div>
                    </div>


                    <div className="mt-6">
                        {/* Remedial Astrology Section */}
                        <p className="text-xl font-[600] text-gray-900 mb-3">
                            Remedial Astrology and Gemstone Therapy
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            One of the unique aspects of{" "}
                            <span className="font-semibold text-gray-800">Vedic astrology</span> is
                            its emphasis on remedial measures. Unlike other systems that merely
                            predict events, Vedic astrology provides practical solutions to mitigate
                            negative influences and enhance positive planetary energies. Our expert
                            astrologers recommend
                            <span className="font-semibold text-gray-800">
                                {" "}
                                authentic gemstones, mantras, yantras, and pujas{" "}
                            </span>
                            based on your specific planetary configurations.
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            <span className="font-semibold text-gray-800">Gemstone therapy</span> is
                            particularly effective in balancing planetary energies. Each gemstone is
                            associated with specific planets and can strengthen weak planetary
                            positions in your birth chart. We provide only certified, natural
                            gemstones with proper energization procedures to ensure maximum benefit.
                            Our gemstone experts guide you through the selection process,
                            considering factors like carat weight, wearing procedures, and auspicious
                            timing for first use.
                        </p>

                        {/* Daily Horoscope Section */}
                        <p className="text-xl font-[600] text-gray-900 mb-3">
                            Daily Horoscope and Panchang
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Stay connected with cosmic energies through our daily horoscope updates
                            and traditional Panchang system. Our{" "}
                            <span className="font-semibold text-gray-800">daily predictions</span>{" "}
                            are based on current planetary transits and their effects on your zodiac
                            sign. The Panchang provides essential information about auspicious and
                            inauspicious times, helping you plan important activities in harmony
                            with cosmic rhythms.
                        </p>

                        {/* Features List */}
                        <p className="text-xl font-[600] text-orange-600 mb-3">
                            Features of Our Daily Astrological Guidance:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Detailed daily horoscope for all 12 zodiac signs",
                                "Lucky numbers, colors, and directions for each day",
                                "Relationship and career-focused predictions",
                                "Health and wellness guidance based on planetary positions",
                                "Monthly and yearly forecasts for long-term planning",
                                "Special predictions for festivals and important dates",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <FaStar className="text-orange-500 mt-1" />
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="mt-4">
                        {/* Section 1: Future of Consultation */}
                        <p className="text-xl font-[600] text-gray-900 mb-3">
                            The Future of Astrological Consultation
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Technology has revolutionized how we access astrological guidance. At
                            AstroCall, we leverage modern communication platforms while preserving
                            the authenticity of traditional wisdom. Our astrologers are available
                            through{" "}
                            <span className="font-semibold text-gray-800">video calls</span>,{" "}
                            <span className="font-semibold text-gray-800">phone consultations</span>,
                            and <span className="font-semibold text-gray-800">chat services</span>,
                            making expert guidance accessible regardless of geographical boundaries.
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            We're also developing AI-assisted tools that can provide preliminary
                            chart analysis while ensuring that complex predictions and personalized
                            guidance remain the domain of our human experts. This hybrid approach
                            ensures accuracy, accessibility, and the personal touch that makes
                            astrological consultation truly meaningful.
                        </p>

                        {/* Section 2: Why Choose AstroCall */}
                        <p className="text-xl font-[600] text-gray-900 mb-3">
                            Why Choose AstroCall for Your Spiritual Journey?
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            In a world filled with uncertainty,{" "}
                            <span className="font-semibold text-gray-800">AstroCall</span> stands as
                            a beacon of authentic guidance rooted in ancient wisdom yet relevant to
                            modern challenges. Our commitment to accuracy, authenticity, and
                            customer satisfaction has made us the preferred choice for thousands of
                            individuals seeking clarity and direction in their lives.
                        </p>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            Whether you're at a crossroads in your career, seeking your soulmate,
                            planning an important venture, or simply wanting to understand your
                            life's purpose better, our expert astrologers are here to guide you.
                            Join the growing community of enlightened individuals who have
                            discovered the transformative power of authentic Vedic astrology through
                            AstroCall.
                        </p>

                        {/* Testimonial Box */}
                        <div className="bg-orange-50  border-l-4 border-orange-400 rounded-md shadow-sm p-6">
                            <FaUsers className="text-orange-500 text-2xl mb-3" />
                            <p className="text-gray-700 italic text-lg leading-relaxed">
                                "Start your journey of self-discovery today. The stars have been
                                waiting to share their wisdom with you, and we're here to translate
                                their cosmic language into practical guidance for your life."
                            </p>
                            <p className="text-orange-600 font-medium mt-3">- AstroCall Team</p>
                        </div>
                    </div>








                </div>



            </div>
        </div>
    );
}
