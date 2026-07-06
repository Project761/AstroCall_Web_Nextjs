"use client";

import { Suspense } from "react";
import ChatUI from "@/app/components/chat/ChatUI";

export default function UserChatPage() {
    return (
        <Suspense fallback={null}>
            <ChatUI role="user" layoutMode="page" />
        </Suspense>
    );
}
