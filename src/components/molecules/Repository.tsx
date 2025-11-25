import { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import MainPanel from "../atoms/MainPanel";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

import hewanTernakData from "../pseudo_db/hewanternak.json";
import statusHewan from "../pseudo_db/status.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import { GiGoat } from "react-icons/gi";
import { hitungUmur } from "../utils/HitungUmur";
import { FiSearch } from "react-icons/fi";
import { AiTwotoneEdit } from "react-icons/ai";
import { ImPlus } from "react-icons/im";
import { Tooltip } from "antd";
import WhiteSection from "../atoms/WhiteSection";

interface HewanTernak {
  idHewanTernak: string;
  kodeNeckTag: string;
  idJenisHewanTernak: string;
  idRasHewanTernak: string;
  umur: string;
  statusKesehatan: string;
}

interface DataHewanTernak {
  idHewanTernak: string,
  kodeNeckTag: string,
  idJenisHewanTernak: string,
  idRasHewanTernak: string,
  beratAwal: number,
  tanggalLahir: string,
  jenisKelamin: string,
  asalTernak: string,
  statusHewan: string,
  catatan: string,
}

const Repository = () => {
  const [data, setData] = useState<HewanTernak[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const additionalEntry: DataHewanTernak[] = JSON.parse(localStorage.getItem("HewanTernakBaru") || "[]");
  const combinedEntry = [...hewanTernakData, ...additionalEntry];
  // 🧩 Load data dari pseudo-DB dan mapping agar sesuai interface
  useEffect(() => {
    const mappedData = combinedEntry.map((item: any) => ({
      idHewanTernak: item.idHewanTernak,
      kodeNeckTag: item.kodeNeckTag,
      idJenisHewanTernak: item.idJenisHewanTernak,
      idRasHewanTernak: item.idRasHewanTernak,
      umur: hitungUmur(item.tanggalLahir),
      statusKesehatan: item.statusHewan || "Tidak Diketahui",
    }));

    setData(mappedData);
  }, []);

  // 🔍 Helper untuk tampilkan jenis & ras
  const getNamaJenis = (id: string) =>
    jenisHewanTernakData.find(
      (j) => j.idJenisHewanTernak === id
    )?.namaJenisHewanTernak || "-";

  const getNamaRas = (id: string) =>
    rasHewanTernakData.find(
      (r) => r.idRasHewanTernak === id
    )?.namaRasHewanTernak || "-";

   const getStatus = (id: string) =>
    statusHewan.find(
      (r) => r.idStatus === id
    )?.namaStatus || "-";

  // 🔍 Filter pencarian
  const filteredData = data.filter((item) => {
    const jenis = getNamaJenis(item.idJenisHewanTernak).toLowerCase();
    const ras = getNamaRas(item.idRasHewanTernak).toLowerCase();
    const status = getStatus(item.statusKesehatan).toLowerCase();
    return (
      item.kodeNeckTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jenis.includes(searchTerm.toLowerCase()) ||
      ras.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase())
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
                  <span className="text-white/50">Hewan Ternak • </span> Repositori Hewan Ternak
            </p>
        </div>
        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            {/* 🧭 Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <GiGoat className="text-7xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Repositori Hewan Ternak
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Daftar seluruh hewan ternak yang terdaftar dalam sistem.
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => navigate("/ternak/tambahHewan")} 
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Hewan
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
                  placeholder="Cari hewan..."
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
                    <th className="p-3 border">Kode Neck Tag</th>
                    <th className="p-3 border">Jenis & Ras</th>
                    <th className="p-3 border text-center">Umur (th)</th>
                    <th className="p-3 border text-center">Status</th>
                    <th className="p-3 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) => (
                    <tr
                      key={item.idHewanTernak}
                      className="hover:bg-[#fff8ef] transition-colors duration-150"
                    >
                      <td className="p-3 border text-center font-medium">
                        {startIndex + idx + 1}
                      </td>
                      <td className="p-3 border">{item.kodeNeckTag}</td>
                      <td className="p-3 border">
                        {getNamaJenis(item.idJenisHewanTernak)}  {getNamaRas(item.idRasHewanTernak)}
                      </td>
                      <td className="p-3 border text-center">{item.umur}</td>
                      <td className="p-3 border text-center">{getStatus(item.statusKesehatan)}</td>
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

export default Repository;
