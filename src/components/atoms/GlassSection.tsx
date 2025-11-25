import React from "react";

interface GlassSectionProps {
  children: React.ReactNode;
  className?: string;
}

const GlassSection: React.FC<GlassSectionProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`
        w-full 
        min-w-[300px] 
        ml-[10px] 
        mr-[10px] 
        p-6 
        space-y-4 
        rounded-2xl
        border border-white/20 
        bg-white/50 
        backdrop-blur-sm 
        backdrop-saturate-150 
        shadow-[0_4px_30px_rgba(173,216,230,0.15)] 
        ring-1 ring-white/10 
        text-white 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassSection;
