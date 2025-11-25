import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import UploadExcel from "./WastePriceExcelUploader";


interface HargaGrade {
  harga_tunai: number;
  poin_per_kg: number;
}

interface TipeSampahHarga {
  tipe_sampah: string;
  harga: Record<string, HargaGrade>;
}

interface HargaSampahPanelProps {
  data: TipeSampahHarga[];
  onReload: () => void;
}

const HargaSampahPanel: React.FC<HargaSampahPanelProps> = ({ data, onReload }) => {
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);
  useEffect(() => {
    if (uploadStatus === "success") {
      onReload(); 
      setUploadStatus(null); 
    }
  }, [uploadStatus, onReload]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20"],
  });

  const columns: ColumnsType<TipeSampahHarga & { key: number }> = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (text) => <span className="text-white font-mono">{text}</span>,
    },
    {
      title: "Waste Type",
      dataIndex: "tipe_sampah",
      key: "tipe_sampah",
      sorter: (a, b) => a.tipe_sampah.localeCompare(b.tipe_sampah),
      render: (text) => <span className="text-white font-semibold">{text}</span>,
    },
    {
      title: "Grade A",
      dataIndex: ["harga", "Grade A"],
      key: "grade_a",
      className: "bg-green-700",
      render: (grade?: HargaGrade) =>
        grade ? (
          <span className="text-white">
            {grade.harga_tunai} / {grade.poin_per_kg}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Grade B",
      dataIndex: ["harga", "Grade B"],
      key: "grade_b",
      className: "bg-green-600",
      render: (grade?: HargaGrade) =>
        grade ? (
          <span className="text-white">
            {grade.harga_tunai} / {grade.poin_per_kg}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Grade C",
      dataIndex: ["harga", "Grade C"],
      key: "grade_c",
      className: "bg-green-500",
      render: (grade?: HargaGrade) =>
        grade ? (
          <span className="text-white">
            {grade.harga_tunai} / {grade.poin_per_kg}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_text, record) => (
        <Button
          type="primary"
          className="bg-emerald-900 border-emerald-900 hover:bg-green-800 hover:border-green-800 button-update"
          onClick={() => {
            alert(`Update clicked for: ${record.tipe_sampah}`);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  const sortedData = [...data].sort((a, b) =>
    a.tipe_sampah.localeCompare(b.tipe_sampah)
  );

  const dataSource = sortedData.map((item, index) => ({ ...item, key: index + 1 }));

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };
  

  return (
    <div className="bg-white/10 rounded-xl p-5 shadow-md text-cyan-100">
      <h2 className="text-3xl font-semibold text-white mb-4 border-b border-white pb-4">
        Waste Material Pricing Panel 
      </h2>
      <p className="text-white text-sm mb-6 text-justify border-b border-white pb-4">
        This panel displays a detailed price list for various types of waste materials, categorized by quality grades (Grade A, B, and C). For each type, it shows both the cash price and reward points per kilogram. We provide you the flexibility to set and adjust the prices of waste materials per type according to the policies of your waste bank.
      </p>
      <UploadExcel onUploadStatusChange={setUploadStatus} />
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        rowClassName={(_record, index) =>
          index % 2 === 0 ? "bg-lime-800" : "bg-lime-700"
        }
        className="text-white custom-table"
        scroll={{ x: true }}
        // supaya kolom fixed kanan berfungsi
        // bisa kamu sesuaikan jika butuh
      />

      {/* Grade Legend */}
      <div className="mt-6 text-white text-sm space-y-3 w-full">
        <h3 className="text-lg font-semibold mb-2 border-b pb-3 border-white/30">Legend</h3>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-700 rounded border border-white"></div>
          <span>
            <strong>Grade A:</strong> Best quality, clean, and well sorted.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-600 rounded border border-white"></div>
          <span>
            <strong>Grade B:</strong> Medium quality, some dirt or mixture present.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded border border-white"></div>
          <span>
            <strong>Grade C:</strong> Low quality, mixed or dirty materials.
          </span>
        </div>

        <div className="mt-4 border-t border-white/30 pt-3">
          <p>
            <strong>Note on values like <code>0 / 0</code> :</strong> This indicates
            that the cash price and reward points per kilogram are currently not
            available or set to zero for this grade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HargaSampahPanel;