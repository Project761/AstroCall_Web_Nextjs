export default function SupportSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-orange-500 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
        <p className="text-xl mb-6">Our support team is available 24/7 to assist you</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Contact Support
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-500 transition-colors">
            Call Us: 1800-XXX-XXXX
          </button>
        </div>
      </div>
    </div>
  );
}
