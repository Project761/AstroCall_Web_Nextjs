"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";
import PageHero from "@/app/components/PageHero";
import { AddDeleteUpadate } from "@/app/utils/api";
import { ORANGE, CREAM, CREAM_ALT } from "@/app/lib/siteTheme";

const INQUIRY_TYPES = [
  "Account Related Issue",
  "Technical Issue",
  "Refund Request",
  "Other Query",
  "Feedback/Suggestion",
];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const EMPTY_FORM = {
  UserId: "0",
  Name: "",
  EmailID: "",
  InquiryRelated: "",
  InquiryMessage: "",
  MobileNo: "",
  city: "",
  IsComplete: "",
  CreatedTime: "",
  SolvedbyID: "",
  SolvedBy: "",
  Comments: "",
  CreatedByUser: "",
};

const EMPTY_ERRORS = {
  Name: "",
  MobileNo: "",
  InquiryMessage: "",
  userCaptcha: "",
  InquiryRelated: "",
  city: "",
  EmailID: "",
};

function ContactInfoCard({ icon: Icon, title, value, href }) {
  return (
    <div className="flex gap-3 rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: CREAM_ALT, color: ORANGE }}
      >
        <Icon size={16} />
      </span>
      <div>
        <p className="font-body text-xs font-medium text-gray-400">{title}</p>
        {href ? (
          <a href={href} className="font-heading text-sm font-semibold text-[#1A1A1A] hover:text-[#FF5C00]">
            {value}
          </a>
        ) : (
          <p className="font-heading text-sm font-semibold text-[#1A1A1A]">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function ContactClient() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateCaptcha = useCallback(() => {
    setCaptcha(String(Math.floor(100000 + Math.random() * 900000)));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("UserLoginId") || "0";
    setForm((prev) => ({ ...prev, UserId: userId }));
    generateCaptcha();
  }, [generateCaptcha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, MobileNo: numericValue }));
    setErrors((prev) => ({ ...prev, MobileNo: "" }));
  };

  const resetForm = () => {
    const userId = localStorage.getItem("UserLoginId") || "0";
    setForm({ ...EMPTY_FORM, UserId: userId });
    setUserCaptcha("");
    setErrors(EMPTY_ERRORS);
    generateCaptcha();
  };

  const validate = () => {
    const nextErrors = { ...EMPTY_ERRORS };

    if (!form.Name.trim()) nextErrors.Name = "Required *";
    if (!form.MobileNo.trim()) nextErrors.MobileNo = "Required *";
    else if (form.MobileNo.length !== 10) nextErrors.MobileNo = "Enter valid 10-digit number *";
    if (!form.InquiryMessage.trim()) nextErrors.InquiryMessage = "Required *";
    if (!form.InquiryRelated) nextErrors.InquiryRelated = "Required *";
    if (!form.city.trim()) nextErrors.city = "Required *";
    if (!form.EmailID.trim()) nextErrors.EmailID = "Email is required *";
    else if (!EMAIL_REGEX.test(form.EmailID)) nextErrors.EmailID = "Invalid email address *";
    if (!userCaptcha.trim()) nextErrors.userCaptcha = "Required *";
    else if (userCaptcha !== captcha) nextErrors.userCaptcha = "Incorrect captcha *";

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      generateCaptcha();
      setUserCaptcha("");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await AddDeleteUpadate("Inquiry/Insert_Inquiry", form);
      if (res) {
        resetForm();
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "font-body w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/15";

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <PageHero
        badge="Get In Touch"
        title="Contact Us"
        subtitle="We're Here to Help You"
        description="Have a question about consultations, payments, or your account? Send us a message and our support team will respond as soon as possible."
      />

      <section className="pb-16 pt-2">
        <div className="main-container">
          {/* Quick contact cards */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactInfoCard icon={FaPhoneAlt} title="Call Support" value="+91 98765 43210" href="tel:+919876543210" />
            <ContactInfoCard icon={FaEnvelope} title="Email Us" value="support@astrocall.live" href="mailto:support@astrocall.live" />
            <ContactInfoCard icon={FaClock} title="Available" value="24×7 Support" />
            <ContactInfoCard icon={FaMapMarkerAlt} title="Location" value="Jaipur, India — Pan India Service" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_4px_24px_rgba(255,92,0,0.06)]">
              <div className="border-b border-orange-100 px-5 py-4">
                <h2 className="font-heading flex items-center gap-2 text-lg font-bold text-[#1A1A1A]">
                  <FaMapMarkerAlt style={{ color: ORANGE }} />
                  Our Office
                </h2>
                <p className="font-body mt-1 text-sm text-gray-500">Visit or locate us on the map</p>
              </div>
              <div className="h-[280px] sm:h-[360px] lg:h-[520px]">
                <iframe
                  title="AstroCall Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.242210763573!2d75.7646497!3d26.8542064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5a7b7997f83%3A0xf88bcefb941c6d4f!2sAstroCall!5e0!3m2!1sen!2sin!4v1721706027369!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-[0_4px_24px_rgba(255,92,0,0.06)] sm:p-7 lg:p-8">
              <div className="mb-6 flex items-start gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  <FaHeadset size={18} />
                </span>
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">Send Us a Message</h2>
                  <p className="font-body mt-1 text-sm text-gray-500">Fill in the form and we&apos;ll get back to you soon.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="font-body mb-1.5 block text-xs font-semibold text-gray-600">Full Name *</label>
                    <input
                      type="text"
                      name="Name"
                      value={form.Name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass}
                    />
                    {errors.Name && <p className="mt-1 text-xs text-red-500">{errors.Name}</p>}
                  </div>
                  <div>
                    <label className="font-body mb-1.5 block text-xs font-semibold text-gray-600">Email *</label>
                    <input
                      type="email"
                      name="EmailID"
                      value={form.EmailID}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={inputClass}
                    />
                    {errors.EmailID && <p className="mt-1 text-xs text-red-500">{errors.EmailID}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="font-body mb-1.5 block text-xs font-semibold text-gray-600">Phone *</label>
                    <input
                      type="tel"
                      name="MobileNo"
                      value={form.MobileNo}
                      onChange={handlePhoneChange}
                      placeholder="10-digit phone number"
                      className={inputClass}
                    />
                    {errors.MobileNo && <p className="mt-1 text-xs text-red-500">{errors.MobileNo}</p>}
                  </div>
                  <div>
                    <label className="font-body mb-1.5 block text-xs font-semibold text-gray-600">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className={inputClass}
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="font-body mb-1.5 block text-xs font-semibold text-gray-600">Inquiry Type *</label>
                  <select
                    name="InquiryRelated"
                    value={form.InquiryRelated}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled>
                      -- Select Inquiry Type --
                    </option>
                    {INQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.InquiryRelated && <p className="mt-1 text-xs text-red-500">{errors.InquiryRelated}</p>}
                </div>

                <div>
                  <label className="font-body mb-1.5 block text-xs font-semibold text-gray-600">Your Message *</label>
                  <textarea
                    name="InquiryMessage"
                    value={form.InquiryMessage}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write your message..."
                    className={`${inputClass} resize-none`}
                  />
                  {errors.InquiryMessage && <p className="mt-1 text-xs text-red-500">{errors.InquiryMessage}</p>}
                </div>

                <div className="rounded-xl border border-orange-100 p-4" style={{ backgroundColor: CREAM_ALT }}>
                  <label className="font-body mb-2 block text-xs font-semibold text-gray-700">Captcha Verification *</label>
                  <div className="font-heading mb-3 rounded-xl border-2 border-orange-100 bg-white py-3 text-center text-2xl font-bold tracking-[0.3em] text-[#1A1A1A]">
                    {captcha}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={userCaptcha}
                    onChange={(e) => {
                      setUserCaptcha(e.target.value);
                      setErrors((prev) => ({ ...prev, userCaptcha: "" }));
                    }}
                    placeholder="Enter the captcha above"
                    className={inputClass}
                  />
                  {errors.userCaptcha && <p className="mt-1 text-xs text-red-500">{errors.userCaptcha}</p>}
                  <button
                    type="button"
                    onClick={() => {
                      generateCaptcha();
                      setUserCaptcha("");
                    }}
                    className="font-body mt-2 text-xs font-semibold transition hover:underline"
                    style={{ color: ORANGE }}
                  >
                    Reload Captcha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-heading w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                  style={{ backgroundColor: ORANGE }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Message"}
                </button>

                <p className="font-body text-center text-xs text-gray-400">
                  Need quick help? Visit our{" "}
                  <Link href="/support" className="font-semibold hover:underline" style={{ color: ORANGE }}>
                    Support Center
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Success modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
              aria-label="Close"
            >
              ×
            </button>

            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <FaCheckCircle className="text-2xl text-green-500" />
              </span>
              <h2 id="contact-success-title" className="font-heading text-xl font-bold text-[#1A1A1A] sm:text-2xl">
                Thank you for contacting us!
              </h2>
              <p className="font-body mt-2 text-sm text-gray-600">
                Your message has been received. We&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="font-heading mt-6 rounded-xl bg-[#1A1A1A] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
