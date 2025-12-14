import React from "react";
import { FaTags, FaBoxes } from "react-icons/fa";

interface PromoKatalogCardProps {
  foto: string;
  namaProduk: string;
  kategori: string;
  stok: string;
  harga: number;
  deskripsi: string;
}

const PromoKatalogCard: React.FC<PromoKatalogCardProps> = ({
  foto,
  namaProduk,
  kategori,
  stok,
  harga,
  deskripsi,
}) => {
  const discount = Math.floor(Math.random() * 21);
  const finalPrice = harga - harga * (discount / 100);

  const formatRupiah = (value: number) =>
    value.toLocaleString("id-ID");

  return (
    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">

      {/* Badge Diskon */}
      <div className="absolute m-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        Diskon {discount}%
      </div>

      {/* Foto */}
      <div className="h-48 bg-gray-100">
        <img
          src={foto}
          alt={namaProduk}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800">
          {namaProduk}
        </h3>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaTags />
            {kategori}
          </div>
          <div className="flex items-center gap-1">
            <FaBoxes />
            {stok}
          </div>
        </div>

        {/* Harga */}
        <div className="mt-3">
          <p className="text-sm text-gray-400 line-through">
            Rp {formatRupiah(harga)}
          </p>
          <p className="text-2xl font-extrabold text-farmgreen">
            Rp {formatRupiah(finalPrice)}
          </p>
        </div>

        {/* Deskripsi */}
        <p className="mt-3 text-sm text-gray-600 mb-10 line-clamp-3">
          {deskripsi}
        </p>

        {/* CTA → selalu di bawah */}
        <button className="mt-auto w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default PromoKatalogCard;
