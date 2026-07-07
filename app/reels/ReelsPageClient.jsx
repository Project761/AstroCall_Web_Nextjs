"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Heart, MessageCircle, Send, Pause, Play, Bookmark, MoreHorizontal, Volume2, VolumeX, Maximize2 } from "lucide-react";
import {
  FaArrowUp, FaCheckCircle, FaChevronLeft, FaChevronRight, FaFilm, FaCommentDots,
  FaHeart, FaInstagramSquare, FaOm, FaPhone, FaPlay, FaSearch, FaShareAlt, FaTelegram,
  FaUserGraduate, FaVideo, FaWhatsapp,
} from "react-icons/fa";
import { MdDelete, MdVerified } from "react-icons/md"; 
import { IoLogoFacebook } from "react-icons/io";
import {
  IoCalendar, IoCash, IoHeart, IoPlanet, IoSchool, IoSparkles,
} from "react-icons/io5";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api";
import { formatReelCount, reelInitial, reelPosterAndVideo, reelTitle, toDisplayText } from "../utils/reels";
import AuthModal from "../components/AuthModal";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00"; 
const CREAM = "#FFF9F1";
const CARD = "rounded-2xl border border-gray-100 bg-white shadow-sm";

const CATEGORIES = [
  { label: "All Reels", key: "For You", icon: FaVideo, aliases: [] },
  { label: "Daily Horoscope", key: "Daily Horoscope", icon: IoCalendar, aliases: ["daily tips", "daily horoscope", "horoscope"] },
  { label: "Zodiac Signs", key: "Zodiac Signs", icon: IoPlanet, aliases: ["zodiac", "rashi"] },
  { label: "Remedies", key: "Remedies", icon: IoSparkles, aliases: ["remedy", "remedies", "upay"] },
  { label: "Vastu Tips", key: "Vastu Tips", icon: FaOm, aliases: ["vastu"] },
  { label: "Puja & Rituals", key: "Puja & Rituals", icon: FaOm, aliases: ["puja", "ritual"] },
  { label: "Love & Relationship", key: "Love & Relationship", icon: IoHeart, aliases: ["love", "relationship"] },
  { label: "Numerology", key: "Numerology", icon: IoSparkles, aliases: ["numerology", "tarot"] },
  { label: "Career & Business", key: "Career & Business", icon: IoCash, aliases: ["career", "business"] },
  { label: "Festivals", key: "Festivals", icon: IoCalendar, aliases: ["festival", "vrat"] },
  { label: "Spiritual Tips", key: "Spiritual Tips", icon: IoSchool, aliases: ["spiritual", "spirituality"] },
];

const POPULAR_TAGS = [
  "#DailyHoroscope", "#ZodiacSigns", "#Remedies", "#VastuTips", "#Numerology",
  "#TarotReading", "#LoveTips", "#CareerAstrology", "#PujaRituals", "#SpiritualTips",
];

const HERO_FEATURES = [
  { icon: FaVideo, label: "Daily Updates" },
  { icon: FaUserGraduate, label: "Expert Astrologers" },
  { icon: FaPlay, label: "Easy & Quick" },
  { icon: FaCheckCircle, label: "100% Authentic" },
];

const TRUST_ITEMS = [
  { icon: FaVideo, title: "Daily New Reels", sub: "Fresh content every day" },
  { icon: FaUserGraduate, title: "Verified Astrologers", sub: "Trusted by millions" },
  { icon: FaPlay, title: "Short & Insightful", sub: "Quick guidance on the go" },
  { icon: FaCheckCircle, title: "100% Authentic", sub: "Real Vedic knowledge" },
];

function matchesReelCategory(reel, cat) {
  if (cat.key === "For You") return true;
  const rc = (reel?.Category || "").toLowerCase();
  if (!rc) return false;
  if (rc === cat.key.toLowerCase()) return true;
  return cat.aliases.some((a) => rc.includes(a));
}

function ReelsPageClient() {
  const PAGE_SIZE = 8;
  const router = useRouter();
  const searchParams = useSearchParams();
  const reelIdParam = searchParams.get("reelId") || searchParams.get("id");
  const searchInputRef = useRef(null);
  const commentsRef = useRef(null);
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

  const [activeCategory, setActiveCategory] = useState("For You");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [reelsData, setReelsData] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);
  const [likedState, setLikedState] = useState([]);
  const [commentsdata, setcommentsdata] = useState([]);
  const [ReelCommentCount, setReelCommentCount] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [GetFollowstatus, setGetFollowstatus] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);

  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const timeoutRef = useRef(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyShareLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const openShareWindow = (url) => {
    if (typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const shareWhatsApp = () => openShareWindow(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`);
  const shareFacebook = () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: selectedReel?.Title || "AstroCall Reel",
        text: "Check this reel on AstroCall",
        url: shareUrl,
      }).catch(() => { });
    } else {
      copyShareLink();
    }
  };

  const GetData_ReelLikes = useCallback(async (id) => {
    try {
      const res = await postWithToken("ReelMaster/GetData_ReelLikes", { UserID: UserLoginId, ReelID: id });
      if (res) setLikedState(res);
    } catch (err) {
      console.error("Reels fetch error:", err);
    }
  }, [UserLoginId]);

  const Get_ReelCommentCount = useCallback(async () => {
    try {
      const val = { ReelID: reelIdParam };
      const res = await postWithToken("ReelMaster/ReelCommentCount", val);
      if (res) setReelCommentCount(res);
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  }, [reelIdParam]);

  const GetData_ReelComments = useCallback(async () => {
    try {
      const val = { ReelID: reelIdParam, UserID: UserLoginId };
      const res = await postWithToken("ReelMaster/GetData_ReelComments", val);
      if (res) {
        setcommentsdata(res);
        Get_ReelCommentCount();
      } else {
        setcommentsdata([]);
      }
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  }, [reelIdParam, UserLoginId, Get_ReelCommentCount]);

  const Get_Data_AstroFollow = useCallback(async () => {
    const val = { UserID: UserLoginId, astroID: selectedReel?.AstrologerId };
    try {
      const res = await postWithToken("AstroFollow/GetData_AstroFollow", val);
      if (res && Array.isArray(res) && res.length > 0 && (res[0]?.Follow === true || res[0]?.Follow === "true")) {
        setGetFollowstatus(true);
      } else {
        setGetFollowstatus(false);
      }
    } catch (error) {
      console.log("Error fetching follow data:", error);
      setGetFollowstatus(false);
    }
  }, [UserLoginId, selectedReel?.AstrologerId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await postWithToken("ReelMaster/Getdata_ReelMaster", { IsActive: "1", UserID: UserLoginId });
        if (Array.isArray(res)) setReelsData(res);
      } catch (err) {
        console.error("Reels fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCatObj = CATEGORIES.find((c) => c.key === activeCategory) || CATEGORIES[0];

  const filteredReels = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = reelsData.filter((reel) => {
      if (!matchesReelCategory(reel, activeCatObj)) return false;
      if (!q) return true;
      const cat = (reel?.Category || "").toLowerCase();
      return (
        (reel?.Title || "").toLowerCase().includes(q) ||
        (reel?.Description || "").toLowerCase().includes(q) ||
        cat.includes(q)
      );
    });
    if (sortBy === "latest") {
      list = [...list].sort((a, b) => new Date(b.CreatedDtTm || 0) - new Date(a.CreatedDtTm || 0));
    } else if (sortBy === "popular") {
      list = [...list].sort((a, b) => Number(b.ViewsCount || b.LikesCount || 0) - Number(a.ViewsCount || a.LikesCount || 0));
    }
    return list;
  }, [reelsData, activeCatObj, search, sortBy]);

  const [nowTs] = useState(() => Date.now());

  const totalPages = Math.max(1, Math.ceil(filteredReels.length / PAGE_SIZE));
  const listFilterKey = `${activeCategory}|${search}|${sortBy}`;
  const [pageFilterKey, setPageFilterKey] = useState(listFilterKey);
  const effectivePage = pageFilterKey === listFilterKey ? currentPage : 1;
  const visibleReels = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return filteredReels.slice(start, start + PAGE_SIZE);
  }, [filteredReels, effectivePage]);

  useEffect(() => {
    queueMicrotask(() => {
      setPageFilterKey(listFilterKey);
      setCurrentPage(1);
    });
  }, [listFilterKey]);

  useEffect(() => {
    queueMicrotask(() => {
      if (reelIdParam && reelsData.length) {
        const found = reelsData.find((r) => String(r?.ReelId ?? "") === String(reelIdParam));
        if (found) setSelectedReel(found);
      } else if (!reelIdParam) {
        setSelectedReel(null);
      }
    });
  }, [reelsData, reelIdParam]);

  useEffect(() => {
    if (reelIdParam && UserLoginId) void (async () => { await GetData_ReelLikes(reelIdParam); })();
  }, [reelIdParam, UserLoginId, GetData_ReelLikes]);

  useEffect(() => {
    if (UserLoginId && reelIdParam && selectedReel) void (async () => { await GetData_ReelComments(); })();
  }, [UserLoginId, reelIdParam, selectedReel, GetData_ReelComments]);

  useEffect(() => {
    if (reelIdParam) void (async () => { await Get_ReelCommentCount(); })();
  }, [reelIdParam, Get_ReelCommentCount]);

  useEffect(() => {
    if (UserLoginId && selectedReel) void (async () => { await Get_Data_AstroFollow(); })();
  }, [UserLoginId, selectedReel, Get_Data_AstroFollow]);

  const selectReel = (reel) => {
    if (!UserLoginId) {
      setShowAuthModal(true);
    } else {
      setSelectedReel(reel);
      setDescExpanded(false);
      router.replace(`/reels?reelId=${encodeURIComponent(String(reel?.ReelId ?? ""))}`, { scroll: false });
    }
  };

  const closeDetail = () => {
    setSelectedReel(null);
    router.replace("/reels", { scroll: false });
  };

  const selectedMedia = selectedReel ? reelPosterAndVideo(selectedReel) : {};
  const selectedPlayable = selectedMedia.playable || "";
  const selectedAstroName = selectedReel?.Astroname ? selectedReel?.Astroname : "";
  const selectedTitle = selectedReel ? reelTitle(selectedReel) : "";
  const selectedDescription = selectedReel ? toDisplayText(selectedReel.Description, "") : "";
  const selectedCategory = selectedReel ? toDisplayText(selectedReel.Category, "Astrology") : "";
  const selectedAvatar = selectedReel?.AvatarUrl || "";
  const selectedLikes = Number(selectedReel?.LikesCount || 0);
  const selectedShares = Number(selectedReel?.SharesCount || 0);
  const selectedViews = Number(selectedReel?.ViewsCount || selectedLikes || 0);
  const selectedDate = selectedReel?.CreatedDtTm
    ? format(new Date(selectedReel.CreatedDtTm), "MMM d, yyyy")
    : format(new Date(), "MMM d, yyyy");

  const upNextReels = useMemo(
    () => filteredReels.filter((r) => r.ReelId !== selectedReel?.ReelId).slice(0, 4),
    [filteredReels, selectedReel]
  );

  const getCategoryCount = (cat) =>
    cat.key === "For You" ? reelsData.length : reelsData.filter((r) => matchesReelCategory(r, cat)).length;

  const reelHashtags = useMemo(() => {
    if (!selectedReel) return [];
    const tags = [`#${selectedCategory.replace(/\s+/g, "")}`];
    if (selectedTitle) {
      const words = selectedTitle.split(/\s+/).slice(0, 2);
      words.forEach((w) => tags.push(`#${w.replace(/[^\w]/g, "")}`));
    }
    return tags.slice(0, 4);
  }, [selectedReel, selectedCategory, selectedTitle]);

  const Insert_ReelLikes = async () => {
    try {
      const val = { UserID: UserLoginId, ReelID: reelIdParam, AstroID: selectedReel?.AstrologerId, CreatedByUser: "1" };
      const res = await postWithToken("ReelMaster/Insert_ReelLikes", val);
      if (res) GetData_ReelLikes(reelIdParam);
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  };

  const Delete_ReelLikes = async () => {
    try {
      const val = { LikeId: likedState[0]?.LikeId || "" };
      const res = await postWithToken("ReelMaster/Delete_ReelLikes", val);
      if (res) GetData_ReelLikes(reelIdParam);
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  };

  const Insert_ReelComments = async () => {
    try {
      const val = {
        ReelID: reelIdParam,
        UserID: UserLoginId,
        CommentText: commentText,
        AstroID: selectedReel?.AstrologerId,
        CreatedByUser: "1",
      };
      const res = await postWithToken("ReelMaster/Insert_ReelComments", val);
      if (res) {
        GetData_ReelComments();
        setCommentText("");
      }
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  };

  const Delete_ReelComments = async (CommentId) => {
    try {
      const val = { CommentId };
      const res = await postWithToken("ReelMaster/Delete_ReelComments", val);
      if (res) GetData_ReelComments();
    } catch (err) {
      console.error("Error updating like status:", err);
    }
  };

  const Insert_AstroFollow = async (status) => {
    const val = { UserID: UserLoginId, astroID: selectedReel?.AstrologerId || "", Follow: status };
    try {
      const res = await TokenWithDeleteUpadateAdd("AstroFollow/Insert_AstroFollow", val);
      if (res) Get_Data_AstroFollow();
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const HandleClickFollow = () => {
    if (!UserLoginId) {
      setShowAuthModal(true);
      return;
    }
    setGetFollowstatus(!GetFollowstatus);
    Insert_AstroFollow(!GetFollowstatus);
  };

  const handlePausePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
    setShowPauseIcon(true);
    setTimeout(() => setShowPauseIcon(false), 1000);
  };

  const handleVolumeToggle = () => {
    setIsMuted((prev) => !prev);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { }, 1200);
  };

  const toggleLike = () => {
    if (!UserLoginId) {
      setShowAuthModal(true);
      return;
    }
    if (likedState[0]?.IsLiked == "1") Delete_ReelLikes();
    else Insert_ReelLikes();
  };

  const isNewReel = (reel) => {
    if (!reel?.CreatedDtTm) return false;
    const diff = nowTs - new Date(reel.CreatedDtTm).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const max = Math.min(totalPages, 5);
    for (let i = 1; i <= max; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  const isDetailView = Boolean(selectedReel && reelIdParam);

  /* ─── DETAIL VIEW ─── */
  if (isDetailView) {
    const likeCount = formatReelCount(likedState[0]?.LikesCount || selectedLikes);
    const commentCount = ReelCommentCount[0]?.CommentCount ?? commentsdata.length;
    const descWords = selectedDescription?.split(/\s+/) || [];
    const shortDesc = descWords.length > 20 ? descWords.slice(0, 20).join(" ") + "..." : selectedDescription;

    return (
      <>
        <div className="min-h-screen bg-[#F5F6F8] pb-28 pt-16">
          <div className="main-container px-4 py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
              {/* Video player */}
              <div className="space-y-4">
                <div
                  className="relative mx-auto aspect-[9/16] max-h-[78vh] w-full max-w-md overflow-hidden rounded-3xl bg-black shadow-2xl lg:max-w-none lg:max-h-[85vh]"
                  onClick={handlePausePlay}
                >
                  <video
                    ref={videoRef}
                    src={selectedPlayable}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {showPauseIcon && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/60 backdrop-blur-md">
                        {isPaused ? <Play size={36} className="ml-1 fill-white text-white" /> : <Pause size={36} className="fill-white text-white" />}
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); closeDetail(); }}
                    className="absolute left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md"
                  >
                    <FaChevronLeft size={14} />
                  </button>

                  <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-4">
                    {[
                      { icon: Heart, label: likeCount, active: likedState[0]?.IsLiked == "1", onClick: toggleLike },
                      { icon: MessageCircle, label: formatReelCount(commentCount), action: "comments" },
                      { icon: Send, label: formatReelCount(selectedShares), onClick: () => setShowShare(true) },
                      { icon: Bookmark, label: "Save", onClick: () => { } },
                    ].map(({ icon: Icon, label, active, onClick, action }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (action === "comments") {
                            commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          } else {
                            onClick?.();
                          }
                        }}
                        className="flex flex-col items-center gap-1 text-white"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">
                          <Icon size={20} className={active ? "fill-red-500 text-red-500" : ""} />
                        </span>
                        <span className="text-[10px] font-semibold">{label}</span>
                      </button>
                    ))}
                    <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
                    <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/30">
                      <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: ORANGE }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-white/80">
                      <span>00:08 / 01:02</span>
                      <div className="flex gap-3">
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleVolumeToggle(); }}>
                          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                        <Maximize2 size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Below video — mobile creator strip */}
                <div className={`p-4 lg:hidden ${CARD}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-full bg-orange-100">
                        {selectedAvatar ? (
                          <img src={selectedAvatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-[#FF5C00]">{reelInitial(selectedAstroName)}</div>
                        )}
                        <MdVerified className="absolute -bottom-0.5 -right-0.5 text-sky-500" size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedAstroName}</p>
                        <p className="text-xs text-gray-500">{selectedCategory}</p>
                      </div>
                    </div>
                    <button type="button" onClick={HandleClickFollow} className="rounded-full px-4 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: GetFollowstatus ? "#64748b" : ORANGE }}>
                      {GetFollowstatus ? "Following" : "Follow"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-bold text-[#0F172A]">{selectedTitle}</p>
                  <p className="mt-1 text-xs text-gray-600">{descExpanded ? selectedDescription : shortDesc}</p>
                  {descWords.length > 20 && (
                    <button type="button" onClick={() => setDescExpanded((v) => !v)} className="mt-1 text-xs font-bold text-[#FF5C00]">
                      {descExpanded ? "less" : "...more"}
                    </button>
                  )}
                </div>
              </div>

              {/* Right sidebar */}
              <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
                {/* Creator card */}
                <div className={`hidden p-4 lg:block ${CARD}`}>
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-orange-100">
                      {selectedAvatar ? (
                        <img src={selectedAvatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#FF5C00]">{reelInitial(selectedAstroName)}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-sm font-bold text-[#0F172A]">{selectedAstroName}</p>
                        <MdVerified className="shrink-0 text-sky-500" size={16} />
                      </div>
                      <p className="text-xs text-gray-500">Vedic Astrologer | Expert Guidance</p>
                      <button
                        type="button"
                        onClick={HandleClickFollow}
                        className={`mt-2 rounded-full border px-4 py-1.5 text-xs font-bold transition ${GetFollowstatus ? "border-gray-300 bg-gray-100 text-gray-600" : "text-white"}`}
                        style={GetFollowstatus ? {} : { backgroundColor: ORANGE, borderColor: ORANGE }}
                      >
                        {GetFollowstatus ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className={`hidden p-4 lg:block ${CARD}`}>
                  <h2 className="text-base font-bold text-[#0F172A]">{selectedTitle}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {descExpanded ? selectedDescription : shortDesc}
                    {descWords.length > 20 && (
                      <button type="button" onClick={() => setDescExpanded((v) => !v)} className="ml-1 font-bold text-[#FF5C00]">
                        {descExpanded ? "less" : "...more"}
                      </button>
                    )}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reelHashtags.map((tag) => (
                      <span key={tag} className="text-xs font-semibold text-sky-600">{tag}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-400">{formatReelCount(selectedViews)} Views • {selectedDate}</p>
                  <div className="mt-4 flex gap-2">
                    {[
                      { icon: FaHeart, label: likeCount, onClick: toggleLike },
                      { icon: FaCommentDots, label: formatReelCount(commentCount), action: "comments" },
                      { icon: FaShareAlt, label: "Share", onClick: () => setShowShare(true) },
                    ].map(({ icon: Icon, label, onClick, action }) => (
                      <button key={label} type="button" onClick={(e) => {
                        if (action === "comments") {
                          commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        } else {
                          onClick?.(e);
                        }
                      }} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:border-orange-200 hover:bg-orange-50">
                        <Icon size={12} className="text-[#FF5C00]" /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Up Next */}
                <div className={`p-4 ${CARD}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0F172A]">Up Next</h3>
                    <label className="flex items-center gap-2 text-xs text-gray-500">
                      Autoplay
                      <button
                        type="button"
                        onClick={() => setAutoplay((v) => !v)}
                        className={`relative h-5 w-9 rounded-full transition ${autoplay ? "bg-[#FF5C00]" : "bg-gray-300"}`}
                      >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${autoplay ? "left-4" : "left-0.5"}`} />
                      </button>
                    </label>
                  </div>
                  <ul className="space-y-3">
                    {upNextReels.map((reel) => {
                      const { poster, playable } = reelPosterAndVideo(reel);
                      const cover = poster || playable;
                      return (
                        <li key={reel.ReelId}>
                          <button type="button" onClick={() => selectReel(reel)} className="flex w-full gap-3 text-left">
                            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                              {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
                              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[8px] text-white">01:05</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-xs font-bold text-[#0F172A]">{reelTitle(reel)}</p>
                              <div className="mt-1 flex items-center gap-1">
                                <span className="truncate text-[10px] text-gray-500">{reel?.Astroname || "Astrologer"}</span>
                                <MdVerified className="shrink-0 text-sky-500" size={10} />
                              </div>
                              <p className="text-[10px] text-gray-400">{formatReelCount(reel.ViewsCount || reel.LikesCount || 0)} views</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button type="button" onClick={closeDetail} className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-bold text-[#FF5C00] hover:underline">
                    View All Reels <FaChevronRight size={10} />
                  </button>
                </div>

                {/* Comments */}
                <div ref={commentsRef} className={`p-4 ${CARD}`}>
                  <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Comments ({formatReelCount(commentCount)})</h3>
                  <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                    {commentsdata?.length > 0 ? commentsdata.map((c, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-[#FF5C00]">
                          {c?.UserName?.split(" ")?.map((p) => p[0]).join("") || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-[#0F172A]">{c.UserName}</p>
                            {UserLoginId && (
                              <button type="button" onClick={() => Delete_ReelComments(c.CommentId)} className="text-gray-400 hover:text-red-500">
                                <MdDelete size={14} />
                              </button>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600">{c.CommentText}</p>
                          <div className="mt-1 flex items-center gap-3 text-[10px] text-gray-400">
                            <span>2h ago</span>
                            <button type="button" className="font-semibold hover:text-[#FF5C00]">Reply</button>
                            <span className="flex items-center gap-0.5"><FaHeart size={8} /> 12</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="py-4 text-center text-xs text-gray-400">No comments yet. Be the first!</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-[#FF5C00]">U</div>
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#FF5C00]"
                    />
                    <button
                      type="button"
                      disabled={!commentText.trim()}
                      onClick={() => { if (UserLoginId) Insert_ReelComments(); else setShowAuthModal(true); }}
                      className="rounded-full px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                      style={{ backgroundColor: ORANGE }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* CTA banner */}
          <section className="border-y border-orange-100 py-8" style={{ backgroundColor: CREAM }}>
            <div className="main-container flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <FaCommentDots className="text-[#FF5C00]" size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#0F172A]">Want Personalized Guidance?</p>
                  <p className="text-xs text-gray-500">Chat with our expert astrologers now</p>
                </div>
              </div>
              <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="rounded-full px-6 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                Chat Now
              </button>
            </div>
          </section>

          <TrustAndBottom showBackTop={showBackTop} router={router} />
        </div>

        {showShare && <ShareModal onClose={() => setShowShare(false)} shareWhatsApp={shareWhatsApp} shareFacebook={shareFacebook} shareNative={shareNative} copyShareLink={copyShareLink} copiedShare={copiedShare} />}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  /* ─── LISTING VIEW ─── */
  return (
    <>
      <div className="min-h-screen bg-white pt-[72px]">
        <PageBanner
          bannerSrc={PAGE_BANNER_IMAGES.reels}
          currentPage="Astro Reels"
          title={
            <>
              Astro Reels
              <span className="mt-2 block text-lg font-bold text-[#FF5C00] sm:text-xl">
                Short Videos. Big Guidance.
              </span>
            </>
          }
          subtitle="Watch quick astrology reels on remedies, zodiac insights, vastu tips, love guidance and more — from verified astrologers."
        >
          <div className="mt-4 flex flex-wrap gap-4 sm:mt-5">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-semibold text-[#0F172A] sm:text-sm">
                <Icon size={14} className="text-[#FF5C00]" />
                {label}
              </div>
            ))}
          </div>
        </PageBanner>
        {/* Hero */}
        {/* <section className="border-b border-orange-50" style={{ backgroundColor: CREAM }}>
          <div className="main-container px-4 py-6 sm:py-8">
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
              <button type="button" onClick={() => router.push("/")} className="hover:text-[#FF5C00]">Home</button>
              <FaChevronRight size={8} className="text-gray-300" />
              <span className="font-medium text-gray-700">Astro Reels</span>
            </nav>
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div>
                <h1 className="font-serif text-3xl font-extrabold text-[#0F172A] sm:text-4xl md:text-5xl">Astro Reels</h1>
                <p className="mt-2 font-serif text-lg font-bold text-[#FF5C00] sm:text-xl">Short Videos. Big Guidance.</p>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-600">
                  Watch quick astrology reels on remedies, zodiac insights, vastu tips, love guidance and more — from verified astrologers.
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  {HERO_FEATURES.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs font-semibold text-[#0F172A] sm:text-sm">
                      <Icon size={14} className="text-[#FF5C00]" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative hidden h-52 overflow-hidden rounded-2xl sm:block sm:h-60 lg:h-72">
                <Image src="/images/ChatBanner.png" alt="Astro Reels" fill className="object-cover" sizes="(max-width:1024px) 50vw, 500px" priority />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[85%] w-28 overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                    {reelsData[0] && (() => {
                      const { poster, playable } = reelPosterAndVideo(reelsData[0]);
                      const cover = poster || playable;
                      return cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <div className="h-full bg-orange-200" />;
                    })()}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <FaPlay className="text-white" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Main layout */}
        <div className="main-container px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar */}
            <aside className="space-y-5 lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Categories</h3>
                <ul className="space-y-0.5">
                  {CATEGORIES.map(({ label, key, icon: Icon }) => {
                    const active = activeCategory === key;
                    const count = getCategoryCount({ key, aliases: CATEGORIES.find((c) => c.key === key)?.aliases || [] });
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => setActiveCategory(key)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active ? "bg-orange-50 font-bold text-[#FF5C00]" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          <span className="flex items-center gap-2 line-clamp-1">
                            <Icon size={14} className={active ? "text-[#FF5C00]" : "text-gray-400"} />
                            {label}
                          </span>
                          <span className="text-xs text-gray-400">{count}{key === "For You" ? "+" : ""}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className={`p-4 ${CARD}`}>
                <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Popular Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => { setSearch(tag.replace("#", "")); setCurrentPage(1); }}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 transition hover:border-[#FF5C00] hover:text-[#FF5C00]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-lg">
                <FaFilm className="mb-2 text-2xl opacity-90" />
                <p className="text-sm font-bold">Create Your Astro Reels!</p>
                <p className="mt-1 text-xs text-white/80">Share your knowledge with millions of seekers.</p>
                <button type="button" onClick={() => router.push("/astrologer-login")} className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-bold text-[#FF5C00]">
                  Get Started
                </button>
              </div>
            </aside>

            {/* Grid */}
            <div className="lg:col-span-9">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <input
                    ref={searchInputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reels, topics, astrologers..."
                    className="flex-1 px-4 py-2.5 text-sm outline-none"
                  />
                  <button type="button" className="flex items-center gap-2 px-5 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                    <FaSearch size={13} /> Search
                  </button>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none"
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="popular">Sort by: Popular</option>
                </select>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl bg-gray-100">
                      <div className="aspect-[3/4] animate-pulse bg-gray-200" />
                      <div className="space-y-2 p-3">
                        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visibleReels.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                    {visibleReels.map((reel) => {
                      const { poster, playable } = reelPosterAndVideo(reel);
                      const cover = poster || playable;
                      const astroName = reel?.Astroname || "Astrologer";
                      const views = formatReelCount(Number(reel.ViewsCount || reel.LikesCount || 0));
                      return (
                        <article key={reel.ReelId} className={`group overflow-hidden ${CARD} cursor-pointer transition hover:shadow-md`} onClick={() => selectReel(reel)}>
                          <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
                            {cover ? (
                              <img src={cover} alt={reelTitle(reel)} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            ) : (
                              <div className="h-full w-full bg-gray-800" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                            {isNewReel(reel) && (
                              <span className="absolute left-2 top-2 rounded bg-[#FF5C00] px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
                            )}
                            <button type="button" className="absolute right-2 top-2 rounded-full p-1 text-white/80 hover:bg-black/30">
                              <MoreHorizontal size={16} />
                            </button>
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm">
                              <FaPlay size={8} className="text-white" />
                              <span className="text-[10px] font-semibold text-white">{views}</span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-md">
                                <FaPlay className="ml-0.5 text-lg text-white" />
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-bold leading-snug text-[#0F172A]">{reelTitle(reel)}</h3>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-orange-100">
                                {reel?.AvatarUrl ? (
                                  <img src={reel.AvatarUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#FF5C00]">{reelInitial(astroName)}</div>
                                )}
                              </div>
                              <span className="truncate text-[11px] font-semibold text-gray-600">{astroName}</span>
                              <MdVerified className="shrink-0 text-sky-500" size={12} />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:opacity-40"
                      >
                        <FaChevronLeft size={12} />
                      </button>
                      {pageNumbers.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${currentPage === p ? "text-white" : "border border-gray-200 text-gray-600 hover:bg-orange-50"}`}
                          style={currentPage === p ? { backgroundColor: ORANGE } : {}}
                        >
                          {p}
                        </button>
                      ))}
                      {totalPages > 5 && <span className="text-gray-400">...</span>}
                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 disabled:opacity-40"
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={`py-20 text-center ${CARD}`}>
                  <FaPlay className="mx-auto mb-3 text-4xl text-orange-300" />
                  <p className="font-semibold text-gray-800">No reels found</p>
                  <p className="mt-1 text-sm text-gray-500">Try a different category or search term</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <TrustAndBottom showBackTop={showBackTop} router={router} />
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

function TrustAndBottom({ showBackTop, router }) {
  return (
    <>
      <section className="border-t border-orange-50 py-8" style={{ backgroundColor: CREAM }}>
        <div className="main-container grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Icon size={16} className="text-[#FF5C00]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
        <div className="main-container flex items-center justify-center gap-2 sm:gap-4">
          {[
            { icon: FaCommentDots, label: "Chat Now", href: "/chat-to-astrologers" },
            { icon: FaPhone, label: "Call Now", href: "/talk-to-astrologers" },
            { icon: FaVideo, label: "Video Call", href: "/talk-to-astrologers" },
            { icon: FaOm, label: "Book Puja", href: "/online-puja" },
          ].map(({ icon: Icon, label, href }) => (
            <button key={label} type="button" onClick={() => router.push(href)} className="flex flex-1 flex-col items-center gap-0.5 sm:flex-row sm:gap-2 sm:rounded-full sm:border sm:border-orange-100 sm:px-4 sm:py-2">
              <Icon size={16} className="text-[#FF5C00]" />
              <span className="text-[10px] font-bold text-gray-700 sm:text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {showBackTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: ORANGE }}>
          <FaArrowUp size={14} />
        </button>
      )}
    </>
  );
}

function ShareModal({ onClose, shareWhatsApp, shareFacebook, shareNative, copyShareLink, copiedShare }) {
  return (
    <div className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-[#111827] p-5 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-6 flex items-center justify-between">
          <h3 className="mx-auto text-lg font-semibold">Share this reel</h3>
          <button type="button" onClick={onClose} className="absolute right-0 top-0 text-xl text-white/80">✕</button>
        </div>
        <div className="grid grid-cols-4 gap-5 text-center">
          <button type="button" onClick={shareWhatsApp}>
            <FaWhatsapp className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl" />
            <p className="mt-2 text-sm">WhatsApp</p>
          </button>
          <button type="button" onClick={shareFacebook}>
            <IoLogoFacebook className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl" />
            <p className="mt-2 text-sm">Facebook</p>
          </button>
          <button type="button">
            <FaInstagramSquare className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-xl" />
            <p className="mt-2 text-sm">Instagram</p>
          </button>
          <button type="button">
            <FaTelegram className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-2xl" />
            <p className="mt-2 text-sm">Telegram</p>
          </button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          <button type="button" onClick={copyShareLink}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">🔗</div>
            <p className="mt-2 text-sm">{copiedShare ? "Copied!" : "Copy Link"}</p>
          </button>
          <button type="button" onClick={shareNative}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-700">•••</div>
            <p className="mt-2 text-sm">More</p>
          </button>
        </div>
        <button type="button" onClick={onClose} className="mt-8 w-full rounded-2xl bg-slate-800 py-4 text-lg font-medium">Cancel</button>
      </div>
    </div>
  );
}

export default ReelsPageClient;
