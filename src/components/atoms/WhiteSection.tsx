import React from "react";

interface WhiteSectionProps {
  children: React.ReactNode;
  className?: string;
}

const WhiteSection: React.FC<WhiteSectionProps> = ({ children, className = "" }) => {
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
        bg-white
        backdrop-blur-sm 
        backdrop-saturate-150 
        shadow-[0_4px_30px_rgba(173,216,230,0.15)] 
        ring-1 ring-white/10 
        text-slate-700 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default WhiteSection;
