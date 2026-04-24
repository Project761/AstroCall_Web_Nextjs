export default function HomeOnlinepuja() {
  const pujas = [
    { name: "Ganesh Puja", purpose: "Success and prosperity", price: "₹1100" },
    { name: "Lakshmi Puja", purpose: "Wealth and abundance", price: "₹2100" },
    { name: "Shiva Puja", purpose: "Peace and harmony", price: "₹1500" },
    { name: "Durga Puja", purpose: "Protection and strength", price: "₹2500" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Online Puja Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pujas.map((puja, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🙏</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{puja.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{puja.purpose}</p>
            <p className="text-orange-500 font-bold mb-4">{puja.price}</p>
            <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
