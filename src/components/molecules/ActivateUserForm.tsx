import { FC, useEffect, useRef, useState } from "react";
import InputElement from "../atoms/InputElementWhite";
import Button from "../atoms/Button";
import { Helmet } from "react-helmet";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons'; 
// import { HandleActivateAccount } from "../hooks/HandleResendActivation";
// import { useParams } from "react-router-dom";

// import { useDispatch } from 'react-redux'; 
// import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import GlassPanel from "../atoms/GlassPanel";
import BackToLogin from "../atoms/BackToLogin";
 
const appName = import.meta.env.NEXT_PUBLIC_APP_NAME;

const ActivateUserForm: FC = () => {
 
  const [activateAccountFailed, setactivateAccountFailed] = useState<string>("");
  const [loading, _setLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (activateAccountFailed) {
      timer = setTimeout(() => {
        setactivateAccountFailed("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [activateAccountFailed]);

  //  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     setLoading(true);
  //     dispatch(loginStart());

  //     const kode_aktivasi = event.currentTarget.kode_aktivasi.value;
      
  //     try {
  //         // Langkah pertama: Aktivasi akun
  //         const result = await HandleActivateAccount(uid ?? "", kode_aktivasi); 
  //         if(result.status === 'success'){
  //           const userData = await handleLoginAfterActivation(uid ?? ""); 
  //           if(userData.success) {

  //             // Menentukan kategori user untuk redirect
  //             const userKategori = userData.user?.kategori;

  //             // Dispatch login sukses
  //             dispatch(loginSuccess(userData.user?.name));

  //             // Menampilkan notifikasi sukses
  //             notification.success({
  //                 message: "Aktivasi Akun Berhasil!",
  //                 description: "Mohon tunggu beberapa saat!",
  //             });

  //             // Redirect berdasarkan kategori user
  //             setTimeout(() => {
  //                 window.location.href = userKategori === 'user' ? '/home' : '/portal'; 
  //             }, 1000);  
  //           } else {
  //               notification.error({
  //                 message: "Aktivasi Akun Gagal!",
  //                 description: "Mohon maaf, Ada kesalahan kredensial",
  //             });
  //           }
  //         }
  //         // Langkah kedua: Login setelah aktivasi berhasil
  //         else {
  //            notification.error({
  //               message: "Aktivasi Akun Gagal!",
  //               description: "Mohon maaf, Ada kesalahan kredensial",
  //           });
  //         }
  //     } catch (error: any) {
  //         // Menangani error
  //         dispatch(loginFailure());
  //         setactivateAccountFailed("Invalid credentials");
  //         notification.error({
  //             message: "Aktivasi Akun Gagal!",
  //             description: "Mohon maaf, Kode Aktivasi Anda tidak valid!",
  //         });
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'blue' }} spin />;

  return (
  <section>
  <Helmet>
    <title>{appName}</title>
  </Helmet>
  <div className="pt-24 sm:pt-24 sm:mb-20 md:pt-6 lg:pt-6 flex flex-col lg:flex-row justify-between items-center min-h-screen px-4 md:px-8">
    <div className="sm:pl-0 md:pl-0 lg:pl-10 pt-2 sm:pt-2 md:pt-16 lg:pt-6 mr-0 lg:mr-24 md:mr-0 sm:mr-0 text-center lg:text-left mb-8 lg:mb-0">
      <h1 className="text-6xl font-bold text-white"><span className="text-amber-400">Trash</span>ure</h1>
      <h3 className="text-xl text-white">MENGUBAH SAMPAH MENJADI BERKAH</h3>
    </div>

    {/* Bagian Kanan: Panel resendActivation */}
    <GlassPanel className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
      <div className="w-full md:w-1/2 md:pr-4">
        <h1 className="text-4xl font-bold text-white text-center pb-[30px] mt-10">Activate Account</h1>
        <form className="content-center">
          <InputElement
            inputClass="mb-6"
            forwhat="kode_aktivasi"
            labelMessage="Activation Code"
            typeInput="text"
            inputName="kode_aktivasi"
            inputPlaceholder="6 digit number"
            ref={usernameRef}
          />
          <Button
            type="submit"
            variant="bg-green-700 w-full hover:bg-green-900"
            message="Activate Account"
            disabled={loading}
          />
        </form>
        <p className="text-white mt-4 text-center">Check the activation code in your email.
        </p>
        <BackToLogin />
        {loading && (
          <div className="flex justify-center items-center mt-2">
            <Spin indicator={loadingIndicator} />
          </div>
        )}
        {activateAccountFailed && (
          <p className="text-red-500 mt-4 text-center">{activateAccountFailed}</p>
        )}
      </div>

      {/* Bagian Gambar */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <img
          src="/assets/img/resendActivation.png"
          alt="activateAccount illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
   </GlassPanel>
  </div>
</section>

  );
};

export default ActivateUserForm;
