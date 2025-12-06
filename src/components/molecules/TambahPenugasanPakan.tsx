import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiTask } from "react-icons/bi";
import { LuCalendarClock } from "react-icons/lu";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import InputElement from "../atoms/InputElement";
import dayjs from "dayjs";
import usersData from "../pseudo_db/users.json";
import jenisPakanData from "../pseudo_db/jenispakan.json";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";

const kelompokTernakOptions = [
  { value: "Sapi Dewasa", label: "Sapi Dewasa" },
  { value: "Sapi Remaja", label: "Sapi Remaja" },
  { value: "Sapi Anak", label: "Sapi Anak" },
  { value: "Sapi Hamil", label: "Sapi Hamil" },
  { value: "Sapi Menyusui", label: "Sapi Menyusui" },
  { value: "Sapi Sakit", label: "Sapi Sakit" },
  { value: "Sapi Inbreeding", label: "Sapi Inbreeding" },
  { value: "Sapi Karantina", label: "Sapi Karantina" },

  { value: "Kambing Dewasa", label: "Kambing Dewasa" },
  { value: "Kambing Remaja", label: "Kambing Remaja" },
  { value: "Kambing Anak", label: "Kambing Anak" },
  { value: "Kambing Hamil", label: "Kambing Hamil" },
  { value: "Kambing Menyusui", label: "Kambing Menyusui" },
  { value: "Kambing Sakit", label: "Kambing Sakit" },
  { value: "Kambing Karantina", label: "Kambing Karantina" },

  { value: "Domba Dewasa", label: "Domba Dewasa" },
  { value: "Domba Remaja", label: "Domba Remaja" },
  { value: "Domba Anak", label: "Domba Anak" },
  { value: "Domba Sakit", label: "Domba Sakit" },
  { value: "Domba Hamil", label: "Domba Hamil" },
  { value: "Domba Karantina", label: "Domba Karantina" },
];

const TambahPenugasanPakan = () => {
  const { idJadwal } = useParams();
  const navigate = useNavigate();

  const [dataJadwal, setDataJadwal] = useState<any>(null);

  const [formDetail, setFormDetail] = useState({
    idJenisPakan: "",
    targetPemberian: "",
    kelompokTernak: "",
    jamMulai: "",
    jamSelesai: "",
    catatan: "",
    petugas: [] as string[],
  });

  const petugasList = usersData.filter((u) => u.idRole === 3);

  const jenisPakanOptions = [
    { value: "", label: "Pilih Jenis Pakan" },
    ...jenisPakanData.map((j) => ({
      value: j.idJenisPakan,
      label: j.namaJenisPakan,
    })),
  ];

  // AMBIL DATA JADWAL
  useEffect(() => {
    if (!idJadwal) return;

    const stored = JSON.parse(localStorage.getItem("JadwalPakan") || "[]");
    const jadwal = stored.find((j: any) => j.idJadwal === idJadwal);

    if (jadwal) {
      setDataJadwal(jadwal);
    }
  }, [idJadwal]);

  // HANDLER
  const handleChange = (name: string, value: any) => {
    setFormDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleJenisPakanChange = (option: any) =>
    handleChange("idJenisPakan", option?.value || "");

  const handleKelompokTernakChange = (option: any) =>
    handleChange("kelompokTernak", option?.value || "");

  const handlePetugasCheck = (id: string) =>
    setFormDetail((prev) => ({
      ...prev,
      petugas: prev.petugas.includes(id)
        ? prev.petugas.filter((p) => p !== id)
        : [...prev.petugas, id],
    }));

  // VALIDATION
  const validateForm = () => {
    if (!formDetail.idJenisPakan) return "Jenis pakan wajib dipilih!";
    if (!formDetail.targetPemberian) return "Target pemberian wajib diisi!";
    if (Number(formDetail.targetPemberian) <= 0)
      return "Target pemberian harus lebih dari 0!";
    if (!formDetail.kelompokTernak) return "Kelompok ternak wajib dipilih!";
    if (!formDetail.jamMulai) return "Jam mulai wajib diisi!";
    if (!formDetail.jamSelesai) return "Jam selesai wajib diisi!";
    if (formDetail.jamMulai >= formDetail.jamSelesai)
      return "Jam selesai harus lebih besar dari jam mulai!";
    if (formDetail.petugas.length === 0) return "Minimal pilih 1 petugas!";
    return null;
  };

  // SIMPAN DETAIL KE LOCALSTORAGE
  const simpanKeLocalStorage = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const confirm = await Swal.fire({
      title: "Tambah Penugasan?",
      text: "Data detail pakan akan ditambahkan",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tambah",
    });

    if (!confirm.isConfirmed) return;

    const stored = JSON.parse(localStorage.getItem("JadwalPakan") || "[]");
    const idx = stored.findIndex((j: any) => j.idJadwal === idJadwal);

    if (idx === -1) {
      toast.error("Data jadwal tidak ditemukan!");
      return;
    }

    // Tambah detail baru
    if (!stored[idx].detail) stored[idx].detail = [];
    stored[idx].detail.push({
      jenisPakan: formDetail.idJenisPakan,
      targetPemberian: formDetail.targetPemberian,
      kelompokTernak: formDetail.kelompokTernak,
      jamMulai: formDetail.jamMulai,
      jamSelesai: formDetail.jamSelesai,
      catatan: formDetail.catatan,
      petugas: formDetail.petugas,
    });

    // Simpan kembali
    localStorage.setItem("JadwalPakan", JSON.stringify(stored));

    toast.success(
      <div>
        <strong>Berhasil!</strong>
        <div>Detail pemberian pakan ditambahkan.</div>
      </div>
    );
    setTimeout(() => navigate("/jadwal/pakan/" + idJadwal), 1000);

    // Reset form
    setFormDetail({
      idJenisPakan: "",
      targetPemberian: "",
      kelompokTernak: "",
      jamMulai: "",
      jamSelesai: "",
      catatan: "",
      petugas: [],
    });
  };

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
            <span
              onClick={() => navigate("/tambahJadwalPakan")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Tambah Jadwal •{" "}
            </span>
            Tambah Penugasan Pakan
          </p>
        </div>
        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl border border-gray-100 shadow-lg">

            {/* HEADER */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <BiTask className="text-4xl text-farmdarkestbrown" />
              <h2 className="text-2xl mt-2 font-extrabold text-farmdarkestbrown font-spring drop-shadow-sm">
                Penugasan Pemberian Pakan
              </h2>
            </div>

            {/* DETAIL JADWAL */}
            <div className="flex items-center gap-6 pb-6 mb-8 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-6 shadow-sm">
              <LuCalendarClock className="text-6xl text-farmdarkestbrown" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                <div>
                  <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring drop-shadow-sm mb-1">
                    {dataJadwal?.namaJadwal}
                  </h2>
                  <p className="text-sm text-[#724e3a]">
                    {dataJadwal && formatTanggalIndo(dataJadwal.tanggalMulai, true)}
                  </p>
                  <p className="text-sm text-[#724e3a] mt-1">
                    Frekuensi:{" "}
                    <span className="font-medium text-farmdarkestbrown">
                      {dataJadwal?.frekuensiPengulangan === "custom"
                        ? `${dataJadwal?.customValue} Hari`
                        : dataJadwal?.frekuensiPengulangan}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-farmdarkestbrown mb-1">Catatan</h3>
                  <p className="text-sm text-[#724e3a]">
                    {dataJadwal?.catatan || "Tidak ada catatan"}
                  </p>
                </div>

              </div>
            </div>

            {/* FORM */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Jenis Pakan */}
                <SearchableSelect
                  forwhat="jenisPakan"
                  labelMessage="Jenis Pakan"
                  value={formDetail.idJenisPakan}
                  options={jenisPakanOptions}
                  placeholder="Pilih Jenis Pakan"
                  onChange={handleJenisPakanChange}
                />

                {/* Target Pemberian */}
                <InputElement
                  inputPlaceholder="Target Jumlah Pemberian Pakan (kg)"
                  forwhat="targetPemberian"
                  labelMessage="Target Jumlah Pemberian Pakan (kg)"
                  typeInput="number"
                  inputName="targetPemberian"
                  value={formDetail.targetPemberian}
                  onChange={(e) => handleChange("targetPemberian", e.target.value)}
                />

                {/* Kelompok Ternak */}
                <SearchableSelect
                  forwhat="kelompokTernak"
                  labelMessage="Kelompok Ternak"
                  value={formDetail.kelompokTernak}
                  options={kelompokTernakOptions}
                  placeholder="Pilih Kelompok Ternak"
                  onChange={handleKelompokTernakChange}
                />

                {/* Jam */}
                <InputElement
                  inputPlaceholder="Masukkan Jam Mulai Pemberian Pakan"
                  forwhat="jamMulai"
                  labelMessage="Jam Mulai Pemberian Pakan"
                  typeInput="time"
                  inputName="jamMulai"
                  value={formDetail.jamMulai ? dayjs(formDetail.jamMulai, "HH:mm") : null}
                  onChange={(_t, tStr) => handleChange("jamMulai", tStr)}
                />

                <InputElement
                  inputPlaceholder="Masukkan Jam Selesai Pemberian Pakan"
                  forwhat="jamSelesai"
                  labelMessage="Jam Selesai Pemberian Pakan"
                  typeInput="time"
                  inputName="jamSelesai"
                  value={formDetail.jamSelesai ? dayjs(formDetail.jamSelesai, "HH:mm") : null}
                  onChange={(_t, tStr) => handleChange("jamSelesai", tStr)}
                />

                {/* Catatan */}
                <InputElement
                  forwhat="catatan"
                  labelMessage="Catatan"
                  typeInput="text"
                  inputName="catatan"
                  value={formDetail.catatan}
                  onChange={(e) => handleChange("catatan", e.target.value)}
                  inputPlaceholder="Opsional"
                />

                {/* PETUGAS */}
                <div className="col-span-2">
                  <label className="font-semibold">Petugas</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                    {petugasList.map((p) => (
                      <label key={p.idPengguna} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formDetail.petugas.includes(p.idPengguna)}
                          onChange={() => handlePetugasCheck(p.idPengguna)}
                        />
                        {p.namaPengguna}
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={simpanKeLocalStorage}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-8 py-3 w-full rounded-full shadow-md"
                >
                  Tambah Penugasan
                </Button>
              </div>
            </div>

          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default TambahPenugasanPakan;
