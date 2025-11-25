import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputElement from "../atoms/InputElement";
import { formatNumber, unformatNumber } from "../utils/FormatNumberWithDelimiter";

const PdrbPengeluaranPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded]);

  const rowLabels = [
    "Konsumsi Rumah Tangga",
    "Konsumsi LNPRT",
    "Konsumsi Pemerintah",
    "Pembentukan Modal Tetap Domestik Bruto",
    "Perubahan Inventori",
    "Ekspor Barang dan Jasa",
    "Impor Barang dan Jasa",
  ];

  const colLabels = ["Triwulan I", "Triwulan II", "Triwulan III", "Triwulan IV", "Tahunan"];

  // state untuk simpan nilai input
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: formatNumber(value), // hanya angka
    }));
  };

  // background warna untuk tiap kolom (lebih jelas & warna-warni)
  const bgClasses = [
    "bg-blue-50",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-400",
    ];

  const renderTable = (prefix: string, title: string) => (
    <div>
      <h3 className="font-bold mb-3 text-2xl text-kemenkeublue">{title}</h3>
      <div className="overflow-x-auto"> {/* responsive scroll */}
        <table className="min-w-[700px] w-full table-fixed border-separate border-spacing-x-1">
          <thead>
            <tr>
              <th className="text-left w-1/4"></th>
              {colLabels.map((col, idx) => (
                <th key={idx} className="text-center font-semibold text-black px-2 py-1">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((row, rIdx) => (
              <tr key={rIdx} className="border-t">
                <td className="pr-2 text-black text-sm font-semibold max-h-[46.6667px] overflow-hidden">
                    <div className="flex items-center h-[46.6667px]">
                        <span className="line-clamp-2">
                        {row}
                        </span>
                    </div>
                </td>
                {colLabels.map((_, cIdx) => {
                    const key = `${prefix}-${rIdx}-${cIdx}`;

                    // hitung tahunan (sum dari triwulan 0-3)
                    if (cIdx === 4) {
                        const sum = [0, 1, 2, 3].reduce((acc, i) => {
                        const raw = values[`${prefix}-${rIdx}-${i}`] || "0";
                        return acc + unformatNumber(raw);
                        }, 0);

                        return (
                        <td key={cIdx} className={`px-1 py-1   ${bgClasses[cIdx]}`}>
                            <div className="w-full p-1 font-semibold border-b-2 border-blue-300 h-[37.7778px] text-center text-black">
                             {sum ? sum.toLocaleString("id-ID") : ""}
                            </div>
                        </td>
                        );
                    }

                  return (
                    <td key={cIdx} className={`px-1 py-1 ${bgClasses[cIdx]}`}>
                      <InputElement
                        inputClass="w-full"
                        forwhat={key}
                        labelMessage=""
                        typeInput="text"
                        inputName={key}
                        inputPlaceholder="Masukkan angka"
                        value={values[key] || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(key, e.target.value)
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      {/* Judul utama dengan chevron */}
      <div
        className="flex justify-between items-center cursor-pointer p-5 transition-colors duration-300 bg-kemenkeublue text-kemenkeuyellow"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold">PDRB Pengeluaran</h2>
        <FaChevronDown
          className={`text-xl transition-transform duration-300 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Area konten */}
      <div
        style={{ height }}
        className="overflow-hidden transition-all duration-600"
        ref={contentRef}
      >
        <div className="p-5 bg-white space-y-10">
          {renderTable("konstan", "Atas Dasar Harga Konstan")}
            <hr className="border-t-2 border-dashed border-grey-800 my-4" />
          {renderTable("berlaku", "Atas Dasar Harga Berlaku")}
        </div>
      </div>
    </div>
  );
};

export default PdrbPengeluaranPanel;
