"use client";

import React from "react";

const CommonLoader = ({ size = "medium", message = "Loading...", color = "orange" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const colorClasses = {
    orange: "border-orange-500",
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500",
  };

  const textColorClasses = {
    orange: "text-orange-600",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-600",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className={`mt-4 text-sm font-medium ${textColorClasses[color]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CommonLoader;
