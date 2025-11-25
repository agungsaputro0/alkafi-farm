import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Button from "../atoms/Button";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage, formatFromDB } from "../utils/FormatNumberWithDelimiter";
import { useRetrievePos, useSubmitPosData } from "../hooks/HandleFeda";
import { Modal, Table, Descriptions, Typography } from "antd";
import { monthOptions } from "../types/MonthOptions";

const { Paragraph } = Typography;

interface Pos {
  id_pos: string;
  id_instansi: string | null;
  nama_pos: string;
}

interface TargetItem {
  id_target: string;
  nama_pos: string;
  jumlah_target: number;
}

interface RealisasiItem {
  id_target: string;
  jumlah_realisasi: number;
}

interface PosData {
  target: TargetItem[];
  realisasi: RealisasiItem[];
  summary?: string;
  meta?: any;
}

interface UniversalTabFormPanelProps {
  tahun: string;
  bulan: string;
  provinsi: string;
  provinsiText?: string;
  instansi: string;
  instansiText?: string;
  kantor: string;
  posList: Pos[];
  title: string; 
  loadingPos?: boolean;
  errorPos?: string | null;
  posData?: PosData;
  menuKey?: string;
  tabId?: string;
}

const UniversalTabFormPanel: React.FC<UniversalTabFormPanelProps> = ({
  tahun,
  bulan,
  provinsi,
  provinsiText,
  instansi,
  instansiText,
  kantor,
  posList,
  title,
  loadingPos,
  errorPos,
  posData,
  menuKey,
  tabId
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const { submitData } = useSubmitPosData();
  const { fetchPos, data: _retrievedData } = useRetrievePos();
  // modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded, posList]);

  const [targetValues, setTargetValues] = useState<Record<string, string>>({});
  const [realisasiValues, setRealisasiValues] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const initialTarget: Record<string, string> = {};
    const initialRealisasi: Record<string, string> = {};
    posList.forEach((pos) => {
      initialTarget[pos.id_pos] = "";
      initialRealisasi[pos.id_pos] = "";
    });
    setTargetValues(initialTarget);
    setRealisasiValues(initialRealisasi);
  }, [posList]);

  const handleTargetChange = (id_pos: string, value: string) => {
    setTargetValues((prev) => ({
      ...prev,
      [id_pos]: formatNumber(value),
    }));
  };

  const handleRealisasiChange = (id_pos: string, value: string) => {
    setRealisasiValues((prev) => ({
      ...prev,
      [id_pos]: formatNumber(value),
    }));
  };

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    const payload = {
      tahun,
      bulan,
      provinsi,
      instansi,
      kantor,
      target: targetValues,
      realisasi: realisasiValues,
      summary,
      id_tab: tabId,
      id_kodifikasi: menuKey
    };
    await submitData(payload);
    setLoading(false);
    setIsModalVisible(false);
  };

  if (loadingPos) return <p>Loading data pos...</p>;
  if (errorPos) return <p>Error: {errorPos}</p>;

  // data untuk tabel konfirmasi
  const modalData = posList.map((pos) => {
    const target = targetValues[pos.id_pos] || "0";
    const realisasi = realisasiValues[pos.id_pos] || "0";
    const percentage = calculatePercentage(target, realisasi);
    return {
      key: pos.id_pos,
      pos: pos.nama_pos,
      target,
      realisasi,
      percentage,
    };
  });

  const columns = [
    { title: "POS", dataIndex: "pos", key: "pos" },
    { title: "Target", dataIndex: "target", key: "target" },
    { title: "Realisasi", dataIndex: "realisasi", key: "realisasi" },
    { title: "Persentase", dataIndex: "percentage", key: "percentage" },
  ];

  useEffect(() => {
  if (!posList || !tahun || !bulan || !instansi || !provinsi || !kantor) return;

  // jika posData diberikan dari parent
  if (posData) {
    const newTarget: Record<string, string> = {};
    const newRealisasi: Record<string, string> = {};

    // mapping target: nama_pos -> TargetItem
    const targetMap = new Map<string, TargetItem>(
      (posData.target || []).map((t) => [t.nama_pos, t])
    );

    // mapping realisasi: id_target -> jumlah_realisasi
    const realisasiMap = new Map<string, number>(
      (posData.realisasi || []).map((r) => [r.id_target, r.jumlah_realisasi])
    );

    posList.forEach((pos) => {
      const targetItem = targetMap.get(pos.nama_pos);
      newTarget[pos.id_pos] = targetItem ? formatFromDB(targetItem.jumlah_target) : "";

      const realisasiItem = targetItem ? realisasiMap.get(targetItem.id_target) : undefined;
      newRealisasi[pos.id_pos] = realisasiItem ? formatFromDB(realisasiItem) : "";
    });

    setTargetValues(newTarget);
    setRealisasiValues(newRealisasi);
    setSummary(posData.summary || "");
  } else {
    // fallback: fetchPos jika posData tidak ada
    fetchPos({
      tahun: parseInt(tahun),
      bulan: parseInt(bulan),
      id_instansi: instansi,
      provinsi,
      kantor,
      id_kodifikasi: menuKey,
      id_tab: null
    })
      .then((res) => {
        if (res.status === "success" && res.data) {
          const newTarget: Record<string, string> = {};
          const newRealisasi: Record<string, string> = {};

          const targetMap = new Map<string, TargetItem>(
            (res.data.target || []).map((t: TargetItem) => [t.nama_pos, t])
          );

          const realisasiMap = new Map<string, number>(
            (res.data.realisasi || []).map((r: RealisasiItem) => [r.id_target, r.jumlah_realisasi])
          );

          posList.forEach((pos) => {
            const targetItem = targetMap.get(pos.nama_pos);
            newTarget[pos.id_pos] = targetItem ? formatFromDB(targetItem.jumlah_target) : "";

            const realisasiItem = targetItem ? realisasiMap.get(targetItem.id_target) : undefined;
            newRealisasi[pos.id_pos] = realisasiItem ? formatFromDB(realisasiItem) : "";
          });

          setTargetValues(newTarget);
          setRealisasiValues(newRealisasi);
          setSummary(res.data.summary || "");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}, [tahun, bulan, instansi, provinsi, kantor, posList, menuKey, posData]);

  const bulanLabel = monthOptions.find((item) => item.value === bulan)?.label || bulan;

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
          <form onSubmit={handleOpenModal}>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-3 gap-8 min-w-[800px]">
                {/* Target */}
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
                        className="flex h-[65px] justify-between items-center mb-[23px] py-2 px-4 border rounded bg-white/30"
                      >
                        <span className="text-kemenkeublue font-semibold pr-4 line-clamp-2">{pos.nama_pos}</span>
                        <span className={`text-2xl font-bold ${colorClass} whitespace-nowrap`}>
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="col-span-3 pb-4">
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

      {/* Modal Konfirmasi */}
      <Modal
        title={<div className="pb-3 mt-[-5px] border-b border-gray-300">Cek kembali data anda sebelum submit</div>}
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
        width={800}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        centered
      >
        <Descriptions bordered column={1} size="small" className="mb-4">
          <Descriptions.Item label="Tahun">{tahun}</Descriptions.Item>
          <Descriptions.Item label="Bulan">{bulanLabel}</Descriptions.Item>
          <Descriptions.Item label="Provinsi">{provinsiText}</Descriptions.Item>
          <Descriptions.Item label="Instansi">{instansiText}</Descriptions.Item>
          <Descriptions.Item label="Kantor">{kantor}</Descriptions.Item>
        </Descriptions>

        <div className="max-h-[400px] overflow-y-auto mb-4 rounded border">
          <Table columns={columns} dataSource={modalData} pagination={false} size="small" />
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Summary:</p>
          <Paragraph>{summary || "-"}</Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default UniversalTabFormPanel;
