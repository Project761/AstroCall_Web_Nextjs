"use client";

import { useRouter } from "next/navigation";
import { IoMdChatboxes, IoMdVideocam } from "react-icons/io";
import { MdPhoneInTalk, MdEventNote } from "react-icons/md";
import { ORANGE } from "@/app/lib/siteTheme";

export default function StickyMobileBar() {
  const router = useRouter();
  const actions = [
    { label: "Chat Now", icon: IoMdChatboxes, href: "/chat-to-astrologers" },
    { label: "Call Now", icon: MdPhoneInTalk, href: "/talk-to-astrologers" },
    { label: "Video Call", icon: IoMdVideocam, href: "/talk-to-astrologers" },
    { label: "Book", icon: MdEventNote, href: "/online-puja" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t lg:hidden"
      style={{ backgroundColor: ORANGE, borderColor: "rgba(255,255,255,0.2)" }}
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-4 divide-x divide-white/20">
        {actions.map((a) => (
          <button key={a.label} type="button" onClick={() => router.push(a.href)} className="flex cursor-pointer flex-col items-center py-2.5 text-white active:opacity-80">
            <a.icon className="text-base" />
            <span className="mt-0.5 text-[9px] font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
