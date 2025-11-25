import { useEffect, useState } from 'react';
import InputElement from '../atoms/InputElement';
import MainPanel from '../atoms/MainPanel';
import WhiteSection from '../atoms/WhiteSection';
import SearchableSelect from '../atoms/SearchAbleSelectElement';
import { useFetchProvinsi, useFetchInstansi } from '../hooks/HandleSignUp';
import dayjs from "dayjs";
import UniversalMonthlyFormFeda from './UniversalMonthlyFormFeda';
import { useFetchPosByInstansi } from '../hooks/HandleFeda';
import InlineSpinner from '../atoms/InlineSpinner';

const EkonomiRegionalInflasi = () => {
  const menuKey = import.meta.env.VITE_SEVENTH_KEY;
  const [tahun, setTahun] = useState<string>("");
  const [selectedInstance, setSelectedInstance] = useState<string>("0");
  const [instance, setInstance] = useState<string>("");
  const [selectedProvinsi, setSelectedProvinsi] = useState<string>('0');
  const [province, setProvince] = useState<string>("");
  const [provinsiSearchTerm, setprovinsiSearchTerm] = useState('');
  const [instansiSearchTerm, setinstansiSearchTerm] = useState('');
  const [kantor, setKantor] = useState<string>("");
  const { provinsi } = useFetchProvinsi(provinsiSearchTerm);
  const { instansi } = useFetchInstansi(instansiSearchTerm);
  const { posList, loading: posLoading, error: posError } = useFetchPosByInstansi(
      selectedInstance !== "0" ? selectedInstance : null,
      menuKey
  );

  const [showDelayedForm, setShowDelayedForm] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [delayedFormProps, setDelayedFormProps] = useState<null | Parameters<typeof UniversalMonthlyFormFeda>[0]>(null);

  const handleInstanceChange = (option: any) => {
    const instansiId = option?.value || "0";
    const instansiLabel = option?.label || "";
    setSelectedInstance(instansiId);
    setInstance(instansiLabel);
  };

  const provinsiOptions = [
    { value: '0', label: 'Klik Disini' },
    ...provinsi.map((item) => ({
      value: item.id,
      label: item.name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    }))
  ];

  const instansiOptions = [
    { value: '0', label: 'Klik Disini' },
    ...instansi.map((item) => ({
      value: item.id,
      label: item.name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    }))
  ];

  const handleProvinsiChange = (selectedOption: { value: string; label: string }) => {
    setSelectedProvinsi(selectedOption.value);
    setProvince(selectedOption.label);
  };

  const isFormReady = tahun && selectedProvinsi !== "0" && selectedInstance !== "0" && kantor.length >= 5;

  useEffect(() => {
    if (!isFormReady || instance !== "Direktorat Jenderal Perbendaharaan") {
      setShowDelayedForm(false);
      setIsLoadingForm(false);
      setDelayedFormProps(null);
      return;
    }

    setIsLoadingForm(true);
    setShowDelayedForm(false);
    setDelayedFormProps(null);

    const timer = setTimeout(() => {
      setDelayedFormProps({
        tahun,
        provinsi: selectedProvinsi,
        provinsiText: province,
        instansi: selectedInstance,
        kantor,
        posList,
        loadingPos: posLoading,
        errorPos: posError,
        title: instance,
        menuKey,
      });
      setShowDelayedForm(true);
      setIsLoadingForm(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [tahun, selectedProvinsi, selectedInstance, kantor, instance, posList, posLoading, posError, province]);

  return (
    <section>
      <div className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: '80px' }}>
        <MainPanel>
          <WhiteSection>
            <div className="relative p-0 mb-[-20px] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full md:col-span-3">
                <div className="w-full bg-white/10 backdrop-blur-md p-6 text-white mb-6">
                  <div className="border-b border-slate-400 pb-4">
                    <h2 className="text-4xl font-bold text-kemenkeudarkerblue">
                      Modul FEDA - Ekonomi Regional - Inflasi
                    </h2>
                    <span className="text-kemenkeublue text-sm italic">Financial & Economics Data Gateway</span>
                  </div>

                  <div style={{gridTemplateColumns: "repeat(4, minmax(0, 1fr))"}} className="grid gap-4 py-4">
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
                      forwhat="provinsi"
                      placeholder="Klik Disini"
                      labelMessage="Provinsi"
                      tooltipText="Jika tidak ada di daftar, Silakan ketik nama Provinsi, lalu pilih dari daftar yang muncul."
                      value={selectedProvinsi}
                      onChange={handleProvinsiChange}
                      options={provinsiOptions}
                      onSearch={(term) => setprovinsiSearchTerm(term)}
                      isReady={true}
                    />
                    <SearchableSelect
                      inputClass="mb-6"
                      forwhat="instansi"
                      labelMessage="Unit Eselon"
                      tooltipText="Jika tidak ada di daftar, Silakan ketik nama Instansi, lalu pilih dari daftar yang muncul."
                      placeholder="Klik Disini"
                      value={selectedInstance}
                      onChange={handleInstanceChange}
                      options={instansiOptions}
                      onSearch={(term) => setinstansiSearchTerm(term)}
                      isReady={true}
                    />
                    <InputElement
                      inputClass="mb-6"
                      forwhat="kantor"
                      labelMessage="Kantor"
                      typeInput="text"
                      inputName="kantor"
                      inputPlaceholder="Kantor Anda"
                      onChange={(e) => setKantor(e.target.value)}
                    />
                  </div>

                  {!isFormReady && (
                    <div className="w-full flex justify-center mb-4">
                      <span className="text-gray-400 font-semibold text-center">
                        Silakan pilih Tahun, Provinsi, Unit Eselon, dan isi Kantor minimal 5 karakter
                      </span>
                    </div>
                  )}

                  {showDelayedForm && delayedFormProps && (
                    <UniversalMonthlyFormFeda {...delayedFormProps} />
                  )}

                  {isFormReady && instance !== "Direktorat Jenderal Perbendaharaan" && (
                    <div className="w-full flex justify-center mb-4">
                      <span className="text-gray-400 font-semibold text-center">Form tidak ditemukan</span>
                    </div>
                  )}

                  {isLoadingForm && <InlineSpinner />}
                </div>
              </div>
            </div>
          </WhiteSection>
        </MainPanel>
      </div>
    </section>
  );
};

export default EkonomiRegionalInflasi;
