import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";

import kandangData from "../pseudo_db/kandang.json";
import jadwalData from "../pseudo_db/jadwalKandang.json";
import usersData from "../pseudo_db/users.json";

import { Tooltip } from "antd";
import { FiSearch } from "react-icons/fi";
import { AiTwotoneEdit } from "react-icons/ai";
import { GiBroom } from "react-icons/gi";
import { PiBarnDuotone } from "react-icons/pi";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";

interface Kandang {
  idKandang: string;
  namaKandang: string;
  luas: number;
  kapasitas: number;
  peruntukan: string;
  lokasi: string;
  status: string;
  kondisi: string;
}

interface JadwalKandang {
  idKandang: string;
  tanggal: string;
  waktu: string;
  frekuensi: string;
  jenisPembersihan: string;
  peralatanDanBahan: string | null;
  catatan: string | null;
  petugas: string[];
}

interface DataPegawai {
  idPengguna: string;
  email: string;
  namaPengguna: string;
  alamat: string;
  jenisKelamin: string;
  idRole: number;
}

const JadwalPembersihanKandang = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Map: ID Kandang → Nama Kandang
  const kandangMap = Object.fromEntries(
    (kandangData as Kandang[]).map((k) => [k.idKandang, k.namaKandang])
  );

  // Map: ID Petugas → Nama Petugas
  const usersMap = Object.fromEntries(
    (usersData as DataPegawai[]).map((u) => [u.idPengguna, u.namaPengguna])
  );

  const additionalEntry: JadwalKandang[] = JSON.parse(localStorage.getItem("JadwalPembersihanKandang") || "[]");
  const combinedEntry = [...jadwalData, ...additionalEntry];

  // Filter jadwal berdasarkan search
  const filteredData = (combinedEntry as JadwalKandang[]).filter((item) => {
    const s = searchTerm.toLowerCase();

    const kandangName = kandangMap[item.idKandang]?.toLowerCase() || "";
    const petugasNames = item.petugas
      .map((p) => usersMap[p] || p)
      .join(", ")
      .toLowerCase();

    return (
      item.tanggal.toLowerCase().includes(s) ||
      item.waktu.toLowerCase().includes(s) ||
      kandangName.includes(s) ||
      (item.catatan || "").toLowerCase().includes(s) ||
      petugasNames.includes(s)
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <section
      className="pt-16 flex justify-center mb-20 mx-4"
      style={{ paddingLeft: "80px" }}
    >
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">Jadwal Tugas • Bersih Kandang</p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">

            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <GiBroom className="text-7xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Jadwal Pembersihan Kandang
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Data seluruh jadwal pembersihan kandang yang terdaftar
                </p>
              </div>
              <div className="ml-auto space-y-2">
                <Button
                  onClick={() => navigate("/tambahJadwalKandang")}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Jadwal
                </Button>

                <Button
                  onClick={() => navigate("/kandang")}
                  variant="border border-2 border-farmbrown bg-transparent hover:bg-farmdarkestbrown min-w-[180px] text-farmdarkestbrown hover:text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <PiBarnDuotone className="text-xl" /> Kandang
                </Button>
              </div>
            </div>

            {/* Search & Rows */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <div className="flex items-center gap-2 text-farmdarkestbrown">
                <label className="font-semibold">Tampilkan:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border border-farmdarkbrown rounded-md px-2 py-1 bg-[#fffaf3] focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>

              <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm w-72">
                <FaSearch className="mr-2 text-[#724e3a]" />
                <input
                  type="text"
                  placeholder="Cari jadwal..."
                  className="focus:outline-none py-1 bg-transparent w-full placeholder-[#bfa48f]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                  <tr>
                    <th className="px-4 py-2 border">No</th>
                    <th className="px-4 py-2 border">Tanggal / Waktu</th>
                    <th className="px-4 py-2 border">Kandang</th>
                    <th className="px-4 py-2 border">Catatan</th>
                    <th className="px-4 py-2 border">Petugas</th>
                    <th className="px-4 py-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const petugasNames = item.petugas
                      .map((id) => usersMap[id] || id)
                      .join(", ");

                    return (
                      <tr key={`${item.idKandang}-${item.tanggal}-${item.waktu}`} className="hover:bg-[#fff6eb]">
                        <td className="px-4 py-2 text-center border">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>

                        <td className="px-4 text-center py-2 border">
                          {formatTanggalIndo(item.tanggal, true)} <br />
                          <span className="text-gray-600">{item.waktu}</span>
                        </td>

                        <td className="px-4 text-center py-2 border">
                          {kandangMap[item.idKandang] || item.idKandang}
                        </td>

                        <td className="px-4 text-center py-2 border">
                          {item.catatan || "-"}
                        </td>

                        <td className="px-4 text-center py-2 border">
                          {petugasNames}
                        </td>

                        <td className="px-4 text-center py-2 border space-x-2">
                          <Tooltip title="Lihat Detail">
                            <button className="bg-kemenkeublue hover:bg-kemenkeublue/80 text-white p-2 rounded-md transition">
                              <FiSearch />
                            </button>
                          </Tooltip>

                          <Tooltip title="Edit Data">
                            <button className="bg-farmgreen hover:bg-farmgreen/80 text-white p-2 rounded-md transition">
                              <AiTwotoneEdit />
                            </button>
                          </Tooltip>

                          <Tooltip title="Hapus Data">
                            <button className="bg-red-600 hover:bg-red-600/80 text-white p-2 rounded-md transition">
                              <FaTrash />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-farmdarkestbrown">
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>

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

export default JadwalPembersihanKandang;
