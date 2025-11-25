import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputElement from "../atoms/InputElementWhite";
import Button from "../atoms/Button";
import { Helmet } from "react-helmet";
import { notification, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons'; 
import { HandleforgotPassword } from "../hooks/HandleForgotPassword";
import GlassPanel from "../atoms/GlassPanel";
import TitleAndSubtitle from "../atoms/TitleAndSubTitle";
import BackToLogin from "../atoms/BackToLogin";

const appName = import.meta.env.NEXT_PUBLIC_APP_NAME;

const ForgetPasswordForm: FC = () => {
  const [forgotPasswordFailed, setforgotPasswordFailed] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const perbaruiPassword = () => {
    navigate("/changePassword");
  };

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (forgotPasswordFailed) {
      timer = setTimeout(() => {
        setforgotPasswordFailed("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [forgotPasswordFailed]);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      const email = event.currentTarget.email.value;  // Ambil email dari form input

      try {
          const result = await HandleforgotPassword(email);

          // Menambahkan pengecekan apakah permintaan berhasil atau tidak
          if (result.success) {
              notification.success({
                  message: "Password reset request successful!",
                  description: "Please check your email for further instructions.",
              });
          } else {
              setforgotPasswordFailed(result.message);  // Menampilkan pesan kesalahan dari backend
              notification.error({
                  message: "Password Reset Request Failed!",
                  description: result.message || "We apologize, but we cannot find an account with that email address.",
              });
          }
      } catch (error: any) {
          // Menangani kesalahan jaringan atau kesalahan lainnya
          setforgotPasswordFailed("A network error has occurred or the server is unavailable.");
          notification.error({
              message: "Password Reset Request Failed!",
              description: "We apologize, but we are unable to connect to the server at this time. Please try again later.",
          });
      } finally {
          setLoading(false);
      }
  };


  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: 'blue' }} spin />;

  return (
  <section>
  <Helmet>
    <title>{appName}</title>
  </Helmet>
  <div className="pt-24 sm:pt-24 sm:mb-20 md:pt-6 lg:pt-6 flex flex-col lg:flex-row justify-between items-center min-h-screen px-4 md:px-8">
    <div className="sm:pl-0 md:pl-0 lg:pl-10 pt-2 sm:pt-2 md:pt-16 lg:pt-6 mr-0 lg:mr-24 md:mr-0 sm:mr-0 text-center lg:text-left mb-8 lg:mb-0">
      <TitleAndSubtitle />
    </div>

    {/* Bagian Kanan: Panel resendActivation */}
     <GlassPanel className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl ">
      <div className="w-full md:w-1/2 md:pr-4">
        <h1 className="text-4xl font-bold text-white text-center pb-[40px] pt-[20px]">Lupa Password</h1>
        <form className="content-center" onSubmit={handleSubmit}>
          <InputElement
            inputClass="mb-6"
            forwhat="email"
            labelMessage="Email Kemenkeu"
            typeInput="text"
            inputName="email"
            inputPlaceholder="example@kemenkeu.go.id"
            ref={usernameRef}
          />
          <Button
            type="submit"
            variant="bg-kemenkeuyellow w-full hover:bg-amber-600"
            message="Dapatkan token update password"
            disabled={loading}
          />
        </form>
         <div className="flex justify-center items-center mb-2 pt-2">
                    <div className="w-16 h-px bg-gray-300"></div>
                    <div className="mx-4 text-amber-200 text-sm text-center">
                        <p>Sudah menerima email ?</p>
                    </div>
                    <div className="w-16 h-px bg-gray-300"></div>
                </div>
        <Button
            type="button"
            variant="border border-maintheme text-maintheme w-full hover:bg-amber-600"
            message="Update password Anda disini"
            onClick={perbaruiPassword}
          />
        <BackToLogin />
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spin indicator={loadingIndicator} />
          </div>
        )}
        {forgotPasswordFailed && (
          <p className="text-red-500 mt-4 text-center">{forgotPasswordFailed}</p>
        )}
      </div>

      {/* Bagian Gambar */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <img
          src="/assets/img/forgotPasswordBlue.png"
          alt="forgotPassword illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </GlassPanel>
  </div>
</section>

  );
};

export default ForgetPasswordForm;
