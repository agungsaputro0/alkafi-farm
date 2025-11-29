import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";

// pseudo db transaksi
import usersData from "../pseudo_db/users.json";
import { Tooltip } from "antd";
import { FiSearch } from "react-icons/fi";
import { AiTwotoneEdit } from "react-icons/ai";
import { LuUsers } from "react-icons/lu";

interface DataPegawai {
  idPengguna: string;
  email: string;
  namaPengguna: string;
  alamat: string;
  jenisKelamin: string;
  nomorHandphone: string;   
  idRole: number;   
}

const ManajemenPegawai = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // filter search
   const additionalEntry: DataPegawai[] = JSON.parse(localStorage.getItem("usersData") || "[]");
   const combinedEntry = [...usersData, ...additionalEntry];
    const roleMap: Record<number, string> = {
    1: "admin",
    2: "pegawai",
    3: "pekerja",
    };

    const filteredData = combinedEntry.filter((item) => {
    const search = searchTerm.toLowerCase();
    const roleName = roleMap[item.idRole] || "";

    return (
        item.idPengguna.toLowerCase().includes(search) ||
        item.namaPengguna.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        roleName.toLowerCase().includes(search)
    );
    });

  // pagination
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
          <p className="text-white font-semibold">Manajemen Pegawai •</p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">

            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <LuUsers className="text-7xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Manajemen Data Akun Pegawai
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Kelola data akun pegawai Alkafi Farm di Sistem
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => navigate("/tambahPegawai")}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Data Pegawai
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
                  placeholder="Cari nama pegawai..."
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
                    <th className="px-4 py-2 border">ID Pegawai</th>
                    <th className="px-4 py-2 border">Nama Pegawai</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Role</th>
                    <th className="px-4 py-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                {paginatedData.map((t, index) => {
                    return (
                    <tr key={t.idPengguna} className="hover:bg-[#fff6eb]">
                        <td className="px-4 py-2 text-center border">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="px-4 text-center py-2 border">{t.idPengguna}</td>
                        <td className="px-4 text-center py-2 border">{t.namaPengguna}</td>
                        <td className="px-4 text-center py-2 border">{t.email}</td>
                        <td className="px-4 text-center py-2 border">{roleMap[t.idRole]}</td>
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

export default ManajemenPegawai;
