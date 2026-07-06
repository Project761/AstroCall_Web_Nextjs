"use client";

import { Suspense } from "react";
import ConsultationIntakeClient from "@/app/components/consultation/ConsultationIntakeClient";
import { CREAM } from "@/app/lib/siteTheme";

export default function UserChatHome() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: CREAM }}>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-[#FF5C00]" />
        </div>
      }
    >
      <ConsultationIntakeClient variant="chat" />
    </Suspense>
  );
}
