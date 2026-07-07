"use client";
import { useState } from "react";
import { TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { createPortal } from "react-dom"; 

const ReviewPopup = ({ isOpen, onClose, popupData }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.trim() === "") {
      setError("Please provide your feedback");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const val = {
        AstroId: popupData?.AstroId,
        UserID: popupData?.UserId,
        StarCount: rating,
        Comments: comment,
        Status: "",
        CreatedByUser: "1",
        ChatId: popupData?.WaitingListId,
        Type: popupData?.Type === "chat" ? "chat" : "call",
      };

      const res = await TokenWithDeleteUpadateAdd("Feedback/Insert_Feedback", val);

      if (res) {
        console.log("✅ Review submitted successfully:", res);
        onClose(); // Close popup after successful submission
        // Reset form
        setRating(0);
        setComment("");
        setError("");
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden mx-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-red-500 text-lg sm:text-xl transition-colors"
          style={{ minWidth: "32px", minHeight: "32px" }}
        >
          ✕
        </button>

        <div className="p-4 sm:p-6 flex flex-col items-center">
          {/* Avatar and Name */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full mb-4 sm:mb-6">
            <img
              src={
                popupData?.AvatarUrl
                  ? `https://${popupData.AvatarUrl.replace(/\\/g, "/")}`
                  : "/default-avatar.png"
              }
              alt="Astrologer Avatar"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />

            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate flex-1">
              {popupData?.AstroName}
            </h2>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Rate Your Experience
          </h3>

          {/* Rating */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setError("");
                }}
                className={`text-3xl sm:text-4xl md:text-5xl transition-colors ${star <= rating
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-gray-300 hover:text-gray-400"
                  }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError("");
            }}
            placeholder="Share your experience..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none mb-2 text-sm resize-none"
            rows={4}
            disabled={isSubmitting}
          />

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition w-full sm:w-auto disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReviewPopup;
