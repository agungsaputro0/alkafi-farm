import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function PendapatanBulanan() {
    const data = [
        { bulan: "Jan", pendapatan: 45000000 }, // awal tahun agak rendah
        { bulan: "Feb", pendapatan: 48000000 },
        { bulan: "Mar", pendapatan: 52000000 },
        { bulan: "Apr", pendapatan: 57000000 }, // mulai naik
        { bulan: "Mei", pendapatan: 65000000 },
        { bulan: "Jun", pendapatan: 95000000 }, // lonjakan sebelum Idul Adha
        { bulan: "Jul", pendapatan: 125000000 }, // puncak Idul Adha
        { bulan: "Agu", pendapatan: 73000000 }, // turun tapi masih tinggi
        { bulan: "Sep", pendapatan: 58000000 },
    ];


  const formatRupiah = (value: number) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow text-farmdarkestbrown">
      <h3 className="text-lg font-bold text-center">Total Pendapatan Bulanan</h3>
      <p className="text-center text-sm text-gray-700 mb-2">
        Tren pendapatan hasil penjualan ternak dan produk olahan setiap bulan
      </p>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="bulan" stroke="#45210aff" />
            <YAxis
              stroke="#45210aff"
              tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}jt`}
              label={{
                value: "Rupiah (juta)",
                angle: -90,
                position: "insideLeft",
                fill: "white",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#45210aff",
                borderRadius: 6,
                border: "none",
                color: "#fff",
              }}
              formatter={(value: number) => [formatRupiah(value), "Pendapatan"]}
            />
            <Line
              type="monotone"
              dataKey="pendapatan"
              stroke="#facc15"
              strokeWidth={3}
              dot={{ r: 5, fill: "#facc15" }}
              activeDot={{ r: 7, fill: "#fde68a" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-1 text-xs text-gray-400">
        <p>*Rata-rata pendapatan semester ini: sekitar Rp57–65 juta/bulan</p>
      </div>
    </div>
  );
}
