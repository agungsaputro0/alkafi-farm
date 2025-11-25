import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { GiStarCycle } from "react-icons/gi";
import { decryptData } from "../utils/Encryptor";

// Daftar jenis catatan
const jenisCatatanOptions = [
  { value: "Birahi", label: "Birahi" },
  { value: "Kawin/Inseminasi", label: "Kawin/Inseminasi" },
  { value: "Kehamilan", label: "Kehamilan" },
  { value: "Kelahiran", label: "Kelahiran" },
  { value: "Pemisahan Populasi", label: "Pemisahan Populasi" },
  { value: "Kematian", label: "Kematian" },
  { value: "Pemeriksaan Kehamilan Lanjutan", label: "Pemeriksaan Kehamilan Lanjutan" },
  { value: "Perawatan Rutin", label: "Perawatan Rutin" },
  { value: "Pasca Melahirkan", label: "Pasca Melahirkan" }
];

const TambahRiwayatSiklus = () => {
  const { neckTag } = useParams<{ neckTag: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jenisCatatan: "",
    tanggalTerpantau: "",
    detail: ""
  });

  // Tambahkan fungsi helper untuk default hasilAnalisisAI dengan perkiraan tahap selanjutnya
    const getDefaultHasilAnalisisAI = (jenisCatatan: string) => {
    switch (jenisCatatan) {
        case "Birahi":
        return "Hewan sedang dalam masa birahi, kemungkinan siap untuk kawin/inseminasi. Perlu pengawasan intensif untuk mendeteksi tanda-tanda birahi dan mengoptimalkan reproduksi. Perkiraan tahap selanjutnya: lakukan kawin/inseminasi dalam 1-2 hari setelah tanda birahi muncul.";
        case "Kawin/Inseminasi":
        return "Telah dilakukan kawin atau inseminasi. Pantau perkembangan kehamilan dan kondisi hewan secara berkala. Perkiraan tahap selanjutnya: lakukan pemeriksaan kehamilan 18-21 hari setelah inseminasi.";
        case "Kehamilan":
        return "Hewan sedang hamil. Perlu monitoring rutin untuk mendeteksi komplikasi dan memastikan nutrisi yang optimal. Perkiraan tahap selanjutnya: lakukan pemeriksaan kehamilan lanjutan setiap 30 hari.";
        case "Kelahiran":
        return "Telah terjadi kelahiran. Pastikan hewan induk dan anak dalam kondisi sehat, dan lakukan perawatan pasca melahirkan. Perkiraan tahap selanjutnya: evaluasi kesehatan induk dan anak dalam 3-7 hari pasca lahir.";
        case "Pemisahan Populasi":
        return "Hewan dipisahkan sesuai kategori tertentu. Pastikan manajemen populasi dan kesehatan tetap optimal. Perkiraan tahap selanjutnya: pantau interaksi dan kesehatan hewan setiap minggu.";
        case "Kematian":
        return "Telah terjadi kematian hewan. Lakukan pencatatan penyebab dan evaluasi untuk pencegahan kasus serupa. Perkiraan tahap selanjutnya: lakukan analisis lingkungan dan kesehatan kelompok hewan dalam 1-2 hari.";
        case "Pemeriksaan Kehamilan Lanjutan":
        return "Melakukan pemeriksaan kehamilan lanjutan. Evaluasi kesehatan ibu hamil dan perkembangan janin. Perkiraan tahap selanjutnya: ulangi pemeriksaan setiap 30 hari sampai mendekati kelahiran.";
        case "Perawatan Rutin":
        return "Perawatan rutin dilakukan. Pastikan semua prosedur standar dipatuhi untuk menjaga kesehatan hewan. Perkiraan tahap selanjutnya: jadwalkan perawatan rutin berikutnya dalam 30 hari.";
        case "Pasca Melahirkan":
        return "Perawatan pasca melahirkan dilakukan. Pantau kondisi induk dan anak serta berikan nutrisi sesuai kebutuhan. Perkiraan tahap selanjutnya: cek kondisi hewan 3-7 hari pasca lahir.";
        default:
        return "Belum dianalisis secara spesifik. Perkiraan tahap selanjutnya: pantau kondisi hewan sesuai prosedur standar.";
    }
    };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected: any) => {
    setFormData((prev) => ({ ...prev, jenisCatatan: selected?.value || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.jenisCatatan || !formData.tanggalTerpantau) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Mohon isi jenis catatan dan tanggal terpantau.",
        confirmButtonText: "OK"
      });
      return;
    }

    // Konfirmasi sebelum simpan
    const confirmResult = await Swal.fire({
      title: "Yakin ingin menyimpan Data?",
      text: "Pastikan semua data lengkap dan benar",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const existingData =
        JSON.parse(localStorage.getItem("RiwayatSiklus") || "[]") || [];

      let nextId = "MR023";
      if (existingData.length > 0) {
        const lastId = existingData[existingData.length - 1].idRiwayatSiklus || "MR022";
        const nextNumber = parseInt(lastId.replace("MR", "")) + 1;
        nextId = `MR${String(nextNumber).padStart(3, "0")}`;
      }

      const currentUserStr = localStorage.getItem("currentUser");
      const petugas = currentUserStr ? JSON.parse(currentUserStr).idPengguna : "SystemUser01";

      const decryptedNeckTag = decryptData(neckTag || "") || "-";
      const idHewanTernak = decryptedNeckTag !== "-" ? decryptedNeckTag.replace(/^NT/, "HT") : "-";


      // Tambahkan field baru hasilAnalisisAI dan petugas
      const newData = {
        idMonitoring: nextId,
        idHewanTernak: idHewanTernak,
        jenisCatatan: formData.jenisCatatan,
        tanggalPencatatan: dayjs(formData.tanggalTerpantau).format("YYYY-MM-DD"),
        detail: formData.detail,
        hasilAnalisisAI: getDefaultHasilAnalisisAI(formData.jenisCatatan), 
        petugas: petugas, 
        waktuRekam: new Date().toISOString()
      };

      localStorage.setItem(
        "RiwayatSiklus",
        JSON.stringify([...existingData, newData])
      );
      toast.success(
        <div>
          <strong>Sukses!</strong>
          <div>Data Catatan berhasil disimpan.</div>
        </div>
      );
      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
     toast.error(
        <div>
          <strong>Mohon maaf!</strong>
          <div>Data Catatan gagal disimpan.</div>
        </div>
      );
    }
  };

  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/repository")}>Hewan Ternak • </span>
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/monitoring")}>Monitoring Siklus • </span>
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate(-1)}>Riwayat Siklus • </span>
            Tambah Catatan
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <GiStarCycle className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Catatan Siklus Kehidupan Hewan
                </h2>
                <p className="text-sm text-[#724e3a]">Isi informasi minimal jenis catatan, tanggal, dan catatan tambahan.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-1">
                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="jenisCatatan"
                  labelMessage="Jenis Catatan"
                  placeholder="Pilih Jenis Catatan"
                  options={jenisCatatanOptions}
                  onChange={handleSelectChange}
                  value={formData.jenisCatatan}
                />
              </div>

              <InputElement
                inputClass="mb-4"
                forwhat="tanggalTerpantau"
                labelMessage="Tanggal Terpantau"
                typeInput="date"
                inputName="tanggalTerpantau"
                inputPlaceholder="Pilih tanggal"
                format="DD-MM-YYYY"
                value={formData.tanggalTerpantau ? dayjs(formData.tanggalTerpantau, "YYYY-MM-DD") : null}
                onChange={(_date, _dateString) => {
                  if (_date) {
                    setFormData((prev) => ({ ...prev, tanggalTerpantau: _date.format("YYYY-MM-DD") }));
                  } else {
                    setFormData((prev) => ({ ...prev, tanggalTerpantau: "" }));
                  }
                }}
              />

              <div className="col-span-1 md:col-span-2">
                <label className="text-gray-800 font-semibold block mb-1">Detail</label>
                <textarea
                  name="detail"
                  placeholder="Detail Monitoring"
                  value={formData.detail}
                  onChange={handleInputChange}
                  className="w-full border-b-2 border-gray-500 px-2 py-2 bg-transparent focus:border-gray-800"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
                <Button
                  type="submit"
                  variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-8 py-3 w-full rounded-full shadow-md transition"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default TambahRiwayatSiklus;
