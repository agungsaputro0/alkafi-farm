import { FC } from "react";

interface EventCardProps {
  foto: string;
  judul: string;
  deskripsi: string;
  ctaLabel: string;
}

const EventCard: FC<EventCardProps> = ({
  foto,
  judul,
  deskripsi,
  ctaLabel,
}) => {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Foto */}
      <div className="h-44 bg-gray-200">
        <img
          src={foto}
          alt={judul}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[220px]">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {judul}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-4">
            {deskripsi}
          </p>
        </div>

        <button className="mt-4 bg-farmdarkgreen text-white py-2 rounded-lg hover:bg-gray-800 transition">
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
