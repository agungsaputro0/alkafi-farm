import React, { useState, useCallback, useEffect } from "react";
import { FaCamera, FaImages, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import Cropper, { Area } from "react-easy-crop";
import { useUploadCoverImage } from "../hooks/UseUploadAvatar"; // kalau ini juga dipakai upload cover bisa pakai hook lain kalau perlu
import { notification } from "antd";
import ReactDOM from 'react-dom';

interface CoverImageUploaderProps {
  coverUrl: string;
  fallbackUrl: string;
  onImageChange: (image: string) => void;
}

const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  coverUrl,
  fallbackUrl,
  onImageChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const { uploadcover } = useUploadCoverImage(); 
  const [cover, setCover] = useState<string>(coverUrl);
  const imageDisplaySrc = cover ?? fallbackUrl;

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
      setCover(coverUrl);
  }, [coverUrl]);

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
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error("Invalid data URL");
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
    const croppedFile = dataURLtoFile(croppedDataUrl, "cover.jpg");

    const uploadResult = await uploadcover(croppedFile);
    if (uploadResult?.success) {
      notification.success({
        message: "Cover Upload Successful!",
        description: "The cover image has been updated.",
      });
    }
    onImageChange(croppedDataUrl);
    setCover(croppedDataUrl);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Cover Image Preview */}
      <div
        className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 cursor-pointer group overflow-hidden rounded-md border"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={imageDisplaySrc}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = fallbackUrl;
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaCamera className="text-white text-3xl" />
          <span className="text-white text-sm font-semibold">
            Upload Cover Image
          </span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 backdrop-blur-md rounded-lg w-full max-w-4xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Choose Cover Image</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Content */}
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
                  {/* Cropper area */}
                  <div className="relative flex-1 bg-gray-200 min-h-[360px]">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={16 / 9} // aspect ratio cover landscape
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      showGrid={true}
                    />
                  </div>

                  {/* Zoom controls */}
                  <div className="p-6 flex flex-col gap-3 bg-neutral-900">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                        className="p-3 text-black rounded-full bg-gray-300 hover:bg-gray-400 transition"
                      >
                        <FaMinus />
                      </button>

                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-greenlogo"
                      />

                      <button
                        onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                        className="p-3 text-black rounded-full bg-gray-300 hover:bg-gray-400 transition"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                      Drag and zoom to adjust
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {imageSrc && (
              <div className="px-6 pt-4 pb-8 border-t flex justify-end gap-4 bg-neutral-900">
                <button
                  className="w-28 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition"
                  onClick={() => setImageSrc(null)}
                >
                  Cancel
                </button>
                <button
                  className="w-28 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
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

export default CoverImageUploader;
