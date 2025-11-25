import React, { useState } from "react";
import GlassSection from "./GlassSection";
import { FaExchangeAlt, FaRecycle, FaUsers } from "react-icons/fa";
import { useFetchBankSampahByUser } from "../hooks/HandleBankSampah";
import SocialIcon from "./SocialIcon";
import ProfileImageUploader from "../organisms/ProfileImageUploader";
import CoverImageUploader from "../organisms/CoverImageUploader";
import BankSampahProfileTab from "./BankSampahProfilCard";
import PickupServicePanel from "./PickUpServicePanel";
import GlassPanel from "./GlassPanel";
import { useFetchHargaByUser } from "../hooks/UseFetchHargaSampah";
import HargaSampahPanel from "./HargaSampahPanel";
import WasteTypePanel from "./WasteTypePanel";

interface ProfilePanelProps {
  username?: string;
  role?: string;
  totalKg?: number;
  totalTransaksi?: number;
  totalAnggota?: number;
  coverPhotoUrl?: string;
  profilePhotoUrl?: string;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  totalKg = 938,
  totalTransaksi = 3586,
  totalAnggota = 2659,
}) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("/assets/img/userDefault.png");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("/assets/img/cover-image-placeholder.jpg");
  const banksampah = useFetchBankSampahByUser();
  const baseURL = import.meta.env.VITE_APP_PUBLIC_API_URL;
  const defaultDirectory = './direktori_avatar/';
  const fileName = banksampah.data?.profil_image
    ? banksampah.data.profil_image.startsWith(defaultDirectory)
      ? banksampah.data.profil_image.replace(defaultDirectory, '')
      : banksampah.data.profil_image
    : undefined;

  const avatarUrl = fileName ? `${baseURL}/avatar/${fileName}` : undefined;

  const coverFileName = banksampah.data?.cover_image
    ? banksampah.data.cover_image.startsWith(defaultDirectory)
      ? banksampah.data.cover_image.replace(defaultDirectory, '')
      : banksampah.data.cover_image
    : undefined;

  const coverUrl = fileName ? `${baseURL}/avatar/${coverFileName}` : undefined;
  const harga = useFetchHargaByUser();
  return (
    <GlassSection className="relative p-0 overflow-hidden rounded-xl">
      {/* Cover Photo */}
      <CoverImageUploader
        coverUrl={coverUrl || ''}
        fallbackUrl={coverPhotoUrl}
        onImageChange={(newCoverImg) => setCoverPhotoUrl(newCoverImg)}
      />

      {/* Main Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <ProfileImageUploader
            avatarUrl={avatarUrl || ''}
            profilePhotoUrl={profilePhotoUrl}
            onImageChange={(newImg) => setProfilePhotoUrl(newImg)}
        />

        {/* Push content down so profile photo overlaps nicely */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 items-center w-full px-4 gap-y-4 lg:gap-y-0">

        {/* Tengah - Nama (jadi order 1 di mobile, order 2 di desktop) */}
        <div className="flex flex-col items-center justify-center text-center order-1 lg:order-2">
            <h2 className="text-xl font-semibold">{banksampah.data?.nama_bank_sampah}</h2>
            <p className="text-sm text-gray-300">Bank Sampah {banksampah.data?.tipe_bank_sampah}</p>
        </div>

        {/* Kiri - Stats (order 2 di mobile, order 1 di desktop) */}
        <div className="flex justify-center space-x-8 text-center text-gray-300 order-2 lg:order-1">
            <div className="flex flex-col items-center">
                <div className="text-lg text-white">
                    <FaRecycle />
                </div>
                <p className="font-semibold text-white mt-1">{totalKg}</p>
                <p className="text-xs">Kg Waste</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="text-lg text-white">
                    <FaExchangeAlt />
                </div>
                <p className="font-semibold text-white mt-1">{totalTransaksi}</p>
                <p className="text-xs">Transaction</p>
            </div>
             <div className="flex flex-col items-center">
                <div className="text-lg text-white">
                    <FaUsers />
                </div>
                <p className="font-semibold text-white mt-1">{totalAnggota}</p>
                <p className="text-xs">Customer</p>
            </div>
        </div>

        {/* Kanan - Social + Button (tetap order 3) */}
        <div className="flex items-center justify-center space-x-4 order-3">
            <SocialIcon />
            <button className="ml-2 px-4 py-2 rounded-full border border-2 border-greenlogo hover:bg-green-700 rounded text-white font-semibold text-sm">
            Edit Profile
            </button>
        </div>

        </div>

        {/* Tabs */}
        <div className="flex w-full justify-center space-x-8 mt-8 border-t border-white/20 pt-4 text-gray-300 text-sm">
            <button className="border-b-2 border-greenlogo pb-2 font-semibold text-white">Admin Panel</button>
            <button className="hover:text-white pb-2">Customer</button>
            <button className="hover:text-white pb-2">Partner</button>
            <button className="hover:text-white pb-2">Gallery</button>
        </div>
     

      </div>
     {banksampah.data ? (
        <div className="flex w-full gap-6">
          <BankSampahProfileTab data={banksampah.data} />
          <GlassPanel className="gap-8 w-full sm:w-full md:w-2/3 lg:w-2/3 xl:w-2/3">
                <div className="flex flex-col flex-1 space-y-6">
                   <WasteTypePanel />
                   <HargaSampahPanel onReload={harga.refetch} data={harga.data} />
                   <PickupServicePanel />
                </div>
          </GlassPanel>
        </div>
        ) : (
        <p className="text-center text-red-400">Data bank sampah belum tersedia</p>
     )}
    </GlassSection>
  );
};

export default ProfilePanel;
