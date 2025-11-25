import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import fotoHewanTernakData from "../pseudo_db/fotohewanternak.json";
import { ImPlus } from "react-icons/im";
import { decryptData } from "../utils/Encryptor";
import hewanTernakData from "../pseudo_db/hewanternak.json";
import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import { hitungUmur } from "../utils/HitungUmur";
import { TimelineMonitoring } from "./TimelineMonitoring";

const DetailMonitoringSiklus = () => {
  const { neckTag } = useParams<{ neckTag: string }>();
  const [hewan, setHewan] = useState<typeof hewanTernakData[0] | null>(null);
  const navigate = useNavigate();
  
   useEffect(() => {
      if (!neckTag) return;
      const decryptedNeckTag = decryptData(neckTag);
  
      const hewanItem = hewanTernakData.find(
        (h) => h.kodeNeckTag === decryptedNeckTag
      );
      if (!hewanItem) return setHewan(null);
      setHewan(hewanItem);
  
    }, [neckTag]);

   const getFotoHewan = (idHewan: string) => {
    const foto = fotoHewanTernakData.find(
        (f) => f.idHewanTernak === idHewan && f.thumbnail
    );
    return foto ? foto.fotoUrl : "/images/no-image.jpg"; // fallback kalau nggak ada
    };
  const getNamaJenis = (id: string) => jenisHewanTernakData.find(j => j.idJenisHewanTernak === id)?.namaJenisHewanTernak || "-";
  const getNamaRas = (id: string) => rasHewanTernakData.find(r => r.idRasHewanTernak === id)?.namaRasHewanTernak || "-";

  if (!hewan) return <div className="text-center p-8">Data hewan tidak ditemukan</div>;



  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/repository")}>Hewan Ternak • </span>
            <span className="text-white/50 cursor-pointer hover:text-kemenkeuyellow" onClick={() => navigate("/ternak/monitoring")}>Monitoring Siklus • </span>
            Riwayat Siklus
          </p>
        </div>

        <WhiteSection>
          <div className="p-6 bg-[#fffdf9]/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
            <div className="w-40 h-40 overflow-hidden rounded-lg">
            <img
                src={getFotoHewan(hewan.idHewanTernak)}
                alt="Foto Hewan"
                className="object-cover"
                style={{height: "150px", width: "150px"}}
                onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = '/assets/img/hewanternak/hewanplaceholder.jpg';
                }}
            />
            </div>
             <div>
                <h2 className="text-3xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                  {hewan.kodeNeckTag}
                </h2>
                <p className="text-md text-[#724e3a]">🟤 <b>Jenis ternak</b>   : {getNamaJenis(hewan.idJenisHewanTernak)} {getNamaRas(hewan.idRasHewanTernak)} </p>
                <p className="text-md text-[#724e3a]">🟤 <b>Jenis Kelamin</b>  : {hewan.jenisKelamin}</p>
                <p className="text-md text-[#724e3a]">🟤 <b>Usia</b>         : {hitungUmur(hewan.tanggalLahir)}</p>
                <p className="text-md text-[#724e3a]">🟤 <b>Berat terakhir</b> : {hewan.beratAwal} Kg</p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => navigate(`/ternak/monitoring/tambahriwayatsiklus/${neckTag}`)}
                  variant="bg-farmbrown hover:bg-farmdarkestbrown min-w-[180px] text-white px-4 py-2 text-sm rounded-full shadow-md transition flex gap-2 justify-center items-center"
                >
                  <ImPlus /> Tambah Catatan
                </Button>
              </div>
            </div>
            <TimelineMonitoring idHewan={hewan.idHewanTernak} />
          </div>
        </WhiteSection>
      </MainPanel>
    </section>
  );
};

export default DetailMonitoringSiklus;
