import React from "react";
import { FaTags, FaBoxes } from "react-icons/fa";

interface KatalogCardProps {
  foto: string;
  namaProduk: string;
  kategori: string;
  stok: string;
  harga: string;
  deskripsi: string;
}

const KatalogCard: React.FC<KatalogCardProps> = ({
  foto,
  namaProduk,
  kategori,
  stok,
  harga,
  deskripsi,
}) => {
  
  return (
    <div className="w-full max-w-sm rounded-2xl shadow-lg bg-white border border-transparent
                    bg-gradient-to-br from-blue-50 to-emerald-50 p-[1px] transition-transform duration-200 hover:scale-105 hover:shadow-xl transition-all duration-300">
      
      <div className="bg-white rounded-2xl overflow-hidden">
        
        {/* Foto */}
        <div className="w-full h-56 bg-gray-100 relative">
          <img
            src={foto}
            alt={namaProduk}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-5">

          {/* Nama Produk */}
          <h2 className="text-xl font-bold text-gray-900">{namaProduk}</h2>

          {/* Kategori & Stok */}
          <div className="flex items-center gap-5 mt-2 text-sm text-gray-700">

            <div className="flex items-center gap-2">
              <FaTags className="text-blue-600" size={14} />
              <span className="font-semibold">{kategori}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaBoxes className="text-emerald-600" size={14} />
              <span className="italic text-gray-500">Stok:</span>
              <span className="font-semibold">{stok}</span>
            </div>
          </div>

          {/* Harga */}
          <p className="mt-3 text-3xl font-extrabold text-farmgreen">
            Rp {harga}
          </p>

          {/* Deskripsi */}
          <div className="mt-3">
            <p className="text-xs italic text-gray-500">Deskripsi:</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {deskripsi}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default KatalogCard;
