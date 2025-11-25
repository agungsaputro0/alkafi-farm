import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Button from "../atoms/Button";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage } from "../utils/FormatNumberWithDelimiter";

const PendapatanAsliDaerahPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [loading, _setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
        setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded]);

  const [targetPendapatanAsliDaerah, setTargetPendapatanAsliDaerah] = useState({
      pajakDaerah: "",
      retribusiDaerah: "",
      hasilKekayaanNegaraYangDipisahkan: "",
      lainLainPadYangSah: "",
    });
  
    const [realisasiPendapatanAsliDaerah, setRealisasiPendapatanAsliDaerah] = useState({
      pajakDaerah: "",
      retribusiDaerah: "",
      hasilKekayaanNegaraYangDipisahkan: "",
      lainLainPadYangSah: "",
    });
  
    // Handler untuk kolom Target
    const handleTargetChange = (field: keyof typeof targetPendapatanAsliDaerah, value: string) => {
      setTargetPendapatanAsliDaerah((prev) => ({
        ...prev,
        [field]: formatNumber(value),
      }));
    };
  
    // Handler untuk kolom Realisasi
    const handleRealisasiChange = (field: keyof typeof realisasiPendapatanAsliDaerah, value: string) => {
      setRealisasiPendapatanAsliDaerah((prev) => ({
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
              <h2 className="text-xl font-semibold">Pendapatan Asli Daerah</h2>
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
                    forwhat="pajakDaerahTarget"
                    labelMessage="Pajak Daerah"
                    typeInput="text"
                    inputName="pajakDaerahTarget"
                    inputPlaceholder="Masukkan angka"
                    value={targetPendapatanAsliDaerah.pajakDaerah}
                    onChange={(e) => handleTargetChange("pajakDaerah", e.target.value)}
                    />
                    <InputElement
                    inputClass="mb-6"
                    forwhat="retribusiDaerahTarget"
                    labelMessage="Retribusi Daerah"
                    typeInput="text"
                    inputName="retribusiDaerahTarget"
                    inputPlaceholder="Masukkan angka"
                    value={targetPendapatanAsliDaerah.retribusiDaerah}
                    onChange={(e) => handleTargetChange("retribusiDaerah", e.target.value)}
                    />
                    <InputElement
                    inputClass="mb-6"
                    forwhat="hasilKekayaanNegaraYangDipisahkanTarget"
                    labelMessage="Hasil Kekayaan Negara yang Dipisahkan"
                    typeInput="text"
                    inputName="hasilKekayaanNegaraYangDipisahkanTarget"
                    inputPlaceholder="Masukkan angka"
                    value={targetPendapatanAsliDaerah.hasilKekayaanNegaraYangDipisahkan}
                    onChange={(e) => handleTargetChange("hasilKekayaanNegaraYangDipisahkan", e.target.value)}
                    />
                    <InputElement
                    inputClass="mb-6"
                    forwhat="lainLainPadYangSahTarget"
                    labelMessage="Lain-lain PAD yang Sah"
                    typeInput="text"
                    inputName="lainLainPadYangSahTarget"
                    inputPlaceholder="Masukkan angka"
                    value={targetPendapatanAsliDaerah.lainLainPadYangSah}
                    onChange={(e) => handleTargetChange("lainLainPadYangSah", e.target.value)}
                    />
                </div>

                {/* Realisasi */}
                <div className="p-4 rounded-xl bg-kemenkeuyellowsoft border-2 border-dashed border-gray-400">
                    <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">REALISASI</h2>
                    <InputElement
                    inputClass="mb-6"
                    forwhat="pajakDaerahRealisasi"
                    labelMessage="Pajak Daerah"
                    typeInput="text"
                    inputName="pajakDaerahRealisasi"
                    inputPlaceholder="Masukkan angka"
                    value={realisasiPendapatanAsliDaerah.pajakDaerah}
                    onChange={(e) => handleRealisasiChange("pajakDaerah", e.target.value)}
                    />
                    <InputElement
                    inputClass="mb-6"
                    forwhat="retribusiDaerahRealisasi"
                    labelMessage="Retribusi Daerah"
                    typeInput="text"
                    inputName="retribusiDaerahRealisasi"
                    inputPlaceholder="Masukkan angka"
                    value={realisasiPendapatanAsliDaerah.retribusiDaerah}
                    onChange={(e) => handleRealisasiChange("retribusiDaerah", e.target.value)}
                    />
                    <InputElement
                    inputClass="mb-6"
                    forwhat="hasilKekayaanNegaraYangDipisahkanRealisasi"
                    labelMessage="Hasil Kekayaan Negara yang Dipisahkan"
                    typeInput="text"
                    inputName="hasilKekayaanNegaraYangDipisahkanRealisasi"
                    inputPlaceholder="Masukkan angka"
                    value={realisasiPendapatanAsliDaerah.hasilKekayaanNegaraYangDipisahkan}
                    onChange={(e) => handleRealisasiChange("hasilKekayaanNegaraYangDipisahkan", e.target.value)}
                    />
                    <InputElement
                    inputClass="mb-6"
                    forwhat="lainLainPadYangSahRealisasi"
                    labelMessage="Lain-lain PAD yang Sah"
                    typeInput="text"
                    inputName="lainLainPadYangSahRealisasi"
                    inputPlaceholder="Masukkan angka"
                    value={realisasiPendapatanAsliDaerah.lainLainPadYangSah}
                    onChange={(e) => handleRealisasiChange("lainLainPadYangSah", e.target.value)}
                    />
                </div>

                {/* Presentase */}
                <div className="p-4 rounded-xl bg-kemenkeubluesoft/30 border-2 border-dashed border-gray-400">
                    <h2 className="font-bold mb-4 text-center text-kemenkeublue text-2xl border-b border-slate-400 pb-4">
                    PERSENTASE
                    </h2>

                    {[
                    { label: "Pajak Daerah", value: calculatePercentage(targetPendapatanAsliDaerah.pajakDaerah, realisasiPendapatanAsliDaerah.pajakDaerah) },
                    { label: "Retribusi Daerah", value: calculatePercentage(targetPendapatanAsliDaerah.retribusiDaerah, realisasiPendapatanAsliDaerah.retribusiDaerah) },
                    { label: "Hasil Kekayaan Negara yang Dipisahkan", value: calculatePercentage(targetPendapatanAsliDaerah.hasilKekayaanNegaraYangDipisahkan, realisasiPendapatanAsliDaerah.hasilKekayaanNegaraYangDipisahkan) },
                    { label: "Lain-lain PAD yang Sah", value: calculatePercentage(targetPendapatanAsliDaerah.lainLainPadYangSah, realisasiPendapatanAsliDaerah.lainLainPadYangSah) },
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

export default PendapatanAsliDaerahPanel;
