import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Aries from '../../../public/horoimg/aries.png';
import Taurus from '../../../public/horoimg/taurus.png';
import Aquarius from '../../../public/horoimg/aquarius.png';
import Cancer from '../../../public/horoimg/cancer.png';
import Capricorn from '../../../public/horoimg/capricorn.png';
import Gemini from '../../../public/horoimg/gemini.png';
import Leo from '../../../public/horoimg/leo.png';
import Libra from '../../../public/horoimg/libra.png';
import Pisces from '../../../public/horoimg/pisces.png';
import Sagittarius from '../../../public/horoimg/sagittarius.png';
import Scorpio from '../../../public/horoimg/scorpio.png';
import Virgo from '../../../public/horoimg/virgo.png';
import Image from 'next/image';

const Horoscope = () => {

    const Horoscopeimages = [
        { name: 'Aries', img: Aries, dates: 'Mar 21 - Apr 19' },
        { name: 'Taurus', img: Taurus, dates: 'Apr 20 - May 20' },
        { name: 'Gemini', img: Gemini, dates: 'May 21 - Jun 20' },
        { name: 'Cancer', img: Cancer, dates: 'Jun 21 - Jul 22' },
        { name: 'Leo', img: Leo, dates: 'Jul 23 - Aug 22' },
        { name: 'Virgo', img: Virgo, dates: 'Aug 23 - Sep 22' },
        { name: 'Libra', img: Libra, dates: 'Sep 23 - Oct 22' },
        { name: 'Scorpio', img: Scorpio, dates: 'Oct 23 - Nov 21' },
        { name: 'Sagittarius', img: Sagittarius, dates: 'Nov 22 - Dec 21' },
        { name: 'Capricorn', img: Capricorn, dates: 'Dec 22 - Jan 19' },
        { name: 'Aquarius', img: Aquarius, dates: 'Jan 20 - Feb 18' },
        { name: 'Pisces', img: Pisces, dates: 'Feb 19 - Mar 20' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(5);
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();

    const getVisibleCards = () => {
        // On mobile, show all cards for scrolling
        if (isMobile) {
            return Horoscopeimages;
        }
        // On desktop, show limited cards with carousel
        if (totalCards === 0) return [];
        const cards = [];
        for (let i = 0; i < cardsToShow; i++) {
            if (totalCards > i) {
                const index = (currentIndex + i) % totalCards;
                cards.push(Horoscopeimages[index]);
            }
        }
        return cards;
    };

    const handlePrevious = () => {
        if (totalCards > cardsToShow && !isMobile) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? totalCards - 1 : prevIndex - 1
            );
        }
    };

    const handleNext = () => {
        if (totalCards > cardsToShow && !isMobile) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
        }
    };

    const totalCards = Horoscopeimages.length;
    const visibleCards = getVisibleCards();

    useEffect(() => {
        const updateCardsToShow = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                // On mobile, we'll show all cards in scrollable container
                setCardsToShow(12);
            } else if (window.innerWidth < 1280) {
                setCardsToShow(4);
            } else {
                setCardsToShow(5);
            }
        };
        updateCardsToShow();
        window.addEventListener('resize', updateCardsToShow);
        return () => window.removeEventListener('resize', updateCardsToShow);
    }, []);

    return (
        <div className='bg-gray-100 py-6 sm:py-8 md:py-12 text-center flex flex-col justify-center my-4 w-full items-center relative px-3 sm:px-4'>
            <div className='flex justify-center'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800'>TODAY'S HOROSCOPE</h2>
            </div>

            <div className='relative flex items-center justify-center w-full max-w-7xl mx-auto'>
                <div className="carousel2 flex justify-center mt-4 sm:mt-6 md:mt-8 w-full">
                    <div className="flex items-center w-full gap-2 sm:gap-3 md:gap-5">
                        {/* Left Arrow Button - Only show on desktop */}
                        {!isMobile && (
                            <button
                                onClick={handlePrevious}
                                className="bg-white border border-orange-500 text-orange-500 rounded-full p-1.5 sm:p-2 shadow hover:bg-orange-500 hover:text-white transition flex-shrink-0 z-10"
                                disabled={totalCards <= cardsToShow}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {/* Scrollable Container */}
                        <div
                            className={`flex ${isMobile ? 'space-x-3 sm:space-x-4' : 'space-x-4 md:space-x-7'} overflow-x-auto scrollbar-hide ${isMobile ? 'w-full px-2' : 'flex-1 justify-center'}`}
                            style={{
                                scrollBehavior: 'smooth',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {visibleCards.map((item) => (
                                <div
                                    key={item.name}
                                    className='flex-shrink-0 w-28 sm:w-36 md:w-40 lg:w-48 text-center cursor-pointer hover:scale-105 transition-transform'
                                    onClick={() => {
                                        sessionStorage.setItem('HoroscopeName', item?.name);
                                        router.push(`/daily-horoscope/${item?.name}`);
                                    }}
                                >
                                    <div className='bg-[#FFF9E9] rounded-full p-0.5 sm:p-1 border-2 md:border-3 lg:border-4 border-orange-500 inline-block shadow-lg'>
                                        <Image
                                            src={item.img}
                                            alt={item.name}
                                            width={160}
                                            height={160}
                                            className='w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover rounded-full'
                                        />
                                    </div>
                                    <h3 className='mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-xl font-bold text-gray-800'>
                                        {item.name}
                                    </h3>
                                    <p className='text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1'>{item.dates}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right Arrow Button - Only show on desktop */}
                        {!isMobile && (
                            <button
                                onClick={handleNext}
                                className="bg-white border border-orange-500 text-orange-500 rounded-full p-1.5 sm:p-2 shadow hover:bg-orange-500 hover:text-white transition flex-shrink-0 z-10"
                                disabled={totalCards <= cardsToShow}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Horoscope;
