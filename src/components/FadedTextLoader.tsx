import React from 'react';

interface FadedTextLoaderProps {
  lines?: number;
  className?: string;
}

const FadedTextLoader: React.FC<FadedTextLoaderProps> = ({ lines = 1, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? '60%' : '100%', // Last line is shorter
          }}
        />
      ))}
    </div>
  );
};

export default FadedTextLoader;
