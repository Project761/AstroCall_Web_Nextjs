"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaClock, FaSearch, FaStar, FaTimes } from "react-icons/fa";
import SEO from "../components/SEO/page";
export default function WaitList() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [waitList, setWaitList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData);
                setUserData(parsedData);
                // Mock waitlist data - replace with actual API call
                setWaitList([
                    {
                        id: 1,
                        astrologer: {
                            name: "Dr. Priya Sharma",
                            image: "/images/profile pic.webp",
                            expertise: "Vedic Astrology",
                            rating: 4.8
                        },
                        requestedAt: "2024-04-23 10:30 AM",
                        estimatedWait: "15 minutes",
                        status: "waiting",
                        position: 2
                    },
                    {
                        id: 2,
                        astrologer: {
                            name: "Acharya Rajesh Kumar",
                            image: "/images/profile pic.webp",
                            expertise: "Numerology & Vastu",
                            rating: 4.9
                        },
                        requestedAt: "2024-04-23 09:45 AM",
                        estimatedWait: "5 minutes",
                        status: "ready",
                        position: 1
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
    const handleRemoveFromWaitList = (itemId) => {
        setWaitList(prev => prev.filter(item => item.id !== itemId));
    };
    const filteredWaitList = waitList.filter(item => item.astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.astrologer.expertise.toLowerCase().includes(searchTerm.toLowerCase()));
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
      <SEO title="Wait List - AstroCall" description="Manage your waitlist for astrologer consultations"/>
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaClock className="text-orange-500 text-2xl"/>
              <h1 className="text-2xl font-bold text-gray-800">Wait List</h1>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-semibold">
                {waitList.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400"/>
              <input type="text" placeholder="Search waitlist..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
          </div>

          {filteredWaitList.length === 0 ? (<div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaClock className="text-gray-300 text-6xl mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No items in waitlist</h3>
              <p className="text-gray-600 mb-6">Join waitlist for busy astrologers</p>
              <button onClick={() => router.push("/talk-to-astrologers")} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                Browse Astrologers
              </button>
            </div>) : (<div className="space-y-4">
              {filteredWaitList.map((item) => (<div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                        <Image src={item.astrologer.image} alt={item.astrologer.name} width={64} height={64} className="w-full h-full object-cover"/>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.astrologer.name}</h3>
                            <p className="text-sm text-gray-600">{item.astrologer.expertise}</p>
                          </div>
                          <div className="text-right">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "ready"
                    ? "bg-green-100 text-green-600 animate-pulse"
                    : "bg-orange-100 text-orange-600"}`}>
                              {item.status === "ready" ? "Ready Now!" : "Waiting"}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Position: #{item.position}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-2">
                          <FaStar className="text-yellow-400 text-sm"/>
                          <span className="text-sm font-medium">{item.astrologer.rating}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Requested: {item.requestedAt}</span>
                          <span>Est. wait: {item.estimatedWait}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {item.status === "ready" && (<button onClick={() => router.push(`/talk-to-astrologers/${item.astrologer.id}`)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                            Connect Now
                          </button>)}
                        <button onClick={() => handleRemoveFromWaitList(item.id)} className="text-red-500 hover:text-red-600 p-2">
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </>);
}
