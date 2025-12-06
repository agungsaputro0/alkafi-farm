import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "../atoms/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (detail: any) => void;
}

const TambahPenugasanModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState({
    jenisPakan: "",
    targetPemberian: "",
    kelompokTernak: "",
    jamMulai: "",
    jamSelesai: "",
    catatan: "",
    petugas: [] as string[],
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePetugasChange = (value: string) => {
    const arr = value.split(",").map((v) => v.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, petugas: arr }));
  };

  const handleSubmit = () => {
    if (!form.jenisPakan || !form.kelompokTernak || !form.jamMulai) {
      alert("Harap isi data utama terlebih dahulu.");
      return;
    }

    onSubmit(form);
    onClose();

    // Reset form
    setForm({
      jenisPakan: "",
      targetPemberian: "",
      kelompokTernak: "",
      jamMulai: "",
      jamSelesai: "",
      catatan: "",
      petugas: [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-orange-900">Tambah Penugasan</h2>
          <FaTimes className="cursor-pointer text-gray-600" onClick={onClose} />
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm text-gray-600">Jenis Pakan</label>
            <input
              name="jenisPakan"
              value={form.jenisPakan}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: Rumput Segar"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Target Pemberian</label>
            <input
              name="targetPemberian"
              value={form.targetPemberian}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: 8 kg per ekor"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Kelompok Ternak</label>
            <input
              name="kelompokTernak"
              value={form.kelompokTernak}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: Sapi Kandang KD001"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Jam Mulai</label>
              <input
                type="time"
                name="jamMulai"
                value={form.jamMulai}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Jam Selesai</label>
              <input
                type="time"
                name="jamSelesai"
                value={form.jamSelesai}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Catatan</label>
            <textarea
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Catatan tambahan..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Petugas (Pisahkan dengan koma)</label>
            <input
              value={form.petugas.join(", ")}
              onChange={(e) => handlePetugasChange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Contoh: PG006, PG009"
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-full"
            onClick={onClose}
          >
            Batal
          </Button>

          <Button
            variant="bg-orange-800 hover:bg-orange-900 text-white px-5 py-2 rounded-full"
            onClick={handleSubmit}
          >
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TambahPenugasanModal;
