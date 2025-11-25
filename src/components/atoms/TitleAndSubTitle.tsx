import React from "react";

const TitleAndSubtitle: React.FC = () => {
  return (
    <div className="flex items-center">
      <img
        src="/assets/img/alkafi-farm-icon.png"
        alt="Alkafi Farm Logo"
        className="w-[100px] h-[100px]"
      />
      <div className="ml-8 flex  font-spring flex-col items-start text-left">
        <h1 className="text-6xl font-bold text-white">
          <span className="text-farmgrassgreen">Alkafi Farm</span>
        </h1>
        <h3 className="text-xl text-farmgreen">Gathering Moments, Growing Dreams</h3>
      </div>
    </div>
  );
};

export default TitleAndSubtitle;
