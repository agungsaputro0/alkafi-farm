import { useState, useEffect } from 'react';
import axios from 'axios';

export interface DataBankSampah {
  uid: string;
  tipe_bank_sampah: string;
  nama_bank_sampah: string;
  alamat: string;
  koordinat_lokasi: string;
  kontak: string;
  jam_buka: string;
  jam_tutup: string;
  kapasitas: number;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  profil_image: string;
  cover_image: string;
}

const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

export const useFetchBankSampah = (search: string, page: number, limit: number) => {
  const [data, setData] = useState<DataBankSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/bank_sampah/`, {
          params: { search, page, limit },
          withCredentials: true,
        });

        // karena backend pakai ApiResponse, datanya ada di res.data.data
        setData(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data bank sampah');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page, limit]);

  return { data, loading, error };
};


export const useFetchBankSampahByUser = () => {
  const [data, setData] = useState<DataBankSampah>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/bank_sampah/user`, {
          withCredentials: true,
        });

        // karena backend pakai ApiResponse, datanya ada di res.data.data
        setData(res.data.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data bank sampah');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
