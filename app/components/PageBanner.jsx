"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import { CREAM, ORANGE } from "@/app/lib/siteTheme";

export const DEFAULT_BANNER_SRC = "/Banner/HomePageBanner3.png";

/** Banner min display ~40% viewport; scales on browser zoom via rem/vmin. */
export const PAGE_BANNER_MIN_HEIGHT = "max(40vmin, 12.5rem)";

export function PageBreadcrumb({ crumbs = [], currentPage, className = "" }) {
  return (
    <nav className={`page-banner__crumb ${className}`}>
      <Link href="/" className="hover:text-[#FF5C00]">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href}>
          <span className="mx-1.5 sm:mx-2">›</span>
          <Link href={crumb.href} className="hover:text-[#FF5C00]">
            {crumb.label}
          </Link>
        </span>
      ))}
      {currentPage && (
        <>
          <span className="mx-1.5 sm:mx-2">›</span>
          <span style={{ color: ORANGE }}>{currentPage}</span>
        </>
      )}
    </nav>
  );
}

/**
 * Full-width page hero — banner + text scale together on browser zoom (rem/vmin/em).
 */
export default function PageBanner({
  title,
  subtitle,
  currentPage,
  crumbs = [],
  bannerSrc = DEFAULT_BANNER_SRC,
  bannerAlt = "Page banner",
  objectPosition,
  children,
  bottomSlot,
  contentClassName = "",
  titleClassName = "page-banner__title",
  subtitleClassName = "page-banner__subtitle",
  showBreadcrumb = true,
  showBackButton = true,
  backHref,
  backLabel = "Back",
  priority = true,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <section
      className={`page-banner relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden border-b border-orange-100/60 ${
        bottomSlot ? "page-banner--has-bottom" : ""
      }`}
      style={{ backgroundColor: CREAM }}
    >
      <div className="page-banner__media absolute inset-0" aria-hidden>
        <Image
          src={bannerSrc}
          alt={bannerAlt}
          fill
          priority={priority}
          className={objectPosition ? `object-cover ${objectPosition}` : "object-cover"}
          sizes="100vw"
        />
        {/* <div className="page-banner__overlay" /> */}
      </div>

      <div className={`main-container relative z-10 ${contentClassName}`}>
        <div className="page-banner__inner">
          {(showBackButton || showBreadcrumb) && (
            <div className="page-banner__nav">
              {/* {showBackButton && (
                <button type="button" onClick={handleBack} className="page-banner__back">
                  <FaChevronLeft style={{ width: "0.75em", height: "0.75em", flexShrink: 0 }} />
                  {backLabel}
                </button>
              )} */}
              {showBreadcrumb && (
                <PageBreadcrumb crumbs={crumbs} currentPage={currentPage} />
              )}
            </div>
          )}

          <div className="page-banner__body">
            {title && <h1 className={titleClassName}>{title}</h1>}
            {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>

      {/* {bottomSlot && <div className="page-banner__bottom">{bottomSlot}</div>} */}
    </section>
  );
}
