import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { formatTanggalPendek } from "../utils/FormatTanggalIndo";

export default function PenugasanHarian() {
  const [tab, setTab] = useState<"pakan" | "kandang">("pakan");

  const penugasanPakan = [
    {
      id: 1,
      penugasan: "Pakan pagi kambing",
      jam: "07:30 - 09:30",
      kelompok: "Sapi Bali",
      petugas: "Asep",
      status: "Selesai",
    },
    {
      id: 2,
      penugasan: "Pakan pagi sapi",
      jam: "08:30 - 10:30",
      kelompok: "Sapi Limousin",
      petugas: "Wawan",
      status: "Selesai",
    },
    {
      id: 3,
      penugasan: "Pakan sore domba",
      jam: "15:00 - 17:00",
      kelompok: "Domba Garut",
      petugas: "Budi",
      status: "Belum",
    },
    {
      id: 4,
      penugasan: "Pakan sore kambing",
      jam: "15:00 - 17:00",
      kelompok: "Kambing Etawa",
      petugas: "Rendi",
      status: "Belum",
    },
  ];

  const penugasanKandang = [
    {
      id: "1",
      waktu: `${formatTanggalPendek()}/ 08:00 WIB`,
      kandang: "Kandang Domba 1",
      petugas: "Rudi",
      status: "Selesai",
    },
    {
      id: "2",
      waktu: `${formatTanggalPendek()}/ 15:00 WIB`,
      kandang: "Kandang Sapi 2",
      petugas: "Dede",
      status: "Belum",
    },
  ];

  const countBelum = (arr: { status: string }[]) =>
    arr.filter((i) => i.status === "Belum").length;

  const renderStatus = (status: string) => {
    const base =
      "inline-flex items-center justify-center w-20 py-1 rounded-full text-xs font-semibold text-center";
    switch (status) {
      case "Selesai":
        return <span className={`${base} bg-green-600/80`}>Selesai</span>;
      case "Belum":
        return <span className={`${base} bg-red-600/80`}>Belum</span>;
      default:
        return <span className={`${base} bg-yellow-600/80`}>{status}</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-white border border-border-200 rounded-xl shadow text-farmdarkestbrown">
      <h3 className="text-lg font-bold text-center">
        Jadwal & Penugasan Harian
      </h3>
      <p className="text-center text-sm text-gray-700 mb-2">
        Monitoring kegiatan pakan dan kebersihan kandang hari ini
      </p>

      {/* Toggle Tabs */}
      <div className="flex justify-center gap-2 mb-3">
        {(["pakan", "kandang"] as const).map((t) => {
          const totalBelum =
            t === "pakan" ? countBelum(penugasanPakan) : countBelum(penugasanKandang);
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                tab === t
                  ? "bg-yellow-500 text-black"
                  : "bg-yellow-900 hover:bg-yellow-700 text-white"
              }`}
            >
              {t === "pakan" ? "Pemberian Pakan" : "Pembersihan Kandang"}
              {totalBelum > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-red-500 text-white rounded-full">
                  {totalBelum}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tabel Penugasan Pakan */}
      {tab === "pakan" && (
        <div className="overflow-x-auto rounded-lg bg-white/5">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-farmdarkgreen/70 uppercase text-gray-300">
              <tr>
                <th className="py-2 px-3">No</th>
                <th className="py-2 px-3">Penugasan</th>
                <th className="py-2 px-3">Jam</th>
                <th className="py-2 px-3">Kelompok Ternak</th>
                <th className="py-2 px-3">Petugas</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-center">Lihat</th>
              </tr>
            </thead>
            <tbody>
              {penugasanPakan.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-farmgrassgreen/5" : "bg-farmgrassgreen/10"}
                >
                  <td className="py-2 px-3">{item.id}</td>
                  <td className="py-2 px-3">{item.penugasan}</td>
                  <td className="py-2 px-3">{item.jam}</td>
                  <td className="py-2 px-3">{item.kelompok}</td>
                  <td className="py-2 px-3">{item.petugas}</td>
                  <td className="py-2 px-3">{renderStatus(item.status)}</td>
                  <td className="py-2 px-3 text-center">
                    <button className="p-1 rounded hover:bg-yellow-600/20 transition">
                      <LuSearch className="w-4 h-4 text-yellow-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabel Penugasan Kandang */}
      {tab === "kandang" && (
        <div className="overflow-x-auto rounded-lg bg-white/5">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-farmdarkgreen/70 uppercase text-gray-300">
              <tr>
                <th className="py-2 px-3">No</th>
                <th className="py-2 px-3">Tanggal/Waktu</th>
                <th className="py-2 px-3">Kandang</th>
                <th className="py-2 px-3">Petugas</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-center">Lihat</th>
              </tr>
            </thead>
            <tbody>
              {penugasanKandang.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-farmgrassgreen/5" : "bg-farmgrassgreen/10"}
                >
                  <td className="py-2 px-3">{item.id}</td>
                  <td className="py-2 px-3">{item.waktu}</td>
                  <td className="py-2 px-3">{item.kandang}</td>
                  <td className="py-2 px-3">{item.petugas}</td>
                  <td className="py-2 px-3">{renderStatus(item.status)}</td>
                  <td className="py-2 px-3 text-center">
                    <button className="p-1 rounded hover:bg-yellow-600/20 transition">
                      <LuSearch className="w-4 h-4 text-kemenkeuyellow" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
