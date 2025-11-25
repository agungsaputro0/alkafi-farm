import React, { useState, useCallback } from "react";
import { Modal, Button, Typography, notification } from "antd";
import { useDropzone } from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons";
import { FaFileExcel } from "react-icons/fa";
import { useUploadWastePricingSheet } from "../hooks/UseUploadWastePricingSheet";
const { Text, Link } = Typography;

interface UploadExcelProps {
   onUploadStatusChange: (status: "success" | "error") => void;
}

const UploadExcel: React.FC<UploadExcelProps> = ({ onUploadStatusChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;
  const spreadsheetUrl = `${baseURL}/template/Waste_Material_Pricing_Table_ZeroTrace_with_Desc.xlsx`;
  const sheetUploader = useUploadWastePricingSheet();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const sheetUrl = await sheetUploader.uploadWastePricingSheet(selectedFile);
      if (sheetUrl?.success) {
        onUploadStatusChange("success");
        notification.success({
          message: "Pricing Upload Successful!",
          description: "Waste pricing sheet has been updated.",
        });
      } else {
        onUploadStatusChange("error");
      }
      closeModal();
    }
  };


  return (
    <>
      <Button
        className="mb-4 bg-gradient-to-r border from-blue-900 to-blue-700 hover:bg-blue-600 text-white"
        type="primary"
        icon={<UploadOutlined />}
        onClick={openModal}
        title="Click to upload an Excel spreadsheet file"
        style={{ fontWeight: "600", letterSpacing: "0.02em" }}
      >
        Upload Excel Template
      </Button>

      <Modal
        title={<h2 className="text-xl font-semibold text-blue-700 border-b border-blue-400 pb-2 mb-4 mt-[-7px]">Upload By Spreadsheet</h2>}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleUpload}
        okText="Start Upload"
        cancelText="Cancel"
        centered
        bodyStyle={{ backgroundColor: "#f0f5ff", padding: "24px", borderRadius: "8px" }}
        style={{ borderRadius: "12px" }}
        okButtonProps={{
          style: { background: "#2563eb", borderColor: "#2563eb", fontWeight: 600 },
          disabled: !selectedFile,
        }}
        cancelButtonProps={{ style: { fontWeight: 600 } }}
      >
        <Link
        href={spreadsheetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-6 rounded-xl hover:bg-blue-50 transition-colors duration-300"
        title="Download Excel Template"
      >
        <div className="flex items-center border-2 border-green-600 p-4 rounded-xl gap-3 text-green-600 hover:text-green-800 font-semibold">
          <FaFileExcel size={28} />
          Click here to Download Excel Template
        </div>
      </Link>

        <Text className="mb-4 block text-gray-700">
          Please make sure the Excel file you upload follows this template.
        </Text>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-300 select-none
            ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white hover:bg-blue-50"}
          `}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <Text strong>{selectedFile.name}</Text>
          ) : isDragActive ? (
            <Text>Drop the Excel file here...</Text>
          ) : (
            <Text>Drag & drop an Excel file here, or click to select</Text>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UploadExcel;
