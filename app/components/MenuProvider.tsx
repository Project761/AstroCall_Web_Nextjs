"use client";

import { MenuProvider } from "../context/MenuContext";

export default function MenuProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MenuProvider>
      {children}
    </MenuProvider>
  );
}
