import React, { useState, useEffect, useCallback, useMemo } from "react";
import Button from "../atoms/Button";
import {
  useFetchTabByKodifikasi,
  useFetchPosWithSubposByInstansiTab,
  useSubmitPosDataBulanSpesifik,
  useRetrievePosBulanSpesifik,
} from "../hooks/HandleFeda";
import UniversalSpecificMonthTabFormPanel, {
  PanelData,
  PosSection,
} from "./UniversalSpecificMonthTabFormPanel";
import { Modal, Descriptions, Table, Typography } from "antd";
import InlineSpinner from "../atoms/InlineSpinner";

const { Paragraph } = Typography;
const menuKey = import.meta.env.VITE_EIGHTH_KEY;

interface FedaEkonomiRegionalTptProps {
  tahun: string;
  provinsi: string;
  provinsiText?: string;
  instansi: string;
  instansiText?: string;
  kantor: string;
}

interface TabWrapperProps extends FedaEkonomiRegionalTptProps {
  tabId: string;
  tabName: string;
  onPanelDataChange: (tabId: string, data: PanelData) => void;
}

interface TabWrapperProps extends FedaEkonomiRegionalTptProps {
  tabId: string;
  tabName: string;
  onPanelDataChange: (tabId: string, data: PanelData) => void;
}

const normalizeMonthlyData = (raw: Record<string, any> | undefined): PosSection => {
  if (!raw) return {};

  const out: PosSection = {};

  Object.entries(raw).forEach(([posId, obj]) => {
    const vals = obj?.values;

    out[posId] = {
      februari: vals?.februari?.februari != null ? String(vals.februari.februari) : "",
      agustus: vals?.agustus?.agustus != null ? String(vals.agustus.agustus) : "",
    };
  });

  return out;
};


const TabWrapper: React.FC<TabWrapperProps> = ({
  tahun,
  provinsi,
  instansi,
  kantor,
  tabId,
  tabName,
  onPanelDataChange,
}) => {
  const { posList, loading: _posLoading, error: _posError } =
    useFetchPosWithSubposByInstansiTab(instansi, menuKey, tabId);

  const { fetchPos, data: posData, loading: retrieveLoading } = useRetrievePosBulanSpesifik();

  const [showDelayedForm, setShowDelayedForm] = useState(false);
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);

  // Reset panelData & trigger fetch saat posList berubah
  useEffect(() => {
    if (posList.length > 0) {
      onPanelDataChange(tabId, {
        title: tabName,
        values: {}, // kosong dulu
        posList,
      });

      setShowDelayedForm(false);
      setShowDelayedLoading(true);

      const timer = setTimeout(() => {
        setShowDelayedForm(true);
        setShowDelayedLoading(false);

        fetchPos({
          tahun: Number(tahun),
          instansi,
          provinsi,
          kantor,
          id_kodifikasi: menuKey,
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [posList, tahun, provinsi, instansi, kantor]);

  const initialForChild = useMemo(() => normalizeMonthlyData(posData?.data), [posData]);

  return (
    <>
      {(showDelayedLoading || retrieveLoading) && <InlineSpinner />}
      {showDelayedForm && !retrieveLoading && (
        <UniversalSpecificMonthTabFormPanel
          key={posList.map((p) => p.id_pos).join("-")}
          posList={posList}
          title={tabName}
          initialData={initialForChild}
          onDataChange={(data) => onPanelDataChange(tabId, data)}
        />
      )}
    </>
  );
};

const FedaEkonomiRegionalTpt: React.FC<FedaEkonomiRegionalTptProps> = ({
  tahun,
  provinsi,
  provinsiText,
  instansi,
  instansiText,
  kantor,
}) => {
  const { tabList, loading: tabLoading, error: tabError } =
    useFetchTabByKodifikasi(menuKey);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, PanelData>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const { submitData } = useSubmitPosDataBulanSpesifik();
  const handlePanelDataChange = useCallback(
    (tabId: string, data: PanelData) => {
      setFormData((prev) => ({
        ...prev,
        [tabId]: data,
      }));
    },
    []
  );

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();

    // Normalisasi data untuk preview
    const posLookup: Record<string, string> = {};
    Object.values(formData).forEach((panel) => {
      panel.posList.forEach((pos) => {
        if (pos.subpos && pos.subpos.length) {
          // Kalau ada subpos, simpan "Parent - Child"
          pos.subpos.forEach((sub: any) => {
            posLookup[sub.id_pos] = `${pos.nama_pos} - ${sub.nama_pos}`;
          });
        } else {
          // Kalau tidak ada subpos, simpan nama biasa
          posLookup[pos.id_pos] = pos.nama_pos;
        }
      });
    });

    const hasNonZero = (vals: any) =>
      Number(vals.februari) !== 0 || Number(vals.agustus) !== 0;

    const tableData = Object.entries(formData).flatMap(([tabId, panel]) =>
      Object.entries(panel.values)
        .filter(([_, vals]) => hasNonZero(vals))
        .map(([posId, vals]) => ({
          key: `${tabId}-${posId}`,
          tab: panel.title,
          posId,
          posName: posLookup[posId] || posId, // ✅ sekarang bisa tampil "Parent - Child"
          februari: vals.februari,
          agustus: vals.agustus,
        }))
    );

    setModalData(tableData);
    setIsModalVisible(true);
  };

  const handleConfirmSubmit = async () => {
  setLoading(true);

  const cleanedData: Record<string, any> = {};
  Object.entries(formData).forEach(([tabKey, panel]) => {
    const { posList, ...rest } = panel;

    const filtered: Record<string, any> = {};
    Object.entries(panel.values).forEach(([posId, vals]) => { // ✅ pakai values
      const f = Number(vals.februari);
      const a = Number(vals.agustus);
      if (f !== 0 || a !== 0) {
        filtered[posId] = { februari: f, agustus: a };
      }
    });

    if (Object.keys(filtered).length > 0) {
      cleanedData[tabKey] = {
        ...rest,
        values: filtered, // ✅ ganti data → values
      };
    }
  });

  const payload = {
    tahun,
    provinsi,
    instansi,
    kantor,
    summary,
    id_kodifikasi: menuKey,
    data: cleanedData,
  };

  await submitData(payload);

  setTimeout(() => {
    setLoading(false);
    setIsModalVisible(false);
  }, 800);
};


  if (tabLoading) return <p>Loading tab...</p>;
  if (tabError) return <p>Error: {tabError}</p>;

  const columns = [
    { title: "Tab", dataIndex: "tab", key: "tab" },
    { title: "POS Name", dataIndex: "posName", key: "posName" },
    { title: "Februari", dataIndex: "februari", key: "februari" },
    { title: "Agustus", dataIndex: "agustus", key: "agustus" },
  ];

  return (
    <>
      <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">
        Direktorat Jenderal Perbendaharaan
      </h2>
      <form onSubmit={handleOpenModal}>
        <div className="grid grid-cols-1 gap-y-1">
          {tabList.map((tab) => (
            <TabWrapper
              key={tab.id_tab}
              tahun={tahun}
              provinsi={provinsi}
              provinsiText={provinsiText}
              instansi={instansi}
              instansiText={instansiText}
              kantor={kantor}
              tabId={tab.id_tab}
              tabName={tab.nama}
              onPanelDataChange={handlePanelDataChange}
            />
          ))}
        </div>

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

        <Button
          type="submit"
          variant="bg-kemenkeuyellow w-full hover:bg-amber-600 mt-4"
          disabled={loading}
          message="Submit"
        />
      </form>

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
        centered
      >
        <Descriptions bordered column={1} size="small" className="mb-4">
          <Descriptions.Item label="Tahun">{tahun}</Descriptions.Item>
          <Descriptions.Item label="Provinsi">{provinsiText}</Descriptions.Item>
          <Descriptions.Item label="Instansi">{instansiText}</Descriptions.Item>
          <Descriptions.Item label="Kantor">{kantor}</Descriptions.Item>
        </Descriptions>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Tabel Data</h3>
          <div className="max-h-[300px] overflow-y-auto rounded border">
            <Table
              columns={columns}
              dataSource={modalData}
              pagination={false}
              size="small"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Summary:</p>
          <Paragraph>{summary || "-"}</Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default FedaEkonomiRegionalTpt;
