"use client";

import socketService from "@/app/services/socketService";
import React, { useEffect, useState } from "react";
import { MdOutlineAssignmentTurnedIn, MdOutlineWifiCalling3 } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoNotificationsOutline, IoWallet } from "react-icons/io5";
import { FaPrayingHands, FaRupeeSign, FaUsers } from "react-icons/fa";
import { IoIosClock, IoIosPeople, IoMdStar } from "react-icons/io";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import SEO from "@/app/components/SEO/page.js";
import { FiPhoneCall } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
// import AstroChat from "../astro-chat/page";




export default function AstrologerDashboard() {
  const AstroId = typeof window !== "undefined" ? localStorage.getItem("AstroLoginId") : "";

  const { loginAstrologerData, astrologerToggleStatus, Astropageload, setAstropageload } = useMenuContext();
  // console.log(loginAstrologerData, 'asdfasdf')
  const router = useRouter();

  const [isChatOnline, setIsChatOnline] = useState(false);
  const [isCallOnline, setIsCallOnline] = useState(false);
  const [popup, setPopup] = useState(null);

  const [isCheckedCall, setIsCheckedCall] = useState(() => {
    const savedCall = sessionStorage.getItem('IsCall');
    return savedCall !== null ? savedCall === 'true' : false;
  });
  const [isCheckedChat, setIsCheckedChat] = useState(() => {
    const savedChat = sessionStorage.getItem('IsChat');
    return savedChat !== null ? savedChat === 'true' : false;
  });

  // console.log(isCheckedChat, "Chat and Call Status from State");


  const stats = [
    {
      label: "Total Calls",
      value: loginAstrologerData?.TotalCalls,
      percent: `${loginAstrologerData?.IncreaseCallPer}%`,
      bgColor: "#3498DB1A",
      icon: <FiPhoneCall className="text-blue-500 text-3xl" />,
    },
    {
      label: "Total Chats",
      value: loginAstrologerData?.TotalChats,
      percent: `${loginAstrologerData?.IncreaseChatPer}%`,
      bgColor: "#2ECC711A",
      icon: <BsChatDots className="text-green-500 text-3xl" />,
    },
    {
      label: "Suggested Online Puja",
      value: loginAstrologerData?.SuggestedPuja,
      percent: "+15%",
      bgColor: "#FF7B001A",
      icon: <FaRupeeSign className="text-yellow-500 text-3xl" />,
    },
    {
      label: "Suggested Gemstone",
      value: loginAstrologerData?.SuggestedGemStone,
      percent: "+5%",
      bgColor: "#9B59B61A",
      icon: <FaUsers className="text-purple-500 text-3xl" />,
    },
  ];

  const menuItems = [
    {
      name: "Call History",
      icon: <MdOutlineWifiCalling3 />,
      label: "Call",
    },
    {
      name: "Chat History",
      icon: <MdOutlineWifiCalling3 />,
      label: "Chat",
    },
    {
      name: "Suggested Online Puja",
      icon: <FaPrayingHands />,
      label: "Suggested Online Puja",
    },
    {
      name: "Notifications",
      icon: <IoNotificationsOutline />,
      label: "Notifications",
    },
    {
      name: "Suggested Mall Items",
      icon: <AiOutlineShoppingCart />,
      label: "Suggested Mall Item",
    },
    {
      name: "Wallet",
      icon: <IoWallet />,
      label: "Wallet",
    },
    {
      name: "Waiting List",
      icon: <IoIosClock />,
      label: "Waiting List",
    },
    {
      name: "Assign Puja",
      icon: <MdOutlineAssignmentTurnedIn />,
      label: "Assign Puja",
    },
    {
      name: "My Reviews",
      icon: <IoMdStar />,
      label: "My Review",
    },
    {
      name: "My Followers",
      icon: <IoIosPeople />,
      label: "My Followers",
    },
    // {
    //   name: "AstroChatpage",
    //   icon: <IoIosPeople />,
    //   label: "AstroChatpage",
    // },
    {
      name: "Pending List",
      icon: <IoIosPeople />,
      label: "Pending List",
    },
  ];


  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);


  const handleChatToggle = () => {
    const newState = !isCheckedChat;
    setIsCheckedChat(newState);
    socketService.sendAstro({
      UserId: `WA${AstroId}`,
      Status: newState ? "OnlineType" : "ToggleClose",
      Type: "chat",
      ChatOnline: newState ? "1" : "0",
      CallOnline: isCheckedCall ? "1" : "0",
      BusyType: "0",
      messageId: "NewRequest",
    });
  };

  // useEffect(() => {
  //   if (Astropageload) {
  //     handleChatToggle();
  //     console.log("handleChatToggle called in useEffect when Astropageload is true");
  //   }
  // }, [Astropageload])




  const handleCallToggle = () => {
    const newState = !isCheckedCall;
    setIsCheckedCall(newState);
    setIsCallOnline(newState);

    if (newState) {
      // ✅ CALL ON
      socketService.sendAstro({
        UserId: `WA${AstroId}`,
        Status: "OnlineType",
        Type: "call",
        CallOnline: "1",
        ChatOnline: isCheckedChat ? "1" : "0",
        BusyType: "0",
        messageId: "NewRequest",
      });
    } else {
      // ❌ CALL OFF
      socketService.sendAstro({
        UserId: `WA${AstroId}`,
        Status: "ToggleClose",
        Type: "call",
        CallOnline: "0",
        ChatOnline: isCheckedChat ? "1" : "0",
      });
    }
  };

  const handleMenuClick = (itemName) => {
    // Handle menu item clicks - you can add navigation logic here
    console.log('Menu item clicked:', itemName);
    // Example: router.push(`/astrologer-panel/${itemName.toLowerCase().replace(' ', '-')}`);
  };

  useEffect(() => {
    if (loginAstrologerData) {
      const savedChat = sessionStorage.getItem('IsChat');
      const savedCall = sessionStorage.getItem('IsCall');

      if (savedChat === null) {
        const apiChatValue = loginAstrologerData?.IsChat === true || loginAstrologerData?.IsChat === "true";
        setIsCheckedChat(apiChatValue);
        sessionStorage.setItem("IsChat", apiChatValue);
      }

      if (savedCall === null) {
        const apiCallValue = loginAstrologerData?.IsCall === true || loginAstrologerData?.IsCall === "true";
        setIsCheckedCall(apiCallValue);
        sessionStorage.setItem("IsCall", apiCallValue);
      }
    }
  }, [loginAstrologerData]);


  useEffect(() => {
    sessionStorage.setItem('IsChat', isCheckedChat);
    sessionStorage.setItem('IsCall', isCheckedCall);
  }, [isCheckedChat, isCheckedCall]);

  // useEffect(() => {
  //   if (loginAstrologerData) {
  //     HandleCallChatTrue(loginAstrologerData)
  //   }
  // }, [loginAstrologerData])

  // const HandleCallChatTrue = () => {
  //   if (loginAstrologerData?.IsChat === true || loginAstrologerData?.IsChat === "true") {
  //     handleChatToggle();
  //     console.log("call")
  //     // setChatCallTrue(false)
  //   }
  //   if (loginAstrologerData?.IsCall === true || loginAstrologerData?.IsCall === "true") {
  //     handleCallToggle();
  //     // setChatCallTrue(false)
  //   }
  // }
  useEffect(() => {
    if (!loginAstrologerData) return;

    const isChat =
      loginAstrologerData?.IsChat === true ||
      loginAstrologerData?.IsChat === "true";

    const isCall =
      loginAstrologerData?.IsCall === true ||
      loginAstrologerData?.IsCall === "true";

    // UI set karo
    setIsCheckedChat(isChat);
    setIsCheckedCall(isCall);

    sessionStorage.setItem("IsChat", isChat);
    sessionStorage.setItem("IsCall", isCall);

    // 🔥 IMPORTANT: Sirf TRUE pe socket hit
    // if (isChat) {
    //   socketService.sendAstro({
    //     UserId: `WA${AstroId}`,
    //     Status: "OnlineType",
    //     Type: "chat",
    //     ChatOnline: "1",
    //     CallOnline: isCall ? "1" : "0",
    //     BusyType: "0",
    //     messageId: "NewRequest",
    //   });
    //   console.log({
    //     UserId: `WA${AstroId}`,
    //     Status: "OnlineType",
    //     Type: "chat",
    //     ChatOnline: "1",
    //     CallOnline: isCall ? "1" : "0",
    //     BusyType: "0",
    //     messageId: "NewRequest",
    //   }, 'isChat is true');
    // }

    if (isCall) {
      socketService.sendAstro({
        UserId: `WA${AstroId}`,
        Status: "OnlineType",
        Type: "call",
        CallOnline: "1",
        ChatOnline: isChat ? "1" : "0",
        BusyType: "0",
        messageId: "NewRequest",
      });
    }

  }, [loginAstrologerData]);


  useEffect(() => {
    const data = astrologerToggleStatus;
    if (!data) return;

    const astroId = data?.UserId?.replace(/[a-zA-Z]/g, "");
    if (astroId !== AstroId) return;

    if (data.Type === "chat") {
      if (data.Message === "This Astrologer is Online") {
        setIsCheckedChat(true);
        sessionStorage.setItem("IsChat", "true");
      } else if (data.Message === "This Astrologer is Offline") {
        setIsCheckedChat(false);
        sessionStorage.setItem("IsChat", "false");
      }
    }

    if (data.Type === "call") {
      if (data.Message === "This Astrologer is Online") {
        setIsCheckedCall(true);
        sessionStorage.setItem("IsCall", "true");
      } else if (data.Message === "This Astrologer is Offline") {
        setIsCheckedCall(false);
        sessionStorage.setItem("IsCall", "false");
      }
    }
  }, [astrologerToggleStatus]);


  return (
    <>
      <SEO 
        title="Astrologer Dashboard - AstroCall" 
        description="Manage your astrology consultations, track earnings, and monitor your online status on AstroCall dashboard" 
        canonical="https://astrocall.live/astrologer-panel/dashboard" 
        type="website" 
        noindex={true}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Astrologer Dashboard - AstroCall",
          "description": "Manage your astrology consultations, track earnings, and monitor your online status on AstroCall dashboard",
          "url": "https://astrocall.live/astrologer-panel/dashboard"
        }}
      />
      {/* Dashboard Content */}
      <div className={`p-6 relative transition-all duration-300}`}>
        <div className="main-container px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-5">
            <div className="w-full">
              <div className="">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold capitalize">Welcome back {loginAstrologerData?.DisplayName}</h2>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Here&apos;s your dashboard overview for today
                    </p>
                  </div>

                  <div className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap">
                    📅{formattedDate}
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {stats.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-4 rounded-xl shadow-md border-t-4 border-orange-300 bg-white flex gap-3 sm:gap-4 md:gap-5 items-center hover:shadow-lg transition-shadow"
                    >
                      <div
                        className="flex items-center p-2 sm:p-3 justify-center rounded-xl flex-shrink-0"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <span className="text-lg sm:text-xl md:text-2xl">{item.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base sm:text-lg md:text-xl font-bold text-gray-800">{item.value}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">{item.label}</div>
                        <div className="text-green-600 text-xs sm:text-sm bg-green-50 p-1 px-2 rounded-md inline-block mt-2 font-medium">
                          {item.percent}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border-2 border-orange-300 mt-5 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg overflow-x-auto">
                <div className="hidden md:block">
                  <table className="border-collapse w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-orange-400 text-white">
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">Type</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">Your Price</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">Status</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">Next Online Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium">Call</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                          <strong>India:</strong> ₹ {loginAstrologerData?.AstroPricePerMin} /min
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              id="IsCall"
                              name="IsCall"
                              checked={isCheckedCall}
                              onChange={() => {
                                handleCallToggle()
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                          </label>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{loginAstrologerData?.NextOnlineTime || 'N/A'}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium">Chat</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                          <strong>India:</strong> ₹ {loginAstrologerData?.AstroPricePerMin} /min
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              id="IsChat"
                              name="IsChat"
                              checked={isCheckedChat}
                              onChange={() => {
                                handleChatToggle();
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                          </label>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{loginAstrologerData?.NextOnlineTime || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  <div className="border border-orange-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-base">Call</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="IsCallMobile"
                          checked={isCheckedCall}
                          onChange={() => {
                            handleCallToggle();
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><strong>Price:</strong> ₹ {loginAstrologerData?.AstroPricePerMin} /min</p>
                    <p className="text-xs text-gray-500"><strong>Next Online:</strong> {loginAstrologerData?.NextOnlineTime || 'N/A'}</p>
                  </div>
                  <div className="border border-orange-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-base">Chat</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="IsChatMobile"
                          checked={isCheckedChat}
                          onChange={() => {
                            handleChatToggle();
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2"><strong>Price:</strong> ₹ {loginAstrologerData?.AstroPricePerMin} /min</p>
                    <p className="text-xs text-gray-500"><strong>Next Online:</strong> {loginAstrologerData?.NextOnlineTime || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleMenuClick(item.name)}
                className="cursor-pointer"
              >
                <div
                  className="flex flex-col rounded-xl shadow-md hover:shadow-lg duration-300 hover:scale-105 items-center relative transform transition-all bg-white p-4 sm:p-5 border border-gray-100"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl text-orange-500 bg-orange-50 p-3 sm:p-4 rounded-full mb-2 sm:mb-3">{item.icon}</div>
                  <h6 className="text-black text-center text-xs sm:text-sm font-semibold mt-1 sm:mt-2 leading-tight">
                    {item.label}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <AstroChat /> */}
    </>
  )
}
