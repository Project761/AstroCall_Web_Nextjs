"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlay, FaEye } from "react-icons/fa";
import { MdLocalMovies } from "react-icons/md";
import { postWithToken } from "@/app/utils/api";
import {
  reelInitial,
  reelPosterAndVideo,
  reelTitle,
  isAstrocallRemoteMedia,
  formatReelCount,
} from "@/app/utils/reels";
import { ORANGE, CREAM } from "@/app/lib/siteTheme";
import AuthModal from "./AuthModal";

const HOME_REELS_LIMIT = 8;
const GRID_REELS_COUNT = 4;

function HomeReelCard({ reel, onOpen, grid }) {
  const { poster, playable } = reelPosterAndVideo(reel);
  const cover = poster || playable;
  const title = reelTitle(reel);
  const astroName = reel?.Astroname;
  const views = formatReelCount(Number(reel?.ViewsCount || reel?.LikesCount || reel?.ViewCount || 0));

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(reel)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(reel); }}
      className={`group relative cursor-pointer overflow-hidden bg-[#111] transition hover:-translate-y-1 hover:shadow-xl ${
        grid ? "aspect-[9/16] w-full rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]" : "aspect-[9/16] rounded-2xl shadow-md ring-1 ring-gray-200/80"
      }`}
    >
      {cover ? (
        <Image
          src={cover}
          alt={title}
          fill
          sizes={grid ? "(max-width:768px) 45vw, 22vw" : "160px"}
          className="object-cover transition duration-300 group-hover:scale-105"
          unoptimized={isAstrocallRemoteMedia(cover)}
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Play button center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-110 md:h-14 md:w-14" style={{ color: ORANGE }}>
          <FaPlay className="ml-0.5 text-sm md:text-base" />
        </span>
      </div>

      {/* View count */}
      {views !== "0" && (
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <FaEye className="text-[9px]" />
          {views}
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="line-clamp-2 text-[11px] font-bold leading-snug text-white md:text-xs">{title}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: ORANGE }}>
            {reelInitial(astroName)}
          </span>
          <span className="truncate text-[10px] font-medium text-white/85">{astroName || "Astrologer"}</span>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({ title, icon: Icon, onViewAll, viewAllHref }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(241,99,34,0.1)" }}>
          <Icon className="text-lg" style={{ color: ORANGE }} />
        </span>
        <h2 className="text-xl font-bold text-[#1A1A1A] md:text-2xl">{title}</h2>
      </div>
      {onViewAll ? (
        <button type="button" onClick={onViewAll} className="shrink-0 cursor-pointer text-sm font-semibold hover:underline" style={{ color: ORANGE }}>
          View All →
        </button>
      ) : viewAllHref ? (
        <Link href={viewAllHref} className="shrink-0 cursor-pointer text-sm font-semibold hover:underline" style={{ color: ORANGE }}>
          View All →
        </Link>
      ) : null}
    </div>
  );
}

export default function HomeReelsSection({ variant = "default" }) {
  const isCompact = variant === "compact";
  const isGrid = variant === "grid";
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

  useEffect(() => {
    (async () => {
      try {
        const res = await postWithToken("ReelMaster/Getdata_ReelMaster", { IsActive: "1" });
        if (Array.isArray(res)) setReels(res.slice(0, HOME_REELS_LIMIT));
      } catch (err) {
        console.error("Home reels fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openReel = (reel) => {
    if (!UserLoginId) setShowAuthModal(true);
    else router.push(`/reels?reelId=${encodeURIComponent(String(reel?.ReelId ?? ""))}`);
  };

  if (!loading && reels.length === 0) return null;

  const displayReels = isGrid ? reels.slice(0, GRID_REELS_COUNT) : reels;

  const gridContent = (
    <div
      // className="rounded-2xl bg-white p-4 shadow-sm sm:p-6"
      // style={{ border: "1px solid rgba(241,99,34,0.1)" }}
    >
      <SectionHeader title="Astro Reels" icon={MdLocalMovies} onViewAll={() => router.push("/reels")} />
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[9/16] animate-pulse rounded-2xl bg-orange-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {displayReels.map((reel) => (
            <HomeReelCard key={reel?.ReelId ?? reel?.Title} reel={reel} onOpen={openReel} grid />
          ))}
        </div>
      )}
    </div>
  );

  if (isGrid) {
    return (
      <section className="py-10 md:py-12" style={{ backgroundColor: CREAM }}>
        <div className="main-container px-4">
          {gridContent}
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </section>
    );
  }

  const scrollContent = (
    <>
      <SectionHeader title="Astro Reels" icon={MdLocalMovies} onViewAll={() => router.push("/reels")} />
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[220px] w-[130px] shrink-0 animate-pulse rounded-2xl bg-orange-100" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reels.map((reel) => (
            <div key={reel?.ReelId ?? reel?.Title} className="w-[42%] min-w-[130px] max-w-[180px] shrink-0">
              <HomeReelCard reel={reel} onOpen={openReel} grid={false} />
            </div>
          ))}
        </div>
      )}
    </>
  );

  if (isCompact) {
    return (
      <div>
        {scrollContent}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <section className="bg-white py-10">
      <div className="main-container px-4">
        {scrollContent}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </section>
  );
}
