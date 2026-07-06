import {
  MdPeople,
  MdVerifiedUser,
  MdStar,
  MdAccessTime,
} from "react-icons/md";

const TRUST_FEATURES = [
  {
    icon: MdPeople,
    value: "5 Lakh+",
    label: "Consultations",
  },
  {
    icon: MdVerifiedUser,
    value: "500+",
    label: "Verified Astrologers",
  },
  {
    icon: MdStar,
    value: "4.8/5",
    label: "Average Rating",
  },
  {
    icon: MdAccessTime,
    value: "24x7",
    label: "Available For You",
  },
];
export default function WhyAstrocall() {
  return (
    <section className="py-6">
      <div className="main-container">
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-[#FF5A00] via-[#FF6400] to-[#FF7A00] shadow-lg">

          <div className="grid grid-cols-2 md:grid-cols-4">

            {TRUST_FEATURES.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.value}
                  className={`flex items-center justify-center gap-3 px-6 py-5 ${index !== TRUST_FEATURES.length - 1
                      ? "border-r border-white/20"
                      : ""
                    }`}
                >
                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                    <Icon className="text-[22px] text-white" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-lg font-bold leading-none text-white">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-[12px] font-medium text-white/90">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}

// export default function WhyAstrocall() {
//   return (
//     <section className="border-y border-orange-100/60 bg-[#FFFBF7] py-5 md:py-6">
//       <div className="main-container">
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6 lg:min-h-[100px] lg:items-center">
//           {TRUST_FEATURES.map((item) => {
//             const Icon = item.icon;
//             return (
//               <div
//                 key={item.title}
//                 className="flex flex-col items-center justify-center gap-2 rounded-xl px-3 py-3 text-center transition hover:bg-white/60 md:py-2"
//               >
//                 <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0E6]">
//                   <Icon className="text-[22px] text-[#FF5C00]" />
//                 </div>
//                 <div>
//                   <p className="font-heading text-sm font-semibold leading-[18px] text-[#1A1A1A]">
//                     {item.title}
//                   </p>
//                   <p className="font-body text-xs font-medium leading-tight text-gray-500">
//                     {item.subtitle}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
