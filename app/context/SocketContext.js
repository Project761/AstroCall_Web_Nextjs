"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "../services/socketService";


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

  const router = useRouter();
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("UserLoginId");
    const astroId = localStorage.getItem("AstroLoginId");

    // ✅ connect
    if (userId) socket.connectUser(userId);
    // if (astroId) socket.connectAstro(astroId);

    // ✅ listen messages
    // socket.setUserListener((data) => {
    //   console.log("USER EVENT:", data);
    //   // handleUserMessage(data);
    // });

    // socket.setAstroListener((data) => {
    //   console.log("ASTRO EVENT:", data); 
    //   // if (data.Type === "chat") {
    //   //   setPopup({ role: "astrologer", data });
    //   // }
    // });

    // return () => {
    //   socket.disconnectAll();
    // };
  }, []);



  return (
    <SocketContext.Provider value={{
      socket,
      popup,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);