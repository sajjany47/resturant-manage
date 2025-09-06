// components/CustomLoader.tsx
import React from "react";

interface CustomLoaderProps {
  message?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">{message || "Loading"}...</p>
      </div>
    </div>
  );
};

export default CustomLoader;
