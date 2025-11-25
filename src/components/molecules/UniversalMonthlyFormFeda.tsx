import React, { useEffect, useState } from "react";
import { Modal, Table, Descriptions, Typography } from "antd";
import { FaChevronDown } from "react-icons/fa";
import InputElement from "../atoms/InputElement";
import Button from "../atoms/Button";
import { formatNumber, formatFromDB, unformatNumber } from "../utils/FormatNumberWithDelimiter";
import { useRetrievePosBulanan, useSubmitPosDataBulanan } from "../hooks/HandleFeda";

const { Paragraph } = Typography;

export interface Pos {
  id_pos: string;
  nama_pos: string;
}

type BulanKey =
  | "jan" | "feb" | "mar" | "apr" | "mei" | "jun"
  | "jul" | "agu" | "sep" | "okt" | "nov" | "des";

export type BulanValues = Record<BulanKey, string>;

export interface PosData {
  values: Record<string, BulanValues>;
  summary?: string;
}

export interface UniversalMonthlyFormFedaProps {
  tahun: string;
  provinsi: string;
  provinsiText?: string;
  instansi: string;
  kantor: string;
  posList: Pos[];
  loadingPos?: boolean;
  errorPos?: string | null;
  title: string;
  menuKey?: string;
  posData?: PosData;
}

const bulanLabels: Record<BulanKey, string> = {
  jan: "Januari", feb: "Februari", mar: "Maret", apr: "April",
  mei: "Mei", jun: "Juni", jul: "Juli", agu: "Agustus",
  sep: "September", okt: "Oktober", nov: "November", des: "Desember"
};

const emptyBulanValues: BulanValues = {
  jan: "", feb: "", mar: "", apr: "", mei: "", jun: "",
  jul: "", agu: "", sep: "", okt: "", nov: "", des: ""
};

const UniversalMonthlyFormFeda: React.FC<UniversalMonthlyFormFedaProps> = ({
  tahun, provinsi, provinsiText, instansi, kantor,
  posList, loadingPos, errorPos, title, menuKey, posData
}) => {
  const [expanded, setExpanded] = useState(true);
  const [values, setValues] = useState<Record<string, BulanValues>>({});
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { fetchPos, data: retrievedData, loading: loadingRetrieve } = useRetrievePosBulanan();
  const { submitData } = useSubmitPosDataBulanan();

  // fetch backend data
  useEffect(() => {
    if (!menuKey) return;
    fetchPos({ tahun: parseInt(tahun), provinsi, instansi, kantor, id_kodifikasi: menuKey });
  }, [tahun, provinsi, instansi, kantor, menuKey]);
  
  useEffect(() => {
    const source = retrievedData || posData;
    if (!source) return;

    const merged: Record<string, BulanValues> = {};

    posList.forEach((pos) => {
        const sanitizedPosName = pos.nama_pos
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

        const rawValues = source.values[sanitizedPosName];
        if (!rawValues) return;

        const formattedValues: BulanValues = {} as BulanValues;

        (Object.keys(emptyBulanValues) as BulanKey[]).forEach(b => {
        formattedValues[b] = rawValues[b] ? formatFromDB(Number(rawValues[b])) : "";
        });

        merged[pos.id_pos] = formattedValues;
    });

    setValues(merged);
    setSummary(source.summary || "");
    }, [retrievedData, posData, posList, tahun, provinsi, instansi, kantor]);


  const handleChange = (id_pos: string, bulan: BulanKey, value: string) => {
    setValues(prev => ({
      ...prev,
      [id_pos]: { ...prev[id_pos], [bulan]: value === "" ? "" : formatNumber(value) }
    }));
  };

  const handleOpenModal = (e: React.FormEvent) => { e.preventDefault(); setIsModalVisible(true); };

  const handleConfirmSubmit = async () => {
    setLoading(true);

    const formattedValues: Record<string, BulanValues> = {};
    Object.entries(values).forEach(([id_pos, bulanMap]) => {
      formattedValues[id_pos] = {} as BulanValues;
      Object.entries(bulanMap).forEach(([bulan, val]) => {
        formattedValues[id_pos][bulan as BulanKey] = val ? unformatNumber(val).toString() : "";
      });
    });

    await submitData({ tahun, provinsi, instansi, kantor, summary, id_kodifikasi: menuKey, values: formattedValues });
    setLoading(false);
    setIsModalVisible(false);
  };

  if (loadingPos || loadingRetrieve) return <p>Loading pos...</p>;
  if (errorPos) return <p>Error: {errorPos}</p>;

  const modalData = Object.entries(values).map(([id, bulanVals]) => {
    const posName = posList.find(p => p.id_pos === id)?.nama_pos || `ID ${id}`;
    return { key: id, pos: posName, ...bulanVals };
  });

  const columns = [
    { title: "POS", dataIndex: "pos", key: "pos" },
    ...Object.entries(bulanLabels).map(([k, v]) => ({ title: v, dataIndex: k, key: k }))
  ];

  return (
    <>
      <form onSubmit={handleOpenModal} className="rounded-xl shadow-md mb-2 rounded-xl overflow-hidden">
       
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
          <div className="p-5 bg-white space-y-6">
            {posList.map((pos) => (
              <div
                key={pos.id_pos}
                className="border rounded-lg shadow-sm p-4 bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-kemenkeublue mb-4">
                  {pos.nama_pos}
                </h3>

                {/* Januari - Juni */}
                <div className="grid grid-cols-6 gap-3 mb-6">
                  {(Object.keys(bulanLabels) as BulanKey[])
                    .slice(0, 6)
                    .map((b) => (
                      <InputElement
                        key={`${pos.id_pos}-${b}`}
                        inputClass="w-full"
                        forwhat={`${pos.id_pos}-${b}`}
                        labelMessage={bulanLabels[b]}
                        typeInput="text"
                        inputName={`${pos.id_pos}-${b}`}
                        inputPlaceholder="0"
                        value={values[pos.id_pos]?.[b] || ""}
                        onChange={(e) =>
                          handleChange(pos.id_pos, b, e.target.value)
                        }
                      />
                    ))}
                </div>

                {/* Juli - Desember */}
                <div className="grid grid-cols-6 gap-3">
                  {(Object.keys(bulanLabels) as BulanKey[])
                    .slice(6, 12)
                    .map((b) => (
                      <InputElement
                        key={`${pos.id_pos}-${b}`}
                        inputClass="w-full"
                        forwhat={`${pos.id_pos}-${b}`}
                        labelMessage={bulanLabels[b]}
                        typeInput="text"
                        inputName={`${pos.id_pos}-${b}`}
                        inputPlaceholder="0"
                        value={values[pos.id_pos]?.[b] || ""}
                        onChange={(e) =>
                          handleChange(pos.id_pos, b, e.target.value)
                        }
                      />
                    ))}
                </div>
              </div>
            ))}

            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Summary Report
              </h3>
              <textarea
                className="w-full min-h-[80px] border-2 border-gray-400 rounded-lg p-2 text-black"
                placeholder="Masukkan ringkasan laporan"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="bg-kemenkeuyellow w-full hover:bg-amber-600"
                message="Submit"
              />
            </div>
          </div>
        )}
      </form>

      {/* Modal Konfirmasi */}
      <Modal
        title={
          <div className="pb-3 mt-[-5px] border-b border-gray-300">
            Cek kembali data anda sebelum submit
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            type="button"
            variant="bg-gray-300 px-6 py-2 mr-2 hover:bg-gray-400"
            message="Batal"
            onClick={() => setIsModalVisible(false)}
          />,
          <Button
            key="submit"
            type="button"
            variant="bg-kemenkeuyellow px-6 py-2 hover:bg-amber-600"
            message="Submit"
            onClick={handleConfirmSubmit}
            disabled={loading}
          />,
        ]}
        width={900}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        centered
      >
        <Descriptions bordered column={1} size="small" className="mb-4">
          <Descriptions.Item label="Tahun">{tahun}</Descriptions.Item>
          <Descriptions.Item label="Provinsi">{provinsiText}</Descriptions.Item>
          <Descriptions.Item label="Instansi">{title}</Descriptions.Item>
          <Descriptions.Item label="Kantor">{kantor}</Descriptions.Item>
        </Descriptions>

        <div className="max-h-[400px] overflow-y-auto mb-4 rounded border">
          <Table
            columns={columns}
            dataSource={modalData}
            pagination={false}
            size="small"
          />
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Summary:</p>
          <Paragraph>{summary || "-"}</Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default UniversalMonthlyFormFeda;
