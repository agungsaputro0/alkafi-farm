import React, {useState} from "react";
import Button from "../atoms/Button";
import InflasiPanel from "./InflasiPanel";

interface FedaEkonomiRegionalInflasiProps {
  tahun: string;
  provinsi: string;
  provinsiText?: string;
  instansi: string;
  instansiText?: string;
  kantor: string;
}

const FedaEkonomiRegionalInflasi: React.FC<FedaEkonomiRegionalInflasiProps> = ({
  tahun,
  provinsi,
  provinsiText,
  instansi,
  instansiText,
  kantor,
}) => {
  const [loading, _setLoading] = useState<boolean>(false);
  console.log(tahun + provinsi + provinsiText + instansi + kantor);
  return (
    <>
    <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">{instansiText}</h2>
       <form /* onSubmit={handleFormSubmit} onKeyDown={handleKeyDown} */>
        <div className="grid grid-cols-1 gap-y-4">
            <InflasiPanel />
            <div className="col-span-1">
                <h2 className="font-semibold mb-2 text-gray-800">Summary Report</h2>
                <textarea
                className="w-full min-h-[42px] border-2 border-gray-500 rounded-xl p-2 text-black"
                rows={3}
                placeholder="Masukkan ringkasan laporan"
                />
            </div>
            <Button
                    type="submit"
                    variant="bg-kemenkeuyellow w-full hover:bg-amber-600 mt-4"
                    disabled={loading}
                    message="Submit"
               />
        </div>
      </form>
    </>
  );
};

export default FedaEkonomiRegionalInflasi;
