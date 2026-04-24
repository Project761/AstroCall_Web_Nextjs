export default function DailyHoroscope() {
  const zodiacSigns = [
    { name: "Aries", symbol: "♈", date: "Mar 21 - Apr 19", horoscope: "Today is a great day for new beginnings. Your energy levels are high." },
    { name: "Taurus", symbol: "♉", date: "Apr 20 - May 20", horoscope: "Focus on financial matters today. Good investments may come your way." },
    { name: "Gemini", symbol: "♊", date: "May 21 - Jun 20", horoscope: "Communication is key today. Express yourself clearly." },
    { name: "Cancer", symbol: "♋", date: "Jun 21 - Jul 22", horoscope: "Emotional connections will be strong today." },
    { name: "Leo", symbol: "♌", date: "Jul 23 - Aug 22", horoscope: "Your leadership qualities will shine today." },
    { name: "Virgo", symbol: "♍", date: "Aug 23 - Sep 22", horoscope: "Attention to detail will bring success today." },
    { name: "Libra", symbol: "♎", date: "Sep 23 - Oct 22", horoscope: "Balance is important today. Find harmony in all areas." },
    { name: "Scorpio", symbol: "♏", date: "Oct 23 - Nov 21", horoscope: "Transformation is in the air. Embrace change." },
    { name: "Sagittarius", symbol: "♐", date: "Nov 22 - Dec 21", horoscope: "Adventure awaits. Be open to new experiences." },
    { name: "Capricorn", symbol: "♑", date: "Dec 22 - Jan 19", horoscope: "Hard work will pay off today." },
    { name: "Aquarius", symbol: "♒", date: "Jan 20 - Feb 18", horoscope: "Innovation is your strength today." },
    { name: "Pisces", symbol: "♓", date: "Feb 19 - Mar 20", horoscope: "Intuition will guide you today." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Daily Horoscope</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zodiacSigns.map((sign, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{sign.symbol}</div>
                <div>
                  <h3 className="font-bold text-lg">{sign.name}</h3>
                  <p className="text-sm text-gray-600">{sign.date}</p>
                </div>
              </div>
              <p className="text-gray-700">{sign.horoscope}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
