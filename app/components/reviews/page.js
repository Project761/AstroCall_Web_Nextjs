"use client";
import React, { useEffect, useState } from "react";
import { postWithToken } from "../../utils/api.js";
const CustomersFeedback = () => {
    const [customerdata, setcustomerdata] = useState([]);
    const [currentIndex, setcurrentIndex] = useState(0);
    const [visibleCardsCount, setVisibleCardsCount] = useState(3);
    useEffect(() => {
        Get_Data_CustomerStories();
        const updateVisibleCardsCount = () => {
            if (typeof window !== 'undefined') {
                const width = window.innerWidth;
                if (width < 640) {
                    setVisibleCardsCount(1);
                }
                else if (width < 1024) {
                    setVisibleCardsCount(2);
                }
                else {
                    setVisibleCardsCount(3);
                }
            }
        };
        updateVisibleCardsCount(); // Initial check
        if (typeof window !== 'undefined') {
            window.addEventListener("resize", updateVisibleCardsCount); // Listen for window resize
            return () => window.removeEventListener("resize", updateVisibleCardsCount); // Clean up
        }
    }, []);
    const Get_Data_CustomerStories = async () => {
        const val = { 'IsActive': 1 };
        try {
            const res = await postWithToken('CustomerStories/GetData_CustomerStories', val);
            if (res) {
                setcustomerdata(res?.filter((data) => data.Name));
            }
        }
        catch (error) {
            console.log(error, 'error');
        }
    };
    const totalCards = customerdata.length;
    const handlePrevious = () => {
        setcurrentIndex((prevIndex) => prevIndex === 0 ? totalCards - visibleCardsCount : prevIndex - 1);
    };
    const handleNext = () => {
        setcurrentIndex((prevIndex) => prevIndex === totalCards - visibleCardsCount ? 0 : prevIndex + 1);
    };
    return (<div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16">
      <div className="main-container">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our <span className="text-orange-500">Customers</span> Say
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto px-4">
            Discover authentic experiences and testimonials from clients who have transformed their lives through our expert astrological guidance
          </p>
        </div>

        {/* Carousel Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {customerdata.length > visibleCardsCount && (<div className="flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button onClick={handlePrevious} className="group bg-white shadow-lg rounded-full p-3 hover:bg-orange-50 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={totalCards <= visibleCardsCount}>
                <svg className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {customerdata
                .slice(currentIndex, currentIndex + visibleCardsCount)
                .map(item => (<div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-orange-100 hover:border-orange-200 transform hover:-translate-y-1" key={item.Id}>
                      {/* Customer Profile */}
                      <div className="flex items-center mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 p-0.5">
                            <img className="w-full h-full rounded-full object-cover" src={item.PhotoUrl ? `https://${item.PhotoUrl.replace(/\\/g, "/")}` : '/images/default-profile.webp'} alt={item.Name}/>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">{item.Name}</h3>
                          <p className="text-gray-500 text-sm">{item.Designation || 'Valued Client'}</p>
                        </div>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (<svg key={index} className={`w-5 h-5 ${index < (item.Stars || 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">({item.Stars || 5}.0)</span>
                      </div>

                      {/* Review Text */}
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed text-sm italic line-clamp-6">
                          "{item.Comments}"
                        </p>
                      </div>

                      {/* Review Date */}
                      <div className="mt-4 flex items-center text-xs text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Verified Review
                      </div>
                    </div>))}
              </div>

              {/* Next Button */}
              <button onClick={handleNext} className="group bg-white shadow-lg rounded-full p-3 hover:bg-orange-50 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" disabled={totalCards <= visibleCardsCount}>
                <svg className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>)}

          {/* Static Grid View */}
          {customerdata.length <= visibleCardsCount && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {customerdata?.slice(currentIndex, currentIndex + visibleCardsCount)?.map((item, index) => (<div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-orange-100 hover:border-orange-200 transform hover:-translate-y-1" key={item.Id || `card-${index}`}>
                  {/* Customer Profile */}
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 p-0.5">
                        <img className="w-full h-full rounded-full object-cover" src={item.PhotoUrl ? `https://${item.PhotoUrl.replace(/\\/g, "/")}` : '/images/default-profile.webp'} alt={item.Name}/>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{item.Name}</h3>
                      <p className="text-gray-500 text-sm">{item.Designation || 'Valued Client'}</p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (<svg key={index} className={`w-5 h-5 ${index < (item.Stars || 5) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">({item.Stars || 5}.0)</span>
                  </div>

                  {/* Review Text */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed text-sm italic line-clamp-6">
                      "{item.Comments}"
                    </p>
                  </div>

                  {/* Review Date */}
                  <div className="mt-4 flex items-center text-xs text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Verified Review
                  </div>
                </div>))}
            </div>)}

          {/* Carousel Dots */}
          {customerdata.length > visibleCardsCount && (<div className="flex justify-center items-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(customerdata.length / visibleCardsCount) }).map((_, dotIdx) => {
                const isActive = Math.floor(currentIndex / visibleCardsCount) === dotIdx;
                return (<button key={dotIdx} onClick={() => setcurrentIndex(dotIdx * visibleCardsCount)} className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-500 w-8' : 'bg-orange-200 hover:bg-orange-300'}`} aria-label={`Go to slide ${dotIdx + 1}`}/>);
            })}
            </div>)}
        </div>
      </div>
    </div>);
};
export default CustomersFeedback;
