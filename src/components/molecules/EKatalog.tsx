import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { PiBookOpenUserDuotone } from "react-icons/pi";
import { ImPlus } from "react-icons/im";

import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import KatalogCard from "../atoms/KatalogCard";
import ekatalogdata from "../pseudo_db/ekatalog.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";

interface DataKatalog {
  idKatalog: string;              // contoh: "KT011"
  tipe: "hewan" | "produk";       // membedakan katalog hewan vs non-hewan
  idHewanTernak: string | null;   // null jika bukan hewan ternak
  namaProduk: string;             // nama katalog
  foto: string[];                 // list URL gambar
  kategori: string;               // contoh: "Hewan Ternak, Kambing"
  stok: string;                   // tetap string agar match input
  harga: string;                  // string "2500000"
  deskripsi: string;    
}

const EKatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("semua");
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // -----------------------------
  // FILTERING DATA
  // -----------------------------
  const additionalEntry: DataKatalog[] = JSON.parse(localStorage.getItem("KatalogProdukBaru") || "[]");
  const combinedEntry = [...ekatalogdata, ...additionalEntry];
  const filteredData = combinedEntry.filter((item) => {
    const namaMatch = item.namaProduk
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Pecah kategori: "Hewan Ternak, Sapi" → ["hewan ternak", "sapi"]
    const kategoriList = item.kategori
      .split(",")
      .map((k) => k.trim().toLowerCase());

    const filterMatch =
      filterJenis === "semua" ||
      kategoriList.includes(filterJenis.toLowerCase());

    return namaMatch && filterMatch;
  });


  // -----------------------------
  // PAGINATION
  // -----------------------------
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <section
      className="pt-16 flex justify-center mb-20 mx-4"
      style={{ paddingLeft: "80px" }}
    >
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">E-katalog •</p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">

            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <PiBookOpenUserDuotone className="text-7xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  E-Katalog
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Kelola daftar produk dan perbarui informasi katalog.
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => navigate("/tambahKatalog")}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Produk
                </Button>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">

              {/* Rows per page */}
              <div className="flex items-center gap-2 text-farmdarkestbrown">
                <label className="font-semibold">Tampilkan:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border border-farmdarkbrown rounded-md px-2 py-1 bg-[#fffaf3] focus:outline-none"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>

              {/* Filter jenis + search */}
              <div className="flex items-center gap-3">
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="border border-farmdarkbrown rounded-md px-2 py-1 bg-[#fffaf3] text-farmdarkestbrown focus:outline-none"
                >
                  <option value="semua">Semua Kategori</option>
                  <option value="Hewan Ternak">Hewan Ternak</option>
                  {jenisHewanTernakData.map((j) => (
                    <option key={j.idJenisHewanTernak} value={j.namaJenisHewanTernak}>
                      {j.namaJenisHewanTernak}
                    </option>
                  ))}
                    <option value="Produk Turunan">Produk Turunan</option>
                    <option value="Produk Olahan">Produk Olahan</option>
                    <option value="Daging">Daging</option>
                    <option value="Susu">Susu</option>
                </select>

                <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm w-72">
                  <FaSearch className="mr-2 text-[#724e3a]" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    className="focus:outline-none py-1 bg-transparent w-full placeholder-[#bfa48f]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Grid Card */}
            <div className="mb-4 text-farmdarkestbrown text-sm">
              Ditemukan <span className="font-bold">{filteredData.length}</span> produk 
              dari total <span className="font-bold">{combinedEntry.length}</span>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedData.map((item) => (
                <KatalogCard
                  key={item.idKatalog}
                  foto={item.foto[0]}
                  namaProduk={item.namaProduk}
                  kategori={item.kategori}
                  stok={item.stok}
                  harga={item.harga}
                  deskripsi={item.deskripsi}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8 text-farmdarkestbrown">
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

export default EKatalog;
