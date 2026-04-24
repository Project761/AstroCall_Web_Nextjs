export default function Astrologers() {
  const astrologers = [
    { name: "Dr. Priya Sharma", expertise: "Vedic Astrology", experience: "15 years", rating: 4.8 },
    { name: "Acharya Raj Kumar", expertise: "Numerology", experience: "12 years", rating: 4.9 },
    { name: "Pt. Suresh Joshi", expertise: "Kundali Matching", experience: "20 years", rating: 4.7 },
    { name: "Ms. Anjali Verma", expertise: "Tarot Reading", experience: "8 years", rating: 4.6 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Meet Our Expert Astrologers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {astrologers.map((astrologer, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{astrologer.name}</h3>
            <p className="text-gray-600 text-sm mb-1">{astrologer.expertise}</p>
            <p className="text-gray-500 text-sm mb-2">{astrologer.experience}</p>
            <div className="flex items-center justify-center">
              <span className="text-yellow-500">⭐</span>
              <span className="ml-1 text-sm font-medium">{astrologer.rating}</span>
            </div>
            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
              Consult Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
