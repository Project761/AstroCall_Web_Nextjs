"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaStar, FaPhone, FaComment, FaSearch, FaFilter } from "react-icons/fa";
import SEO from "../components/SEO/page";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api";
export default function MyFavorites() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [favouritedata, setfavouritedata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    
    const UserLoginId = localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";
    useEffect(() => {
        const loginData = localStorage.getItem("LoginTokenData");
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData);
                setUserData(parsedData);
                if (UserLoginId) {
                    Get_Data_favouriteslist();
                }
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
    
    const Get_Data_favouriteslist = async () => {
        const val = { 'UserID': UserLoginId, 'IsActive': '1' };
        try {
            const res = await postWithToken('Astrofavouriteslist/GetData_Astrofavouriteslist', val);
            if (res) {
                setfavouritedata(res?.filter((item) => item?.AstroID));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error, 'error')
        }
    };

    const favouriteslist_Delete = async (astroId) => {
        const favorite = favouritedata.find(fav => fav.AstroID === astroId);
        if (!favorite) return;

        const val = {
            'FavouritesID': favorite.FavouritesID,
            'DeleteByUser': '1',
            'IsActive': '0',
        };
        try {
            const res = await TokenWithDeleteUpadateAdd('Astrofavouriteslist/Delete_Astrofavouriteslist', val);
            if (res) {
                Get_Data_favouriteslist();
            }
        } catch (error) {
            console.error('Error deleting favourite:', error);
        }
    };
    const handleRemoveFavorite = (astroId) => {
        favouriteslist_Delete(astroId);
    };
    const handleTalkToAstrologer = (astroId) => {
        router.push(`/talk-to-astrologers/${astroId}`);
    };
    const handleChatWithAstrologer = (astroId) => {
        router.push(`/chat-to-astrologers/${astroId}`);
    };
    const filteredFavorites = favouritedata.filter(astrologer => {
        const matchesSearch = astrologer.AstroName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            astrologer.Expertise?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterCategory === "all" ||
            astrologer.Expertise?.toLowerCase().includes(filterCategory.toLowerCase());
        return matchesSearch && matchesFilter;
    });
    if (!userData || loading) {
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
      <SEO title="My Favorites - AstroCall" description="View and manage your favorite astrologers"/>
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaHeart className="text-red-500 text-2xl"/>
                <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                  {favouritedata.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                <input type="text" placeholder="Search favorite astrologers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-3 text-gray-400"/>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
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
          {filteredFavorites.length === 0 ? (<div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaHeart className="text-gray-300 text-6xl mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start adding astrologers to your favorites to see them here</p>
              <button onClick={() => router.push("/talk-to-astrologers")} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                Explore Astrologers
              </button>
            </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((astrologer) => (<div key={astrologer.AstroID} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Astrologer Image and Favorite Button */}
                  <div className="relative">
                    <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-100">
                      <Image src={astrologer.AstroProfile || "/images/profile pic.webp"} alt={astrologer.AstroName} width={200} height={200} className="w-full h-full object-cover"/>
                    </div>
                    <button onClick={() => handleRemoveFavorite(astrologer.AstroID)} className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors">
                      <FaHeart className="text-red-500"/>
                    </button>
                    {astrologer.IsOnline && (<div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Online
                      </div>)}
                  </div>

                  {/* Astrologer Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{astrologer.AstroName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{astrologer.Expertise}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400 text-sm"/>
                      <span className="text-sm font-medium">{astrologer.Rating || '4.5'}</span>
                      <span className="text-xs text-gray-500">({astrologer.TotalReviews || '0'} reviews)</span>
                    </div>

                    {/* Experience */}
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Experience:</span> {astrologer.Experience || 'N/A'}
                    </p>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {astrologer.Languages?.split(',').map((lang, index) => (<span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {lang.trim()}
                        </span>))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{astrologer.PricePerMin || '50'}/min
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button onClick={() => handleTalkToAstrologer(astrologer.AstroID)} className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1 text-sm">
                        <FaPhone className="text-xs"/>
                        <span>Talk</span>
                      </button>
                      <button onClick={() => handleChatWithAstrologer(astrologer.AstroID)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 text-sm">
                        <FaComment className="text-xs"/>
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>)}
        </div>
      </div>
    </>);
}
