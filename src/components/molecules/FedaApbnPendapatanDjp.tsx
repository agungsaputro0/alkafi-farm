import React, { useState } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";

// 🔹 Definisikan tipe props biar aman
interface FedaApbnPendapatanDjpProps {
  tahun: string;
  bulan: string;
  provinsi: string;
  instansi: string;
  kantor: string;
}

const FedaApbnPendapatanDjp: React.FC<FedaApbnPendapatanDjpProps> = ({
  tahun,
  bulan,
  provinsi,
  instansi,
  kantor,
}) => {
  const [targetPajak, setTargetPajak] = useState({
    pajakPenghasilan: "",
    pajakPertambahan: "",
    pajakBumi: "",
    pajakLainnya: "",
    saldoDeposit: "",
  });

  const [realisasiPajak, setRealisasiPajak] = useState({
    pajakPenghasilan: "",
    pajakPertambahan: "",
    pajakBumi: "",
    pajakLainnya: "",
    saldoDeposit: "",
  });

  const handleTargetChange = (field: keyof typeof targetPajak, value: string) => {
    setTargetPajak((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  const handleRealisasiChange = (field: keyof typeof realisasiPajak, value: string) => {
    setRealisasiPajak((prev) => ({
      ...prev,
      [field]: formatNumber(value),
    }));
  };

  return (
    <>
      {/* 🔹 Bisa pakai props untuk debug */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p><b>Tahun:</b> {tahun}</p>
        <p><b>Bulan:</b> {bulan}</p>
        <p><b>Provinsi:</b> {provinsi}</p>
        <p><b>Instansi:</b> {instansi}</p>
        <p><b>Kantor:</b> {kantor}</p>
      </div>

      <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">
        Direktorat Jenderal Pajak
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {/* Target Anggaran */}
        <div className="border-2 p-4 bg-kemenkeubluesoft rounded-xl border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">TARGET ANGGARAN</h2>
          <InputElement
            inputClass="mb-6"
            forwhat="pajakPenghasilanTarget"
            labelMessage="Pajak Penghasilan non migas"
            typeInput="text"
            inputName="pajakPenghasilanTarget"
            inputPlaceholder="Masukkan angka"
            value={targetPajak.pajakPenghasilan}
            onChange={(e) => handleTargetChange("pajakPenghasilan", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pajakPertambahanTarget"
            labelMessage="Pajak Pertambahan nilai"
            typeInput="text"
            inputName="pajakPertambahanTarget"
            inputPlaceholder="Masukkan angka"
            value={targetPajak.pajakPertambahan}
            onChange={(e) => handleTargetChange("pajakPertambahan", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pajakBumiTarget"
            labelMessage="Pajak Bumi & Bangunan"
            typeInput="text"
            inputName="pajakBumiTarget"
            inputPlaceholder="Masukkan angka"
            value={targetPajak.pajakBumi}
            onChange={(e) => handleTargetChange("pajakBumi", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pajakLainnyaTarget"
            labelMessage="Pajak lainnya"
            typeInput="text"
            inputName="pajakLainnyaTarget"
            inputPlaceholder="Masukkan angka"
            value={targetPajak.pajakLainnya}
            onChange={(e) => handleTargetChange("pajakLainnya", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="saldoDepositTarget"
            labelMessage="Saldo deposit penerimaan"
            typeInput="text"
            inputName="saldoDepositTarget"
            inputPlaceholder="Masukkan angka"
            value={targetPajak.saldoDeposit}
            onChange={(e) => handleTargetChange("saldoDeposit", e.target.value)}
          />
        </div>

        {/* Realisasi */}
        <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">REALISASI</h2>
          <InputElement
            inputClass="mb-6"
            forwhat="pajakPenghasilanRealisasi"
            labelMessage="Pajak Penghasilan non migas"
            typeInput="text"
            inputName="pajakPenghasilanRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiPajak.pajakPenghasilan}
            onChange={(e) => handleRealisasiChange("pajakPenghasilan", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pajakPertambahanRealisasi"
            labelMessage="Pajak Pertambahan nilai"
            typeInput="text"
            inputName="pajakPertambahanRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiPajak.pajakPertambahan}
            onChange={(e) => handleRealisasiChange("pajakPertambahan", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pajakBumiRealisasi"
            labelMessage="Pajak Bumi & Bangunan"
            typeInput="text"
            inputName="pajakBumiRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiPajak.pajakBumi}
            onChange={(e) => handleRealisasiChange("pajakBumi", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="pajakLainnyaRealisasi"
            labelMessage="Pajak lainnya"
            typeInput="text"
            inputName="pajakLainnyaRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiPajak.pajakLainnya}
            onChange={(e) => handleRealisasiChange("pajakLainnya", e.target.value)}
          />
          <InputElement
            inputClass="mb-6"
            forwhat="saldoDepositRealisasi"
            labelMessage="Saldo deposit penerimaan"
            typeInput="text"
            inputName="saldoDepositRealisasi"
            inputPlaceholder="Masukkan angka"
            value={realisasiPajak.saldoDeposit}
            onChange={(e) => handleRealisasiChange("saldoDeposit", e.target.value)}
          />
        </div>

        {/* Presentase */}
        <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            PERSENTASE
          </h2>

          {[
            { label: "Pajak Penghasilan Non Migas", value: calculatePercentage(targetPajak.pajakPenghasilan, realisasiPajak.pajakPenghasilan) },
            { label: "Pajak Pertambahan Nilai", value: calculatePercentage(targetPajak.pajakPertambahan, realisasiPajak.pajakPertambahan) },
            { label: "Pajak Bumi & Bangunan", value: calculatePercentage(targetPajak.pajakBumi, realisasiPajak.pajakBumi) },
            { label: "Pajak Lainnya", value: calculatePercentage(targetPajak.pajakLainnya, realisasiPajak.pajakLainnya) },
            { label: "Saldo Deposit Penerimaan", value: calculatePercentage(targetPajak.saldoDeposit, realisasiPajak.saldoDeposit) },
          ].map((item) => {
            let colorClass = "text-black";
            if (item.value !== "-") {
              const numeric = parseFloat(
                item.value
                  .replace(/\./g, "")
                  .replace(",", ".")
                  .replace("%", "")
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

export default FedaApbnPendapatanDjp;
