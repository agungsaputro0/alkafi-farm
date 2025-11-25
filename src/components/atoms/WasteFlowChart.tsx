import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function WasteFlowChart() {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");

  const monthlyData = [
    { label: "Jan", incoming: 1200, processed: 900, landfill: 300 },
    { label: "Feb", incoming: 1100, processed: 850, landfill: 250 },
    { label: "Mar", incoming: 1300, processed: 1000, landfill: 300 },
    { label: "Apr", incoming: 1250, processed: 950, landfill: 300 },
    { label: "May", incoming: 1400, processed: 1100, landfill: 300 },
    { label: "Jun", incoming: 1350, processed: 1050, landfill: 300 },
    { label: "Jul", incoming: 1450, processed: 1150, landfill: 300 },
  ];

  const weeklyData = [
    { label: "Week 1", incoming: 910, processed: 680, landfill: 230 },
    { label: "Week 2", incoming: 940, processed: 700, landfill: 240 },
    { label: "Week 3", incoming: 880, processed: 650, landfill: 230 },
    { label: "Week 4", incoming: 970, processed: 720, landfill: 250 },
  ];

  const chartData = viewMode === "monthly" ? monthlyData : weeklyData;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow text-white">
      {/* Timeline kiri */}
      <div className="flex flex-col justify-center space-y-4 border-r border-white/20 pr-6 min-w-[150px] text-sm">
        {chartData.map(({ label, incoming, processed, landfill }) => (
          <div key={label} className="flex flex-col space-y-1">
            <p className="font-semibold">{label}</p>
            <div className="flex flex-col text-gray-300 text-xs space-y-0.5">
              <span>Incoming: {incoming} kg</span>
              <span>Redistributed: {processed} kg</span>
              <span>Landfill: {landfill} kg</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart kanan */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center mb-3">
          <h3 className="text-lg font-bold text-center">📊 Waste Flow Overview</h3>
        </div>

        <div className="flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="label" stroke="white" />
              <YAxis
                stroke="white"
                label={{ value: "Kg", angle: -90, position: "insideLeft", fill: "white" }}
              />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 5, border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="incoming" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="Incoming Waste" />
              <Line type="monotone" dataKey="processed" stroke="#facc15" strokeWidth={2} dot={{ r: 4 }} name="Redistributed" />
              <Line type="monotone" dataKey="landfill" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Landfill" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          <button
            className={`px-3 py-1 rounded ${viewMode === "weekly" ? "bg-green-600" : "bg-green-900"}`}
            onClick={() => setViewMode("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 rounded ${viewMode === "monthly" ? "bg-green-600" : "bg-green-900"}`}
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>
    </div>
  );
}
