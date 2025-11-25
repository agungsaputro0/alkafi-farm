import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Button from "../atoms/Button";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";

const PendapatanDariDanaTransferPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [loading, _setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
        setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded]);

  const [targetPendapatanDariDanaTransfer, setTargetPendapatanDariDanaTransfer] = useState({
      PendapatanDariDanaTransferPusat: "",
    });
  
    const [realisasiPendapatanDariDanaTransfer, setRealisasiPendapatanDariDanaTransfer] = useState({
      PendapatanDariDanaTransferPusat: "",
    });
  
    // Handler untuk kolom Target
    const handleTargetChange = (field: keyof typeof targetPendapatanDariDanaTransfer, value: string) => {
      setTargetPendapatanDariDanaTransfer((prev) => ({
        ...prev,
        [field]: formatNumber(value),
      }));
    };
  
    // Handler untuk kolom Realisasi
    const handleRealisasiChange = (field: keyof typeof realisasiPendapatanDariDanaTransfer, value: string) => {
      setRealisasiPendapatanDariDanaTransfer((prev) => ({
        ...prev,
        [field]: formatNumber(value),
      }));
    };

  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      {/* Judul utama dengan chevron */}
       <div
              className="flex justify-between items-center cursor-pointer p-5 transition-colors duration-300 bg-kemenkeublue text-kemenkeuyellow"
              onClick={() => setExpanded(!expanded)}
              >
              <h2 className="text-xl font-semibold">Pendapatan Dari Dana Transfer</h2>
              <FaChevronDown
                  className={`text-xl transition-transform duration-300 ${
                  expanded ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>

      {/* Area konten yang muncul secara smooth */}
      <div
         style={{ height }}
         className="overflow-hidden transition-all duration-600"
         ref={contentRef}
      >
        <div className="p-5 bg-white">
            <form /* onSubmit={handleFormSubmit} onKeyDown={handleKeyDown} */>
                <div className="grid grid-cols-3 gap-8">
                {/* Target Anggaran */}
                <div className="border-2 p-4 bg-kemenkeubluesoft rounded-xl border-dashed border-gray-400">
                    <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">TARGET ANGGARAN</h2>
                    <InputElement
                    inputClass="mb-6"
                    forwhat="PendapatanDariDanaTransferPusatTarget"
                    labelMessage="Pendapatan Dari Dana Transfer Pusat"
                    typeInput="text"
                    inputName="PendapatanDariDanaTransferPusatTarget"
                    inputPlaceholder="Masukkan angka"
                    value={targetPendapatanDariDanaTransfer.PendapatanDariDanaTransferPusat}
                    onChange={(e) => handleTargetChange("PendapatanDariDanaTransferPusat", e.target.value)}
                    />
                </div>

                {/* Realisasi */}
                <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
                    <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">REALISASI</h2>
                    <InputElement
                    inputClass="mb-6"
                    forwhat="PendapatanDariDanaTransferPusatRealisasi"
                    labelMessage="Pendapatan Dari Dana Transfer Pusat"
                    typeInput="text"
                    inputName="PendapatanDariDanaTransferPusatRealisasi"
                    inputPlaceholder="Masukkan angka"
                    value={realisasiPendapatanDariDanaTransfer.PendapatanDariDanaTransferPusat}
                    onChange={(e) => handleRealisasiChange("PendapatanDariDanaTransferPusat", e.target.value)}
                    />
                </div>

                {/* Presentase */}
                <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
                    <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
                    PERSENTASE
                    </h2>

                    {[
                    { label: "Pendapatan Dari Dana Transfer Pusat", value: calculatePercentage(targetPendapatanDariDanaTransfer.PendapatanDariDanaTransferPusat, realisasiPendapatanDariDanaTransfer.PendapatanDariDanaTransferPusat) },
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
                        <span className="text-kemenkeublue font-semibold pr-4 line-clamp-2">{item.label}</span>
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

export default PendapatanDariDanaTransferPanel;
