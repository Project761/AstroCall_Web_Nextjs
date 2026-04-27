"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGem, FaSearch, FaShoppingCart, FaStar } from "react-icons/fa";
import SEO from "../components/SEO/page";
export default function MyGemStone() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [gemstones, setGemstones] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData);
                setUserData(parsedData);
                // Mock gemstone data - replace with actual API call
                setGemstones([
                    {
                        id: 1,
                        name: "Blue Sapphire",
                        price: 2500,
                        image: "/images/gemstone1.webp",
                        description: "Brings wealth and prosperity",
                        benefits: ["Wealth", "Career Growth", "Health"],
                        rating: 4.7,
                        reviews: 45,
                        isPurchased: true,
                        purchaseDate: "2024-04-20"
                    },
                    {
                        id: 2,
                        name: "Red Coral",
                        price: 1800,
                        image: "/images/gemstone2.webp",
                        description: "Enhances courage and confidence",
                        benefits: ["Courage", "Leadership", "Energy"],
                        rating: 4.5,
                        reviews: 32,
                        isPurchased: true,
                        purchaseDate: "2024-04-15"
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
    const filteredGemstones = gemstones.filter(gemstone => gemstone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gemstone.description.toLowerCase().includes(searchTerm.toLowerCase()));
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
      <SEO title="My GemStone - AstroCall" description="View your purchased gemstones and remedies"/>
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <FaGem className="text-purple-500 text-2xl"/>
              <h1 className="text-2xl font-bold text-gray-800">My GemStone</h1>
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-sm font-semibold">
                {gemstones.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400"/>
              <input type="text" placeholder="Search gemstones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
            </div>
          </div>

          {filteredGemstones.length === 0 ? (<div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaGem className="text-gray-300 text-6xl mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No gemstones purchased yet</h3>
              <p className="text-gray-600 mb-6">Explore our collection of authentic gemstones</p>
              <button onClick={() => router.push("/gemstones")} className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors">
                Browse Gemstones
              </button>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGemstones.map((gemstone) => (<div key={gemstone.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-100">
                      <Image src={gemstone.image} alt={gemstone.name} width={200} height={200} className="w-full h-full object-cover"/>
                    </div>
                    {gemstone.isPurchased && (<div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Purchased
                      </div>)}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{gemstone.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{gemstone.description}</p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm"/>
                      <span className="text-sm font-medium">{gemstone.rating}</span>
                      <span className="text-xs text-gray-500">({gemstone.reviews} reviews)</span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {gemstone.benefits.map((benefit, index) => (<span key={index} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                            {benefit}
                          </span>))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-purple-600">₹{gemstone.price}</span>
                      {gemstone.isPurchased && (<span className="text-xs text-gray-500">Purchased: {gemstone.purchaseDate}</span>)}
                    </div>

                    <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
                      <FaShoppingCart className="text-sm"/>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </>);
}
