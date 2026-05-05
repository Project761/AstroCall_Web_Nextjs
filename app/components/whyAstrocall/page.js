import { FaClock, FaHandshake, FaMedal, FaUserAstronaut } from "react-icons/fa";

export default function WhyAstrocall() {
  const features = [
    {
      icon: <FaUserAstronaut size={24} />,
      title: 'Expert Astrologers',
      description: 'Our team consists of certified and experienced astrologers with expertise in various astrological disciplines.'
    },
    {
      icon: <FaClock size={24} />,
      title: '24/7 Availability',
      description: 'Connect with our astrologers anytime, anywhere. We are available round the clock for your convenience.'
    },
    {
      icon: <FaMedal size={24} />,
      title: 'Accurate Predictions',
      description: 'Our astrologers provide highly accurate predictions based on your birth chart and planetary positions.'
    },
    {
      icon: <FaHandshake size={24} />,
      title: 'Personalized Solutions',
      description: 'We offer tailored solutions for your specific concerns related to career, relationships, health, and more.'
    }
  ];
  return (
    <div className="py-12 bg-[#FFF6F0]">
      <div className="py-8 main-container ">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AstroCall?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#FF6600] text-center  "
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-b from-[#FF9933] to-[#FF6600] shadow-md text-white">
                  {item.icon}
                </div>
              </div>
              <div className="inline-block">
                <h3 className="text-lg font-semibold text-[#FF6600]">{item.title}</h3>
                <div className="soft-glow-line "></div>
              </div>

              <p className="text-sm text-gray-600 mt-5 ">{item.description}</p>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}
