import React from 'react';

const ErrorMessage = ({ error, className = "" }) => {
  if (!error) return null;

  return (
    <p className={`text-red-500 text-xs mt-1.5 font-medium flex items-center ${className}`}>
      <svg
        className="w-3 h-3 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {error}
    </p>
  );
};

export default ErrorMessage;
