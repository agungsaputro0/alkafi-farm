import React from "react";
import {
  FaLeaf,
  FaNotesMedical,
  FaMoneyBillWave,
  FaClipboardCheck,
} from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import { PiMonitorDuotone } from "react-icons/pi";
import { formatTanggalPendek } from "../utils/FormatTanggalIndo";

interface DashboardPanelsProps {
  className?: string;
}

const DashboardPanels: React.FC<DashboardPanelsProps> = ({ className = "" }) => {
  return (
    <div className={`w-full bg-white border border-gray-200 backdrop-blur-md rounded-xl shadow-lg p-6 text-farmdarkestbrown ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Panel 1: Total Ternak */}
        <div className="flex items-center p-4 rounded-2xl shadow-md transition self-stretch border border-gray-200
                      text-farmBrown hover:shadow-xl hover:bg-greenlogo/40">
          <div className="text-4xl mr-4 text-farmOrange">
            <GiCow />
          </div>
          <div>
            <h3 className="text-sm font-medium text-farmdarkbrown">Total Ternak</h3>
            <p className="text-2xl font-bold text-farmOrange leading-tight">235 Ekor</p>
            <p className="text-xs text-farmdarkbrown">Sapi: 140 | Domba: 95</p>
          </div>
        </div>

        {/* Panel 2: Stok Pakan Tersedia */}
        <div className="flex items-center p-4 rounded-2xl  shadow-md transition self-stretch border border-gray-200
                      text-farmBrown hover:shadow-xl hover:bg-greenlogo/40">
          <div className="text-4xl mr-4 text-farmgreen">
            <FaLeaf />
          </div>
          <div>
            <h3 className="text-sm font-medium text-farmdarkbrown">Stok Pakan Tersedia</h3>
            <p className="text-2xl font-bold text-farmgreen leading-tight">1,2 Ton</p>
            <p className="text-xs text-farmdarkbrown">Data per {formatTanggalPendek()}</p>
          </div>
        </div>

        {/* Panel 3: Kegiatan Harian Selesai */}
        <div className="flex items-center p-4 rounded-2xl shadow-md transition self-stretch border border-gray-200
                      text-farmBrown hover:shadow-xl hover:bg-greenlogo/40">
          <div className="text-4xl mr-4 text-farmLiteGold">
            <FaClipboardCheck />
          </div>
          <div>
            <h3 className="text-sm font-medium text-farmdarkbrown">Kegiatan Harian Selesai</h3>
            <p className="text-2xl font-bold text-farmlightbrown leading-tight">4 Tugas</p>
            <p className="text-xs text-farmdarkbrown">Termasuk pakan & pembersihan</p>
          </div>
        </div>

        {/* Panel 4: Catatan Kesehatan */}
        <div className="flex items-center p-4 rounded-2xl shadow-md transition self-stretch border border-gray-200
                      text-farmBrown hover:shadow-xl hover:bg-greenlogo/40">
          <div className="text-4xl mr-4 text-red-600">
            <FaNotesMedical />
          </div>
          <div>
            <h3 className="text-sm font-medium text-farmdarkbrown">Catatan Kesehatan</h3>
            <p className="text-2xl font-bold text-red-600 leading-tight">3 Entri</p>
            <p className="text-xs text-farmdarkbrown">7 Hari Terakhir</p>
          </div>
        </div>

        {/* Panel 5: Aktivitas Reproduksi */}
        <div className="flex items-center p-4 rounded-2xl shadow-md transition self-stretc border border-gray-200
                      text-farmBrown hover:shadow-xl hover:bg-greenlogo/40">
          <div className="text-4xl mr-4 text-farmgreen">
            <PiMonitorDuotone />
          </div>
          <div>
            <h3 className="text-sm font-medium text-farmdarkbrown">Aktivitas Reproduksi</h3>
            <p className="text-2xl font-bold text-farmgreen leading-tight">5 Kasus</p>
            <p className="text-xs text-farmdarkbrown">Dalam Pemantauan</p>
          </div>
        </div>

        {/* Panel 6: Penjualan Bulan Ini */}
        <div className="flex items-center p-4 rounded-2xl shadow-md transition self-stretch border border-gray-200
                      text-farmBrown hover:shadow-xl hover:bg-greenlogo/40">
          <div className="text-4xl mr-4 text-kemenkeuyellow">
            <FaMoneyBillWave />
          </div>
          <div>
            <h3 className="text-sm font-medium text-farmdarkbrown">Penjualan Bulan Ini</h3>
            <p className="text-2xl font-bold text-kemenkeuyellow leading-tight">Rp 45.800.000</p>
            <p className="text-xs text-farmdarkbrown">Pembaruan Terakhir</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPanels;
