"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { postWithToken } from "../../utils/api.js";
// import profilepic from "../../assets/images/profile pic.webp";
import { MdPhoneInTalk } from "react-icons/md";
import { IoMdChatboxes } from "react-icons/io";
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalf } from "react-icons/fa";
import { useMenuContext } from "../../hooks/useMenuContext";
import { TbCurrencyRupee } from "react-icons/tb";
const Astrologers = () => {
    const { setAstroNameHomePage, setAstroNameHomePageCall } = useMenuContext();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [getdata, setGetData] = useState([]);
    const [cardsToShow, setCardsToShow] = useState(3);
    useEffect(() => {
        const updateCardsToShow = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth < 640)
                    setCardsToShow(1);
                else if (window.innerWidth < 1024)
                    setCardsToShow(2);
                else
                    setCardsToShow(3);
            }
        };
        updateCardsToShow();
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", updateCardsToShow);
            return () => window.removeEventListener("resize", updateCardsToShow);
        }
    }, []);
    const totalCards = getdata.length;
    const getVisibleCards = () => {
        if (totalCards === 0)
            return [];
        const cards = [];
        for (let i = 0; i < cardsToShow; i++) {
            if (totalCards > i) {
                const index = (currentIndex + i) % totalCards;
                cards.push(getdata[index]);
            }
        }
        return cards;
    };
    const visibleCards = getVisibleCards();
    const handlePrevious = () => {
        if (totalCards > cardsToShow) {
            setCurrentIndex((prevIndex) => prevIndex === 0 ? totalCards - 1 : prevIndex - 1);
        }
    };
    const handleNext = () => {
        if (totalCards > cardsToShow) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
        }
    };
    const isFetchingRef = useRef(false);
    useEffect(() => {
        if (!isFetchingRef.current) {
            isFetchingRef.current = true;
            Get_Data_cart().finally(() => {
                isFetchingRef.current = false;
            });
        }
    }, []);
    const Get_Data_cart = async () => {
        try {
            const res = await postWithToken("Astrologer/GetData_AstrologerHomepage");
            const filterAstroHome = res?.filter((item) => item?.IsHomePage === true && item?.IsVerified === true);
            if (filterAstroHome) {
                setGetData(filterAstroHome);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    return (<div className="main-container astrologers relative px-0">
      <div>
        <p className="text-3xl font-[800] text-[#F0640E] text-center">
          Our Astrologers
        </p>

        <div className="w-[200px] h-[3px] m-auto rounded-full bg-primaryColor my-3"></div>
        <p className="text-center">Get in touch with our expert astrologers</p>

        <div className="carousel2 flex justify-center mt-8 w-full relative">
          <div className="flex items-center w-full gap-5">
            {/* Left Arrow Button */}
            <button onClick={handlePrevious} className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition" disabled={totalCards <= cardsToShow}>
              <FaChevronLeft size={24}/>
            </button>

            {/* Carousel Cards */}
            <div className="flex justify-start items-center gap-6  w-full">
              {visibleCards.map((card, index) => (<div key={card.id || index} className="flex-shrink-0" style={{
                flexBasis: `calc((100% - ${(cardsToShow - 1) * 1.5}rem) / ${cardsToShow})`,
            }}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
                    <div className="relative mt-4 flex items-center justify-center">
                      <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img src={card?.AvatarUrl ? `https://${card.AvatarUrl.replace(/\\/g, "/")}` : "/images/profile pic.webp"} alt="Profile" className="max-h-full max-w-full object-contain" width={160} height={160}/>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex flex-col gap-1 items-center">
                      <p className="font-semibold text-lg text-center">
                        {card?.DisplayName}
                      </p>

                      <div className="flex items-center text-sm">
                        <div className="flex items-center justify-center space-x-[2px] text-yellow-500" style={{ lineHeight: '1', height: '22px' }}>
                          {Array.from({ length: 5 }).map((_, i) => {
                const rating = card?.StarCount || 0;
                if (i + 1 <= Math.floor(rating))
                    return <FaStar key={i} className="text-[16px]"/>;
                else if (i < rating)
                    return <FaStarHalf key={i} className="text-[16px]"/>;
                return null;
            })}
                        </div>
                      </div>

                      {card?.FreeState === "Free" ? (<div>
                          <p className="text-red-600 font-semibold">Free Chat</p>
                        </div>) : (<div className="flex items-center gap-2">
                          <TbCurrencyRupee className="text-sm"/>
                          {card?.OriginalPricePerMin && card?.PricePerMin !== card?.OriginalPricePerMin ? (<>
                              <p>{card?.PricePerMin} per minute</p>
                              <p className="line-through text-gray-500">
                                {card?.OriginalPricePerMin} per minute
                              </p>
                            </>) : (<p>{card?.PricePerMin || "N/A"} per minute</p>)}
                        </div>)}

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                        {/* Call Now Button */}
                        <button className="w-full sm:w-1/2 flex items-center justify-center gap-1 py-2 rounded-lg text-white transition-transform transform hover:scale-105 bg-[#F0640E]" onClick={() => {
                setAstroNameHomePageCall(card?.DisplayName);
                router.push("/talk-to-astrologers");
            }}>
                          <MdPhoneInTalk className="text-lg"/>
                          Call Now
                        </button>

                        {/* Chat Button */}
                        <button className="w-full sm:w-1/2 flex items-center justify-center gap-1 py-2 rounded-lg text-white transition-transform transform hover:scale-105 bg-[#F0640E]" onClick={() => {
                setAstroNameHomePage(card?.DisplayName);
                router.push("/chat-to-astrologers");
            }}>
                          <IoMdChatboxes className="text-lg"/>
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>

            {/* Right Arrow Button */}
            <button onClick={handleNext} className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition" disabled={totalCards <= cardsToShow}>
              <FaChevronRight size={24}/>
            </button>
          </div>
        </div>

        {getdata.length > cardsToShow && (<div className="flex justify-center items-center mt-4 lg:hidden">
            {Array.from({ length: Math.ceil(getdata.length / cardsToShow) }).map((_, dotIdx) => {
                const pageIndex = Math.floor(currentIndex / cardsToShow);
                const isActive = dotIdx === pageIndex;
                return (<button key={dotIdx} onClick={() => setCurrentIndex(dotIdx * cardsToShow)} className={`mx-1 w-3 h-3 rounded-full border border-orange-500 focus:outline-none transition-all duration-200 ${isActive ? "bg-orange-500" : "bg-white"}`} aria-label={`Go to slide ${dotIdx + 1}`}/>);
            })}
          </div>)}

        <div className="flex justify-center text-center mt-8">
          <button className="border border-primaryColor text-primaryColor rounded-md px-6 py-2 font-semibold hover:bg-primaryColor hover:text-white transition-all duration-200" onClick={() => router.push("/talk-to-astrologers")}>
            View All Astrologers
          </button>
        </div>
      </div>
    </div>);
};
export default Astrologers;
