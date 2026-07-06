"use client";

import { PanelPageHeader, PanelCard } from "@/app/components/AstrologerPanelUi";
import { FaComments } from "react-icons/fa";

export default function AstroChatPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="Live Chat"
        breadcrumbs={["Dashboard", "Chat"]}
        description="Accept and manage live chat consultation requests."
      />
      <PanelCard>
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <FaComments className="text-2xl text-[#FF5C00]" />
          </div>
          <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Chat widget is active</h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            Incoming chat and call requests appear in the floating widget at the bottom-right corner while you are online.
          </p>
        </div>
      </PanelCard>
    </div>
  );
}
