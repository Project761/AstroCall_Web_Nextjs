"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaStar, FaHeart, FaGem, FaFire, FaLeaf, FaWind, FaTint } from "react-icons/fa";
const ZodiacGrid = () => {
    const router = useRouter();
    const Horoscopeimages = [
        { name: "Aries", img: "/horoimg/aries.png", dates: "Mar 21 - Apr 19" },
        { name: "Taurus", img: "/horoimg/taurus.png", dates: "Apr 20 - May 20" },
        { name: "Gemini", img: "/horoimg/gemini.png", dates: "May 21 - Jun 20" },
        { name: "Cancer", img: "/horoimg/cancer.png", dates: "Jun 21 - Jul 22" },
        { name: "Leo", img: "/horoimg/leo.png", dates: "Jul 23 - Aug 22" },
        { name: "Virgo", img: "/horoimg/virgo.png", dates: "Aug 23 - Sep 22" },
        { name: "Libra", img: "/horoimg/libra.png", dates: "Sep 23 - Oct 22" },
        { name: "Scorpio", img: "/horoimg/scorpio.png", dates: "Oct 23 - Nov 21" },
        { name: "Sagittarius", img: "/horoimg/sagittarius.png", dates: "Nov 22 - Dec 21" },
        { name: "Capricorn", img: "/horoimg/capricorn.png", dates: "Dec 22 - Jan 19" },
        { name: "Aquarius", img: "/horoimg/aquarius.png", dates: "Jan 20 - Feb 18" },
        { name: "Pisces", img: "/horoimg/pisces.png", dates: "Feb 19 - Mar 20" },
    ];
    const services = [
        {
            icon: <FaStar className="text-red-500 text-2xl" />,
            title: "Personalized Horoscope Readings",
            desc: "Get accurate and detailed daily horoscope predictions based on your zodiac sign. Our expert astrologers provide insights into love, career, health, and financial prospects to help you make informed decisions every day.",
        },
        {
            icon: <FaHeart className="text-pink-500 text-2xl" />,
            title: "Love Compatibility Analysis",
            desc: "Explore your zodiac compatibility with potential partners and discover which signs are most compatible with yours. Understanding astrological compatibility can improve your relationships and help you find your perfect match.",
        },
        {
            icon: <FaGem className="text-orange-500 text-2xl" />,
            title: "Birthstone & Lucky Gems",
            desc: "Discover your lucky gemstones and birthstones that can enhance your positive energy and protect you from negative influences. Each zodiac sign has specific gems that amplify their natural strengths and abilities.",
        },
    ];
    const elements = [
        {
            icon: <FaFire className="text-red-500 text-3xl" />,
            title: "Fire Signs",
            signs: "Aries, Leo, Sagittarius",
            desc: "Passionate, energetic, and spontaneous. Fire signs are natural leaders.",
            bg: "bg-red-50 border-red-200",
        },
        {
            icon: <FaLeaf className="text-green-500 text-3xl" />,
            title: "Earth Signs",
            signs: "Taurus, Virgo, Capricorn",
            desc: "Grounded, practical, and reliable. Earth signs value stability.",
            bg: "bg-green-50 border-green-200",
        },
        {
            icon: <FaWind className="text-blue-500 text-3xl" />,
            title: "Air Signs",
            signs: "Gemini, Libra, Aquarius",
            desc: "Intellectual, communicative, and social. Air signs love ideas.",
            bg: "bg-blue-50 border-blue-200",
        },
        {
            icon: <FaTint className="text-pink-500 text-3xl" />,
            title: "Water Signs",
            signs: "Cancer, Scorpio, Pisces",
            desc: "Emotional, intuitive, and empathetic. Water signs feel deeply.",
            bg: "bg-pink-50 border-pink-200",
        },
    ];
    const contentData = [
        {
            text: (<>
                <span className="font-semibold text-orange-600">Zodiac signs astrology</span> has been guiding humanity
                for thousands of years, offering profound insights into personality traits, behavioral patterns, and life paths...
            </>),
        },
        {
            text: (<>
                Your <span className="font-semibold text-orange-600">sun sign</span> is determined by the position of the sun
                at your birth and represents your core personality...
            </>),
        },
        {
            text: (<>
                <span className="font-semibold text-orange-600">Daily horoscope readings</span> can help you navigate life&apos;s
                challenges by providing cosmic guidance for love, career, health...
            </>),
        },
        {
            text: (<>
                At AstroCall, our experienced astrologers provide personalized consultations that go beyond generic horoscopes...
            </>),
        },
    ];
    const handleZodiacClick = (name) => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem("HoroscopeName", name);
            router.push(`/daily-horoscope/${name}`);
        }
    };
    return (

        <div className="bg-[#ffff] py-2">

            <div className="main-container py-8 px-0 ">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-center text-orange-500 text-3xl font-extrabold mb-5">
                        Explore Your Zodiac Sign
                    </h2>
                    <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
                        Discover the cosmic wisdom of your zodiac sign and unlock the secrets of your personality, relationships, and destiny through ancient astrological knowledge.
                    </p>
                </div>

                {/* Services */}
                <div className="grid md:grid-cols-3 gap-6  mx-auto mb-16">
                    {services.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white shadow__md__lists  border-l-4 border-orange-500 p-6 rounded-xl hover:shadow-lg transition"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                {item.icon}
                                <p className="font-semibold text-lg text-gray-800">{item.title}</p>
                            </div>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Elements */}
                <div className="text-center mb-10">
                    <h3 className="text-center text-orange-500 text-3xl font-extrabold mb-2">
                        The Four Elements in Astrology
                    </h3>
                </div>

                <div className="grid md:grid-cols-4 gap-6  mx-auto">
                    {elements.map((el, i) => (
                        <div
                            key={i}
                            className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition ${el.bg}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                {el.icon}
                                <h4 className="font-bold text-lg mt-3">{el.title}</h4>
                                <p className="text-sm text-gray-700 font-medium mt-1">{el.signs}</p>
                                <p className="text-gray-600 text-sm mt-2">{el.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="main-container mx-auto px-0">
                <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8">
                    {Horoscopeimages.map((item) => (
                        <div
                            key={item.name}
                            className="bg-[#F973160D] hover:bg-orange-200 rounded-xl text-center p-5 cursor-pointer transition duration-300  shadow-md hover:shadow-lg"
                            onClick={() => { sessionStorage.setItem("HoroscopeName", item?.name); router.push(`/daily-horoscope/${item?.name}`) }}
                        >
                            <Image
                                src={item.img}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 mx-auto mb-4 object-contain rounded-full border-4 border-orange-400"
                            />
                            <h4 className="text-orange-700 font-bold text-lg">{item.name}</h4>
                            <p className="text-orange-600 text-sm">{item.dates}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow-md border border-l-4 border-orange-500 p-6 rounded-xl hover:shadow-lg transition">
                        <p className="text-2xl text-center font-bold text-orange-600 mb-4">
                            Understanding Your Zodiac Sign: A Complete Guide to Astrology
                        </p>

                        {contentData.map((item, index) => (
                            <p key={index} className="text-gray-700 mb-4">
                                {item.text}
                            </p>
                        ))}
                    </div>
                        
                    {/* CTA Button */}

                    <div className="mt-14 text-center">
                        <Link href="/daily-horoscope">
                            <button className="bg-[#F973160D] cursor-pointer hover:shadow-lg text-orange-600 px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-orange-100 transition">
                                GET PERSONAL HOROSCOPE READING
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default ZodiacGrid;
