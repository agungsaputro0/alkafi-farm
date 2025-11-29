import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { FaSearch, FaTag, FaPaw, FaVenusMars, FaWeightHanging } from "react-icons/fa";

import jenisHewanTernakData from "../pseudo_db/jenishewanternak.json";
import hewanTernakData from "../pseudo_db/hewanternak.json";
import rasHewanTernakData from "../pseudo_db/rashewanternak.json";
import fotoHewanTernakData from "../pseudo_db/fotohewanternak.json";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dataHewan: any) => void;
};

const PilihHewanTernakModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState("");

  // Fungsi ambil nama
  const getNamaJenis = (id: string) =>
    jenisHewanTernakData.find((j) => j.idJenisHewanTernak === id)
      ?.namaJenisHewanTernak || "-";

  const getNamaRas = (id: string) =>
    rasHewanTernakData.find((r) => r.idRasHewanTernak === id)
      ?.namaRasHewanTernak || "-";

  const getFoto = (id: string) => {
    const f = fotoHewanTernakData.find(
      (x) => x.idHewanTernak === id && x.thumbnail === true
    );
    return f?.fotoUrl || "/assets/img/hewanternak/hewanplaceholder.jpg";
  };

  // 🔍 SEARCH BERBASIS MULTI FIELD
  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    return hewanTernakData.filter((item) => {
      const jenis = getNamaJenis(item.idJenisHewanTernak).toLowerCase();
      const ras = getNamaRas(item.idRasHewanTernak).toLowerCase();

      return (
        item.kodeNeckTag.toLowerCase().includes(s) ||
        jenis.includes(s) ||
        ras.includes(s) ||
        item.jenisKelamin.toLowerCase().includes(s) ||
        item.beratAwal.toString().includes(s)
      );
    });
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-3xl rounded-xl shadow-xl p-6 relative">
        
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
          onClick={onClose}
        >
          <IoClose size={28} />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Pilih Hewan Ternak</h2>

        {/* Search Bar */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4 bg-gray-50 focus-within:ring-2 focus-within:ring-farmdarkbrown transition">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari kode / jenis / ras / kelamin…"
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.idHewanTernak}
              className="
                border rounded-lg p-3 flex gap-3 bg-gray-50 
                hover:bg-greenlogo/20 hover:shadow-md hover:scale-[1.01]
                transition-all duration-200 cursor-pointer
              "
            >
              {/* FOTO */}
              <div className="w-24 h-24 rounded-lg overflow-hidden border">
                <img
                  src={getFoto(item.idHewanTernak)}
                  alt="foto"
                  className="w-full h-full object-cover"
                   onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/assets/img/hewanternak/hewanplaceholder.jpg';
                        }}
                />
              </div>

              {/* TEXT */}
              <div className="flex-1 text-sm space-y-1">
                <p className="font-semibold text-base">{item.kodeNeckTag}</p>

                <p className="flex items-center gap-1">
                  <FaTag className="text-farmdarkbrown" />
                  Jenis: {getNamaJenis(item.idJenisHewanTernak)}
                </p>

                <p className="flex items-center gap-1">
                  <FaPaw className="text-farmdarkbrown" />
                  Ras: {getNamaRas(item.idRasHewanTernak)}
                </p>

                <p className="flex items-center gap-1">
                  <FaVenusMars className="text-farmdarkbrown" />
                  Jenis Kelamin: {item.jenisKelamin}
                </p>

                <p className="flex items-center gap-1">
                  <FaWeightHanging className="text-farmdarkbrown" />
                  Berat: {item.beratAwal} kg
                </p>
              </div>

              {/* BUTTON PILIH */}
              <button
                onClick={() => onSelect(item)}
                className="
                  bg-farmbrown hover:bg-farmdarkestbrown text-white 
                  px-4 py-2 rounded-lg text-sm mt-auto 
                  transition-all duration-200
                "
              >
                Pilih Hewan
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PilihHewanTernakModal;
