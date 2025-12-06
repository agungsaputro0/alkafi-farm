import { FaBell, FaBiohazard } from "react-icons/fa";
import { GiRadarSweep } from "react-icons/gi";


type Level = "high" | "medium";

interface WarningItem {
  id: number;
  title: string;
  message: string;
  level: Level;
}

export default function WarningPanel(): JSX.Element {
  const warnings: WarningItem[] = [
    {
      id: 1,
      title: "Stok Pakan Habis!",
      message:
        "Stok Konsentrat Protein Tinggi telah mencapai 0 kg. Segera lakukan pembelian sebelum aktivitas pemberian pakan terganggu!",
      level: "high",
    },
    {
      id: 2,
      title: "Perilaku Tidak Normal Terdeteksi",
      message:
        "Hewan di Kandang 3 menunjukkan perilaku gelisah dan penurunan nafsu makan. Sistem menyarankan pengecekan segera!",
      level: "medium",
    },
    {
      id: 3,
      title: "Sensor Suhu Tidak Stabil",
      message:
        "Fluktuasi suhu terdeteksi pada Kandang 2 selama 30 menit terakhir. Periksa perangkat sensor untuk memastikan akurasi data.",
      level: "medium",
    },
  ];

  const levelStyles: Record<Level, { border: string; glow: string; bg: string; grid: string }> = {
    high: {
      border: "border-red-500",
      glow: "shadow-[0_0_20px_rgba(255,0,0,0.6)]",
      bg: "bg-gradient-to-br from-red-600 to-red-800",
      grid: "before:bg-[radial-gradient(circle,rgba(255,0,0,0.3)_1px,transparent_1px)]",
    },
    medium: {
      border: "border-yellow-400",
      glow: "shadow-[0_0_20px_rgba(255,200,0,0.5)]",
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-700",
      grid: "before:bg-[radial-gradient(circle,rgba(255,255,0,0.25)_1px,transparent_1px)]",
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-xl border border-gray-300 flex flex-col gap-4 relative overflow-hidden">
      {/* Radar grid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(#ccc3_1px,transparent_1px),linear-gradient(90deg,#ccc3_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <h3 className="text-xl font-bold text-farmdarkestbrown flex items-center gap-2 relative z-10">
        <GiRadarSweep className="text-red-600 animate-ping-slow" /> Sistem Peringatan Kandang
      </h3>

      {warnings.map((warn) => {
        const style = levelStyles[warn.level];
        return (
          <div
            key={warn.id}
            className={`relative z-10 rounded-xl p-4 flex items-start gap-4 border ${style.border} ${style.bg} ${style.glow} text-white overflow-hidden before:content-[''] before:absolute before:inset-0 before:opacity-30 before:bg-[size:60px_60px] ${style.grid}`}
          >
            {/* Icon */}
            <div className="pt-1 animate-pulse">
              <FaBiohazard size={32} />
            </div>

            {/* Text */}
            <div className="pr-8">
              <h4 className="font-bold text-lg drop-shadow-lg">{warn.title}</h4>
              <p className="text-sm opacity-95">{warn.message}</p>
            </div>

            {/* Bell Indicator */}
            <div className="ml-auto flex items-center">
              <FaBell size={26} className="animate-bounce drop-shadow-lg" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
