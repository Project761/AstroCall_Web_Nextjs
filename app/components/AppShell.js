"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/page";
import Footer from "./Footer/page";
import MenuProvider from "./MenuProvider";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideLayout =
    pathname.startsWith("/astrologer-login") ||
    pathname.startsWith("/astrologer-panel");

  return (
    <MenuProvider>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer footers={[]} />}
    </MenuProvider>
  );
}

