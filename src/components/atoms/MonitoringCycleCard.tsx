import React from "react";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../utils/Encryptor";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";
interface MonitoringCycleCardProps {
  fotoUrl?: string;
  kodeNeckTag: string;
  jenisTernak: string;
  rasHewan: string;
  jenisKelamin: string;
  usia: string;
  statusKesehatan: string;
  tanggalPencatatan?: string;
  detail?: string;
}

const MonitoringCycleCard: React.FC<MonitoringCycleCardProps> = ({
  fotoUrl,
  kodeNeckTag,
  jenisTernak,
  rasHewan,
  jenisKelamin,
  usia,
  statusKesehatan,
  tanggalPencatatan,
  detail,
}) => {
  const kodeNeckTagParam = encryptData(kodeNeckTag);
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/ternak/monitoring/${kodeNeckTagParam}`)} className="cursor-pointer bg-white hover:bg-farmlighestbrown rounded-xl shadow-md border border-gray-300 overflow-hidden w-full max-w-md md:max-w-2xl p-4 flex flex-col">
      {/* Bagian atas: Foto + Info */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Foto */}
        <div className="w-full md:w-1/3 flex justify-center items-center bg-gray-200 rounded-md overflow-hidden">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Foto Hewan"
              className="object-cover w-full h-full"
              onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/img/hewanternak/hewanplaceholder.jpg';
                        }}
            />
          ) : (
            <div className="flex items-center justify-center text-gray-600 italic h-48 w-full">
              Photo
            </div>
          )}
        </div>

        {/* Informasi utama */}
        <div className="flex flex-col justify-between md:w-2/3 px-1">
          <div>
            <h2 className="text-xl font-bold text-farmdarkestbrown">
              {kodeNeckTag}
            </h2>

            <ul className="text-sm text-gray-700 mt-2 space-y-1">
              <li>
                <span className="font-semibold">🟫 Jenis Ternak:</span> {jenisTernak} {rasHewan}
              </li>
              <li>
                <span className="font-semibold">🟫 Jenis Kelamin:</span> {jenisKelamin}
              </li>
              <li>
                <span className="font-semibold">🟫 Usia:</span> {usia}
              </li>
            </ul>

            <hr className="border-gray-400 mt-[10px]" />

            <div className="flex justify-center mt-[10px] w-full">
              <button
                className="bg-black text-white px-6 py-2 rounded-full w-full text-sm font-semibold"
                disabled
              >
                Status Reproduksi: {statusKesehatan}
              </button>
            </div>

            <div className="mt-4 text-sm">
              <p className="text-gray-700 font-semibold">Pemeriksaan Terakhir:</p>
              <p className="italic text-gray-600">
              {tanggalPencatatan
                ? formatTanggalIndo(tanggalPencatatan.toString()) !== "-"
                  ? formatTanggalIndo(tanggalPencatatan.toString())
                  : "-"
                : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis terakhir — di bawah seluruh bagian */}
      <div className="mt-4 border-t pt-3">
        <p className="italic text-gray-700 font-semibold">Detail:</p>
        <p className="text-gray-600 text-sm text-justify">
          {detail || "-"}
        </p>
      </div>
    </div>
  );
};

export default MonitoringCycleCard;
