import React, { useState } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber } from "../utils/FormatNumberWithDelimiter";

const TptPanel: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: formatNumber(value),
    }));
  };

  const bulan = ["Februari", "Agustus"];

  const sections = [
    {
      title: "Tingkat Pengangguran Terbuka",
      rows: [
        "Penduduk Usia 15 Tahun ke atas",
        "Angkatan Kerja",
        { label: "Bekerja", indent: true },
        { label: "Tidak Bekerja", indent: true },
        "Bukan Angkatan Kerja",
        "TPAK%",
        "TPT% (Provinsi)",
        "TPT% (Pedesaan)",
        "TPT% (Perkotaan)",
      ],
    },
    {
      title: "Kategori Pekerjaan",
      rows: [
        "Pekerja Penuh Waktu",
        "Pekerja tidak penuh waktu",
        { label: "Setengah Penganggur", indent: true },
        { label: "Pekerja Paruh Waktu", indent: true },
      ],
    },
    {
      title: "Pendidikan Tertinggi yang ditamatkan",
      rows: ["SD ke Bawah", "SMP", "SMA", "SMK", "DI/DIII", "Universitas"],
    },
  ];

  return (
    <div className="rounded-xl shadow-md overflow-hidden">
      <div className="p-5 bg-white space-y-10">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h3 className="font-bold mb-[-15px] text-xl text-kemenkeublue">
              {section.title}
            </h3>
            <table className="w-full table-fixed border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="w-1/2 text-left"></th>
                  {bulan.map((b, bIdx) => (
                    <th
                      key={bIdx}
                      className="text-center font-semibold text-black"
                    >
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, rIdx) => {
                    const label = typeof row === "string" ? row : row.label;
                    const indent = typeof row !== "string" && row.indent;
                    const bgColor = indent
                            ? rIdx % 2 === 0
                                ? "bg-green-200"
                                : "bg-green-100"
                            : rIdx % 2 === 0
                            ? "bg-blue-200"
                            : "bg-blue-100";

                    return (
                    <tr key={rIdx} className={bgColor}>
                        <td
                        className={`text-sm font-semibold text-black`}
                        >
                        <span
                        style={{
                            paddingLeft: indent ? "2.5rem" : "0.5rem", // indent → 40px, else 8px
                        }}
                        >
                        {label}
                        </span>
                        </td>
                        {bulan.map((_b, bIdx) => {
                        const key = `${sIdx}-${rIdx}-${bIdx}`;
                        return (
                            <td key={bIdx} className="px-1 py-1">
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
                    );
                })}
                </tbody>
            </table>
            <hr className="border-t-2 border-dashed border-grey-800 my-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TptPanel;
