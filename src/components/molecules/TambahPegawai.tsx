import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputElement from "../atoms/InputElement";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { encryptData } from "../utils/Encryptor";
import { RiUserAddLine } from "react-icons/ri";

const TambahPegawai = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaPegawai: "",
    email: "",
    nomorHandphone: "",
    jenisKelamin: "",
    alamat: "",
    role: 2, // default Pegawai
    password: "",
    rePassword: "",
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
      "namaPegawai",
      "email",
      "nomorHandphone",
      "jenisKelamin",
      "alamat",
      "role",
      "password",
      "rePassword",
    ];

    // Cek semua field wajib terisi
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
        customClass: { popup: "text-sm", confirmButton: "w-32" },
      });
      return;
    }

    if (formData.password !== formData.rePassword) {
      Swal.fire({
        icon: "error",
        title: "Password tidak sama",
        text: "Pastikan password dan re-password sama.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Yakin ingin menambahkan pegawai baru?",
      text: "Pastikan semua data sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
      width: "480px",
      padding: "1.5em",
    });

    if (result.isConfirmed) {
      try {
        const existingData =
          JSON.parse(localStorage.getItem("usersData") || "[]") || [];

       let nextId = "PG011";
        if (existingData.length > 0) {
            const last = existingData[existingData.length - 1];
            const nextNum = parseInt(last.idKatalog.replace("PG", "")) + 1;
            nextId = `PG${String(nextNum).padStart(3, "0")}`;
        }

        const newUser = {
          idPengguna: nextId,
          namaPengguna: formData.namaPegawai,
          email: formData.email,
          nomorHandphone: formData.nomorHandphone,
          jenisKelamin: formData.jenisKelamin,
          alamat: formData.alamat,
          idRole: formData.role,
          password: encryptData(formData.password),
        };

        localStorage.setItem(
          "usersData",
          JSON.stringify([...existingData, newUser])
        );

        toast.success(
          <div>
            <strong>Sukses!</strong>
            <div>Pegawai berhasil ditambahkan!</div>
          </div>
        );

        setTimeout(() => navigate("/hris"), 1000);
      } catch (error) {
        toast.error(
          <div>
            <strong>Gagal menyimpan!</strong>
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
              onClick={() => navigate("/hris")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Manajemen Pegawai •{" "}
            </span>
            Tambah Data Pegawai
          </p>
        </div>

        <WhiteSection>
          <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
              <RiUserAddLine className="text-6xl text-farmdarkestbrown" />
              <div>
                <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  Tambah Data Pegawai
                </h2>
                <p className="text-sm text-[#724e3a]">
                  Lengkapi informasi berikut untuk menambahkan data pegawai.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InputElement
                  inputClass="mb-4"
                  forwhat="namaPegawai"
                  labelMessage="Nama Pegawai"
                  typeInput="text"
                  inputName="namaPegawai"
                  inputPlaceholder="Masukkan nama pegawai"
                  value={formData.namaPegawai}
                  onChange={handleInputChange}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="email"
                  labelMessage="Email"
                  typeInput="email"
                  inputName="email"
                  inputPlaceholder="Masukkan email"
                  value={formData.email}
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

                {/* Jenis Kelamin */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Jenis Kelamin</label>
                  <div className="flex gap-4">
                    {["Laki-laki", "Perempuan"].map((jk) => (
                      <label key={jk} className="flex items-center gap-2">
                        <input
                          className="h-6 w-6 mt-2"
                          type="radio"
                          name="jenisKelamin"
                          value={jk}
                          checked={formData.jenisKelamin === jk}
                          onChange={handleInputChange}
                        />
                        {jk}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Alamat */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Alamat</label>
                  <textarea
                    name="alamat"
                    placeholder="Masukkan alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    className="w-full border-b-2 min-h-[36px] h-[36px] border-gray-500 text-sm px-2 py-2 bg-transparent focus:border-gray-800"
                  />
                </div>
                

                {/* Role */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Role</label>
                  <div className="flex gap-4">
                    {[
                      { label: "Admin", value: 1 },
                      { label: "Pegawai", value: 2 },
                      { label: "Pekerja", value: 3 },
                    ].map((r) => (
                      <label key={r.value} className="flex items-center gap-2">
                        <input
                          className="h-6 w-6 mt-2"
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={formData.role === r.value}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              role: Number(e.target.value),
                            }))
                          }
                        />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Password */}
                <InputElement
                  inputClass="mb-4"
                  forwhat="password"
                  labelMessage="Password"
                  typeInput="password"
                  inputName="password"
                  inputPlaceholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                />

                <InputElement
                  inputClass="mb-4"
                  forwhat="rePassword"
                  labelMessage="Re-password"
                  typeInput="password"
                  inputName="rePassword"
                  inputPlaceholder="Masukkan ulang password"
                  value={formData.rePassword}
                  onChange={handleInputChange}
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

export default TambahPegawai;
