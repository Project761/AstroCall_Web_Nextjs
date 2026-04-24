export default function AstrologySection() {
  const services = [
    { name: "Kundali Matching", description: "Find your perfect match", price: "₹999" },
    { name: "Career Astrology", description: "Get career guidance", price: "₹799" },
    { name: "Love Astrology", description: "Solve love problems", price: "₹899" },
    { name: "Health Astrology", description: "Health predictions", price: "₹699" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Popular Astrology Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">{service.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <p className="text-orange-500 font-bold mb-4">{service.price}</p>
            <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
