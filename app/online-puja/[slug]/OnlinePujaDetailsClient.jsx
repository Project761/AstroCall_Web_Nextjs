"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaChevronRight, FaStar, FaCheck, FaClock, FaLandmark,
  FaVideo, FaGift, FaCertificate, FaUsers, FaOm, FaHeadset,
  FaShieldAlt, FaTruck, FaPrayingHands, FaCalendarAlt, FaCreditCard,
} from "react-icons/fa";
import { sanitizeHtml } from "@/app/lib/sanitizeHtml";
import { getPostData } from "../../utils/api.js";
import AuthModal from "../../components/AuthModal";
import PageBanner from "@/app/components/PageBanner";
import { PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";

const ORANGE = "#FF5C00";
const CREAM = "#FFF9F1";

const TABS = ["About Puja", "Benefits", "What's Included", "How It Works", "FAQs"];

const INCLUDED = [
  "Authentic Vedic rituals performed by verified pandits",
  "Live streaming of the entire puja ceremony",
  "Puja photo & digital certificate after completion",
  "Blessed prasad delivered to your doorstep",
  "Personal sankalp in your name and gotra",
  "Dedicated customer support throughout",
];

const HOW_STEPS = [
  { icon: FaOm, title: "Choose Puja Plan", sub: "Select the puja package that suits your needs" },
  { icon: FaCalendarAlt, title: "Provide Details", sub: "Share your name, gotra and sankalp details" },
  { icon: FaCreditCard, title: "Secure Payment", sub: "Pay safely via multiple payment options" },
  { icon: FaPrayingHands, title: "Puja Performed", sub: "Expert pandits perform rituals at holy temple" },
  { icon: FaGift, title: "Certificate & Prasad", sub: "Receive certificate and prasad at home" },
];

const TRUST_FOOTER = [
  { icon: FaOm, t1: "100% Authentic Vedic Puja", t2: "As per scriptures" },
  { icon: FaUsers, t1: "Verified Pandits", t2: "Experienced priests" },
  { icon: FaVideo, t1: "Live Puja Streaming", t2: "Watch from anywhere" },
  { icon: FaShieldAlt, t1: "Secure Payments", t2: "100% safe checkout" },
  { icon: FaTruck, t1: "Prasad Delivery", t2: "At your doorstep" },
];

const FEATURES = [
  { icon: FaUsers, text: "Experienced Pandits" },
  { icon: FaCertificate, text: "20+ Years of Experience" },
  { icon: FaOm, text: "Effective Vedic Solutions" },
  { icon: FaPrayingHands, text: "Thousands of Pujas Performed" },
];

const FAQS = [
  { q: "How does an online puja work?", a: "Our verified pandits perform the puja at a holy temple on your behalf. You can watch it live and receive prasad at home." },
  { q: "Is online puja as effective as attending in person?", a: "Yes, when performed with proper sankalp in your name by experienced pandits, online puja is equally effective." },
  { q: "Will I receive prasad after the puja?", a: "Yes, blessed prasad is delivered to your registered address after the ceremony." },
  { q: "Can I watch the puja live?", a: "Absolutely. You receive a live streaming link to watch the entire ritual." },
];

const getSlug = (item) =>
  item?.PujaName?.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") || "";

const calcDiscount = (current, original) => {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
};

export default function OnlinePujaDetailsClient({ initialPujaRows = null }) {
  const UserLoginId = typeof window !== "undefined" ? localStorage.getItem("UserLoginId") || "" : "";
  const { slug } = useParams();
  const router = useRouter();

  const [selectedPuja, setSelectedPuja] = useState(initialPujaRows || []);
  const [allPujas, setAllPujas] = useState([]);
  const [loading, setLoading] = useState(!initialPujaRows);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [activeTab, setActiveTab] = useState("About Puja");
  const [openFaq, setOpenFaq] = useState(null);

  const mainPuja = useMemo(
    () => selectedPuja?.find((item) => item?.PujaName) || selectedPuja?.[0] || null,
    [selectedPuja]
  );

  const GetsinglaData_Puja = useCallback(async (pujaSlug) => {
    setLoading(true);
    const val = {
      PujaID: "0",
      PujaName: pujaSlug?.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ").trim(),
    };
    try {
      const res = await getPostData("Puja/GetsinglaData_Puja", val);
      if (res) setSelectedPuja(res);
    } catch (error) {
      if (error?.response?.status == 400 && error?.response?.data?.Message === "No Data Available") {
        const res = await getPostData("Puja/GetData_Puja", { IsActive: "1" });
        if (res) {
          const filtered = res?.find((item) => item?.PujaName);
          setSelectedPuja(filtered ? [filtered] : []);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      if (slug && typeof slug === "string" && !initialPujaRows) await GetsinglaData_Puja(slug);
      await getPostData("Puja/GetData_Puja", { IsActive: "1" })
        .then((res) => { if (res) setAllPujas(Array.isArray(res) ? res : res.data || []); })
        .catch(console.error);
    })();
  }, [slug, initialPujaRows, GetsinglaData_Puja]);

  const relatedPujas = useMemo(
    () => allPujas.filter((p) => p.PujaID !== mainPuja?.PujaID && p.PujaName).slice(0, 4),
    [allPujas, mainPuja]
  );

  const handleBookNow = (item) => {
    const pujaSlug = getSlug(item);
    router.push(`/online-puja/${pujaSlug}/OnlinepujaPlansDetails`);
  };

  const onBookClick = (item) => {
    if (UserLoginId?.length > 0) handleBookNow(item);
    else { setIsAuthModalOpen(true); setAuthMode("login"); }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200" style={{ borderTopColor: ORANGE }} />
      </div>
    );
  }

  if (!mainPuja) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pt-20">
        <div className="text-center">
          <p className="text-gray-500">No puja details available.</p>
          <button type="button" onClick={() => router.push("/online-puja")} className="mt-4 text-sm font-semibold text-[#FF5C00] hover:underline">Back to Puja Services</button>
        </div>
      </div>
    );
  }

  const item = mainPuja;
  const discount = calcDiscount(item.Amt, item.CurrentAmt);
  const rating = item.Rating || 5;

  return (
    <div className="min-h-screen bg-white pt-[72px] pb-8">
      {/* <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.puja}
        currentPage={item.PujaName}
        crumbs={[{ label: "Online Puja", href: "/online-puja" }]}
        title={item.PujaName}
        subtitle={item.ShortDescription || "Authentic Vedic puja performed by experienced pandits for peace and prosperity."}
        titleClassName="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl md:text-3xl"
      /> */}
      <div className="main-container px-4 py-4">

        {/* Top section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
              <img
                src={item.PujaImage ? `https://${item.PujaImage.replace(/\\/g, "/")}` : "/default-image.jpg"}
                alt={item.PujaName}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = "/default-image.jpg"; }}
              />
              <span className="absolute left-3 top-3 rounded-md bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-white">Popular</span>
              <span className="absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: ORANGE }}>Live Puja</span>
            </div>
          </div>

          <div>
            {item.PujaFor && (
              <span className="inline-block rounded-md bg-orange-50 px-3 py-1 text-xs font-semibold text-[#FF5C00]">{item.PujaFor}</span>
            )}
            <h1 className="mt-2 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">{item.PujaName}</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.ShortDescription || "Authentic Vedic puja performed by experienced pandits for peace and prosperity."}</p>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-[#FF5C00]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} size={12} className={i < rating ? "" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.8 (2.6K Reviews)</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><FaClock size={11} className="text-[#FF5C00]" /> 3 - 4 Hours</span>
              <span className="flex items-center gap-1"><FaLandmark size={11} className="text-[#FF5C00]" /> At Temple</span>
              <span className="flex items-center gap-1"><FaVideo size={11} className="text-[#FF5C00]" /> Live Streaming</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-2xl font-extrabold text-[#FF5C00]">₹{(item.Amt || 0).toLocaleString()}</span>
              {item.CurrentAmt && item.CurrentAmt > item.Amt && (
                <span className="text-base text-gray-400 line-through">₹{item.CurrentAmt.toLocaleString()}</span>
              )}
              {discount > 0 && <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-600">{discount}% OFF</span>}
              <p className="w-full text-[11px] text-gray-400">One Time · Inclusive of all rituals</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onBookClick(item)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white sm:flex-none sm:px-10"
                style={{ backgroundColor: ORANGE }}
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={() => router.push("/talk-to-astrologers")}
                className="flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-bold text-[#FF5C00]"
                style={{ borderColor: ORANGE }}
              >
                <FaHeadset size={14} /> Talk to Expert
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-[10px] text-gray-500">
              {[{ icon: FaVideo, t: "Live Puja" }, { icon: FaCertificate, t: "Puja Certificate" }, { icon: FaTruck, t: "Free Prasad Delivery" }, { icon: FaShieldAlt, t: "Secure Payment" }].map(({ icon: Icon, t }) => (
                <span key={t} className="flex items-center gap-1"><Icon size={10} className="text-[#FF5C00]" /> {t}</span>
              ))}
            </div>

            <ul className="mt-5 space-y-2">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 rounded-lg bg-orange-50/60 px-3 py-2 text-xs font-medium text-gray-700">
                  <Icon size={12} className="text-[#FF5C00]" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-x-auto border-b border-gray-100">
              <div className="flex gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${activeTab === tab ? "border-[#FF5C00] text-[#FF5C00]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              {activeTab === "About Puja" && (
                <div
                  className="prose prose-sm max-w-none leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.PujaDescription || item.ShortDescription || "") }}
                />
              )}
              {activeTab === "Benefits" && (
                item.Benefits?.length > 0 ? (
                  <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.Benefits) }} />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {["Brings peace and positive energy", "Removes obstacles and negativity", "Attracts prosperity and success", "Strengthens spiritual connection", "Blesses family with harmony", "Fulfills specific sankalp desires"].map((b) => (
                      <div key={b} className="flex items-start gap-2 rounded-xl border border-gray-100 p-3">
                        <FaCheck className="mt-0.5 shrink-0 text-green-500" size={12} />
                        <p className="text-sm text-gray-600">{b}</p>
                      </div>
                    ))}
                  </div>
                )
              )}
              {activeTab === "What's Included" && (
                <ul className="space-y-3">
                  {INCLUDED.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-gray-600">
                      <FaCheck className="mt-0.5 shrink-0 text-green-500" size={12} /> {inc}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "How It Works" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {HOW_STEPS.map(({ icon: Icon, title, sub }) => (
                    <div key={title} className="rounded-xl border border-gray-100 p-4 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ backgroundColor: ORANGE }}>
                        <Icon size={18} />
                      </div>
                      <p className="mt-2 text-sm font-bold text-[#0F172A]">{title}</p>
                      <p className="mt-1 text-xs text-gray-500">{sub}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "FAQs" && (
                <div className="space-y-3">
                  {FAQS.map((f, i) => (
                    <div key={f.q} className="rounded-xl border border-gray-100">
                      <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-[#0F172A]">
                        {f.q}
                        <FaChevronRight size={12} className={`transition ${openFaq === i ? "rotate-90" : ""}`} />
                      </button>
                      {openFaq === i && <p className="border-t border-gray-50 px-4 pb-4 pt-2 text-sm text-gray-600">{f.a}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How it works strip */}
            <section className="mt-8 rounded-2xl p-5 sm:p-6" style={{ backgroundColor: CREAM }}>
              <h2 className="text-center text-lg font-bold text-[#0F172A]">How It Works?</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {HOW_STEPS.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ backgroundColor: ORANGE }}>
                      <Icon size={16} />
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#0F172A]">{title}</p>
                    <p className="text-[10px] text-gray-500">{sub}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Need Help Choosing?</h3>
              <p className="mt-1 text-xs text-gray-500">Our experts will guide you to the right puja for your needs.</p>
              <button type="button" onClick={() => router.push("/chat-to-astrologers")} className="mt-3 w-full rounded-lg py-2.5 text-xs font-bold text-white" style={{ backgroundColor: ORANGE }}>
                Chat with Expert
              </button>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A]">You May Also Like</h3>
              <ul className="mt-3 space-y-3">
                {relatedPujas.map((p) => (
                  <li key={p.PujaID}>
                    <button type="button" onClick={() => router.push(`/online-puja/${getSlug(p)}`)} className="flex w-full gap-3 text-left">
                      <img src={p.PujaImage ? `https://${p.PujaImage.replace(/\\/g, "/")}` : "/default-image.jpg"} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] line-clamp-1">{p.PujaName}</p>
                        <p className="text-xs font-bold text-[#FF5C00]">₹{(p.Amt || 0).toLocaleString()}</p>
                        <div className="flex text-[#FF5C00]">{Array.from({ length: 5 }).map((_, i) => <FaStar key={i} size={8} />)}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => router.push("/online-puja")} className="mt-3 text-xs font-semibold text-[#FF5C00] hover:underline">
                View All Pujas →
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="mt-8 py-8" style={{ backgroundColor: ORANGE }}>
        <div className="main-container flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-xl font-bold text-white">Ready to Book {item.PujaName}?</h2>
            <p className="mt-1 text-sm text-white/80">Secure your slot now and receive blessings from verified pandits.</p>
          </div>
          <button type="button" onClick={() => onBookClick(item)} className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-bold text-[#FF5C00]">
            Book Now →
          </button>
        </div>
      </section>

      {/* Trust footer */}
      <section className="border-t border-orange-50 bg-[#FFF9F1] py-6">
        <div className="main-container grid grid-cols-2 gap-4 px-4 md:grid-cols-5">
          {TRUST_FOOTER.map(({ icon: Icon, t1, t2 }) => (
            <div key={t1} className="flex items-start gap-2">
              <Icon size={16} className="mt-0.5 shrink-0 text-[#FF5C00]" />
              <div><p className="text-[11px] font-bold text-[#0F172A]">{t1}</p><p className="text-[10px] text-gray-500">{t2}</p></div>
            </div>
          ))}
        </div>
      </section>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onLoginSuccess={() => {
            setIsAuthModalOpen(false);
            const newId = localStorage.getItem("UserLoginId") || "";
            if (newId) handleBookNow(mainPuja);
          }}
        />
      )}
    </div>
  );
}
