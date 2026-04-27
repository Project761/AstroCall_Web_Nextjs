"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUserFriends, FaSearch, FaStar, FaPhone, FaComment, FaHeart } from "react-icons/fa";
import SEO from "../components/SEO/page";
export default function MyFollowing() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [following, setFollowing] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData);
                setUserData(parsedData);
                // Mock following data - replace with actual API call
                setFollowing([
                    {
                        id: 1,
                        name: "Dr. Priya Sharma",
                        expertise: "Vedic Astrology",
                        rating: 4.8,
                        reviews: 234,
                        image: "/images/profile pic.webp",
                        isOnline: true,
                        followers: 1250,
                        experience: "15 years"
                    },
                    {
                        id: 2,
                        name: "Acharya Rajesh Kumar",
                        expertise: "Numerology & Vastu",
                        rating: 4.9,
                        reviews: 189,
                        image: "/images/profile pic.webp",
                        isOnline: false,
                        followers: 890,
                        experience: "12 years"
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
    const handleUnfollow = (astrologerId) => {
        setFollowing(prev => prev.filter(astrologer => astrologer.id !== astrologerId));
    };
    const filteredFollowing = following.filter(astrologer => astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        astrologer.expertise.toLowerCase().includes(searchTerm.toLowerCase()));
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
      <SEO title="My Following - AstroCall" description="Manage astrologers you are following"/>
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaUserFriends className="text-blue-500 text-2xl"/>
              <h1 className="text-2xl font-bold text-gray-800">My Following</h1>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-semibold">
                {following.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400"/>
              <input type="text" placeholder="Search followed astrologers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
          </div>

          {filteredFollowing.length === 0 ? (<div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaUserFriends className="text-gray-300 text-6xl mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No astrologers followed yet</h3>
              <p className="text-gray-600 mb-6">Follow astrologers to stay updated with their services</p>
              <button onClick={() => router.push("/talk-to-astrologers")} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Explore Astrologers
              </button>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFollowing.map((astrologer) => (<div key={astrologer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-100">
                      <Image src={astrologer.image} alt={astrologer.name} width={200} height={200} className="w-full h-full object-cover"/>
                    </div>
                    {astrologer.isOnline && (<div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Online
                      </div>)}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{astrologer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{astrologer.expertise}</p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm"/>
                      <span className="text-sm font-medium">{astrologer.rating}</span>
                      <span className="text-xs text-gray-500">({astrologer.reviews} reviews)</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Experience:</span> {astrologer.experience}
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Followers:</span> {astrologer.followers.toLocaleString()}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/talk-to-astrologers/${astrologer.id}`)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1 text-sm">
                        <FaPhone className="text-xs"/>
                        <span>Talk</span>
                      </button>
                      <button onClick={() => router.push(`/chat-to-astrologers/${astrologer.id}`)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 text-sm">
                        <FaComment className="text-xs"/>
                        <span>Chat</span>
                      </button>
                    </div>

                    <button onClick={() => handleUnfollow(astrologer.id)} className="w-full mt-2 border border-red-300 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm">
                      <FaHeart className="text-xs"/>
                      <span>Unfollow</span>
                    </button>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </>);
}
