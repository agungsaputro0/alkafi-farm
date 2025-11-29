import React from 'react';
import useIsLogin from '../hooks/UseIsLogin';
const LoadingSpinner: React.FC = () => {
  const isLogin = useIsLogin();
  return (
    <div className={`${isLogin ? "bg-[url('/assets/img/bg-gradient.jpg')]" : "bg-[url('/assets/img/bg-main2.jpg')]"} bg-no-repeat bg-center bg-cover bg-fixed w-full h-screen flex flex-col items-center justify-center text-white`}>
      {/* Logo dan nama */}
      <div className="flex items-center mb-8">
        <img
          src="/assets/img/alkafi-farm-icon.png"
          alt="Alkafi Farm Logo"
          className="h-16 w-16"
        />
        <span className="ml-3 text-[3em] font-bold font-spring">
          <span className={`${isLogin ? 'text-farmLightOrange' : 'text-farmdarkestbrown'}`}>Alkafi Farm</span>
        </span>
      </div>

      {/* Animasi gelombang */}
      <div className="flex space-x-1 h-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 ${isLogin ? 'bg-farmfreshgreen' : 'bg-farmgrassgreen'} animate-wave`}
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
