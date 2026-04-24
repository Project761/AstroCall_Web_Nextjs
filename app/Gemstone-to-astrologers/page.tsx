export default function GemstoneToAstrologers() {
  const gemstones = [
    { 
      name: "Ruby (Manik)", 
      zodiac: "Leo, Cancer", 
      benefits: "Success, confidence, leadership",
      price: "₹2,500 - ₹25,000"
    },
    { 
      name: "Blue Sapphire (Neelam)", 
      zodiac: "Capricorn, Aquarius", 
      benefits: "Protection, wealth, career growth",
      price: "₹3,000 - ₹30,000"
    },
    { 
      name: "Emerald (Panna)", 
      zodiac: "Gemini, Virgo", 
      benefits: "Intelligence, communication, prosperity",
      price: "₹2,000 - ₹20,000"
    },
    { 
      name: "Yellow Sapphire (Pukhraj)", 
      zodiac: "Sagittarius, Pisces", 
      benefits: "Wisdom, wealth, marriage",
      price: "₹2,500 - ₹25,000"
    },
    { 
      name: "Red Coral (Moonga)", 
      zodiac: "Aries, Scorpio", 
      benefits: "Courage, health, energy",
      price: "₹1,500 - ₹15,000"
    },
    { 
      name: "Diamond (Heera)", 
      zodiac: "Libra, Taurus", 
      benefits: "Luxury, beauty, relationships",
      price: "₹5,000 - ₹50,000"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Gemstone Consultation</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Consult for Gemstones?</h2>
          <p className="text-gray-700 mb-6">
            Gemstones have been used for centuries to enhance planetary influences and bring positive changes in life. 
            Our expert astrologers analyze your birth chart to recommend the most suitable gemstones.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold">Birth Chart Analysis</h3>
                <p className="text-gray-600">Detailed analysis of your planetary positions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold">Authentic Gemstones</h3>
                <p className="text-gray-600">100% natural and certified gemstones</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold">Expert Guidance</h3>
                <p className="text-gray-600">Proper wearing instructions and rituals</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold">Lifetime Support</h3>
                <p className="text-gray-600">Ongoing guidance for optimal results</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gemstones.map((gemstone, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-bold text-xl mb-2">{gemstone.name}</h3>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Zodiac:</span>
                  <span>{gemstone.zodiac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span className="text-orange-500">{gemstone.price}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Benefits:</p>
                <p className="text-xs text-gray-600">{gemstone.benefits}</p>
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                Consult Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
