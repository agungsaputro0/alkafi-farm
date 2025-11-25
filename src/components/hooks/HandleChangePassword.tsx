import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

export const HandleChangePassword = async (
  token: string,
  new_password: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post<{ message: string; status: string }>(
      `${baseURL}/change_password`,
      {
        token,
        new_password,
      }
    );

    if (response.data.status === 'success') {
      return {
        success: true,
        message: response.data.message || 'Kata sandi berhasil diubah.',
      };
    }

    return {
      success: false,
      message: response.data.message || 'Gagal mengubah kata sandi.',
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message:
          error.response.data.message ||
          'Terjadi kesalahan dari server.',
      };
    }

    return {
      success: false,
      message: 'Terjadi kesalahan koneksi atau kesalahan tidak diketahui.',
    };
  }
};
