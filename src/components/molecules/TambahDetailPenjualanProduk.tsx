import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainPanel from "../atoms/MainPanel";
import WhiteSection from "../atoms/WhiteSection";
import Button from "../atoms/Button";
import { decryptData } from "../utils/Encryptor";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { FaBoxes, FaBoxOpen, FaPlus, FaTrash } from "react-icons/fa";
import DetailTransaksiPanel from "../atoms/DetailTransaksiPanel";
import PilihKatalogModal from "./PilihKatalogModal";

interface ProdukItem {
  namaProduk: string;
  qty: number;
  hargaSatuan: number;
  diskon: number;
  stok: number;   // stok sebagai number
  tipe: string;   // hewan / barang
}



const TambahDetailPenjualanProduk = () => {
  const { idTransaksi: encryptedId } = useParams();
  const navigate = useNavigate();

  const [idTransaksi, setIdTransaksi] = useState<string>("");
  const [dataTransaksi, setDataTransaksi] = useState<any>(null);
  const [produkList, setProdukList] = useState<ProdukItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [biayaKirim, setBiayaKirim] = useState<number>(0);

  useEffect(() => {
    if (!encryptedId) return;

    const decryptedId = decryptData(encryptedId);
    setIdTransaksi(decryptedId);

    const storedData =
      JSON.parse(localStorage.getItem("transaksiData") || "[]") || [];
    const transaksi = storedData.find((t: any) => t.idTransaksi === decryptedId);
    if (transaksi) {
      setDataTransaksi(transaksi);
      setBiayaKirim(transaksi.biayaKirim || 0);
    }
  }, [encryptedId]);

  const subtotal = produkList.reduce(
    (acc, item) => acc + (item.hargaSatuan * item.qty - item.diskon),
    0
  );
  const grandTotal = Number(subtotal) + Number(biayaKirim);

 const handlePilihKatalog = (katalog: any) => {
  const stokAngka = Number(katalog.stok.replace(/\D/g, "")) || 1;
  const hargaSatuan = Number(katalog.harga.replace(/\./g, "").replace(/,/g, ""));

  setProdukList(prev => {
    const index = prev.findIndex(p => p.namaProduk === katalog.namaProduk);
    if (index >= 0) {
      // produk sudah ada, tambahkan qty jika belum maksimal
      const newList = [...prev];
      if (newList[index].qty < stokAngka) {
        newList[index].qty += 1;
      } else {
        toast.info("Qty sudah mencapai stok maksimal!");
      }
      return newList;
    } else {
      // produk belum ada, langsung tambah
      const newItem: ProdukItem = {
        namaProduk: katalog.namaProduk,
        qty: 1,
        hargaSatuan,
        diskon: 0,
        tipe: katalog.tipe,
        stok: stokAngka,
      };
      return [...prev, newItem];
    }
  });

  setIsModalOpen(false);
};


const formatRupiah = (num: number) => {
  return num.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
};

  const handleSimpan = async () => {
  if (produkList.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Belum ada produk",
      text: "Tambahkan minimal 1 produk sebelum menyimpan.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  const result = await Swal.fire({
    title: "<span>Yakin ingin menyimpan detail transaksi?</span>",
    text: "Pastikan semua data sudah benar.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Simpan",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      const storedData = JSON.parse(localStorage.getItem("transaksiData") || "[]") || [];
      const idx = storedData.findIndex((t: any) => t.idTransaksi === idTransaksi);
      if (idx >= 0) {
        storedData[idx].produkList = produkList;
        storedData[idx].subtotal = subtotal;
        storedData[idx].grandTotal = grandTotal;
      } else {
        storedData.push({
          idTransaksi,
          produkList,
          subtotal,
          grandTotal,
          biayaKirim,
        });
      }
      localStorage.setItem("transaksiData", JSON.stringify(storedData));

      toast.success(<div><strong>Sukses!</strong> <div>Detail transaksi berhasil disimpan!</div></div>);
      setTimeout(() => navigate("/transaksi"), 1000);
    } catch (error) {
      toast.error(<div><strong>Gagal menyimpan!</strong> <div>Cek kembali data Anda!</div></div>);
    }
  }
};


  return (
    <section className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: "80px" }}>
      <MainPanel>
        <div className="px-6">
          <p className="text-white font-semibold">
            <span
              onClick={() => navigate("/transaksi")}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
              Penjualan Produk •{" "}
            </span>
            <span
              onClick={() => navigate(-1)}
              className="text-white/50 hover:text-kemenkeuyellow cursor-pointer"
            >
            Tambah Data Penjualan •{" "}
            </span>
             Detail Penjualan Produk
          </p>
        </div>

        {/* Panel Putih: Table Produk */}
        <WhiteSection>
            <div className="p-8 bg-[#fffdf9]/90 rounded-2xl shadow-lg border border-gray-100">
        <DetailTransaksiPanel dataTransaksi={dataTransaksi} />
        <div className="flex items-center gap-4 pb-5 mb-6 border-b-2 border-farmLightOrange bg-gradient-to-r from-farmlighestbrown to-farmBoldPeach rounded-xl p-4 shadow-sm">
                      <FaBoxes className="text-6xl text-farmdarkestbrown" />
                      <div>
                        <h2 className="text-2xl font-extrabold text-farmdarkestbrown font-spring tracking-wide drop-shadow-sm">
                          Tambah Detail Penjualan Produk
                        </h2>
                        <p className="text-sm text-[#724e3a]">
                          Lengkapi informasi berikut untuk menambahkan data detail transaksi penjualan produk.
                        </p>
                      </div>
                    </div>
          <div className="p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-farmdarkestbrown">Produk Dijual</h3>
              <Button
                type="button"
                onClick={() => setIsModalOpen(true)}
                variant="bg-farmbrown hover:bg-farmdarkestbrown text-white flex gap-2 items-center justify-center px-4 py-2 rounded-full"
              >
                <FaPlus /> Tambah Produk Dijual
              </Button>
            </div>

            <table className="min-w-full border border-farmdarkbrown text-farmdarkestbrown bg-[#fffefc] rounded-lg shadow-sm">
                <thead className="bg-gradient-to-r from-farmLightOrange to-farmLighterOrange text-center font-semibold text-farmdarkestbrown">
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-3 border text-center">Nama Produk</th>
                  <th className="py-2 px-3 border text-center">Qty</th>
                  <th className="py-2 px-3 border text-center">Harga Satuan</th>
                  <th className="py-2 px-3 border text-center">Diskon (%)</th>
                  <th className="py-2 px-3 border text-center">Subtotal</th>
                  <th className="py-2 px-3 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
  {produkList.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center border py-8 text-gray-400">
        <div className="flex flex-col items-center justify-center">
          <FaBoxOpen className="text-5xl mb-2" />
          Belum ada produk ditambahkan
        </div>
      </td>
    </tr>
  ) : (
    produkList.map((item, idx) => (
      <tr key={idx} className="border-b border-gray-200">
        <td className="py-2 px-3 border text-center">{item.namaProduk}</td>
        <td className="py-2 px-3 border text-center">
          <input
            type="number"
            min={1}
            max={item.stok}
            value={item.qty}
            onChange={(e) => {
                let val = Number(e.target.value);
                if (val > item.stok) val = item.stok; // batasi maksimal stok
                setProdukList(prev => {
                const newList = [...prev];
                newList[idx].qty = val;
                return newList;
                });
            }}
            className="w-16 text-center border rounded"
            disabled={item.qty === 1 && item.tipe === "hewan"}
            />
        </td>
        <td className="py-2 px-3 border text-center">{formatRupiah(item.hargaSatuan)}</td>
        <td className="py-2 px-3 border text-center">
          <input
            type="number"
            min={0}
            max={100}
            value={item.diskon}
            onChange={(e) => {
              const val = Number(e.target.value);
              setProdukList((prev) => {
                const newList = [...prev];
                newList[idx].diskon = val;
                return newList;
              });
            }}
            className="w-16 text-center border rounded"
          />
        </td>
        <td className="py-2 px-3 border text-center">
          {formatRupiah((item.hargaSatuan * item.qty) - (item.hargaSatuan * item.qty * item.diskon / 100))}
        </td>
        <td className="py-2 px-3 border text-center">
          <Button
            type="button"
            variant="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded-lg"
            onClick={() =>
              setProdukList((prev) => prev.filter((_, i) => i !== idx))
            }
          >
            <FaTrash />
          </Button>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>

            {/* Summary */}
            <div className="mt-4 space-y-2 text-right">
              <div className="flex justify-between"><span>Subtotal:</span> <span>{formatRupiah(subtotal)}</span></div>
              <div className="flex justify-between"><span>Biaya Kirim:</span> <span>{formatRupiah(Number(biayaKirim))}</span></div>
              <div className="flex justify-between font-bold"><span>Grand Total:</span> <span>{formatRupiah(grandTotal)}</span></div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                variant="bg-farmbrown w-full hover:bg-farmdarkestbrown text-white px-8 py-3 rounded-full"
                onClick={handleSimpan}
              >
                Simpan
              </Button>
            </div>
          </div>
          </div>
        </WhiteSection>
      </MainPanel>
       <PilihKatalogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handlePilihKatalog}
                produkList={produkList}
            />
    </section>
  );
};

export default TambahDetailPenjualanProduk;
