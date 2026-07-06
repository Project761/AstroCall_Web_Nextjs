"use client";

import { Suspense } from "react";
import ChatUI from "@/app/components/chat/ChatUI";

export default function AstroChatSessionClient() {
  return (
    <Suspense fallback={null}>
      <ChatUI role="astrologer" layoutMode="page" />
    </Suspense>
  );
}
