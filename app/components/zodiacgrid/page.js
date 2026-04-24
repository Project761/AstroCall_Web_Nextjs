export default function ZodiacGrid() {
  const zodiacSigns = [
    { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19" },
    { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20" },
    { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20" },
    { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22" },
    { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22" },
    { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22" },
    { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22" },
    { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21" },
    { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21" },
    { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19" },
    { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18" },
    { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Zodiac Signs</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {zodiacSigns.map((sign, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-3xl mb-2">{sign.symbol}</div>
            <h3 className="font-bold text-sm mb-1">{sign.name}</h3>
            <p className="text-xs text-gray-600">{sign.dates}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
