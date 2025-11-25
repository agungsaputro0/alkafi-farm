// hooks/useGetGeocode.ts
import { useState } from 'react';
import axios from 'axios';

// Tipe untuk parameter input
export interface GeocodeRequest {
  jalan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

// Tipe untuk hasil koordinat
export interface GeocodeResponse {
  latitude: number;
  longitude: number;
}

// Hook utama
export const useGetGeocode = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;
  
  const getCoordinates = async (
    params: GeocodeRequest
  ): Promise<GeocodeResponse> => {
    try {
      setLoading(true);

      const res = await axios.post<GeocodeResponse>(`${baseURL}/api/geocode`, params);
      return res.data;
    } catch (error) {
      throw new Error("Gagal mendapatkan koordinat");
    } finally {
      setLoading(false);
    }
  };

  return { getCoordinates, loading };
};
