export default function CelebritiesReview() {
  const celebrities = [
    { name: "Bollywood Star", comment: "AstroCall helped me make important life decisions" },
    { name: "TV Actress", comment: "Very accurate predictions and professional service" },
    { name: "Sports Personality", comment: "Got clarity on my career path through astrology" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Trusted by Celebrities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {celebrities.map((celebrity, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-gray-700 mb-3 italic">"{celebrity.comment}"</p>
            <p className="font-medium text-orange-500">{celebrity.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
