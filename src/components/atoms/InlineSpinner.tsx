import React from "react";

const InlineSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="flex space-x-1 h-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 bg-amber-400 animate-wave"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
      <span className="ml-3 text-gray-600 font-semibold">Memuat data...</span>
    </div>
  );
};

export default InlineSpinner;
