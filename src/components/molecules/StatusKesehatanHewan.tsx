import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { TbHealthRecognition  } from "react-icons/tb";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import HealthStatusCard from "../atoms/HealthStatusCard";
import riwayatkesehatanData from "../pseudo_db/riwayatkesehatanhewan.json";
import hewanTernakData from "../pseudo_db/hewanternak.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import statusHewan from "../pseudo_db/status.json";
import fotoHewanTernakData from "../pseudo_db/fotohewanternak.json";
import { hitungUmur } from "../utils/HitungUmur";

interface DataHewan {
  idHewanTernak: string;
  kodeNeckTag: string;
  idJenisHewanTernak: string;
  idRasHewanTernak: string;
  tanggalLahir: string;
  jenisKelamin: string;
  statusHewan: string;
  asalTernak: string | null;
  catatan: string | null;
  fotoUrl?: string;
}

interface StatusHewanLocal {
  idHewanTernak: string;
  statusKesehatan: string;
  diagnosisTerakhir?: string;
  tanggalPemeriksaanTerakhir?: string;
}

const StatusKesehatanHewan = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("semua");
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<DataHewan[]>([]);
  const navigate = useNavigate();
  const localStatus: StatusHewanLocal[] = JSON.parse(
    localStorage.getItem("statusKesehatanHewanBaru") || "[]"
  );

  useEffect(() => {
    const merged = hewanTernakData.map((item) => {
      const foto = fotoHewanTernakData.find(
        (f) => f.idHewanTernak === item.idHewanTernak && f.thumbnail
      );
      return { ...item, fotoUrl: foto ? foto.fotoUrl : "/images/no-image.jpg" };
    });
    setData(merged);
  }, []);

  const getNamaJenis = (id: string) =>
    jenisHewanTernakData.find((j) => j.idJenisHewanTernak === id)
      ?.namaJenisHewanTernak || "-";

  const getNamaRas = (id: string) =>
    rasHewanTernakData.find((r) => r.idRasHewanTernak === id)
      ?.namaRasHewanTernak || "-";

  const getStatus = (id: string) =>
    statusHewan.find((r) => r.idStatus === id)?.namaStatus || "-";

 
  // Gabungkan status lokal + riwayat kesehatan terakhir
  const mergedData = data.map((item) => {
    const local = localStatus.find((s) => s.idHewanTernak === item.idHewanTernak);

    // Ambil riwayat kesehatan terakhir
    const riwayatHewan = riwayatkesehatanData
      .filter((r) => r.idHewanTernak === item.idHewanTernak)
      .sort((a, b) => new Date(b.tanggalPemeriksaan).getTime() - new Date(a.tanggalPemeriksaan).getTime());
    const terakhir = riwayatHewan[0];

    return {
      ...item,
      statusKesehatan: local ? local.statusKesehatan : item.statusHewan,
      diagnosisTerakhir: local?.diagnosisTerakhir || terakhir?.diagnosa || "-",
      tanggalPemeriksaanTerakhir: local?.tanggalPemeriksaanTerakhir || terakhir?.tanggalPemeriksaan || "-",
    };
  });


  // Filter pencarian + jenis
  const filteredData = mergedData.filter((item) => {
    const jenis = getNamaJenis(item.idJenisHewanTernak).toLowerCase();
    const ras = getNamaRas(item.idRasHewanTernak).toLowerCase();
    const status = getStatus(item.statusKesehatan).toLowerCase();

    const cocokSearch =
      item.kodeNeckTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jenis.includes(searchTerm.toLowerCase()) ||
      ras.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase());

    const cocokJenis =
      filterJenis === "semua" ||
      item.idJenisHewanTernak === filterJenis;

    return cocokSearch && cocokJenis;
  });

  // Pagination
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
          <p className="text-white font-semibold">
            <span onClick={() => navigate("/ternak/repository")} className="text-white/50 hover:text-kemenkeuyellow cursor-pointer">Hewan Ternak • </span> Kesehatan Ternak
          </p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <TbHealthRecognition className="text-7xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Kesehatan Hewan Ternak
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Pantau kondisi dan riwayat pemeriksaan kesehatan setiap ternak.
                </p>
              </div>
            </div>

            {/* Kontrol Filter & Search */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              {/* Jumlah card ditampilkan */}
              <div className="flex items-center gap-2 text-farmdarkestbrown">
                <label htmlFor="rowsPerPage" className="font-semibold">
                  Tampilkan:
                </label>
                <select
                  id="rowsPerPage"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border border-farmdarkbrown rounded-md px-2 py-1 bg-[#fffaf3] focus:outline-none"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>

              

              {/* Search box */}
              <div className="flex items-center gap-3">
                 {/* Filter jenis hewan */}
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="border border-farmdarkbrown rounded-md px-2 py-1 bg-[#fffaf3] text-farmdarkestbrown focus:outline-none"
                >
                  <option value="semua">Semua Jenis</option>
                  {jenisHewanTernakData.map((j) => (
                    <option key={j.idJenisHewanTernak} value={j.idJenisHewanTernak}>
                      {j.namaJenisHewanTernak}
                    </option>
                  ))}
                </select>
                <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown shadow-sm w-72">
                  <FaSearch className="mr-2 text-[#724e3a]" />
                  <input
                    type="text"
                    placeholder="Cari hewan..."
                    className="focus:outline-none py-1 bg-transparent w-full placeholder-[#bfa48f]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Grid Card */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedData.map((item) => (
                <HealthStatusCard
                  key={item.idHewanTernak}
                  fotoUrl={item.fotoUrl}
                  kodeNeckTag={item.kodeNeckTag}
                  jenisTernak={getNamaJenis(item.idJenisHewanTernak)}
                  rasHewan={getNamaRas(item.idRasHewanTernak)}
                  jenisKelamin={item.jenisKelamin}
                  usia={hitungUmur(item.tanggalLahir)}
                  statusKesehatan={getStatus(item.statusKesehatan)}
                  pemeriksaanTerakhir={item.tanggalPemeriksaanTerakhir}
                  diagnosisTerakhir={item.diagnosisTerakhir}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-8 text-farmdarkestbrown">
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

export default StatusKesehatanHewan;
