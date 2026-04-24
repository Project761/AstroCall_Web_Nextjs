"use client";

import { useContext } from "react";
import { MenuContext } from "../context/MenuContext";

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  
  return context;
};
