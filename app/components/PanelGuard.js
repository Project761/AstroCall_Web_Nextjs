"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelGuard({ type, children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("UserLoginId");
    const astroId = localStorage.getItem("AstroLoginId");

    if (type === "astrologer") {
      if (!astroId) {
        router.replace("/astrologer-login");
        return;
      }
      setIsAuthorized(true);
      return;
    }

    if (!userId) {
      router.replace("/");
      return;
    }
    setIsAuthorized(true);
  }, [router, type]);

  if (!isAuthorized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return children;
}
