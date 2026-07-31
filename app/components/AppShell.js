"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import MenuProvider from "./MenuProvider";
import { SocketProvider } from "../context/SocketContext";
import { useEffect, memo } from "react";
import NavigationPerformance from "./NavigationPerformance";
import SocketBootstrap from "./SocketBootstrap";

const Header = dynamic(() => import("./Header"), {
  ssr: true,
  loading: () => <div className="fixed inset-x-0 top-0 z-40 h-[72px] bg-white/95 backdrop-blur-sm" />,
});

const SiteFooterLight = dynamic(() => import("./SiteFooterLight"), {
  ssr: false,
  loading: () => null,
});

const NotificationProvider = dynamic(() => import("./NotificationProvider"), {
  ssr: false,
  loading: () => null,
});

function AppShellInner({ children }) {
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
    <>
      <NavigationPerformance />
      <SocketBootstrap />
      <NotificationProvider />
      {!hideLayout && (
        <div className={isUserLiveChat ? "pointer-events-none select-none" : undefined}>
          <Header />
        </div>
      )}
      {children}
      {!hideFooter && (
        <SiteFooterLight
          showAppDownload={pathname !== "/"}
          mobileBottomPad={pathname === "/"}
        />
      )}
    </>
  );
}

const MemoAppShellInner = memo(AppShellInner);

export default function AppShell({ children }) {
  return (
    <MenuProvider>
      <SocketProvider>
        <MemoAppShellInner>{children}</MemoAppShellInner>
      </SocketProvider>
    </MenuProvider>
  );
}
