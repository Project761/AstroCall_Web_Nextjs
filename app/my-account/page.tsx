"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSave, FaEdit } from "react-icons/fa";
import Header from "../components/Header/page";
import SEO from "../components/SEO/page";
import { useMenuContext } from "../hooks/useMenuContext";

export default function MyAccount() {
  const router = useRouter();
  const { loginUserData, loadingUserData, Get_SingleData_User } = useMenuContext();
  console.log("loginUserData", loginUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profilePic: "",
    dateOfBirth: "",
    gender: "",
    address: ""
  });

  useEffect(() => {
    if (loginUserData) {
      setFormData({
        firstName: loginUserData?.FirstName || "",
        lastName: loginUserData?.LastName || "",
        email: loginUserData?.Email || "",
        mobile: loginUserData?.MobileNo || "",
        profilePic: loginUserData?.ProfilePic || "",
        dateOfBirth: loginUserData?.DateOfBirth || "",
        gender: loginUserData?.Gender || "",
        address: loginUserData?.Address || ""
      });
    }
  }, [loginUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // Here you would make an API call to update the user profile
    console.log("Saving profile:", formData);
    setIsEditing(false);
    // Update localStorage with new data
    const updatedUserData = { ...loginUserData, ...formData };
    localStorage.setItem("LoginTokenData", JSON.stringify(updatedUserData));
    // Refresh user data from API
    const userId = localStorage.getItem("UserLoginId");
    if (userId) {
      await Get_SingleData_User(userId);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    if (loginUserData) {
      setFormData({
        firstName: loginUserData?.FirstName || "",
        lastName: loginUserData?.LastName || "",
        email: loginUserData?.Email || "",
        mobile: loginUserData?.MobileNo || "",
        profilePic: loginUserData?.ProfilePic || "",
        dateOfBirth: loginUserData?.DateOfBirth || "",
        gender: loginUserData?.Gender || "",
        address: loginUserData?.Address || ""
      });
    }
    setIsEditing(false);
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
  //           <p className="mt-4 text-gray-600">Loading...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error || !userData) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="flex items-center justify-center h-screen">
  //         <div className="text-center">
  //           <p className="mt-4 text-gray-600">Error loading user data</p>
  //           <button onClick={() => router.push("/")} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg">
  //             Go Home
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <SEO 
        title="My Account - AstroCall"
        description="Manage your profile information and preferences"
        keywords="my account, profile, astrocall"
      />
      <Header />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaUser className="text-orange-500 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaSave />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-orange-200 mx-auto">
                      {/* <Image
                        src={formData?.profilePic || "/images/profile pic.webp"}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover"
                      /> */}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                        <FaCamera className="text-sm" />
                      </button>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-800">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-gray-600">{formData.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-1" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
