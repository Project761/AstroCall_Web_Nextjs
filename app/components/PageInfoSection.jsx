import { ORANGE, CREAM } from "@/app/lib/siteTheme";

export function HowItWorksSection({ title, steps, supportTitle, supportText }) {
  return (
    <section className="py-10 md:py-12" style={{ backgroundColor: CREAM }}>
      <div className="main-container px-4">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-[#1A1A1A] md:text-3xl">
          {title}
        </h2>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-2xl bg-white p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                  style={{ border: "1px solid rgba(251,81,6,0.1)" }}
                >
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: ORANGE }}
                  >
                    <Icon size={20} />
                  </div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide" style={{ color: ORANGE }}>
                    Step {i + 1}
                  </p>
                  <h3 className="mb-2 text-sm font-bold text-[#1A1A1A]">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-[#666]">{step.text}</p>
                </div>
              );
            })}
          </div>
          {supportTitle && (
            <div className="lg:col-span-4">
              <div
                className="flex h-full flex-col justify-center rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#fff", border: `2px solid ${ORANGE}` }}
              >
                <p className="font-serif text-xl font-bold text-[#1A1A1A]">{supportTitle}</p>
                {supportText && (
                  <p className="mt-2 text-sm leading-relaxed text-[#666]">{supportText}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function WhySection({ title, subtitle, benefits, badge }) {
  return (
    <section className="py-10 md:py-12" style={{ backgroundColor: "#fcf0e4" }}>
      <div className="main-container px-4">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] md:text-3xl">{title}</h2>
            {subtitle && <p className="mt-3 text-sm leading-relaxed text-[#666] md:text-base">{subtitle}</p>}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <span className="mt-0.5 shrink-0" style={{ color: ORANGE }}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{b.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#666]">{b.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {badge && (
            <div className="flex justify-center lg:col-span-5">
              <div
                className="rounded-2xl px-8 py-10 text-center text-white shadow-lg"
                style={{ backgroundColor: ORANGE }}
              >
                <p className="font-serif text-3xl font-bold">{badge.value}</p>
                <p className="mt-2 text-sm font-medium opacity-90">{badge.label}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

