import { FC, useEffect, useRef, useState } from "react";
import InputElement from "../atoms/InputElementWhite";
import Button from "../atoms/Button";
import { Helmet } from "react-helmet";
import { notification, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons'; 
import { HandleChangePassword } from "../hooks/HandleChangePassword";
import GlassPanel from "../atoms/GlassPanel";
import TitleAndSubtitle from "../atoms/TitleAndSubTitle";
import BackToLogin from "../atoms/BackToLogin";
import { useNavigate } from "react-router-dom";
const appName = import.meta.env.NEXT_PUBLIC_APP_NAME;

const ChangePasswordForm: FC = () => {
  const [changePasswordFailed, setchangePasswordFailed] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (changePasswordFailed) {
      timer = setTimeout(() => {
        setchangePasswordFailed("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [changePasswordFailed]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const token = event.currentTarget.kode_verifikasi.value;
    const new_password = event.currentTarget.password.value;

    try {
        const result = await HandleChangePassword(token, new_password); 
         if (result.success) {
            notification.success({
                message: "Reset Password Berhasil!",
                description: "Silakan login dengan password baru!",
            });
            setTimeout(() => {
              navigate("/login");
            }, 1000);
         } else {
             notification.error({
                message: "Reset Password Gagal!",
                description: result.message,
            });
         }

    } catch (error) {
        setchangePasswordFailed("Invalid credentials");
        notification.error({
            message: "Resend Password Gagal!",
            description: "Mohon maaf, Kredensial Anda tidak valid!",
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

    {/* Bagian Kanan: Panel changePassword */}
     <GlassPanel className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl ">
      <div className="w-full md:w-1/2 md:pr-4">
        <h1 className="text-4xl font-bold text-white text-center pb-[40px] pt-[20px]">Lupa Password</h1>
        <form className="content-center" onSubmit={handleSubmit}>
          <InputElement
            inputClass="mb-6"
            forwhat="kode_verifikasi"
            labelMessage="Kode Verifikasi"
            typeInput="text"
            inputName="kode_verifikasi"
            inputPlaceholder="xxxx-xxxx-xxxx-xxxx"
          />
          <InputElement
            inputClass="mb-6"
            forwhat="password"
            labelMessage="Password Baru"
            typeInput="password"
            inputName="password"
            inputPlaceholder="••••••••"
            autoComplete="none"
          />
          <Button
            type="submit"
            variant="bg-kemenkeuyellow w-full hover:bg-amber-600"
            message="Update Password"
            disabled={loading}
          />
        </form>
        <BackToLogin />
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spin indicator={loadingIndicator} />
          </div>
        )}
        {changePasswordFailed && (
          <p className="text-red-500 mt-4 text-center">{changePasswordFailed}</p>
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

export default ChangePasswordForm;
