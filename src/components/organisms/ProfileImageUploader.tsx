import React, { useState, useCallback, useEffect } from "react";
import { FaCamera, FaImages, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import Cropper, { Area } from "react-easy-crop";
import { useUploadAvatar } from "../hooks/UseUploadAvatar";
import { notification } from "antd";
import ReactDOM from 'react-dom';
interface ProfileImageUploaderProps {
  avatarUrl: string;
  profilePhotoUrl: string;
  onImageChange: (image: string) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  avatarUrl,
  profilePhotoUrl,
  onImageChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const { uploadAvatar } = useUploadAvatar();
  const [avatar, setAvatar] = useState<string>(avatarUrl);
  const avatarSrc = avatar ?? profilePhotoUrl;
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    setAvatar(avatarUrl);
  }, [avatarUrl]);

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(target.files[0]);
      }
    };
    input.click();
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error('Invalid data URL');
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.src = url;
    });

  const getCroppedImg = async (): Promise<void> => {
    if (!imageSrc || !croppedAreaPixels) return;

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedDataUrl = canvas.toDataURL("image/jpeg");
    const croppedFile = dataURLtoFile(croppedDataUrl, "avatar.jpg");

    const avatarUrl = await uploadAvatar(croppedFile);
    if(avatarUrl?.success) {
        notification.success({
            message: "Avatar Upload Successful!",
            description: "The profile avatar has been updated.",
        });
    }
    onImageChange(croppedDataUrl);
    setAvatar(croppedDataUrl);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Foto profil */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-40 w-36 h-36 rounded-full border-4 border-greenlogo shadow-lg overflow-hidden group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={avatarSrc}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null; 
                      target.src = profilePhotoUrl;
                    }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaCamera className="text-white text-lg" />
          <span className="text-white text-sm font-semibold">Upload Avatar</span>
        </div>
      </div>

      {/* Modal */}
     {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 backdrop-blur-md rounded-lg w-[90%] max-w-lg overflow-hidden flex flex-col">
            {/* Header */}
           <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Choose Profile Picture</h2>
            <button
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
            >
                <FaTimes />
            </button>
          </div>

           
           {/* Isi Modal */}
            <div className="flex-1 flex flex-col">
            {!imageSrc ? (
                <div className="p-4 flex flex-col gap-4">
                  <div className="p-4 flex flex-row gap-8 justify-center">
                    <button
                      className="border border-2 border-blue-600 hover:bg-blue-600 text-white py-4 px-4 rounded-lg shadow flex flex-col items-center gap-3"
                      onClick={openFilePicker}
                    >
                      <FaImages size={20} />
                      Select from Gallery
                    </button>

                    <button
                      className="border border-2 border-green-600 hover:bg-green-600 text-white py-4 px-4 rounded-lg shadow flex flex-col items-center gap-3"
                      onClick={() => alert("Ambil dari kamera belum dibuat")}
                    >
                      <FaCamera size={20} />
                      Take from Camera
                    </button>
                  </div>
                <div className="border-t pt-4 flex justify-end">
                  <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg flex items-center gap-2"
                      onClick={() => setIsModalOpen(false)}
                  >
                      <FaTimes size={18} />
                      Cancel
                  </button>
                </div>

                </div>
            ) : (
                <>
                {/* Area Crop */}
                <div className="relative flex-1 bg-gray-200 min-h-[300px]">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Slider Zoom */}
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        {/* Tombol Zoom Out */}
                        <button
                            onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
                            className="p-2 text-black rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        >
                            <FaMinus />
                        </button>

                        {/* Slider */}
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-greenlogo"
                        />

                        {/* Tombol Zoom In */}
                        <button
                            onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                            className="p-2 text-black rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {/* Keterangan di bawah slider */}
                    <p className="text-sm text-gray-500 text-center">
                        Drag and zoom to adjust
                    </p>
                </div>

                </>
            )}
            </div>

            {/* Footer */}
            {imageSrc && (
              <div className="px-4 py-3 border-t flex justify-end gap-2">
                <button
                    className="w-24 bg-gray-300 text-black py-2 rounded"
                    onClick={() => setImageSrc(null)}
                >
                    Cancel
                </button>
                <button
                    className="w-24 bg-blue-500 text-white py-2 rounded"
                    onClick={getCroppedImg}
                >
                    Save
                </button>
                </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProfileImageUploader;
