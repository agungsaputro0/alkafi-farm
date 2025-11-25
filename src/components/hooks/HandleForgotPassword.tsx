import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

export const HandleforgotPassword = async (email: string): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await axios.post<{ message: string }>(`${baseURL}/forgot_password`, { email });
  
      // Jika response status adalah sukses, berikan pesan yang sesuai
      if (response.data.message === 'Token reset password telah dikirim ke email.') {
        return {
          success: true,
          message: 'Permintaan reset kata sandi telah berhasil. Silakan cek email Anda untuk instruksi lebih lanjut.',
        };
      }
  
      // Jika ada pesan selain itu, kembalikan pesan tersebut
      return {
        success: false,
        message: response.data.message || 'Terjadi kesalahan, coba lagi nanti.',
      };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          message:
            error.response.data.message || 'Terjadi kesalahan dari server.',
        };
      }
  
      return {
        success: false,
        message: 'Terjadi kesalahan koneksi atau kesalahan tidak diketahui.',
      };
    }
  };
  