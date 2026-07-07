"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaSun, FaMoon, FaRegCalendarAlt, FaStar,
  FaVideo, FaPlay, FaMapMarkerAlt,
  FaUserCheck,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import { GiSunPriest, GiCrystalBall } from "react-icons/gi";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPostData, postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import AuthModal from "../AuthModal";
import { ORANGE, CREAM, CREAM_ALT, PEACH } from "@/app/lib/siteTheme";

/* ─── Tiny design tokens ─────────────────────────────────────── */
const CARD_RADIUS = "rounded-2xl";
const CARD_SHADOW = "shadow-[0_2px_16px_rgba(255,92,0,0.08)]";
const CARD_BORDER = "border border-orange-100";
const INPUT_CLS =
  "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/40 transition placeholder:text-gray-400";
const LABEL_CLS = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";
const BTN_PRIMARY =
  "w-full cursor-pointer rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98]";
const BTN_OUTLINE =
  "w-full cursor-pointer rounded-xl border-2 py-3 text-sm font-bold transition hover:bg-orange-50 active:scale-[0.98]";

/* ─── Panchang Row ───────────────────────────────────────────── */
function PanchangRow({ icon: Icon, label, value, color = "#555" }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#FFFAF5] px-4 py-2.5">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: CREAM_ALT }}
      >
        <Icon className="text-sm" style={{ color: ORANGE }} />
      </div>
      <span className="flex-1 text-xs font-medium text-gray-500">{label}</span>
      <span
        className="text-xs font-bold"
        style={{ color }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

/* ─── Section heading helper ─────────────────────────────────── */
function CardHeading({ icon: Icon, title, color = ORANGE }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: CREAM_ALT }}
      >
        <Icon className="text-base" style={{ color }} />
      </div>
      <h3 className="text-base font-extrabold text-[#1A1A1A]">{title}</h3>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function AstrocallHomepage({
  initialHomeVideo = [],
  variant = "default",
}) {
  const isHomeV2 = variant === "home-v2";
  const router = useRouter();

  const {
    LanguageDropdown,
    Get_find_sun_moon,
    sunmoonData,
    FindTithiData,
    Get_find_Nakshatra,
    setIsModalOpen,
    isModalOpen,
    nakshatraData,
    Get_find_yoga,
    Get_find_tithi,
  } = useMenuContext();

  /* ── form state ── */
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState({ Name: "", BirthPlace: "" });
  const [Genderstatus, setGenderstatus] = useState("Male");
  const [Locationdata, setLocationdata] = useState([]);
  const [longitudedata, setlongitudedata] = useState("");
  const [latitudedata, setlatitudedata] = useState("");
  const [length, setLength] = useState(null);
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");

  /* ── video state ── */
  const [HomeVideoData, setHomeVideoData] = useState(initialHomeVideo);
  const [videoEmbedPlaying, setVideoEmbedPlaying] = useState(false);
  const bestVideoRef = useRef(null);

  const today = new Date();
  const UserLoginId =
    typeof window !== "undefined" ? localStorage.getItem("UserLoginId") : "";

  const defaultLocation = {
    city: "New Delhi, India",
    latitude: "28.6139",
    longitude: "77.2090",
  };

  /* ── Panchang APIs ── */
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          Get_find_tithi(new Date(), defaultLocation.latitude, defaultLocation.longitude, defaultLocation.city, LanguageDropdown),
          Get_find_sun_moon(new Date(), defaultLocation.latitude, defaultLocation.longitude, defaultLocation.city, LanguageDropdown),
          Get_find_Nakshatra(new Date(), defaultLocation.latitude, defaultLocation.longitude, defaultLocation.city, LanguageDropdown),
          Get_find_yoga(new Date(), defaultLocation.latitude, defaultLocation.longitude, defaultLocation.city, LanguageDropdown),
        ]);
      } catch (e) {
        console.error("Panchang load error:", e);
      }
    };
    load();
  }, [LanguageDropdown]);

  useEffect(() => {
    if (initialHomeVideo.length > 0) return;

    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      try {
        const res = await getPostData("CelebritiesVideos/GetData_CelebritiesVideos", {
          bestVideo: "1",
          IsActive: "1",
        });
        if (res && !cancelled) setHomeVideoData(res);
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialHomeVideo.length]);

  /* ── Location autocomplete ── */
  const Get_Data_Location = async () => {
    try {
      const res = await postWithToken("Location/GetLocation", { address: value?.BirthPlace });
      if (res) setLocationdata(res);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const t = setTimeout(() => { if (length > 3) Get_Data_Location(); }, 500);
    return () => clearTimeout(t);
  }, [length, value?.BirthPlace]);

  const handleInputChange = (e) => {
    setValue({ ...value, BirthPlace: e.target.value });
    setLength(e.target.value.length);
  };
  const handleChange = (e) => setValue((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onChangeRadioGender = (e) => setGenderstatus(e.target.value);
  const handleSelect = (loc) => { setValue((p) => ({ ...p, BirthPlace: loc })); setLength(loc.length); setLocationdata([]); };

  /* ── Submit ── */
  const Insert_Free_Fundli = async () => {
    const [year, month, day] = dob.split("-");
    const [hour, minute] = tob.split(":");
    const res = await TokenWithDeleteUpadateAdd("KundaliDetails/Insert_KundaliDetails", {
      UserId: UserLoginId, Name: value.Name, Gender: Genderstatus,
      Day: day, Month: month, Year: year,
      Hours: hour, Minute: minute, Second: "00",
      PlaceOfBirth: value.BirthPlace, Latitude: latitudedata, Longitude: longitudedata,
    });
    if (res?.Message === "Insert Successfully ") router.push(`/freekundli/${res?.Id}`);
  };

  const checkValidationErrors = () => {
    const e = {};
    if (!value.Name) e.Name = "Name is required";
    if (!value.BirthPlace) e.BirthPlace = "Birth place is required";
    if (!dob) e.dob = "Date of birth is required";
    if (!tob) e.tob = "Time of birth is required";
    setErrors(e);
    if (Object.keys(e).length === 0) {
      if (UserLoginId) Insert_Free_Fundli();
      else setIsModalOpen(true);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <div
      ref={bestVideoRef}
      className={isHomeV2 ? "" : "bg-[#FFFAF5]"}
    >
      {/* ── Section heading (home-v2 only) ─────────────────────── */}
      {/* {isHomeV2 && (
        <div className="mb-6 text-center">
          <span
            className="inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest"
            style={{ background: CREAM_ALT, color: ORANGE }}
          >
            Astro Tools
          </span>
          <h2 className="mt-2 text-xl font-extrabold text-[#1A1A1A] md:text-2xl">
            Your Daily{" "}
            <span style={{ color: ORANGE }}>Cosmic Companion</span>
          </h2>
          <div
            className="mx-auto mt-2 h-0.5 w-14 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }}
          />
        </div>
      )} */}

      {/* ── 3-column grid ───────────────────────────────────────── */}
      <div
        className={`grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 ${isHomeV2 ? "" : "mx-auto max-w-6xl px-4 py-10"
          }`}
      >
        {/* ════════════ CARD 1 — Today's Panchang ════════════ */}
        <div className={`${CARD_RADIUS} ${CARD_SHADOW} ${CARD_BORDER} bg-white p-4 sm:p-5 md:p-6`}>
          <CardHeading icon={FaRegCalendarAlt} title="Today's Panchang" />

          {/* Location pill */}
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2">
            <FaMapMarkerAlt className="shrink-0 text-xs" style={{ color: ORANGE }} />
            <p className="text-xs font-semibold text-gray-700 line-clamp-1">
              New Delhi, India — {today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Panchang rows */}
          <div className="">
            <PanchangRow
              icon={GiSunPriest}
              label="Tithi"
              value={FindTithiData?.tithis?.[0]?.tithi || "Loading…"}
            />
            <PanchangRow
              icon={FaStar}
              label="Nakshatra"
              value={nakshatraData?.nakshatras?.nakshatra_list?.[0]}
            />
            <PanchangRow
              icon={FaSun}
              label="Sunrise"
              value={sunmoonData?.sunrise}
              color={ORANGE}
            />
            <PanchangRow
              icon={FaMoon}
              label="Sunset"
              value={sunmoonData?.sunset}
              color="#6366f1"
            />
            <PanchangRow
              icon={FaSun}
              label="Moonrise"
              value={sunmoonData?.moonrise}
              color={ORANGE}
            />
            <PanchangRow
              icon={FaMoon}
              label="Moonset"
              value={sunmoonData?.moonset}
              color="#6366f1"
            />
          </div>

          <Link href="/today-panchang" className="mt-5 block">
            <button
              type="button"
              className={BTN_PRIMARY}
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8C42)` }}
            >
              View Full Panchang →
            </button>
          </Link>
        </div>

        {/* ════════════ CARD 2 — Free Kundli ════════════ */}
        <div className={`${CARD_RADIUS} ${CARD_SHADOW} ${CARD_BORDER} bg-white p-4 sm:p-5 md:p-6`}>
          <CardHeading icon={GiCrystalBall} title="Generate Free Kundli" />

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className={LABEL_CLS}>Full Name</label>
              <input
                id="Name"
                name="Name"
                value={value.Name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={INPUT_CLS}
              />
              {errors.Name && <p className="mt-1 text-xs text-red-500">{errors.Name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className={LABEL_CLS}>Gender</label>
              <div className="flex gap-4">
                {["Male", "Female"].map((g) => (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
                    style={{
                      borderColor: Genderstatus === g ? ORANGE : "#e5e7eb",
                      color: Genderstatus === g ? ORANGE : "#555",
                      background: Genderstatus === g ? CREAM_ALT : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="Gender"
                      value={g}
                      checked={Genderstatus === g}
                      onChange={onChangeRadioGender}
                      className="accent-[#FF5C00]"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className={LABEL_CLS}>Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={INPUT_CLS}
              />
              {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
            </div>

            {/* TOB */}
            <div>
              <label className={LABEL_CLS}>Time of Birth</label>
              <input
                type="time"
                id="tob"
                name="tob"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className={INPUT_CLS}
              />
              {errors.tob && <p className="mt-1 text-xs text-red-500">{errors.tob}</p>}
            </div>

            {/* Birth Place with autocomplete */}
            <div className="relative">
              <label className={LABEL_CLS}>Place of Birth</label>
              <input
                id="BirthPlace"
                name="BirthPlace"
                placeholder="Search city…"
                className={INPUT_CLS}
                autoComplete="off"
                value={value.BirthPlace}
                onChange={handleInputChange}
              />
              {errors.BirthPlace && (
                <p className="mt-1 text-xs text-red-500">{errors.BirthPlace}</p>
              )}

              {/* Dropdown */}
              {Locationdata?.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-xl">
                  {Locationdata.map((item, i) => (
                    <div
                      key={i}
                      className="flex cursor-pointer items-start gap-2 border-b border-gray-50 px-4 py-3 text-sm text-gray-700 transition last:border-b-0 hover:bg-orange-50"
                      onMouseDown={() => {
                        handleSelect(item?.display_name);
                        setlongitudedata(item?.lon);
                        setlatitudedata(item?.lat);
                      }}
                    >
                      <FaMapMarkerAlt className="mt-0.5 shrink-0 text-xs" style={{ color: ORANGE }} />
                      <p className="leading-snug">{item?.display_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={checkValidationErrors}
              className={BTN_PRIMARY}
              style={{ background: `linear-gradient(135deg, ${ORANGE}, #FF8C42)` }}
            >
              Generate Kundli →
            </button>
          </div>
        </div>

        {/* ════════════ CARD 3 — Best Video ════════════ */}
        <div className={`${CARD_RADIUS} ${CARD_SHADOW} ${CARD_BORDER} bg-white p-4 sm:p-5 md:p-6`}>
          <CardHeading icon={FaVideo} title="How Astrology Works" />

          {/* Subtitle */}
          <p className="mb-4 text-xs text-gray-500">
            Watch this short video to understand the power of Vedic astrology.
          </p>

          {/* Video player */}
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-100" style={{ aspectRatio: "16/9" }}>
            {HomeVideoData[0]?.VideoID && videoEmbedPlaying ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${HomeVideoData[0]?.VideoID}?autoplay=1&mute=1&loop=1&playlist=${HomeVideoData[0]?.VideoID}&rel=0`}
                title={HomeVideoData[0]?.Description || "How Astrology Works"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            ) : HomeVideoData[0]?.VideoID ? (
              <button
                type="button"
                className="group relative block h-full w-full cursor-pointer overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]"
                onClick={() => setVideoEmbedPlaying(true)}
                aria-label="Play video"
              >
                <img
                  src={`https://i.ytimg.com/vi/${HomeVideoData[0]?.VideoID}/hqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl ring-4 ring-white/30 transition group-hover:scale-110"
                    style={{ background: ORANGE }}
                  >
                    <FaPlay className="ml-1 h-5 w-5 text-white" aria-hidden />
                  </span>
                </span>
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                Loading video…
              </div>
            )}
          </div>

          {/* Description */}
          {HomeVideoData[0]?.Description && (
            <p className="mt-3 text-center text-xs font-medium text-gray-600 capitalize line-clamp-2">
              {HomeVideoData[0]?.Description}
            </p>
          )}

          {/* Trust strip */}
          {/* <div className="mt-4 flex items-center justify-center gap-6 rounded-xl bg-[#FFFAF5] py-3">
            {[
              { icon: MdVerified, text: "Verified Astrologers" },
              { icon: FaStar, text: "4.9 Rating" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="text-sm" style={{ color: ORANGE }} />
                <span className="text-[11px] font-semibold text-gray-600">{text}</span>
              </div>
            ))}
          </div> */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: FaUserCheck, label: "Expert Guidance" },
              { icon: FaClock, label: "24/7 Support" },
              { icon: FaShieldAlt, label: "Trusted Advice" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center rounded-xl bg-orange-50 p-3"
              >
                <item.icon className="mb-1 text-lg text-orange-500" />
                <span className="text-[10px] font-medium text-gray-600 text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          {!videoEmbedPlaying && HomeVideoData[0]?.VideoID && (
            <button
              type="button"
              onClick={() => setVideoEmbedPlaying(true)}
              className={`${BTN_OUTLINE} mt-4`}
              style={{ borderColor: ORANGE, color: ORANGE }}
            >
              ▶ Watch Now
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => Insert_Free_Fundli()}
      />
    </div>
  );
}