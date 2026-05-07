"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSave, FaEdit, FaHeart, FaGem, FaComments, FaWallet, FaShoppingBag, FaQuestionCircle, FaHeadset, FaStar, FaUsers, } from "react-icons/fa";

import SEO from "../components/SEO/page";
import { useMenuContext } from "../hooks/useMenuContext";
import { postWithToken, TokenImageUpload } from "../utils/api";

const API_BASE_URL =
  typeof window !== "undefined" && window.location.origin === "https://astrocall.live"
    ? "https://api.astrocall.live/api"
    : "https://liveapi.astrocall.live/api";

export default function MyAccount() {
  const router = useRouter();

  const { loginUserData, loadingUserData, Get_SingleData_User } =
    useMenuContext();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);


  const AstrologerLoginId = sessionStorage.getItem("AstrologerLoginId") ? sessionStorage.getItem("AstrologerLoginId") : "";
  const UserLoginId = localStorage.getItem("UserLoginId") ? localStorage.getItem("UserLoginId") : "";

  const [value, setValue] = useState({
    FirstName: "", LastName: "", Email: "", MobileNo: "", DOB: "", Gender: "", CurrentAddress: "", POB: "", TOB: "", MaritalStatus: "", ProfilePic: "", Latitude: "", Longitude: "",
  });

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser />, path: "/my-account" },
    { id: "favorites", label: "Favorites", icon: <FaHeart />, path: "/my-favorites" },
    { id: "following", label: "Following", icon: <FaUsers />, path: "/my-following" },
    { id: "gemstone", label: "My Gemstone", icon: <FaGem />, path: "/my-gemstone" },
    { id: "suggested", label: "Suggested", icon: <FaStar />, path: "/my-account/suggested" },
    { id: "chats", label: "My Chats", icon: <FaComments />, path: "/my-chats" },
    { id: "wallet", label: "My Wallet", icon: <FaWallet />, path: "/my-wallet" },
    { id: "packages", label: "My Packages", icon: <FaShoppingBag />, path: "/my-packages" },
    { id: "questions", label: "My Questions", icon: <FaQuestionCircle />, path: "/my-questions" },
    { id: "support", label: "Support", icon: <FaHeadset />, path: "/support" },
  ];

  useEffect(() => {
    const userId = localStorage.getItem("UserLoginId");

    if (userId && Get_SingleData_User) {
      Get_SingleData_User(userId);
    }
  }, []);

  useEffect(() => {
    if (loginUserData) {
      const data = {
        FirstName: loginUserData?.FirstName || "",
        LastName: loginUserData?.LastName || "",
        Email: loginUserData?.Email || "",
        MobileNo: loginUserData?.MobileNo || "",
        DOB: loginUserData?.DOB || "",
        Gender: loginUserData?.Gender || "",
        CurrentAddress: loginUserData?.CurrentAddress || "",
        POB: loginUserData?.POB || "",
        TOB: loginUserData?.TOB || "",
        MaritalStatus: loginUserData?.MaritalStatus || "",
        ProfilePic: loginUserData?.ProfilePic || "",
        Latitude: loginUserData?.Latitude || "",
        Longitude: loginUserData?.Longitude || "",
      };

      setValue(data);

      if (loginUserData?.ProfilePic) {
        setImagePreview(`https://${loginUserData.ProfilePic.replace(/\\/g, "/")}`);
      }
    }
  }, [loginUserData]);

  const getHeaders = () => {
    const visitorId = localStorage.getItem("visitor_Id");

    return {
      "Content-Type": "application/json",
      FingerPrintJsKey: visitorId || "",
    };
  };

  const handleInputChange = (e) => {
    const { name, value: inputValue } = e.target;

    if (name === "MobileNo") {
      const onlyNumber = inputValue.replace(/[^0-9]/g, "");
      setValue((prev) => ({ ...prev, [name]: onlyNumber }));
      return;
    }

    setValue((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!value.FirstName.trim()) {
      newErrors.FirstName = "First name is required";
    } else if (!/^[A-Za-z ]+$/.test(value.FirstName)) {
      newErrors.FirstName = "Only alphabets allowed";
    }

    if (!value.LastName.trim()) {
      newErrors.LastName = "Last name is required";
    } else if (!/^[A-Za-z ]+$/.test(value.LastName)) {
      newErrors.LastName = "Only alphabets allowed";
    }

    if (!value.Email.trim()) {
      newErrors.Email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.Email)) {
      newErrors.Email = "Invalid email address";
    }

    if (!value.MobileNo.trim()) {
      newErrors.MobileNo = "Mobile number is required";
    } else if (value.MobileNo.length !== 10) {
      newErrors.MobileNo = "Mobile number must be 10 digits";
    }

    if (!value.DOB) newErrors.DOB = "DOB is required";
    if (!value.Gender) newErrors.Gender = "Gender is required";
    if (!value.CurrentAddress.trim()) newErrors.CurrentAddress = "Address is required";

    if (!value.POB.trim()) {
      newErrors.POB = "Birth place is required";
    } else if (!value.Latitude || !value.Longitude) {
      newErrors.POB = "Please select valid birth place from list";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const userId = localStorage.getItem("UserLoginId");

      const payload = {
        ...value,
        UserID: userId,
        ModifiedByUser: userId,
      };

      await axios.post(`${API_BASE_URL}/User/Update_User`, payload, {
        headers: getHeaders(),
      });

      if (userId && Get_SingleData_User) {
        await Get_SingleData_User(userId);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (loginUserData) {
      setValue({
        FirstName: loginUserData?.FirstName || "",
        LastName: loginUserData?.LastName || "",
        Email: loginUserData?.Email || "",
        MobileNo: loginUserData?.MobileNo || "",
        DOB: loginUserData?.DOB || "",
        Gender: loginUserData?.Gender || "",
        CurrentAddress: loginUserData?.CurrentAddress || "",
        POB: loginUserData?.POB || "",
        TOB: loginUserData?.TOB || "",
        MaritalStatus: loginUserData?.MaritalStatus || "",
        ProfilePic: loginUserData?.ProfilePic || "",
        Latitude: loginUserData?.Latitude || "",
        Longitude: loginUserData?.Longitude || "",
      });
    }

    setErrors({});
    setIsEditing(false);
  };

  useEffect(() => {
    if (value.POB) {
      fetchLocationData(value.POB, true);
    }
  }, [value.POB]);



  const fetchLocationData = async (place, isInitial = false) => {
    try {
      const res = await postWithToken(`Location/GetLocation`, { address: place });
      console.log("res", res);

      if (Array.isArray(res.data) && res.data.length > 0) {
        setSuggestions(res.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Location API Error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleBirthPlaceChange = (e) => {
    const inputValue = e.target.value;

    setValue((prev) => ({
      ...prev,
      POB: inputValue,
      Latitude: "",
      Longitude: "",
    }));

    if (inputValue.length >= 3) {
      fetchLocationData(inputValue, false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (item) => {
    setValue((prev) => ({
      ...prev,
      POB: item.display_name,
      Latitude: item.lat,
      Longitude: item.lon,
    }));

    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedExtensions = /(\.apng|\.png|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp)$/i;
    if (!allowedExtensions.exec(file.name)) {
      alert("Only image files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }
    try {
      const userId = localStorage.getItem("UserLoginId");
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      const formData = new FormData();
      formData.append("Data", JSON.stringify({ UserID: userId, ModifiedByUser: userId }));
      formData.append("ProfilePic", file);
      await TokenImageUpload("/User/Update_UserPhoto", formData);

      if (userId && Get_SingleData_User) {
        await Get_SingleData_User(userId);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  return (
    <>
      <SEO
        title="My Account - AstroCall"
        description="Manage your profile information and preferences"
        keywords="my account, profile, astrocall"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Navigation Tabs */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.path === "/my-account") {
                      setActiveTab("profile");
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === item.id && item.path === "/my-account"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Page Header */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                  <FaUser className="text-xl text-orange-500" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    My Account
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your profile details
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-xl border cursor-pointer border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 cursor-pointer rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
                  >
                    <FaSave />
                    <span>{saving ? "Saving..." : "Save"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {loadingUserData ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              Loading profile...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-orange-200 bg-gray-100">
                        <Image
                          src={
                            imagePreview ||
                            (value.ProfilePic
                              ? `https://${value.ProfilePic.replace(/\\/g, "/")}`
                              : "/images/profile pic.webp")
                          }
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {isEditing && (
                        <>
                          <label
                            htmlFor="profileImage"
                            className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
                          >
                            <FaCamera className="text-sm" />
                          </label>

                          <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                      {value.FirstName} {value.LastName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">{value.Email}</p>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-lg font-bold text-gray-800">
                    Profile Information
                  </h3>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField
                      label="First Name"
                      name="FirstName"
                      value={value.FirstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      error={errors.FirstName}
                    />

                    <InputField
                      label="Last Name"
                      name="LastName"
                      value={value.LastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      error={errors.LastName}
                    />

                    <InputField
                      label="Email"
                      name="Email"
                      type="email"
                      value={value.Email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      error={errors.Email}
                    />

                    <InputField
                      label="Mobile Number"
                      name="MobileNo"
                      type="tel"
                      value={value.MobileNo}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      error={errors.MobileNo}
                    />

                    <InputField
                      label="Date of Birth"
                      name="DOB"
                      type="date"
                      value={value.DOB}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      error={errors.DOB}
                    />

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Gender
                      </label>

                      <select
                        name="Gender"
                        value={value.Gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-500 ${isEditing
                          ? "border-gray-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                          }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>

                      {errors.Gender && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.Gender}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Marital Status
                      </label>

                      <div className="flex gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="radio"
                            name="MaritalStatus"
                            value="Unmarried"
                            checked={value.MaritalStatus === "Unmarried"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          Unmarried
                        </label>

                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="radio"
                            name="MaritalStatus"
                            value="Married"
                            checked={value.MaritalStatus === "Married"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                          Married
                        </label>
                      </div>
                    </div>



                    <InputField
                      label="Time of Birth"
                      name="TOB"
                      type="time"
                      value={value.TOB}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <div className="relative">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Birth Place
                      </label>

                      <input
                        type="text"
                        name="POB"
                        value={value.POB}
                        onChange={handleBirthPlaceChange}
                        disabled={!isEditing}
                        autoComplete="off"
                        placeholder="Enter birth place"
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-500 ${isEditing
                          ? "border-gray-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                          }`}
                      />

                      {errors.POB && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.POB}
                        </p>
                      )}

                      {isEditing && showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                          {suggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectLocation(item)}
                              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                            >
                              {item.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="relative">
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Current Address
                      </label>

                      <input
                        type="text"
                        name="currentAddress"
                        value={value.currentAddress}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        autoComplete="off"
                        placeholder="Enter current address"
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-500 ${isEditing
                          ? "border-gray-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                          }`}
                      />

                      {errors.currentAddress && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.currentAddress}
                        </p>
                      )}

                      {isEditing && showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-44 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                          {suggestions.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectLocation(item)}
                              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                            >
                              {item.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InputField({
  label, name, value, onChange, disabled, type = "text", icon, error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {icon && <span className="mr-1 inline-block text-orange-500">{icon}</span>}
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-orange-500 ${disabled ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-white"
          }`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

