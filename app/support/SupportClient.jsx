"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaQuestionCircle, FaTicketAlt, FaComments, FaPhone, FaHeadset } from "react-icons/fa";
import { UserPanelPage, PanelCard, PanelLoader, OrangeButton, StatusBadge } from "../components/UserPanelPage";

export default function SupportClient() {
  const router = useRouter();
  const userData = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const loginData = localStorage.getItem("LoginTokenData");
      return loginData ? JSON.parse(loginData) : null;
    } catch {
      return null;
    }
  }, []);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userData) router.push("/");
  }, [userData, router]);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setSubject(""); setMessage(""); setIsSubmitting(false); setShowTicketForm(false);
    }, 1000);
  };

  if (!userData) return <PanelLoader />;

  const helpOptions = [
    { icon: FaQuestionCircle, title: "FAQ", sub: "Browse frequently asked questions", color: "text-blue-500" },
    { icon: FaTicketAlt, title: "Create Support Ticket", sub: "Submit a new support request", color: "text-[#FF5C00]", action: () => setShowTicketForm(true) },
    { icon: FaComments, title: "Live Chat", sub: "Chat with our support team", color: "text-purple-500", badge: "Online" },
    { icon: FaPhone, title: "Call Support", sub: "+91 98765 43210", color: "text-green-500" },
  ];

  return (
    <UserPanelPage title="Support" subtitle="Get help with your account, payments, and consultations">
      <div className="grid gap-3 sm:grid-cols-2">
        {helpOptions.map((opt) => (
          <PanelCard key={opt.title} className="cursor-pointer transition hover:border-orange-200" onClick={opt.action}>
            <div className="flex items-center gap-4">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 ${opt.color}`}><opt.icon /></span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1A1A1A]">{opt.title}</p>
                  {opt.badge && <StatusBadge status="Online" />}
                </div>
                <p className="text-xs text-gray-500">{opt.sub}</p>
              </div>
            </div>
          </PanelCard>
        ))}
      </div>

      {showTicketForm && (
        <PanelCard className="mt-5">
          <h3 className="mb-4 font-bold text-[#1A1A1A]">Create Support Ticket</h3>
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue..." rows={4} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FF5C00]" />
            <OrangeButton type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Ticket"}</OrangeButton>
          </form>
        </PanelCard>
      )}

      <PanelCard className="mt-5">
        <div className="flex items-center gap-3">
          <FaHeadset className="text-[#FF5C00] text-xl" />
          <div>
            <p className="font-bold text-[#1A1A1A]">24x7 Support Available</p>
            <p className="text-xs text-gray-500">Email: support@astrocall.live</p>
          </div>
        </div>
      </PanelCard>
    </UserPanelPage>
  );
}
