"use client";

import { createContext, useContext } from "react";
import socket from "../services/socketService";

const SocketContext = createContext();

/** Only exposes socket instance — connection managed by SocketBootstrap */
export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={{ socket }}>
    {children}
  </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
