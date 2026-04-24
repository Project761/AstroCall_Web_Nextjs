export default function OnlinePuja() {
  const pujas = [
    { 
      name: "Ganesh Puja", 
      description: "For success and removing obstacles",
      price: "₹1100",
      duration: "1 hour",
      benefits: "Success in new ventures, removal of obstacles"
    },
    { 
      name: "Lakshmi Puja", 
      description: "For wealth and prosperity",
      price: "₹2100",
      duration: "2 hours",
      benefits: "Financial stability, abundance"
    },
    { 
      name: "Shiva Puja", 
      description: "For peace and harmony",
      price: "₹1500",
      duration: "1.5 hours",
      benefits: "Inner peace, harmony in relationships"
    },
    { 
      name: "Durga Puja", 
      description: "For protection and strength",
      price: "₹2500",
      duration: "2 hours",
      benefits: "Protection from evil, inner strength"
    },
    { 
      name: "Saturn Puja", 
      description: "To appease Lord Saturn",
      price: "₹3000",
      duration: "3 hours",
      benefits: "Relief from Saturn's malefic effects"
    },
    { 
      name: "Navagraha Puja", 
      description: "For all nine planets",
      price: "₹5000",
      duration: "4 hours",
      benefits: "Overall planetary blessings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Online Puja Services</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Online Puja?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🙏</span>
              </div>
              <h3 className="font-semibold mb-2">Expert Pandits</h3>
              <p className="text-gray-600">Learned pandits perform puja with proper rituals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold mb-2">Live Streaming</h3>
              <p className="text-gray-600">Watch puja being performed live from your home</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-semibold mb-2">Prasad Delivery</h3>
              <p className="text-gray-600">Receive prasad at your doorstep</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pujas.map((puja, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🙏</span>
              </div>
              <h3 className="font-bold text-xl mb-2">{puja.name}</h3>
              <p className="text-gray-600 mb-4">{puja.description}</p>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{puja.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span className="text-orange-500 font-bold">{puja.price}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Benefits:</p>
                <p className="text-xs text-gray-600">{puja.benefits}</p>
              </div>
              
              <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
