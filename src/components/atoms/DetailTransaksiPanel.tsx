import { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { LuShoppingBag } from "react-icons/lu";
import dayjs from "dayjs";

const DetailTransaksiPanel = ({ dataTransaksi }: { dataTransaksi: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, dataTransaksi]);

  const leftFields = [
    { label: "Nama Pembeli", value: dataTransaksi?.namaPembeli },
    { label: "Nomor HP", value: dataTransaksi?.nomorHandphone },
    { label: "Alamat", value: dataTransaksi?.alamat },
    { label: "Kanal Transaksi", value: dataTransaksi?.kanalTransaksi },
  ];

  const rightFields = [
    { label: "Metode Pembayaran", value: dataTransaksi?.metodePembayaran },
    {
    label: "Tanggal Transaksi",
    value: dataTransaksi?.tanggalTransaksi
        ? dayjs(dataTransaksi.tanggalTransaksi).format("DD-MM-YYYY")
        : "-",
    },
    { label: "Status", value: dataTransaksi?.status },
    {
         label: "Biaya Kirim",
  value: Number(dataTransaksi?.biayaKirim || 0).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
    }
  ];

  return (
    <div className="p-6 mb-6 rounded-2xl bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-2xl flex gap-2 justify-start items-center font-bold text-farmdarkestbrown"><LuShoppingBag /> Detail Transaksi</h2>
        <span className="text-farmdarkestbrown">
          {isOpen ? <IoChevronUp size={20} /> : <IoChevronDown size={20} />}
        </span>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        {dataTransaksi ? (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {/* Tabel Kiri */}
            <table className="w-full text-sm text-[#724e3a] border-separate border-spacing-y-2">
              <tbody>
                {leftFields.map((field) => (
                  <tr key={field.label}>
                    <td className="font-semibold w-36">{field.label}</td>
                    <td>:</td>
                    <td>{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tabel Kanan */}
            <table className="w-full text-sm text-[#724e3a] border-separate border-spacing-y-2">
              <tbody>
                {rightFields.map((field) => (
                  <tr key={field.label}>
                    <td className="font-semibold w-36">{field.label}</td>
                    <td>:</td>
                    <td>{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-3 text-sm text-[#724e3a]">Data transaksi tidak ditemukan</div>
        )}
      </div>
    </div>
  );
};

export default DetailTransaksiPanel;
