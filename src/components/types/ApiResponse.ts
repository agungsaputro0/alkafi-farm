// types/apiResponses.ts

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T | null;
  meta?: any | null;
};

// Tipe spesifik untuk aktivasi akun
export type ApiResponses = ApiResponse<null>;
