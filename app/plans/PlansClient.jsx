"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaBolt,
  FaShieldAlt,
  FaTag,
  FaCalendarCheck,
  FaCheck,
  FaPlus,
  FaMinus,
  FaComments,
  FaPhone,
  FaVideo,
  FaRobot,
  FaHandPaper,
  FaOm,
  FaFileInvoice,
  FaHeadset,
  FaWallet,
  FaCreditCard,
  FaUniversity,
} from "react-icons/fa";
import { MdLocalOffer, MdInfoOutline } from "react-icons/md";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../utils/api.js";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { ORANGE, CREAM, CREAM_ALT, PEACH, PAGE_BANNER_IMAGES } from "@/app/lib/siteTheme";
import PageBanner from "@/app/components/PageBanner";

const TRUST_ITEMS = [
  { icon: FaBolt, label: "Instant Credit" },
  { icon: FaShieldAlt, label: "Secure Payments" },
  { icon: FaTag, label: "No Hidden Charges" },
  { icon: FaCalendarCheck, label: "Valid Forever" },
];

const BENEFITS = [
  { icon: FaWallet, title: "Use Anywhere", text: "Chat, call, puja & more" },
  { icon: FaCalendarCheck, title: "Wallet Never Expires", text: "Use balance anytime" },
  { icon: FaBolt, title: "Instant Activation", text: "Credit added immediately" },
  { icon: FaShieldAlt, title: "Secure Payment", text: "100% encrypted checkout" },
  { icon: FaFileInvoice, title: "GST Invoice", text: "Download after recharge" },
  { icon: FaHeadset, title: "24×7 Support", text: "Help whenever you need" },
];

const STEPS = [
  { n: 1, title: "Select a Package", text: "Pick the recharge amount that suits you" },
  { n: 2, title: "Complete Payment", text: "Pay securely via UPI, cards or net banking" },
  { n: 3, title: "Get Instant Credit", text: "Wallet credited with bonus instantly" },
  { n: 4, title: "Use for Any Service", text: "Consult astrologers or book puja" },
];

const PAYMENTS = ["UPI", "Google Pay", "PhonePe", "Paytm", "Debit/Credit Cards", "Net Banking", "Wallets"];

const FAQS = [
  {
    q: "Can my wallet balance expire?",
    a: "No. Your AstroCall wallet balance never expires. Recharge once and use it whenever you need consultations or services.",
  },
  {
    q: "Can I use wallet for Chat, Call and Video?",
    a: "Yes. Your wallet balance can be used for chat, voice call, video call, AI astrologer, palm reading, tarot, puja booking and more.",
  },
  {
    q: "Are recharges refundable?",
    a: "Wallet recharges are generally non-refundable once credited. Please review our refund policy for exceptional cases.",
  },
  {
    q: "Do bonuses apply automatically?",
    a: "Yes. Bonus amounts are automatically added to your wallet credit immediately after a successful recharge.",
  },
  {
    q: "Is GST included in the package price?",
    a: "Applicable taxes are calculated at checkout. You can download a GST invoice after successful payment.",
  },
  {
    q: "Which payment methods are supported?",
    a: "We support UPI, Google Pay, PhonePe, Paytm, debit/credit cards, net banking and popular wallets.",
  },
];

function getFeatures(amount) {
  const n = Number(amount);
  if (n >= 1999) return ["Chat", "Call", "Video Call", "AI Astrologer", "Palm Reading", "Puja Booking", "Reports"];
  if (n >= 999) return ["Chat", "Call", "Video Call", "AI Astrologer", "Puja Booking", "Reports"];
  if (n >= 499) return ["Chat", "Call", "Video Call", "AI Astrologer", "Puja Booking"];
  if (n >= 199) return ["Chat", "Call", "Video Call", "AI Astrologer"];
  return ["Chat"];
}

function featureIcon(label) {
  if (label.includes("Chat")) return FaComments;
  if (label.includes("Call") && !label.includes("Video")) return FaPhone;
  if (label.includes("Video")) return FaVideo;
  if (label.includes("AI")) return FaRobot;
  if (label.includes("Palm")) return FaHandPaper;
  if (label.includes("Puja")) return FaOm;
  return FaCheck;
}

function PlanCard({ item, isPopular, onSelect }) {
  const payAmount = Number(item?.PackageAmt || 0);
  const bonus = Number(item?.BonusAmt || 0);
  const walletCredit = payAmount + bonus;
  const features = getFeatures(payAmount);

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isPopular ? "border-[#FF5C00] shadow-[0_8px_28px_rgba(255,92,0,0.15)]" : "border-orange-100 shadow-sm"
        }`}
    >
      {isPopular && (
        <div
          className="absolute left-0 right-0 top-0 py-1.5 text-center text-[10px] font-extrabold uppercase tracking-wider text-white sm:text-xs"
          style={{ backgroundColor: ORANGE }}
        >
          Most Popular
        </div>
      )}

      <div className={`flex flex-1 flex-col p-4 sm:p-5 ${isPopular ? "pt-9" : ""}`}>
        <p className="text-center text-2xl font-extrabold text-[#1A1A1A] sm:text-3xl">₹{payAmount}</p>
        <p className="mt-0.5 text-center text-[11px] font-medium text-gray-400 sm:text-xs">Recharge Package</p>

        <div className="mt-4 space-y-2">
          <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: CREAM_ALT }}>
            <p className="text-[10px] font-semibold text-gray-500 sm:text-xs">Wallet Credit</p>
            <p className="text-lg font-extrabold sm:text-xl" style={{ color: ORANGE }}>
              ₹{walletCredit}
            </p>
          </div>
          <div className="rounded-xl bg-green-50 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-500 sm:text-xs">Bonus</p>
            <p className="text-lg font-extrabold text-green-600 sm:text-xl">₹{bonus}</p>
          </div>
        </div>

        <ul className="mt-4 flex-1 space-y-2">
          {features.map((f) => {
            const Icon = featureIcon(f);
            return (
              <li key={f} className="flex items-center gap-2 text-[11px] text-gray-600 sm:text-xs">
                <Icon className="shrink-0 text-sm" style={{ color: ORANGE }} />
                {f}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onSelect}
          className={`mt-4 w-full rounded-xl py-2.5 text-xs font-bold transition active:scale-[0.98] sm:text-sm ${isPopular ? "text-white shadow-md hover:opacity-90" : "border-2 bg-white hover:bg-orange-50"
            }`}
          style={
            isPopular
              ? { backgroundColor: ORANGE }
              : { borderColor: ORANGE, color: ORANGE }
          }
        >
          Recharge Now
        </button>
      </div>
    </div>
  );
}

export default function PlansClient() {
  const router = useRouter();
  const { Get_SingleData_User, PlanSuccessPopup, setPlanSuccessPopup } = useMenuContext();
  const [plansdata, setplansdata] = useState();
  const [openFaq, setOpenFaq] = useState(null);

  const Get_Data_WalletPackage = useCallback(async () => {
    const val = { IsActive: "1" };
    try {
      const res = await postWithToken("WalletPackage/GetData_WalletPackage", val);
      if (res) {
        const sorted = res
          ?.filter((data) => data?.PackageAmt)
          ?.sort((a, b) => Number(a.PackageAmt) - Number(b.PackageAmt));
        setplansdata(sorted);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => { Get_Data_WalletPackage(); });
  }, [Get_Data_WalletPackage]);

  useEffect(() => {
    const checkPhonePePaymentStatus = async () => {
      const orderId =
        typeof window !== "undefined" && sessionStorage.getItem("MerchantIdPlans");
      if (orderId) {
        try {
          const val = { MerchantOrderId: orderId };
          const res = await TokenWithDeleteUpadateAdd("PhonePay/OrderStatus", val);
          if (res?.state === "COMPLETED") {
            sessionStorage.removeItem("MerchantIdPlans");
            Get_SingleData_User(localStorage.getItem("UserLoginId"));
            setPlanSuccessPopup(true);
          }
        } catch (err) {
          console.error("Failed to check PhonePe status", err);
        }
      }
    };
    checkPhonePePaymentStatus();
  }, [Get_SingleData_User, setPlanSuccessPopup]);

  const popularId = useMemo(() => {
    if (!plansdata?.length) return null;
    const exact = plansdata.find((p) => Number(p.PackageAmt) === 499);
    if (exact) return exact.WalletPackageID;
    const withBonus = plansdata.filter((p) => Number(p.BonusAmt) > 0);
    if (withBonus.length) {
      return withBonus.reduce((a, b) =>
        Number(b.BonusAmt) > Number(a.BonusAmt) ? b : a
      ).WalletPackageID;
    }
    return plansdata[Math.floor(plansdata.length / 2)]?.WalletPackageID;
  }, [plansdata]);

  const handleSelectPlan = (item) => {
    sessionStorage.setItem("WalletPackageID", item?.WalletPackageID);
    router.push(`/plans/recharge-${item?.PackageAmt}`);
  };

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      <PageBanner
        bannerSrc={PAGE_BANNER_IMAGES.plans}
        currentPage="Packages"
        title={
          <>
            Recharge Your <span className="text-[#FF5C00]">Astro Wallet</span>
          </>
        }
        subtitle="Recharge your wallet and use the balance for Chat, Call, Video Call, AI Astrologer, Palm Reading, Tarot, Puja and more."
      >
        <div className="mt-4 flex flex-wrap gap-4 sm:mt-5 sm:gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="text-base text-[#FF5C00]" />
              <span className="text-xs font-semibold text-gray-700 sm:text-sm">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3 rounded-xl px-1 py-1 sm:mt-5">
          <MdInfoOutline className="mt-0.5 shrink-0 text-lg text-[#FF5C00]" />
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
            Astrologer rates vary by experience. Your wallet balance is deducted per minute
            for chat/call services. Recharge once and use across all services.
          </p>
        </div>
      </PageBanner>

      {/* Packages */}
      <section className="main-container px-4 py-8 sm:py-10 md:py-12">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="font-serif text-xl font-extrabold text-[#1A1A1A] sm:text-2xl md:text-3xl">
            Choose a <span style={{ color: ORANGE }}>Recharge Package</span>
          </h2>
          <div
            className="mx-auto mt-2 h-0.5 w-20 rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }}
          />
        </div>

        {plansdata === undefined ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/80" />
            ))}
          </div>
        ) : plansdata?.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
            {plansdata.map((item, index) => (
              <PlanCard
                key={item?.WalletPackageID ?? index}
                item={item}
                isPopular={item?.WalletPackageID === popularId}
                onSelect={() => handleSelectPlan(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 text-center">
            <MdLocalOffer className="text-4xl text-orange-300" />
            <p className="mt-3 font-medium text-gray-500">No recharge plans available right now.</p>
          </div>
        )}
      </section>

      {/* Benefits + How it works */}
      <section className="border-y border-orange-100 bg-white py-8 sm:py-10 md:py-12">
        <div className="main-container px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2 className="font-serif text-xl font-extrabold text-[#1A1A1A] sm:text-2xl">
                Recharge <span style={{ color: ORANGE }}>Benefits</span>
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-orange-50 bg-[#FFFCFA] p-3 sm:p-4"
                  >
                    <div
                      className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-white sm:h-10 sm:w-10"
                      style={{ backgroundColor: ORANGE }}
                    >
                      <Icon size={16} />
                    </div>
                    <p className="text-xs font-bold text-[#1A1A1A] sm:text-sm">{title}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl border border-orange-100 p-5 sm:p-6"
              style={{ background: `linear-gradient(135deg, ${CREAM} 0%, white 100%)` }}
            >
              <h2 className="font-serif text-xl font-extrabold text-[#1A1A1A] sm:text-2xl">
                How It <span style={{ color: ORANGE }}>Works</span>
              </h2>
              <div className="relative mt-5 space-y-4">
                {STEPS.map((step, i) => (
                  <div key={step.n} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white sm:h-9 sm:w-9"
                        style={{ backgroundColor: ORANGE }}
                      >
                        {step.n}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="my-1 h-full w-0.5 flex-1 bg-orange-100" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-bold text-[#1A1A1A]">{step.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment methods */}
      <section className="py-8 sm:py-10" style={{ backgroundColor: CREAM }}>
        <div className="main-container px-4 text-center">
          <h2 className="font-serif text-lg font-extrabold text-[#1A1A1A] sm:text-xl">
            We Accept
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-white px-3 py-1.5 text-[10px] font-semibold text-gray-600 shadow-sm sm:text-xs"
              >
                {(p.includes("Card") || p.includes("Bank")) && (
                  <FaCreditCard className="text-orange-400" />
                )}
                {p.includes("Net") && <FaUniversity className="text-orange-400" />}
                {!p.includes("Card") && !p.includes("Net") && (
                  <FaWallet className="text-orange-400" />
                )}
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-orange-100 bg-white py-8 sm:py-10 md:py-12">
        <div className="main-container px-4">
          <div className="mb-6 text-center">
            <h2 className="font-serif text-xl font-extrabold text-[#1A1A1A] sm:text-2xl md:text-3xl">
              Frequently Asked <span style={{ color: ORANGE }}>Questions</span>
            </h2>
            <div
              className="mx-auto mt-2 h-0.5 w-16 rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }}
            />
          </div>

          <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 md:gap-4">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`overflow-hidden rounded-xl border transition-all ${open ? "border-[#FF5C00] shadow-md" : "border-orange-100"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
                  >
                    <span className="text-xs font-semibold text-[#1A1A1A] sm:text-sm">{faq.q}</span>
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: ORANGE }}
                    >
                      {open ? <FaMinus size={10} /> : <FaPlus size={10} />}
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-orange-50 px-4 pb-4 pt-2 sm:px-5">
                      <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Popup */}
      {PlanSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setPlanSuccessPopup(false)}
              className="absolute right-4 top-4 text-gray-300 transition hover:text-gray-500"
            >
              ✕
            </button>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <FaCheck className="text-2xl text-green-500" />
            </div>
            <h2 className="mb-1 text-xl font-bold text-gray-800">Recharge Successful!</h2>
            <p className="mb-6 text-sm text-gray-500">Your wallet has been credited successfully.</p>
            <button
              type="button"
              onClick={() => setPlanSuccessPopup(false)}
              className="w-full rounded-xl py-3 font-semibold text-white transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: ORANGE }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
