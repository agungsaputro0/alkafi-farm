import { useEffect, useState } from 'react';
import InputElement from '../atoms/InputElement';
import MainPanel from '../atoms/MainPanel';
import WhiteSection from '../atoms/WhiteSection';
import { monthOptions } from '../types/MonthOptions';
import SearchableSelect from '../atoms/SearchAbleSelectElement';
import { useFetchProvinsi, useFetchInstansi, useFetchPosByInstansi } from '../hooks/HandleFeda';
import dayjs from "dayjs";
import UniversalFormFeda from './UniversalFormFeda';
import InlineSpinner from '../atoms/InlineSpinner';
import { useRetrievePos } from '../hooks/HandleFeda'; // ⬅️ hook baru

const ApbnPendapatan = () => {
  const menuKey = import.meta.env.VITE_FIRST_KEY;
  // 🔹 State untuk 5 input
  const [tahun, setTahun] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [instance, setInstance] = useState<string>("");
  const [selectedInstance, setSelectedInstance] = useState<string>("0");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>("0");
  const [province, setProvince] = useState<string>("");
  const [kantor, setKantor] = useState<string>("");

  const { posList, loading: posLoading, error: posError } = useFetchPosByInstansi(
    selectedInstance !== "0" ? selectedInstance : null,
    menuKey
  );

  const { fetchPos, data: posData, loading: retrieveLoading } = useRetrievePos();

  const handleInstanceChange = (option: any) => {
    const instansiId = option?.value || "0";
    const instansiLabel = option?.label || "";
    setSelectedInstance(instansiId);
    setInstance(instansiLabel);
  };
      
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);
  const [provinsiSearchTerm, setprovinsiSearchTerm] = useState("");
  const [instansiSearchTerm, setinstansiSearchTerm] = useState("");
  const { provinsi } = useFetchProvinsi(provinsiSearchTerm);
  const { instansi } = useFetchInstansi(instansiSearchTerm);
  
  const handleMonthChange = (option: any) => {
    setSelectedMonth(option?.value || "");
  };

  const provinsiOptions = [
    { value: "0", label: "Klik Disini" },
    ...provinsi.map((item) => ({
      value: item.id,
      label: item.name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    })),
  ];

  const instansiOptions = [
    { value: "0", label: "Klik Disini" },
    ...instansi.map((item) => ({
      value: item.id,
      label: item.name
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    })),
  ];

  const handleProvinsiSearchChange = (newprovinsiSearchTerm: string) => {
    setprovinsiSearchTerm(newprovinsiSearchTerm);
  };

  const handleProvinsiChange = (selectedOption: { value: string; label: string }) => {
    const provinsiID = selectedOption.value;
    const province = selectedOption.label;
    setSelectedProvinsi(provinsiID);
    setProvince(province)
  };

  const handleInstansiSearchChange = (newinstansiSearchTerm: string) => {
    setinstansiSearchTerm(newinstansiSearchTerm);
  };

  const isFormReady =
    tahun &&
    selectedMonth &&
    selectedProvinsi !== "0" &&
    selectedInstance !== "0" &&
    kantor.length >= 5;   // ⬅️ syarat kantor min. 5 karakter

  // 🔹 Panggil retrieve_pos jika form valid
  useEffect(() => {
    if (isFormReady && !posLoading && !posError && posList.length > 0) {
      setShowDelayedLoading(true);
      const timer = setTimeout(() => {
        setShowDelayedLoading(false);

        fetchPos({
          tahun: Number(tahun),
          bulan: Number(selectedMonth),
          id_instansi: selectedInstance,
          provinsi: selectedProvinsi,
          kantor: kantor,
          id_kodifikasi: menuKey,
          id_tab: null
        });

      }, 700);

      return () => clearTimeout(timer);
    }
  }, [isFormReady, posLoading, posError, posList, tahun, selectedMonth, selectedInstance, selectedProvinsi, kantor]);

  return (
    <section>
      <div
        className="pt-16 flex justify-center mb-20 mx-4"
        style={{ paddingLeft: "80px" }}
      >
        <MainPanel>
          <WhiteSection>
            <div className="relative p-0 mb-[-20px]  rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full md:col-span-3">
                <div className="w-full bg-white/10 backdrop-blur-md p-6 text-white mb-6">
                  <div className="border-b  border-slate-400 pb-4">
                    <h2 className="text-4xl font-bold text-kemenkeudarkerblue">
                      Modul FEDA - APBN Pendapatan
                    </h2>
                    <span className="text-kemenkeublue text-sm italic">
                      Financial & Economics Data Gateway
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-4 py-4">
                    <InputElement
                      inputClass="mb-6"
                      forwhat="tahun"
                      labelMessage="Tahun"
                      typeInput="year"
                      inputName="tahun"
                      inputPlaceholder="Klik Disini"
                      value={tahun ? dayjs(tahun, "YYYY") : null} 
                      onChange={(_, dateString) => setTahun(dateString)} 
                    />

                    <SearchableSelect
                      inputClass="mb-6"
                      forwhat="bulan"
                      labelMessage="Bulan"
                      placeholder="Klik Disini"
                      options={monthOptions}
                      value={selectedMonth}
                      name="bulan"
                      onChange={handleMonthChange}
                    />

                    <SearchableSelect
                      inputClass="mb-6"
                      forwhat="provinsi"
                      placeholder="Klik Disini"
                      labelMessage="Provinsi"
                      id="provinsi"
                      name="provinsi"
                      value={selectedProvinsi}
                      onChange={handleProvinsiChange}
                      options={provinsiOptions}
                      onSearch={handleProvinsiSearchChange}
                      isReady={true}
                    />

                    <SearchableSelect
                      inputClass="mb-6"
                      forwhat="instansi"
                      labelMessage="Unit Eselon"
                      placeholder="Klik Disini"
                      options={instansiOptions}
                      value={selectedInstance}
                      name="instansi"
                      onSearch={handleInstansiSearchChange}
                      onChange={handleInstanceChange}
                      isReady={true}
                    />

                    <InputElement
                      inputClass="mb-6"
                      forwhat="kantor"
                      labelMessage="Kantor"
                      typeInput="text"
                      inputName="kantor"
                      inputPlaceholder="Kantor Anda"
                      value={kantor}
                      onChange={(e: any) => setKantor(e.target.value)}
                    />
                  </div>

                  {!isFormReady && (
                    <div className="w-full flex justify-center mb-4">
                      <span className="text-gray-400 font-semibold text-center">
                        Silakan pilih Tahun, Bulan, Provinsi, Unit Eselon, dan isi Kantor minimal 5 karakter
                      </span>
                    </div>
                  )}

                  {isFormReady && (showDelayedLoading || retrieveLoading) && (
                    <InlineSpinner />
                  )}

                  {isFormReady && !showDelayedLoading && !retrieveLoading && posData && (
                    <UniversalFormFeda
                      tahun={tahun}
                      bulan={selectedMonth}
                      provinsi={selectedProvinsi}
                      provinsiText={province}
                      instansi={selectedInstance}
                      kantor={kantor}
                      posList={posList}
                      loadingPos={posLoading}
                      errorPos={posError}
                      title={instance}
                      menuKey={menuKey}
                      posData={posData}
                    />
                  )}

                  {posError && isFormReady && (
                    <div className="w-full flex justify-center mb-4">
                      <span className="text-red-500 font-semibold text-center">
                        {posError}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </WhiteSection>
        </MainPanel>
      </div>
    </section>
  );
};

export default ApbnPendapatan;
