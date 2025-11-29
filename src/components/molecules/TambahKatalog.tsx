import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import fotoHewanTernakData from "../pseudo_db/fotohewanternak.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import { FaCloudUploadAlt } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiFarmDuotone } from "react-icons/pi";
import PilihHewanTernakModal from "./PilihHewanTernakModal";

type FormDataType = {
  namaProduk: string;
  kategori: string[];
  harga: string;
  stok: string;
  satuan: string;
  deskripsi: string;
  idJenisHewanTernak?: string;
  idRasHewanTernak?: string;
};


const TambahKatalogProduk = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    namaProduk: "",
    kategori: [],       // multi select → array
    harga: "",
    stok: "",
    satuan: "",
    deskripsi: "",
  });
  const [previewFromDB, setPreviewFromDB] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // hapus semua karakter kecuali angka
    const numeric = val.replace(/\D/g, "");

    // format ribuan
    const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    setFormData(prev => ({
        ...prev,
        harga: formatted
    }));
};


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

const kategoriOptions = [
  { value: "Hewan Ternak", label: "Hewan Ternak" },

  ...jenisHewanTernakData.map((j) => ({
    value: j.namaJenisHewanTernak,
    label: j.namaJenisHewanTernak,
  })),

  { value: "Produk Turunan", label: "Produk Turunan" },
  { value: "Produk Olahan", label: "Produk Olahan" },
  { value: "Daging", label: "Daging" },
  { value: "Susu", label: "Susu" },
];

const removePreviewDB = (index: number) => {
    setPreviewFromDB((prev) => prev.filter((_, i) => i !== index));
    };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ======================
    // 1. VALIDASI DATA
    // ======================
    if (
        !formData.namaProduk ||
        formData.kategori.length === 0 ||
        !formData.harga ||
        !formData.stok ||
        !formData.satuan ||
        !formData.deskripsi
    ) {
        Swal.fire({
            icon: "warning",
            title: "Data belum lengkap",
            text: "Semua data wajib diisi sebelum menyimpan.",
        });
        return;
    }
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
    // ======================
    // 2. AMBIL FOTO
    // ======================
   const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
    });

    let fotoFinal: string[] = [];

    if (previewFromDB.length > 0) {
    fotoFinal = previewFromDB;
    } else if (uploadedFiles.length > 0) {
    // konversi semua file ke Base64 secara sinkron pakai Promise.all
    fotoFinal = await Promise.all(uploadedFiles.map(fileToBase64));
    }

    if (fotoFinal.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Belum ada foto",
            text: "Minimal 1 foto harus diunggah.",
        });
        return;
    }

    // ======================
    // 3. GENERATE ID KATALOG
    // ======================
    const existing = JSON.parse(localStorage.getItem("KatalogProdukBaru") || "[]");

    let nextId = "KT011";
    if (existing.length > 0) {
        const last = existing[existing.length - 1];
        const nextNum = parseInt(last.idKatalog.replace("KT", "")) + 1;
        nextId = `KT${String(nextNum).padStart(3, "0")}`;
    }

    // ======================
    // 4. TENTUKAN idHewanTernak
    // ======================
    const idHewan = formData.idJenisHewanTernak ? formData.idJenisHewanTernak : null;

    // ======================
    // 5. BENTUK DATA BARU
    // ======================
    const newData = {
        idKatalog: nextId,
        tipe: idHewan == null ? "produk" : "hewan",
        idHewanTernak: idHewan,
        namaProduk: formData.namaProduk,
        foto: fotoFinal,
        kategori: formData.kategori.join(", "),
        stok: formData.stok,
        harga: formData.harga,
        deskripsi: formData.deskripsi,
    };

    const updated = [...existing, newData];

    // ======================
    // 6. SIMPAN
    // ======================
    localStorage.setItem("KatalogProdukBaru", JSON.stringify(updated));

    toast.success(
        <div>
                <strong>Sukses !</strong>
                <div>Produk berhasil ditambahkan ke e-katalog!</div>
              </div>
    );
    }

    // redirect
    setTimeout(() => navigate("/e-katalog"), 1200);
};


  const getNamaJenis = (id: string) =>
      jenisHewanTernakData.find((j) => j.idJenisHewanTernak === id)
        ?.namaJenisHewanTernak || "-";
  
   const getNamaRas = (id: string) =>
      rasHewanTernakData.find((r) => r.idRasHewanTernak === id)
        ?.namaRasHewanTernak || "-";

  const handlePilihHewan = (hewan: any) => {

    // buat array URL preview (sesuaikan path folder)
   const fotoPreview = fotoHewanTernakData
        .filter((f) => f.idHewanTernak === hewan.idHewanTernak)
        .map((f) => f.fotoUrl);


    // ⬅️ tampilkan langsung di dropzone
    setPreviewFromDB(fotoPreview);

    setFormData((prev) => ({
        ...prev,
        namaProduk: `${getNamaJenis(hewan.idJenisHewanTernak)} ${getNamaRas(hewan.idRasHewanTernak)} ${hewan.kodeNeckTag}`,
        kategori: ["Hewan Ternak", getNamaJenis(hewan.idJenisHewanTernak)],
        satuan: "ekor",
        idJenisHewanTernak: hewan.idJenisHewanTernak,
        idRasHewanTernak: hewan.idRasHewanTernak,
        stok: "1",
        deskripsi: "Hewan Ternak " + `${getNamaJenis(hewan.idJenisHewanTernak)} dari Ras ${getNamaRas(hewan.idRasHewanTernak)} dengan berat timbang sebesar ${hewan.beratAwal} kg`
    }));

  setIsModalOpen(false);
};



  return (
    <section
      className="pt-16 flex justify-center mb-20 mx-4"
      style={{ paddingLeft: "80px" }}
    >
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span onClick={() => navigate("/e-katalog")} className="text-white/50 hover:text-kemenkeuyellow cursor-pointer">E-Katalog • </span> Tambah Produk
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <GiCow className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Produk Baru Katalog
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Lengkapi informasi berikut untuk menambahkan data produk baru untuk ditampilkan di e-katalog.
                </p>
              </div>
              <div className="ml-auto">
                              <Button
                                onClick={() => setIsModalOpen(true)}
                                variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                              >
                                <PiFarmDuotone className="text-xl" /> Pilih Dari Hewan Ternak
                              </Button>
                            </div>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                
                {/* Nama Produk */}
                <InputElement
                inputClass="mb-4"
                forwhat="namaProduk"
                labelMessage="Nama Produk"
                typeInput="text"
                inputName="namaProduk"
                inputPlaceholder="Masukkan nama produk"
                value={formData.namaProduk}
                onChange={handleInputChange}
                />

                {/* Kategori: MULTI SELECT */}
                <SearchableSelect
                    inputClass="mb-4"
                    forwhat="kategori"
                    labelMessage="Kategori Produk"
                    placeholder="Pilih kategori produk"
                    options={kategoriOptions}
                    isMulti
                    value={formData.kategori?.map(k => ({ value: k, label: k })) || []}
                    onChange={(selected) =>
                    setFormData((prev) => ({
                        ...prev,
                        kategori: Array.isArray(selected)
                        ? selected.map((s) => s.value)
                        : [],
                    }))
                    }
                />

                {/* Harga */}
                <InputElement
                    inputClass="mb-4"
                    forwhat="harga"
                    labelMessage="Harga (Rp)"
                    typeInput="text"   
                    inputName="harga"
                    inputPlaceholder="Masukkan harga produk"
                    value={formData.harga}
                    onChange={handleHargaChange}
                />


                {/* Stok */}
                <InputElement
                inputClass="mb-4"
                forwhat="stok"
                labelMessage="Stok"
                typeInput="number"
                inputName="stok"
                min={0}
                inputPlaceholder="Jumlah stok"
                value={formData.stok}
                onChange={handleInputChange}
                />

                {/* Satuan */}
                <SearchableSelect
                inputClass="mb-4"
                forwhat="satuan"
                labelMessage="Satuan"
                placeholder="Pilih satuan"
                options={[
                    { value: "kg", label: "Kilogram (kg)" },
                    { value: "gram", label: "Gram (gr)" },
                    { value: "liter", label: "Liter" },
                    { value: "ekor", label: "Ekor" },
                    { value: "pack", label: "Pack" },
                ]}
                value={formData.satuan}
                onChange={(opt) =>
                    setFormData((prev) => ({
                    ...prev,
                    satuan: opt?.value || "",
                    }))
                }
                />

                {/* Deskripsi */}
                <div className="mb-4">
                <label className="text-gray-800 font-semibold block mb-1">
                    Deskripsi Produk
                </label>
                <textarea
                    name="deskripsi"
                    className="w-full border-b-2 min-h-[36px] h-[36px] border-gray-500 text-sm px-2 py-2 bg-transparent focus:border-gray-800"
                    placeholder="Tuliskan deskripsi produk..."
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                />
                </div>

                {/* Dropzone */}
                 <div className="col-span-2">
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

                    {previewFromDB.length > 0 ? (
    // jika ambil dari DB → tampilkan ini
    <>
        {previewFromDB.map((src, i) => (
            <div
                key={i}
                className="relative border rounded-xl overflow-hidden shadow-sm w-28 h-28"
            >
                <img
                    src={src}
                    alt="preview-db"
                    className="w-full h-full object-cover"
                     onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/img/hewanternak/hewanplaceholder.jpg';
                        }}
                />

                 <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        removePreviewDB(i);   // ⬅️ HAPUS FOTO DB
                    }}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                >
                    <IoClose size={16} />
                </button>
            </div>
        ))}
    </>
) : uploadedFiles.length === 0 ? (
    // jika tidak ada DB dan belum upload → tampilkan pesan awal
    <div className="flex items-center gap-2">
        <FaCloudUploadAlt className="text-4xl text-gray-500" />
        <p className="text-gray-500 text-sm">
            Seret gambar ke sini atau klik untuk memilih
        </p>
    </div>
) : (
    // jika user upload normal → tampilkan upload
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
    </>
)}

                </div>
                </div>

            </div>

            {/* Tombol Submit */}
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
       <PilihHewanTernakModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handlePilihHewan}
            />
    </section>
  );
};

export default TambahKatalogProduk;
