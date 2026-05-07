"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/page";
import Footer from "./Footer/page";
import MenuProvider from "./MenuProvider";
import { SocketProvider } from "../context/SocketContext";
import { useEffect } from "react";


export default function AppShell({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const hideLayout =
    pathname.startsWith("/astrologer-login") ||
    pathname.startsWith("/astrologer-panel");

  const hideFooter =
    pathname.startsWith("/astrologer-login") ||
    pathname.startsWith("/astrologer-panel") ||
    pathname.startsWith("/my-");

  return (
    <MenuProvider>
      <SocketProvider>
        {!hideLayout && <Header />}
        {children}
        {!hideFooter && <Footer footers={[]} />}

      </SocketProvider>
    </MenuProvider>
  );
}

