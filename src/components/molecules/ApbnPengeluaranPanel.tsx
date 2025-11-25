import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Button from "../atoms/Button";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";

interface Pos {
  id_pos: number;
  id_instansi: number | null;
  nama_pos: string;
}

interface ApbnPengeluaranPanelProps {
  tahun: string;
  bulan: string;
  provinsi: string;
  instansi: string;
  kantor: string;
  posList: Pos[];
  title: string; // Judul panel (misalnya: "Belanja Pemerintah Pusat")
  loadingPos?: boolean;
  errorPos?: string | null;
}

const ApbnPengeluaranPanel: React.FC<ApbnPengeluaranPanelProps> = ({
  tahun,
  bulan,
  provinsi,
  instansi,
  kantor,
  posList,
  title,
  loadingPos,
  errorPos,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, _setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  // Update tinggi panel saat expand/collapse
  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded, posList]);

  // State dinamis berbasis posList
  const [targetValues, setTargetValues] = useState<Record<number, string>>({});
  const [realisasiValues, setRealisasiValues] = useState<Record<number, string>>({});
  const [summary, setSummary] = useState("");

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

  const handleTargetChange = (id_pos: number, value: string) => {
    setTargetValues((prev) => ({
      ...prev,
      [id_pos]: formatNumber(value),
    }));
  };

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
    console.log("📤 Data Panel terkirim:", payload);
    // TODO: axios.post ke backend sesuai kebutuhan
  };

  if (loadingPos) return <p>Loading data pos...</p>;
  if (errorPos) return <p>Error: {errorPos}</p>;

  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      {/* Header Panel */}
      <div
        className="flex justify-between items-center cursor-pointer p-5 transition-colors duration-300 bg-kemenkeublue text-kemenkeuyellow"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <FaChevronDown
          className={`text-xl transition-transform duration-300 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Content Panel */}
      <div
        style={{ height }}
        className="overflow-hidden transition-all duration-600"
        ref={contentRef}
      >
        <div className="p-5 bg-white">
          <form onSubmit={handleSubmit}>
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
            <Button
              type="submit"
              variant="bg-kemenkeuyellow w-full hover:bg-amber-600 mt-4"
              disabled={loading}
              message="Submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApbnPengeluaranPanel;
