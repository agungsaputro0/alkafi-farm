import React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`
        flex flex-col md:flex-row 
        bg-white/5 
        backdrop-blur-sm 
        backdrop-saturate-150 
        rounded-2xl 
        border border-[rgba(200,255,255,0.4)] 
        shadow-[0_4px_30px_rgba(173,216,230,0.15)] 
        ring-1 ring-white/10
        p-6 
        space-y-4 
        w-full 
        min-w-[300px] 
        text-white 
        relative 
        overflow-hidden 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
