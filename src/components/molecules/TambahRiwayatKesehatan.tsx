import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import InputElement from "../atoms/InputElement";
import SearchableSelect from "../atoms/SearchAbleSelectElement";
import hewanTernakData from "../pseudo_db/hewanternak.json";
import obatData from "../pseudo_db/obatdansuplemen.json";
import satuanObatData from "../pseudo_db/satuanobatdansuplemen.json";
import { Modal, Tooltip } from "antd";
import dayjs from "dayjs";
import { FaPills } from "react-icons/fa6";
import { FaPlus, FaTrash } from "react-icons/fa";
  import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { decryptData } from "../utils/Encryptor";


interface ObatForm {
  namaObat: string;
  dosis: number;
  satuan: string;
  frekuensi: number;
  peruntukan: string;
  catatan?: string;
}

const TambahRiwayatKesehatan = () => {
  const { neckTag } = useParams<{ neckTag: string }>();
  const navigate = useNavigate();

  // Form utama
  const [formData, setFormData] = useState({
    tanggalPemeriksaan: "",
    diagnosa: "",
    gejala: "",
    tindakan: "",
    catatan: "",
  });

  // Obat
  const [obatList, setObatList] = useState<ObatForm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [obatForm, setObatForm] = useState<ObatForm>({
    namaObat: "",
    dosis: 0,
    satuan: "",
    frekuensi: 0,
    peruntukan: "",
    catatan: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleObatChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setObatForm((prev) => ({ ...prev, [name]: name === "dosis" || name === "frekuensi" ? Number(value) : value }));
  };

  const handleObatSelect = (selected: any) => {
    setObatForm((prev) => ({ ...prev, namaObat: selected?.value || "" }));
  };

  const handleSatuanSelect = (selected: any) => {
    setObatForm((prev) => ({ ...prev, satuan: selected?.value || "" }));
  };

  const getNamaSatuan = (id: string) =>
      satuanObatData.find((r) => r.idSatuan === id)
        ?.namaSatuan || "-";

  const saveObat = () => {
    setObatList([...obatList, obatForm]);
    setObatForm({
      namaObat: "",
      dosis: 0,
      satuan: "",
      frekuensi: 0,
      peruntukan: "",
      catatan: "",
    });
    setModalVisible(false);
  };

  const getHewanTernakId = (neckTag: string) =>
      hewanTernakData.find(
        (r) => r.kodeNeckTag === neckTag
      )?.idHewanTernak || "-";

  const obatOptions = [
    { value: "", label: "Pilih Obat" },
    ...obatData.map((o: any) => ({ value: o.namaProduk, label: o.namaProduk })),
  ];

  const satuanObatOptions = [
    { value: "", label: "Pilih Obat" },
    ...satuanObatData.map((o: any) => ({ value: o.idSatuan, label: o.namaSatuan })),
  ];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Validasi field wajib
  const requiredFields: (keyof typeof formData)[] = [
    "tanggalPemeriksaan",
    "diagnosa",
    "gejala",
    "tindakan",
  ];

  const isValid = requiredFields.every((field) => formData[field].trim() !== "");

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

  // ✅ Konfirmasi jika obatList kosong
  if (obatList.length === 0) {
    const confirmObatEmpty = await Swal.fire({
      icon: "question",
      title: "Obat belum ditambahkan",
      text: "Apakah Anda yakin ingin menyimpan tanpa obat?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (!confirmObatEmpty.isConfirmed) return;
  }

  // ✅ Konfirmasi sebelum simpan
  const result = await Swal.fire({
    title: "Yakin ingin menyimpan Riwayat Kesehatan?",
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
      // Ambil data lama dari LocalStorage
      const existingData =
        JSON.parse(localStorage.getItem("RiwayatKesehatanBaru") || "[]") || [];

      // Buat ID unik seperti pseudodb
      let nextId = "RK016";
      if (existingData.length > 0) {
        const lastItem = existingData[existingData.length - 1];
        const lastId = lastItem.idRiwayatKesehatanTernak || "RK015";
        const nextNumber = parseInt(lastId.replace("RK", "")) + 1;
        nextId = `RK${String(nextNumber).padStart(3, "0")}`;
      }

      const newData = {
        idRiwayatKesehatanTernak: nextId,
        idHewanTernak: getHewanTernakId(decryptData(neckTag || "")),
        ...formData,
        tanggalPemeriksaan: dayjs(formData.tanggalPemeriksaan).format("YYYY-MM-DD"),
        obatList,
        perekam: neckTag, // sesuai konteks awal
        waktuRekam: new Date().toISOString(),
      };

      localStorage.setItem(
        "RiwayatKesehatanBaru",
        JSON.stringify([...existingData, newData])
      );

      toast.success(
        <div>
          <strong>Sukses!</strong>
          <div>Riwayat kesehatan berhasil disimpan.</div>
        </div>
      );

      setTimeout(() => navigate(-1), 1200);
    } catch (error) {
      toast.error(
        <div>
          <strong>Gagal menyimpan!</strong>
          <div>Cek kembali data Anda.</div>
        </div>
      );
    }
  }
};


  const handleDeleteObat = (index: number) => {
    Modal.confirm({
      title: "Hapus Obat",
      content: "Apakah kamu yakin ingin menghapus obat ini?",
      okText: "Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk: () => {
        setObatList((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };


  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/repository")}>Hewan Ternak • </span>
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/kesehatan")}>Kesehatan Ternak • </span>
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate(-1)}>Kesehatan Ternak • </span>
            Tambah Riwayat
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <FaPills className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Riwayat Kesehatan
                </h2>
                <p className="text-sm text-[#724e3a]">Lengkapi informasi pemeriksaan hewan ternak.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputElement
                inputClass="mb-4"
                forwhat="tanggalPemeriksaan"
                labelMessage="Tanggal Pemeriksaan"
                typeInput="date"
                inputName="tanggalPemeriksaan"
                inputPlaceholder="Pilih tanggal pemeriksaan"
                format="DD-MM-YYYY" // tampilannya
                value={formData.tanggalPemeriksaan ? dayjs(formData.tanggalPemeriksaan, "YYYY-MM-DD") : null} // parse dari YYYY-MM-DD
                onChange={(_date, _dateString) => {
                  if (_date) {
                    // simpan dalam YYYY-MM-DD
                    setFormData((prev) => ({
                      ...prev,
                      tanggalPemeriksaan: _date.format("YYYY-MM-DD"),
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      tanggalPemeriksaan: "",
                    }));
                  }
                }}
              />
                <InputElement
                  forwhat="diagnosa"
                  labelMessage="Diagnosa"
                  typeInput="text"
                  inputName="diagnosa"
                  inputPlaceholder="Diagnosa"
                  value={formData.diagnosa}
                  onChange={handleInputChange}
                />
                <InputElement
                  forwhat="gejala"
                  labelMessage="Gejala"
                  typeInput="text"
                  inputName="gejala"
                  inputPlaceholder="Gejala"
                  value={formData.gejala}
                  onChange={handleInputChange}
                />
                <InputElement
                  forwhat="tindakan"
                  labelMessage="Tindakan"
                  typeInput="text"
                  inputName="tindakan"
                  inputPlaceholder="Tindakan"
                  value={formData.tindakan}
                  onChange={handleInputChange}
                />
                <div className="col-span-2">
                  <label className="text-gray-800 font-semibold block mb-1">Catatan (Opsional)</label>
                  <textarea
                    name="catatan"
                    placeholder="Catatan tambahan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-gray-500 px-2 py-2 bg-transparent focus:border-gray-800"
                  />
                </div>
              </div>

              {/* Tombol Tambah Obat */}
              <div className="flex justify-end mt-4 mb-6">
                <Button type="button" variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-4 py-2 rounded-md flex gap-2 items-center" onClick={() => setModalVisible(true)}>
                  <FaPlus /> Tambah Obat
                </Button>
              </div>

              {/* Table Obat */}
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                    <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                        <tr>
                        <th className="p-3 border">No</th>
                        <th className="p-3 border">Obat</th>
                        <th className="p-3 border">Dosis</th>
                        <th className="p-3 border">Satuan</th>
                        <th className="p-3 border">Frekuensi</th>
                        <th className="p-3 border">Peruntukan</th>
                        <th className="p-3 border">Catatan</th>
                        <th className="p-3 border">Aksi</th>
                        </tr>
                    </thead>
                <tbody>
                    {obatList.length > 0 ? (
                    obatList.map((o, idx) => (
                        <tr key={idx} className="text-center hover:bg-[#fff8ef] transition-colors duration-150">
                        <td className="p-3 border">{idx + 1}</td>
                        <td className="p-3 border">{o.namaObat}</td>
                        <td className="p-3 border">{o.dosis}</td>
                        <td className="p-3 border">{getNamaSatuan(o.satuan)}</td>
                        <td className="p-3 border">{o.frekuensi}</td>
                        <td className="p-3 border">{o.peruntukan}</td>
                        <td className="p-3 border">{o.catatan || "-"}</td>
                        <td className="p-3 border">
                            <Tooltip title="Hapus Data">
                                <button onClick={() => handleDeleteObat(idx)} type="button" className="bg-red-600 hover:bg-red-600/80 text-white p-2 rounded-md transition">
                                    <FaTrash />
                                </button>
                            </Tooltip>
                         </td>
                        </tr>
                    ))
                    ) : (
                    <tr className="text-center">
                        <td className="p-3 border" colSpan={8}>
                        <span className="inline-flex items-center justify-center gap-2 text-gray-400">
                            <FaPills className="text-4xl" />
                             Belum ada data obat
                        </span>
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>

              </div>

              <div className="flex justify-end mt-20">
                <Button type="submit" variant="bg-farmbrown hover:bg-farmdarkestbrown text-white px-8 py-3 w-full rounded-full shadow-md transition">
                  Simpan
                </Button>
              </div>
            </form>

            {/* Modal Tambah Obat */}
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null} // hilangkan footer default
                width={700}   // perbesar modal
                bodyStyle={{ padding: "0.2rem" }} // optional: tambah padding
                title={
                    <h2 className="text-xl border-b pb-2 font-bold text-farmdarkestbrown">
                    Tambah Obat
                    </h2>
                }
                >
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <SearchableSelect
                    inputClass="mb-2"
                    forwhat="namaObat"
                    labelMessage="Nama Obat"
                    placeholder="Pilih Obat"
                    options={obatOptions}
                    onChange={handleObatSelect}
                    value={obatForm.namaObat}
                    />
                    <InputElement
                    inputClass="mb-2"
                    forwhat="dosis"
                    labelMessage="Dosis"
                    typeInput="number"
                    inputName="dosis"
                    inputPlaceholder="Dosis"
                    value={obatForm.dosis}
                    onChange={handleObatChange}
                    />
                    <SearchableSelect
                    inputClass="mb-2"
                    forwhat="satuan"
                    labelMessage="Satuan"
                    placeholder="Pilih Satuan"
                    options={satuanObatOptions}
                    onChange={handleSatuanSelect}
                    value={obatForm.satuan}
                    />
                    <InputElement
                    inputClass="mb-2"
                    forwhat="frekuensi"
                    labelMessage="Frekuensi Pemberian"
                    typeInput="number"
                    inputName="frekuensi"
                    inputPlaceholder="Frekuensi"
                    value={obatForm.frekuensi}
                    onChange={handleObatChange}
                    />
                    <div>
                    <label className="text-gray-800 font-semibold block mb-1">Peruntukan Obat</label>
                    <textarea
                        name="peruntukan"
                        placeholder="Peruntukan Obat"
                        value={obatForm.peruntukan}
                        onChange={handleObatChange}
                        className="w-full border-b-2 border-gray-500 px-2 py-2 bg-transparent focus:border-gray-800"
                    />
                    </div>
                    <div>
                    <label className="text-gray-800 font-semibold block mb-1">Catatan (Opsional)</label>
                    <textarea
                        name="catatan"
                        placeholder="Catatan tambahan"
                        value={obatForm.catatan}
                        onChange={handleObatChange}
                        className="w-full border-b-2 border-gray-500 px-2 py-2 bg-transparent focus:border-gray-800"
                    />
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-center">
                    <button
                    type="button"
                    onClick={saveObat}
                    className="w-full bg-farmbrown text-white py-2 mt-4 rounded-full text-lg font-semibold hover:bg-farmdarkestbrown transition"
                    >
                    Simpan
                    </button>
                </div>
                </Modal>

          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default TambahRiwayatKesehatan;
