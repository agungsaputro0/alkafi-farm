import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import hewanTernakData from "../pseudo_db/hewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import statusData from "../pseudo_db/status.json";
import { FaCloudUploadAlt } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const TambahHewanTernak = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kodeNeckTag: "",
    idJenisHewanTernak: "",
    idRasHewanTernak: "",
    beratAwal: 0,
    tanggalLahir: "",
    jenisKelamin: "",
    asalTernak: "",
    statusHewan: "",
    catatan: "",
  });

  const [filteredRas, setFilteredRas] = useState<
    { value: string; label: string; idJenisHewanTernak: string }[]
  >([]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
  });

  // 🎚 handle perubahan input biasa
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧭 handle perubahan dropdown jenis
 const handleJenisChange = (selectedOption: any) => {
  const idJenis = selectedOption?.value || "";

  // ✅ Jika user memilih "Klik Disini", reset semuanya
  if (idJenis === "") {
    setFormData((prev) => ({
      ...prev,
      idJenisHewanTernak: "",
      idRasHewanTernak: "", 
    }));

    setFilteredRas([{ value: "", label: "Klik Disini", idJenisHewanTernak: "" }]); // biar tetap ada opsi placeholder

    return; // stop di sini
  }

  // ✅ Kalau user memilih jenis valid → lanjut filter ras
  setFormData((prev) => ({
    ...prev,
    idJenisHewanTernak: idJenis,
    idRasHewanTernak: "", // kosongkan ras setiap kali jenis berganti
  }));

  const filtered = rasHewanTernakData
    .filter((r: any) => r.idJenisHewanTernak === idJenis)
    .map((r: any) => ({
      value: r.idRasHewanTernak,
      label: r.namaRasHewanTernak,
      idJenisHewanTernak: r.idJenisHewanTernak,
    }));

  // ✅ Tambahkan placeholder di paling atas
  setFilteredRas([
    { value: "", label: "Klik Disini", idJenisHewanTernak: "" },
    ...filtered,
  ]);
};



  // 🧭 handle perubahan dropdown ras
  const handleRasChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      idRasHewanTernak: selectedOption?.value || "",
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validasi field wajib
    const requiredFields = [
        "kodeNeckTag",
        "idJenisHewanTernak",
        "idRasHewanTernak",
        "beratAwal",
        "jenisKelamin",
        "statusHewan",
    ];

    const isValid = requiredFields.every(
        (field) => formData[field as keyof typeof formData]
    );

    const existingPseudo = hewanTernakData.find(
    (h) =>
        h.kodeNeckTag === formData.kodeNeckTag &&
        h.statusHewan !== "Terjual" &&
        h.statusHewan !== "Mati"
    );

    if (formData.beratAwal < 10) {
        toast.error(
              <div>
                <strong>Mohon Maaf !</strong>
                <div>Berat hewan ternak tidak wajar (minimal 10 kg) !</div>
              </div>
        );

        return;
    }

    const localData = JSON.parse(localStorage.getItem("HewanTernakBaru") || "[]");

    const existingLocal = localData.find(
    (h: any) =>
        h.kodeNeckTag === formData.kodeNeckTag &&
        h.statusHewan !== "Terjual" &&
        h.statusHewan !== "Mati"
    );

    if (existingPseudo || existingLocal) {
        toast.error(
              <div>
                <strong>Mohon Maaf !</strong>
                <div>Kode NeckTag masih digunakan oleh hewan lain !</div>
              </div>
        );

        return;
    }


    if (!isValid) {
        Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Mohon isi semua data wajib sebelum melanjutkan.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
        customClass: {
            popup: "text-sm",
            confirmButton: "w-32", // seragamkan ukuran tombol
        },
        });
        return;
    }

    // ✅ Konfirmasi sebelum simpan
    const result = await Swal.fire({
        title: "<span>Yakin ingin menambahkan Data Hewan ?</span>",
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

    if (result.isConfirmed) {


        try {
        // Ambil data lama dari LocalStorage
        const existingData =
            JSON.parse(localStorage.getItem("HewanTernakBaru") || "[]") || [];

     
        let nextId = "HT016";
        if (existingData.length > 0) {
            const lastItem = existingData[existingData.length - 1];
            const lastId = lastItem.idHewanTernak || "HT015";
            const nextNumber = parseInt(lastId.replace("HT", "")) + 1;
            nextId = `HT${String(nextNumber).padStart(3, "0")}`;
        }

        // ✅ Siapkan data baru
        const newData = {
            idHewanTernak: nextId,
            ...formData,
            fotoHewan: uploadedFiles.map((file) => file.name), // simpan nama file saja
        };

        // ✅ Simpan ke LocalStorage
        const updatedData = [...existingData, newData];
        localStorage.setItem("HewanTernakBaru", JSON.stringify(updatedData));

        toast.success(
              <div>
                <strong>Sukses !</strong>
                <div>Data hewan berhasil ditambahkan!</div>
              </div>
            );

        setTimeout(() => {
            navigate("/ternak/repository"); 
        }, 1500);

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


  // convert data untuk dropdown jenis
  const jenisOptions = [
    { value: "", label: "Klik Disini" },
    ...jenisHewanTernakData.map((j: any) => ({
        value: j.idJenisHewanTernak,
        label: j.namaJenisHewanTernak,
    })),
  ];

   const statusOptions = [
    { value: "", label: "Klik Disini" }, 
    ...statusData.map((j: any) => ({
        value: j.idStatus,
        label: j.namaStatus,
    })),
  ];


  return (
    <section
      className="pt-16 flex justify-center mb-20 mx-4"
      style={{ paddingLeft: "80px" }}
    >
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span onClick={() => navigate("/ternak/repository")} className="text-white/50 hover:text-kemenkeuyellow cursor-pointer">Hewan Ternak • </span> Tambah Data Hewan
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <GiCow className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Data Hewan Ternak
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Lengkapi informasi berikut untuk menambahkan data hewan baru.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputElement
                  inputClass="mb-4"
                  forwhat="kodeNeckTag"
                  labelMessage="Kode Hewan (NeckTag)"
                  typeInput="text"
                  inputName="kodeNeckTag"
                  inputPlaceholder="Masukkan kode necktag hewan"
                  value={formData.kodeNeckTag}
                  onChange={handleInputChange}
                />

                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="jenisHewan"
                  labelMessage="Jenis Hewan Ternak"
                  placeholder="Pilih jenis hewan"
                  options={jenisOptions}
                  onChange={handleJenisChange}
                  value={formData.idJenisHewanTernak}
                />

                <SearchableSelect
                    inputClass="mb-4"
                    forwhat="rasHewan"
                    tooltipText="Pilih Jenis Hewan Ternak terlebih dahulu"
                    labelMessage="Ras Hewan Ternak"
                    placeholder={
                        formData.idJenisHewanTernak
                        ? "Pilih ras hewan"
                        : "Pilih jenis terlebih dahulu"
                    }
                    options={filteredRas}
                    onChange={handleRasChange}
                    value={
                        formData.idRasHewanTernak && 
                        filteredRas.some((r) => r.value === formData.idRasHewanTernak)
                        ? formData.idRasHewanTernak
                        : "" 
                    }
                    isReady={!!formData.idJenisHewanTernak}
                    />

                <InputElement
                  inputClass="mb-4"
                  forwhat="beratAwal"
                  labelMessage="Berat saat dicatat (berat awal) (kg)"
                  typeInput="number"
                  inputName="beratAwal"
                  step={0.1}
                  min={0}
                  inputPlaceholder="Masukkan berat dalam kg"
                  value={formData.beratAwal}
                  onChange={handleInputChange}
                />

              <InputElement
                inputClass="mb-4"
                forwhat="tanggalLahir"
                labelMessage="Tanggal Lahir"
                typeInput="date"
                inputName="tanggalLahir"
                inputPlaceholder="Pilih tanggal lahir"
                format="DD-MM-YYYY"
                value={formData.tanggalLahir ? dayjs(formData.tanggalLahir, "YYYY-MM-DD") : null}
                onChange={(_date, _dateString) => {
                  if (_date) {
                    // simpan dalam YYYY-MM-DD
                    setFormData((prev) => ({
                      ...prev,
                      tanggalLahir: _date.format("YYYY-MM-DD"),
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      tanggalLahir: "",
                    }));
                  }
                }}
                />

                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="jenisKelamin"
                  labelMessage="Jenis Kelamin"
                  placeholder="Pilih jenis kelamin"
                  options={[
                    { value: "jantan", label: "Jantan" },
                    { value: "betina", label: "Betina" },
                  ]}
                  onChange={(opt) =>
                    setFormData((prev) => ({
                      ...prev,
                      jenisKelamin: opt?.value || "",
                    }))
                  }
                  value={formData.jenisKelamin}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="asalTernak"
                  labelMessage="Asal Ternak"
                  typeInput="text"
                  inputName="asalTernak"
                  inputPlaceholder="Contoh: Peternakan Alkafi"
                  value={formData.asalTernak}
                  onChange={handleInputChange}
                />

                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="statusHewan"
                  labelMessage="Status Hewan Ternak"
                  placeholder="Pilih status hewan"
                  options={statusOptions}
                  onChange={(opt) =>
                    setFormData((prev) => ({
                      ...prev,
                      statusHewan: opt?.value || "",
                    }))
                  }
                  value={formData.statusHewan}
                />

                {/* Catatan */}
                <div className="mb-4">
                  <label className="text-gray-800 font-semibold block mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="catatan"
                    className="w-full border-b-2 min-h-[94px] border-gray-500 text-sm px-2 py-2 bg-transparent focus:border-gray-800 placeholder:opacity-90"
                    placeholder="Tuliskan catatan tambahan (opsional)"
                    value={formData.catatan}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Dropzone */}
                 <div>
                <label className="text-gray-800 font-semibold block mb-2">
                    Unggah Gambar Hewan
                </label>

                <div
                    {...getRootProps()}
                    className={`border-2 min-h-[90px] flex flex-wrap gap-3 justify-center items-center border-dashed rounded-xl p-4 text-center cursor-pointer transition relative ${
                    isDragActive
                        ? "border-farmdarkbrown bg-[#fff6eb]"
                        : "border-gray-400 bg-[#fffefc]"
                    }`}
                >
                    <input {...getInputProps()} />

                    {uploadedFiles.length === 0 ? (
                    <div className="flex items-center gap-2">
                        <FaCloudUploadAlt className="text-4xl text-gray-500" />
                        <p className="text-gray-500 text-sm">
                        Seret gambar ke sini atau klik untuk memilih
                        </p>
                    </div>
                    ) : (
                    <>
                        {uploadedFiles.map((file) => {
                        const preview = URL.createObjectURL(file);
                        return (
                            <div
                            key={file.name}
                            className="relative border rounded-xl overflow-hidden shadow-sm w-28 h-28"
                            >
                            <img
                                src={preview}
                                alt={file.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.name);
                                }}
                                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                            >
                                <IoClose size={16} />
                            </button>
                            </div>
                        );
                        })}

                        {/* Tombol tambah file */}
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl w-28 h-28 text-gray-400">
                        <FaCloudUploadAlt className="text-2xl" />
                        <p className="text-[11px] mt-1">Tambah</p>
                        </div>
                    </>
                    )}
                </div>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end mt-8">
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

export default TambahHewanTernak;
