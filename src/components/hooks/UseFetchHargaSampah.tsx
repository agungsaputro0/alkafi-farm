import { useState, useEffect } from "react";
import axios from "axios";

export interface HargaGrade {
  harga_tunai: number;
  poin_per_kg: number;
}

export interface TipeSampahHarga {
  tipe_sampah: string;
  harga: Record<string, HargaGrade>;
}

const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

export const useFetchHargaByUser = () => {
  const [data, setData] = useState<TipeSampahHarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/bank_sampah/price_data`, {
        withCredentials: true,
      });
      setData(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data harga sampah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
