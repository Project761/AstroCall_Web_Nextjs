"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { postWithToken, TokenImageUpload, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { toastifyError, toastifySuccess } from "@/app/utils/utility";
import { toReelMediaUrl, hasReelImageThumbnail } from "@/app/utils/reels";
import CreateReelForm from "@/app/astrologer-panel/create-reel/CreateReelForm";
import { Trash2 } from "lucide-react";
import { PanelPageHeader, PanelCard, PanelLoading, PanelEmpty } from "@/app/components/AstrologerPanelUi";
import { AP_BTN_PRIMARY } from "@/app/lib/astrologerPanelTheme";

export default function MyReelsPage() {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReel, setSelectedReel] = useState(null);
    const [reelToDelete, setReelToDelete] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const astroId = useMemo(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("AstroLoginId") || "";
    }, []);

    const fetchMyReels = useCallback(async () => {
        if (!astroId) return;
        try {
            const res = await postWithToken("ReelMaster/Getdata_ReelMaster", { AstroID: astroId, IsActive: "1" });
            console.log("My reels response:", res);
            if (Array.isArray(res)) setReels(res);
            else setReels([]);
        } catch (err) {
            console.error("Fetch my reels error:", err);
            setReels([]);
        } finally {
            setLoading(false);
        }
    }, [astroId]);

    useEffect(() => {
        if (!astroId) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await postWithToken("ReelMaster/Getdata_ReelMaster", { AstroID: astroId, IsActive: "1" });
                if (cancelled) return;
                console.log("My reels response:", res);
                if (Array.isArray(res)) setReels(res);
                else setReels([]);
            } catch (err) {
                if (!cancelled) {
                    console.error("Fetch my reels error:", err);
                    setReels([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [astroId]);


    const confirmDelete = (reel) => {
        if (!reel?.ReelId) return;
        setReelToDelete(reel);
    };

    const deleteReel = async () => {
        if (!reelToDelete?.ReelId) return;
        setIsSubmitting(true);
        try {
            const res = await TokenWithDeleteUpadateAdd("ReelMaster/Delete_ReelMaster", { ReelId: reelToDelete.ReelId });
            if (res) {
                toastifySuccess("Reel deleted.");
                setReelToDelete(null);
                fetchMyReels();
            } else {
                toastifyError("Failed to delete reel.");
            }
        } catch (err) {
            console.error("Delete reel error:", err);
            toastifyError("Something went wrong deleting reel.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelDelete = () => {
        setReelToDelete(null);
    };

    if (!astroId) {
        return (
            <div className="mx-auto max-w-[1400px]">
                <PanelPageHeader title="My Reels" breadcrumbs={["Dashboard", "Video Calls"]} />
                <PanelCard><p className="text-sm text-gray-500">Please login to view your reels.</p></PanelCard>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1400px]">
            <PanelPageHeader
                title="My Reels"
                breadcrumbs={["Dashboard", "Video Calls"]}
                description="Manage your reels and create new content."
                action={
                    <button type="button" onClick={() => setCreateModalOpen(true)} className={AP_BTN_PRIMARY}>
                        + Create Reel
                    </button>
                }
            />

            <PanelCard title="Your Reels">
                {loading ? (
                    <PanelLoading />
                ) : reels.length === 0 ? (
                    <PanelEmpty message="No reels found. Create one to get started." />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {reels?.map((reel) => {
                                    const thumbUrl = toReelMediaUrl(reel?.ThumbnailUrl || reel?.Thumbnail || reel?.VideoUrl);
                                    const hasThumb = hasReelImageThumbnail(reel);
                                    const posterUrl = hasThumb ? thumbUrl : "";
                                    const coverUrl = thumbUrl || toReelMediaUrl(reel?.VideoUrl);
                                    return (
                                        <button
                                            key={reel?.ReelId}
                                            type="button"
                                            onClick={() => setSelectedReel(reel)}
                                            className="text-left rounded-xl border border-gray-100 overflow-hidden bg-[#FFF9F1] hover:border-orange-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        >
                                            <div className="h-48 bg-black/5 overflow-hidden flex items-center justify-center">
                                                {coverUrl ? (
                                                    <img src={coverUrl} alt={reel?.Title || "Reel thumbnail"} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="text-sm text-slate-500 p-4">No thumbnail</div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#FF5C00]">Click to play</div>
                                                <h3 className="font-semibold text-sm text-slate-900">{reel?.Title}</h3>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{reel?.Description}</p>
                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {/* <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(reel);
                                                            }}
                                                            className="px-3 py-1 text-xs bg-rose-50 border rounded text-rose-700"
                                                        >
                                                            Delete
                                                        </button> */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(reel);
                                                            }}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-lg active:scale-95"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                    <div className="text-xs text-slate-400">{reel?.Category}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                )}
            </PanelCard>

                    {selectedReel && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedReel(null)} />
                            <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-slate-950 shadow-2xl">
                                <button
                                    type="button"
                                    onClick={() => setSelectedReel(null)}
                                    className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-2 text-white hover:bg-black"
                                >
                                    Close
                                </button>
                                <video
                                    controls
                                    autoPlay
                                    className="w-full max-h-[80vh] bg-black"
                                    poster={toReelMediaUrl(selectedReel?.ThumbnailUrl || selectedReel?.Thumbnail || "")}
                                >
                                    <source src={toReelMediaUrl(selectedReel?.VideoUrl)} type="video/mp4" />
                                    <p className="p-4 text-white">Your browser does not support HTML video.</p>
                                </video>
                                <div className="p-5 bg-slate-900 text-white">
                                    <h3 className="text-lg font-semibold">{selectedReel?.Title}</h3>
                                    <p className="mt-2 text-sm text-slate-300">{selectedReel?.Description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {reelToDelete && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                            <div className="absolute inset-0 cursor-pointer" onClick={cancelDelete} />
                            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                                <h2 className="text-xl font-semibold text-slate-900">Delete Reel?</h2>
                                <p className="mt-3 text-sm text-slate-600">Are you sure you want to delete <span className="font-semibold">{reelToDelete?.Title || "this reel"}</span>? This action cannot be undone.</p>
                                <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={cancelDelete}
                                        className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                    >
                                        No
                                    </button>
                                    <button
                                        type="button"
                                        onClick={deleteReel}
                                        disabled={isSubmitting}
                                        className="rounded-full bg-[#FF5C00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E85500] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSubmitting ? "Deleting..." : "Yes, delete it"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {createModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
                            <div className="absolute inset-0 cursor-pointer" onClick={() => setCreateModalOpen(false)} />
                            <div className="relative w-[80%]  rounded-xl bg-white p-6 shadow-2xl">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <h2 className="text-xl font-semibold">Create New Reel</h2>
                                    <button
                                        type="button"
                                        onClick={() => setCreateModalOpen(false)}
                                        className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
                                    >
                                        X
                                    </button>
                                </div>
                                <CreateReelForm
                                    onSuccess={() => {
                                        fetchMyReels();
                                    }}
                                    onClose={() => setCreateModalOpen(false)}
                                />
                            </div>
                        </div>
                    )}


        </div>
    );
}
