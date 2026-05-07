"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosArrowDown } from "../Icons/ArrowDown";
import { GooglePlayButton, AppStoreButton } from "../AppButtons/AppStoreButtons";

export default function Footer({ footers }) {
  const [isFirstHOpen, setIsFirstHOpen] = useState(false);
  const [isSecHOpen, setIsSecHOpen] = useState(false);
  const [isThirdHOpen, setIsThirdHOpen] = useState(false);
  const [isForthHOpen, setIsForthHOpen] = useState(false);
  const [isFifthHOpen, setIsFifthHOpen] = useState(false);
  const [isSixthHOpen, setIsSixthHOpen] = useState(false);
  const [isSeventhHOpen, setIsSeventhHOpen] = useState(false);
  const [isEighthHOpen, setIsEighthHOpen] = useState(false);
  const [isNineHOpen, setIsNineHOpen] = useState(false);
  const [isTenHOpen, setIsTenHOpen] = useState(false);
  const [iseleven, setIseleven] = useState(false);
  const [iseleven2, setIseleven2] = useState(false);

  const toggleFirstHeading = () => setIsFirstHOpen(!isFirstHOpen);
  const toggleSecHeading = () => setIsSecHOpen(!isSecHOpen);
  const toggleThirdHeading = () => setIsThirdHOpen(!isThirdHOpen);
  const toggleForthHeading = () => setIsForthHOpen(!isForthHOpen);
  const toggleFifthHeading = () => setIsFifthHOpen(!isFifthHOpen);
  const toggleSixthHeading = () => setIsSixthHOpen(!isSixthHOpen);
  const toggleSevenHeading = () => setIsSeventhHOpen(!isSeventhHOpen);
  const toggleEighthHeading = () => setIsEighthHOpen(!isEighthHOpen);
  const toggleNineHeading = () => setIsNineHOpen(!isNineHOpen);
  const toggleTenHeading = () => setIsTenHOpen(!isTenHOpen);
  const toggleelevenHeading = () => setIseleven(!iseleven);
  const toggleiseleven2Heading = () => setIseleven2(!iseleven2);

  const APKUrl = "https://play.google.com/store/apps/details?id=app.astrocall.live";
  const IOSUrl = "https://www.apple.com/app-store/";

  return (
    <div className="h-[100%] bottom-0 footer">
      {/* Social Links Section */}
      <div className="socialLinks orangeGradient h-[100%] py-3 sm:py-4 md:py-5">
        <div className="content-links flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm sm:text-base md:text-lg main-container m-auto px-3 sm:px-4">
          <p className="text-center sm:text-left">Follow us on social media</p>
          <div className="icons text-white flex gap-4 sm:gap-6 md:gap-8 flex-wrap items-center justify-center sm:justify-start">
            <a
              href="https://www.facebook.com/share/1AZyAfVdjE/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img
                src="/images/fb.webp"
                className="hover:scale-105 hover:cursor-pointer"
                width={30}
                alt="Facebook Share"
              />
            </a>
            <a
              href="https://www.instagram.com/astrocall.live?igsh=MXFrNnpoNnY3ZmVsMA=="
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <img
                src="/images/ig.webp"
                className="hover:scale-105 hover:cursor-pointer"
                width={30}
                alt="Instagram"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content main-container py-6 sm:py-8 md:py-10 text-white px-3 sm:px-4">
        {/* About Section */}
        <div className="about">
          <div className="heading my-3 sm:my-4 md:my-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-[700] my-1">
              About AstroCall - Trusted Online Astrology Platform?
            </h2>
            <div className="line-3 h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
          </div>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed">
            AstroCall is your trusted destination for authentic astrological guidance.
            Connect with experienced astrologers for personalized consultations,
            accurate predictions, and spiritual solutions to life's challenges.
          </p>
        </div>

        {/* Footer Links Grid */}
        <div className="m-4 sm:m-6 md:m-8 mt-4 w-[100%] flex flex-col sm:flex-row lg:flex-nowrap flex-wrap gap-4 sm:gap-5 md:gap-6">

          {/* Column 1: Online Astrology Services & Astrology */}
          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col mt-2 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleFirstHeading}
                >
                  Online Astrology Services <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
              </li>
              {isFirstHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Talk to Astrologer</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Chat with Astrologer</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Marital Life</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Love and Relationships</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Career and Jobs</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Cheating and Affairs</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Numerology</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Break Up and Divorce</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Vedic Astrology</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Kids and Education</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Tarot Reading</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Relationship Counseling</Link></li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleForthHeading}
                >
                  Astrology <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {isForthHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Kundali Matching</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Free Janam Kundali</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          {/* Column 2: Muharat & Online Puja */}
          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col mt-2 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleSecHeading}
                >
                  Muharat <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
              </li>
              {isSecHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Today's Muhurat</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Tomorrow's Muhurat</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Weekly Muhurat</Link></li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleThirdHeading}
                >
                  Online Puja <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {isThirdHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Online Puja Services</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Horoscope & Panchang */}
          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col mt-2 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleFifthHeading}
                >
                  Horoscope <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {isFifthHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Daily Horoscope</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Today's Horoscope</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Yesterday's Horoscope</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Tomorrow's Horoscope</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Weekly Horoscope</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Monthly Horoscope</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Yearly Horoscope</Link></li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleSixthHeading}
                >
                  Panchang <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {isSixthHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Today's Panchang</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Vrat and Upvaas & Useful Links */}
          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col gap-2 mt-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleSevenHeading}
                >
                  Vrat and Upvaas <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Ekadashi Vrat</Link></li>
                <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Poornima Vrat</Link></li>
                <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Amavasya Vrat</Link></li>
              </ul>
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleelevenHeading}
                >
                  Useful Links <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {iseleven ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">About Us</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Contact Us</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Blog</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">FAQs</Link></li>
                    <li><Link href="/" className="text-sm sm:text-base hover:underline transition">Support</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          {/* Column 5: Policy & Astrologer */}
          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col gap-2 mt-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleTenHeading}
                >
                  Policy <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {isTenHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/privacy-policy" scroll={true} className="text-sm sm:text-base hover:underline transition">Privacy Policy</Link></li>
                    <li><Link href="/TermsOfUse" scroll={true} className="text-sm sm:text-base hover:underline transition">Terms of Use</Link></li>
                    <li><Link href="/RefundCancellation" scroll={true} className="text-sm sm:text-base hover:underline transition">Refund & Cancellation</Link></li>
                    <li><Link href="/" scroll={true} className="text-sm sm:text-base hover:underline transition">Disclaimer</Link></li>
                    <li><Link href="/" scroll={true} className="text-sm sm:text-base hover:underline transition">Cookie Policy</Link></li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleiseleven2Heading}
                >
                  Astrologer <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {iseleven2 ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><Link href="/astrologer-login" className="text-sm sm:text-base hover:underline transition">Astrologer Login</Link></li>
                    <li><Link href="/astrologer-register" className="text-sm sm:text-base hover:underline transition">Astrologer Registration</Link></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          {/* Column 6: Download Our Apps */}
          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col gap-2 mt-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleNineHeading}
                >
                  Download Our Apps <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] bg-orange-500 drop-shadow-md"></div>
              </li>
              {isNineHOpen ? null : (
                <li>
                  <ul>
                    <div className="w-full max-w-[200px]">
                      <div className="my-2 sm:my-3 md:my-4">
                        <GooglePlayButton
                          url={APKUrl}
                          theme="dark"
                          className="custom-style transition-all duration-300 hover:scale-105 hover:shadow-lg w-full text-xs"
                        />
                      </div>
                      <div className="my-2">
                        <AppStoreButton
                          url={IOSUrl}
                          theme="dark"
                          className="custom-style transition-all duration-300 hover:scale-105 hover:shadow-lg w-full"
                        />
                      </div>
                    </div>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>

        <hr className="my-4 sm:my-6 md:my-8 border-gray-600" />

        <div className="copyright text-center text-xs sm:text-sm md:text-base py-3 sm:py-4 px-3 sm:px-4">
          &copy; Copyright 2026 by Astrocall Live Services Private Limited. All rights reserved.
        </div>
      </div>
    </div>
  );
}