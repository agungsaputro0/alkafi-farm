import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import { FaSearch } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Tooltip } from "antd";
import { ImPlus } from "react-icons/im";

import { decryptData } from "../utils/Encryptor";
import riwayatkesehatanData from "../pseudo_db/riwayatkesehatanhewan.json";
import hewanTernakData from "../pseudo_db/hewanternak.json";
import usersData from "../pseudo_db/users.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";
import { TbHealthRecognition } from "react-icons/tb";

interface RiwayatKesehatan {
  idRiwayatKesehatanTernak: string;
  idHewanTernak: string;
  tanggalPemeriksaan: string;
  diagnosa: string;
  tindakan: string;
  perekam: string;
}

const RiwayatKesehatanHewan = () => {
  const { neckTag } = useParams<{ neckTag: string }>();
  const [riwayat, setRiwayat] = useState<RiwayatKesehatan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [hewan, setHewan] = useState<typeof hewanTernakData[0] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!neckTag) return;
    const decryptedNeckTag = decryptData(neckTag);

    const hewanItem = hewanTernakData.find(
      (h) => h.kodeNeckTag === decryptedNeckTag
    );
    if (!hewanItem) return setHewan(null);
    setHewan(hewanItem);

    const localRiwayat = JSON.parse(localStorage.getItem("RiwayatKesehatanBaru") || "[]");
    const combinedRiwayat = [
      ...riwayatkesehatanData.filter((r) => r.idHewanTernak === hewanItem.idHewanTernak),
      ...localRiwayat.filter((r: any) => r.idHewanTernak === hewanItem.idHewanTernak),
    ].sort(
      (a, b) => new Date(b.tanggalPemeriksaan).getTime() - new Date(a.tanggalPemeriksaan).getTime()
    );
    setRiwayat(combinedRiwayat);
  }, [neckTag]);

  const getNamaPetugas = (id: string) => usersData.find((u) => u.idPengguna === id)?.namaPengguna || id;
  const getNamaJenis = (id: string) => jenisHewanTernakData.find(j => j.idJenisHewanTernak === id)?.namaJenisHewanTernak || "-";
  const getNamaRas = (id: string) => rasHewanTernakData.find(r => r.idRasHewanTernak === id)?.namaRasHewanTernak || "-";

  if (!hewan) return <div className="text-center p-8">Data hewan tidak ditemukan</div>;

  // Filter pencarian
  const filteredData = riwayat.filter(r =>
    r.diagnosa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tindakan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getNamaPetugas(r.perekam).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/repository")}>Hewan Ternak • </span>
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/kesehatan")}>Kesehatan Ternak • </span>
            Riwayat Kesehatan
          </p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <TbHealthRecognition className="text-7xl text-farmdarkestbrown" />
              <div>
                 <p className="text-sm text-[#724e3a] font-bold text-xls">Riwayat Kesehatan</p>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  {getNamaJenis(hewan.idJenisHewanTernak)} {getNamaRas(hewan.idRasHewanTernak)} {hewan.kodeNeckTag}
                </h2>
                <p className="text-sm text-[#724e3a]">Daftar seluruh riwayat hewan ternak yang terdaftar dalam sistem.</p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => navigate(`/ternak/kesehatan/tambahriwayatkesehatan/${neckTag}`)}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Riwayat
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsChange}
                  className="px-4 py-2 border border-farmdarkbrown rounded-md text-farmdarkestbrown bg-[#fffaf3]"
                >
                  {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm">
                <FaSearch className="mr-2 text-[#724e3a]" />
                <input
                  type="text"
                  placeholder="Cari riwayat..."
                  className="focus:outline-none py-1 bg-transparent placeholder-[#bfa48f]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                  <tr>
                    <th className="p-3 border text-center">No</th>
                    <th className="p-3 border">Tanggal Pemeriksaan</th>
                    <th className="p-3 border">Diagnosa</th>
                    <th className="p-3 border">Tindakan</th>
                    <th className="p-3 border">Petugas</th>
                    <th className="p-3 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="border-white">
                  {paginatedData.length === 0 && (
                    <tr className="border-white">
                      <td  colSpan={6} className="text-center p-4 border-white">Belum ada riwayat</td>
                    </tr>
                  )}
                  {paginatedData.map((r, idx) => (
                    <tr key={r.idRiwayatKesehatanTernak} className="hover:bg-[#fff8ef] transition-colors duration-150">
                      <td className="p-3 border text-center">{startIndex + idx + 1}</td>
                      <td className="p-3 border text-center">{formatTanggalIndo(r.tanggalPemeriksaan)}</td>
                      <td className="p-3 border">{r.diagnosa}</td>
                      <td className="p-3 border">{r.tindakan}</td>
                      <td className="p-3 border text-center">{getNamaPetugas(r.perekam)}</td>
                      <td className="p-3 border text-center space-x-2">
                        <Tooltip title="Lihat Detail">
                          <button className="bg-kemenkeublue hover:bg-kemenkeublue/80 text-white p-2 rounded-md transition">
                            <FiSearch />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-farmdarkestbrown">
              <span>Halaman {currentPage} dari {totalPages}</span>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md border transition ${
                      currentPage === i + 1
                        ? "bg-[#59a025] text-white border-[#59a025]"
                        : "bg-white border-farmdarkbrown text-farmdarkestbrown hover:bg-[#f9f3ea]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default RiwayatKesehatanHewan;
