export default function BlogSection() {
  const blogs = [
    { title: "How to Read Your Kundali", excerpt: "Learn the basics of reading your birth chart", date: "Jan 15, 2024" },
    { title: "Love Compatibility Guide", excerpt: "Check your compatibility with your partner", date: "Jan 10, 2024" },
    { title: "Career Astrology Tips", excerpt: "Find the right career path based on your stars", date: "Jan 5, 2024" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500">Blog Image</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{blog.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{blog.date}</span>
              <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
