import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputElement from "../atoms/InputElement";
import {
  formatFromDB,
  formatNumber,
  unformatNumber,
} from "../utils/FormatNumberWithDelimiter";

export interface Pos {
  id_pos: string;
  nama_pos: string;
}

type QuarterKey = "q1" | "q2" | "q3" | "q4" | "tahunan";
export type QuarterValues = Record<QuarterKey, string>;

export interface PanelData {
  title: string;
  konstan: Record<string, QuarterValues>;
  berlaku: Record<string, QuarterValues>;
  posList: Pos[];
}

// PosSection langsung map dari posId ke QuarterValues
export interface PosSection {
  [posId: string]: QuarterValues;
}

interface UniversalQuarterlyTabFormPanelProps {
  posList: Pos[];
  title: string;
  initialData?: {
    konstan: PosSection;
    berlaku: PosSection;
  } | null;
  onDataChange?: (data: PanelData) => void;
}

const columnColors: Record<QuarterKey, string> = {
  q1: "bg-blue-50",
  q2: "bg-green-50",
  q3: "bg-yellow-50",
  q4: "bg-pink-50",
  tahunan: "bg-gray-100",
};

const emptyQuarterValues: QuarterValues = {
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  tahunan: "",
};

const UniversalQuarterlyTabFormPanel: React.FC<
  UniversalQuarterlyTabFormPanelProps
> = ({ posList, title, initialData, onDataChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [konstanValues, setKonstanValues] = useState<
    Record<string, QuarterValues>
  >({});
  const [berlakuValues, setBerlakuValues] = useState<
    Record<string, QuarterValues>
  >({});

  // sync saat posList atau initialData berubah
  useEffect(() => {
  const mergedKonstan: Record<string, QuarterValues> = {};
  const mergedBerlaku: Record<string, QuarterValues> = {};

  posList.forEach((pos) => {
    mergedKonstan[pos.id_pos] = {
      ...emptyQuarterValues,
      ...initialData?.konstan?.[pos.nama_pos], // pakai nama_pos
    };
    mergedBerlaku[pos.id_pos] = {
      ...emptyQuarterValues,
      ...initialData?.berlaku?.[pos.nama_pos], // pakai nama_pos
    };
  });

  setKonstanValues(mergedKonstan);
  setBerlakuValues(mergedBerlaku);

  if (onDataChange) {
    onDataChange({
      title,
      konstan: mergedKonstan,
      berlaku: mergedBerlaku,
      posList,
    });
  }
}, [posList, initialData]);

  const handleChange = (
    values: typeof konstanValues,
    setValues: React.Dispatch<
      React.SetStateAction<Record<string, QuarterValues>>
    >,
    id_pos: string,
    key: QuarterKey,
    value: string,
    type: "k" | "b"
  ) => {
    const rawNumber = unformatNumber(value);
    const formattedValue = value === "" ? "" : formatNumber(value);

    const updated = { ...values[id_pos], [key]: formattedValue };

    // hitung tahunan otomatis
    if (key !== "tahunan") {
      const q1 = unformatNumber(values[id_pos]?.q1 || "0");
      const q2 = unformatNumber(values[id_pos]?.q2 || "0");
      const q3 = unformatNumber(values[id_pos]?.q3 || "0");
      const q4 = unformatNumber(values[id_pos]?.q4 || "0");

      const total =
        (key === "q1" ? rawNumber : q1) +
        (key === "q2" ? rawNumber : q2) +
        (key === "q3" ? rawNumber : q3) +
        (key === "q4" ? rawNumber : q4);

      updated.tahunan = formatFromDB(total);
    }

    const newValues = { ...values, [id_pos]: updated };
    setValues(newValues);

    if (onDataChange) {
      onDataChange({
        title,
        konstan: type === "k" ? newValues : konstanValues,
        berlaku: type === "b" ? newValues : berlakuValues,
        posList,
      });
    }
  };

  const renderTable = (
    values: typeof konstanValues,
    setValues: typeof setKonstanValues,
    type: "k" | "b"
  ) => (
    <div className="mb-6">
      <h3 className="font-bold text-lg text-kemenkeublue mb-2">
        {type === "k"
          ? "Atas Dasar Harga Konstan"
          : "Atas Dasar Harga Berlaku"}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse border">
          <thead>
            <tr className="bg-kemenkeublue text-white">
              <th className="border p-2">POS</th>
              <th className="border p-2">Triwulan I</th>
              <th className="border p-2">Triwulan II</th>
              <th className="border p-2">Triwulan III</th>
              <th className="border p-2">Triwulan IV</th>
              <th className="border p-2">Tahunan</th>
            </tr>
          </thead>
          <tbody>
            {posList.map((pos) => (
              <tr key={pos.id_pos}>
                <td className="border p-2 font-semibold text-kemenkeublue">
                  {pos.nama_pos}
                </td>
                {(
                  ["q1", "q2", "q3", "q4", "tahunan"] as QuarterKey[]
                ).map((q) => (
                  <td key={q} className={`border p-2 ${columnColors[q]}`}>
                    <InputElement
                      inputClass="w-full"
                      forwhat={`${pos.id_pos}-${q}-${type}`}
                      labelMessage=""
                      typeInput="text"
                      inputName={`${pos.id_pos}-${q}-${type}`}
                      inputPlaceholder="0"
                      value={values[pos.id_pos]?.[q] || ""}
                      onChange={(e) =>
                        handleChange(
                          values,
                          setValues,
                          pos.id_pos,
                          q,
                          e.target.value,
                          type
                        )
                      }
                      disabled={q === "tahunan"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl shadow-md overflow-hidden mb-6">
      <div
        className="flex justify-between items-center cursor-pointer p-5 transition-colors duration-300 bg-kemenkeublue text-kemenkeuyellow"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <FaChevronDown
          className={`text-xl transition-transform duration-500 ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {expanded && (
        <div className="p-5 bg-white">
          {renderTable(konstanValues, setKonstanValues, "k")}
          {renderTable(berlakuValues, setBerlakuValues, "b")}
        </div>
      )}
    </div>
  );
};

export default UniversalQuarterlyTabFormPanel;
