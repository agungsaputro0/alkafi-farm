import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import Button from "../atoms/Button";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { LuCalendarClock } from "react-icons/lu";

const TambahJadwalPemberianPakan = () => {
  const navigate = useNavigate();

  // hanya data pokok
  const [formData, setFormData] = useState({
    namaJadwal: "",
    tanggalMulai: "",
    frekuensiPengulangan: "",
    customValue: "",
    catatan: "",
  });

  const frekuensiOptions = [
    { value: "hari_ini", label: "Hari Ini" },
    { value: "per_3_hari", label: "Per 3 Hari" },
    { value: "mingguan", label: "Mingguan" },
    { value: "bulanan", label: "Bulanan" },
    { value: "custom", label: "Custom" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleFrekuensiChange = (option: any) => {
    setFormData((prev) => ({
      ...prev,
      frekuensiPengulangan: option?.value || "",
      customValue: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required = ["namaJadwal", "tanggalMulai", "frekuensiPengulangan"];
    const isValid = required.every(
      (field) => formData[field as keyof typeof formData] !== ""
    );

    if (!isValid) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Harap isi semua data wajib.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "<span>Yakin ingin menambahkan jadwal?</span>",
      text: "Pastikan semua data sudah sesuai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
      width: "420px",
      padding: "1.5em",
    });

    if (!result.isConfirmed) return;

    try {
      const existing =
        JSON.parse(localStorage.getItem("JadwalPakan") || "[]") || [];

      let nextId = "JP005";
      if (existing.length > 0) {
        const last = existing[existing.length - 1];
        const lastId = last.idJadwal || "JP004";
        const nextNumber = parseInt(lastId.replace("JP", "")) + 1;
        nextId = `JP${String(nextNumber).padStart(3, "0")}`;
      }

      const newData = {
        idJadwal: nextId,
        ...formData,
      };

      localStorage.setItem(
        "JadwalPakan",
        JSON.stringify([...existing, newData])
      );

      toast.success(
        <div>
          <strong>Berhasil!</strong>
          <div>Jadwal pakan berhasil ditambahkan!</div>
        </div>
      );

      navigate(`/jadwal/pakan/${nextId}`); // halaman detail

    } catch (error) {
      toast.error(
        <div>
          <strong>Gagal!</strong>
          <div>Terjadi kesalahan saat menyimpan data.</div>
        </div>
      );
    }
  };

  return (
    <section
      className="pt-16 flex justify-center mb-20 mx-4"
      style={{ paddingLeft: "80px" }}
    >
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span
              onClick={() => navigate("/jadwal/pakan")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Jadwal Tugas • Pemberian Pakan •{" "}
            </span>
            Tambah Jadwal
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <LuCalendarClock className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Jadwal Pakan
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Isi informasi pokok jadwal pakan.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                <InputElement
                  forwhat="namaJadwal"
                  labelMessage="Nama Jadwal"
                  inputName="namaJadwal"
                  typeInput="text"
                  value={formData.namaJadwal}
                  onChange={handleInputChange}
                  inputPlaceholder="contoh: Pemberian Pakan Pagi"
                />

                <InputElement
                  inputPlaceholder="Masukkan tanggal mulai"
                  forwhat="tanggalMulai"
                  labelMessage="Tanggal Mulai"
                  typeInput="date"
                  inputName="tanggalMulai"
                  format="DD-MM-YYYY" 
                  value={
                    formData.tanggalMulai
                      ? dayjs(formData.tanggalMulai, "YYYY-MM-DD")
                      : null
                  }
                  onChange={(_date) => {
                    setFormData((prev) => ({
                      ...prev,
                      tanggalMulai: _date ? _date.format("YYYY-MM-DD") : "",
                    }));
                  }}
                />
                <div className="flex items-center gap-3">
                    <div className={formData.frekuensiPengulangan === "custom" ? "w-1/2" : "w-full"}>
                <SearchableSelect
                  forwhat="frekuensiPengulangan"
                  labelMessage="Frekuensi Pengulangan"
                  placeholder="Pilih frekuensi"
                  options={frekuensiOptions}
                  value={formData.frekuensiPengulangan}
                  onChange={handleFrekuensiChange}
                />
                </div>
                 {formData.frekuensiPengulangan === "custom" && (
                    <div className={formData.frekuensiPengulangan === "custom" ? "w-1/2" : "w-full"}>
                    <InputElement
                       forwhat="perBerapaHari"
                       labelMessage="Per Berapa Hari"
                       typeInput="number"
                       inputName="customValue"
                       inputPlaceholder="Masukkan frekuensi custom"
                       value={formData.customValue}
                       onChange={handleInputChange}
                     />
                     </div>
                 )}
                </div>

                <div>
                  <label className="font-semibold text-gray-800">Catatan</label>
                  <textarea
                    className="w-full border-b-2 min-h-[41px] h-[41px] border-gray-500 text-sm px-2 py-2 bg-transparent focus:border-gray-800"
                    name="catatan"
                    placeholder="Opsional"
                    value={formData.catatan}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-8 py-3 w-full rounded-full shadow-md"
                >
                  Simpan Jadwal
                </Button>
              </div>
            </form>
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default TambahJadwalPemberianPakan;
