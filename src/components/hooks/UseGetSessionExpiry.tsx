// hooks/useGetSessionExpiry.ts
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useLogoutHandler } from './HandleLogout';

export interface SessionExpiryResponse {
  expiresAt: number;
}

export const useGetSessionExpiry = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

  const getSessionExpiry = async (): Promise<SessionExpiryResponse> => {
    try {
      setLoading(true);

      const res = await axios.get<SessionExpiryResponse>(`${baseURL}/credential/session-expiry`, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      const error = err as AxiosError;

      const shouldLogout =
        error.response?.status === 401 ||
        (error.response?.data &&
          typeof error.response.data === 'object' &&
          'error' in error.response.data &&
          [
            'Token is not active',
            'Token expired',
            'Token not found in active token list',
          ].includes((error.response.data as any).error));

      if (shouldLogout) {
        await useLogoutHandler(); // auto logout
      }

      throw new Error('Gagal mengambil waktu kedaluwarsa sesi.');
    } finally {
      setLoading(false);
    }
  };

  return { getSessionExpiry, loading };
};
