import React, { useState } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";
type Props = {
  tahun: string;
  bulan: string;
  provinsi: string;
  instansi: string;
  kantor: string;
};

const FedaApbnPendapatanDjpb: React.FC<Props> = ({ tahun, bulan, provinsi, instansi, kantor }) => {
  // State untuk tiap input
  const [targetDjpb, setTargetDjpb] = useState({
    pendapatanBlu: "",
    penerimaanHibah: "",
    pnbpLainnya: "",
  });

  const [realisasiDjpb, setRealisasiDjpb] = useState({
    pendapatanBlu: "",
    penerimaanHibah: "",
    pnbpLainnya: "",
  });

  // Handler untuk kolom Target
  const handleTargetChange = (field: keyof typeof targetDjpb, value: string) => {
    setTargetDjpb((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  // Handler untuk kolom Realisasi
  const handleRealisasiChange = (field: keyof typeof realisasiDjpb, value: string) => {
    setRealisasiDjpb((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  return (
    <>
      {/* 🔹 Info yang dipassing dari parent */}
      <div className="mb-4 p-4 bg-slate-100 rounded-xl border">
        <p><strong>Tahun:</strong> {tahun}</p>
        <p><strong>Bulan:</strong> {bulan}</p>
        <p><strong>Provinsi:</strong> {provinsi}</p>
        <p><strong>Instansi:</strong> {instansi}</p>
        <p><strong>Kantor:</strong> {kantor}</p>
      </div>

      <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">
        Direktorat Jenderal Perbendaharaan
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {/* Target Anggaran */}
        <div className="border-2 p-4 bg-kemenkeubluesoft rounded-xl border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            TARGET ANGGARAN
          </h2>
          <InputElement
            inputClass="mb-6"
            forwhat="pendapatanBluTarget"
            labelMessage="Pendapatan BLU"
            typeInput="text"
            inputName="pendapatanBluTarget"
            inputPlaceholder="Masukkan angka"
            value={targetDjpb.pendapatanBlu}
            onChange={(e) => handleTargetChange("pendapatanBlu", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="penerimaanHibahTarget"
            labelMessage="Penerimaan Hibah"
            typeInput="text"
            inputName="penerimaanHibahTarget"
            inputPlaceholder="Masukkan angka"
            value={targetDjpb.penerimaanHibah}
            onChange={(e) => handleTargetChange("penerimaanHibah", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pnbpTarget"
            labelMessage="PNBP Lainnya"
            typeInput="text"
            inputName="pnbpTarget"
            inputPlaceholder="Masukkan angka"
            value={targetDjpb.pnbpLainnya}
            onChange={(e) => handleTargetChange("pnbpLainnya", e.target.value)}
          />
        </div>

        {/* Realisasi */}
        <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            REALISASI
          </h2>
          <InputElement
            inputClass="mb-6"
            forwhat="pendapatanBluRealisasi"
            labelMessage="Pendapatan BLU"
            typeInput="text"
            inputName="pendapatanBluRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiDjpb.pendapatanBlu}
            onChange={(e) => handleRealisasiChange("pendapatanBlu", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="penerimaanHibahRealisasi"
            labelMessage="Penerimaan Hibah"
            typeInput="text"
            inputName="penerimaanHibahRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiDjpb.penerimaanHibah}
            onChange={(e) => handleRealisasiChange("penerimaanHibah", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pnbpRealisasi"
            labelMessage="PNBP Lainnya"
            typeInput="text"
            inputName="pnbpRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiDjpb.pnbpLainnya}
            onChange={(e) => handleRealisasiChange("pnbpLainnya", e.target.value)}
          />
        </div>

        {/* Persentase */}
        <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            PERSENTASE
          </h2>

          {[
            { label: "Pendapatan BLU", value: calculatePercentage(targetDjpb.pendapatanBlu, realisasiDjpb.pendapatanBlu) },
            { label: "Penerimaan Hibah", value: calculatePercentage(targetDjpb.penerimaanHibah, realisasiDjpb.penerimaanHibah) },
            { label: "PNBP Lainnya", value: calculatePercentage(targetDjpb.pnbpLainnya, realisasiDjpb.pnbpLainnya) },
          ].map((item) => {
            let colorClass = "text-black";
            if (item.value !== "-") {
              const numeric = parseFloat(
                item.value.replace(/\./g, "").replace(",", ".").replace("%", "")
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

export default FedaApbnPendapatanDjpb;
