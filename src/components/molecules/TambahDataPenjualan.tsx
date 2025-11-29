import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import dayjs from "dayjs";
import { TiShoppingCart } from "react-icons/ti";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { encryptData } from "../utils/Encryptor";

const TambahDataPenjualan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPembeli: "",
    nomorHandphone: "",
    alamat: "",
    kanalTransaksi: "",
    metodePembayaran: "",
    tanggalTransaksi: "",
    biayaKirim: 0,
    status: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const requiredFields = [
    "namaPembeli",
    "nomorHandphone",
    "alamat",
    "kanalTransaksi",
    "metodePembayaran",
    "tanggalTransaksi",
    "status",
  ];

  const isValid = requiredFields.every(
    (field) => formData[field as keyof typeof formData]
  );

  if (!isValid) {
    Swal.fire({
      icon: "warning",
      title: "Data belum lengkap",
      text: "Mohon isi semua field wajib sebelum melanjutkan.",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      customClass: {
        popup: "text-sm",
        confirmButton: "w-32",
      },
    });
    return;
  }

  // ✅ Konfirmasi sebelum simpan
  const result = await Swal.fire({
    title: "<span>Yakin ingin menambahkan transaksi baru ?</span>",
    text: "Pastikan semua data sudah benar.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Simpan",
    cancelButtonText: "Batal",
    width: "420px",
    padding: "1.5em",
    customClass: {
      popup: "text-sm",
      confirmButton: "w-32 text-sm py-2",
      cancelButton: "w-32 text-sm py-2",
      title: "text-base font-semibold leading-snug",
    },
  });

  if (result.isConfirmed) {
    try {
      const existingData =
        JSON.parse(localStorage.getItem("transaksiData") || "[]") || [];

      // Buat ID transaksi unik
      const nextId = `TR${dayjs().format("DDMMYYYY")}${String(
        existingData.length + 1
      ).padStart(3, "0")}`;

      const newData = { idTransaksi: nextId, ...formData };

      // Simpan ke LocalStorage
      localStorage.setItem(
        "transaksiData",
        JSON.stringify([...existingData, newData])
      );

      toast.success(
        <div>
          <strong>Sukses !</strong>
          <div>Transaksi berhasil ditambahkan!</div>
        </div>
      );

      // Redirect ke halaman tambah detail transaksi
      setTimeout(() => {
        const encryptedId = encryptData(nextId); // contoh sederhana encrypt
        navigate(`/tambahdetailTransaksi/${encryptedId}`);
      }, 1000);
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
              onClick={() => navigate("/transaksi")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Penjualan Produk •{" "}
            </span>
            Tambah Data Penjualan
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <TiShoppingCart className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Data Penjualan Produk
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Lengkapi informasi berikut untuk menambahkan data transaksi penjualan produk.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputElement
                  inputClass="mb-4"
                  forwhat="namaPembeli"
                  labelMessage="Nama Pembeli"
                  typeInput="text"
                  inputName="namaPembeli"
                  inputPlaceholder="Masukkan nama pembeli"
                  value={formData.namaPembeli}
                  onChange={handleInputChange}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="nomorHandphone"
                  labelMessage="Nomor Handphone"
                  typeInput="text"
                  inputName="nomorHandphone"
                  inputPlaceholder="Masukkan nomor HP"
                  value={formData.nomorHandphone}
                  onChange={handleInputChange}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="alamat"
                  labelMessage="Alamat"
                  typeInput="text"
                  inputName="alamat"
                  inputPlaceholder="Masukkan alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                />

                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="kanalTransaksi"
                  labelMessage="Transaksi Melalui"
                  placeholder="Pilih kanal transaksi"
                  options={[
                    { value: "whatsapp", label: "WhatsApp" },
                    { value: "langsung", label: "Langsung" },
                    { value: "telepon", label: "Telepon" },
                  ]}
                  onChange={(opt) =>
                    setFormData((prev) => ({ ...prev, kanalTransaksi: opt?.value || "" }))
                  }
                  value={formData.kanalTransaksi}
                />

                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="metodePembayaran"
                  labelMessage="Metode Pembayaran"
                  placeholder="Pilih metode pembayaran"
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "transfer", label: "Transfer" },
                    { value: "QRIS", label: "QRIS" },
                  ]}
                  onChange={(opt) =>
                    setFormData((prev) => ({ ...prev, metodePembayaran: opt?.value || "" }))
                  }
                  value={formData.metodePembayaran}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="tanggalTransaksi"
                  labelMessage="Tanggal Transaksi"
                  typeInput="date"
                  inputName="tanggalTransaksi"
                  format="DD-MM-YYYY" // tampilannya
                  inputPlaceholder="Pilih tanggal transaksi"
                  value={formData.tanggalTransaksi ? dayjs(formData.tanggalTransaksi, "YYYY-MM-DD") : null}
                  onChange={(_date, _dateString) => {
                    if (_date) {
                      setFormData((prev) => ({ ...prev, tanggalTransaksi: _date.format("YYYY-MM-DD") }));
                    } else {
                      setFormData((prev) => ({ ...prev, tanggalTransaksi: "" }));
                    }
                  }}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="biayaKirim"
                  labelMessage="Biaya Kirim"
                  typeInput="number"
                  inputName="biayaKirim"
                  inputPlaceholder="Masukkan biaya kirim"
                  value={formData.biayaKirim}
                  onChange={handleInputChange}
                />

                <SearchableSelect
                  inputClass="mb-4"
                  forwhat="status"
                  labelMessage="Status"
                  placeholder="Pilih status"
                  options={[
                    { value: "dalam proses", label: "Dalam Proses" },
                    { value: "dikirim ", label: " Dikirim" },
                    { value: "selesai", label: "Selesai" },
                    { value: "batal", label: "Batal" },
                  ]}
                  onChange={(opt) => setFormData((prev) => ({ ...prev, status: opt?.value || "" }))}
                  value={formData.status}
                />
              </div>

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

export default TambahDataPenjualan;
