import React, { useState } from "react";
import {
  FaChartLine,
  FaBalanceScale,
  FaLightbulb,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const infos = [
  {
    title: "Kebijakan & Regulasi",
    message: "Pemerintah merilis aturan baru terkait transfer ke daerah.",
    icon: <FaBalanceScale className="text-indigo-300 text-xl" />,
  },
  {
    title: "Insight Ekonomi",
    message: "Pertumbuhan ekonomi regional diproyeksikan naik 5,3% tahun ini.",
    icon: <FaChartLine className="text-green-400 text-xl" />,
  },
  {
    title: "Tahukah Anda?",
    message: "Belanja infrastruktur berkontribusi signifikan pada PDRB daerah.",
    icon: <FaLightbulb className="text-yellow-300 text-xl" />,
  },
];

const FloatingInfoPanel: React.FC = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % infos.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + infos.length) % infos.length);

  return (
    <div
      className="
        absolute
        bottom-6
        left-6
        z-10
        bg-white/10
        backdrop-blur-md
        border border-white/20
        rounded-2xl
        px-5
        py-4
        text-white
        shadow-2xl
        w-[300px]
        space-y-3
        transition
        duration-300
        hover:scale-[1.02]
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide">
          {infos[index].title}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 bg-white/10 rounded-full aspect-square">
          {infos[index].icon}
        </div>
        <p className="text-sm opacity-90 line-clamp-2">{infos[index].message}</p>
      </div>

      <div className="flex justify-end">
        <button
          className="
            text-xs 
            underline 
            opacity-80 
            hover:opacity-100 
            transition 
            duration-200
          "
        >
          Baca Selengkapnya
        </button>
      </div>
    </div>
  );
};

export default FloatingInfoPanel;
