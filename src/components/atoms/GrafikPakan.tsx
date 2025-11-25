import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function GrafikPakan() {
  const data = [
    { bulan: "Jan", hasilSendiri: 320, pembelian: 180, penggunaan: 450 },
    { bulan: "Feb", hasilSendiri: 300, pembelian: 200, penggunaan: 460 },
    { bulan: "Mar", hasilSendiri: 350, pembelian: 150, penggunaan: 470 },
    { bulan: "Apr", hasilSendiri: 380, pembelian: 120, penggunaan: 490 },
    { bulan: "Mei", hasilSendiri: 360, pembelian: 140, penggunaan: 480 },
    { bulan: "Jun", hasilSendiri: 390, pembelian: 100, penggunaan: 500 },
    { bulan: "Jul", hasilSendiri: 400, pembelian: 90, penggunaan: 495 },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow text-farmdarkestbrown">
      <h3 className="text-lg font-bold text-center">Penggunaan & Perolehan Pakan</h3>
      <p className="text-center text-sm text-gray-700 mb-2">
        Perbandingan antara pakan hasil sendiri, pembelian, dan total penggunaan setiap bulan
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="bulan" stroke="#45210aff" />
            <YAxis stroke="#45210aff" label={{ value: "kg", angle: -90, position: "insideLeft", fill: "white" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#45210aff",
                borderRadius: 6,
                border: "none",
                color: "#fff",
              }}
              formatter={(value: number, name: string) =>
                [`${value} kg`,
                name === "hasilSendiri"
                  ? "Hasil Sendiri"
                  : name === "pembelian"
                  ? "Pembelian"
                  : "Total Penggunaan"]
              }
            />
            <Legend wrapperStyle={{ color: "white" }} />
            {/* Sumber perolehan (stacked) */}
            <Bar dataKey="hasilSendiri" stackId="a" fill="#86efac" />
            <Bar dataKey="pembelian" stackId="a" fill="#facc15" />
            {/* Garis total penggunaan */}
            <Bar dataKey="penggunaan" fill="#fb923c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-1 text-xs text-gray-400">
        <p>*Total penggunaan rata-rata: 480–500 kg/bulan</p>
      </div>
    </div>
  );
}
