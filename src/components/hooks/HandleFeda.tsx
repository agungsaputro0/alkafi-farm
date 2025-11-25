import axios from 'axios';
import { useState, useEffect } from 'react';
const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;
import { toast } from 'react-toastify';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  meta?: any;
}

export interface RetrievePosPayload {
  target: any[];
  realisasi: any[];
  summary: any | null;
  meta?: any;
}


interface Instansi {
    id: string;
    name: string;
}

interface Provinsi {
    id: string;
    name: string;
}

interface Pos {
  id_pos: string;
  id_instansi: string | null;
  nama_pos: string;
}

export interface PosWithSubPos {
  id_pos: string;
  id_instansi: string | null;
  nama_pos: string;
  subpos: PosWithSubPos[]; // ⬅️ sekarang recursive
}

interface Tab {
  id_tab: string;
  nama: string;
}

interface Payload {
  tahun: string;
  bulan: string;
  provinsi: string;
  instansi: string;
  kantor: string;
  target: Record<string, string>;
  realisasi: Record<string, string>;
  summary?: string;
  id_tab?: string;
  id_kodifikasi?: string;
}

export type QuartalPosValues = {
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  [key: string]: any; // untuk field tambahan misal "tahunan"
};

export interface PosSectionEncrypted {
  konstan: Record<string, Record<string, number>>;
  berlaku: Record<string, Record<string, number>>;
}

export interface PosQuarteryFullDataEncrypted {
  tahun: number;
  provinsi: string;
  instansi: string;
  kantor: string;
  summary: string;
  id_kodifikasi: string;
  data: {
    konstan: PosSectionEncrypted;
    berlaku: PosSectionEncrypted;
  };
}

export type QuartalPosSection = {
  title: string;
  konstan: Record<string, QuartalPosValues>;
  berlaku: Record<string, QuartalPosValues>;
};

export type QuartalPayload = {
  tahun: string | number;
  provinsi: string;
  instansi: string;
  kantor: string;
  summary?: string;
  id_kodifikasi: string;
  data: Record<string, QuartalPosSection>;
};

export interface BulanValues {
  jan?: string;
  feb?: string;
  mar?: string;
  apr?: string;
  mei?: string;
  jun?: string;
  jul?: string;
  agu?: string;
  sep?: string;
  okt?: string;
  nov?: string;
  des?: string;
}

export interface BulanFullValues {
  januari?: string;
  februari?: string;
  maret?: string;
  april?: string;
  mei?: string;
  juni?: string;
  juli?: string;
  agustus?: string;
  september?: string;
  oktober?: string;
  november?: string;
  desember?: string;
}


export interface PosBulananPayload {
  tahun: string | number;
  provinsi: string;
  instansi: string;
  kantor: string;
  summary: string;
  id_kodifikasi: string | undefined;
  values: Record<string, BulanValues>;
}

export type PosBulananValues = BulanValues;

export interface PosBulananData {
  summary: string;
  values: Record<string, PosBulananValues>;
}

export interface PosSpesifikPanel {
  title: string;
  values: Record<string, BulanValues>;
  pos_list?: PosItem[]; // opsional kalau nanti mau pakai pos_list seperti backend
}

export interface PosItem {
  id_pos: string;
  sub_pos?: PosItem[];
}

export interface PosBulanSpesifikPayload {
  tahun: number | string;
  provinsi: string;
  instansi: string;
  kantor: string;
  summary?: string;
  id_kodifikasi: string;
  data: Record<string, PosSpesifikPanel>;
}

export interface BulanValueResp {
  [bulan: string]: number;
}

export interface PanelDataResp {
  title: string; 
  values: Record<string, BulanValueResp>;
}


export interface PosBulanSpecificResp {
  tahun: number;
  provinsi: string;
  instansi: string;
  kantor: string;
  summary?: string;
  id_kodifikasi: string;
  data: Record<string, PanelDataResp>; 
}

  export const useFetchProvinsi = (searchTerm: string) => {
    const [provinsi, setProvinsi] = useState<Provinsi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchProvinsi = async () => {
        setLoading(true);
        try {
          // Mengirimkan query search parameter ke backend
          const response = await axios.get(`${baseURL}/get_provinsi`, {
            params: { search: searchTerm } // menggunakan params untuk query string
          });
  
          // Menyimpan data provinsi yang diterima
          setProvinsi(response.data);
          setLoading(false);
        } catch (err) {
          // Menangani error jika gagal mengambil data
          setError('Failed to fetch provinsi');
          setLoading(false);
        }
      };
  
      // Memastikan hanya melakukan pencarian jika searchTerm memiliki panjang minimal 3 karakter
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        fetchProvinsi();
      }
    }, [searchTerm]); // Melakukan fetch setiap kali searchTerm berubah
  
    return { provinsi, loading, error };
  };

  export const useFetchInstansi = (searchTerm: string) => {
    const [instansi, setInstansi] = useState<Instansi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchInstansi = async () => {
        setLoading(true);
        try {
          // Mengirimkan query search parameter ke backend
          const response = await axios.get(`${baseURL}/get_instansi`, {
            params: { search: searchTerm } // menggunakan params untuk query string
          });
  
          // Menyimpan data instansi yang diterima
          setInstansi(response.data);
          setLoading(false);
        } catch (err) {
          // Menangani error jika gagal mengambil data
          setError('Failed to fetch instansi');
          setLoading(false);
        }
      };

      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        fetchInstansi();
      }
    }, [searchTerm]); 
  
    return { instansi, loading, error };
  };

  export const useFetchPosByInstansi = (instansiId: string | null, kodifikasiId: string | null) => {
    const [posList, setPosList] = useState<Pos[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (instansiId === null || kodifikasiId === null) {
        setPosList([]);
        setError(null);
        return;
      }

      const fetchPos = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get<ApiResponse<Pos[]>>(
            `${baseURL}/feda/pos/${instansiId}/${kodifikasiId}`,
            { withCredentials: true }
          );

          const data = response.data.data; // ✅ karena wrapper ada field `data`
          setPosList(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setError("Gagal mengambil data pos");
          setPosList([]);
        } finally {
          setLoading(false);
        }
      };

      fetchPos();
    }, [instansiId, kodifikasiId]);

    return { posList, loading, error };
  };

  export const useFetchPosByInstansiTab = (instansiId: string | null, kodifikasiId: string | null, tabId: string | null) => {
    const [posList, setPosList] = useState<Pos[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (instansiId === null || kodifikasiId === null || tabId === null) {
        setPosList([]);
        setError(null);
        return;
        }

        const fetchPos = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<ApiResponse<Pos[]>>(
            `${baseURL}/feda/pos_tab/${instansiId}/${kodifikasiId}/${tabId}`,
            { withCredentials: true }
            );

            const data = response.data.data;
            setPosList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError("Gagal mengambil data pos");
            setPosList([]);
        } finally {
            setLoading(false);
        }
        };

        fetchPos();
    }, [instansiId, kodifikasiId, tabId]);

    return { posList, loading, error };
    };

    export const useFetchPosWithSubposByInstansiTab = (
      instansiId: string | null,
      kodifikasiId: string | null,
      tabId: string | null
    ) => {
      const [posList, setPosList] = useState<PosWithSubPos[]>([]);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        if (instansiId === null || kodifikasiId === null || tabId === null) {
          setPosList([]);
          setError(null);
          return;
        }

        const fetchPos = async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await axios.get<ApiResponse<PosWithSubPos[]>>(
              `${baseURL}/feda/pos_with_subpos_tab/${instansiId}/${kodifikasiId}/${tabId}`,
              { withCredentials: true }
            );

            const data = response.data.data;
            setPosList(Array.isArray(data) ? data : []);
          } catch (err) {
            console.error(err);
            setError("Gagal mengambil data pos");
            setPosList([]);
          } finally {
            setLoading(false);
          }
        };

        fetchPos();
      }, [instansiId, kodifikasiId, tabId]);

      return { posList, loading, error };
    };

    export const useFetchTabByKodifikasi = (kodifikasiId: number | null) => {
        const [tabList, setTabList] = useState<Tab[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            if (kodifikasiId === null) {
            setTabList([]);
            setError(null);
            return;
            }

            const fetchTab = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get<ApiResponse<Tab[]>>(
                `${baseURL}/feda/tab/${kodifikasiId}`,
                { withCredentials: true }
                );

                const data = response.data.data;
                setTabList(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Gagal mengambil data pos");
                setTabList([]);
            } finally {
                setLoading(false);
            }
            };

            fetchTab();
        }, [kodifikasiId]);

        return { tabList, loading, error };
    };


  export const useSubmitPosData = () => {
    const [loading, setLoading] = useState(false);

    const validatePayload = (payload: Payload): string | null => {
      if (!payload.tahun) return "Tahun wajib diisi";
      if (!payload.bulan) return "Bulan wajib diisi";
      if (!payload.instansi || payload.instansi === "0") return "Instansi wajib dipilih";
      if (!payload.provinsi || payload.provinsi === "0") return "Provinsi wajib dipilih";

      for (const [idPos, val] of Object.entries(payload.target)) {
        if (isNaN(Number(val.replace(/\./g, "").replace(",", ".")))) {
          return `Target untuk POS ${idPos} harus berupa angka`;
        }
      }

      for (const [idPos, val] of Object.entries(payload.realisasi)) {
        if (isNaN(Number(val.replace(/\./g, "").replace(",", ".")))) {
          return `Realisasi untuk POS ${idPos} harus berupa angka`;
        }
      }

      return null; // ✅ lolos validasi
    };

    const submitData = async (payload: Payload) => {
      setLoading(true);

      const errorMsg = validatePayload(payload);
      if (errorMsg) {
        setLoading(false);
        toast.error(
            <div>
              <strong>Validasi Gagal !</strong>
              <div>{`${errorMsg}`}</div>
            </div>
          );
        return;
      }

      try {
        // ✅ Transform data agar sesuai backend
        const transformed = {
          ...payload,
          tahun: Number(payload.tahun),      
          bulan: Number(payload.bulan),      
          instansi: payload.instansi, 
          provinsi: payload.provinsi, 
          target: Object.fromEntries(
            Object.entries(payload.target).map(([k, v]) => [k, Number(v.replace(/\./g, "").replace(",", "."))])
          ),
          realisasi: Object.fromEntries(
            Object.entries(payload.realisasi).map(([k, v]) => [k, Number(v.replace(/\./g, "").replace(",", "."))])
          ),
          id_tab: payload.id_tab,
          id_kodifikasi: payload.id_kodifikasi
        };

        const res = await axios.post(`${baseURL}/feda/submit`, transformed, { withCredentials: true });
        
        if (res.data.status === "success") {
          toast.success(
            <div>
              <strong>Selamat !</strong>
              <div>{`${res.data.message || "Data berhasil disimpan"}`}</div>
            </div>
          );
        } else {
          toast.error(
            <div>
              <strong>Mohon Maaf !</strong>
              <div>{`${res.data.message || "Terjadi kesalahan saat menyimpan data"}`}</div>
            </div>
          );
        }

        // console.log("✅ Response:", res.data);
      } catch (err: any) {
        toast.error(
            <div>
              <strong>Mohon Maaf !</strong>
              <div>{`${err.response?.data?.message || "Terjadi kesalahan saat menyimpan data"}`}</div>
            </div>
          );
      } finally {
        setLoading(false);
      }
    };

  return { submitData, loading };
};

export const useRetrievePos = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RetrievePosPayload | null>(null);

  const fetchPos = async (payload: {
    tahun: number;
    bulan: number;
    id_instansi: string;
    provinsi: string;
    kantor: string;
    id_kodifikasi: string | undefined;
    id_tab: string | null;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/feda/pos_data`,
        payload, // 🔹 kirim sebagai body JSON
        {
          withCredentials: true,
        }
      );

      if (res.data.status === "success") {
        setData(res.data.data);
      } else {
        toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${res.data.message || "Tidak dapat mengambil data POS"}`}</div>
           </div>
         );
      }

      // console.log("✅ Response retrieve_pos:", res.data);
      return res.data;
    } catch (err: any) {
      toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${err.response?.data?.message || "Terjadi kesalahan saat mengambil data POS"}`}</div>
           </div>
         );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPos, data, loading };
};

export const useSubmitQuartalPosData = () => { 
  const [loading, setLoading] = useState(false);

  const validatePayload = (payload: QuartalPayload): string | null => {
    if (!payload.tahun) return "Tahun wajib diisi";
    if (!payload.instansi || payload.instansi === "0") return "Instansi wajib dipilih";
    if (!payload.provinsi || payload.provinsi === "0") return "Provinsi wajib dipilih";
    if (!payload.kantor) return "Kantor wajib diisi";

    for (const section of Object.values(payload.data || {})) {
      for (const posValues of Object.values(section.konstan || {})) {
        for (const q of ["q1","q2","q3","q4"]) {
          const val = posValues[q as keyof QuartalPosValues];
          if (val !== undefined && isNaN(Number(val))) {
            return `Nilai ${q} untuk POS ${JSON.stringify(posValues)} harus berupa angka`;
          }
        }
      }
      for (const posValues of Object.values(section.berlaku || {})) {
        for (const q of ["q1","q2","q3","q4"]) {
          const val = posValues[q as keyof QuartalPosValues];
          if (val !== undefined && isNaN(Number(val))) {
            return `Nilai ${q} untuk POS ${JSON.stringify(posValues)} harus berupa angka`;
          }
        }
      }
    }

    return null;
  };

  const submitData = async (payload: QuartalPayload) => {
    setLoading(true);

    const errorMsg = validatePayload(payload);
    if (errorMsg) {
      setLoading(false);
        toast.error(
            <div>
              <strong>Validasi Gagal !</strong>
              <div>{`${errorMsg}`}</div>
            </div>
          );
      return;
    }

    try {
      const transformed: QuartalPayload = {
        tahun: Number(payload.tahun),
        provinsi: payload.provinsi,
        instansi: payload.instansi,
        kantor: payload.kantor,
        summary: payload.summary || "",
        id_kodifikasi: payload.id_kodifikasi,
        data: Object.fromEntries(
          Object.entries(payload.data).map(([formId, section]) => [
            formId,
            {
              title: section.title,
              konstan: Object.fromEntries(
                Object.entries(section.konstan || {}).map(([posId, vals]) => [
                  posId,
                  {
                    q1: Number(vals.q1 ?? 0),
                    q2: Number(vals.q2 ?? 0),
                    q3: Number(vals.q3 ?? 0),
                    q4: Number(vals.q4 ?? 0),
                  },
                ])
              ),
              berlaku: Object.fromEntries(
                Object.entries(section.berlaku || {}).map(([posId, vals]) => [
                  posId,
                  {
                    q1: Number(vals.q1 ?? 0),
                    q2: Number(vals.q2 ?? 0),
                    q3: Number(vals.q3 ?? 0),
                    q4: Number(vals.q4 ?? 0),
                  },
                ])
              ),
            },
          ])
        ),
      };

      const res = await axios.post(`${baseURL}/feda/submit/quartal`, transformed, { withCredentials: true });

      if (res.data.status === "success") {
        toast.success(
            <div>
              <strong>Selamat !</strong>
              <div>{`${res.data.message || "Data berhasil disimpan ke server"}`}</div>
            </div>
          );
      } else {
         toast.error(
            <div>
              <strong>Mohon maaf !</strong>
              <div>{`${res.data.message || "Terjadi kesalahan saat menyimpan data"}`}</div>
            </div>
          );
      }
    } catch (err: any) {
      toast.error(
            <div>
              <strong>Mohon maaf !</strong>
              <div>{`${err.response?.data?.message || "Terjadi kesalahan saat menyimpan data"}`}</div>
            </div>
          );
    } finally {
      setLoading(false);
    }
  };

  return { submitData, loading };
};

export const useRetrievePosKuartalan = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PosQuarteryFullDataEncrypted | null>(null);

  const fetchPos = async (payload: {
    tahun: number;
    id_instansi: string;
    provinsi: string;
    kantor: string;
    id_kodifikasi: string | undefined;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<PosQuarteryFullDataEncrypted>>(
        `${baseURL}/feda/pos_data/quartal`,
        payload,
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        setData(res.data.data);
      } else {
        toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${res.data.message || "Tidak dapat mengambil data POS"}`}</div>
           </div>
         );
      }

      return res.data;
    } catch (err: any) {
      toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${err.response?.data?.message || "Terjadi kesalahan saat mengambil data POS"}`}</div>
           </div>
         );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPos, data, loading };
};

export const useSubmitPosDataBulanan = () => {
  const [loading, setLoading] = useState(false);

  const validatePayload = (payload: PosBulananPayload): string | null => {
    if (!payload.tahun) return "Tahun wajib diisi";
    if (isNaN(Number(payload.tahun))) return "Tahun harus berupa angka";
    if (!payload.instansi || payload.instansi === "0")
      return "Instansi wajib dipilih";
    if (!payload.provinsi || payload.provinsi === "0")
      return "Provinsi wajib dipilih";
    if (!payload.kantor) return "Kantor wajib diisi";
    if (!payload.values || Object.keys(payload.values).length === 0)
      return "Data bulanan tidak boleh kosong";

    return null;
  };

  const submitData = async (payload: PosBulananPayload) => {
    setLoading(true);

    const errorMsg = validatePayload(payload);
    if (errorMsg) {
      setLoading(false);
      toast.error(
            <div>
              <strong>Validasi Gagal !</strong>
              <div>{`${errorMsg}`}</div>
            </div>
          );
      return;
    }

    try {
      // transform sesuai struktur baru
      const transformed: PosBulananPayload = {
        ...payload,
        tahun: Number(payload.tahun),
        
      };

      const res = await axios.post<ApiResponse<null>>(
        `${baseURL}/feda/submit/bulanan`,
        transformed,
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        toast.success(
            <div>
              <strong>Selamat !</strong>
              <div>{`${res.data.message || "Data POS berhasil disimpan"}`}</div>
            </div>
          );
      } else {
        toast.error(
            <div>
              <strong>Validasi Gagal !</strong>
              <div>{`${res.data.message || "Tidak dapat menyimpan data POS"}`}</div>
            </div>
          );
      }

      return res.data;
    } catch (err: any) {
      toast.error(
            <div>
              <strong>Validasi Gagal !</strong>
              <div>{`${err.response?.data?.message || "Terjadi kesalahan saat menyimpan data POS"}`}</div>
            </div>
          );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitData, loading };
};

export const useRetrievePosBulanan = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PosBulananData | null>(null);

  const fetchPos = async (payload: {
    tahun: number;
    instansi: string;
    provinsi: string;
    kantor: string;
    id_kodifikasi: string;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<PosBulananData>>(
        `${baseURL}/feda/pos_data/bulanan`,
        payload,
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        setData(res.data.data || null);
      } else {
        toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${res.data.message || "Tidak dapat mengambil data POS"}`}</div>
           </div>
         );
      }

      return res.data;
    } catch (err: any) {
      toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${err.response?.data?.message || "Terjadi kesalahan saat mengambil data POS"}`}</div>
           </div>
         );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPos, data, loading };
};

export const useSubmitPosDataBulanSpesifik = () => {
  const [loading, setLoading] = useState(false);

  const validatePayload = (payload: PosBulanSpesifikPayload): string | null => {
    if (!payload.tahun) return "Tahun wajib diisi";
    if (isNaN(Number(payload.tahun))) return "Tahun harus berupa angka";
    if (!payload.instansi || payload.instansi === "0")
      return "Instansi wajib dipilih";
    if (!payload.provinsi || payload.provinsi === "0")
      return "Provinsi wajib dipilih";
    if (!payload.kantor) return "Kantor wajib diisi";
    if (!payload.data || Object.keys(payload.data).length === 0)
      return "Data bulanan tidak boleh kosong";

    return null;
  };

  const submitData = async (payload: PosBulanSpesifikPayload) => {
    setLoading(true);

    const errorMsg = validatePayload(payload);
    if (errorMsg) {
      setLoading(false);
      toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${errorMsg}`}</div>
           </div>
         );
      return;
    }

    try {
      // pastikan tahun dikirim sebagai number
      const transformed: PosBulanSpesifikPayload = {
        ...payload,
        tahun: Number(payload.tahun),
      };

      const res = await axios.post<ApiResponse<null>>(
        `${baseURL}/feda/submit/spesifik`,
        transformed,
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        toast.success(
           <div>
            <strong>Selamat !</strong>
             <div>{`${res.data.message || "Data POS bulanan berhasil disimpan"}`}</div>
           </div>
         );
      } else {
         toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${res.data.message || "Tidak dapat menyimpan data POS"}`}</div>
           </div>
         );
      }

      return res.data;
    } catch (err: any) {
      toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${err.response?.data?.message || "Terjadi kesalahan saat menyimpan data POS"}`}</div>
           </div>
         );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitData, loading };
};

export const useRetrievePosBulanSpesifik = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PosBulanSpecificResp | null>(null);

  const fetchPos = async (payload: {
    tahun: number;
    instansi: string;
    provinsi: string;
    kantor: string;
    id_kodifikasi: string;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse<PosBulanSpecificResp>>(
        `${baseURL}/feda/pos_data/spesifik`,
        payload,
        { withCredentials: true }
      );

      if (res.data.status === "success") {
        setData(res.data.data || null);
      } else {
        toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${res.data.message || "Tidak dapat mengambil data POS"}`}</div>
           </div>
         );
      }

      return res.data;
    } catch (err: any) {
      toast.error(
           <div>
            <strong>Mohon Maaf !</strong>
             <div>{`${err.response?.data?.message || "Terjadi kesalahan saat mengambil data POS"}`}</div>
           </div>
         );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPos, data, loading };
};