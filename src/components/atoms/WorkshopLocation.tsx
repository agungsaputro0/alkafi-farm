import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

const WorkshopLocation: React.FC = () => {
  const [showMap, setShowMap] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setShowMap(true);
    const handleOffline = () => setShowMap(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleIframeError = () => {
    setShowMap(false);
  };

  return (
    <div>
      {showMap ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15810.426483377752!2d109.99728974068572!3d-7.831391667330925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7ae700648ea559%3A0xf744191936777d43!2sALKAFI%20FARM!5e0!3m2!1sen!2sid!4v1759996850376!5m2!1sen!2sid"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Workshop Location"
          className="rounded-lg"
          onError={handleIframeError} // fallback kalau iframe error
        ></iframe>
      ) : (
        <div className="bg-farmLiteGold p-6 rounded-lg text-center">
          <span className="text-xs bg-white px-2 py-1 rounded-full inline-block mb-2">
            Lokasi Peternakan kami
          </span>
          <div className="text-farmdarkestbrown text-2xl flex flex-col items-center gap-2 mt-2">
            <IoLocationOutline size={36} />
            003/003 Bugel, Bagelen, Jawa Tengah, Indonesia 54174
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopLocation;
