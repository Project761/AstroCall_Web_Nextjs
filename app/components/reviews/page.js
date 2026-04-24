export default function CustomersFeedback() {
  const reviews = [
    { name: "Rahul M.", rating: 5, comment: "Amazing experience! Very accurate predictions." },
    { name: "Priya S.", rating: 5, comment: "The astrologer was very knowledgeable and helpful." },
    { name: "Amit K.", rating: 4, comment: "Good service, got clarity on my career path." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">"{review.comment}"</p>
            <p className="font-medium">- {review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
