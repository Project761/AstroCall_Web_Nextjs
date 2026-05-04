"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postWithToken } from "../../utils/api.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const HomeOnlinepuja = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pujadata, setPujadata] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
  const [isPaused, setIsPaused] = useState(false);

  function getCardsToShow() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024)
        return 3;
      if (window.innerWidth >= 747)
        return 2;
      return 1;
    }
    return 3; // Default for SSR
  }


  useEffect(() => {
    const handleResize = () => setCardsToShow(getCardsToShow());
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  useEffect(() => {
    Get_Data_OnlinePuja();
  }, []);
  const Get_Data_OnlinePuja = async () => {
    try {
      const val = { IsActive: "1", IsHomePage: true };
      const res = await postWithToken("Puja/GetData_Puja", val);
      if (res) setPujadata(res.filter((item) => item?.PujaID));
    }
    catch (error) {
      console.error(error);
    }
  };
  // Calculate the visible cards for the slider
  const getVisibleCards = () => {
    if (pujadata.length === 0)
      return [];
    if (currentIndex + cardsToShow <= pujadata.length) {
      return pujadata.slice(currentIndex, currentIndex + cardsToShow);
    }
    else {
      // Wrap around for infinite effect
      return [
        ...pujadata.slice(currentIndex),
      ];
    }
  };
  const visibleCards = getVisibleCards();

  const handlePrev = () => {
    setCurrentIndex((prev) => prev === 0 ? pujadata.length - cardsToShow : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev === pujadata.length - cardsToShow ? 0 : prev + 1);
  };


  return (<>
    <div className="main-container mx-auto py-12 px-0 relative ">
      <h2 className="text-3xl font-semibold text-center text-orange-600">
        Book Online Puja & Anusthan
      </h2>
      <div className="h-1 w-40 bg-orange-500 mx-auto my-4 rounded-full" />
      <p className="text-center text-gray-600 max-w-2xl mx-auto px-4">
        Perform sacred rituals and ceremonies from the comfort of your home. Connect with experienced priests and ensure all Vedic procedures are followed.
      </p>
      <div className="flex justify-center items-center w-full mx-auto gap-4 my-8 " onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <button className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition" onClick={handlePrev} disabled={pujadata.length <= cardsToShow}>
          <FaChevronLeft size={24} />
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full cursor-pointer">
          {visibleCards.map((card, idx) => (
            <div key={idx} className="h-full">
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col h-full">

                {/* Image (fixed height only image) */}
                <div className="h-[240px] w-full overflow-hidden group">
                  <img src={card?.PujaImage ? `https://${card?.PujaImage.replace(/\\/g, "/")}` : "/images/default-puja.webp"}
                    alt={card?.PujaName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-90" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 px-5 py-4">

                  <h3 className="text-lg font-semibold text-orange-600 text-center line-clamp-2">
                    {card?.PujaName}
                  </h3>

                  <p className="text-gray-600 text-sm text-center mt-2 line-clamp-3">
                    {card?.ShortDescription ||
                      "Perform sacred puja for divine blessings and personal peace."}
                  </p>

                  {/* Price */}
                  <div className="my-4 flex justify-start gap-2">
                    {card.CurrentAmt === card.Amt ? (
                      <span className="text-orange-600 font-bold">
                        ₹ {card.Amt}
                      </span>
                    ) : (
                      <>
                        <span className="text-orange-600 font-bold">
                          ₹ {card.Amt}
                        </span>
                        <span className="text-gray-500 line-through">
                          ₹ {card.CurrentAmt}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Button always bottom */}
                  <button
                    className="mt-auto w-full cursor-pointer bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
                    onClick={() =>
                      router.push(`/online-puja?onlinePuja-to-astrologersOP=${card?.PujaID}`)
                    }
                  >
                    Book Now
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition" onClick={handleNext} disabled={pujadata.length <= cardsToShow}>
          <FaChevronRight size={24} />
        </button>

      </div>
      {/* Dots for mobile/tablet only */}
      {pujadata.length > cardsToShow && (
        <div className="flex justify-center items-center mt-2 lg:hidden">
          {Array.from({ length: Math.ceil(pujadata.length / cardsToShow) }).map((_, dotIdx) => {
            // Calculate the index for each dot
            const dotIndex = dotIdx * cardsToShow;
            // Determine if this dot is active
            const isActive = (currentIndex >= dotIndex && currentIndex < dotIndex + cardsToShow) ||
              (dotIdx === 0 && currentIndex + cardsToShow > pujadata.length);
            return (<button key={dotIdx} onClick={() => setCurrentIndex(dotIndex)} className={`mx-1 w-3 h-3 rounded-full border border-orange-500 focus:outline-none transition-all duration-200 ${isActive ? "bg-orange-500" : "bg-white"}`} aria-label={`Go to slide ${dotIdx + 1}`} />);
          })}
        </div>)}
      <div className="mt-14 text-center">
        <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-orange-500 hover:text-white transition" onClick={() => router.push("/online-puja")}>
          View All Online Puja
        </button>
      </div>
    </div>
  </>);
};
export default HomeOnlinepuja;

