import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { FaSearch, FaTag, FaPaw } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

import katalogData from "../pseudo_db/ekatalog.json";
import fotoHewanTernakData from "../pseudo_db/fotohewanternak.json";

type ProdukItem = {
  namaProduk: string;
  qty: number;
  hargaSatuan: number;
  diskon: number;
  stok: number;
  tipe: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dataHewan: any) => void;
  produkList: ProdukItem[];
};

const PilihKatalogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelect,
  produkList,
}) => {
  const [search, setSearch] = useState("");

  const getFoto = (id: string | null) => {
    if (!id) return "/assets/img/hewanternak/hewanplaceholder.jpg";
    const f = fotoHewanTernakData.find(
      (x) => x.idHewanTernak === id && x.thumbnail === true
    );
    return f?.fotoUrl || "/assets/img/hewanternak/hewanplaceholder.jpg";
  };

  // 🔍 SEARCH BERBASIS MULTI KATA
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return katalogData;

    const terms = s.split(" ");
    return katalogData.filter((item) => {
      const haystack = (item.namaProduk + " " + item.kategori).toLowerCase();
      return terms.every((term) => haystack.includes(term));
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

        <h2 className="text-xl font-bold text-center mb-4">Pilih Produk</h2>

        {/* Search Bar */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4 bg-gray-50 focus-within:ring-2 focus-within:ring-farmdarkbrown transition">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari produk"
            className="w-full bg-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="max-h-[420px] overflow-y-auto pr-2 space-y-3">
          {filtered.map((item) => {
            const stokAngka = Number(item.stok.replace(/\D/g, "")) || 0;

            // cek berapa qty produk ini sudah ada di produkList
            const produkDiList = produkList.find(p => p.namaProduk === item.namaProduk);
            const qtyTerpakai = produkDiList ? produkDiList.qty : 0;

            // jika qty sudah sama dengan stok, maka disable / buram
            const tidakBisaPilih = qtyTerpakai >= stokAngka;

            return (
              <div
                key={item.idKatalog}
                className={`
                  border rounded-lg p-3 flex gap-3 bg-gray-50
                  ${tidakBisaPilih ? "opacity-50 cursor-not-allowed" : "hover:bg-greenlogo/20 hover:shadow-md hover:scale-[1.01] cursor-pointer"}
                  transition-all duration-200
                `}
              >
                {/* FOTO */}
                <div className="w-24 h-24 rounded-lg overflow-hidden border">
                  <img
                    src={item.idHewanTernak ? getFoto(item.idHewanTernak) : item.foto[0]}
                    alt="foto"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/assets/img/hewanternak/hewanplaceholder.jpg";
                    }}
                  />
                </div>

                {/* TEXT */}
                <div className="flex-1 text-sm space-y-1">
                  <p className="font-semibold text-base">{item.namaProduk}</p>

                  <p className="flex items-center gap-1">
                    <FaTag className="text-farmdarkbrown" />
                    Kategori: {item.kategori}
                  </p>

                  <p className="flex items-center gap-1">
                    <FaPaw className="text-farmdarkbrown" />
                    Stok: {item.stok} {qtyTerpakai > 0 && `(Dipilih: ${qtyTerpakai})`}
                  </p>

                  <p className="flex items-center gap-1">
                    <GiMoneyStack className="text-farmdarkbrown" />
                    Harga: {item.harga} kg
                  </p>
                </div>

                {/* BUTTON PILIH */}
                <button
                  onClick={() => !tidakBisaPilih && onSelect(item)}
                  disabled={tidakBisaPilih}
                  className={`
                    bg-farmbrown text-white px-4 py-2 rounded-lg text-sm mt-auto
                    transition-all duration-200
                    ${tidakBisaPilih ? "opacity-50 cursor-not-allowed" : "hover:bg-farmdarkestbrown"}
                  `}
                >
                  {tidakBisaPilih ? "Stok Habis" : "Pilih Produk"}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PilihKatalogModal;
