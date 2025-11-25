import React from "react";

interface MainPanelProps {
  children: React.ReactNode;
  className?: string;
}

const MainPanel: React.FC<MainPanelProps> = ({ children, className = "" }) => {
  return (
    <div className={`rounded-md space-y-4 w-full max-w-full ${className}`}>
         {children}
    </div>
 );
};

export default MainPanel;
