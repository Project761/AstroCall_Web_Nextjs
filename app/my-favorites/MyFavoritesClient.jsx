"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import { FaHeart, FaStar } from "react-icons/fa";

import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api";

import { UserPanelPage, PanelCard, PanelTabs, PanelLoader, OrangeButton } from "../components/UserPanelPage";

export default function MyFavorites() {

    const router = useRouter();

    const userData = useMemo(() => {

        if (typeof window === "undefined") return null;

        try {

            const loginData = localStorage.getItem("LoginTokenData");

            return loginData ? JSON.parse(loginData) : null;

        } catch {

            return null;

        }

    }, []);

    const [favouritedata, setfavouritedata] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [activeTab, setActiveTab] = useState("Astrologers");

    const favTabs = ["Astrologers", "Articles", "Pujas", "Gemstones"];

    const [filterCategory] = useState("all");

    

    const UserLoginId = typeof window !== 'undefined' && localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";



    const Get_Data_favouriteslist = useCallback(async () => {

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

    }, [UserLoginId]);



    useEffect(() => {

        if (!userData) {

            router.push("/");

            return;

        }

        if (UserLoginId) {

            queueMicrotask(() => { Get_Data_favouriteslist(); });

        }

    }, [userData, router, UserLoginId, Get_Data_favouriteslist]);

    

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

    const toAstrologerSlug = (astrologer) => {

        const name = astrologer?.DisplayName || astrologer?.AstroName || "";

        return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    };

    const handleTalkToAstrologer = (astrologer) => {

        const slug = toAstrologerSlug(astrologer);

        if (slug) router.push(`/talk-to-astrologers/${slug}`);

    };

    const handleChatWithAstrologer = (astrologer) => {

        const slug = toAstrologerSlug(astrologer);

        if (slug) router.push(`/chat-to-astrologers/${slug}`);

    };

    const filteredFavorites = favouritedata.filter(astrologer => {

        const matchesSearch = astrologer.AstroName?.toLowerCase().includes(searchTerm.toLowerCase()) ||

            astrologer.Expertise?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterCategory === "all" ||

            astrologer.Expertise?.toLowerCase().includes(filterCategory.toLowerCase());

        return matchesSearch && matchesFilter;

    });

    if (!userData || loading) return <PanelLoader />;



    return (

      <UserPanelPage title="My Favorites" subtitle="Manage and connect with your favorite astrologers"

        action={<span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#FF5C00]">{favouritedata.length} saved</span>}>

        <PanelCard>

          <PanelTabs tabs={favTabs} active={activeTab} onChange={setActiveTab} />

        </PanelCard>



        {activeTab !== "Astrologers" ? (

          <PanelCard className="py-12 text-center text-sm text-gray-500">No {activeTab.toLowerCase()} in favorites yet.</PanelCard>

        ) : filteredFavorites.length === 0 ? (

          <PanelCard className="py-16 text-center">

            <p className="font-semibold text-gray-800">No favorites yet</p>

            <p className="mt-1 text-sm text-gray-500">Start adding astrologers to your favorites</p>

            <OrangeButton className="mt-4" onClick={() => router.push("/talk-to-astrologers")}>Explore Astrologers</OrangeButton>

          </PanelCard>

        ) : (

          <div className="space-y-3">

            {filteredFavorites.map((astrologer) => (

              <PanelCard key={astrologer.AstroID} className="!p-4">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-orange-100">

                    <Image src={astrologer.AstroProfile || "/images/profile pic.webp"} alt={astrologer.AstroName} width={64} height={64} className="h-full w-full object-cover" />

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="font-bold text-[#1A1A1A]">{astrologer.AstroName}</h3>

                    <p className="text-xs text-gray-500">{astrologer.Expertise}</p>

                    <div className="mt-1 flex items-center gap-1 text-xs">

                      <FaStar className="text-yellow-400" />

                      <span className="font-bold">{astrologer.Rating || "4.9"}</span>

                      <span className="text-gray-500">({astrologer.TotalReviews || "0"} reviews)</span>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-bold text-[#FF5C00]">₹{astrologer.PricePerMin || "50"}/min</p>

                    <div className="mt-2 flex gap-2">

                      <OrangeButton outline onClick={() => handleChatWithAstrologer(astrologer)}>Chat</OrangeButton>

                      <OrangeButton outline onClick={() => handleTalkToAstrologer(astrologer)}>Call</OrangeButton>

                    </div>

                  </div>

                  <button type="button" onClick={() => handleRemoveFavorite(astrologer.AstroID)} className="text-red-400 hover:text-red-600"><FaHeart /></button>

                </div>

              </PanelCard>

            ))}

          </div>

        )}

      </UserPanelPage>

    );

}

