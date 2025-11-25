// FedaEkonomiRegionalPdrb.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useFetchPosByInstansiTab,
  useFetchTabByKodifikasi,
  useRetrievePosKuartalan,
  useSubmitQuartalPosData,
} from "../hooks/HandleFeda";
import InlineSpinner from "../atoms/InlineSpinner";
import UniversalQuarterlyTabFormPanel, { PanelData, PosSection } from "./UniversalQuarterlyTabFormPanel";
import Button from "../atoms/Button";
import { unformatNumber } from "../utils/FormatNumberWithDelimiter";
import { Modal, Descriptions, Table, Typography } from "antd";
const { Paragraph } = Typography;

const menuKey = import.meta.env.VITE_SIXTH_KEY;

interface FedaEkonomiRegionalPdrbProps {
  tahun: string;
  provinsi: string;
  provinsiText?: string;
  instansi: string;
  instansiText?: string;
  kantor: string;
}

interface TabWrapperProps extends FedaEkonomiRegionalPdrbProps {
  tabId: string;
  tabName: string;
  onPanelDataChange: (tabId: string, data: PanelData) => void;
  setSummary: React.Dispatch<React.SetStateAction<string>>; 
}

const normalizeInitialData = (raw: any) => {
  if (!raw) return null;

  const mapQuarterObj = (obj: Record<string, any> | undefined): PosSection => {
    if (!obj) return {};
    const out: PosSection = {};
    Object.entries(obj).forEach(([posId, vals]) => {
      out[posId] = {
        q1: vals?.q1 != null ? String(vals.q1) : "",
        q2: vals?.q2 != null ? String(vals.q2) : "",
        q3: vals?.q3 != null ? String(vals.q3) : "",
        q4: vals?.q4 != null ? String(vals.q4) : "",
        tahunan: vals?.tahunan != null ? String(vals.tahunan) : "",
      };
    });
    return out;
  };

  return {
    konstan: mapQuarterObj(raw.konstan?.konstan),
    berlaku: mapQuarterObj(raw.berlaku?.berlaku),
  };
};

const TabWrapper: React.FC<TabWrapperProps> = ({
  tahun, provinsi, instansi, kantor, tabId, tabName, onPanelDataChange, setSummary
}) => {
  const { posList, loading: _posLoading, error: _posError } = useFetchPosByInstansiTab(
    instansi !== "0" ? instansi : null,
    menuKey,
    tabId
  );
  const [showDelayedForm, setShowDelayedForm] = useState(false);
  const { fetchPos, data: posData, loading: retrieveLoading } = useRetrievePosKuartalan();
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);
  
  // Reset data lama saat posList berubah
  useEffect(() => {
  if (posList.length > 0) {
    // reset form dulu
    onPanelDataChange(tabId, {
      title: tabName,
      konstan: {},
      berlaku: {},
      posList,
    });

    setShowDelayedForm(false);  // hide dulu
    setShowDelayedLoading(true); // spinner

    const timer = setTimeout(() => {
      setShowDelayedForm(true);   // baru tampilkan form
      setShowDelayedLoading(false);
      fetchPos({
        tahun: Number(tahun),
        id_instansi: instansi,
        provinsi: provinsi,
        kantor: kantor,
        id_kodifikasi: menuKey,
      });
    }, 700);

    return () => clearTimeout(timer);
  }
}, [posList, tahun, provinsi, instansi, kantor]);


  // normalisasi initial data sebelum dikirim ke child
  const initialForChild = useMemo(() => normalizeInitialData(posData?.data), [posData]);

  // AUTO-SET SUMMARY jika posData punya summary dan textarea masih kosong
  useEffect(() => {
    if (posData?.summary) {
      setSummary(posData.summary); // langsung timpa
    }
  }, [posData, setSummary]);

  return (
    <>
      {(showDelayedLoading || retrieveLoading) && <InlineSpinner />}
      {showDelayedForm && !retrieveLoading && (
        <UniversalQuarterlyTabFormPanel
          key={posList.map(p => p.id_pos).join("-")}
          posList={posList}
          title={tabName}
          initialData={initialForChild}
          onDataChange={(data) => onPanelDataChange(tabId, data)}
        />
      )}
    </>
  );
};


const FedaEkonomiRegionalPdrb: React.FC<FedaEkonomiRegionalPdrbProps> = ({
  tahun,
  provinsi,
  provinsiText,
  instansi,
  instansiText,
  kantor,
}) => {
  const { tabList, loading: tabLoading, error: tabError } = useFetchTabByKodifikasi(menuKey);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { submitData } = useSubmitQuartalPosData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, PanelData>>({});
  
  const handlePanelDataChange = useCallback((tabId: string, data: PanelData) => {
    setFormData((prev) => ({
      ...prev,
      [tabId]: data,
    }));
  }, []);

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();

    const normalized = Object.entries(formData).map(([tabId, panel]) => ({
      tabId,
      title: panel.title,
      konstan: Object.fromEntries(
        Object.entries(panel.konstan).map(([posId, qVals]) => [
          posId,
          Object.fromEntries(
            Object.entries(qVals).map(([k, v]) => [k, unformatNumber(v)])
          ),
        ])
      ),
      berlaku: Object.fromEntries(
        Object.entries(panel.berlaku).map(([posId, qVals]) => [
          posId,
          Object.fromEntries(
            Object.entries(qVals).map(([k, v]) => [k, unformatNumber(v)])
          ),
        ])
      ),
    }));

    const posLookup: Record<string, string> = {};
    Object.values(formData).forEach((panel) => {
      panel.posList.forEach((pos) => {
        posLookup[pos.id_pos] = pos.nama_pos;
      });
    });

    const hasNonZeroQuarter = (qVals: any) =>
      Number(qVals.q1) !== 0 ||
      Number(qVals.q2) !== 0 ||
      Number(qVals.q3) !== 0 ||
      Number(qVals.q4) !== 0;

    const tableData = normalized.flatMap((tab) =>
      Object.entries(tab.konstan)
        .filter(([_, qVals]) => hasNonZeroQuarter(qVals))
        .map(([posId, qVals]) => ({
          key: `${tab.tabId}-${posId}-k`,
          tab: tab.title,
          posId,
          posName: posLookup[posId] || posId,
          type: "Konstan",
          ...qVals,
        }))
    ).concat(
      normalized.flatMap((tab) =>
        Object.entries(tab.berlaku)
          .filter(([_, qVals]) => hasNonZeroQuarter(qVals))
          .map(([posId, qVals]) => ({
            key: `${tab.tabId}-${posId}-b`,
            tab: tab.title,
            posId,
            posName: posLookup[posId] || posId,
            type: "Berlaku",
            ...qVals,
          }))
      )
    );

    setModalData(tableData);
    setIsModalVisible(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    const cleanedData: Record<string, any> = {};

    Object.entries(formData).forEach(([tabKey, panel]) => {
      const { posList, ...rest } = panel;

      const filterZero = (obj: Record<string, string | number>) => {
        const res: Record<string, number> = {};
        Object.entries(obj).forEach(([k, v]) => {
          const num = Number(unformatNumber(String(v)));
          if (num !== 0) res[k] = num;
        });
        return res;
      };

      const konstanFiltered: Record<string, Record<string, number>> = {};
      Object.entries(rest.konstan).forEach(([posId, qVals]) => {
        const filtered = filterZero(qVals);
        if (Object.keys(filtered).length > 0) konstanFiltered[posId] = filtered;
      });

      const berlakuFiltered: Record<string, Record<string, number>> = {};
      Object.entries(rest.berlaku).forEach(([posId, qVals]) => {
        const filtered = filterZero(qVals);
        if (Object.keys(filtered).length > 0) berlakuFiltered[posId] = filtered;
      });

      if (Object.keys(konstanFiltered).length > 0 || Object.keys(berlakuFiltered).length > 0) {
        cleanedData[tabKey] = {
          ...rest,
          konstan: konstanFiltered,
          berlaku: berlakuFiltered,
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
    }, 1000);
  };

  if (tabLoading) return <p>Loading tab...</p>;
  if (tabError) return <p>Error: {tabError}</p>;

  const columns = [
    { title: "Tab", dataIndex: "tab", key: "tab" },
    { title: "POS Name", dataIndex: "posName", key: "posName" },
    { title: "Jenis", dataIndex: "type", key: "type" },
    { title: "Q1", dataIndex: "q1", key: "q1" },
    { title: "Q2", dataIndex: "q2", key: "q2" },
    { title: "Q3", dataIndex: "q3", key: "q3" },
    { title: "Q4", dataIndex: "q4", key: "q4" },
    { title: "Tahunan", dataIndex: "tahunan", key: "tahunan" },
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
              setSummary={setSummary} // <-- kirim setter
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
        width={900}
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
          <h3 className="font-semibold text-lg mb-2">Tabel Pengeluaran</h3>
          <div className="max-h-[300px] overflow-y-auto rounded border">
            <Table
              columns={columns}
              dataSource={modalData.filter((row) =>
                row.tab.toLowerCase().includes("pengeluaran")
              )}
              pagination={false}
              size="small"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Tabel Penawaran</h3>
          <div className="max-h-[300px] overflow-y-auto rounded border">
            <Table
              columns={columns}
              dataSource={modalData.filter((row) =>
                row.tab.toLowerCase().includes("penawaran")
              )}
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

export default FedaEkonomiRegionalPdrb;
