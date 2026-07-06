"use client";

import { usePathname } from "next/navigation";
import MenuProvider from "./MenuProvider";
import { SocketProvider } from "../context/SocketContext";
import { useEffect } from "react";
import Header from "./Header";
import SiteFooterLight from "./SiteFooterLight";
import SocketBootstrap from "./SocketBootstrap";


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
    pathname.startsWith("/my-") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/user-chat/chat");

  const isUserLiveChat = pathname.startsWith("/user-chat/chat");

  return (
    <MenuProvider>
      <SocketProvider>
        <SocketBootstrap />
        {!hideLayout && (
          <div className={isUserLiveChat ? "pointer-events-none select-none" : undefined}>
            <Header />
          </div>
        )}
        {children}
        {!hideFooter && (pathname === "/" ? <SiteFooterLight /> : <SiteFooterLight footers={[]} />)}

      </SocketProvider>
    </MenuProvider>
  );
}

