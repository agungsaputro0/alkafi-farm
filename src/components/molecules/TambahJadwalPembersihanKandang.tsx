import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import InputElement from "../atoms/InputElement";
import Button from "../atoms/Button";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import kandangData from "../pseudo_db/kandang.json";
import usersData from "../pseudo_db/users.json";
import dayjs from "dayjs";
import { LiaCalendarDaySolid } from "react-icons/lia";

const TambahJadwalPembersihanKandang = () => {
  const navigate = useNavigate();

  const petugasList = usersData.filter((u: any) => u.idRole === 3);

  const jenisPembersihanOptions = [
    { value: "disinfektan", label: "Penyemprotan Disinfektan" },
    { value: "kering", label: "Pembersihan Kotoran (Kering)" },
    { value: "basah", label: "Pembersihan Basah" },
    { value: "sterilisasi", label: "Sterilisasi Kandang" },
  ];

  const frekuensiOptions = [
    { value: "hari_ini", label: "Hari Ini" },
    { value: "3_hari", label: "Per 3 Hari" },
    { value: "mingguan", label: "Per Minggu" },
    { value: "bulanan", label: "Per Bulan" },
    { value: "custom", label: "Custom" },
  ];

  const kandangOptions = [
    { value: "", label: "Pilih Kandang" },
    ...kandangData.map((k: any) => ({
      value: k.idKandang,
      label: k.namaKandang,
    })),
  ];

  const [formData, setFormData] = useState({
    idKandang: "",
    tanggal: "",
    waktu: "",
    frekuensi: "",
    customValue: "",
    jenisPembersihan: "",
    peralatan: "",
    catatan: "",
    petugas: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKandangChange = (option: any) => {
    setFormData((prev) => ({ ...prev, idKandang: option?.value || "" }));
  };

  const handleJenisChange = (option: any) => {
    setFormData((prev) => ({
      ...prev,
      jenisPembersihan: option?.value || "",
    }));
  };

  const handleFrekuensiChange = (option: any) => {
    setFormData((prev) => ({
      ...prev,
      frekuensi: option?.value || "",
      customValue: "",
    }));
  };

  const handlePetugasCheck = (idPengguna: string) => {
    setFormData((prev) => {
      const exists = prev.petugas.includes(idPengguna);
      return {
        ...prev,
        petugas: exists
          ? prev.petugas.filter((p) => p !== idPengguna)
          : [...prev.petugas, idPengguna],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const required = [
      "idKandang",
      "tanggal",
      "waktu",
      "frekuensi",
      "jenisPembersihan",
    ];

    const isValid = required.every(
      (field) => formData[field as keyof typeof formData] !== ""
    );

    const result = await Swal.fire({
            title: "<span>Yakin ingin menambahkan Data Jadwal ?</span>",
            text: "Pastikan semua data sudah benar.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
            width: "420px", // sedikit lebih lebar
            padding: "1.5em",
            customClass: {
                popup: "text-sm",
                confirmButton: "w-32 text-sm py-2",
                cancelButton: "w-32 text-sm py-2",
                title: "text-base font-semibold leading-snug", // spacing antar baris lebih rapat
            },
        });

    if (!isValid) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Harap isi semua data wajib.",
      });
      return;
    }

    if (result.isConfirmed) {
         try {
    const existing =
      JSON.parse(localStorage.getItem("JadwalPembersihanKandang") || "[]") || [];

    let nextId = "JK005";
    if (existing.length > 0) {
      const last = existing[existing.length - 1];
      const lastId = last.idJadwal || "JK004";
      const nextNumber = parseInt(lastId.replace("JK", "")) + 1;
      nextId = `JK${String(nextNumber).padStart(3, "0")}`;
    }

    const newData = {
      idJadwal: nextId,
      ...formData,
    };

    localStorage.setItem(
      "JadwalPembersihanKandang",
      JSON.stringify([...existing, newData])
    );

    toast.success(
         <div>
                <strong>Sukses !</strong>
                <div>Jadwal pembersihan berhasil ditambahkan!</div>
         </div>
        );
    navigate("/jadwal/kandang");
     } catch (error) {
            toast.error(
                  <div>
                    <strong>Gagal menyimpan !</strong>
                    <div>Cek kembali data Anda!</div>
                  </div>
            );
          
            }
        }
  };

  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span
              onClick={() => navigate("/jadwal/kandang")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Jadwal Tugas • Bersih Kandang •{" "}
            </span>
            Tambah Jadwal
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
           <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <LiaCalendarDaySolid className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Jadwal Pembersihan Kandang
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Lengkapi informasi berikut untuk menambahkan jadwal baru.
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                <SearchableSelect
                  forwhat="kandang"
                  labelMessage="Kandang"
                  placeholder="Pilih Kandang"
                  options={kandangOptions}
                  onChange={handleKandangChange}
                  value={formData.idKandang}
                />

                <InputElement
                  inputPlaceholder="Tanggal Mulai"
                  forwhat="tanggal"
                  labelMessage="Tanggal"
                  typeInput="date"
                  inputName="tanggal"
                  format="DD-MM-YYYY" // tampilannya
                  value={
                    formData.tanggal
                      ? dayjs(formData.tanggal, "YYYY-MM-DD")
                      : null
                  }
                  onChange={(_date) => {
                    setFormData((prev) => ({
                      ...prev,
                      tanggal: _date ? _date.format("YYYY-MM-DD") : "",
                    }));
                  }}
                />

                <InputElement
                    forwhat="waktu"
                    labelMessage="Waktu"
                    typeInput="time"
                    inputName="waktu"
                    value={formData.waktu ? dayjs(formData.waktu, "hh:mm") : null}
                    onChange={(_time, timeString) => {
                        setFormData(prev => ({ ...prev, waktu: timeString }));
                    }}
                    inputPlaceholder="Pilih waktu"
                />


                {/* Frekuensi */}
                <div className="flex items-center gap-3">
                  <div className={formData.frekuensi === "custom" ? "w-1/2" : "w-full"}>
                    <SearchableSelect
                      forwhat="frekuensi"
                      labelMessage="Frekuensi"
                      placeholder="Pilih Frekuensi"
                      options={frekuensiOptions}
                      onChange={handleFrekuensiChange}
                      value={formData.frekuensi}
                    />
                  </div>

                  {formData.frekuensi === "custom" && (
                    <div className={formData.frekuensi === "custom" ? "w-1/2" : "w-full"}>
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
                    // <input
                    //   type="number"
                    //   name="customValue"
                    //   min={1}
                    //   placeholder="Angka"
                    //   value={formData.customValue}
                    //   onChange={handleInputChange}
                    //   className="border-b-2 border-gray-500 px-2 py-1 w-1/2"
                    // />
                  )}
                </div>

                <SearchableSelect
                  forwhat="jenisPembersihan"
                  labelMessage="Jenis Pembersihan"
                  placeholder="Pilih Jenis"
                  options={jenisPembersihanOptions}
                  onChange={handleJenisChange}
                  value={formData.jenisPembersihan}
                />

                {/* Peralatan */}
                <div>
                  <label className="font-semibold text-gray-800">Peralatan & Bahan</label>
                  <textarea
                    name="peralatan"
                    placeholder="Opsional"
                    value={formData.peralatan}
                    onChange={handleInputChange}
                    className="w-full border-b-2 min-h-[41px] h-[41px] border-gray-500 text-sm px-2 py-2 bg-transparent focus:border-gray-800"
                  />
                </div>

                {/* Catatan */}
                <div className="col-span-2">
                  <label className="font-semibold text-gray-800">Catatan</label>
                  <textarea
                    name="catatan"
                    placeholder="Opsional"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-gray-500 bg-transparent px-2 py-2"
                  />
                </div>

                {/* Petugas */}
                <div className="col-span-1">
                  <label className="font-semibold text-gray-800">Petugas</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {petugasList.map((p: any) => (
                      <label key={p.idPengguna} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.petugas.includes(p.idPengguna)}
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

export default TambahJadwalPembersihanKandang;
