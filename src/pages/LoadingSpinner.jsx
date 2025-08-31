import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <img
        src="/img/logo.png"
        alt="Loading..."
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 animate-spin-slow"
      />
    </div>
  );
};

export default LoadingSpinner;