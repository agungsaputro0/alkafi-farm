import React, { useEffect, useState } from "react";
import { useFetchPosByInstansiTab, useFetchTabByKodifikasi, useRetrievePos } from "../hooks/HandleFeda";
import UniversalTabFormPanel from "./UniversalTabFormPanel";
import InlineSpinner from "../atoms/InlineSpinner";
const menuKey = import.meta.env.VITE_SECOND_KEY;
interface FedaApbnPengeluaranProps {
  tahun: string;
  bulan: string;
  provinsi: string;
  provinsiText?: string;
  instansi: string;
  instansiText?: string;
  kantor: string;
}

interface TabWrapperProps extends FedaApbnPengeluaranProps {
  tabId: string;
  tabName: string;
}

const TabWrapper: React.FC<TabWrapperProps> = ({
  tahun,
  bulan,
  provinsi,
  provinsiText,
  instansi,
  instansiText,
  kantor,
  tabId,
  tabName,
}) => {
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);
  const { posList, loading: posLoading, error: posError } = useFetchPosByInstansiTab(
    instansi !== "0" ? instansi : null,
    menuKey,       
    tabId    
  );

  const { fetchPos, data: posData, loading: retrieveLoading } = useRetrievePos();


  useEffect(() => {
      if (!posLoading && !posError && posList.length > 0) {
        setShowDelayedLoading(true);
        const timer = setTimeout(() => {
          setShowDelayedLoading(false);
  
          fetchPos({
            tahun: Number(tahun),
            bulan: Number(bulan),
            id_instansi: instansi,
            provinsi: provinsi,
            kantor: kantor,
            id_kodifikasi: menuKey,
            id_tab: tabId
          });
  
        }, 700);
  
        return () => clearTimeout(timer);
      }
    }, [posLoading, posError, posList, tahun, bulan, instansi, provinsi, kantor]);
  

  return (
    <>
     {(showDelayedLoading || retrieveLoading) && (
          <InlineSpinner />
      )}
      {!showDelayedLoading && !retrieveLoading && posData && (
        <UniversalTabFormPanel
          tahun={tahun}
          bulan={bulan}
          provinsi={provinsi}
          provinsiText={provinsiText}
          instansi={instansi}
          instansiText={instansiText}
          kantor={kantor}
          posList={posList}
          loadingPos={posLoading}
          errorPos={posError}
          title={tabName}
          posData={posData}
          menuKey={menuKey}
          tabId={tabId}
        />
       )}
    </>
  );
};

const FedaApbnPengeluaranDjpb: React.FC<FedaApbnPengeluaranProps> = ({
  tahun,
  bulan,
  provinsi,
  provinsiText,
  instansi,
  instansiText,
  kantor,
}) => {
  const { tabList, loading: tabLoading, error: tabError } = useFetchTabByKodifikasi(menuKey);

  if (tabLoading) return <p>Loading tab...</p>;
  if (tabError) return <p>Error: {tabError}</p>;
  return (
    <>
      <h2 className="font-bold mb-4 mt-4 text-kemenkeublue text-3xl border-b border-slate-400 pb-4">
        Direktorat Jenderal Perbendaharaan
      </h2>

      <div className="grid grid-cols-1 gap-y-4">
        {tabList.map((tab) => (
          <TabWrapper
            key={tab.id_tab}
            tahun={tahun}
            bulan={bulan}
            provinsi={provinsi}
            provinsiText={provinsiText}
            instansi={instansi}
            instansiText={instansiText}
            kantor={kantor}
            tabId={tab.id_tab}
            tabName={tab.nama}
          />
        ))}
      </div>
    </>
  );
};

export default FedaApbnPengeluaranDjpb;
