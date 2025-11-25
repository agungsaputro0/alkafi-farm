import { Link } from "react-router-dom";

const BackToLogin = () => {
    return (
        <p className="text-white mt-4 text-center">Kembali ke login ? Silakan &nbsp;
                  <Link to="/Login" className="text-amber-200">
                  <b>Klik Disini</b>
                  </Link>
                </p>
    )
}
export default BackToLogin;