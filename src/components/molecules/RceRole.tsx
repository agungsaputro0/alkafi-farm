import React from "react";
import { FaChartLine, FaDatabase, FaBalanceScale, FaHandshake } from "react-icons/fa";

const roles = [
  {
    icon: <FaChartLine className="text-kemenkeuyellow text-2xl" />,
    title: "Kajian Fiskal Regional",
    description:
      "Meningkatkan kualitas analisis fiskal daerah, tidak hanya deskriptif tapi juga menghasilkan rekomendasi kebijakan yang bermanfaat.",
  },
  {
    icon: <FaDatabase className="text-kemenkeuyellow text-2xl" />,
    title: "Pemanfaatan Data",
    description:
      "Memperkuat kapasitas dan pemanfaatan data fiskal, APBN, APBD, serta indikator makroekonomi di tingkat regional.",
  },
  {
    icon: <FaBalanceScale className="text-kemenkeuyellow text-2xl" />,
    title: "Keselarasan Kebijakan",
    description:
      "Meningkatkan sinergi kebijakan fiskal pusat-daerah, sekaligus mendukung pembangunan dan prioritas nasional.",
  },
  {
    icon: <FaHandshake className="text-kemenkeuyellow text-2xl" />,
    title: "Peningkatan Kinerja Ekonomi",
    description:
      "Memberikan kontribusi aktif dalam mendukung pertumbuhan ekonomi daerah serta peningkatan kesejahteraan masyarakat.",
  },
];

const RceRole: React.FC = () => {
  return (
    <section className="w-full bg-[#002147] py-16 px-6">
      <div className="max-w-7xl px-6 py-10 mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left - Text & Roles */}
        <div className="w-full md:w-1/2 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Peran Regional Chief Economist
          </h2>
          <p className="text-gray-300 mb-8">
            RCE hadir sebagai penajaman peran Kanwil DJPb dalam analisis fiskal 
            dan makroekonomi untuk mendukung kebijakan keuangan negara di daerah.
          </p>

          <div className="flex flex-col gap-6">
            {roles.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-full shadow">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-kemenkeuyellow">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-200 text-justify">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/assets/img/rce-illustration.jpg"
            alt="Regional Chief Economist"
            className="rounded-xl object-cover w-full h-full max-h-[400px]"
          />
          <p className="text-sm text-gray-400 mt-3 text-justify">
            “Sebagai mitra strategis pemerintah daerah, RCE berperan penting 
            dalam menjembatani kebijakan fiskal pusat dan kebutuhan daerah.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default RceRole;
