"use client";

import { useEffect, useState } from "react";
import { postWithToken } from "../utils/api";
import Image from "next/image";
import Link from "next/link";

export default function TalkToAstrologers() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);

  const Get_Data_Astrologer = async () => {
    try {
      const val = { IsActive: "1", Source: "call" };
      const res = await postWithToken("Astrologer/UserGetData_Astrologer", val);
      setAstrologers(res || []);
    } catch (error) {
      console.error("Error fetching astrologer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Get_Data_Astrologer();
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">
          Talk with Astrologers
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm font-medium">
              Available balance: <span className="font-semibold">₹ 0</span>
            </p>

            <button className="px-4 py-1.5 bg-gray-100 border rounded-md text-sm hover:bg-gray-200">
              Recharge
            </button>

            <button className="px-4 py-1.5 bg-gray-100 border rounded-md text-sm hover:bg-gray-200">
              Sort by
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search name..."
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading astrologers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers?.map((astro) => {
              const imagePath = astro?.AvatarUrl
                ?.replace(/\\/g, "/")
                ?.replace("api.astrocall.live/", "");

              const finalUrl = `https://api.astrocall.live/${imagePath}`;

              return (
                <div
                  key={astro?.ID}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-start gap-4 hover:shadow-md transition"
                >
                  {/* LEFT IMAGE */}
                  <div className="relative">
                    <img
                      src={finalUrl}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    {/* Online Dot */}
                    {astro.OnlineStatus && (
                      <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex-1">
                    {/* Name */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/talk-to-astrologers/${encodeURIComponent(astro.DisplayName)}`}
                      >
                        <h3 className="font-semibold text-md">
                          {astro.DisplayName}
                        </h3>
                      </Link>

                      {/* Verified badge */}
                      <span className="text-blue-500 text-sm">✔</span>
                    </div>

                    {/* Skills */}
                    <p className="text-xs text-gray-500 mt-1">
                      {astro.skillsValue}
                    </p>

                    {/* Languages */}
                    <p className="text-xs text-gray-500">
                      {astro.LanguageValue}
                    </p>

                    {/* Experience */}
                    <p className="text-xs text-gray-500">
                      {astro.ExperiencedYears} Years
                    </p>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between mt-2">
                      {/* Price / Free */}
                      <div>
                        {astro.PricePerMin === 0 ? (
                          <p className="text-red-500 text-xs font-medium">
                            Free Chat
                          </p>
                        ) : (
                          <p className="text-orange-500 text-xs font-medium">
                            {astro.CurrencySymbol}
                            {astro.PricePerMin}/min
                          </p>
                        )}
                      </div>

                      {/* Chat Button */}
                      <button
                        disabled={!astro.OnlineStatus}
                        className={`px-4 py-1 text-sm rounded-full border ${astro.OnlineStatus
                          ? "border-green-500 text-green-600 hover:bg-green-50"
                          : "border-gray-300 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && astrologers.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No astrologers available right now
          </p>
        )}
      </div>
    </div>
  );
}