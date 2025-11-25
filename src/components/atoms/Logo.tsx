import React from 'react';

const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/assets/img/alkafi-farm-icon.png" 
        alt="Logo Alkafi Farm"
        width={60}
        height={60}
        className="ml-2"
      />
      <div className="font-spring" style={{ marginLeft: '15px' }}>
        <h3><b><span className="text-farmdarkestbrown">Alkafi Farm</span></b></h3>
        <h5 className="text-farmdarkestbrown">Gathering Moments, Growing Dreams</h5>
      </div>
    </div>
  );
};

export default Logo;
