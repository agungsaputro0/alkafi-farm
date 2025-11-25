import { Timeline, Card } from "antd";
import monitoringSiklusData from "../pseudo_db/monitoringsiklushewan.json";
import usersData from "../pseudo_db/users.json";
import { formatTanggalIndo } from "../utils/FormatTanggalIndo";
import { IoCalendarSharp } from "react-icons/io5";
import { LuUserPlus } from "react-icons/lu";

const getPetugasNama = (id: string) =>
  usersData.find(u => u.idPengguna === id)?.namaPengguna || id;

// Warna untuk setiap jenisCatatan (untuk dot)
const jenisColors: Record<string, "green" | "red" | "blue" | "orange" | "gray" | "purple" | "yellow"> = {
  "Birahi": "orange",
  "Kawin/Inseminasi": "blue",
  "Kesehatan": "green",
};

interface DataRiwayatSiklus {
  idHewanTernak: string,
  idMonitoring: string,
  jenisCatatan: string,
  tanggalPencatatan: string,
  detail: string,
  hasilAnalisisAI: string,
  petugas: string,
}

export const TimelineMonitoring = ({ idHewan }: { idHewan: string }) => {
  
  const additionalEntry: DataRiwayatSiklus[] = JSON.parse(localStorage.getItem("RiwayatSiklus") || "[]");

  const combinedEntry = [...monitoringSiklusData, ...additionalEntry];
  
  const siklusHewan = combinedEntry
    .filter(m => m.idHewanTernak === idHewan)
    .sort((a, b) => new Date(a.tanggalPencatatan).getTime() - new Date(b.tanggalPencatatan).getTime());

  return (
    <Timeline mode="left">
      {siklusHewan.map((siklus) => (
        <Timeline.Item
          key={siklus.idMonitoring}
          color={jenisColors[siklus.jenisCatatan] || "gray"}
        >
          <Card
            style={{ marginBottom: 16 }}
            bodyStyle={{ padding: 16 }}
            bordered
            hoverable
            className={`${siklus.jenisCatatan == "Birahi" ? "bg-orange-200" : 
                siklus.jenisCatatan == "Kawin/Inseminasi" ? "bg-green-200" : 
                siklus.jenisCatatan == "Kehamilan" ? "bg-red-200" : 
                siklus.jenisCatatan == "Kematian" ? "bg-gray-200" : 
                siklus.jenisCatatan == "Pemeriksaan Kehamilan Lanjutan" ? "bg-red-100" : 
                siklus.jenisCatatan == "Perawatan Rutin" ? "bg-blue-200" : 
                "bg-farmlighestbrown"}`}
          >
            <div className="flex gap-4">
            <div className="w-1 bg-farmdarkestbrown"></div>
            <div>
                <h3 className="font-bold text-xl">{siklus.jenisCatatan}</h3>
                <p className="text-sm text-gray-500 flex gap-2 mb-4">
                    <IoCalendarSharp className="mt-[2.5px]" />{formatTanggalIndo(siklus.tanggalPencatatan)} &nbsp;|&nbsp;<LuUserPlus className="mt-[2.5px]" /> Dipantau oleh <b>{getPetugasNama(siklus.petugas)}</b>
                </p>
                <p className="mt-1 text-farmdarkestbrown font-bold">Detail: <br></br></p>
                <p className="mt-1 text-farmdarkestbrown">{siklus.detail}</p>
                <p className="border border-b border-dashed border-gray-600 mb-2 mt-2"></p>
                <p className="text-farmdarkestbrown text-sm mt-1"><b>Analisis AI:</b> </p>
                <p className="text-farmdarkestbrown text-sm mt-1">{siklus.hasilAnalisisAI}</p>
            </div>
            </div>
          </Card>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};
