import { useState } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

export const useUploadWastePricingSheet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadWastePricingSheet = async (file: File): Promise<{ success: boolean; wastePricingSheetUrl: string } | null> => {
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("WastePricingSheet", file);

  try {
    const res = await axios.post(`${baseURL}/bank_sampah/set_pricing`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // Pastikan statusnya success dan data.WastePricingSheetUrl ada
    if (res.data.status === "success") {
      return {
         success: true,
         wastePricingSheetUrl: ""
      };
    } else {
      setError(res.data.message || "Upload failed");
      return null;
    }
  } catch (err: any) {
    console.error("Upload WastePricingSheet failed:", err);
    // Coba ambil message error dari response backend kalau ada
    const message =
      err.response?.data?.message || "Failed to upload WastePricingSheet";
    setError(message);
    return null;
  } finally {
    setLoading(false);
  }
};


  return { uploadWastePricingSheet, loading, error };
};

