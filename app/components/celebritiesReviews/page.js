"use client";

import React, { useEffect, useState } from "react";
import { postWithToken } from "../../utils/api.js";
import { IoLogoYoutube } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CelebritiesReview = () => {
  const [CelebritiesVideos, setCelebritiesVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCardsCount, setVisibleCardsCount] = useState(3);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    Get_Data_CelebritiesVideos();

    const updateVisibleCardsCount = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        setVisibleCardsCount(width < 640 ? 1 : width < 1024 ? 2 : 3);
      }
    };

    updateVisibleCardsCount();
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", updateVisibleCardsCount);
      return () => window.removeEventListener("resize", updateVisibleCardsCount);
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, visibleCardsCount, CelebritiesVideos.length]);

  const Get_Data_CelebritiesVideos = async () => {
    try {
      const res = await postWithToken("CelebritiesVideos/GetData_CelebritiesVideos", { IsActive: "1" });
      if (res) setCelebritiesVideos(res.filter((data) => data.YoutubeUrl));
    } catch (error) {
      console.log(error, "error");
    }
  };

  const getYouTubeID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const totalCards = CelebritiesVideos.length;

  const getVisibleCards = () => {
    if (totalCards === 0) return [];
    const cards = [];
    for (let i = 0; i < visibleCardsCount; i++) {
      if (totalCards > i) {
        const index = (currentIndex + i) % totalCards;
        cards.push(CelebritiesVideos[index]);
      }
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  const handlePrevious = () => {
    if (totalCards > visibleCardsCount) {
      setCurrentIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (totalCards > visibleCardsCount) {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }
  };

  return (
    <div className="bg-[#EC6812] py-4 relative overflow-hidden">
      <div className="absolute top-0 left-[-90px]">
        <img className="carousel-image_left" src="/images/customar-position-image.webp" alt="" />
      </div>
      <div className="absolute bottom-0 right-[-90px]">
        <img className="carousel-image" src="/images/customar-before.webp" alt="" />
      </div>

      <div className="main-container relative">

        <p className="text-3xl font-semibold text-white mt-5 text-center">Trusted by Celebrities</p>
        <div className="w-[150px] h-[3px] m-auto rounded-full bg-white my-3"></div>
        <p className="text-center text-white">Trusted by stars. See how celebrities found clarity and guidance through our astrological consultations.</p>

        <div
          className="carousel2 flex justify-center mt-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center w-full gap-5">
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
              disabled={totalCards <= visibleCardsCount}
            >
              <FaChevronLeft size={24} />
            </button>

            <div className="flex justify-start items-center gap-6 w-full">
              {visibleCards.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{
                    flexBasis: `calc((100% - ${(visibleCardsCount - 1) * 1.5}rem) / ${visibleCardsCount})` 
                  }}
                >
                  <div
                    className="card4 bg-white min-h-[250px] aspect-h-9 p-2 rounded-lg shadow-lg cursor-pointer relative"
                    onClick={() => setSelectedVideo(getYouTubeID(item.YoutubeUrl))}
                  >
                    <div className="video relative">
                      {/* YouTube Thumbnail */}
                      <img
                        src={item?.ImageUrl ? item?.ImageUrl : '/images/default-video-thumbnail.webp'}
                        style={{ height: "215px", width: "100%" }}
                        alt="Video Thumbnail"
                        className="rounded-md w-full cursor-pointer"
                      />
                      {/* YouTube Play Icon Overlay */}
                      <div className="absolute inset-0 flex justify-center items-center">
                        <IoLogoYoutube className=" text-6xl opacity-80 transition-transform duration-300 hover:scale-110 cursor-pointer" style={{ color: 'red' }} />
                      </div>
                    </div>
                    <div className="my-2 text-black text-center capitalize">
                      <p>
                        {item.Description.length > 30
                          ? item.Description.substring(0, 30) + "..."
                          : item.Description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="hidden lg:block bg-white border border-orange-500 text-orange-500 rounded-full p-2 shadow hover:bg-orange-500 hover:text-white transition"
              disabled={totalCards <= visibleCardsCount}
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>

        {totalCards > visibleCardsCount && (
          <div className="flex justify-center items-center mt-4 lg:hidden">
            {Array.from({ length: Math.ceil(totalCards / visibleCardsCount) }).map(
              (_, dotIdx) => {
                const pageIndex = Math.floor(currentIndex / visibleCardsCount);
                const isActive = dotIdx === pageIndex;

                return (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx * visibleCardsCount)}
                    className={`mx-1 w-3 h-3 rounded-full border border-white focus:outline-none transition-all duration-200 ${isActive ? "bg-white" : "bg-transparent"
                      }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-[600px]">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-sm"
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="315"
              loading="lazy"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelebritiesReview;
