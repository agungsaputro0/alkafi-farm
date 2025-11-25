import React from "react";
import GlassPanel from "./GlassPanel";
import { FaBuilding, FaCity, FaClock, FaMapMarkerAlt, FaPhone, FaRulerCombined } from "react-icons/fa";
import SchedulePanel from "./SchedulePanel";

interface BankSampahProfile {
  uid: string;
  tipe_bank_sampah: string;
  nama_bank_sampah: string;
  alamat: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kontak?: string;
  jam_buka?: string | null;
  jam_tutup?: string | null;
  kapasitas?: number | null;
  profil_image?: string;
  cover_image?: string;
  koordinat_lokasi?: string; 
}

interface Props {
  data: BankSampahProfile;
}

const parseCoordinates = (coordStr?: string) => {
  if (!coordStr) return null;
  // hapus kurung dan split
  const cleaned = coordStr.replace(/[()]/g, "");
  const parts = cleaned.split(",");
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0].trim());
  const lng = parseFloat(parts[1].trim());
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
};

const toTitleCase = (str?: string | null) => {
  if (!str || str.trim() === "") return "-";
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Fungsi untuk format kapasitas (number) jadi string atau "-"
const formatKapasitas = (num?: number | null) => {
  if (num === null || num === undefined) return "-";
  return num.toString();
};

const BankSampahProfileTab: React.FC<Props> = ({ data }) => {
  const coords = parseCoordinates(data.koordinat_lokasi);

  return (
   <GlassPanel className="gap-8 w-full sm:w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
      {/* Kiri: Data dan Maps */}
      <div className="flex flex-col flex-1 space-y-6">
        {/* Card Data Bank Sampah */}
        <div className="bg-white/10 rounded-xl p-5 shadow-md flex flex-col space-y-4 text-cyan-100">
          <h1 className="text-3xl border-b border-white pb-4 font-bold text-white">About</h1>

          <div className="space-y-4 text-sm text-cyan-100">

        {/* Alamat */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaMapMarkerAlt /> Full Address
            </p>
            <p className="ml-[22px]">{toTitleCase(data.alamat)}</p>
        </div>

        {/* Kecamatan */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaBuilding /> Subdistrict
            </p>
            <p className="ml-[22px]">{toTitleCase(data.kecamatan)}</p>
        </div>

        {/* Kabupaten */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaCity /> Regency
            </p>
            <p className="ml-[22px]">{toTitleCase(data.kabupaten)}</p>
        </div>

        {/* Provinsi */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaCity /> Province
            </p>
            <p className="ml-[22px]">{toTitleCase(data.provinsi)}</p>
        </div>

        {/* Kontak */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaPhone /> Contact
            </p>
            <p className="ml-[22px]">{toTitleCase(data.kontak || "-")}</p>
        </div>

        {/* Jam Buka */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaClock /> Opening hours
            </p>
            <p className="ml-[22px]">{toTitleCase(data.jam_buka || "-")}</p>
        </div>

        {/* Jam Tutup */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaClock /> Closing time
            </p>
            <p className="ml-[22px]">{toTitleCase(data.jam_tutup || "-")}</p>
        </div>

        {/* Kapasitas */}
        <div>
            <p className="flex items-center gap-2 font-semibold text-greenlogo">
            <FaRulerCombined /> Capacity
            </p>
            <p className="ml-[22px]">{formatKapasitas(data.kapasitas)}</p>
        </div>

        </div>

        </div>

        {/* Google Maps Embedded */}
        {coords && (
          <>
          <div>
            <p className="flex items-center gap-2 font-semibold border-b border-white pb-4">
            <FaMapMarkerAlt /> Location
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-cyan-400 w-full">
            <iframe
              title="Lokasi Bank Sampah"
              src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=id&z=15&output=embed`}
              width="100%"
              height="250"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          </>
        )}
        <SchedulePanel />
      </div>
      {/* Kanan: Kosong atau bisa dikembangkan sesuai kebutuhan */}
    </GlassPanel>
  );
};

export default BankSampahProfileTab;
