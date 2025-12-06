import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BiTask, BiTaskX } from "react-icons/bi";
import { LuCalendarClock } from "react-icons/lu";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";

import usersRaw  from "../pseudo_db/users.json";
import jenisPakanRaw from "../pseudo_db/jenispakan.json";

const DetailJadwalPakan = () => {
  const { idJadwal } = useParams();
  const navigate = useNavigate();

  const [dataJadwal, setDataJadwal] = useState<any>(null);
  const [detailList, setDetailList] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number | "all">(10);

  const users: any[] = usersRaw;
  const jenisPakan: any[] = jenisPakanRaw;

  // ==========================================
  //  LOAD DATA JADWAL
  // ==========================================
  useEffect(() => {
    if (!idJadwal) return;

    const stored = JSON.parse(localStorage.getItem("JadwalPakan") || "[]");
    const jadwal = stored.find((j: any) => j.idJadwal === idJadwal);

    if (jadwal) {
      setDataJadwal(jadwal);
      setDetailList(jadwal.detail || []);
    }
  }, [idJadwal]);

  // ==========================================
  //  MAPPING ID -> NAMA
  // ==========================================
  const convertJenisPakan = (id: string) => {
    const p = jenisPakan.find((x) => x.idJenisPakan === id);
    return p ? p.namaJenisPakan : id;
  };

  const convertPetugas = (arr: string[]) => {
    return arr
      .map((id) => {
        const u = users.find((x) => x.idPengguna === id);
        return u ? u.namaPengguna : id;
      })
      .join(", ");
  };

  // ==========================================
  // FILTER & PAGINASI
  // ==========================================
  const filteredData = useMemo(() => {
    return detailList.filter((d) => {
      const jenis = convertJenisPakan(d.jenisPakan).toLowerCase();
      const kelompok = d.kelompokTernak.toLowerCase();
      const pet = convertPetugas(d.petugas).toLowerCase();
      return (
        jenis.includes(search.toLowerCase()) ||
        kelompok.includes(search.toLowerCase()) ||
        pet.includes(search.toLowerCase())
      );
    });
  }, [search, detailList]);

  const paginatedData = useMemo(() => {
    if (rowsPerPage === "all") return filteredData;
    return filteredData.slice(0, rowsPerPage);
  }, [filteredData, rowsPerPage]);

  // ==========================================
  // DELETE DETAIL
  // ==========================================
  const handleDeleteDetail = (index: number) => {
    Swal.fire({
      title: "Hapus Penugasan?",
      text: "Data penugasan ini akan dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        const updated = detailList.filter((_, i) => i !== index);
        setDetailList(updated);
        setDataJadwal((prev: any) => ({ ...prev, detail: updated }));
      }
    });
  };

  // ==========================================
  // SIMPAN LOCALSTORAGE
  // ==========================================
  const simpan = () => {
    if (!dataJadwal) return;

    // VALIDASI WAJIB ADA DETAIL
    if (detailList.length === 0) {
      toast.error("Minimal harus ada 1 penugasan pakan!");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("JadwalPakan") || "[]");
    const idx = stored.findIndex((j: any) => j.idJadwal === idJadwal);

    stored[idx] = { ...dataJadwal, detail: detailList };

    localStorage.setItem("JadwalPakan", JSON.stringify(stored));

    toast.success(<div>
          <strong>Sukses!</strong>
          <div>Jadwal dan penugasan pemberian pakan berhasil ditambahkan!</div>
        </div>);

    setTimeout(() => {
      navigate("/jadwal/pakan");
    }, 1000);
  };

  // ==========================================
  // JAM FORMATTER
  // ==========================================
  const formatJam = (mulai: string, selesai?: string) =>
    selesai ? `${mulai} - ${selesai}` : mulai;

  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span
              onClick={() => navigate("/jadwal/pakan")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Jadwal Tugas • Pemberian Pakan •{" "}
            </span>
            Penugasan Pakan
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl border border-gray-100 shadow-lg">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <BiTask className="text-4xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl mt-2 font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Penugasan Pemberian Pakan
                </h2>
              </div>
            </div>
            {/* HEADER */}
            <div className="flex items-center gap-6 pb-6 mb-8 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-6 shadow-sm">
              <LuCalendarClock className="text-6xl text-farmdarkestbrown shrink-0" />

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring">
                    {dataJadwal?.namaJadwal}
                  </h2>
                  <p className="text-sm text-[#724e3a]">{dataJadwal ? formatTanggalIndo(dataJadwal?.tanggalMulai, true) : ""}</p>
                  <p className="text-sm text-[#724e3a]">
                    Pengulangan:
                    <b className="ml-1">
                      {dataJadwal?.frekuensiPengulangan === "custom"
                        ? `${dataJadwal.customValue} hari sekali`
                        : dataJadwal?.frekuensiPengulangan}
                    </b>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-farmdarkestbrown">Catatan</h3>
                  <p className="text-sm text-[#724e3a]">{dataJadwal?.catatan || "-"}</p>
                </div>
              </div>
            </div>

            {/* TAMBAH */}
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => navigate("/TambahPenugasanPakan/" + idJadwal)}
                variant="bg-farmbrown hover:bg-farmdarkestbrown text-white flex gap-2 items-center px-4 py-2 rounded-full"
              >
                <FaPlus /> Tambah Penugasan
              </Button>
            </div>

            {/* SEARCH + ROW CONTROL */}
            <div className="flex justify-between mb-3">
              <select
                className="border px-3 py-2 rounded-lg"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value === "all" ? "all" : Number(e.target.value))}
              >
                <option value={5}>5 row</option>
                <option value={10}>10 row</option>
                <option value={20}>20 row</option>
                <option value="all">All</option>
              </select>
              <input
                type="text"
                placeholder="Cari (jenis pakan / kelompok / petugas)..."
                className="px-3 py-2 border rounded-lg w-1/4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* TABEL */}
            <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg">
              <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange">
                <tr>
                  <th className="py-2 px-3 border">No</th>
                  <th className="py-2 px-3 border">Jenis Pakan</th>
                  <th className="py-2 px-3 border">Kelompok</th>
                  <th className="py-2 px-3 border">Jam</th>
                  <th className="py-2 px-3 border">Petugas</th>
                  <th className="py-2 px-3 border">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      <BiTaskX className="text-5xl mx-auto mb-2" />
                      Tidak ada penugasan
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((d, i) => (
                    <tr key={i} className="text-center border-b">
                      <td className="py-2 px-3 border">{i + 1}</td>
                      <td className="py-2 px-3 border">{convertJenisPakan(d.jenisPakan)}</td>
                      <td className="py-2 px-3 border">{d.kelompokTernak}</td>
                      <td className="py-2 px-3 border">{formatJam(d.jamMulai, d.jamSelesai)}</td>
                      <td className="py-2 px-3 border">{convertPetugas(d.petugas)}</td>

                      <td className="py-2 px-3 border">
                        <Button
                          variant="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                          onClick={() => handleDeleteDetail(i)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* SIMPAN */}
            <div className="flex justify-end mt-6">
              <Button
                variant="bg-farmbrown w-full hover:bg-farmdarkestbrown text-white px-8 py-3 rounded-full"
                onClick={simpan}
              >
                Simpan
              </Button>
            </div>
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default DetailJadwalPakan;
