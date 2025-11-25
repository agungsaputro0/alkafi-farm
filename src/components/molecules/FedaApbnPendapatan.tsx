import React, { useState, useEffect } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";
import Button from "../atoms/Button";

interface Pos {
  id_pos: number;
  id_instansi: number | null;
  nama_pos: string;
}

interface FedaApbnPendapatanProps {
  tahun: string;
  bulan: string;
  provinsi: string;
  instansi: string;
  kantor: string;
  posList: Pos[];
  loadingPos?: boolean;
  errorPos?: string | null;
  title: string; // ✅ judul instansi/dirjen
}

const FedaApbnPendapatan: React.FC<FedaApbnPendapatanProps> = ({
  tahun,
  bulan,
  provinsi,
  instansi,
  kantor,
  posList,
  loadingPos,
  errorPos,
  title,
}) => {
  const [loading, _setLoading] = useState<boolean>(false);

  // State untuk target & realisasi, key adalah id_pos
  const [targetValues, setTargetValues] = useState<Record<number, string>>({});
  const [realisasiValues, setRealisasiValues] = useState<Record<number, string>>({});

  const [summary, setSummary] = useState("");

  // Inisialisasi state berdasarkan posList
  useEffect(() => {
    const initialTarget: Record<number, string> = {};
    const initialRealisasi: Record<number, string> = {};
    posList.forEach((pos) => {
      initialTarget[pos.id_pos] = "";
      initialRealisasi[pos.id_pos] = "";
    });
    setTargetValues(initialTarget);
    setRealisasiValues(initialRealisasi);
  }, [posList]);

  // Handler untuk kolom Target
  const handleTargetChange = (id_pos: number, value: string) => {
    setTargetValues((prev) => ({
      ...prev,
      [id_pos]: formatNumber(value),
    }));
  };

  // Handler untuk kolom Realisasi
  const handleRealisasiChange = (id_pos: number, value: string) => {
    setRealisasiValues((prev) => ({
      ...prev,
      [id_pos]: formatNumber(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      tahun,
      bulan,
      provinsi,
      instansi,
      kantor,
      target: targetValues,
      realisasi: realisasiValues,
      summary,
    };

    console.log("📤 Data terkirim:", payload);

    // TODO: panggil API backend disini
  };

  if (loadingPos) return <p>Loading pos...</p>;
  if (errorPos) return <p>Error: {errorPos}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">
        {title}
      </h2>

      <div className="grid grid-cols-3 gap-8">
        {/* Target Anggaran */}
        <div className="border-2 p-4 bg-kemenkeubluesoft rounded-xl border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            TARGET ANGGARAN
          </h2>
          {posList.map((pos) => (
            <InputElement
              key={`target-${pos.id_pos}`}
              inputClass="mb-6"
              forwhat={`target-${pos.id_pos}`}
              labelMessage={pos.nama_pos}
              typeInput="text"
              inputName={`target-${pos.id_pos}`}
              inputPlaceholder="Masukkan angka"
              value={targetValues[pos.id_pos] || ""}
              onChange={(e) => handleTargetChange(pos.id_pos, e.target.value)}
            />
          ))}
        </div>

        {/* Realisasi */}
        <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            REALISASI
          </h2>
          {posList.map((pos) => (
            <InputElement
              key={`realisasi-${pos.id_pos}`}
              inputClass="mb-6"
              forwhat={`realisasi-${pos.id_pos}`}
              labelMessage={pos.nama_pos}
              typeInput="text"
              inputName={`realisasi-${pos.id_pos}`}
              inputPlaceholder="Masukkan angka"
              value={realisasiValues[pos.id_pos] || ""}
              onChange={(e) => handleRealisasiChange(pos.id_pos, e.target.value)}
            />
          ))}
        </div>

        {/* Persentase */}
        <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
            PERSENTASE
          </h2>
          {posList.map((pos) => {
            const target = targetValues[pos.id_pos] || "";
            const realisasi = realisasiValues[pos.id_pos] || "";
            const value = calculatePercentage(target, realisasi);

            let colorClass = "text-black";
            if (value !== "-") {
              const numeric = parseFloat(
                value.replace(/\./g, "").replace(",", ".").replace("%", "")
              );
              if (numeric >= 100) colorClass = "text-green-600";
              else if (numeric >= 50) colorClass = "text-kemenkeuyellow";
              else colorClass = "text-red-600";
            }

            return (
              <div
                key={`persentase-${pos.id_pos}`}
                className="flex h-[65px] justify-between items-center mb-[20px] py-2 px-4 border rounded bg-white/30"
              >
                <span className="text-kemenkeublue font-semibold pr-4">{pos.nama_pos}</span>
                <span className={`text-2xl font-bold ${colorClass} whitespace-nowrap`}>
                  {value}
                </span>
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
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </div>

      {/* Tombol Submit */}
      <div className="col-span-3 mt-6">
        <Button
          type="submit"
          variant="bg-kemenkeuyellow w-full hover:bg-amber-600 mt-4"
          message="Submit"
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default FedaApbnPendapatan;
