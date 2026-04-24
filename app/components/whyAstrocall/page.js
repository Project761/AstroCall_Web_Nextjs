export default function WhyAstrocall() {
  const reasons = [
    { title: "Verified Astrologers", description: "All our astrologers are verified and experienced", icon: "✓" },
    { title: "24/7 Availability", description: "Get guidance anytime, anywhere", icon: "🕐" },
    { title: "Private & Secure", description: "Your consultations are completely confidential", icon: "🔒" },
    { title: "Affordable Pricing", description: "Reasonable rates for quality consultations", icon: "💰" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose AstroCall?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((reason, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">{reason.icon}</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{reason.title}</h3>
            <p className="text-gray-600">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
