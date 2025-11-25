import React from "react";
import { GiCow, GiSheep, GiSeedling, GiShoppingCart } from "react-icons/gi";

const roles = [
  {
    icon: <GiCow className="text-farmgrassgreen text-2xl" />,
    title: "Pemeliharaan Sapi",
    description:
      "Menjaga kesehatan dan kesejahteraan sapi agar menghasilkan produk berkualitas tinggi.",
  },
  {
    icon: <GiSheep className="text-white text-2xl" />,
    title: "Pemeliharaan Domba",
    description:
      "Memastikan kualitas domba melalui pakan seimbang, perawatan rutin, dan pengawasan kesehatan.",
  },
  {
    icon: <GiSeedling className="text-white text-2xl" />,
    title: "Pengelolaan Pakan & Lahan",
    description:
      "Menyediakan pakan berkualitas, dan menjaga keberlanjutan lingkungan untuk ternak yang sehat.",
  },
  {
    icon: <GiShoppingCart className="text-farmgrassgreen text-2xl" />,
    title: "Jual Beli Hewan & Produk Ternak",
    description:
      "Menyediakan layanan jual beli hewan potong, daging, dan produk turunannya dengan kualitas terbaik.",
  },
];

const AlkafiFarmRole: React.FC = () => {
  return (
    <section className="w-full bg-farmgrassgreen py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col py-20 px-6 md:flex-row items-center gap-12">
        
        {/* Left - Roles & Text */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-3xl font-bold text-white mb-4 font-spring leading-tight">
              Aktivitas & Layanan Alkafi Farm
          </h2>
          <p className="text-white text-justify mb-4 leading-relaxed">
            Alkafi Farm adalah peternakan sapi dan domba yang mengutamakan kesehatan hewan, 
            kualitas produk, serta menyediakan layanan jual beli hewan potong dan produk turunannya.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {roles.map((item, idx) => {
                const isInverse = idx === 1 || idx === 2; // posisi silang
                const cardClass = isInverse
                  ? "bg-white text-farmdarkgreen"
                  : "bg-farmfreshgreen/20 text-white";

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-start rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300 ${cardClass}`}
                  >
                    <div
                      className={`p-3 rounded-xl shadow mb-3 ${
                        isInverse ? "bg-farmdarkgreen text-white" : "bg-white text-farmdarkgreen"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <h4
                      className={`font-semibold mb-1 ${
                        isInverse ? "text-farmdarkgreen" : "text-farmfreshgreen"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`text-sm text-justify leading-snug ${
                        isInverse ? "text-farmdarkgreen/80" : "text-white/90"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
    

        </div>

        {/* Right - Modern Image Layout */}
        <div className="w-full md:w-1/2"> 
          <img src="/assets/img/cow-farm.jpg" alt="Alkafi Farm" className="rounded-xl object-cover w-full h-full max-h-[400px]" /> 
          <p className="text-sm text-gray-400 mt-3 text-justify"> 
            “Alkafi Farm berkomitmen menghadirkan peternakan yang sehat, produktif, dan menyediakan layanan jual beli hewan potong dan produk turunannya.” 
          </p> 
        </div>
      </div>
    </section>
  );
};

export default AlkafiFarmRole;
