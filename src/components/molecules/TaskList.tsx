import { useEffect, useRef, useState } from "react";
import { Card } from "antd";
import { GiFullMetalBucketHandle } from "react-icons/gi";
import { MdOutlineHomeWork } from "react-icons/md";
import { FaCheckCircle, FaChevronDown, FaTimesCircle } from "react-icons/fa";

import jadwalPakanData from "../pseudo_db/jadwalPakan.json";
import jadwalKandangData from "../pseudo_db/jadwalKandang.json";
import InputElement from "../atoms/InputElementWhite";

export default function TaskList() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Ambil data realisasiPakan dari localStorage
const savedRealisasi: { idJadwal: string }[] = JSON.parse(
  localStorage.getItem("realisasiPakan") || "[]"
);
// Ambil currentUser dari localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

// =======================
// PROSES DATA PAKAN
// =======================
const pakanTasks = jadwalPakanData
  .filter((p) =>
    p.detail?.some((d) => d.petugas.includes(currentUser.idPengguna))
  )
  .map((p) => {
    const isDone = savedRealisasi.some((r) => r.idJadwal === p.idJadwal);
    const detail = p.detail?.find((d) => d.petugas.includes(currentUser.idPengguna));

    return {
      id: p.idJadwal,
      nama: p.namaJadwal,
      jenis: detail?.jenisPakan,
      aktivitas: "Pakan",
      waktu:
        (detail?.jamMulai ?? "") +
        (detail?.jamSelesai ? ` - ${detail.jamSelesai}` : "") ||
        "Tidak ada jam",
      status: isDone ? "selesai" : "belum",
      deskripsi: p.catatan || "Tidak ada catatan.",
    };
  });

// =======================
// PROSES DATA KANDANG
// =======================
const kandangTasks = jadwalKandangData
  .filter((k) => k.petugas.includes(currentUser.idPengguna))
  .map((k) => ({
    id: k.idJadwal,
    nama: `Bersih Kandang ${k.idKandang}`,
    aktivitas: "Pembersihan",
    jenis: k.jenisPembersihan,
    waktu: k.waktu,
    status: (k as any).pengonfirmasi ? "selesai" : "belum",
    deskripsi: k.catatan || "Tidak ada catatan.",
  }));


  // =======================
  // FILTER HANYA YG BELUM
  // =======================
  const filterSearch = (items: any[]) =>
    items.filter((t) => t.nama.toLowerCase().includes(search.toLowerCase()));

  const filteredPakan = filterSearch(pakanTasks);
  const filteredKandang = filterSearch(kandangTasks);

  // =======================
  // STATUS ICON
  // =======================
  const StatusIcon = ({ status }: { status: string }) =>
    status === "selesai" ? (
      <FaCheckCircle className="text-green-400 text-xl" />
    ) : (
      <FaTimesCircle className="text-red-400 text-xl" />
    );

    type TaskData = {
      id: string;
      nama: string;
      waktu: string;
      aktivitas: string;
      jenis?: string;
      deskripsi?: string;
      status?: string;
    };

  // =======================
  // ITEM LIST
  // =======================
const TaskItem = ({ item }: { item: TaskData }) => {
  const isOpen = expanded === item.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          setHeight(contentRef.current.scrollHeight + "px");
          
        }
      });
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl shadow-md">
      {/* HEADER */}
      <div
        className="flex justify-between items-center p-3 cursor-pointer transition-colors duration-300 hover:bg-white/10"
        onClick={() => setExpanded(isOpen ? null : item.id)}
      >
        <div className="flex items-center gap-3">
         <StatusIcon status={item.status ?? "belum"} />
          <div>
            <p className="font-semibold text-base">{item.nama}</p>
            <p className="text-xs text-white/70">{item.waktu}</p>
          </div>
        </div>

        <FaChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* SLIDING CONTENT */}
      <div
        className="overflow-hidden transition-[height] duration-500 ease-in-out"
        style={{ height }}
      >
        <div ref={contentRef} className="p-3 bg-white/10 border-t border-white/20">
          <p className="font-bold text-lg mb-2 text-base">Detail Tugas</p>

          <div className="space-y-1 text-sm">
            <p><span className="font-bold text-justify">Waktu:</span></p>
            <p className="text-justify">{item.waktu}</p>
            <p><span className="font-bold text-justify">Jenis {item.aktivitas} :</span></p>
            <p className="text-justify">{item.jenis}</p>
            <p><span className="font-bold text-justify">Catatan :</span></p>
            <p className="text-justify">{item.deskripsi}</p>
          </div>
          {item.aktivitas === "Pakan" && item.status !== "selesai" && (
            <button
              className="mt-4 w-full py-2 rounded-lg bg-farmgreen hover:bg-farmdarkgreen text-white font-semibold transition"
              onClick={() => window.location.href = `/detailTugasPakan/${item.id}`}
            >
              Lihat Detail Tugas
            </button>
          )}
          {item.aktivitas === "Pakan" && item.status === "selesai" && (
            <button
              className="mt-4 w-full py-2 rounded-lg bg-white/40 hover:bg-farmdarkgreen text-white font-semibold transition"
              onClick={() => window.location.href = `/detailTugasPakan/${item.id}`}
            >
              Tugas sudah dikonfirmasi
            </button>
          )}
          {item.aktivitas === "Pembersihan" && (
            <button
              className="mt-4 w-full py-2 rounded-lg bg-farmgreen hover:bg-farmdarkgreen text-white font-semibold transition"
              onClick={() => window.location.href = `/detailTugasPembersihan/${item.id}`}
            >
              Lihat Detail Tugas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



  return (
    <div className="px-2 py-4 md:p-6 space-y-6 text-white mb-20">
      <h1 className="text-4xl text-center md:text-3xl mt-20 font-semibold font-spring mb-2">
        Task List Anda
      </h1>

      {/* Search */}
      <InputElement
        labelMessage=""
        forwhat="cariTugas"
        typeInput="text"
        inputName="cariTugas"
        inputPlaceholder="Cari Tugas Disini..."
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
        className="w-full mb-4 rounded-full py-2 px-4 bg-white/30 text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PAKAN */}
        <Card
          size="small"
          className="shadow-lg backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 text-white"
          title={
            <div className="flex text-white justify-center items-center gap-2 text-2xl pb-4 font-semibold">
              <GiFullMetalBucketHandle /> Pemberian Pakan
            </div>
          }
        >
          <div className="space-y-3">
            {filteredPakan.map((item) => (
              <TaskItem key={item.id} item={item} />
            ))}

            {filteredPakan.length === 0 && (
              <p className="text-sm text-white/70 italic">Tidak ada tugas.</p>
            )}
          </div>
        </Card>

        {/* KANDANG */}
        <Card
          size="small"
          className="shadow-lg backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 text-white"
          title={
            <div className="flex text-white justify-center pb-4 items-center gap-2 text-2xl font-semibold">
              <MdOutlineHomeWork /> Pembersihan Kandang
            </div>
          }
        >
          <div className="space-y-3">
            {filteredKandang.map((item) => (
              <TaskItem key={item.id} item={item} />
            ))}

            {filteredKandang.length === 0 && (
              <p className="text-sm text-white/70 italic">Tidak ada tugas.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
