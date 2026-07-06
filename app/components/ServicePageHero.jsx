import Image from "next/image";
import { ORANGE } from "@/app/lib/siteTheme";

export default function ServicePageHero({
  title,
  subtitle,
  description,
  features = [],
  imageSrc,
  imageAlt = "",
  imagePosition = "right",
  children,
}) {
  return (
    <section className="pt-2 pb-8 md:pb-10" style={{ backgroundColor: "#fcf0e4" }}>
      <div className="main-container px-4">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
          <div className={imagePosition === "left" ? "lg:order-2" : ""}>
            <h1 className="font-serif text-[1.75rem] font-bold leading-[1.2] text-[#1A1A1A] sm:text-[2.25rem] md:text-[2.75rem]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-[15px] leading-relaxed text-[#555] sm:text-base md:text-lg">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="mt-2 text-sm leading-relaxed text-[#777]">{description}</p>
            )}
            {features.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.label} className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(251,81,6,0.12)]"
                        style={{ color: ORANGE }}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="text-[13px] font-semibold text-[#333] sm:text-sm">
                        {f.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {children}
          </div>

          {imageSrc && (
            <div className={`flex justify-center ${imagePosition === "left" ? "lg:order-1" : ""}`}>
              <div className="relative w-full max-w-[300px] sm:max-w-[360px]">
                <div
                  className="absolute inset-4 rounded-full blur-3xl opacity-40"
                  style={{ backgroundColor: ORANGE }}
                />
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={400}
                  height={400}
                  className="relative z-10 w-full h-auto object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
