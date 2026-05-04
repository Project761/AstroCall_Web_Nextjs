"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaSun, FaMoon, FaRegCalendarAlt, FaStar, FaVideo, } from "react-icons/fa";
import { GiSunPriest, GiCrystalBall } from "react-icons/gi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPostData, postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { useMenuContext } from "@/app/hooks/useMenuContext";

export default function AstrocallHomepage() {
  const router = useRouter();

  const {
    LanguageDropdown,
    Get_find_sun_moon,
    sunmoonData,
    FindTithiData,
    Get_find_Nakshatra,
    nakshatraData,
    Get_find_yoga,
    Get_find_tithi,
  } = useMenuContext();

  const [errors, setErrors] = useState({});
  const [value, setValue] = useState({
    Name: "",
    BirthPlace: "",
  });

  const [Genderstatus, setGenderstatus] = useState("Male");
  const [Locationdata, setLocationdata] = useState([]);
  const [longitudedata, setlongitudedata] = useState("");
  const [latitudedata, setlatitudedata] = useState("");
  const [length, setLength] = useState(null);

  const [HomeVideoData, setHomeVideoData] = useState([]);
  const [isBestVideoInView, setIsBestVideoInView] = useState(false);
  const [videoEmbedPlaying, setVideoEmbedPlaying] = useState(false);
  const bestVideoRef = useRef(null);

  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");

  const today = new Date();

  const UserLoginId =
    typeof window !== "undefined"
      ? localStorage.getItem("UserLoginId")
      : "";

  const defaultLocation = {
    city: "New Delhi, India",
    latitude: "28.6139",
    longitude: "77.2090",
  };

  // ------------------ Panchang APIs ------------------
  useEffect(() => {
    Get_find_tithi(
      new Date(),
      defaultLocation.latitude,
      defaultLocation.longitude,
      defaultLocation.city,
      LanguageDropdown
    );

    Get_find_sun_moon(
      new Date(),
      defaultLocation.latitude,
      defaultLocation.longitude,
      defaultLocation.city,
      LanguageDropdown
    );

    Get_find_Nakshatra(
      new Date(),
      defaultLocation.latitude,
      defaultLocation.longitude,
      defaultLocation.city,
      LanguageDropdown
    );

    Get_find_yoga(
      new Date(),
      defaultLocation.latitude,
      defaultLocation.longitude,
      defaultLocation.city,
      LanguageDropdown
    );
  }, [LanguageDropdown]);

  // ------------------ Home Video ------------------
  const Get_HomeVideo = async () => {
    try {
      const res = await getPostData(
        "CelebritiesVideos/GetData_CelebritiesVideos",
        {
          bestVideo: "1",
          IsActive: "1",
        }
      );
      if (res) setHomeVideoData(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Get_HomeVideo();
  }, []);

  // ------------------ Location Search ------------------
  const Get_Data_Location = async () => {
    try {
      const res = await postWithToken("Location/GetLocation", {
        address: value?.BirthPlace,
      });
      if (res) setLocationdata(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (length > 3) Get_Data_Location();
  }, [length]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue({ ...value, BirthPlace: inputValue });
    setLength(inputValue.length);
  };

  // ------------------ Submit ------------------
  const Insert_Free_Fundli = async () => {
    const [year, month, day] = dob.split("-");
    const [hour, minute] = tob.split(":");

    const res = await TokenWithDeleteUpadateAdd(
      "KundaliDetails/Insert_KundaliDetails",
      {
        UserId: UserLoginId,
        Name: value.Name,
        Gender: Genderstatus,
        Day: day,
        Month: month,
        Year: year,
        Hours: hour,
        Minute: minute,
        Second: "00",
        PlaceOfBirth: value.BirthPlace,
        Latitude: latitudedata,
        Longitude: longitudedata,
      }
    );

    if (res?.Message === "Insert Successfully ") {
      router.push(`/freekundli/${res?.Id}`);
    }
  };

  const checkValidationErrors = () => {
    const newErrors = {};

    if (!value.Name) newErrors.Name = "Required";
    if (!value.BirthPlace) newErrors.BirthPlace = "Required";
    if (!dob) newErrors.dob = "Required";
    if (!tob) newErrors.tob = "Required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      Insert_Free_Fundli();
    }
  };

  // ------------------ UI ------------------
  return (
    <div
      className="text-gray-900 bg-[#fffaf5]"
      ref={bestVideoRef}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Panchang */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center text-xl font-semibold text-orange-700 mb-4">
            <FaRegCalendarAlt className="mr-2" />
            Today’s Panchang
          </div>

          <ul className="text-sm space-y-3">
            <li>
              <GiSunPriest className="inline mr-1" />
              Tithi: {FindTithiData?.tithis?.[0]?.tithi}
            </li>

            <li>
              <FaStar className="inline mr-1" />
              Nakshatra: {nakshatraData?.nakshatras?.nakshatra_list?.[0]}
            </li>

            <li>
              <FaSun className="inline mr-1" />
              Sunrise: {sunmoonData?.sunrise}
            </li>

            <li>
              <FaMoon className="inline mr-1" />
              Sunset: {sunmoonData?.sunset}
            </li>
            <li>
              <FaMoon className="inline mr-1" />
              Moonrise: 11:56:58 AM:
            </li>
            <li>
              <FaStar className="inline mr-1" />
              Nakshatra: 02:03:34 AM, Apr 25
            </li>

          </ul>

          <Link href="/today-panchang">
            <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded">
              View Details
            </button>
          </Link>
        </div>

        {/* Kundli */}
        <div className="bg-orange-50 rounded-2xl shadow-lg p-6">
          <div className="flex items-center text-xl font-semibold text-orange-700 mb-4">
            <GiCrystalBall className="mr-2" />
            Free Kundli
          </div>

          <input
            placeholder="Name"
            value={value.Name}
            onChange={(e) =>
              setValue({ ...value, Name: e.target.value })
            }
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            type="time"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            placeholder="Birth Place"
            value={value.BirthPlace}
            onChange={handleInputChange}
            className="w-full border p-2 mb-2 rounded"
          />

          <button
            onClick={checkValidationErrors}
            className="w-full bg-orange-600 text-white py-2 rounded"
          >
            Generate
          </button>
        </div>

        {/* Video */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center text-xl font-semibold text-orange-700 mb-3">
            <FaVideo className="mr-2" />
            Best Video
          </div>

          {HomeVideoData[0]?.VideoID && (
            <iframe
              className="w-full h-52"
              src={`https://www.youtube.com/embed/${HomeVideoData[0].VideoID}`}
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}