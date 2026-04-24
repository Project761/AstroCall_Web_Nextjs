"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPray, FaSearch, FaCalendar, FaClock, FaRupeeSign, FaStar, FaOm } from "react-icons/fa";
import Header from "../components/Header/page";
import SEO from "../components/SEO/page";

export default function MyOnlinePuja() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [pujas, setPujas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loginData = localStorage.getItem("LoginTokenData");
    if (loginData) {
      try {
        const parsedData = JSON.parse(loginData);
        setUserData(parsedData);
        
        // Mock puja data - replace with actual API call
        setPujas([
          {
            id: 1,
            name: "Ganesh Puja",
            description: "For success and removing obstacles",
            priest: "Pandit Sharma",
            date: "2024-04-25",
            time: "10:00 AM",
            duration: "45 min",
            cost: 1500,
            image: "/images/puja1.webp",
            status: "upcoming",
            benefits: ["Success", "Obstacle Removal", "Prosperity"]
          },
          {
            id: 2,
            name: "Lakshmi Puja",
            description: "For wealth and prosperity",
            priest: "Pandit Kumar",
            date: "2024-04-20",
            time: "06:00 PM",
            duration: "30 min",
            cost: 1200,
            image: "/images/puja2.webp",
            status: "completed",
            benefits: ["Wealth", "Prosperity", "Financial Growth"]
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

  const filteredPujas = pujas.filter(puja => 
    puja.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puja.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="My Online Puja - AstroCall"
        description="View your online puja bookings and spiritual services"
      />
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaPray className="text-orange-500 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">My Online Puja</h1>
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-semibold">
                {pujas.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search pujas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {filteredPujas.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaPray className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No pujas booked yet</h3>
              <p className="text-gray-600 mb-6">Book online pujas for spiritual blessings</p>
              <button
                onClick={() => router.push("/online-puja")}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Pujas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPujas.map((puja) => (
                <div key={puja.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-100">
                      <Image
                        src={puja.image}
                        alt={puja.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                      puja.status === "upcoming" 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      {puja.status === "upcoming" ? "Upcoming" : "Completed"}
                    </div>
                    <div className="absolute top-3 left-3 bg-orange-500 text-white p-2 rounded-full">
                      <FaOm className="text-sm" />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{puja.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{puja.description}</p>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Priest:</span> {puja.priest}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {puja.benefits.map((benefit, index) => (
                          <span key={index} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="text-orange-500" />
                        <span>{puja.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="text-orange-500" />
                        <span>{puja.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">Duration: {puja.duration}</span>
                      <span className="text-lg font-bold text-orange-600">
                        <FaRupeeSign className="inline mr-1 text-sm" />
                        {puja.cost}
                      </span>
                    </div>

                    <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                      {puja.status === "upcoming" ? "View Details" : "View Recording"}
                    </button>
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
