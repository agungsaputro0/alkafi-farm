import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
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

  const stokData = [
    { namaJenisPakan: "Konsentrat Protein Tinggi", StokPakan: 750 },
    { namaJenisPakan: "Pakan Hijauan Kering (Hay)", StokPakan: 1500 },
    { namaJenisPakan: "Mineral dan Premix", StokPakan: 100 },
    { namaJenisPakan: "Pakan Pengganti Susu (CMR)", StokPakan: 50 },
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
                <h3 className="text-lg font-bold text-center">Penggunaan & Perolehan Pakan</h3>
                <p className="text-center text-sm text-gray-700 mb-2">
                  Perbandingan antara pakan hasil sendiri, pembelian, dan total penggunaan
                </p>

                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="bulan" stroke="#45210aff" />
                      <YAxis
                        stroke="#45210aff"
                        label={{ value: "kg", angle: -90, position: "insideLeft", fill: "white" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#45210aff",
                          borderRadius: 6,
                          border: "none",
                          color: "#fff",
                        }}
                        formatter={(value, name) => [
                          `${value} kg`,
                          name === "hasilSendiri"
                            ? "Hasil Sendiri"
                            : name === "pembelian"
                            ? "Pembelian"
                            : "Total Penggunaan",
                        ]}
                      />
                      <Legend wrapperStyle={{ color: "white" }} />
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
                <h3 className="text-lg font-bold text-center">Jumlah Stok Tersedia per Jenis</h3>
                <p className="text-center text-sm text-gray-700 mb-3">
                  Stok minimal pakan berdasarkan jenis
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
                        formatter={(value) => [`${value} kg`, "Stok"]}
                      />
                      <Legend wrapperStyle={{ color: "white" }} />
                      <Bar dataKey="StokPakan" fill="#084724" radius={[4, 4, 0, 0]} />
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
