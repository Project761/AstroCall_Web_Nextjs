"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/page";
import Footer from "./Footer/page";
import MenuProvider from "./MenuProvider";
import { SocketProvider } from "../context/SocketContext";


export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideLayout =
    pathname.startsWith("/astrologer-login") ||
    pathname.startsWith("/astrologer-panel");

  return (
    <MenuProvider>
      <SocketProvider>
        {!hideLayout}
        {children}
        {!hideLayout && <Footer footers={[]} />}
       
      </SocketProvider>
    </MenuProvider>
  );
}

