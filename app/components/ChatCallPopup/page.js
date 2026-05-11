import React from "react";
import { useRouter } from "next/navigation";

const ChatCallPopup = () => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center h-[350px] mb-10 bg-gradient-to-r from-orange-400 via-orange-400 to-orange-400 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white/90 rounded-3xl shadow-2xl p-8 max-w-3xl w-full space-y-8 md:space-y-0 md:space-x-10">

                {/* Text Section */}
                <div className="text-gray-800 text-lg md:text-2xl font-medium text-center md:text-left leading-relaxed">
                    Connect with an <span className="text-orange-500 font-bold">Astrologer</span>
                    on Call or Chat for more personalised & detailed predictions.
                </div>

                {/* Buttons */}
                <div className="flex flex-col space-y-2 w-full md:w-auto">
                    {/* Call Button */}
                    <button
                        className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white py-2 px-7 rounded-full shadow-lg hover:scale-105 hover:from-orange-600 hover:to-orange-800 transition-all duration-300"
                        onClick={() => { router.push('/talk-to-astrologers') }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.373 18 2 12.627 2 6V3z" />
                        </svg>
                        <span className="font-semibold">Talk to Astrologer</span>
                    </button>

                    {/* Chat Button */}
                    <button
                        className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white py-2 px-7 rounded-full shadow-lg hover:scale-105 hover:from-orange-600 hover:to-orange-800 transition-all duration-300"
                        onClick={() => { router.push('/chat-to-astrologers') }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.522 12.112 2 10.591 2 9c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Chat with Astrologer</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatCallPopup;
