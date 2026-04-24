export default function AstrologyBlog() {
  const blogPosts = [
    {
      title: "Understanding Vedic Astrology: A Beginner's Guide",
      excerpt: "Learn the fundamentals of Vedic astrology and how it can guide your life decisions.",
      category: "Basics",
      date: "January 15, 2024",
      readTime: "5 min read",
      image: "📚"
    },
    {
      title: "How to Read Your Kundali: Step by Step",
      excerpt: "A comprehensive guide to understanding your birth chart and its significance.",
      category: "Kundali",
      date: "January 10, 2024",
      readTime: "8 min read",
      image: "🔍"
    },
    {
      title: "Love and Relationships: What Your Stars Say",
      excerpt: "Discover how planetary positions influence your romantic relationships.",
      category: "Relationships",
      date: "January 5, 2024",
      readTime: "6 min read",
      image: "💕"
    },
    {
      title: "Career Astrology: Finding Your Professional Path",
      excerpt: "Use astrology to make informed career decisions and find your true calling.",
      category: "Career",
      date: "December 28, 2023",
      readTime: "7 min read",
      image: "💼"
    },
    {
      title: "The Power of Gemstones in Astrology",
      excerpt: "Learn how gemstones can enhance planetary influences and bring positive changes.",
      category: "Gemstones",
      date: "December 20, 2023",
      readTime: "5 min read",
      image: "💎"
    },
    {
      title: "Muhurat: Auspicious Timing for Important Events",
      excerpt: "Understanding the importance of timing in astrology for life's major events.",
      category: "Muhurat",
      date: "December 15, 2023",
      readTime: "6 min read",
      image: "⏰"
    }
  ];

  const categories = ["All", "Basics", "Kundali", "Relationships", "Career", "Gemstones", "Muhurat"];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Astrology Blog</h1>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All" 
                  ? "bg-orange-500 text-white" 
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <span className="text-6xl">{post.image}</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="font-bold text-xl mb-3 hover:text-orange-500 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-gray-700 mb-6">
            Get weekly astrology insights, horoscope updates, and exclusive content delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
