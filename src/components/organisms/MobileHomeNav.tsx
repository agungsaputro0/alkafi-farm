import { FaHome } from "react-icons/fa"; 
import { PiUserCircleDuotone } from "react-icons/pi"; 
import { Link } from "react-router-dom";
import { BiTask, BiTaskX } from "react-icons/bi";
import { GiGoat } from "react-icons/gi";

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-farmLightOrange border-t border-gray-300 shadow-md sm:hidden z-50">
      <div className="flex justify-around items-center relative py-2">
        <Link
          to="#"
          className="flex-1 flex flex-col items-center text-farmdarkbrown hover:text-gray-800 text-center"
        >
          <FaHome size={24} />
          <span className="text-xs">Beranda</span>
        </Link>

         <Link
          to="#"
          className="flex-1 flex flex-col items-center text-farmdarkbrown hover:text-gray-800 text-center"
        >
          <GiGoat size={24} />
          <span className="text-xs">Hewan Ternak</span>
        </Link>

        {/* Tombol Katalog Menonjol */}
        <Link
          to="/TaskList"
          className="flex-1 flex flex-col items-center text-farmLightOrange text-center relative -mt-10"
        >
          <div className="w-16 h-16 bg-farmdarkestbrown rounded-full flex items-center justify-center shadow-lg border-4 border-farmLightOrange">
            <BiTaskX size={28} />
          </div>
        </Link>

        <Link
          to="#"
          className="flex-1 flex flex-col items-center text-farmdarkbrown hover:text-gray-800 text-center"
        >
          <BiTask size={24} />
          <span className="text-xs">Riwayat</span>
        </Link>

        
        <Link
          to="#"
          className="flex-1 flex flex-col items-center text-farmdarkbrown hover:text-gray-800 text-center"
        >
          <PiUserCircleDuotone size={24} />
          <span className="text-xs">Saya</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
