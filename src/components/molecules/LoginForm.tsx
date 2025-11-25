import { FC, useEffect, useRef, useState } from "react";
import InputElement from "../atoms/InputElement";
import Button from "../atoms/Button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons'; 
import { handleLogin } from "../hooks/HandleLogin";
import { useDispatch } from 'react-redux'; 
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import WhitePanel from "../atoms/WhitePanel";
import TitleAndSubtitle from "../atoms/TitleAndSubTitle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const appName = import.meta.env.NEXT_PUBLIC_APP_NAME;

const LoginForm: FC = () => {
  const [loginFailed, setLoginFailed] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch(); 

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (loginFailed) {
      timer = setTimeout(() => {
        setLoginFailed("");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [loginFailed]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginStart());
    setLoading(true);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
        const user = await handleLogin(email, password); 
        const userKategori = user.user?.idRole;
        dispatch(loginSuccess(email));
        if(user.success === true){
            toast.success(
              <div>
                <strong>Kredensial Ditemukan!</strong>
                <div>Selamat Anda berhasil Login!</div>
              </div>
            );
          setTimeout(() => {
            window.location.href = userKategori === 1 ? '/' : '/'; 
          }, 1000); 
        } else {
            toast.error(
              <div>
                <strong>Mohon Maaf!</strong>
                <div>Cek kembali kredensial Anda!</div>
              </div>
            );
        }
    } catch (error) {
        setLoginFailed("Invalid credentials");
        dispatch(loginFailure());
        toast.error(
              <div>
                <strong>Mohon Maaf!</strong>
                <div>Cek kembali kredensial Anda!</div>
              </div>
            );
    } finally {
        setLoading(false);
    }
  };

  const loadingIndicator = <LoadingOutlined style={{ fontSize: 24, color: '#ffb300' }} spin />;

  return (
  <section>
  <Helmet>
    <title>{appName}</title>
  </Helmet>
  <div className="pt-24 sm:pt-24 sm:mb-20 md:pt-6 lg:pt-6 flex flex-col lg:flex-row justify-between items-center min-h-screen px-4 md:px-8">
    <div className="sm:pl-0 md:pl-0 lg:pl-10 pt-2 sm:pt-2 md:pt-16 lg:pt-6 mr-0 lg:mr-24 md:mr-0 sm:mr-0 text-center lg:text-left mb-8 lg:mb-0">
       <TitleAndSubtitle />
    </div>

    {/* Bagian Kanan: Panel Login */}
    <WhitePanel className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl ">
      <div className="w-full md:w-1/2 md:pr-4">
        <h1 className="text-4xl mt-4 font-bold text-farmdarkestbrown font-spring  text-center pb-[30px]">Login</h1>
        <form onSubmit={handleSubmit}>
          <InputElement
            inputClass="mb-6"
            forwhat="email"
            labelMessage="Email"
            typeInput="text"
            inputName="email"
            inputPlaceholder="example@example.com"
            ref={usernameRef}
          />
          <InputElement
            inputClass="mb-4"
            forwhat="password"
            labelMessage="Password"
            typeInput="password"
            inputName="password"
            inputPlaceholder="••••••••"
            autoComplete="new-password"
          />
          <p className="text-farmgrassgreen mb-4 flex justify-between">
              <Link className="text-left" to="/ResendAktivasi">
                 Resend Activation
              </Link>
              <Link className="text-right" to="/ForgotPassword">
                 Lupa Password
              </Link>
          </p>
          <Button
            type="submit"
            variant="bg-farmbrown w-full hover:bg-farmdarkbrown"
            message="Login"
            disabled={loading}
          />
        </form>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spin indicator={loadingIndicator} />
          </div>
        )}
        {loginFailed && (
          <p className="text-red-500 mt-4 text-center">{loginFailed}</p>
        )}
      </div>

      {/* Bagian Gambar */}
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <img
          src="/assets/img/login-illustration.png"
          alt="Login illustration"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </WhitePanel>
  </div>
</section>

  );
};

export default LoginForm;
