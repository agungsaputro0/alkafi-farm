import React from "react";
import { TfiEmail } from 'react-icons/tfi';
import { FaMapLocation } from 'react-icons/fa6';
import { PiPhoneDuotone } from 'react-icons/pi';
import { getCurrentUser } from "../hooks/HandleLogin";

interface WelcomingPanelProps {
  userName: string;
}

const WelcomingPanel: React.FC<WelcomingPanelProps> = ({ userName }) => {
  
  const user = getCurrentUser();
  const avatarUrl = user.avatarUrl;
  return (
    <div className="w-full bg-white backdrop-blur-md rounded-xl border border-gray-200 shadow p-6 text-farmdarkestbrown mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-farmdarkestbrown">Selamat Datang, {userName}</h2>
        <p className="text-sm text-farmdarkestbrown/80 mt-1">
          Berikut sekilas tampilan dashboard Alkafi Farm. Pantau aktivitas peternakan, transaksi, dan data penting untuk mengelola operasional secara efisien.
        </p>
      </div>

      <div className="flex items-center p-4 bg-white/10 backdrop-blur-md border border-gray-200 rounded-2xl shadow transition hover:shadow-xl">
        <img
          src={avatarUrl || '/assets/img/userDefault.png'}
          alt={userName}
          className="w-20 h-20 rounded-full mr-4 border-2 border-white/30"
          onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/img/userDefault.png';
                        }}
        />
        <div className="">
          <h3 className="text-lg font-semibold text-farmdarkestbrown">{user.namaPengguna}</h3>
          <p className="flex gap-2 text-sm text-farmdarkestbrown/80"><TfiEmail className="mt-1"/>{user.email}</p>
          <p className="flex gap-2 text-sm text-farmdarkestbrown/60 text-justify"><FaMapLocation className="mt-1" /> {user.alamat}</p>
          <p className="flex gap-2 text-sm text-farmdarkestbrown/60"><PiPhoneDuotone className="mt-1" /> {user.nomorTelepon}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomingPanel;
