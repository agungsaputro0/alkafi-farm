import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function DistribusiUmurTernak() {
  const [filter, setFilter] = useState<"semua" | "kambing" | "domba" | "sapi">("semua");

  const dataTernak = {
    semua: [
      { label: "Anak (<1 th)", value: 95 },
      { label: "Muda (1-2 th)", value: 130 },
      { label: "Dewasa (2-4 th)", value: 160 },
      { label: "Tua (>4 th)", value: 65 },
    ],
    kambing: [
      { label: "Anak (<1 th)", value: 60 },
      { label: "Muda (1-2 th)", value: 85 },
      { label: "Dewasa (2-4 th)", value: 110 },
      { label: "Tua (>4 th)", value: 40 },
    ],
    domba: [
      { label: "Anak (<1 th)", value: 25 },
      { label: "Muda (1-2 th)", value: 30 },
      { label: "Dewasa (2-4 th)", value: 40 },
      { label: "Tua (>4 th)", value: 15 },
    ],
    sapi: [
      { label: "Anak (<1 th)", value: 10 },
      { label: "Muda (1-2 th)", value: 15 },
      { label: "Dewasa (2-4 th)", value: 10 },
      { label: "Tua (>4 th)", value: 10 },
    ],
  };

  const colors = ["#facc15", "#86efac", "#4ade80", "#22c55e"];
  const data = dataTernak[filter];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-white border border-gray-200 backdrop-blur-md rounded-xl shadow text-farmdarkestbrown">
      <h3 className="text-lg font-bold text-center">Distribusi Umur Ternak</h3>

      {/* Toggle Filter */}
      <div className="flex justify-center mb-3">
        <div className="inline-flex bg-yellow-900/50 rounded-full p-1">
            {["semua", "kambing", "domba", "sapi"].map((jenis) => (
            <button
                key={jenis}
                onClick={() => setFilter(jenis as any)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200
                ${
                    filter === jenis
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-yellow-100 hover:bg-yellow-800/70"
                }`}
            >
                {jenis}
            </button>
            ))}
        </div>
        </div>


      <p className="text-center text-sm text-gray-800 mb-2">
        Total populasi: <span className="font-semibold text-kemenkeuyellow">{total} ekor</span>
      </p>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40, right: 30 }}>
            <XAxis type="number" stroke="#45210aff" hide />
            <YAxis dataKey="label" type="category" stroke="#45210aff" width={140} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#724e3a",
                borderRadius: 6,
                border: "none",
                color: "#fff",
              }}
              formatter={(value: number) => [`${value} ekor`, "Jumlah"]}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-2 text-xs text-gray-400">
        <p>*Sekitar 70% populasi merupakan kambing & domba</p>
      </div>
    </div>
  );
}
