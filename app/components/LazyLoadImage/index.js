"use client";

import { useState, useRef, useEffect } from "react";

export default function LazyLoadImage({ 
  src, 
  alt, 
  className, 
  effect = "blur", 
  loading = "lazy", 
  decoding = "async", 
  width, 
  height, 
  sizes,
  fetchPriority = "auto" 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${effect === "blur" && !isLoaded ? "blur-sm" : ""} ${className}`}
          loading={loading}
          decoding={decoding}
          onLoad={handleLoad}
          width={width}
          height={height}
          sizes={sizes}
          fetchPriority={fetchPriority}
        />
      )}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 ${effect === "blur" ? "blur-sm" : ""}`} />
      )}
    </div>
  );
}
