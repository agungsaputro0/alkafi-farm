import { FC, useEffect, useState } from "react";
import InputElement from "../atoms/InputElement";
import SelectElement from "../atoms/SelectElement";
import Button from "../atoms/Button";
import { notification, Spin } from "antd";
import { LeftOutlined } from '@ant-design/icons'; 
import { Checkbox } from 'antd';
import { useFetchUserByUid, useFetchGroups } from "../hooks/HandleUser";
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchKategori } from "../hooks/HandleUser";
import { LoadingOutlined } from "@ant-design/icons";
import { handleUpdateUser } from "../hooks/HandleUser";

const UpdateUserForm: FC = () => {
    const [role, setRole] = useState<string>("");
    const [tipeDebitur, _setTipeDebitur] = useState<string>('Perusahaan');
    const [crashProgram, _setCrashProgram] = useState<string>('Tidak');
    const [tipeAkun, setTipeAkun] = useState<string>("");
    const [selectedEsl4, setSelectedEsl4] = useState<string>('');
    const [statusAktivasi, setStatusAktivasi] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { kategori } = useFetchKategori();
    const [formData, setFormData] = useState({
      nama: '',
      nip: '',
      nik: '',
      email: '',
      password: '',
      kontak: '',
      jabatan: '',
      keterangan: '',
      esl4: '',
      alamat_debitur: '',
      npwp_debitur: '',
      nama_debitur: '',
      email_debitur: '',
      alamat_kreditur: '',
      nama_kreditur: '',
      email_kreditur: '',
      npwp_kreditur: ''
    });
  
    const { tipe, uid } = useParams<{ tipe: string, uid: string }>();
    const navigate = useNavigate(); 
  
    // Fetch user data using UID and tipe
    const { user, loading: userLoading } = useFetchUserByUid(tipe || '', uid || '');
    const { groups } = useFetchGroups(tipe || '');
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]); 
    const handleGroupChange = (checkedValues: any) => {
      setSelectedGroups(checkedValues);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSelectChange = (value: string) => {
      setSelectedEsl4(value); 
      setFormData((prevData) => ({
        ...prevData,
        esl4: value, 
      }));
    };
  
    const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;
  
    const formattedOptions = [
      { value: '', label: 'Klik Disini' },
      ...kategori.map((item) => ({
        value: item.kategori_id.toString(),
        label: item.nama,
      })),
    ];
  
    useEffect(() => {
      if (user && user.data && user.data.PegawaiPNS) {
        setSelectedEsl4(user.data.PegawaiPNS.esl4 || '');
        setStatusAktivasi(user.data.PegawaiPNS.active ?? false);
        setRole("Pegawai");
        setTipeAkun("PNS");
        setFormData({
          nama: user.data.PegawaiPNS.nama || '',
          nip: user.data.PegawaiPNS.nip || '',
          nik: '', 
          email: user.data.PegawaiPNS.email || '',
          password: '',
          kontak: '', 
          jabatan: user.data.PegawaiPNS.jabatan || '',
          keterangan: '', 
          esl4: user.data.PegawaiPNS.esl4 || '',
          alamat_debitur: '',
          npwp_debitur: '',
          nama_debitur: '',
          email_debitur: '',
          alamat_kreditur: '',
          nama_kreditur: '',
          email_kreditur: '',
          npwp_kreditur: ''
        });
        setSelectedGroups(user.data.PegawaiPNS.auth || []);
      } else if (user && user.data && user.data.PegawaiNonPNS) {
        setStatusAktivasi(user.data.PegawaiNonPNS.active ?? false);
        setRole("Pegawai");
        setTipeAkun("Non PNS");
        setFormData({
          nama: user.data.PegawaiNonPNS.nama || '',
          nip: '',
          nik: user.data.PegawaiNonPNS.nik || '', 
          email: user.data.PegawaiNonPNS.email || '',
          password: '',
          kontak: user.data.PegawaiNonPNS.kontak || '', 
          jabatan: '',
          keterangan: user.data.PegawaiNonPNS.keterangan || '', 
          esl4: '',
          alamat_debitur: '',
          npwp_debitur: '',
          nama_debitur: '',
          email_debitur: '',
          alamat_kreditur: '',
          nama_kreditur: '',
          email_kreditur: '',
          npwp_kreditur: ''
        });
        setSelectedGroups(user.data.PegawaiNonPNS.auth || []);
      } else {
        setFormData({
          nama: '',
          nip: '',
          nik: '',
          email: '',
          password: '',
          kontak: '',
          jabatan: '',
          keterangan: '',
          esl4: '',
          alamat_debitur: '',
          npwp_debitur: '',
          nama_debitur: '',
          email_debitur: '',
          alamat_kreditur: '',
          nama_kreditur: '',
          email_kreditur: '',
          npwp_kreditur: ''
        });
        setSelectedGroups([]);
      }
    }, [user]);
    
    if (userLoading) {
      return <Spin size="large" />;
    }
    
    const validateForm = () => {
      // Implementasikan logika validasi form
      return true;
    };
  
    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!validateForm()) return; // Pastikan form valid sebelum melanjutkan
  
      setLoading(true); // Set loading state to true
  
      try {
        const message = await handleUpdateUser(uid || '', role, tipeDebitur, crashProgram, tipeAkun, selectedEsl4, formData, statusAktivasi, selectedGroups);
  
        notification.success({
          message: "Perubahan User Berhasil!",
          description: message, 
        });
  
        setTimeout(() => {
          navigate('/Users');
        }, 1000);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat memperbarui pengguna."; // Tangani kesalahan
        notification.error({
          message: "Perubahan Pengguna Gagal!",
          description: errorMessage, 
        });
      } finally {
        setLoading(false); 
      }
    };

  return (
    <section>
      <div className="pt-16 flex justify-center mb-20" style={{ paddingLeft: '80px' }}>
        <div className="bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full max-w-full">
          <div className="flex justify-between items-center mb-[25px]">
            <h1 className="text-4xl font-bold text-gray-800 text-left mb-[25px]">Update User</h1>
            <Button message="" onClick={() => navigate("/Users")} variant="bg-blue-500 text-white sm:h-[35px] h-[35px] mt-[-25px]"><LeftOutlined /> Kembali</Button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <InputElement
                inputClass="mb-6"
                forwhat="nama"
                labelMessage="Nama"
                typeInput="text"
                inputName="nama"
                inputPlaceholder="Masukkan Nama Anda"
                value={formData.nama}
                readOnly
              />
              <SelectElement
                inputClass="mb-6"
                forwhat="role" 
                labelMessage="Pilih Role"
                id="role"
                name="role"
                value={role}
                options={[
                  { value: '', label: 'Klik Disini' },
                  { value: 'Pegawai', label: 'Pegawai' },
                  { value: 'Debitur', label: 'Debitur' },
                  { value: 'Kreditur', label: 'Kreditur' },
                ]}
              />
            </div>
            {role !== '' && (
            <>
            {role === 'Pegawai' && (
              <>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  <SelectElement
                    inputClass="mb-6"
                    forwhat="tipe_pegawai" 
                    labelMessage="Tipe Pegawai" 
                    id="tipe_pegawai"
                    name="tipe_pegawai"
                    value={tipeAkun}
                    options={[
                      { value: '', label: 'Klik Disini' },
                      { value: 'PNS', label: 'PNS' },
                      { value: 'Non PNS', label: 'Non PNS' },
                    ]}
                  />
               {tipeAkun === 'PNS' && (
                  <InputElement
                    inputClass="mb-6"
                    forwhat="jabatan"
                    labelMessage="Jabatan"
                    typeInput="text"
                    inputName="jabatan"
                    inputPlaceholder="Masukkan Jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                  />
                )}
                {tipeAkun === 'Non PNS' && (
                  <InputElement
                    inputClass="mb-6"
                    forwhat="keterangan"
                    labelMessage="keterangan"
                    typeInput="text"
                    inputName="keterangan"
                    inputPlaceholder="Masukkan Keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                  />
                )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {tipeAkun === 'Non PNS' && (
                    <InputElement
                        inputClass="mb-6"
                        forwhat="nik"
                        labelMessage="NIK / Passport ID"
                        typeInput="text"
                        inputName="nik"
                        inputPlaceholder="Masukkan NIK / Passport"
                        value={formData.nik}
                        onChange={handleChange}
                      />
                  )}
                  {tipeAkun === 'PNS' && (
                    <InputElement
                        inputClass="mb-6"
                        forwhat="nip"
                        labelMessage="NIP"
                        typeInput="text"
                        inputName="nip"
                        inputPlaceholder="Masukkan NIP"
                        value={formData.nip}
                        onChange={handleChange}
                      />
                  )}
                  {(tipeAkun === 'Non PNS' || tipeAkun === 'PNS') && (
                  <InputElement
                    inputClass="mb-6"
                    forwhat="email"
                    labelMessage="Email"
                    typeInput="text"
                    inputName="email"
                    inputPlaceholder="example@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                   )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {tipeAkun === 'Non PNS' && (
                  <InputElement
                      inputClass="mb-6"
                      forwhat="kontak"
                      labelMessage="Nomor Kontak"
                      typeInput="text"
                      inputName="kontak"
                      inputPlaceholder="Masukkan Nomor Kontak"
                      value={formData.kontak}
                      onChange={handleChange}
                    />
                  )}
                  {tipeAkun === 'PNS' && (
                    <SelectElement
                      inputClass="mb-6"
                      forwhat="esl4" 
                      labelMessage="Eselon 4" 
                      id="esl4"
                      name="esl4"
                      value={formData.esl4}
                      onChange={(e) => handleSelectChange(e.target.value)}
                      options={formattedOptions}
                    />
                  )}
                  {(tipeAkun === 'Non PNS' || tipeAkun === 'PNS') && (
                    <InputElement
                      inputClass="mb-6"
                      forwhat="password"
                      labelMessage="Password"
                      typeInput="password"
                      inputName="password"
                      inputPlaceholder="****"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  )}
                  </div>
                </>
            )}

            {/* Conditional Fields for Kreditur */}
            {role === 'Kreditur' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputElement
                        inputClass="mb-6"
                        forwhat="nik"
                        labelMessage="NIK / Passport ID"
                        typeInput="text"
                        inputName="nik"
                        inputPlaceholder="Masukkan NIK / Passport"
                        value={formData.nik}
                        onChange={handleChange}
                      />
                <InputElement
                    inputClass="mb-6"
                    forwhat="email"
                    labelMessage="Email"
                    typeInput="text"
                    inputName="email"
                    inputPlaceholder="example@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <InputElement
                      inputClass="mb-6"
                      forwhat="password"
                      labelMessage="Password"
                      typeInput="password"
                      inputName="password"
                      inputPlaceholder="****"
                      value=""
                      onChange={handleChange}
                    />
                <InputElement
                  inputClass="mb-6"
                  forwhat="nama_kreditur"
                  labelMessage="Nama Entitas Kreditur"
                  typeInput="text"
                  inputName="nama_kreditur"
                  inputPlaceholder="Masukkan Nama Kreditur"
                  value={formData.nama_kreditur}
                  onChange={handleChange}
                />
                <InputElement
                  inputClass="mb-6"
                  forwhat="alamat_kreditur"
                  labelMessage="Alamat Entitas Kreditur"
                  typeInput="text"
                  inputName="alamat_kreditur"
                  inputPlaceholder="Masukkan Alamat Kreditur"
                  value={formData.alamat_kreditur}
                  onChange={handleChange}
                />
                <InputElement
                  inputClass="mb-6"
                  forwhat="email_kreditur"
                  labelMessage="Email Entitas Kreditur"
                  typeInput="text"
                  inputName="email_kreditur"
                  inputPlaceholder="Masukkan Email Kreditur"
                  value={formData.email_kreditur}
                  onChange={handleChange}
                />
                <InputElement
                  inputClass="mb-6"
                  forwhat="npwp_kreditur"
                  labelMessage="NPWP Entitas Kreditur"
                  typeInput="text"
                  inputName="npwp_kreditur"
                  inputPlaceholder="Masukkan NPWP Kreditur"
                  value={formData.npwp_kreditur}
                  onChange={handleChange}
                />
                <InputElement
                      inputClass="mb-6"
                      forwhat="kontak"
                      labelMessage="Nomor Kontak Anda"
                      typeInput="text"
                      inputName="kontak"
                      inputPlaceholder="Masukkan Nomor Kontak"
                      value={formData.kontak}
                      onChange={handleChange}
                    />
              </div>
            )}
            </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <SelectElement
                inputClass="mb-6"
                forwhat="status_aktivasi"
                labelMessage="Status Aktivasi"
                id="status_aktivasi"
                name="status_aktivasi"
                value={statusAktivasi ? 'aktif' : 'inaktif'}
                onChange={(e) => setStatusAktivasi(e.target.value === 'aktif')}
                options={[
                  { value: 'inaktif', label: 'Tidak Aktif' },
                  { value: 'aktif', label: 'Aktif' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div className="mb-6">
          <h2 className="text-gray-800 font-semibold pb-4">Pilih Role</h2>
          <Checkbox.Group onChange={handleGroupChange} value={selectedGroups}>
            <div className="flex flex-col space-y-2">
              {groups.map((group) => (
                <div 
                  key={group.id} 
                  className={`border p-2 rounded ${selectedGroups.includes(group.id) ? 'border-blue-500' : 'border-gray-800'}`} 
                  onClick={() => {
                    const newSelectedGroups = selectedGroups.includes(group.id)
                      ? selectedGroups.filter(id => id !== group.id) 
                      : [...selectedGroups, group.id]; 
                    setSelectedGroups(newSelectedGroups);
                    handleGroupChange(newSelectedGroups);
                  }}
                >
                  <Checkbox value={group.id} checked={selectedGroups.includes(group.id)} onChange={() => {}}>
                    <b>{group.name}</b> - {group.description}
                  </Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </div>
            <Button
              message={loading ? "Loading..." : "Update User"} 
              variant="bg-blue-700 w-full hover:bg-blue-900"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spin indicator={loadingIndicator} /> : null} 
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateUserForm;
