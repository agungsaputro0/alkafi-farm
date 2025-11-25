// hooks/handlers/useLogoutHandler.ts
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useLogoutHandler = () => {
  const dispatch = useDispatch();
  const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`${baseURL}/logout`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Logout Berhasil');
        dispatch(logout());
        setTimeout(() => {
          window.location.href = '/Login';
        }, 1000);
      } else {
        console.error('Error during logout:', response.data);
        toast.error('Terjadi kesalahan saat Logou');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat Logou');
    }
  };

  return { handleLogout };
};
