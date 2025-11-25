import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
export default function WasteVolumeChart() {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("monthly");

  const monthlyData = [
    { label: "Jan", value: 850 },
    { label: "Feb", value: 920 },
    { label: "Mar", value: 780 },
    { label: "Apr", value: 1050 },
    { label: "May", value: 990 },
    { label: "Jun", value: 1200 },
    { label: "Jul", value: 1100 },
  ];

  const dailyData = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 62 },
    { label: "Wed", value: 38 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 80 },
    { label: "Sat", value: 70 },
    { label: "Sun", value: 50 },
  ];

  const chartData = viewMode === "monthly" ? monthlyData : dailyData;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow text-white">
      {/* Timeline kiri */}
      <div className="flex flex-col justify-center space-y-4 border-r border-white/20 pr-6 min-w-[130px] text-sm">
        {chartData.map(({ label, value }) => (
          <div key={label} className="flex items-center space-x-3">
            <span className="w-4 h-4 rounded-full bg-green-500" />
            <div>
              <p className="font-semibold">{label}</p>
              <p className="text-gray-300">{value} kg</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart kanan */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center mb-3">
          <h3 className="text-lg font-bold text-center">📊 Aggregate Waste Volume</h3>
        </div>

        <div className="flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="label" stroke="white" />
              <YAxis stroke="white" label={{ value: "Kg", angle: -90, position: "insideLeft", fill: "white" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 5, border: "none" }} />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          <button
            className={`px-3 py-1 rounded ${viewMode === "daily" ? "bg-green-600" : "bg-green-900"}`}
            onClick={() => setViewMode("daily")}
          >
            Daily
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
