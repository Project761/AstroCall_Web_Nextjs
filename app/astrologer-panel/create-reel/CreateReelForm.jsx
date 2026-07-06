"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ImagePlus, Video, Send, Sparkles } from "lucide-react";
import { TokenImageUpload } from "@/app/utils/api";
import { toastifyError, toastifySuccess } from "@/app/utils/utility";
import { captureVideoThumbnail } from "@/app/utils/videoThumbnail";
import { AP_INPUT, AP_BTN_PRIMARY, AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";

const CATEGORY_OPTIONS = [
  "Daily Tips",
  "Zodiac Signs",
  "Remedies",
  "Tarot",
  "Vastu",
  "Numerology",
  "Love & Relationship",
  "Career",
  "Finance",
];

const GUIDELINES = [
  "Video must be original content",
  "No copyright material",
  "Appropriate and positive content",
  "Follow community guidelines",
  "Max duration: 60 seconds",
  "File size: Max 200MB",
];

export default function CreateReelForm({ onSuccess, onClose }) {
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Category: "",
    DurationSeconds: "",
    IsLive: false,
    VideoUrl: "",
    ThumbnailUrl: "",
  });

  const [videoFileName, setVideoFileName] = useState("");
  const [thumbnailFileName, setThumbnailFileName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [autoThumbnailFile, setAutoThumbnailFile] = useState(null);
  const [thumbnailIsManual, setThumbnailIsManual] = useState(false);
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blobUrlsRef = useRef([]);

  const trackBlobUrl = (url) => {
    if (url?.startsWith("blob:")) blobUrlsRef.current.push(url);
  };

  const revokeBlobUrls = () => {
    blobUrlsRef.current.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {
        /* ignore */
      }
    });
    blobUrlsRef.current = [];
  };

  useEffect(() => () => revokeBlobUrls(), []);

  const astroId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("AstroLoginId") || "";
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const applyAutoThumbnail = async (file) => {
    setIsGeneratingThumb(true);
    try {
      const captured = await captureVideoThumbnail(file, { seekSeconds: 1 });
      if (!captured) return;

      setAutoThumbnailFile(captured.file);
      if (!thumbnailIsManual) {
        trackBlobUrl(captured.objectUrl);
        setThumbnailPreview(captured.objectUrl);
        setThumbnailFileName(`${captured.file.name} (from video)`);
        handleChange("ThumbnailUrl", captured.objectUrl);
      }
    } catch (err) {
      console.error("Auto thumbnail error:", err);
    } finally {
      setIsGeneratingThumb(false);
    }
  };

  const handleVideoSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toastifyError("Please select a valid video file");
      return;
    }

    revokeBlobUrls();
    setThumbnailIsManual(false);
    setThumbnailFile(null);
    setAutoThumbnailFile(null);
    setThumbnailFileName("");
    setThumbnailPreview("");

    setVideoFileName(file.name);
    setVideoFile(file);

    const url = URL.createObjectURL(file);
    trackBlobUrl(url);
    setVideoPreview(url);
    handleChange("VideoUrl", url);

    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.onloadedmetadata = () => {
      const dur = Math.round(videoEl.duration);
      if (Number.isFinite(dur) && dur > 0 && dur <= 60) {
        handleChange("DurationSeconds", String(dur));
      }
      URL.revokeObjectURL(videoEl.src);
    };
    videoEl.src = url;

    await applyAutoThumbnail(file);
  };

  const handleThumbnailSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastifyError("Please select a valid image for thumbnail");
      return;
    }

    setThumbnailIsManual(true);
    setThumbnailFileName(file.name);
    setThumbnailFile(file);
    const url = URL.createObjectURL(file);
    trackBlobUrl(url);
    setThumbnailPreview(url);
    handleChange("ThumbnailUrl", url);
  };

  const resetForm = () => {
    revokeBlobUrls();
    setForm({
      Title: "",
      Description: "",
      Category: "",
      DurationSeconds: "",
      IsLive: false,
      VideoUrl: "",
      ThumbnailUrl: "",
    });
    setVideoFileName("");
    setThumbnailFileName("");
    setVideoFile(null);
    setThumbnailFile(null);
    setAutoThumbnailFile(null);
    setThumbnailIsManual(false);
    setVideoPreview("");
    setThumbnailPreview("");
  };

  const validate = () => {
    if (!astroId) return "AstroID missing. Please login again.";
    if (!form.Title.trim()) return "Title is required.";
    if (!form.Description.trim()) return "Description is required.";
    if (!form.Category) return "Category is required.";
    if (!form.DurationSeconds || Number(form.DurationSeconds) <= 0) {
      return "Valid duration is required.";
    }
    if (!videoFile) return "Please upload a video file.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      toastifyError(error);
      return;
    }

    const payload = new FormData();
    const reelData = {
      AstroID: astroId,
      Title: form.Title.trim(),
      Description: form.Description.trim(),
      Category: form.Category,
      DurationSeconds: String(Number(form.DurationSeconds)),
      IsLive: form.IsLive ? "1" : "0",
      CreatedByUser: "1",
    };

    const thumbToUpload = thumbnailFile || autoThumbnailFile;
    if (!thumbToUpload) {
      toastifyError("Could not generate thumbnail from video. Please upload a thumbnail image.");
      return;
    }

    payload.append("data", JSON.stringify(reelData));
    payload.append("VideoUrl", videoFile);
    payload.append("ThumbnailUrl", thumbToUpload);

    try {
      setIsSubmitting(true);
      const response = await TokenImageUpload("ReelMaster/Insert_ReelMaster", payload);
      if (response) {
        toastifySuccess("Reel created successfully.");
        resetForm();
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        toastifyError("Failed to create reel. Please try again.");
      }
    } catch (submitError) {
      toastifyError("Something went wrong while creating reel.");
      console.error("Insert_ReelMaster error:", submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Create New Reel</h2> */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section className="xl:col-span-5 rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Reel Information</h3>
          <div>
            <label className="text-sm font-medium text-slate-700">Title <span className="text-rose-500">*</span></label>
            <input
              value={form.Title}
              maxLength={100}
              onChange={(e) => handleChange("Title", e.target.value)}
              className={`mt-2 ${AP_INPUT}`}
              placeholder="Enter an attractive title for your reel"
            />
            <p className="text-xs text-slate-400 text-right mt-1">{form.Title.length}/100</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Description <span className="text-rose-500">*</span></label>
            <textarea
              value={form.Description}
              maxLength={300}
              rows={4}
              onChange={(e) => handleChange("Description", e.target.value)}
              className={`mt-2 ${AP_INPUT} resize-none`}
              placeholder="Describe your reel content..."
            />
            <p className="text-xs text-slate-400 text-right mt-1">{form.Description.length}/300</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Category <span className="text-rose-500">*</span></label>
            <select
              value={form.Category}
              onChange={(e) => handleChange("Category", e.target.value)}
              className={`mt-2 ${AP_INPUT}`}
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Duration (Seconds) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                min="1"
                max="60"
                value={form.DurationSeconds}
                onChange={(e) => handleChange("DurationSeconds", e.target.value)}
                className={`mt-2 ${AP_INPUT}`}
                placeholder="e.g. 30"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Is Live Stream?</p>
                <p className="text-xs text-slate-500 mt-1">Enable if this reel is a live session</p>
              </div>
              <button
                type="button"
                onClick={() => handleChange("IsLive", !form.IsLive)}
                className={`relative w-12 h-7 rounded-full transition-colors ${form.IsLive ? "bg-[#FF5C00]" : "bg-gray-300"}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${form.IsLive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className={AP_BTN_OUTLINE}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${AP_BTN_PRIMARY} disabled:opacity-60`}
            >
              {isSubmitting ? "Creating..." : "Create Reel"}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="xl:col-span-5 rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A]">Upload Video & Thumbnail</h3>
          <div>
            <label className="text-sm font-medium text-gray-700">Upload Video <span className="text-red-500">*</span></label>
            <label className="mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-[#FFF9F1] p-7 text-center cursor-pointer hover:bg-orange-50 transition-colors">
              <input type="file" accept="video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v" className="hidden" onChange={handleVideoSelect} />
              <Video className="h-9 w-9 text-[#FF5C00]" />
              <p className="text-[#FF5C00] font-semibold mt-2">Click to upload video</p>
              <p className="text-xs text-slate-500 mt-1">MP4, MOV, AVI (Max 200MB)</p>
              {videoFileName && <p className="text-xs text-violet-700 mt-2 font-medium">{videoFileName}</p>}
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Thumbnail <span className="font-normal text-slate-400">(optional)</span></label>
              {isGeneratingThumb && (
                <p className="flex items-center gap-2 text-xs text-violet-600">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Creating thumbnail from video…
                </p>
              )}
              {!thumbnailIsManual && thumbnailPreview && !isGeneratingThumb && (
                <div className="flex items-start gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-800">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Thumbnail auto-selected from your video (like Instagram). Upload below only if you want a custom cover.</span>
                </div>
              )}
              {thumbnailPreview ? (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="aspect-video w-full object-cover" />
                </div>
              ) : null}
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleThumbnailSelect} />
                <ImagePlus className="h-9 w-9 text-violet-600" />
                <p className="text-violet-700 font-semibold mt-2">{thumbnailPreview ? "Change thumbnail" : "Upload custom thumbnail"}</p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                {thumbnailFileName && <p className="text-xs text-violet-700 mt-2 font-medium">{thumbnailFileName}</p>}
              </label>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-semibold text-amber-800 mb-2">Tips for better reach:</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>No thumbnail? We pick a frame from your video automatically</li>
                  <li>Keep duration between 15-60 seconds</li>
                  <li>Share authentic astrology content</li>
                </ul>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Preview</p>
              <div className="mx-auto w-[220px] max-w-full rounded-2xl border border-slate-300 bg-slate-900 overflow-hidden shadow-lg">
                <div className="relative aspect-[9/16] w-full">
                  {videoPreview ? (
                    <video src={videoPreview} controls className="h-full w-full object-cover" poster={thumbnailPreview || form.ThumbnailUrl} />
                  ) : form.VideoUrl ? (
                    <video src={form.VideoUrl} controls className="h-full w-full object-cover" poster={thumbnailPreview || form.ThumbnailUrl} />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">No video selected</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Reel Guidelines</h3>
            <ul className="space-y-2">
              {GUIDELINES.map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Popular Categories</h3>
            <div className="space-y-2">
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category}
                  type="button"

                  +++
                  onClick={() => handleChange("Category", category)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${form.Category === category ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div> */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <h3 className="font-semibold text-emerald-800 mb-2">Reel Tips</h3>
            <p className="text-sm text-emerald-700">Create short, engaging and value-packed content to increase likes, shares and followers.</p>
          </div>
        </section>
      </form>
     
    </div>
  );
}
