import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Modal, DatePicker } from "antd";
import { GiWeight } from "react-icons/gi";
import { ImPlus } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import Button from "../atoms/Button";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import hewanTernakDataRaw from "../pseudo_db/hewanternak.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import { hitungUmur } from "../utils/HitungUmur";
import { toast } from "react-toastify";

interface HewanTernak {
  idHewanTernak: string;
  kodeNeckTag: string;
  idJenisHewanTernak: string;
  tanggalLahir: string;
  beratAwal: number;
  catatan?: string;
  tanggalPenimbangan?: string;
}

const RiwayatPenimbangan = () => {
  const [isInputMode, setIsInputMode] = useState(false);
  const [penimbangan, setPenimbangan] = useState<Record<string, { berat: number; kondisi: string }>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [tanggalPenimbangan, setTanggalPenimbangan] = useState<string | null>(null);
  const navigate = useNavigate();
  const hewanTernakData = hewanTernakDataRaw as HewanTernak[];

  const getNamaJenis = (id: string) =>
    jenisHewanTernakData.find((j) => j.idJenisHewanTernak === id)?.namaJenisHewanTernak || "-";

  // 🔍 Filtering
 // Ambil semua riwayat dari localStorage
const riwayat = JSON.parse(localStorage.getItem("riwayatPenimbangan") || "[]");

// Buat map untuk menyimpan riwayat terakhir per hewan
const riwayatTerakhirMap = riwayat.reduce((acc: Record<string, any>, curr: any) => {
  const existing = acc[curr.idHewanTernak];
  // Jika belum ada atau tanggalnya lebih baru, update
  if (
    !existing ||
    new Date(curr.tanggalPenimbangan) > new Date(existing.tanggalPenimbangan)
  ) {
    acc[curr.idHewanTernak] = curr;
  }
  return acc;
}, {});

// Sekarang lakukan filter seperti biasa, tapi "item" akan kita lengkapi data dari riwayat terakhir
const filteredData = hewanTernakData
  .map((item) => {
    const riwayatTerakhir = riwayatTerakhirMap[item.idHewanTernak];
    return {
      ...item,
      beratTerakhir: riwayatTerakhir?.beratBadan ?? item.beratAwal ?? null,
      tanggalPenimbanganTerakhir: riwayatTerakhir?.tanggalPenimbangan ?? item.tanggalPenimbangan ?? null,
      kondisiTerakhir: riwayatTerakhir?.kondisiHewanSaatTimbang ?? "-",
    };
  })
  .filter((item) => {
    const cocokSearch =
      item.kodeNeckTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getNamaJenis(item.idJenisHewanTernak).toLowerCase().includes(searchTerm.toLowerCase());

    const cocokJenis = !filterJenis || item.idJenisHewanTernak === filterJenis;
    let cocokTanggal = true;

    // Gunakan tanggal dari riwayat terakhir bila ada
    const tanggalAktif = item.tanggalPenimbanganTerakhir;

    if (filterMode === "belum") cocokTanggal = !tanggalAktif;
    else if (filterMode === "sudah") cocokTanggal = !!tanggalAktif;
    else if (filterMode === "tanggal" && filterTanggal)
      cocokTanggal = tanggalAktif === filterTanggal;

    return cocokSearch && cocokJenis && cocokTanggal;
  });

  console.log(filteredData);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleChange = (id: string, field: "berat" | "kondisi", value: string | number) => {
    setPenimbangan((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = () => {
    const entries = Object.entries(penimbangan);
    if (entries.length === 0) {
      toast.error(
                    <div>
                      <strong>Mohon maaf !</strong>
                      <div>Isi setidaknya 1 data penimbangan terlebih dahulu!</div>
                    </div>
      );
      return;
    }
    setShowModal(true);
  };

  const handleModalSave = () => {
  if (!tanggalPenimbangan) {
    toast.error(
      <div>
        <strong>Mohon maaf!</strong>
        <div>Harap pilih tanggal penimbangan!</div>
      </div>
    );
    return;
  }

  const entries = Object.entries(penimbangan);
  const existing = JSON.parse(localStorage.getItem("riwayatPenimbangan") || "[]");

  // 🔍 Ambil hanya entri yang beratnya diisi dan valid angka
  const filledEntries = entries.filter(([, data]) => {
    // pastikan ada nilai (tidak undefined/null) dan dapat dikonversi menjadi angka yang valid
    return data.berat !== undefined && data.berat !== null && !Number.isNaN(Number(data.berat));
  });

  // 🚫 Pastikan minimal satu hewan memiliki data berat valid
  if (filledEntries.length === 0) {
    toast.error(
      <div>
        <strong>Belum ada data!</strong>
        <div>Isi minimal satu berat penimbangan sebelum menyimpan.</div>
      </div>
    );
    return;
  }

  // 🔎 Validasi berat badan wajar
  for (const [id, data] of filledEntries) {
    const berat = Number(data.berat);

    if (berat <= 0) {
      toast.error(
        <div>
          <strong>Berat tidak wajar!</strong>
          <div>Berat badan hewan {id} tidak boleh 0 atau negatif.</div>
        </div>
      );
      return;
    }

    if (berat > 2000) {
      toast.error(
        <div>
          <strong>Berat terlalu besar!</strong>
          <div>Berat badan hewan {id} melebihi batas wajar (2000 kg).</div>
        </div>
      );
      return;
    }
  }

  // ✅ Jika semua lolos validasi
  const newEntries = filledEntries.map(([id, data], idx) => ({
    idRiwayatPenimbangan: `RP${String(existing.length + idx + 1).padStart(3, "0")}`,
    idHewanTernak: id,
    beratBadan: Number(data.berat),
    tanggalPenimbangan,
    kondisiHewanSaatTimbang: data.kondisi || "-",
  }));

  localStorage.setItem("riwayatPenimbangan", JSON.stringify([...existing, ...newEntries]));

  toast.success(
    <div>
      <strong>Sukses!</strong>
      <div>Data penimbangan berhasil ditambahkan!</div>
    </div>
  );

  // 🔄 Reset form
  setPenimbangan({});
  setIsInputMode(false);
  setShowModal(false);
  setTanggalPenimbangan(null);
};



  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span onClick={() => navigate("/ternak/repository")} className="text-white/50 hover:text-kemenkeuyellow cursor-pointer">Hewan Ternak • </span> Kesehatan Ternak
          </p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            {/* HEADER */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <GiWeight className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide">
                  Riwayat Penimbangan Hewan
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Catatan penimbangan terakhir dan kondisi kesehatan hewan.
                </p>
              </div>
              {!isInputMode && (
                <div className="ml-auto">
                  <Button
                    onClick={() => setIsInputMode(true)}
                    variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md flex gap-2 justify-center items-center"
                  >
                    <ImPlus /> Tambah Riwayat
                  </Button>
                </div>
              )}
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-farmdarkbrown">Rows per page:</span>
                <select
                  className="border border-farmdarkbrown rounded-md px-2 py-1 text-farmdarkestbrown bg-[#fffaf3]"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setPage(1);
                  }}
                >
                  {[5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="border border-farmdarkbrown rounded-md px-2 py-1 text-farmdarkestbrown bg-[#fffaf3]"
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                >
                  <option value="">Semua Jenis Hewan</option>
                  {jenisHewanTernakData.map((jenis) => (
                    <option key={jenis.idJenisHewanTernak} value={jenis.idJenisHewanTernak}>
                      {jenis.namaJenisHewanTernak}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-farmdarkbrown rounded-md px-2 py-1 text-farmdarkestbrown bg-[#fffaf3]"
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="belum">Belum ditimbang per</option>
                  <option value="sudah">Sudah ditimbang per</option>
                  <option value="tanggal">Ditimbang pada tanggal</option>
                </select>

                {filterMode !== "" && (
                  <DatePicker
                    placeholder="Pilih tanggal"
                    value={filterTanggal ? dayjs(filterTanggal, "YYYY-MM-DD") : null}
                    format="DD-MM-YYYY"
                    onChange={(date) => setFilterTanggal(date ? date.format("YYYY-MM-DD") : "")}
                    className="border border-farmdarkbrown rounded-md text-farmdarkestbrown bg-[#fffaf3] w-[180px]"
                  />
                )}

                <div className="flex items-center border border-farmdarkbrown rounded-md px-3 bg-[#fffaf3] text-farmdarkestbrown">
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
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold">
                  <tr>
                    <th className="p-3 border">Kode NeckTag</th>
                    <th className="p-3 border">Jenis Hewan</th>
                    <th className="p-3 border">Umur</th>
                    <th className="p-3 border">{isInputMode ? "Berat Badan" :"Berat Badan Terakhir"}  (kg)</th>
                    <th className="p-3 border">{isInputMode ? "Kondisi Hewan (opsional)" :"Kondisi Hewan Terakhir"}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((hewan) => (
                    <tr key={hewan.idHewanTernak} className="text-center hover:bg-[#fff8ef]">
                      <td className="p-3 border font-medium">{hewan.kodeNeckTag}</td>
                      <td className="p-3 border">{getNamaJenis(hewan.idJenisHewanTernak)}</td>
                      <td className="p-3 border">{hitungUmur(hewan.tanggalLahir)}</td>
                      <td className="p-3 border">
                        {isInputMode ? (
                          <input
                            type="number"
                            className="border px-2 py-1 rounded-md w-full text-center"
                            step={0.01}
                            value={penimbangan[hewan.idHewanTernak]?.berat ?? ""}
                            onChange={(e) =>
                              handleChange(hewan.idHewanTernak, "berat", parseFloat(e.target.value))
                            }
                          />
                        ) : (
                          `${hewan.beratTerakhir ? hewan.beratTerakhir : hewan.beratAwal} kg`
                        )}
                      </td>
                      <td className="p-3 border">
                        {isInputMode ? (
                          <input
                            type="text"
                            className="border px-2 py-1 rounded-md w-full"
                            placeholder="Kondisi..."
                            value={penimbangan[hewan.idHewanTernak]?.kondisi ?? ""}
                            onChange={(e) =>
                              handleChange(hewan.idHewanTernak, "kondisi", e.target.value)
                            }
                          />
                        ) : (
                          `${hewan.kondisiTerakhir ? hewan.kondisiTerakhir : hewan.catatan}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-farmdarkestbrown">
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded-md border transition ${
                      page === i + 1
                        ? "bg-[#59a025] text-white border-[#59a025]"
                        : "bg-white border-farmdarkbrown text-farmdarkestbrown hover:bg-[#f9f3ea]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            {isInputMode && (
              <div className="flex justify-between gap-4 mt-6 w-full">
                <Button
                  onClick={() => setIsInputMode(false)}
                  variant="bg-gray-300 hover:bg-gray-400 text-farmdarkestbrown py-3 rounded-full w-1/2 font-semibold"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown text-white py-3 rounded-full w-1/2 font-semibold"
                >
                  Simpan Semua
                </Button>
              </div>
            )}
          </div>
        </WhiteSection>
      </MainPanel>

      {/* MODAL INPUT TANGGAL */}
       <Modal
      open={showModal}
      title={<div className="mt-[-10px] mb-4 pb-2 flex justify-center border-b-2"><span className="text-lg font-semibold text-farmdarkestbrown">Simpan Data Penimbangan</span></div>}
      onCancel={() => setShowModal(false)}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4 text-farmdarkestbrown">
        <div>
          <label className="font-semibold">Tanggal Penimbangan</label>
          <DatePicker
            placeholder="dd-mm-yyyy"
            format="DD-MM-YYYY"
            value={tanggalPenimbangan ? dayjs(tanggalPenimbangan, "YYYY-MM-DD") : null}
            onChange={(date) => setTanggalPenimbangan(date ? date.format("YYYY-MM-DD") : null)}
            className="w-full mt-1"
          />
        </div>

        <p className="text-sm text-center text-gray-500 -mt-1">
          Pastikan semua data sudah benar sebelum menyimpan data
        </p>

        <div className="flex justify-center gap-4 mt-2">
          <Button
            type="submit"
            onClick={handleModalSave}
            className="bg-farmdarkbrown hover:bg-farmdarkestbrown w-[150px] text-white px-6 py-1.5 rounded-md"
          >
            Simpan
          </Button>
          <Button onClick={() => setShowModal(false)} className="bg-farmRed hover:bg-farmDarkRed w-[150px] text-white px-6 py-1.5 rounded-md">
            Batal
          </Button>
        </div>
      </div>
    </Modal>
    </section>
  );
};

export default RiwayatPenimbangan;
