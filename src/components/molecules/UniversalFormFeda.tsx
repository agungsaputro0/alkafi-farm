import React, { useState, useEffect } from "react";
import InputElement from "../atoms/InputElement";
import { formatNumber, calculatePercentage, formatFromDB } from "../utils/FormatNumberWithDelimiter";
import Button from "../atoms/Button";
import { useSubmitPosData } from "../hooks/HandleFeda";
import { useRetrievePos } from "../hooks/HandleFeda"; // ✅ import hook retrieve
import { Modal, Table, Descriptions, Typography, notification } from "antd";
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

interface UniversalFormFedaProps {
  tahun: string;
  bulan: string;
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

const UniversalFormFeda: React.FC<UniversalFormFedaProps> = ({
  tahun,
  bulan,
  provinsi,
  provinsiText,
  instansi,
  kantor,
  posList,
  loadingPos,
  errorPos,
  title,
  menuKey,
  posData
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [targetValues, setTargetValues] = useState<Record<string, string>>({});
  const [realisasiValues, setRealisasiValues] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { fetchPos, data: _retrievedData, loading: loadingRetrieve } = useRetrievePos();
  const { submitData } = useSubmitPosData();

  // Initialize form with empty values
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

  // Fetch POS data when instansi/kantor/tahun/bulan change
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
        notification.error({
          message: "Error",
          description: "Gagal mengambil data POS",
          placement: "topRight",
        });
      });
  }
}, [tahun, bulan, instansi, provinsi, kantor, posList, menuKey, posData]);

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
      id_kodifikasi: menuKey
    };
    await submitData(payload);
    setLoading(false);
    setIsModalVisible(false);
  };

  if (loadingPos || loadingRetrieve) return <p>Loading pos...</p>;
  if (errorPos) return <p>Error: {errorPos}</p>;

  // Data tabel modal
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

  const bulanLabel = monthOptions.find((item) => item.value === bulan)?.label || bulan;

  return (
    <>
      <form onSubmit={handleOpenModal}>
        <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">
          {title}
        </h2>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-3 gap-8 min-w-[800px]">
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
                    className="flex h-[65px] justify-between items-center mb-[23px] py-2 px-4 border rounded bg-white/30"
                  >
                    <span className="text-kemenkeublue font-semibold pr-4 line-clamp-2">
                      {pos.nama_pos}
                    </span>
                    <span className={`text-[1.2em] font-bold ${colorClass} whitespace-nowrap`}>
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary Report */}
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
        <div className="col-span-3 mt-6">
          <Button
            type="submit"
            variant="bg-kemenkeuyellow w-full hover:bg-amber-600 mt-4"
            message="Submit"
            disabled={loading}
          />
        </div>
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
        width={800}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }} 
        centered // ✅ tetap di tengah
      >
        <Descriptions bordered column={1} size="small" className="mb-4">
          <Descriptions.Item label="Tahun">{tahun}</Descriptions.Item>
          <Descriptions.Item label="Bulan">{bulanLabel}</Descriptions.Item>
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

export default UniversalFormFeda;
