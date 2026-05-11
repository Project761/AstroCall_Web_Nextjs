"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaComments, FaSearch, FaFilter, FaClock, FaRupeeSign, FaStar, FaEllipsisV } from "react-icons/fa";
import SEO from "../components/SEO/page";
export default function MyChats() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [chats, setChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    useEffect(() => {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData);
                setUserData(parsedData);
                // Mock chat data - replace with actual API call
                setChats([
                    {
                        id: 1,
                        astrologer: {
                            name: "Dr. Priya Sharma",
                            image: "/images/profile pic.webp",
                            expertise: "Vedic Astrology",
                            rating: 4.8
                        },
                        lastMessage: "Thank you for the consultation! The insights were very helpful.",
                        timestamp: "2024-04-23 10:30 AM",
                        unreadCount: 2,
                        status: "completed",
                        duration: "15 min",
                        cost: 750,
                        date: "2024-04-23"
                    },
                    {
                        id: 2,
                        astrologer: {
                            name: "Acharya Rajesh Kumar",
                            image: "/images/profile pic.webp",
                            expertise: "Numerology & Vastu",
                            rating: 4.9
                        },
                        lastMessage: "Please share your birth details for accurate predictions.",
                        timestamp: "2024-04-22 06:45 PM",
                        unreadCount: 1,
                        status: "ongoing",
                        duration: "8 min",
                        cost: 600,
                        date: "2024-04-22"
                    },
                    {
                        id: 3,
                        astrologer: {
                            name: "Guru Maya Devi",
                            image: "/images/profile pic.webp",
                            expertise: "Tarot Reading",
                            rating: 4.7
                        },
                        lastMessage: "The cards reveal positive changes coming your way.",
                        timestamp: "2024-04-21 04:20 PM",
                        unreadCount: 0,
                        status: "completed",
                        duration: "20 min",
                        cost: 1200,
                        date: "2024-04-21"
                    },
                    {
                        id: 4,
                        astrologer: {
                            name: "Pandit Suresh Joshi",
                            image: "/images/profile pic.webp",
                            expertise: "Kundli Matching",
                            rating: 4.6
                        },
                        lastMessage: "Your horoscope matching shows excellent compatibility.",
                        timestamp: "2024-04-20 02:15 PM",
                        unreadCount: 0,
                        status: "completed",
                        duration: "12 min",
                        cost: 480,
                        date: "2024-04-20"
                    }
                ]);
            }
            catch (error) {
                console.error("Error parsing user data:", error);
                router.push("/");
            }
        }
        else {
            router.push("/");
        }
    }, [router]);
    const handleChatClick = (chatId) => {
        router.push(`/chat/${chatId}`);
    };
    const filteredChats = chats.filter(chat => {
        const matchesSearch = chat.astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.astrologer.expertise.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || chat.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
    if (!userData) {
        return (<div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>);
    }
    return (<>
      <SEO title="My Chats - AstroCall" description="View your chat history with astrologers"/>
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaComments className="text-blue-500 text-2xl"/>
                <h1 className="text-2xl font-bold text-gray-800">My Chats</h1>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-semibold">
                  {chats.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                <input type="text" placeholder="Search chat history..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-3 text-gray-400"/>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
                  <option value="all">All Chats</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chat List */}
          {filteredChats.length === 0 ? (<div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaComments className="text-gray-300 text-6xl mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No chat history yet</h3>
              <p className="text-gray-600 mb-6">Start chatting with astrologers to see your conversation history</p>
              <button onClick={() => router.push("/chat-to-astrologers")} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Start Chatting
              </button>
            </div>) : (<div className="space-y-4">
              {filteredChats.map((chat) => (<div key={chat.id} onClick={() => handleChatClick(chat.id)} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Astrologer Image */}
                      <div className="relative">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                          <Image src={chat.astrologer.image} alt={chat.astrologer.name} width={64} height={64} className="w-full h-full object-cover"/>
                        </div>
                        {chat.status === "ongoing" && (<div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>)}
                      </div>

                      {/* Chat Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{chat.astrologer.name}</h3>
                            <p className="text-sm text-gray-600">{chat.astrologer.expertise}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{chat.timestamp}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <FaStar className="text-yellow-400 text-xs"/>
                              <span className="text-xs text-gray-600">{chat.astrologer.rating}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{chat.lastMessage}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <FaClock />
                              <span>{chat.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaRupeeSign />
                              <span>{chat.cost}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full ${chat.status === "ongoing"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"}`}>
                              {chat.status === "ongoing" ? "Active" : "Completed"}
                            </span>
                          </div>
                          {chat.unreadCount > 0 && (<span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              {chat.unreadCount}
                            </span>)}
                        </div>
                      </div>

                      {/* More Options */}
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisV />
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </>);
}
