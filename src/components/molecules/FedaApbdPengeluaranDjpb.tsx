import React, { useState } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";

const FedaApbdPengeluaranDjpb: React.FC = () => {
  // State untuk tiap input
  const [targetApbdPengeluaranDjpb, setTargetApbdPengeluaranDjpb] = useState({
    belanjaOperasi: "",
    belanjaModal: "",
    belanjaTakTerduga: "",
    belanjaTransfer: "",
  });

  const [realisasiApbdPengeluaranDjpb, setRealisasiApbdPengeluaranDjpb] = useState({
    belanjaOperasi: "",
    belanjaModal: "",
    belanjaTakTerduga: "",
    belanjaTransfer: "",
  });

  // Handler untuk kolom Target
  const handleTargetChange = (field: keyof typeof targetApbdPengeluaranDjpb, value: string) => {
    setTargetApbdPengeluaranDjpb((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  // Handler untuk kolom Realisasi
  const handleRealisasiChange = (field: keyof typeof realisasiApbdPengeluaranDjpb, value: string) => {
    setRealisasiApbdPengeluaranDjpb((prev) => ({
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
          forwhat="belanjaOperasiTarget"
          labelMessage="Belanja Operasi"
          typeInput="text"
          inputName="belanjaOperasiTarget"
          inputPlaceholder="Masukkan angka"
          value={targetApbdPengeluaranDjpb.belanjaOperasi}
          onChange={(e) => handleTargetChange("belanjaOperasi", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaModalTarget"
          labelMessage="Belanja Modal"
          typeInput="text"
          inputName="belanjaModalTarget"
          inputPlaceholder="Masukkan angka"
          value={targetApbdPengeluaranDjpb.belanjaModal}
          onChange={(e) => handleTargetChange("belanjaModal", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaTakTerdugaTarget"
          labelMessage="Belanja Tak Terduga"
          typeInput="text"
          inputName="belanjaTakTerdugaTarget"
          inputPlaceholder="Masukkan angka"
          value={targetApbdPengeluaranDjpb.belanjaTakTerduga}
          onChange={(e) => handleTargetChange("belanjaTakTerduga", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaTransferTarget"
          labelMessage="Belanja Transfer"
          typeInput="text"
          inputName="belanjaTransferTarget"
          inputPlaceholder="Masukkan angka"
          value={targetApbdPengeluaranDjpb.belanjaTransfer}
          onChange={(e) => handleTargetChange("belanjaTransfer", e.target.value)}
        />
      </div>

      {/* Realisasi */}
      <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
        <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">REALISASI</h2>
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaOperasiRealisasi"
          labelMessage="Belanja Operasi"
          typeInput="text"
          inputName="belanjaOperasiRealisasi"
          inputPlaceholder="Masukkan angka"
          value={realisasiApbdPengeluaranDjpb.belanjaOperasi}
          onChange={(e) => handleRealisasiChange("belanjaOperasi", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaModalRealisasi"
          labelMessage="Belanja Modal"
          typeInput="text"
          inputName="belanjaModalRealisasi"
          inputPlaceholder="Masukkan angka"
          value={realisasiApbdPengeluaranDjpb.belanjaModal}
          onChange={(e) => handleRealisasiChange("belanjaModal", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaTakTerdugaRealisasi"
          labelMessage="Belanja Tak Terduga"
          typeInput="text"
          inputName="belanjaTakTerdugaRealisasi"
          inputPlaceholder="Masukkan angka"
          value={realisasiApbdPengeluaranDjpb.belanjaTakTerduga}
          onChange={(e) => handleRealisasiChange("belanjaTakTerduga", e.target.value)}
        />
        <InputElement
          inputClass="mb-6"
          forwhat="belanjaTransferRealisasi"
          labelMessage="Belanja Transfer"
          typeInput="text"
          inputName="belanjaTransferRealisasi"
          inputPlaceholder="Masukkan angka"
          value={realisasiApbdPengeluaranDjpb.belanjaTransfer}
          onChange={(e) => handleRealisasiChange("belanjaTransfer", e.target.value)}
        />
      </div>

      {/* Presentase */}
      <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
        <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
          PERSENTASE
        </h2>

        {[
          { label: "Belanja Operasi", value: calculatePercentage(targetApbdPengeluaranDjpb.belanjaOperasi, realisasiApbdPengeluaranDjpb.belanjaOperasi) },
          { label: "Belanja Modal", value: calculatePercentage(targetApbdPengeluaranDjpb.belanjaModal, realisasiApbdPengeluaranDjpb.belanjaModal) },
          { label: "Belanja Tak Terduga", value: calculatePercentage(targetApbdPengeluaranDjpb.belanjaTakTerduga, realisasiApbdPengeluaranDjpb.belanjaTakTerduga) },
          { label: "Belanja Transfer", value: calculatePercentage(targetApbdPengeluaranDjpb.belanjaTransfer, realisasiApbdPengeluaranDjpb.belanjaTransfer) },
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

export default FedaApbdPengeluaranDjpb;
