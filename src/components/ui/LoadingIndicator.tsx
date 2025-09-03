import React from "react";

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function LoadingIndicator({ message = "Loading...", className = "", size = "lg" }: LoadingIndicatorProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
      <span className={`relative inline-flex ${sizeMap[size]} items-center justify-center`}>
        <span className={`absolute inset-0 rounded-full border-2 border-black/20`} />
        <span className={`absolute inset-0 rounded-full border-2 border-black border-t-transparent animate-spin`} />
      </span>
      <span className="mt-3 text-base text-gray-700">{message}</span>
    </div>
  );
}
