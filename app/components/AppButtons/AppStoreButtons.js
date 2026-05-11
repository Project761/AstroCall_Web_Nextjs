"use client";

export const GooglePlayButton = ({ url = "#", className = "" }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex ${className}`}>
    <div className="w-[200px] h-[60px] rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
      <svg viewBox="0 0 200 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="198" height="58" rx="10" fill="#050505" stroke="#A6A6A6" strokeWidth="2" />
        <g transform="translate(18,10) scale(0.08)">
          <path fill="#EA4335" d="M199.9 237.8l-198.5 232.37c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46-130.76-126.35z" />
          <path fill="#FBBC04" d="M433.91 205.1l-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z" />
          <path fill="#34A853" d="M199.42 273.45l129.85-128.35-241.37-136.73c-8.37-5.58-19.54-8.37-30.7-8.37-26.5 0-50.22 18.14-55.8 41.86l198.02 231.59z" />
          <path fill="#4285F4" d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z" />
        </g>
        <text x="72" y="22" fill="white" fontSize="11" fontWeight="600">GET IT ON</text>
        <text x="65" y="44" fill="white" fontSize="21" fontWeight="700">Google Play</text>
      </svg>
    </div>
  </a>
);

export const AppStoreButton = ({ url = "#", className = "" }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex ${className}`}>
    <div className="w-[200px] h-[60px] rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
      <svg viewBox="0 0 200 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="198" height="58" rx="10" fill="#050505" stroke="#A6A6A6" strokeWidth="2" />
        <path fill="white" d="M45.6 19.2C44.2 20.9 42 21.9 39.8 21.7C39.5 19.5 40.6 17.3 42 15.9C43.5 14.2 45.9 13 48 13C48.3 15.3 47.3 17.5 45.6 19.2ZM48 22.8C44.8 22.6 42.1 24.6 40.6 24.6C39 24.6 36.6 22.9 34 23C30.6 23 27.4 25 25.7 27.9C22.2 33.9 24.8 42.7 28.1 47.3C29.7 49.6 31.7 52.2 34.3 52.1C36.8 52 37.8 50.5 40.8 50.5C43.7 50.5 44.6 52.1 47.3 52C50 51.9 51.7 49.7 53.3 47.4C55.2 44.7 56 42.1 56.1 41.9C56 41.8 50.8 39.8 50.7 33.8C50.6 28.8 54.8 26.4 55 26.3C52.7 22.9 49.2 22.6 48 22.8Z" />
        <text x="70" y="22" fill="white" fontSize="11" fontWeight="500">Download on the</text>
        <text x="65" y="45" fill="white" fontSize="21" fontWeight="700">App Store</text>
      </svg>
    </div>
  </a>
);