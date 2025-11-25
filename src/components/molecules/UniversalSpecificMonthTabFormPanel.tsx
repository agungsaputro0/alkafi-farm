import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import InputElement from "../atoms/InputElement";
import { formatNumber, unformatNumber, formatFromDB, formatNumber2 } from "../utils/FormatNumberWithDelimiter";

export interface Pos {
  id_pos: string;
  nama_pos: string;
  subpos?: Pos[];
}

type PeriodKey = "februari" | "agustus";
export type PeriodValues = Record<PeriodKey, string>;

export interface PanelData {
  title: string;
  values: Record<string, PeriodValues>;
  posList: Pos[];
}

export interface PosSection {
  [posKey: string]: PeriodValues;
}

interface UniversalSpecificMonthTabFormPanelProps {
  posList: Pos[];
  title: string;
  initialData?: PosSection | null;
  onDataChange?: (data: PanelData) => void;
}

const columnColors: Record<PeriodKey, string> = {
  februari: "bg-blue-50",
  agustus: "bg-green-50",
};

const emptyPeriodValues: PeriodValues = {
  februari: "",
  agustus: "",
};

// 🔹 helper snake_case
const toSnakeCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[()]/g, "")
    .replace(/%/g, "persentase")
    .replace(/[^a-z0-9_]/g, "");
};

const UniversalSpecificMonthTabFormPanel: React.FC<
  UniversalSpecificMonthTabFormPanelProps
> = ({ posList, title, initialData, onDataChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState<Record<string, PeriodValues>>({});

  useEffect(() => {
    const merged: Record<string, PeriodValues> = {};

    const traverse = (list: Pos[]) => {
      list.forEach((pos) => {
        const snakeKey = toSnakeCase(pos.nama_pos);

        const initial = initialData?.[snakeKey] || emptyPeriodValues;

        // 🔹 apply FormatFromDB ke semua nilai awal
        const formatted: PeriodValues = {
          februari: initial.februari ? formatFromDB(Number(initial.februari)) : "",
          agustus: initial.agustus ? formatFromDB(Number(initial.agustus)) : "",
        };

        merged[pos.id_pos] = formatted;

        if (pos.subpos && pos.subpos.length > 0) {
          traverse(pos.subpos);
        }
      });
    };

    traverse(posList);
    setValues(merged);

    if (onDataChange) {
      onDataChange({
        title,
        values: merged,
        posList,
      });
    }
  }, [posList, initialData]);

  const handleChange = (id_pos: string, key: PeriodKey, value: string) => {
    const formattedValue = value === "" ? "" : formatNumber(value);

    const updated = { ...values[id_pos], [key]: formattedValue };
    const newValues = { ...values, [id_pos]: updated };

    setValues(newValues);

    if (onDataChange) {
      onDataChange({
        title,
        values: newValues,
        posList,
      });
    }
  };

  // 🔹 hitung nilai parent dengan unformatNumber + formatNumber
  const renderRows = (list: Pos[], depth = 0): JSX.Element[] => {
    return list.flatMap((pos) => {
      const isParent = pos.subpos && pos.subpos.length > 0;

      const parentValues: PeriodValues | undefined = isParent
      ? (["februari", "agustus"] as PeriodKey[]).reduce((acc, q) => {
          const total = pos.subpos!.reduce((sum, child) => {
            const val = values[child.id_pos]?.[q];
            return sum + (val ? Number(unformatNumber(val)) : 0);
          }, 0);

          // ✅ konsisten pakai formatNumber biar delimiternya sama
          acc[q] = total !== 0 ? formatNumber2(total) : "";
          return acc;
        }, {} as PeriodValues)
      : undefined;


      const currentValues = parentValues || values[pos.id_pos] || emptyPeriodValues;

      const row = (
        <tr className={`${isParent && "bg-green-200"}`} key={pos.id_pos}>
          <td
            className="border p-2 font-semibold text-kemenkeublue"
            style={{ paddingLeft: `${12 + depth * 20}px` }}
          >
            {pos.nama_pos} {isParent && <span className="text-gray-400">(parent)</span>}
          </td>
          {(["februari", "agustus"] as PeriodKey[]).map((q) => (
            <td
              key={q}
              className={`border p-2 ${isParent ? "bg-green-200" : columnColors[q]}`}
            >
              {isParent ? (
                <div className="w-full h-[38px] flex items-center px-2 text-gray-600 font-medium">
                  {currentValues[q] || ""}
                </div>
              ) : (
                <InputElement
                  inputClass="w-full"
                  forwhat={`${pos.id_pos}-${q}`}
                  labelMessage=""
                  typeInput="text"
                  inputName={`${pos.id_pos}-${q}`}
                  inputPlaceholder="0"
                  value={currentValues[q] || ""}
                  onChange={(e) => handleChange(pos.id_pos, q, e.target.value)}
                />
              )}
            </td>
          ))}
        </tr>
      );

      return isParent ? [row, ...renderRows(pos.subpos!, depth + 1)] : [row];
    });
  };

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
          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full border-collapse border">
                <thead>
                  <tr className="bg-kemenkeublue text-white">
                    <th className="border p-2">POS</th>
                    <th className="border p-2">Februari</th>
                    <th className="border p-2">Agustus</th>
                  </tr>
                </thead>
                <tbody>{renderRows(posList)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalSpecificMonthTabFormPanel;
