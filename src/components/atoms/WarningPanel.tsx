import { useState } from "react";
import { AiTwotoneWarning } from "react-icons/ai";
import { GiRadarSweep } from "react-icons/gi";

type Level = "high" | "medium";

interface WarningItem {
  id: number;
  title: string;
  message: string;
  level: Level;
}

export default function WarningPanel(): JSX.Element {
  const [visible, setVisible] = useState(true);

  const warnings: WarningItem[] = [
    {
      id: 1,
      title: "Perilaku Abnormal Serius Terdeteksi",
      message:
        "AI Computer Vision mendeteksi pola gerakan repetitif (stereotipik), pacing intens, dan jeda aktivitas tidak wajar pada sapi di Kandang 3. Heat-map tracking menunjukkan anomali konsisten selama 45 detik. Risiko tinggi stres berat atau potensi kondisi patologis. Lakukan pemeriksaan segera.",
      level: "high",
    },
    {
      id: 2,
      title: "Stok Konsentrat Rendah",
      message:
        "Stok Konsentrat Protein Tinggi saat ini 268 kg, di bawah ambang minimal 300 kg. Segera lakukan pengadaan untuk menjaga kontinuitas pemberian pakan.",
      level: "medium",
    },
  ];

  const levelStyles: Record<
    Level,
    { blink: string; border: string; bg: string; icon: string }
  > = {
    high: {
      blink: "animate-highBlink",
      border: "border-red-600",
      bg: "bg-gradient-to-br from-red-700 to-red-950",
      icon: "text-red-300 drop-shadow-[0_0_10px_rgba(255,80,80,1)]",
    },
    medium: {
      blink: "animate-medBlink",
      border: "border-yellow-400",
      bg: "bg-gradient-to-br from-yellow-600 to-yellow-800",
      icon: "text-yellow-200 drop-shadow-[0_0_6px_rgba(255,220,0,0.8)]",
    },
  };

  if (!visible) return <></>;

  return (
    <div
      className="
        fixed inset-0 z-50 
        flex items-center justify-center 
        overflow-y-auto 
        pointer-events-none
      "
    >
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 pointer-events-auto"
        onClick={() => setVisible(false)}
      />

      {/* POPUP PANEL */}
      <div
        className="
          relative z-20 w-[640px] max-w-full 
          bg-white rounded-xl shadow-2xl p-6 animate-fadeIn
          pointer-events-auto
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-farmdarkestbrown flex items-center gap-2">
            <GiRadarSweep className="text-red-600 animate-spin-slow" />
            Sistem Peringatan Dini
          </h3>

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setVisible(false)}
            className="text-xl font-bold text-gray-700 hover:text-red-600"
          >
            ✕
          </button>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-4">
          {warnings.map((warn) => {
            const style = levelStyles[warn.level];

            return (
              <div
                key={warn.id}
                className={`
                  p-4 flex items-start gap-4
                  border ${style.border} ${style.bg} text-white
                  ${style.blink}
                `}
              >
                <div className={`text-3xl ${style.icon}`}>
                  <AiTwotoneWarning />
                </div>

                <div>
                  <h4 className="font-bold text-lg">{warn.title}</h4>
                  <p className="text-sm opacity-95 text-justify">{warn.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes highBlink {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: .85; filter: brightness(1.5); }
        }
        .animate-highBlink {
          animation: highBlink .9s ease-in-out infinite;
        }

        @keyframes medBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: .75; }
        }
        .animate-medBlink {
          animation: medBlink 1.5s ease-in-out infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 7s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn .25s ease-out;
        }
      `}</style>
    </div>
  );
}
