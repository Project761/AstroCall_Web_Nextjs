// "use client";

// import Image from "next/image";
// import { FaBars, FaBell, FaChevronDown } from "react-icons/fa";
// import { useMenuContext } from "@/app/hooks/useMenuContext";
// import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";

// export default function AstrologerPanelHeader({ onMenuClick }) {
//   const { loginAstrologerData } = useMenuContext();
//   const isOnline =
//     loginAstrologerData?.IsOnline === true ||
//     loginAstrologerData?.IsOnline === "true" ||
//     loginAstrologerData?.IsChat === true ||
//     loginAstrologerData?.IsCall === true;

//   return (
//     <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-3 sm:h-16 sm:px-5">
//       <button
//         type="button"
//         onClick={onMenuClick}
//         className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 lg:hidden"
//         aria-label="Toggle menu"
//       >
//         <FaBars />
//       </button>

//       <div className="hidden lg:block" />

//       <div className="flex items-center gap-2 sm:gap-4">
//         <button
//           type="button"
//           className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold sm:flex sm:text-sm"
//         >
//           <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
//           {isOnline ? "Online" : "Offline"}
//           <FaChevronDown className="text-[10px] text-gray-400" />
//         </button>

//         <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50">
//           <FaBell className="text-lg" />
//         </button>

//         <div className="flex items-center gap-2 border-l border-gray-100 pl-2 sm:gap-3 sm:pl-4">
//           <Image
//             src={toCdnSrcOrFallback(loginAstrologerData?.AvatarUrl)}
//             alt={loginAstrologerData?.DisplayName || "Astrologer"}
//             width={36}
//             height={36}
//             className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-50"
//             unoptimized={!!loginAstrologerData?.AvatarUrl}
//           />
//           <div className="hidden min-w-0 sm:block">
//             <p className="truncate text-sm font-bold text-[#1A1A1A]">
//               {loginAstrologerData?.DisplayName || "Astrologer"}
//             </p>
//             <p className="text-[10px] text-gray-500">Astrologer</p>
//           </div>
//           <FaChevronDown className="hidden text-[10px] text-gray-400 sm:block" />
//         </div>
//       </div>
//     </header>
//   );
// }



"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaUser,
  FaUserEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { toCdnSrcOrFallback } from "@/app/lib/cdnImage";

export default function AstrologerPanelHeader({ onMenuClick }) {
  const { loginAstrologerData } = useMenuContext();

  // console.log("loginAstrologerData in AstrologerPanelHeader:", loginAstrologerData);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const isOnline =
    loginAstrologerData?.IsOnline === true ||
    loginAstrologerData?.IsOnline === "true" ||
    loginAstrologerData?.IsChat === true ||
    loginAstrologerData?.IsCall === true;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-3 sm:h-16 sm:px-5">
      {/* Mobile Menu */}
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 lg:hidden"
      >
        <FaBars />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Online Status */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold sm:flex sm:text-sm"
        >
          <span
            className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
          />
          {isOnline ? "Online" : "Offline"}
          <FaChevronDown className="text-[10px] text-gray-400" />
        </button>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50"
        >
          <FaBell className="text-lg" />
        </button>

        {/* Profile */}
        <div
          ref={profileRef}
          className="relative border-l border-gray-100 pl-2 sm:pl-4"
        >
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-3"
          >
            <Image
              src={toCdnSrcOrFallback(loginAstrologerData?.AvatarUrl)}
              alt={loginAstrologerData?.DisplayName || "Astrologer"}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-100"
              unoptimized={!!loginAstrologerData?.AvatarUrl}
            />

            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-sm font-bold text-gray-800">
                {loginAstrologerData?.DisplayName || "Astrologer"}
              </p>

              <p className="text-[10px] text-gray-500">
                Astrologer
              </p>
            </div>

            <FaChevronDown
              className={`hidden text-xs text-gray-400 transition-transform sm:block ${showProfileMenu ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.12)]">

              {/* Header */}
              <div className="border-b border-orange-100 p-5">
                <div className="flex items-center gap-4">

                  <Image
                    src={toCdnSrcOrFallback(loginAstrologerData?.AvatarUrl)}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full border-2 border-orange-200 object-cover"
                    unoptimized={!!loginAstrologerData?.AvatarUrl}
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {loginAstrologerData?.DisplayName || "Astrologer"}
                    </h3>

                    <p className="text-sm text-orange-500 font-medium">
                      Professional Astrologer
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                      />

                      <span className="text-xs text-gray-500">
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 p-5">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium">
                    {loginAstrologerData?.ExperiencedYears || "-"} Years
                  </span>
                </div>

                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Languages</span>
                  <span className="font-medium text-right">
                    {loginAstrologerData?.LanguageValue || "-"}
                  </span>
                </div> */}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium">
                    {loginAstrologerData?.RegMobileNo || "-"}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="truncate font-medium">
                    {loginAstrologerData?.EmailID || "-"}
                  </span>
                </div>

              </div>

              {/* Actions */}
              {/* <div className="border-t border-orange-100 p-3">

                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50">
                  <FaUser className="text-orange-500" />
                  View Profile
                </button>

                <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50">
                  <FaUserEdit className="text-orange-500" />
                  Edit Profile
                </button>

                <div className="my-2 border-t border-gray-100" />

                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50">
                  <FaSignOutAlt />
                  Logout
                </button>

              </div> */}

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
