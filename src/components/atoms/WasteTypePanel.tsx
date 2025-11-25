import React, { useState } from "react";
import { Switch, Button } from "antd";

interface WasteTypePanelProps {
  initialSelectedTypes?: string[];
}

const wasteTypes = [
  "Plastik PET",
  "Plastik HDPE",
  "Plastik PP",
  "Plastik Campuran",
  "Kertas",
  "Karton",
  "Logam Aluminium",
  "Logam Besi",
  "Kaca",
  "Organik",
  "Elektronik Kecil",
  "Elektronik Besar",
  "Baterai & Aki Bekas",
  "Tekstil",
  "Lainnya",
];

const WasteTypePanel: React.FC<WasteTypePanelProps> = ({ initialSelectedTypes = [] }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialSelectedTypes);
  const [expanded, setExpanded] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="bg-white/10 rounded-xl p-5 shadow-md text-cyan-100">
      {/* Judul utama */}
      <div className="flex items-center border-b border-white pb-4 mb-3">
        <h2 className="text-3xl font-semibold text-white">Manage Accepted Waste Types Panel</h2>
      </div>
      <p className="text-white text-sm mb-6 text-justify border-b border-white pb-4">
        This panel allows you to manage which types of waste your bank accepts. For each waste type, you can enable or disable its acceptance according to your bank’s policies. Use this panel to keep your waste collection services organized and aligned with your operational standards.
      </p>

      {/* Button expand/collapse */}
      <div className="mb-3">
        <Button
          type="default"
          className="w-full bg-white/10 text-white border-white hover:bg-white/20 transition"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? "Hide the waste types your bank accepts"
            : "Click here if you want to adjust the waste types your bank accepts"}
        </Button>
      </div>

      {/* Daftar tipe sampah */}
      {expanded && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {wasteTypes.map((type) => (
            <div
              key={type}
              className="flex items-center justify-between bg-white/10 p-2 rounded-md cursor-pointer hover:bg-white/20 transition text-sm"
              onClick={() => toggleType(type)}
            >
              <span>{type}</span>
              <Switch
                size="small"
                checked={selectedTypes.includes(type)}
                onChange={(_val) => toggleType(type)}
                onClick={(_, e) => e.stopPropagation()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WasteTypePanel;
