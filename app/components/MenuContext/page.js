"use client";

import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [languageStatus, setLanguageStatus] = useState(true);
  const [astroNameHomePageCall, setAstroNameHomePageCall] = useState('');
  const [astroNameHomePage, setAstroNameHomePage] = useState('');
  const [twominchatpopup, settwominchatpopup] = useState(false);

  return (
    <MenuContext.Provider value={{
      isMenuOpen,
      setIsMenuOpen,
      languageStatus,
      setLanguageStatus,
      astroNameHomePageCall,
      setAstroNameHomePageCall,
      astroNameHomePage,
      setAstroNameHomePage,
      twominchatpopup,
      settwominchatpopup
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  return useContext(MenuContext);
}
