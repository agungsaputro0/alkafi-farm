import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function TransactionValueChart() {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("monthly");

  // Data dummy per bulan (nilai dalam ribuan rupiah / poin)
  const monthlyData = [
    { label: "Jan", returnValue: 420, resaleValue: 580 },
    { label: "Feb", returnValue: 500, resaleValue: 620 },
    { label: "Mar", returnValue: 390, resaleValue: 450 },
    { label: "Apr", returnValue: 600, resaleValue: 700 },
    { label: "May", returnValue: 550, resaleValue: 670 },
    { label: "Jun", returnValue: 720, resaleValue: 850 },
    { label: "Jul", returnValue: 680, resaleValue: 790 },
  ];

  // Data dummy per minggu (nilai dalam ribuan rupiah / poin)
  const weeklyData = [
    { label: "Week 1", returnValue: 110, resaleValue: 140 },
    { label: "Week 2", returnValue: 130, resaleValue: 160 },
    { label: "Week 3", returnValue: 95, resaleValue: 120 },
    { label: "Week 4", returnValue: 150, resaleValue: 180 },
  ];

  const chartData = viewMode === "monthly" ? monthlyData : weeklyData;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow text-white">
      {/* Timeline kiri */}
      <div className="flex flex-col justify-center space-y-4 border-r border-white/20 pr-6 min-w-[130px] text-sm">
        {chartData.map(({ label, returnValue, resaleValue }) => (
          <div key={label} className="flex flex-col space-y-1">
            <p className="font-semibold">{label}</p>
            <p className="text-gray-300">Return: {returnValue}k</p>
            <p className="text-gray-300">Resale: {resaleValue}k</p>
          </div>
        ))}
      </div>

      {/* Chart kanan */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center mb-3">
          <h3 className="text-lg font-bold text-center">📊 Transaction Value Overview</h3>
        </div>

        <div className="flex-1 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="label" stroke="white" />
              <YAxis stroke="white" label={{ value: "k IDR / points", angle: -90, position: "insideLeft", fill: "white" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 5, border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="returnValue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} name="Return to Nasabah" />
              <Line type="monotone" dataKey="resaleValue" stroke="#facc15" strokeWidth={2} dot={{ r: 5 }} name="Resale to Mitra" />
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
