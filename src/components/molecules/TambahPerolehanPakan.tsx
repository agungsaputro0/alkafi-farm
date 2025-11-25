import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import jenisPakanData from "../pseudo_db/jenispakan.json";
import satuanPakan from "../pseudo_db/satuanpakan.json";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdGrass } from "react-icons/md";


const TambahPerolehanPakan = () => {
  const navigate = useNavigate();
  const [rawHarga, setRawHarga] = useState(""); // input string mentah
  const [formData, setFormData] = useState({
    idJenisPakan: "",
    tanggalMasuk: "",
    sumberPakan: "",
    supplier: "",
    jumlahMasuk: 0,
    satuan: "",
    totalHarga: 0,
    catatan: "",
  });
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJenisChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      idJenisPakan: selectedOption?.value || "",
    }));
  };

   const handleSatuanChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      satuan: selectedOption?.value || "",
    }));
  };



const formatRibuan = (value: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const handleHargaChange = (value: string) => {
  let sanitized = value.replace(/[^0-9,]/g, "");
  const [integerPart, decimalPart] = sanitized.split(",");
  const formattedInteger = formatRibuan(integerPart || "");
  const formatted = decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
  setRawHarga(formatted);
  const numericValue = parseFloat(sanitized.replace(",", "."));
  setFormData({ ...formData, totalHarga: isNaN(numericValue) ? 0 : numericValue });
};


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
        "idJenisPakan",
        "tanggalMasuk",
        "sumberPakan",
        "supplier",
        "jumlahMasuk",
        "satuan",
        "totalHarga",
    ];

    const isValid = requiredFields.every(
        (field) => formData[field as keyof typeof formData]
    );

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
        console.log(formData);
        return;
    }

    // ✅ Konfirmasi sebelum simpan
    const result = await Swal.fire({
        title: "<span>Yakin ingin menambahkan Data Perolehan Pakan ?</span>",
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
            JSON.parse(localStorage.getItem("PerolehanPakanBaru") || "[]") || [];

     
        let nextId = "PK016";
        if (existingData.length > 0) {
            const lastItem = existingData[existingData.length - 1];
            const lastId = lastItem.idPakan || "PK015";
            const nextNumber = parseInt(lastId.replace("PK", "")) + 1;
            nextId = `PK${String(nextNumber).padStart(3, "0")}`;
        }

        // ✅ Siapkan data baru
        const newData = {
            idPakan: nextId,
            ...formData
        };

        // ✅ Simpan ke LocalStorage
        const updatedData = [...existingData, newData];
        localStorage.setItem("PerolehanPakanBaru", JSON.stringify(updatedData));

        toast.success(
              <div>
                <strong>Sukses !</strong>
                <div>Data Perolehan Pakan berhasil ditambahkan!</div>
              </div>
            );

        setTimeout(() => {
            navigate("/GudangObat"); 
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
    ...jenisPakanData.map((j: any) => ({
        value: j.idJenisPakan,
        label: j.namaJenisPakan,
    })),
  ];

  const satuanOptions = [
    { value: "", label: "Klik Disini" },
    ...satuanPakan.map((j: any) => ({
        value: j.idSatuan,
        label: j.namaSatuan,
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
            <span onClick={() => navigate("/StokPakan")} className="text-white/50 hover:text-kemenkeuyellow cursor-pointer">Stok Pakan • </span> Tambah Perolehan
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <MdGrass className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Perolehan Pakan Baru
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Lengkapi informasi berikut untuk menambahkan data perolehan pakan baru.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="jenisPakan"
                  labelMessage="Jenis Pakan"
                  placeholder="Pilih jenis Pakan"
                  options={jenisOptions}
                  onChange={handleJenisChange}
                  value={formData.idJenisPakan}
                />

                 <InputElement
                inputClass="mb-4"
                forwhat="tanggalMasuk"
                labelMessage="Tanggal Masuk"
                typeInput="date"
                inputName="tanggalMasuk"
                inputPlaceholder="Pilih tanggal masuk"
                format="DD-MM-YYYY" // tampilannya
                value={formData.tanggalMasuk ? dayjs(formData.tanggalMasuk, "YYYY-MM-DD") : null} // parse dari YYYY-MM-DD
                onChange={(_date, _dateString) => {
                  if (_date) {
                    // simpan dalam YYYY-MM-DD
                    setFormData((prev) => ({
                      ...prev,
                      tanggalMasuk: _date.format("YYYY-MM-DD"),
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      tanggalMasuk: "",
                    }));
                  }
                }}
              />

                <InputElement
                  inputClass="mb-4"
                  forwhat="sumberPakan"
                  labelMessage="Sumber Pakan"
                  typeInput="text"
                  inputName="sumberPakan"
                  inputPlaceholder="Masukkan Sumber Pakan"
                  value={formData.sumberPakan}
                  onChange={handleInputChange}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="supplier"
                  labelMessage="Supplier"
                  typeInput="text"
                  inputName="supplier"
                  inputPlaceholder="Masukkan Supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                />

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                 <InputElement
                     inputClass="mb-4"
                     forwhat="jumlahMasuk"
                     labelMessage="Jumlah Masuk"
                     typeInput="number"
                     inputName="jumlahMasuk"
                     step={0.1}
                     min={0}
                     inputPlaceholder="Masukkan jumlah Masuk"
                     value={formData.jumlahMasuk}
                     onChange={handleInputChange}
                />

               <SearchableSelect
                  inputClass="mb-4"
                  forwhat="satuan"
                  labelMessage="Satuan"
                  placeholder="Pilih Satuan"
                  options={satuanOptions}
                  onChange={handleSatuanChange}
                  value={formData.satuan}
                />

                <InputElement
                    inputClass="mb-4"
                    forwhat="totalHarga"
                    labelMessage="Total Harga"
                    typeInput="text"
                    inputName="totalHarga"
                    inputPlaceholder="Masukkan Harga"
                    value={rawHarga}
                    onChange={(e) => handleHargaChange(e.target.value)}
                />
                </div>

                {/* Catatan */}
                <div className="mb-4 col-span-2">
                  <label className="text-gray-800 font-semibold block mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="catatan"
                    className="w-full border-b-2 min-h-[36px] border-gray-500 text-sm px-2 py-2 bg-transparent focus:border-gray-800 placeholder:opacity-90"
                    placeholder="Tuliskan catatan tambahan (opsional)"
                    value={formData.catatan}
                    onChange={handleInputChange}
                  />
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

export default TambahPerolehanPakan;
