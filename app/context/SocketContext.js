"use client";

import { createContext, useContext, useEffect } from "react";
import socket from "../services/socketService";
import { useMenuContext } from "../hooks/useMenuContext";
import { getStoredUserId, hasUserAuthSession } from "../lib/wsUrl";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { UserLoginId, isLogin } = useMenuContext();

  useEffect(() => {
    const userId = UserLoginId || getStoredUserId();
    if (!userId || !(isLogin || hasUserAuthSession())) return;

    socket.connectUser(userId);
    socket.setupVisibilityHandler(userId, null);
  }, [isLogin, UserLoginId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
