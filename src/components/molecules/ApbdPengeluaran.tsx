import { useEffect, useState } from 'react';
import InputElement from '../atoms/InputElement';
import MainPanel from '../atoms/MainPanel';
import WhiteSection from '../atoms/WhiteSection';
import { monthOptions } from '../types/MonthOptions';
import SearchableSelect from '../atoms/SearchAbleSelectElement';
import { useFetchProvinsi, useFetchInstansi } from '../hooks/HandleSignUp';
import dayjs from "dayjs";
import { useFetchPosByInstansi, useRetrievePos } from '../hooks/HandleFeda';
import UniversalFormFeda from './UniversalFormFeda';
import InlineSpinner from '../atoms/InlineSpinner';

const ApbdPengeluaran = () => {
  const menuKey = import.meta.env.VITE_FOURTH_KEY;
  const [tahun, setTahun] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedInstance, setSelectedInstance] = useState<string>("0");
  const [instance, setInstance] = useState<string>("");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>("0");
  const [kantor, setKantor] = useState<string>("");
  
  const { posList, loading: posLoading, error: posError } = useFetchPosByInstansi(
    selectedInstance !== "0" ? selectedInstance : null,
    menuKey
  );
  
  const handleInstanceChange = (option: any) => {
    const instansiId = option?.value || "0";
    const instansiLabel = option?.label || "";
    setSelectedInstance(instansiId);
    setInstance(instansiLabel);
  };
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);
  const [provinsiSearchTerm, setprovinsiSearchTerm] = useState('');
  const [instansiSearchTerm, setinstansiSearchTerm] = useState('');
  const [province, setProvince] = useState<string>("");
  const { provinsi } = useFetchProvinsi(provinsiSearchTerm);
  const { instansi } = useFetchInstansi(instansiSearchTerm);
  const handleMonthChange = (option: any) => {
    setSelectedMonth(option?.value || "");
  };

  const provinsiOptions = [
    { value: '0', label: 'Klik Disini' }, // Default option
      ...provinsi.map((item) => ({
      value: item.id,
      label: item.name.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '), 
    })),
  ];

   const instansiOptions = [
    { value: '0', label: 'Klik Disini' }, // Default option
      ...instansi.map((item) => ({
      value: item.id,
      label: item.name.toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '), 
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
      kantor.length >= 5;  
   const { fetchPos, data: posData, loading: retrieveLoading } = useRetrievePos(); 
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
  }, [isFormReady, posLoading, posError, posList, tahun, selectedMonth, selectedInstance, province, kantor]);
  

  return (
    <section>
      <div className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: '80px' }}>
        <MainPanel>
          <WhiteSection>
           <div className="relative p-0 mb-[-20px]  rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full md:col-span-3">
                 <div className="w-full bg-white/10 backdrop-blur-md p-6 text-white mb-6">
                    <div className="border-b  border-slate-400 pb-4">
                        <h2 className="text-4xl font-bold text-kemenkeudarkerblue">
                            Modul FEDA - APBD Pengeluaran
                        </h2>
                        <span className="text-kemenkeublue text-sm italic">Financial & Economics Data Gateway</span>
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
                            tooltipText="Jika tidak ada di daftar, Silakan ketik nama Provinsi, lalu pilih dari daftar yang muncul."
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
                            tooltipText="Jika tidak ada di daftar, Silakan ketik nama Instansi, lalu pilih dari daftar yang muncul."
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
                            onChange={(e: any) => setKantor(e.target.value)}
                        />
                    </div>
                    {!isFormReady && (
                        <div className="w-full flex justify-center mb-4">
                          <span className="text-gray-400 font-semibold text-center">
                            Silakan pilih Tahun, Bulan, Provinsi, dan Unit Eselon terlebih dahulu
                          </span>
                        </div>
                      )}

                      {/* Render Form */}
                      {isFormReady && !posLoading && !posError && posList.length > 0 && showDelayedLoading && (
                        <InlineSpinner />
                      )}

                      {/* Render Form */}
                      {isFormReady && !posLoading && !posError && posList.length > 0 && !showDelayedLoading && !retrieveLoading && posData && (
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

                    {/* Error state */}
                    {posError && isFormReady && (
                      <div className="w-full flex justify-center mb-4">
                        <span className="text-red-500 font-semibold text-center">
                          {posError}
                        </span>
                      </div>
                    )}

                    {/* {!["0", "8"].includes(selectedInstance) && (
                        <div className="w-full flex justify-center mb-4">
                            <span className="text-gray-400 font-semibold text-center">Form Sedang dalam Pengembangan</span>
                        </div>
                    )} */}
                 </div>
              </div>
           </div>
          </WhiteSection>
        </MainPanel>
      </div>
    </section>
  );
};

export default ApbdPengeluaran;
