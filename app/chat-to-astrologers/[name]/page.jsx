"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { postWithToken } from "@/app/utils/api";

export default function AstrologerDetailChat() {
  const { name } = useParams();
  const [astro, setAstro] = useState(null);
  const [loading, setLoading] = useState(true);

  const Get_Data_Astrologer = async () => {
    try {
      const val = {
        AstrologerName: decodeURIComponent(name),
        IsActive: "1",
      };

      const res = await postWithToken(
        "Astrologer/UserGetData_Astrologer",
        val
      );

      // single data
      const data = res?.find((item) => item?.ID);
      setAstro(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) Get_Data_Astrologer();
  }, [name]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!astro) {
    return <p className="text-center mt-20">Astrologer not found</p>;
  }

  const imagePath = astro?.AvatarUrl
    ?.replace(/\\/g, "/")
    ?.replace("api.astrocall.live/", "");

  const imageUrl = `https://api.astrocall.live/${imagePath}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          
          {/* IMAGE */}
          <img
            src={imageUrl}
            className="w-32 h-32 rounded-full object-cover border"
          />

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{astro.DisplayName}</h1>

            <p className="text-gray-500 mt-1">{astro.skillsValue}</p>

            <p className="text-sm text-gray-600 mt-1">
              {astro.LanguageValue}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {astro.ExperiencedYears} Years Experience
            </p>

            <p className="text-orange-500 font-semibold mt-2">
              {astro.CurrencySymbol}
              {astro.PricePerMin}/min
            </p>

            {/* STATUS */}
            <p className="mt-2">
              {astro.OnlineStatus ? (
                <span className="text-green-600">● Online</span>
              ) : (
                <span className="text-gray-400">Offline</span>
              )}
            </p>

            {/* BUTTON */}
            <button
              className={`mt-4 px-6 py-2 rounded-lg ${
                astro.OnlineStatus
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              Start Chat
            </button>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {astro.Aboutme}
          </p>
        </div>

        {/* EXTRA INFO */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Orders</p>
            <p className="font-semibold">{astro.Orders}</p>
          </div>

          <div>
            <p className="text-gray-500">Chat Orders</p>
            <p className="font-semibold">{astro.ChatOrders}</p>
          </div>

          <div>
            <p className="text-gray-500">Call Orders</p>
            <p className="font-semibold">{astro.CallOrders}</p>
          </div>

          <div>
            <p className="text-gray-500">Rating</p>
            <p className="font-semibold">{astro.Review} ⭐</p>
          </div>

          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-semibold">{astro.Gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
}