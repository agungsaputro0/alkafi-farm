import React, { useState } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber } from "../utils/FormatNumberWithDelimiter";

const NtpPanel: React.FC = () => {
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: formatNumber(value), // hanya angka
    }));
  };

  const renderGrid = (prefix: string, title: string) => (
    <div className="mb-8">
      <h3 className="font-bold mb-3 text-xl text-kemenkeublue">{title}</h3>
      <div className="grid grid-cols-6 gap-4">
        {bulan.map((b, i) => {
          const key = `${prefix}-${i}`;
          return (
            <div key={i} className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-black">{b}</label>
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
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      <div className="p-5 bg-white space-y-10">
        {renderGrid("it", "IT (Indeks Harga yang Diterima Petani)")}
        <hr className="border-t-2 border-dashed border-grey-800 my-4" />
        {renderGrid("ib", "IB (Indeks Harga yang Dibayar Petani)")}
        <hr className="border-t-2 border-dashed border-grey-800 my-4" />
        {renderGrid("ntp", "Nilai Tukar Petani")}
      </div>
    </div>
  );
};

export default NtpPanel;
