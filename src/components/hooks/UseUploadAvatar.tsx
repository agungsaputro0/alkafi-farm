import { useState } from "react";
import axios from "axios";

const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

export const useUploadAvatar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<{ success: boolean; avatarUrl: string } | null> => {
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await axios.post(`${baseURL}/bank_sampah/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // Pastikan statusnya success dan data.avatarUrl ada
    if (res.data.status === "success" && res.data.data?.avatarUrl) {
      return {
         success: true,
         avatarUrl: res.data.data.avatarUrl
      };
    } else {
      setError(res.data.message || "Upload failed");
      return null;
    }
  } catch (err: any) {
    console.error("Upload avatar failed:", err);
    // Coba ambil message error dari response backend kalau ada
    const message =
      err.response?.data?.message || "Failed to upload avatar";
    setError(message);
    return null;
  } finally {
    setLoading(false);
  }
};


  return { uploadAvatar, loading, error };
};

export const useUploadCoverImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadcover = async (file: File): Promise<{ success: boolean; coverUrl: string } | null> => {
  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("cover", file);

  try {
    const res = await axios.post(`${baseURL}/bank_sampah/cover`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // Pastikan statusnya success dan data.coverUrl ada
    if (res.data.status === "success" && res.data.data?.coverUrl) {
      return {
         success: true,
         coverUrl: res.data.data.coverUrl
      };
    } else {
      setError(res.data.message || "Upload failed");
      return null;
    }
  } catch (err: any) {
    console.error("Upload cover failed:", err);
    // Coba ambil message error dari response backend kalau ada
    const message =
      err.response?.data?.message || "Failed to upload cover";
    setError(message);
    return null;
  } finally {
    setLoading(false);
  }
};


  return { uploadcover, loading, error };
};