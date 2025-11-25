import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputElement from "../atoms/InputElementWhite";
import Button from "../atoms/Button";
import { Helmet } from "react-helmet";
import { notification, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons'; 
import { HandleResendActivation } from "../hooks/HandleResendActivation";
import GlassPanel from "../atoms/GlassPanel";
import TitleAndSubtitle from "../atoms/TitleAndSubTitle";
import BackToLogin from "../atoms/BackToLogin";

const appName = import.meta.env.NEXT_PUBLIC_APP_NAME;

const ResendActivationForm: FC = () => {
  const [resendActivationFailed, setresendActivationFailed] = useState<string>("");
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

    if (resendActivationFailed) {
      timer = setTimeout(() => {
        setresendActivationFailed("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [resendActivationFailed]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const email = event.currentTarget.email.value;

    try {
        const result = await HandleResendActivation(email); 
        if (result.success) {
          notification.success({
              message: "Resend Aktivasi Berhasil!",
              description: "Silakan cek email Anda!",
          });
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
           notification.error({
                message: "Resend Aktivasi Gagal!",
                description: result.message,
            });
        }
    } catch (error) {
        setresendActivationFailed("Invalid credentials");
        notification.error({
            message: "Resend Activation Gagal!",
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

    {/* Bagian Kanan: Panel resendActivation */}
     <GlassPanel className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl ">
      <div className="w-full md:w-1/2 md:pr-4">
        <h1 className="text-4xl font-bold text-white text-center pb-[60px] pt-[20px]">Resend Aktivasi</h1>
        <form className="content-center" onSubmit={handleSubmit}>
          <InputElement
            inputClass="mb-6"
            forwhat="email"
            labelMessage="Email"
            typeInput="text"
            inputName="email"
            inputPlaceholder="example@example.com"
            ref={usernameRef}
          />
          <Button
            type="submit"
            variant="bg-green-700 w-full hover:bg-green-900"
            message="Resend Aktivasi"
            disabled={loading}
          />
        </form>
        <BackToLogin />
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spin indicator={loadingIndicator} />
          </div>
        )}
        {resendActivationFailed && (
          <p className="text-red-500 mt-4 text-center">{resendActivationFailed}</p>
        )}
      </div>

      {/* Bagian Gambar */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <img
          src="/assets/img/resendActivation.png"
          alt="resendActivation illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </GlassPanel>
  </div>
</section>

  );
};

export default ResendActivationForm;
