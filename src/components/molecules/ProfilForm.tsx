import { FC, useEffect, useRef, useState } from "react";
import InputElement from "../atoms/InputElement";
import Button from "../atoms/Button";
import { Helmet } from "react-helmet";
import { notification, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons'; 
import { handleProfil as useProfile } from "../hooks/HandleProfil";

const appName = import.meta.env.VITE_APP_NAME; 

const ProfilForm: FC = () => {
  const { dataUser, loading, updateProfile, updateLoading } = useProfile();
  const [newPassword, setNewPassword] = useState<string>("");
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, [dataUser]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget as HTMLFormElement;
    const confirmPassword = (target.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (!confirmPassword) {
      notification.error({
        message: "Password Tidak Sesuai",
        description: "Konfirmasi password harus diisi.",
      });
      return;
    }

    const updatedData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value,
      nip: (target.elements.namedItem("nip") as HTMLInputElement).value,
      email: (target.elements.namedItem("email") as HTMLInputElement).value,
      konfirmasi_password: confirmPassword,
      new_password: newPassword || undefined,  
    };

    updateProfile(updatedData);
  };

  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

  return (
    <section>
      <Helmet>
        <title>{appName}</title>
      </Helmet>
      <div className="pt-16 md:pt-8 lg:pt-8 flex justify-center sm:mt-10 mb-20">
      <div className="bg-white/90 rounded-lg shadow-left-bottom border border-gray-400 p-6 space-y-4 w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl min-w-[300px] ml-[40px] mr-[40px]">
        <h1 className="text-4xl font-bold text-gray-800 text-left mb-[25px]">Profil</h1>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spin indicator={loadingIndicator} />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputElement
                inputClass="mb-6"
                forwhat="name"
                labelMessage="Nama"
                typeInput="text"
                inputName="name"
                inputPlaceholder="Nama Anda"
                defaultValue={dataUser?.name || ""}
                ref={nameRef}
                readOnly={true} 
              />
              <InputElement
                inputClass="mb-6"
                forwhat="nip"
                labelMessage="NIP"
                typeInput="text"
                inputName="nip"
                inputPlaceholder="NIP Anda"
                defaultValue={dataUser?.nip || ""}
                readOnly={true}
              />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <InputElement
                inputClass="mb-6"
                forwhat="password"
                labelMessage="Password Baru (Opsional)"
                typeInput="password"
                inputName="newPassword"
                inputPlaceholder="****"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputElement
                inputClass="mb-6"
                forwhat="confirmPassword"
                labelMessage="Konfirmasi Password Lama"
                typeInput="password"
                inputName="confirmPassword"
                inputPlaceholder="****"
              />
              </div>
              <Button
                type="submit"
                variant="bg-blue-700 w-full hover:bg-blue-900"
                message="Update"
                disabled={updateLoading}
              />
            </form>
          )}

          {updateLoading && (
            <div className="flex justify-center items-center mt-4">
              <Spin indicator={loadingIndicator} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilForm;
