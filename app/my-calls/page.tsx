"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPhone, FaSearch, FaFilter, FaUser, FaClock, FaRupeeSign, FaStar, FaPhoneAlt, FaPlay, FaPause } from "react-icons/fa";
import Header from "../components/Header/page";
import SEO from "../components/SEO/page";

export default function MyCalls() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [calls, setCalls] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const loginData = localStorage.getItem("LoginTokenData");
    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        setUserData(parsedData);
        
        // Mock call data - replace with actual API call
        setCalls([
          {
            id: 1,
            astrologer: {
              name: "Dr. Priya Sharma",
              image: "/images/astrologer1.webp",
              expertise: "Vedic Astrology",
              rating: 4.8
            },
            date: "2024-04-23",
            time: "10:30 AM",
            duration: "15 min",
            cost: 750,
            status: "completed",
            recording: true,
            notes: "Discussed career prospects and financial situation"
          },
          {
            id: 2,
            astrologer: {
              name: "Acharya Rajesh Kumar",
              image: "/images/astrologer2.webp",
              expertise: "Numerology & Vastu",
              rating: 4.9
            },
            date: "2024-04-22",
            time: "06:45 PM",
            duration: "8 min",
            cost: 600,
            status: "completed",
            recording: true,
            notes: "Numerology analysis for business decisions"
          },
          {
            id: 3,
            astrologer: {
              name: "Guru Maya Devi",
              image: "/images/astrologer3.webp",
              expertise: "Tarot Reading",
              rating: 4.7
            },
            date: "2024-04-21",
            time: "04:20 PM",
            duration: "20 min",
            cost: 1200,
            status: "completed",
            recording: false,
            notes: "Tarot reading for relationship guidance"
          },
          {
            id: 4,
            astrologer: {
              name: "Pandit Suresh Joshi",
              image: "/images/astrologer4.webp",
              expertise: "Kundli Matching",
              rating: 4.6
            },
            date: "2024-04-20",
            time: "02:15 PM",
            duration: "12 min",
            cost: 480,
            status: "completed",
            recording: true,
            notes: "Kundli matching for marriage compatibility"
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

  const handlePlayRecording = (callId: any) => {
    // Handle call recording playback
    console.log("Playing recording for call:", callId);
  };

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.astrologer.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || call.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalCost = calls.reduce((sum, call) => sum + call.cost, 0);
  const totalDuration = calls.reduce((sum, call) => {
    const minutes = parseInt(call.duration);
    return sum + minutes;
  }, 0);

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
        title="My Calls - AstroCall"
        description="View your call history with astrologers"
      />
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-500 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-800">My Calls</h1>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-semibold">
                  {calls.length}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Calls</p>
                  <p className="text-2xl font-bold text-gray-800">{calls.length}</p>
                </div>
                <FaPhone className="text-green-500 text-2xl opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Duration</p>
                  <p className="text-2xl font-bold text-gray-800">{totalDuration} min</p>
                </div>
                <FaClock className="text-blue-500 text-2xl opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-800">₹{totalCost}</p>
                </div>
                <FaRupeeSign className="text-orange-500 text-2xl opacity-50" />
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
                  placeholder="Search call history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                >
                  <option value="all">All Calls</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Call List */}
          {filteredCalls.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaPhone className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No call history yet</h3>
              <p className="text-gray-600 mb-6">Start calling astrologers to see your call history</p>
              <button
                onClick={() => router.push("/talk-to-astrologers")}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Calling
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Astrologer Image */}
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={call.astrologer.image}
                          alt={call.astrologer.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Call Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{call.astrologer.name}</h3>
                            <p className="text-sm text-gray-600">{call.astrologer.expertise}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">{call.date}</p>
                            <p className="text-xs text-gray-500">{call.time}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <FaStar className="text-yellow-400 text-xs" />
                              <span className="text-xs text-gray-600">{call.astrologer.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Call Notes */}
                        {call.notes && (
                          <div className="bg-gray-50 rounded p-2 mb-3">
                            <p className="text-sm text-gray-700">{call.notes}</p>
                          </div>
                        )}

                        {/* Call Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <FaClock />
                              <span>{call.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaRupeeSign />
                              <span>{call.cost}</span>
                            </div>
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-600">
                              {call.status}
                            </span>
                          </div>
                          
                          {/* Recording Button */}
                          {call.recording && (
                            <button
                              onClick={() => handlePlayRecording(call.id)}
                              className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600 transition-colors"
                            >
                              <FaPlay className="text-xs" />
                              <span>Play Recording</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Call Again Button */}
                      <button className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors">
                        <FaPhoneAlt className="text-sm" />
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
