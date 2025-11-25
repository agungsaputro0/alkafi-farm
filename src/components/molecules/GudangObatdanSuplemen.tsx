import { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import MainPanel from "../atoms/MainPanel";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

import obatdanSuplemenData from "../pseudo_db/obatdansuplemen.json";
import satuanObatdanSuplemen from "../pseudo_db/satuanobatdansuplemen.json";
import jenisObatdanSuplemenData from "../pseudo_db/jenisobatdansuplemen.json";
import { getStatusKadaluwarsa } from "../utils/HitungUmur";
import { FiSearch } from "react-icons/fi";
import { AiTwotoneEdit } from "react-icons/ai";
import { ImPlus } from "react-icons/im";
import { Tooltip } from "antd";
import WhiteSection from "../atoms/WhiteSection";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";

interface ObatdanSuplemen {
  idObatdanSuplemen: string;
  idJenisObatdanSuplemen: string;
  namaProduk: string;
  jumlahStok: string;
  idSatuanObatdanSuplemen: string;
  tanggalKadaluwarsa: string;
  statusKadaluwarsa: string;
}

interface DataObatdanSuplemen {
    idObatdanSuplemen: string;
    namaProduk: string
    idJenisObatdanSuplemen: string
    jumlahStok: string,
    idSatuanObatdanSuplemen: string,
    harga: number,
    tanggalMasuk: string,
    tanggalKadaluwarsa: string,
    supplier: string,
    stokMinimal: string,
    catatan: string,
}

const GudangObatdanSuplemen = () => {
  const [data, setData] = useState<ObatdanSuplemen[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  // 🧩 Load data dari pseudo-DB dan mapping agar sesuai interface
  const additionalEntry: DataObatdanSuplemen[] = JSON.parse(localStorage.getItem("ObatdanSuplemenBaru") || "[]");
  const combinedEntry = [...obatdanSuplemenData, ...additionalEntry];

  useEffect(() => {
    const mappedData = combinedEntry.map((item: any) => ({
      idObatdanSuplemen: item.idObatdanSuplemen,
      idJenisObatdanSuplemen: item.idJenisObatdanSuplemen,
      namaProduk: item.namaProduk,
      jumlahStok: item.jumlahStok,
      idSatuanObatdanSuplemen: item.idSatuanObatdanSuplemen,
      tanggalKadaluwarsa: item.tanggalKadaluwarsa,
      statusKadaluwarsa: getStatusKadaluwarsa(item.tanggalKadaluwarsa),
    }));

    setData(mappedData);
  }, []);

  const getNamaJenis = (id: string) =>
    jenisObatdanSuplemenData.find(
      (r) => r.idJenisObatdanSuplemen === id
    )?.namaJenis || "-";

  const getSatuan = (id: string) =>
    satuanObatdanSuplemen.find(
      (r) => r.idSatuan === id
    )?.namaSatuan || "-";

  // 🔍 Filter pencarian
  const filteredData = data.filter((item) => {
    const jenis = getNamaJenis(item.idJenisObatdanSuplemen).toLowerCase();
    const satuan = getSatuan(item.idSatuanObatdanSuplemen).toLowerCase();
    return (
      jenis.includes(searchTerm.toLowerCase()) ||
      item.namaProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      satuan.includes(searchTerm.toLowerCase()) ||
      getStatusKadaluwarsa(item.tanggalKadaluwarsa).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <section
      className="pt-16 flex justify-center mb-20 mx-4"
      style={{ paddingLeft: "80px" }}
    >
      <MainPanel>
         <div className="px-6">
            <p className="text-white font-semibold">
                  <span className="text-white">Gudang Obat dan Suplemen • </span>
            </p>
        </div>
        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            {/* 🧭 Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <FaSuitcaseMedical className="text-7xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Gudang Obat dan Suplemen
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Daftar seluruh Gudang Obat dan Suplemen yang terdaftar dalam sistem.
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => navigate("/GudangObat/tambahDataObatdanSuplemen")} 
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Stok
                </Button>
              </div>
            </div>

            {/* 🔎 Controls */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsChange}
                  className="px-4 py-2 border border-farmdarkbrown rounded-md text-farmdarkestbrown bg-[#fffaf3]"
                >
                  {[5, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm">
                <FaSearch className="mr-2 text-[#724e3a]" />
                <input
                  type="text"
                  placeholder="Cari Obat atau Suplemen..."
                  className="focus:outline-none py-1 bg-transparent placeholder-[#bfa48f]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* 🐄 Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                  <tr>
                    <th className="p-3 border text-center">No</th>
                    <th className="p-3 border">Nama Obat/ Suplemen</th>
                    <th className="p-3 border">Jumlah Stok</th>
                    <th className="p-3 border text-center">Status Kadaluwarsa</th>
                    <th className="p-3 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) => (
                    <tr
                      key={item.idObatdanSuplemen}
                      className="hover:bg-[#fff8ef] transition-colors duration-150"
                    >
                      <td className="p-3 border text-center font-medium">
                        {startIndex + idx + 1}
                      </td>
                      <td className="p-3 border">{item.namaProduk} - {getNamaJenis(item.idJenisObatdanSuplemen)}</td>
                      <td className="p-3 border">
                        {item.jumlahStok} {getSatuan(item.idSatuanObatdanSuplemen)}
                      </td>
                      <td className="p-3 border text-center">{getStatusKadaluwarsa(item.statusKadaluwarsa)} - Kadaluwarsa pada {formatTanggalIndo(item.tanggalKadaluwarsa, true)}</td>
                      <td className="p-3 border text-center space-x-2">
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📜 Pagination */}
            <div className="flex justify-between items-center mt-6 text-farmdarkestbrown">
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

export default GudangObatdanSuplemen;
