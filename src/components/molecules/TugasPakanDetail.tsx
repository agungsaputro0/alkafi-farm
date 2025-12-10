import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaChevronLeft, FaTrash } from "react-icons/fa";
import jadwalPakanData from "../pseudo_db/jadwalPakan.json";
import usersData from "../pseudo_db/users.json";
import { toast } from "react-toastify";

type JadwalPakan = {
  idJadwal: string;
  namaJadwal: string;
  tanggalMulai: string;
  customValue?: string;
  frekuensiPengulangan?: string;
  catatan?: string;
  detail?: Array<{
    jenisPakan?: string;
    targetPemberian?: string;
    kelompokTernak?: string;
    jamMulai?: string;
    jamSelesai?: string;
    catatan?: string;
    petugas?: string[];
  }>;
};

type User = {
  idPengguna: string;
  namaPengguna: string;
  email?: string;
  nomorTelepon?: string;
  avatarUrl?: string;
};

type SavedRealisasi = {
  idJadwal: string;
  waktuSimpan: string;
  jumlahPerEkor: number;
  catatan?: string;
  photosBase64: string[];
};

export default function PakanDetail(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const jadwal = useMemo<JadwalPakan>(() => {
    if (!Array.isArray(jadwalPakanData) || jadwalPakanData.length === 0) return {} as JadwalPakan;
    if (id) {
      return jadwalPakanData.find((j: any) => j.idJadwal === id) || (jadwalPakanData[0] as JadwalPakan);
    }
    return jadwalPakanData[0] as JadwalPakan;
  }, [id]);

  const detail = jadwal.detail?.[0];

  const petugasNama = (ids?: string[]) => {
    if (!ids || ids.length === 0) return [];
    return ids
      .map((pid) => {
        const u = (usersData as User[]).find((x) => x.idPengguna === pid);
        return u ? u.namaPengguna : pid;
      })
      .filter(Boolean);
  };

  const [jumlahPerEkor, setJumlahPerEkor] = useState<number | "">("");
  const [catatanRealisasi, setCatatanRealisasi] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    setUploadedFiles((prev) => {
      const allowedSlots = Math.max(0, 3 - prev.length);
      return [...prev, ...accepted.slice(0, allowedSlots)];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxFiles: 3,
  });

  useEffect(() => {
    const urls = uploadedFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [uploadedFiles]);

  const removeFile = (fileName: string) => setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  const clearAllFiles = () => setUploadedFiles([]);

  const filesToBase64 = (files: File[]) =>
    Promise.all(
      files.map(file =>
        new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => res(reader.result as string);
          reader.onerror = (e) => rej(e);
        })
      )
    );

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (jumlahPerEkor === "" || Number(jumlahPerEkor) <= 0) {
      alert("Masukkan jumlah realisasi per ekor (lebih dari 0).");
      return;
    }
    if (uploadedFiles.length > 3) {
      alert("Maksimal 3 gambar.");
      return;
    }

    setSaving(true);
    try {
      const photosBase64 = uploadedFiles.length ? await filesToBase64(uploadedFiles) : [];
      const saved: SavedRealisasi = {
        idJadwal: jadwal.idJadwal,
        waktuSimpan: new Date().toISOString(),
        jumlahPerEkor: Number(jumlahPerEkor),
        catatan: catatanRealisasi,
        photosBase64,
      };
      const key = "realisasiPakan";
      const existing: SavedRealisasi[] = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(saved);
      localStorage.setItem(key, JSON.stringify(existing));
      toast.success(
            <div>
              <strong>Berhasil!</strong>
              <div>Bukti Pelaksanaan Tugas berhasil disimpan!</div>
            </div>
          );
      setJumlahPerEkor("");
      setCatatanRealisasi("");
      clearAllFiles();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (isoOrDateString?: string) => {
    if (!isoOrDateString) return "-";
    const d = new Date(isoOrDateString);
    if (isNaN(d.getTime())) return isoOrDateString;
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (!jadwal || !jadwal.idJadwal) {
    return (
      <div className="px-4 py-20">
        <div className="max-w-3xl mx-auto p-6 bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md text-white text-center">
          <p>Tidak ada data jadwal pakan.</p>
          <button
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => navigate(-1)}
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const petugasList = petugasNama(detail?.petugas);

  return (
    <div className="px-2 py-8 mt-16 md:p-8 min-h-screen bg-[linear-gradient(180deg,#0f172a, #071124)] text-white">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            aria-label="kembali"
          >
            <FaChevronLeft />
          </button>
          <h1 className="text-2xl font-semibold">Detail Jadwal Pakan</h1>
        </div>

        {/* Card Detail */}
        <div className="bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <h2 className="text-xl font-bold">{jadwal.namaJadwal}</h2>
          <p className="text-white/70 mt-1">{jadwal.catatan || "-"}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/70">Tanggal</p>
              <p className="font-medium">{formatDate(jadwal.tanggalMulai)}</p>
            </div>
            <div>
              <p className="text-white/70">Jenis Pakan</p>
              <p className="font-medium">{detail?.jenisPakan ?? "-"}</p>
            </div>
            <div>
              <p className="text-white/70">Target</p>
              <p className="font-medium">{detail?.targetPemberian ?? "-"}</p>
            </div>
            <div>
              <p className="text-white/70">Kelompok Ternak</p>
              <p className="font-medium">{detail?.kelompokTernak ?? "-"}</p>
            </div>
            <div>
              <p className="text-white/70">Waktu</p>
              <p className="font-medium">{detail?.jamMulai ?? "-"} {detail?.jamSelesai ? `- ${detail.jamSelesai}` : ""}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-white/70">Catatan</p>
              <p className="font-medium whitespace-pre-line">{detail?.catatan ?? "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-white/70">Petugas</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {petugasList.length > 0 ? petugasList.map(p => (
                  <span key={p} className="px-3 py-1 rounded-full bg-white/20 text-sm">{p}</span>
                )) : <span className="text-white/60">-</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Form Realisasi */}
        <form
          onSubmit={handleSave}
          className="bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col gap-4"
        >
          <h3 className="text-lg font-semibold">Form Realisasi Pemberian Pakan</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-white/70 mb-2">Jumlah Pemberian (kg per ekor)</span>
              <input
                type="number"
                step={0.1}
                min={0}
                value={jumlahPerEkor === "" ? "" : String(jumlahPerEkor)}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") { setJumlahPerEkor(""); return; }
                  const n = Number(v);
                  if (Number.isNaN(n)) return;
                  setJumlahPerEkor(n);
                }}
                className="w-full rounded-lg p-2 bg-white/10 border border-white/20 text-white"
                placeholder="Misal: 2.0"
                required
              />
            </label>

            <label className="flex flex-col md:col-span-2">
              <span className="text-sm text-white/70 mb-2">Catatan Realisasi (opsional)</span>
              <textarea
                value={catatanRealisasi}
                onChange={(e) => setCatatanRealisasi(e.target.value)}
                className="w-full rounded-lg p-2 bg-white/10 border border-white/20 text-white min-h-[80px]"
                placeholder="Masukkan catatan singkat..."
              />
            </label>
          </div>

          {/* Dropzone */}
          <div className="mt-4">
            <label className="text-sm text-white/70 mb-2 block">Unggah Bukti Foto (maks 3 gambar)</label>
            <div
              {...getRootProps()}
              className={`mt-2 border-2 border-dashed rounded-xl p-4 flex flex-wrap gap-3 justify-start items-center cursor-pointer transition-colors ${
                isDragActive ? "border-white/40 bg-white/10" : "border-white/20 bg-white/5"
              }`}
            >
              <input {...getInputProps()} />
              {previews.length === 0 ? (
                <div className="flex items-center gap-3 text-white/60">
                  <FaCloudUploadAlt className="text-3xl" />
                  <div>
                    <div>Tarik & lepas gambar di sini atau klik untuk memilih</div>
                    <div className="text-xs mt-1">Tipe: jpg, png, webp. Maks: 3 file</div>
                  </div>
                </div>
              ) : (
                <>
                  {previews.map((src, idx) => (
                    <div key={src} className="relative w-28 h-28 rounded-lg overflow-hidden border border-white/20 bg-white/10">
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.onerror = null;
                          t.src = "/assets/img/hewanternak/hewanplaceholder.jpg";
                        }}
                      />
                      <button
                        type="button"
                        onClick={(ev) => { ev.stopPropagation(); const file = uploadedFiles[idx]; if (file) removeFile(file.name); }}
                        className="absolute top-1 right-1 bg-white/80 text-black rounded-full p-1"
                        aria-label="hapus foto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </>
              )}
              <div className="ml-auto text-xs text-white/70 flex items-center gap-3">
                <div>{uploadedFiles.length} / 3</div>
                {uploadedFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={(ev) => { ev.stopPropagation(); clearAllFiles(); }}
                    className="px-3 py-1 rounded bg-white/20"
                  >
                    Hapus semua
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-full w-full bg-farmgreen hover:bg-farmdarkgreen text-white font-semibold"
            >
              {saving ? "Menyimpan..." : "Simpan Realisasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
