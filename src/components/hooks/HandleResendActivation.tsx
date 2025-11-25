import axios from 'axios';
import { ApiResponse } from '../types/ApiResponse';
const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

interface ResendActivationResponse {
    message: string;
}

export const HandleResendActivation = async (email: string): Promise<{ success: boolean, message: string }> => {
    try {
        const data = {
            email: email
        }
        const response = await axios.post<ResendActivationResponse>(`${baseURL}/resend_activation_token`, data);
        if (response.data.message === 'Kode aktivasi berhasil dikirim ulang.') {
            return {
                success: true,
                message: 'Permintaan resend kode aktivasi telah berhasil. Silakan cek email Anda untuk instruksi lebih lanjut.',
                };
        }
    
        // Jika ada pesan selain itu, kembalikan pesan tersebut
        return {
            success: false,
            message: response.data.message || 'Terjadi kesalahan, coba lagi nanti.',
        };
    } catch (error) {
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

export const HandleActivateAccount = async (
    uid: string,
    kode_aktivasi: string
): Promise<ApiResponse<null>> => {
    try {
        const data = {
            kode_aktivasi: kode_aktivasi
        };
        const response = await axios.post<ApiResponse<null>>(
            `${baseURL}/activate_account/${uid}`,
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};