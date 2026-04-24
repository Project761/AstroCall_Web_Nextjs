export function GooglePlayButton({ url, className }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
    >
      <img 
        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
        alt="Get it on Google Play"
        className="w-full h-auto"
      />
    </a>
  );
}

export function AppStoreButton({ url, className }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
    >
      <img 
        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
        alt="Download on the App Store"
        className="w-full h-auto"
      />
    </a>
  );
}
