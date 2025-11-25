import React from "react";
import { GiCow, GiSheep } from "react-icons/gi";
import { FaLeaf, FaIndustry, FaHandshake, FaTruck } from "react-icons/fa";

const focus = [
  {
    icon: <GiCow className="text-white text-2xl" />,
    title: "Peternakan Sapi Potong",
    description: "Pengelolaan sapi potong dengan sistem yang sehat, berkelanjutan, dan ramah lingkungan.",
  },
  {
    icon: <GiSheep className="text-white text-2xl" />,
    title: "Peternakan Domba Potong",
    description: "Produksi domba potong berkualitas tinggi untuk memenuhi kebutuhan pasar domestik dan aqiqah.",
  },
  {
    icon: <FaLeaf className="text-white text-2xl" />,
    title: "Pakan & Pengelolaan Hijauan",
    description: "Penerapan manajemen pakan hijauan alami dan berkualitas untuk mendukung kesehatan ternak.",
  },
  {
    icon: <FaIndustry className="text-white text-2xl" />,
    title: "Produk Turunan",
    description: "Pengolahan hasil ternak menjadi produk turunan seperti daging segar, olahan beku, dan kulit.",
  },
  {
    icon: <FaHandshake className="text-white text-2xl" />,
    title: "Kemitraan & Edukasi",
    description: "Bekerjasama dengan peternak lokal serta memberikan edukasi seputar peternakan modern.",
  },
  {
    icon: <FaTruck className="text-white text-2xl" />,
    title: "Distribusi & Layanan",
    description: "Layanan pemesanan, pengiriman, hingga penyediaan hewan kurban dengan standar terbaik.",
  },
];

const OurFocus: React.FC = () => {
  return (
    <div className="w-full px-6 py-12 bg-white shadow-xl">
      <div className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-10 items-center">
        
        {/* Kiri - Gambar highlight */}
        <div className="relative w-full md:w-1/2">
          <img
            src="/assets/img/our-focus.jpg"
            alt="Peternakan Sapi dan Domba"
            className="rounded-xl object-cover w-full h-full min-h-[400px]"
          />
        </div>

        {/* Kanan - Teks & Fokus */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-green-800 mb-4 font-spring">Yuk, Kenalan dengan Peternakan Kami</h2>
          <p className="text-gray-600 mb-6 text-justify">
            Di Alkafi Farm, setiap sapi dan domba kami rawat dengan penuh perhatian agar tumbuh sehat dan berkualitas. Kami percaya bahwa hasil terbaik lahir dari proses yang halal, berkelanjutan, dan ramah lingkungan. Selain menyediakan sapi dan domba potong, kami juga menghadirkan berbagai produk turunan serta layanan yang mendukung kebutuhan masyarakat, mitra bisnis, hingga ibadah Anda.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {focus.map((solution, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="bg-green-700 p-3 rounded-full">
                  {solution.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">{solution.title}</h4>
                  <p className="text-sm text-gray-600 text-justify">{solution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurFocus;
