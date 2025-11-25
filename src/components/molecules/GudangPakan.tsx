import { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { AiTwotoneEdit } from "react-icons/ai";
import { ImPlus } from "react-icons/im";
import { Tooltip } from "antd";
import { MdGrass } from "react-icons/md";
import { FaCow } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import MainPanel from "../atoms/MainPanel";
import Button from "../atoms/Button";
import WhiteSection from "../atoms/WhiteSection";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";

import pakanData from "../pseudo_db/pakan.json";
import pemakaianData from "../pseudo_db/pemakaianpakan.json";
import jenisPakanData from "../pseudo_db/jenispakan.json";
import satuanPakanData from "../pseudo_db/satuanpakan.json";

interface Pakan {
  idPakan: string;
  idJenisPakan: string;
  sumberPakan: string;
  jumlahMasuk: number;
  satuan: string;
  tanggalMasuk: string;
}

interface DataPakan {
  idPakan: string;
  idJenisPakan: string;
  sumberPakan: string;
  jumlahMasuk: number;
  satuan: string;
  supplier: string;
  harga: number;
  tanggalMasuk: string;
  catatan: string;
}

const GudangPakan = () => {
  const [activeTab, setActiveTab] = useState<"perolehan" | "pemakaian">("perolehan");
  const navigate = useNavigate();

  // 🧩 Data gabungan
  const additionalEntry: DataPakan[] = JSON.parse(localStorage.getItem("PerolehanPakanBaru") || "[]");
  const combinedEntry = [...pakanData, ...additionalEntry];

  const [data, setData] = useState<Pakan[]>([]);

  // 🎯 Perolehan states
  const [searchPerolehan, setSearchPerolehan] = useState("");
  const [rowsPerPagePerolehan, setRowsPerPagePerolehan] = useState(10);
  const [currentPagePerolehan, setCurrentPagePerolehan] = useState(1);

  // 🎯 Pemakaian states
  const [searchPemakaian, setSearchPemakaian] = useState("");
  const [rowsPerPagePemakaian, setRowsPerPagePemakaian] = useState(10);
  const [currentPagePemakaian, setCurrentPagePemakaian] = useState(1);

  // 🧠 Load data awal
  useEffect(() => {
    const mappedData = combinedEntry.map((item: any) => ({
      idPakan: item.idPakan,
      idJenisPakan: item.idJenisPakan,
      sumberPakan: item.sumberPakan,
      jumlahMasuk: item.jumlahMasuk,
      satuan: item.satuan,
      tanggalMasuk: item.tanggalMasuk,
    }));
    setData(mappedData);
  }, []);

  const getNamaJenis = (id: string) =>
    jenisPakanData.find((r) => r.idJenisPakan === id)?.namaJenisPakan || "-";

  const getNamaSatuan = (id: string) =>
    satuanPakanData.find((r) => r.idSatuan === id)?.namaSatuan || "-";

  // 🔍 Filter dan pagination perolehan
  const filteredPerolehan = data.filter((item) => {
    const jenis = getNamaJenis(item.idJenisPakan).toLowerCase();
    const satuan = getNamaSatuan(item.satuan).toLowerCase();
    return (
      jenis.includes(searchPerolehan.toLowerCase()) ||
      item.sumberPakan.toLowerCase().includes(searchPerolehan.toLowerCase()) ||
      satuan.includes(searchPerolehan.toLowerCase()) ||
      formatTanggalIndo(item.tanggalMasuk, true).toLowerCase().includes(searchPerolehan.toLowerCase())
    );
  });
  const totalPagesPerolehan = Math.ceil(filteredPerolehan.length / rowsPerPagePerolehan);
  const startIndexPerolehan = (currentPagePerolehan - 1) * rowsPerPagePerolehan;
  const paginatedPerolehan = filteredPerolehan.slice(startIndexPerolehan, startIndexPerolehan + rowsPerPagePerolehan);

  // 🔍 Filter dan pagination pemakaian
  const filteredPemakaian = pemakaianData.filter((item) => {
    const jenis = getNamaJenis(item.idJenisPakan).toLowerCase();
    return (
      jenis.includes(searchPemakaian.toLowerCase()) ||
      item.catatan.toLowerCase().includes(searchPemakaian.toLowerCase()) ||
      formatTanggalIndo(item.tanggal, true).toLowerCase().includes(searchPemakaian.toLowerCase())
    );
  });
  const totalPagesPemakaian = Math.ceil(filteredPemakaian.length / rowsPerPagePemakaian);
  const startIndexPemakaian = (currentPagePemakaian - 1) * rowsPerPagePemakaian;
  const paginatedPemakaian = filteredPemakaian.slice(startIndexPemakaian, startIndexPemakaian + rowsPerPagePemakaian);

  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span className="text-white">Stok Pakan • </span>
          </p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            {/* 🧭 Tab Navigation */}
            <div className="flex justify-start mb-6 relative">
              <div className="flex border-b border-gray-300 relative">
                {["perolehan", "pemakaian"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as "perolehan" | "pemakaian")}
                    className={`pb-2 px-4 text-lg font-semibold transition-colors ${
                      activeTab === tab
                        ? "text-farmdarkestbrown"
                        : "text-gray-400 hover:text-farmdarkbrown"
                    }`}
                  >
                    {tab === "perolehan" ? "Perolehan" : "Pemakaian"}
                  </button>
                ))}
                <div
                  className={`absolute bottom-0 h-[3px] bg-farmdarkestbrown transition-all duration-300 rounded-full ${
                    activeTab === "perolehan"
                      ? "left-0 w-[110px]"
                      : "left-[110px] w-[125px]"
                  }`}
                ></div>
              </div>
            </div>

            {/* 📦 PEROLEHAN */}
            {activeTab === "perolehan" ? (
              <>
                <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
                  <MdGrass className="text-7xl text-farmdarkestbrown" />
                  <div>
                    <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                      Perolehan Stok Pakan
                    </h2>
                    <p className="text-sm text-[#724e3a]">
                      Daftar seluruh Perolehan Pakan Hewan Ternak yang terdaftar dalam sistem.
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      onClick={() => navigate("/StokPakan/tambahPerolehanPakan")}
                      variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                    >
                      <ImPlus /> Tambah Perolehan
                    </Button>
                  </div>
                </div>

                {/* 🔎 Controls */}
                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                  <select
                    value={rowsPerPagePerolehan}
                    onChange={(e) => {
                      setRowsPerPagePerolehan(Number(e.target.value));
                      setCurrentPagePerolehan(1);
                    }}
                    className="px-4 py-2 border border-farmdarkbrown rounded-md text-farmdarkestbrown bg-[#fffaf3]"
                  >
                    {[5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm">
                    <FaSearch className="mr-2 text-[#724e3a]" />
                    <input
                      type="text"
                      placeholder="Cari Pakan..."
                      className="focus:outline-none py-1 bg-transparent placeholder-[#bfa48f]"
                      value={searchPerolehan}
                      onChange={(e) => setSearchPerolehan(e.target.value)}
                    />
                  </div>
                </div>

                {/* 📋 Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                    <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                      <tr>
                        <th className="p-3 border text-center">No</th>
                        <th className="p-3 border">Jenis Pakan</th>
                        <th className="p-3 border">Jumlah Masuk</th>
                        <th className="p-3 border text-center">Satuan</th>
                        <th className="p-3 border text-center">Tanggal Masuk</th>
                        <th className="p-3 border text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPerolehan.map((item, idx) => (
                        <tr key={item.idPakan} className="hover:bg-[#fff8ef] transition-colors duration-150">
                          <td className="p-3 border text-center font-medium">{startIndexPerolehan + idx + 1}</td>
                          <td className="p-3 border">{getNamaJenis(item.idJenisPakan)}</td>
                          <td className="p-3 border">{item.jumlahMasuk}</td>
                          <td className="p-3 border text-center">{getNamaSatuan(item.satuan)}</td>
                          <td className="p-3 border text-center">{formatTanggalIndo(item.tanggalMasuk, true)}</td>
                          <td className="p-3 border text-center space-x-2">
                            <Tooltip title="Lihat Detail">
                              <button className="bg-kemenkeublue hover:bg-kemenkeublue/80 text-white p-2 rounded-md transition"><FiSearch /></button>
                            </Tooltip>
                            <Tooltip title="Edit Data">
                              <button className="bg-farmgreen hover:bg-farmgreen/80 text-white p-2 rounded-md transition"><AiTwotoneEdit /></button>
                            </Tooltip>
                            <Tooltip title="Hapus Data">
                              <button className="bg-red-600 hover:bg-red-600/80 text-white p-2 rounded-md transition"><FaTrash /></button>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 📜 Pagination */}
                <div className="flex justify-between items-center mt-6 text-farmdarkestbrown">
                  <span>Halaman {currentPagePerolehan} dari {totalPagesPerolehan}</span>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPagesPerolehan }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPagePerolehan(i + 1)}
                        className={`px-3 py-1 rounded-md border transition ${
                          currentPagePerolehan === i + 1
                            ? "bg-[#59a025] text-white border-[#59a025]"
                            : "bg-white border-farmdarkbrown text-farmdarkestbrown hover:bg-[#f9f3ea]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 🐄 PEMAKAIAN */}
                <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
                  <FaCow className="text-7xl text-farmdarkestbrown" />
                  <div>
                    <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                      Riwayat Pemakaian Pakan
                    </h2>
                    <p className="text-sm text-[#724e3a]">
                      Daftar seluruh Pemakaian Pakan Hewan Ternak yang terdaftar dalam sistem.
                    </p>
                  </div>
                </div>

                {/* 🔍 Controls */}
                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                  <select
                    value={rowsPerPagePemakaian}
                    onChange={(e) => {
                      setRowsPerPagePemakaian(Number(e.target.value));
                      setCurrentPagePemakaian(1);
                    }}
                    className="px-4 py-2 border border-farmdarkbrown rounded-md text-farmdarkestbrown bg-[#fffaf3]"
                  >
                    {[5, 10, 15, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm">
                    <FaSearch className="mr-2 text-[#724e3a]" />
                    <input
                      type="text"
                      placeholder="Cari Pemakaian..."
                      className="focus:outline-none py-1 bg-transparent placeholder-[#bfa48f]"
                      value={searchPemakaian}
                      onChange={(e) => setSearchPemakaian(e.target.value)}
                    />
                  </div>
                </div>

                {/* 📊 Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                    <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                      <tr>
                        <th className="p-3 border text-center">No</th>
                        <th className="p-3 border">Jenis Pakan</th>
                        <th className="p-3 border text-center">Tanggal</th>
                        <th className="p-3 border text-center">Jam Pemberian</th>
                        <th className="p-3 border text-center">Volume Realisasi</th>
                        <th className="p-3 border">Catatan</th>
                        <th className="p-3 border text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPemakaian.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#fff8ef] transition-colors duration-150">
                          <td className="p-3 border text-center font-medium">{startIndexPemakaian + idx + 1}</td>
                          <td className="p-3 border">{getNamaJenis(item.idJenisPakan)}</td>
                          <td className="p-3 border text-center">{formatTanggalIndo(item.tanggal, true)}</td>
                          <td className="p-3 border text-center">{item.jamMulai} - {item.jamSelesai}</td>
                          <td className="p-3 border text-center">{item.volumeRealisasi}</td>
                          <td className="p-3 border">{item.catatan}</td>
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

                {/* 📜 Pagination */}
                <div className="flex justify-between items-center mt-6 text-farmdarkestbrown">
                  <span>Halaman {currentPagePemakaian} dari {totalPagesPemakaian}</span>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPagesPemakaian }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPagePemakaian(i + 1)}
                        className={`px-3 py-1 rounded-md border transition ${
                          currentPagePemakaian === i + 1
                            ? "bg-[#59a025] text-white border-[#59a025]"
                            : "bg-white border-farmdarkbrown text-farmdarkestbrown hover:bg-[#f9f3ea]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default GudangPakan;
