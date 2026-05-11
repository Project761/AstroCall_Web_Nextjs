"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaSun, FaMoon, FaRegCalendarAlt, FaStar, FaVideo, FaPlay } from "react-icons/fa";
import { GiSunPriest, GiCrystalBall } from "react-icons/gi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPostData, postWithToken, TokenWithDeleteUpadateAdd } from "@/app/utils/api";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import AuthModal from "../AuthModal/page";

export default function AstrocallHomepage() {
  const router = useRouter();

  const {
    LanguageDropdown,
    Get_find_sun_moon,
    sunmoonData,
    FindTithiData,
    Get_find_Nakshatra,setIsModalOpen,isModalOpen,
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

  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue(prev => ({ ...prev, [name]: inputValue }));
  };

  const onChangeRadioGender = (e) => {
    setGenderstatus(e.target.value);
  };

  const handleSelect = (location) => {
    setValue(prev => ({ ...prev, BirthPlace: location }));
    setLength(location.length);
    setLocationdata([]);
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
      if (UserLoginId) {
        Insert_Free_Fundli();
      } else {
        setIsModalOpen(true);
      }
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
        <div className=" bg-white sellerCard  rounded-2xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
          <div className="flex items-center text-xl font-semibold text-orange-700 mb-4">
            <FaRegCalendarAlt className="mr-2" />
            Today’s Panchang
          </div>
          <div className="flex  text-gray-700 items-center font-[700] ">
            <p className="whitespace-normal">
              New Delhi, India ({
                new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              })</p>
          </div>

          <ul className="text-sm space-y-3 p-4 text-gray-700 ">
            <li>
              <GiSunPriest className="inline mr-1" />
              Tithi: <span className="font-bold ml-1 text-gray-800 text-base whitespace-nowrap">{FindTithiData?.tithis?.[0]?.tithi || "No Tithi Found"}</span>
            </li>
            <li>
              <FaStar className="inline mr-1" />
              Nakshatra: <span className="font-bold ml-1 text-gray-800 text-base whitespace-nowrap">{nakshatraData?.nakshatras?.nakshatra_list[0]}</span>
            </li>
            <li>
              <FaSun className="inline mr-1" />
              Sunrise: <span className="font-bold ml-1 text-gray-800 text-base whitespace-nowrap">{sunmoonData?.sunrise}</span>
            </li>
            <li>
              <FaMoon className="inline mr-1" />
              Sunset: <span className="font-bold ml-1 text-gray-800 text-base whitespace-nowrap">{sunmoonData?.sunset}</span>
            </li>
            <li>
              <FaSun className="inline mr-1" />
              Moonrise: <span className="font-bold ml-1 text-gray-800 text-base whitespace-nowrap">{sunmoonData?.moonrise}</span>
            </li>
            <li>
              <FaMoon className="inline mr-1" />
              Moonset: <span className="font-bold ml-1 text-gray-800 text-base whitespace-nowrap">{sunmoonData?.moonset}</span>
            </li>
          </ul>




          <Link href={"/today-panchang"}>
            <button
              type="submit"
              className="w-full mt-7 bg-orange-600 cursor-pointer text-white py-2 rounded hover:bg-orange-700 transition"
            >
              View Details
            </button>
          </Link>

        </div>

        {/* Kundli */}
        <div className="bg-orange-50 sellerCard rounded-2xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
          <div className="flex items-center text-xl font-semibold text-orange-700 mb-4">
            <GiCrystalBall className="mr-2" />
            Free Kundli
          </div>
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="Name"
                name="Name"
                value={value?.Name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="h-3">
                {errors?.Name && (
                  <p className="text-red-500 text-sm">{errors?.Name}</p>
                )}
              </div>
            </div>

            <div className="mb-2 flex gap-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Gender
              </label>
              <input
                name="Gender"
                type="radio"
                value={"Male"}
                checked={Genderstatus == "Male"}
                onChange={onChangeRadioGender}
                required
              />
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Male
              </label>

              <input
                type="radio"
                name="Gender"
                value={"Female"}
                checked={Genderstatus == "Female"}
                onChange={onChangeRadioGender}
                required
              />
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Female
              </label>
            </div>

            <div>
              <label htmlFor="dob" className="sr-only">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="h-3">
                {errors?.dob && (
                  <p className="text-red-500 text-sm">{errors?.dob}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="tob" className="sr-only">Time of Birth</label>
              <input
                type="time"
                id="tob"
                name="tob"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className="h-3">
                {errors?.tob && (
                  <p className="text-red-500 text-sm">{errors?.tob}</p>
                )}
              </div>
            </div>


            <div className="relative">
              <label htmlFor="place" className="sr-only">Birth Place</label>
              <input
                id="BirthPlace"
                name="BirthPlace"
                placeholder="Birth Place"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                autoComplete="off"
                value={value?.BirthPlace}
                onChange={handleInputChange}
              />

              <div className="h-3">
                {errors?.BirthPlace && (
                  <p className="text-red-500 text-sm">{errors?.BirthPlace}</p>
                )}
              </div>

              {Locationdata?.length > 0 && (
                <div className="absolute left-0 top-12 right-0 bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden z-50 max-h-72 overflow-y-auto">
                  {Locationdata.map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b last:border-b-0`}
                      onMouseDown={() => {
                        handleSelect(item?.display_name);
                        setlongitudedata(item?.lon);
                        setlatitudedata(item?.lat);
                      }}
                    >
                      <p className="font-medium">{item?.display_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
              onClick={() => {
                checkValidationErrors();
              }}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Video */}
        <div className=" bg-white sellerCard  rounded-2xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
          <div className="flex items-center text-xl font-semibold text-orange-700 mb-3">
            <FaVideo className="mr-2" />
            Best Video
          </div>

          <div className="mb-2 text-sm text-gray-700 font-medium flex items-center">
            🎬 How Astrology Works
          </div>

          <div className="w-full h-52 overflow-hidden rounded-lg bg-black/5 relative">
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
                className="group relative block h-full w-full overflow-hidden rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                onClick={() => setVideoEmbedPlaying(true)}
                aria-label="Play How Astrology Works video"
              >
                <img
                  src={`https://i.ytimg.com/vi/${HomeVideoData[0]?.VideoID}/hqdefault.jpg`}
                  alt=""
                  width={480}
                  height={360}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-orange-600 shadow-lg">
                    <FaPlay className="ml-1 h-7 w-7" aria-hidden />
                  </span>
                </span>
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500 text-xs px-3">
                Loading video...
              </div>
            )}
          </div>
          <div className="my-4 text-black text-center capitalize">
            <p>{HomeVideoData[0]?.Description ? HomeVideoData[0]?.Description : ''}</p>
          </div>
        </div>
      </div>

       <AuthModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onLoginSuccess={(userData) => {
                console.log("Login successful:", userData);
                // After successful login, trigger calculation
                Insert_Free_Fundli();
              }}
            />
      
    </div>
  );
}