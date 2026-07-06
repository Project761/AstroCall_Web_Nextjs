export default function PageHero({ badge, title, subtitle, description, children }) {
  return (
    <section className="bg-[#FFF9F1] pt-20 pb-8 md:pt-24">
      <div className="main-container px-4 text-center">
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold text-[#FF6B00]">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-base font-medium text-[#FF6B00] sm:text-lg">{subtitle}</p>}
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
