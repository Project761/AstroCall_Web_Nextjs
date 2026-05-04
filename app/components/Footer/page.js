"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useContext, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { AppStoreButton, GooglePlayButton } from "react-mobile-app-button";
import { useTranslation } from "react-i18next";
import { MenuContext } from "@/app/context/MenuContext";

export default function Footer(props) {
  const { t } = useTranslation();
  const { MuhuratData, setMuhuratData, loginUserData, Get_Data_Muhurat, setVratUpvaasData, VratUpvaasData, Get_Data_VratandUpvaas, LanguageDropdown, HandleAstro, setIsModalOpen } = useContext(MenuContext);
  const [GetAstroLoginId, setGetAstroLoginId] = useState("");
  const [UserLoginId, setUserLoginId] = useState("");
  // const navigate = useNavigate();
  const router = useRouter();

  // Get login data on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      setGetAstroLoginId(localStorage.getItem("AstroLoginId") || "");
      setUserLoginId(localStorage.getItem("UserLoginId") || "");
    }
  }, []);

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
  const [iseleven3, setIseleven3] = useState(false);


  const isFetchingRef = useRef(false);
  const isVratandUpvaasRef = useRef(false);

  useEffect(() => {
    if (props.footers && !isFetchingRef.current) {
      isFetchingRef.current = true;
      Get_Data_Muhurat().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [props.footers]);


  useEffect(() => {
    if (props.footers && !isVratandUpvaasRef.current) {
      isVratandUpvaasRef.current = true;
      Get_Data_VratandUpvaas().finally(() => {
        isVratandUpvaasRef.current = false;
      });
    }
  }, [props.footers]);

  const toggleFirstHeading = () => {
    setIsFirstHOpen(!isFirstHOpen);
  };

  const toggleSecHeading = () => {
    setIsSecHOpen(!isSecHOpen);
  };

  const toggleThirdHeading = () => {
    setIsThirdHOpen(!isThirdHOpen);
  };

  const toggleForthHeading = () => {
    setIsForthHOpen(!isForthHOpen);
  };

  const toggleFifthHeading = () => {
    setIsFifthHOpen(!isFifthHOpen);
  };

  const toggleSixthHeading = () => {
    setIsSixthHOpen(!isSixthHOpen);
  };

  const toggleSevenHeading = () => {
    setIsSeventhHOpen(!isSeventhHOpen);
  };

  const toggleEighthHeading = () => {
    setIsEighthHOpen(!isEighthHOpen);
  };
  const toggleNineHeading = () => {
    setIsNineHOpen(!isNineHOpen);
  };
  const toggleTenHeading = () => {
    setIsTenHOpen(!isTenHOpen);
  };
  const toggleelevenHeading = () => {
    setIseleven(!iseleven);
  };
  const toggleiseleven2Heading = () => {
    setIseleven2(!iseleven2);
  };
  const toggleiseleven3Heading = () => {
    setIseleven3(!iseleven3);
  };

  const handleLinkClick = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  const APKUrl = "https://play.google.com/store/apps/details?id=app.astrocall.live";
  const IOSUrl = "https://www.apple.com/app-store/";

  return (
    <div className=" h-[100%]  bottom-0 footer  ">
      <div className="socialLinks orangeGradient h-[100%] py-3 sm:py-4 md:py-5">
        <div className="content-links flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm sm:text-base md:text-lg main-container m-auto px-3 sm:px-4">
          <p className="text-center sm:text-left">Get connected with us on social media :</p>
          <div className="icons text-white flex gap-4 sm:gap-6 md:gap-8 flex-wrap items-center justify-center sm:justify-start">

            <a
              href="https://www.facebook.com/share/1AZyAfVdjE/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/images/fb.webp"
                width={30}
                height={30}
                alt="Facebook"
                className="cursor-pointer hover:scale-105 transition"
              />
            </a>

            <a
              href="https://www.instagram.com/astrocall.live?igsh=MXFrNnpoNnY3ZmVsMA=="
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/images/ig.webp"
                width={30}
                height={30}
                alt="Instagram"
                className="cursor-pointer hover:scale-105 transition"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-content main-container py-6 sm:py-8 md:py-10 text-white px-3 sm:px-4">
        <div className="about">
          <div className="heading my-3 sm:my-4 md:my-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-[700] my-1">
              About AstroCall – Trusted Online Astrology Platform?
            </h2>
            <div className="line-3 h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
          </div>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed">
            Astro Call provides all different kinds of services as it is one of the best apps to which top most astrologers are connected with it and render an instant solution to a user. By knowing the birth timings and Kundli, they could predict a better future of a person through an audio call or messaging service.
          </p>
        </div>
        <div className="m-4 sm:m-6 md:m-8 mt-4 w-[100%] flex flex-col sm:flex-row lg:flex-nowrap flex-wrap gap-4 sm:gap-5 md:gap-6">

          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col mt-2 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleFirstHeading}
                >
                  Online Astrology Services <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
              </li>
              {isFirstHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href={"/talk-to-astrologers"} className="text-sm sm:text-base hover:underline transition">
                        Talk to Astrologer
                      </Link>
                    </li>
                    <li>
                      <Link href="/chat-to-astrologers" className="text-sm sm:text-base hover:underline transition">
                        Chat with Astrologer
                      </Link>
                    </li>
                    <li>
                      <Link href="/marital_life" className="text-sm sm:text-base hover:underline transition">
                        Marital Life
                      </Link>
                    </li>
                    <li>
                      <Link href="/love-and-relationships-astrology" className="text-sm sm:text-base hover:underline transition">
                        Love and Relationships
                      </Link>
                    </li>
                    <li>
                      <Link href="/career-and-jobs-astrology" className="text-sm sm:text-base hover:underline transition">
                        Career and Jobs
                      </Link>
                    </li>
                    <li>
                      <Link href="/astrology-for-cheating-and-affairs" className="text-sm sm:text-base hover:underline transition">
                        Cheating and Affairs
                      </Link>
                    </li>
                    <li>
                      <Link href="/numerology-services" className="text-sm sm:text-base hover:underline transition">
                        Numerology
                      </Link>
                    </li>
                    <li>
                      <Link href="/astrology-for-breakups-and-divorce" className="text-sm sm:text-base hover:underline transition">
                        BreakUp and Divorce
                      </Link>
                    </li>
                    <li>
                      <Link href="/vedic-astrology-services" className="text-sm sm:text-base hover:underline transition">
                        Vedic Astrology
                      </Link>
                    </li>
                    <li>
                      <Link href="/astrology-for-kids-and-education" className="text-sm sm:text-base hover:underline transition">
                        Kids and Education
                      </Link>
                    </li>
                    <li>
                      <Link href="/tarot-reading-services" className="text-sm sm:text-base hover:underline transition">
                        Tarot Reading
                      </Link>
                    </li>
                    <li>
                      <Link href="/relationship-counseling-services" className="text-sm sm:text-base hover:underline transition">
                        Relationship Counseling
                      </Link>
                    </li>
                    {/* <li>
                    <Link
                      href="/astro-login"
                      // 
                    >
                      Astrologer Login
                    </Link>
                  </li> */}
                  </ul>
                </li>
              )}
            </ul>
            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleForthHeading}
                >
                  Astrology <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {isForthHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href="/kundali-matching" className="text-sm sm:text-base hover:underline transition">
                        Kundali Matching
                      </Link>
                    </li>
                    <li>
                      <Link href="/freekundli" className="text-sm sm:text-base hover:underline transition">
                        Free Janam Kundali
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col mt-2 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleSecHeading}
                >
                  Muharat <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
              </li>
              {isSecHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    {MuhuratData?.map((item, index) => (
                      <li key={item?.MuhuratID || index}>
                        <Link
                          href="/Muhurat"
                          onClick={() => {
                            sessionStorage.setItem("MuhuratID", item?.MuhuratID);
                          }}
                          className="text-sm sm:text-base hover:underline transition"
                        >
                          {LanguageDropdown === "en" ? item?.Description : item?.DescriptionHi}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleThirdHeading}
                >
                  {t("onlinePuja")} <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {isThirdHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href="/online-puja" className="text-sm sm:text-base hover:underline transition">
                        Online Puja
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>




          </div>

          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col mt-2 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleFifthHeading}
                >
                  Horoscope <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {isFifthHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Daily Horoscope
                      </Link>
                    </li>
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Today's Horoscope
                      </Link>
                    </li>
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Yesterday's Horoscope
                      </Link>
                    </li>
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Tomorrow's Horoscope
                      </Link>
                    </li>
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Weekly Horoscope
                      </Link>
                    </li>
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Monthly Horoscope
                      </Link>
                    </li>
                    <li>
                      <Link href="/daily-horoscope" className="text-sm sm:text-base hover:underline transition">
                        Yearly Horoscope
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleSixthHeading}
                >
                  Panchang <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {isSixthHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href="/today-panchang" className="text-sm sm:text-base hover:underline transition">
                        Today's Panchang
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>


          </div>

          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col gap-2 mt-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleSevenHeading}
                >
                  Vrat And Upvaas <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              <ul className="space-y-1 sm:space-y-2">
                {Array.isArray(VratUpvaasData) && VratUpvaasData.map((item, i) => (
                  <li key={i}>
                    <Link
                      href="/vrat-and-upvaas/purnima-vrat"
                      onClick={() => sessionStorage.setItem("VratUpvaasID", item?.VratUpvaasID)}
                      className="text-sm sm:text-base hover:underline transition"
                    >
                      {LanguageDropdown === "en" ? item?.Description : item?.DescriptionHi}
                    </Link>
                  </li>
                ))}
              </ul>
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleTenHeading}
                >
                  Policy <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {isTenHOpen ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href={"/PrivacyPolicy"} className="text-sm sm:text-base hover:underline transition">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href={"/TermsOfUse"} className="text-sm sm:text-base hover:underline transition">
                        Terms of Use
                      </Link>
                    </li>
                    <li>
                      <Link href={"/RefundCancellation"} className="text-sm sm:text-base hover:underline transition">
                        Refund Cancellation
                      </Link>
                    </li>
                    <li>
                      <Link href={"/Disclaimer"} className="text-sm sm:text-base hover:underline transition">
                        Disclaimer
                      </Link>
                    </li>
                    <li>
                      <Link href={"/CookiePolicy"} className="text-sm sm:text-base hover:underline transition">
                        Cookie Policy
                      </Link>
                    </li>
                    <li>
                      <Link href={"/StoreRefundPolicy"} className="text-sm sm:text-base hover:underline transition">
                        Store Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link href={"/ShippingDeliveryPolicy"} className="text-sm sm:text-base hover:underline transition">
                        Shipping & Delivery Policy
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>

          <div className="w-full sm:w-auto">
            <ul className="main-container flex flex-col gap-2 mt-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleelevenHeading}
                >
                  Useful Links <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {iseleven ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link href="/AboutUs" className="text-sm sm:text-base hover:underline transition">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href={"/contact"} className="text-sm sm:text-base hover:underline transition">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/astrology-blog" className="text-sm sm:text-base hover:underline transition">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/FAQ" className="text-sm sm:text-base hover:underline transition">
                        FAQs
                      </Link>
                    </li>
                    <li>
                      {UserLoginId?.length > 0 ? (
                        <Link href="/TicketInformation" className="text-sm sm:text-base hover:underline transition">
                          Support
                        </Link>
                      ) : (
                        <button onClick={() => { setIsModalOpen(true) }} className="text-sm sm:text-base hover:underline transition cursor-pointer bg-transparent border-none text-left text-white">
                          Support
                        </button>
                      )}
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col mt-4 sm:mt-6 md:mt-8 gap-2 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleiseleven2Heading}
                >
                  Astrologer <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {iseleven2 ? null : (
                <li>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (GetAstroLoginId) {
                            HandleAstro(0);
                            router.push("/dashboard");
                          } else {
                            router.push("/astro-login");
                          }
                        }}
                        className="text-sm sm:text-base hover:underline transition"
                      >
                        Astrologer Login
                      </Link>
                    </li>
                    <li>
                      <Link href={"/astro-login"} className="text-sm sm:text-base hover:underline transition">
                        Astrologer Registration
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            <ul className="main-container flex flex-col gap-2 mt-4 sm:mt-6 md:mt-8 text-white">
              <li className="hover:drop-shadow-2xl">
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px]"></div>
                <h2
                  className="font-[800] text-base sm:text-lg md:text-xl my-1 text-shadow-xl hover:cursor-pointer flex items-center gap-2 transition"
                  onClick={toggleNineHeading}
                >
                  Download Our Apps <IoIosArrowDown className="text-sm sm:text-base" />
                </h2>
                <div className="line h-[1.5px] w-full sm:w-[150px] md:w-[200px] drop-shadow-md"></div>
              </li>
              {isNineHOpen ? null : (
                <li>
                  <ul>
                    {/* <div className="w-full max-w-[200px]">
                      <div className="my-2 sm:my-3 md:my-4">
                        <GooglePlayButton
                          url={APKUrl}
                          theme="dark"
                          className="custom-style transition-all duration-300 hover:scale-105 hover:shadow-lg w-full text-xs text-nowrap"
                        />
                      </div>
                      <div className="my-2">
                        <AppStoreButton
                          url={IOSUrl}
                          theme="dark"
                          className="custom-style transition-all duration-300 hover:scale-105 hover:shadow-lg w-full text-nowrap"
                        />
                      </div>
                    </div> */}
                  </ul>
                </li>
              )}
            </ul>
          </div>

        </div>
        <hr className="my-4 sm:my-6 md:my-8 border-gray-600" />

        <div className="copyright text-center text-xs sm:text-sm md:text-base py-3 sm:py-4 px-3 sm:px-4">
          © Copyright 2025 by Astrocall Live Services Private Limited. All rights reserved.
        </div>
      </div>
    </div>
  );
}