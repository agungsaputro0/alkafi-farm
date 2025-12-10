import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Tabs } from "antd";

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

  // Warna untuk stok aktual per jenis — beri tipe Record<string,string>
  const warnaStok: Record<string, string> = {
    "Konsentrat Protein Tinggi": "#8b5cf6",
    "Pakan Hijauan Kering (Hay)": "#22c55e",
    "Mineral dan Premix": "#3b82f6",
    "Pakan Pengganti Susu (CMR)": "#f59e0b",
  };

  const CustomLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 text-sm mt-2">
      {/* Legend stok minimal */}
      <div className="flex items-center gap-1">
        <span className="inline-block w-3 h-3 rounded-sm bg-[#ff4d4f]" />
        <span>Stok Minimal</span>
      </div>

      {/* Legend untuk stok aktual tiap jenis */}
      {Object.keys(warnaStok).map((nama) => (
        <div key={nama} className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: warnaStok[nama] }}
          />
          <span>{nama}</span>
        </div>
      ))}
    </div>
  );
};


  type StokItem = {
    namaJenisPakan: string;
    StokPakan: number;
    stokMinimal: number;
  };

  // Data stok + ambang batas (lebih variatif)
  const stokData: StokItem[] = [
    {
      namaJenisPakan: "Pakan Hijauan Kering (Hay)",
      StokPakan: 1800,
      stokMinimal: 1200,
    },
    {
      namaJenisPakan: "Konsentrat Protein Tinggi",
      StokPakan: 500, // di bawah ambang → tapi warnanya tetap ungu
      stokMinimal: 800,
    },
    {
      namaJenisPakan: "Mineral dan Premix",
      StokPakan: 150,
      stokMinimal: 100,
    },
    {
      namaJenisPakan: "Pakan Pengganti Susu (CMR)",
      StokPakan: 40, // di bawah ambang
      stokMinimal: 60,
    },
  ];

  return (
    <div className="w-full h-full p-4 bg-white border border-gray-200 rounded-xl shadow text-farmdarkestbrown">
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Grafik Pemakaian & Pemasukan",
            children: (
              <>
                <h3 className="text-lg font-bold text-center">
                  Penggunaan & Perolehan Pakan
                </h3>
                <p className="text-center text-sm text-gray-700 mb-2">
                  Perbandingan antara pakan hasil sendiri, pembelian, dan total penggunaan
                </p>

                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="bulan" stroke="#45210aff" />
                      <YAxis stroke="#45210aff" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#45210aff",
                          borderRadius: 6,
                          border: "none",
                          color: "#fff",
                        }}
                      />
                      <Legend wrapperStyle={{ color: "black" }} />

                      <Bar dataKey="hasilSendiri" stackId="a" fill="#86efac" />
                      <Bar dataKey="pembelian" stackId="a" fill="#facc15" />
                      <Bar dataKey="penggunaan" fill="#fb923c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center mt-1 text-xs text-gray-400">
                  <p>*Total penggunaan rata-rata: 480–500 kg/bulan</p>
                </div>
              </>
            ),
          },

          {
            key: "2",
            label: "Statistik Stok per Jenis",
            children: (
              <>
                <h3 className="text-lg font-bold text-center">
                  Jumlah Stok Tersedia per Jenis
                </h3>
                <p className="text-center text-sm text-gray-700 mb-3">
                  Perbandingan stok minimal dan stok aktual
                </p>

                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stokData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis
                        dataKey="namaJenisPakan"
                        stroke="#45210aff"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis stroke="#45210aff" />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: 6,
                          border: "none",
                          color: "#084724",
                        }}
                        formatter={(value, name) => [
                          `${value} kg`,
                          name === "StokPakan" ? "Stok Aktual" : "Stok Minimal",
                        ]}
                      />

                      <CustomLegend />

                      {/* Bar stok minimal */}
                      <Bar dataKey="stokMinimal" fill="#ff4d4f" radius={[4, 4, 0, 0]} />

                      {/* Bar stok aktual */}
                      <Bar dataKey="StokPakan" radius={[4, 4, 0, 0]}>
                        {stokData.map((entry, idx) => {
                          // aman: ambil warna dari map, fallback jika tidak ada
                          const warna = warnaStok[entry.namaJenisPakan] ?? "#8884d8";
                          return <Cell key={idx} fill={warna} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
