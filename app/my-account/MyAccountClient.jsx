"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaUser, FaEnvelope, FaPhone, FaCamera, FaEdit, FaWallet, FaComments,
  FaShoppingBag, FaBookOpen, FaHeart, FaShieldAlt, FaBell, FaLock,
  FaCheckCircle, FaChevronRight, FaGlobe, FaGift, FaCoins,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import {
  IoLanguage, IoChatbubbles, IoNotifications, IoHeart, IoLockClosed,
} from "react-icons/io5";
import { useMenuContext } from "../hooks/useMenuContext";
import { postWithToken, TokenImageUpload } from "../utils/api";
import { PanelLoader, OrangeButton, TrustBadges } from "../components/UserPanelPage";
import { ORANGE, calcProfileCompletion } from "../lib/userPanelNav";

const CARD = "rounded-2xl border border-gray-100 bg-white shadow-sm";
const TABS = ["Personal Info", "Birth Details", "Preferences", "Address", "Security"];

const RECENTLY_VIEWED = [
  { label: "Kundli Matching", href: "/kundali-matching", emoji: "💑" },
  { label: "Tarot Reading", href: "/TarotReading", emoji: "🔮" },
  { label: "Vastu Consultation", href: "/VedicAstrology", emoji: "🏠" },
  { label: "Numerology Report", href: "/Numerology", emoji: "🔢" },
  { label: "Gemstone", href: "/gemstone", emoji: "💎" },
];

const ACTIVITY_ITEMS = [
  { label: "Orders", count: 12, icon: FaShoppingBag, href: "/my-gemstone", color: "#8B5CF6" },
  { label: "Consultations", count: 8, icon: FaComments, href: "/my-chats", color: "#3B82F6" },
  { label: "Reports Generated", count: 15, icon: FaBookOpen, href: "/freekundli", color: "#10B981" },
  { label: "Puja Bookings", count: 4, icon: FaHeart, href: "/my-online-puja", color: "#FF5C00" },
];

export default function MyAccount() {
  const router = useRouter();
  const { loginUserData, loadingUserData, Get_SingleData_User } = useMenuContext();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "Personal Info";
    const hash = window.location.hash.replace("#", "");
    if (hash === "notifications") return "Preferences";
    if (hash === "security") return "Security";
    return "Personal Info";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [localImagePreview, setLocalImagePreview] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    consultations: true, promotions: false, horoscope: true, orders: true, wallet: true,
  });

  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";

  const serverProfile = useMemo(() => ({
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
  }), [loginUserData]);

  const serverImagePreview = useMemo(
    () => (loginUserData?.ProfilePic ? `https://${loginUserData.ProfilePic.replace(/\\/g, "/")}` : ""),
    [loginUserData]
  );

  const [editDraft, setEditDraft] = useState(null);
  const value = editDraft ?? serverProfile;
  const imagePreview = localImagePreview || serverImagePreview;

  useEffect(() => {
    const userId = localStorage.getItem("UserLoginId");
    if (userId && Get_SingleData_User) Get_SingleData_User(userId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value: inputValue } = e.target;
    if (name === "MobileNo") {
      setEditDraft((prev) => ({ ...(prev ?? serverProfile), [name]: inputValue.replace(/[^0-9]/g, "") }));
      return;
    }
    setEditDraft((prev) => ({ ...(prev ?? serverProfile), [name]: inputValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!value.FirstName.trim()) newErrors.FirstName = "First name is required";
    else if (!/^[A-Za-z ]+$/.test(value.FirstName)) newErrors.FirstName = "Only alphabets allowed";
    if (!value.LastName.trim()) newErrors.LastName = "Last name is required";
    else if (!/^[A-Za-z ]+$/.test(value.LastName)) newErrors.LastName = "Only alphabets allowed";
    if (!value.Email.trim()) newErrors.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.Email)) newErrors.Email = "Invalid email address";
    if (!value.MobileNo.trim()) newErrors.MobileNo = "Mobile number is required";
    else if (value.MobileNo.length !== 10) newErrors.MobileNo = "Mobile number must be 10 digits";
    if (!value.DOB) newErrors.DOB = "DOB is required";
    if (!value.Gender) newErrors.Gender = "Gender is required";
    if (!value.CurrentAddress.trim()) newErrors.CurrentAddress = "Address is required";
    if (!value.POB.trim()) newErrors.POB = "Birth place is required";
    else if (!value.Latitude || !value.Longitude) newErrors.POB = "Please select valid birth place from list";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      setSaving(true);
      const userId = localStorage.getItem("UserLoginId");
      const payload = { ...value, UserID: userId, ModifiedByUser: userId };
      await postWithToken("User/Update_User", payload);
      if (userId && Get_SingleData_User) await Get_SingleData_User(userId);
      setEditDraft(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditDraft(null);
    setLocalImagePreview("");
    setErrors({});
    setIsEditing(false);
  };

  const fetchLocationData = async (place) => {
    try {
      const res = await postWithToken("Location/GetLocation", { address: place });
      if (res) {
        setSuggestions(res);
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
    setEditDraft((prev) => ({ ...(prev ?? serverProfile), POB: inputValue, Latitude: "", Longitude: "" }));
    if (inputValue.length >= 3) fetchLocationData(inputValue);
    else { setSuggestions([]); setShowSuggestions(false); }
  };

  const handleSelectLocation = (item) => {
    setEditDraft((prev) => ({ ...(prev ?? serverProfile), POB: item.display_name, Latitude: item.lat, Longitude: item.lon }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/(\.apng|\.png|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp)$/i.test(file.name)) {
      alert("Only image files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }
    try {
      const userId = localStorage.getItem("UserLoginId");
      setLocalImagePreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("Data", JSON.stringify({ UserID: userId, ModifiedByUser: userId }));
      formData.append("ProfilePic", file);
      await TokenImageUpload("/User/Update_UserPhoto", formData);
      if (userId && Get_SingleData_User) await Get_SingleData_User(userId);
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const fullName = [value.FirstName, value.LastName].filter(Boolean).join(" ") || "User";
  const wallet = loginUserData?.WalletAmt ?? 0;
  const { percent } = calcProfileCompletion(loginUserData);
  const memberSince = loginUserData?.CreatedDtTm
    ? new Date(loginUserData.CreatedDtTm).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "2024";

  const profileImg = imagePreview || (value.ProfilePic ? `https://${value.ProfilePic.replace(/\\/g, "/")}` : "/images/profile pic.webp");

  const inputCls = "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5C00]";

  return (
    <div>
      {loadingUserData ? (
        <PanelLoader />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          {/* ── Center column ── */}
          <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-heading text-2xl font-extrabold text-[#0F172A] sm:text-3xl">My Profile</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your personal information and preferences</p>
              </div>
              {!isEditing ? (
                <OrangeButton outline onClick={() => { setEditDraft(serverProfile); setIsEditing(true); }}>
                  <FaEdit className="mr-1.5 inline" size={12} /> Edit Profile
                </OrangeButton>
              ) : (
                <div className="flex gap-2">
                  <button type="button" onClick={handleCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                  <OrangeButton onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</OrangeButton>
                </div>
              )}
            </div>

            {/* Profile summary card */}
            <div className={`p-5 ${CARD}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-orange-100">
                    <Image src={profileImg} alt={fullName} fill className="object-cover" sizes="64px" />
                    {isEditing && (
                      <>
                        <label htmlFor="profileImage" className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white">
                          <FaCamera size={14} />
                        </label>
                        <input id="profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#0F172A]">{fullName}</h2>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        <FaCheckCircle size={9} /> Verified
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <FaPhone size={10} className="text-[#FF5C00]" /> {value.MobileNo || "—"}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FaEnvelope size={10} className="text-[#FF5C00]" /> {value.Email || "—"}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">Member since {memberSince}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-center sm:min-w-[140px]">
                  <div className="flex items-center justify-center gap-1.5">
                    <FaCoins className="text-amber-500" size={16} />
                    <span className="text-xl font-extrabold text-[#0F172A]">{wallet}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500">Astrologer Balance</p>
                  <button type="button" onClick={() => router.push("/my-wallet")} className="mt-1 text-[11px] font-bold text-[#FF5C00] hover:underline">
                    View Wallet →
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab
                        ? "border-[#FF5C00] text-[#FF5C00]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            {activeTab === "Personal Info" && (
              <div className={`p-5 ${CARD}`}>
                <h3 className="mb-4 text-sm font-bold text-[#0F172A]">Personal Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" editing={isEditing}>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2">
                        <input name="FirstName" value={value.FirstName} onChange={handleInputChange} className={inputCls} placeholder="First" />
                        <input name="LastName" value={value.LastName} onChange={handleInputChange} className={inputCls} placeholder="Last" />
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                    )}
                  </Field>
                  <Field label="Gender" editing={isEditing}>
                    {isEditing ? (
                      <select name="Gender" value={value.Gender} onChange={handleInputChange} className={inputCls}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{value.Gender || "—"}</p>
                    )}
                  </Field>
                  <Field label="Date of Birth" editing={isEditing}>
                    {isEditing ? (
                      <input name="DOB" type="date" value={value.DOB?.split("T")[0] || value.DOB} onChange={handleInputChange} className={inputCls} />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{value.DOB ? value.DOB.split("T")[0] : "—"}</p>
                    )}
                  </Field>
                  <Field label="Time of Birth" editing={isEditing}>
                    {isEditing ? (
                      <input name="TOB" type="time" value={value.TOB} onChange={handleInputChange} className={inputCls} />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{value.TOB || "—"}</p>
                    )}
                  </Field>
                  <Field label="Place of Birth" editing={isEditing} className="sm:col-span-2 relative">
                    {isEditing ? (
                      <>
                        <input name="POB" value={value.POB} onChange={handleBirthPlaceChange} className={inputCls} placeholder="Birth place" />
                        {showSuggestions && suggestions.length > 0 && (
                          <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border bg-white shadow-lg">
                            {suggestions.map((item, i) => (
                              <li key={i} onClick={() => handleSelectLocation(item)} className="cursor-pointer px-3 py-2 text-sm hover:bg-orange-50">{item.display_name}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{value.POB || "—"}</p>
                    )}
                  </Field>
                  <Field label="Nationality" editing={false}>
                    <p className="text-sm font-semibold text-gray-800">Indian</p>
                  </Field>
                  <Field label="Mobile Number" verified={Boolean(value.MobileNo)} editing={isEditing}>
                    {isEditing ? (
                      <input name="MobileNo" value={value.MobileNo} onChange={handleInputChange} className={inputCls} maxLength={10} />
                    ) : (
                      <VerifiedValue value={value.MobileNo} verified={Boolean(value.MobileNo)} />
                    )}
                  </Field>
                  <Field label="Email Address" verified={Boolean(value.Email)} editing={isEditing} className="sm:col-span-2">
                    {isEditing ? (
                      <input name="Email" type="email" value={value.Email} onChange={handleInputChange} className={inputCls} />
                    ) : (
                      <VerifiedValue value={value.Email} verified={Boolean(value.Email)} />
                    )}
                  </Field>
                  <Field label="About Me" editing={isEditing} className="sm:col-span-2">
                    {isEditing ? (
                      <textarea name="CurrentAddress" value={value.CurrentAddress} onChange={handleInputChange} rows={3} className={inputCls} placeholder="Tell us about yourself..." />
                    ) : (
                      <p className="text-sm text-gray-600">{value.CurrentAddress || "—"}</p>
                    )}
                  </Field>
                </div>
              </div>
            )}

            {/* Birth Details tab */}
            {activeTab === "Birth Details" && (
              <div className={`p-5 ${CARD}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A]">Birth Details</h3>
                  <button type="button" onClick={() => router.push("/freekundli")} className="text-xs font-bold text-[#FF5C00] hover:underline">
                    View Full Details →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Sun Sign", val: "—", icon: "☀️" },
                    { label: "Nakshatra", val: "—", icon: "⭐" },
                    { label: "Moon Sign", val: "—", icon: "🌙" },
                    { label: "Ascendant", val: "—", icon: "⬆️" },
                  ].map(({ label, val, icon }) => (
                    <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
                      <span className="text-xl">{icon}</span>
                      <p className="mt-1 text-[10px] font-semibold text-gray-500">{label}</p>
                      <p className="text-sm font-bold text-[#0F172A]">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Date of Birth" value={value.DOB?.split("T")[0] || "—"} />
                  <InfoRow label="Time of Birth" value={value.TOB || "—"} />
                  <InfoRow label="Place of Birth" value={value.POB || "—"} className="sm:col-span-2" />
                </div>
                <OrangeButton outline className="mt-4" onClick={() => { setActiveTab("Personal Info"); setEditDraft(serverProfile); setIsEditing(true); }}>
                  Update Birth Details
                </OrangeButton>
              </div>
            )}

            {/* Preferences tab */}
            {activeTab === "Preferences" && (
              <div id="notifications" className={`p-5 ${CARD}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A]">Preferences</h3>
                  <button type="button" className="text-xs font-bold text-[#FF5C00] hover:underline">Edit Preferences →</button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {[
                    { icon: IoLanguage, label: "Language", val: "English" },
                    { icon: IoChatbubbles, label: "Consultation Type", val: "Voice & Chat" },
                    { icon: IoNotifications, label: "Notifications", val: "Email & SMS" },
                    { icon: IoHeart, label: "Topics of Interest", val: "Love, Career, Money" },
                    { icon: IoLockClosed, label: "Privacy", val: "Private Profile" },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="rounded-xl border border-gray-100 p-3 text-center">
                      <Icon className="mx-auto text-[#FF5C00]" size={20} />
                      <p className="mt-2 text-[10px] font-semibold text-gray-500">{label}</p>
                      <p className="mt-0.5 text-xs font-bold text-[#0F172A]">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <h4 className="mb-3 text-xs font-bold uppercase text-gray-400">Notification Settings</h4>
                  <ul className="space-y-2">
                    {[
                      { key: "consultations", label: "Consultation Reminders" },
                      { key: "promotions", label: "Promotions & Offers" },
                      { key: "horoscope", label: "Daily Horoscope" },
                      { key: "orders", label: "Order Updates" },
                      { key: "wallet", label: "Wallet Alerts" },
                    ].map(({ key, label }) => (
                      <li key={key} className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-600">{label}</span>
                        <button
                          type="button"
                          onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                          className={`relative h-6 w-11 rounded-full transition ${notifications[key] ? "bg-[#FF5C00]" : "bg-gray-200"}`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${notifications[key] ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Address tab */}
            {activeTab === "Address" && (
              <div className={`p-5 ${CARD}`}>
                <h3 className="mb-4 text-sm font-bold text-[#0F172A]">Address</h3>
                <Field label="Current Address" editing={isEditing} className="sm:col-span-2">
                  {isEditing ? (
                    <textarea name="CurrentAddress" value={value.CurrentAddress} onChange={handleInputChange} rows={3} className={inputCls} />
                  ) : (
                    <p className="text-sm text-gray-700">{value.CurrentAddress || "—"}</p>
                  )}
                </Field>
                {!isEditing && (
                  <OrangeButton outline className="mt-4" onClick={() => { setEditDraft(serverProfile); setIsEditing(true); }}>Edit Address</OrangeButton>
                )}
              </div>
            )}

            {/* Security tab */}
            {activeTab === "Security" && (
              <div id="security" className={`p-5 ${CARD}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FF5C00]"><FaShieldAlt /></span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Security Settings</h3>
                    <p className="text-xs text-gray-500">Password &amp; authentication</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    { label: "Password", val: "••••••••" },
                    { label: "Two-Factor Authentication", badge: "Enabled", badgeColor: "green" },
                    { label: "Login Activity", link: "View All →" },
                    { label: "Devices", link: "Manage →" },
                  ].map(({ label, val, badge, badgeColor, link }) => (
                    <li key={label} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                      <span className="text-sm text-gray-700">{label}</span>
                      {val && <span className="text-sm font-semibold tracking-widest text-gray-400">{val}</span>}
                      {badge && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColor === "green" ? "bg-green-100 text-green-700" : ""}`}>{badge}</span>
                      )}
                      {link && <button type="button" className="text-xs font-bold text-[#FF5C00] hover:underline">{link}</button>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recently Viewed */}
            <div className={`p-5 ${CARD}`}>
              <h3 className="mb-4 text-sm font-bold text-[#0F172A]">Recently Viewed</h3>
              <div className="flex gap-4 overflow-x-auto pb-1">
                {RECENTLY_VIEWED.map(({ label, href, emoji }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => router.push(href)}
                    className="flex shrink-0 flex-col items-center gap-2"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">{emoji}</span>
                    <span className="max-w-[72px] text-center text-[10px] font-semibold text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
            {/* Your Activity */}
            <div className={`p-4 ${CARD}`}>
              <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Your Activity</h3>
              <ul className="space-y-1">
                {ACTIVITY_ITEMS.map(({ label, count, icon: Icon, href, color }) => (
                  <li key={label}>
                    <button type="button" onClick={() => router.push(href)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-gray-50">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18`, color }}>
                        <Icon size={14} />
                      </span>
                      <span className="flex-1 text-left text-sm font-semibold text-gray-700">{label}</span>
                      <span className="text-sm font-bold text-gray-400">{count}</span>
                      <FaChevronRight size={10} className="text-gray-300" />
                    </button>
                  </li>
                ))}
              </ul>
              <OrangeButton outline className="mt-3 w-full">View All Activity</OrangeButton>
            </div>

            {/* AstroCoins */}
            <div className={`p-4 ${CARD}`}>
              <div className="mb-3 flex items-center gap-2">
                <FaCoins className="text-amber-500" size={18} />
                <h3 className="text-sm font-bold text-[#0F172A]">Astro payment</h3>
              </div>
              <p className="text-2xl font-extrabold text-[#0F172A]">{wallet} <span className="text-sm font-normal text-gray-500">Total Balance</span></p>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                <li className="flex justify-between"><span>payment Purchased</span><span className="font-semibold">1,500</span></li>
                <li className="flex justify-between"><span>payment Used</span><span className="font-semibold">1,000</span></li>
                <li className="flex justify-between"><span>payment Earned</span><span className="font-semibold">0</span></li>
              </ul>
              <button type="button" onClick={() => router.push("/my-wallet")} className="mt-3 w-full rounded-lg bg-purple-50 py-2 text-xs font-bold text-purple-600 transition hover:bg-purple-100">
                View Wallet
              </button>
            </div>

            {/* Account Status */}
            <div className={`p-4 ${CARD}`}>
              <h3 className="mb-3 text-sm font-bold text-[#0F172A]">Account Status</h3>
              <ul className="space-y-2">
                {[
                  { label: "Mobile Verified", status: value.MobileNo ? "Verified" : "Pending", ok: Boolean(value.MobileNo) },
                  { label: "Email Verified", status: value.Email ? "Verified" : "Pending", ok: Boolean(value.Email) },
                  { label: "Profile Completed", status: `${percent}%`, ok: percent >= 80 },
                  { label: "KYC Status", status: "Not Verified", ok: false },
                ].map(({ label, status, ok }) => (
                  <li key={label} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">{label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ok ? "bg-green-100 text-green-700" : status === "Not Verified" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                      {status}
                    </span>
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-3 w-full rounded-lg border border-green-500 py-2 text-xs font-bold text-green-600 transition hover:bg-green-50">
                Verify Now
              </button>
            </div>

            {/* Invite & Earn */}
            <div className={`overflow-hidden p-4 ${CARD}`}>
              <div className="flex items-start gap-3">
                <FaGift className="mt-1 shrink-0 text-[#FF5C00]" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Invite &amp; Earn</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    Invite friends and earn Astro payment for every successful referral.
                  </p>
                  <button type="button" className="mt-3 rounded-lg border border-orange-300 px-4 py-1.5 text-xs font-bold text-[#FF5C00] transition hover:bg-orange-50">
                    Invite Now
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <TrustBadges />
    </div>
  );
}

function Field({ label, children, editing, verified, className = "" }) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-[11px] font-semibold text-gray-500">{label}</p>
      {children}
    </div>
  );
}

function VerifiedValue({ value, verified }) {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-semibold text-gray-800">{value || "—"}</p>
      {verified && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
          <FaCheckCircle size={9} /> Verified
        </span>
      )}
    </div>
  );
}

function InfoRow({ label, value, className = "" }) {
  return (
    <div className={`rounded-lg bg-gray-50 px-3 py-2.5 ${className}`}>
      <p className="text-[10px] font-semibold text-gray-400">{label}</p>
      <p className="text-sm font-bold text-[#0F172A]">{value}</p>
    </div>
  );
}
