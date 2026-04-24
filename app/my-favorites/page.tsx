"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaStar, FaPhone, FaComment, FaRegHeart, FaSearch, FaFilter } from "react-icons/fa";
import Header from "../components/Header/page";
import SEO from "../components/SEO/page";

export default function MyFavorites() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const loginData = localStorage.getItem("LoginTokenData");
    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        setUserData(parsedData);
        
        // Mock favorite astrologers data - replace with actual API call
        setFavorites([
          {
            id: 1,
            name: "Dr. Priya Sharma",
            expertise: "Vedic Astrology",
            rating: 4.8,
            reviews: 234,
            experience: "15 years",
            price: 50,
            image: "/images/astrologer1.webp",
            languages: ["Hindi", "English"],
            isOnline: true,
            isFavorite: true
          },
          {
            id: 2,
            name: "Acharya Rajesh Kumar",
            expertise: "Numerology & Vastu",
            rating: 4.9,
            reviews: 189,
            experience: "12 years",
            price: 75,
            image: "/images/astrologer2.webp",
            languages: ["Hindi", "English", "Tamil"],
            isOnline: false,
            isFavorite: true
          },
          {
            id: 3,
            name: "Guru Maya Devi",
            expertise: "Tarot Reading",
            rating: 4.7,
            reviews: 156,
            experience: "10 years",
            price: 60,
            image: "/images/astrologer3.webp",
            languages: ["Hindi", "English"],
            isOnline: true,
            isFavorite: true
          },
          {
            id: 4,
            name: "Pandit Suresh Joshi",
            expertise: "Kundli Matching",
            rating: 4.6,
            reviews: 98,
            experience: "8 years",
            price: 40,
            image: "/images/astrologer4.webp",
            languages: ["Hindi", "Marathi"],
            isOnline: false,
            isFavorite: true
          }
        ]);
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleRemoveFavorite = (astrologerId) => {
    setFavorites(prev => prev.filter(astrologer => astrologer.id !== astrologerId));
  };

  const handleTalkToAstrologer = (astrologerId) => {
    router.push(`/talk-to-astrologers/${astrologerId}`);
  };

  const handleChatWithAstrologer = (astrologerId) => {
    router.push(`/chat-to-astrologers/${astrologerId}`);
  };

  const filteredFavorites = favorites.filter(astrologer => {
    const matchesSearch = astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         astrologer.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === "all" || 
                         astrologer.expertise.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="My Favorites - AstroCall"
        description="View and manage your favorite astrologers"
      />
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaHeart className="text-red-500 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                  {favorites.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search favorite astrologers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                >
                  <option value="all">All Categories</option>
                  <option value="vedic">Vedic Astrology</option>
                  <option value="numerology">Numerology</option>
                  <option value="tarot">Tarot Reading</option>
                  <option value="vastu">Vastu</option>
                  <option value="kundli">Kundli Matching</option>
                </select>
              </div>
            </div>
          </div>

          {/* Favorites Grid */}
          {filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start adding astrologers to your favorites to see them here</p>
              <button
                onClick={() => router.push("/talk-to-astrologers")}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Explore Astrologers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((astrologer) => (
                <div key={astrologer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Astrologer Image and Favorite Button */}
                  <div className="relative">
                    <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-100">
                      <Image
                        src={astrologer.image}
                        alt={astrologer.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(astrologer.id)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <FaHeart className="text-red-500" />
                    </button>
                    {astrologer.isOnline && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Online
                      </div>
                    )}
                  </div>

                  {/* Astrologer Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{astrologer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{astrologer.expertise}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium">{astrologer.rating}</span>
                      <span className="text-xs text-gray-500">({astrologer.reviews} reviews)</span>
                    </div>

                    {/* Experience */}
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Experience:</span> {astrologer.experience}
                    </p>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {astrologer.languages.map((lang, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{astrologer.price}/min
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTalkToAstrologer(astrologer.id)}
                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <FaPhone className="text-xs" />
                        <span>Talk</span>
                      </button>
                      <button
                        onClick={() => handleChatWithAstrologer(astrologer.id)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <FaComment className="text-xs" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
