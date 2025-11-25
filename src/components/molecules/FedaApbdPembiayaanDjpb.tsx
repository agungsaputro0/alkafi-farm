import React, { useState } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";

const FedaApbdPembiayaanDjpb: React.FC = () => {
  // State untuk tiap input
  const [targetApbdPembiayaanDjpb, setTargetApbdPembiayaanDjpb] = useState({
    penerimaanPembiayaan: "",
    pengeluaranPembiayaan: "",
  });

  const [realisasiApbdPembiayaanDjpb, setRealisasiApbdPembiayaanDjpb] = useState({
    penerimaanPembiayaan: "",
    pengeluaranPembiayaan: "",
  });

  // Handler untuk kolom Target
  const handleTargetChange = (field: keyof typeof targetApbdPembiayaanDjpb, value: string) => {
    setTargetApbdPembiayaanDjpb((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  // Handler untuk kolom Realisasi
  const handleRealisasiChange = (field: keyof typeof realisasiApbdPembiayaanDjpb, value: string) => {
    setRealisasiApbdPembiayaanDjpb((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  return (
    <>
    <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">Direktorat Jenderal Perbendaharaan</h2>
    <div className="grid grid-cols-3 gap-8">
      {/* Target Anggaran */}
      <div className="border-2 p-4 bg-kemenkeubluesoft rounded-xl border-dashed border-gray-400">
        <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">TARGET ANGGARAN</h2>
        <InputElement
          inputClass="mb-6"
          forwhat="penerimaanPembiayaanTarget"
          labelMessage="Penerimaan Pembiayaan"
          typeInput="text"
          inputName="penerimaanPembiayaanTarget"
          inputPlaceholder="Masukkan angka"
          value={targetApbdPembiayaanDjpb.penerimaanPembiayaan}
          onChange={(e) => handleTargetChange("penerimaanPembiayaan", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="pengeluaranPembiayaanTarget"
          labelMessage="Pengeluaran Pembiayaan"
          typeInput="text"
          inputName="pengeluaranPembiayaanTarget"
          inputPlaceholder="Masukkan angka"
          value={targetApbdPembiayaanDjpb.pengeluaranPembiayaan}
          onChange={(e) => handleTargetChange("pengeluaranPembiayaan", e.target.value)}
        />
      </div>

      {/* Realisasi */}
      <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
        <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">REALISASI</h2>
        <InputElement
          inputClass="mb-6"
          forwhat="penerimaanPembiayaanRealisasi"
          labelMessage="Penerimaan Pembiayaan"
          typeInput="text"
          inputName="penerimaanPembiayaanRealisasi"
          inputPlaceholder="Masukkan angka"
          value={realisasiApbdPembiayaanDjpb.penerimaanPembiayaan}
          onChange={(e) => handleRealisasiChange("penerimaanPembiayaan", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="pengeluaranPembiayaanRealisasi"
          labelMessage="Pengeluaran Pembiayaan"
          typeInput="text"
          inputName="pengeluaranPembiayaanRealisasi"
          inputPlaceholder="Masukkan angka"
          value={realisasiApbdPembiayaanDjpb.pengeluaranPembiayaan}
          onChange={(e) => handleRealisasiChange("pengeluaranPembiayaan", e.target.value)}
        />
      </div>

      {/* Presentase */}
      <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
        <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
          PERSENTASE
        </h2>

        {[
          { label: "Penerimaan Pembiayaan", value: calculatePercentage(targetApbdPembiayaanDjpb.penerimaanPembiayaan, realisasiApbdPembiayaanDjpb.penerimaanPembiayaan) },
          { label: "Pengeluaran Pembiayaan", value: calculatePercentage(targetApbdPembiayaanDjpb.pengeluaranPembiayaan, realisasiApbdPembiayaanDjpb.pengeluaranPembiayaan) },
        ].map((item) => {
          // Tentukan warna berdasarkan range
          let colorClass = "text-black"; // default untuk "-"
          if (item.value !== "-") {
            // Ubah "1.234,56%" -> 1234.56
            const numeric = parseFloat(
              item.value
                .replace(/\./g, "")  // hapus titik ribuan
                .replace(",", ".")    // ubah koma desimal
                .replace("%", "")     // hapus persen
            );

            if (numeric >= 100) colorClass = "text-green-600";
            else if (numeric >= 50) colorClass = "text-kemenkeuyellow";
            else colorClass = "text-red-600";
          }

          return (
            <div
              key={item.label}
              className="flex h-[65px] justify-between items-center mb-[20px] py-2 px-4 border rounded bg-white/30"
            >
              <span className="text-kemenkeublue font-semibold pr-4">{item.label}</span>
              <span className={`text-2xl font-bold ${colorClass} whitespace-nowrap`}>{item.value}</span>
            </div>
          );
        })}
      </div>

      {/* Summary Report */}
      <div className="col-span-3">
        <h2 className="font-semibold mb-2 text-gray-800">Summary Report</h2>
        <textarea
          className="w-full min-h-[42px] border-2 border-gray-500 rounded-xl p-2 text-black"
          rows={3}
          placeholder="Masukkan ringkasan laporan"
        />
      </div>
    </div>
    </>
  );
};

export default FedaApbdPembiayaanDjpb;
