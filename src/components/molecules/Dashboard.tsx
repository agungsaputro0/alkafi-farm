import { FaDownload } from 'react-icons/fa';
import DashboardPanels from '../atoms/DashboardPanel';
import DistribusiUmurTernak from '../atoms/DistribusiUmurTernak';
import GrafikPakan from '../atoms/GrafikPakan';
import Leaderboard from '../atoms/Leaderboard';
import MainPanel from '../atoms/MainPanel';
import PendapatanBulanan from '../atoms/PendapatanBulanan';
import PenugasanHarian from '../atoms/PenugasanHarian';
import WelcomingPanel from '../atoms/WelcomingPanel';
import WhiteSection from '../atoms/WhiteSection';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  const { userName } = useAuth();
  return (
    <section>
      <div className="pt-16 flex justify-center mb-20 mx-4" style={{ paddingLeft: '80px' }}>
        <MainPanel>
          <WhiteSection>
            <div className="relative p-0 mb-[30px] overflow-hidden rounded-xl 
                grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

              {/* Kolom kiri (2/3) */}
            <div className="flex flex-col w-full md:col-span-2 h-full min-h-[520px]">
              <div className="flex flex-col flex-grow bg-transparent h-full">
                <WelcomingPanel userName={userName || ''} />
                <div className="flex-grow flex mt-2">
                  <DashboardPanels className="flex-grow" />
                </div>
              </div>
            </div>
              {/* Kolom kanan (1/3) */}
              <div className="flex flex-col gap-6 w-full md:col-span-1 h-full">
                 <div
                    onClick={() => navigate("/Report")}
                    className={`w-full flex gap-2 text-xl hover:brightness-110 cursor-pointer transition duration-300 ease-in-out items-center justify-center bg-alkafiFarm h-[32px] border border-gray-200 backdrop-blur-md rounded-xl shadow-lg p-6 text-white font-semibold`}
                  >
                    <FaDownload className="text-xl" /> Unduh Laporan
                  </div>
                <div className="flex-grow flex">
                  <Leaderboard className="flex-grow" />
                </div>
              </div>
            </div>
            <div className="relative p-0 overflow-hidden rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="w-full">
                  <DistribusiUmurTernak />
                </div>
                <div className="w-full">
                  <GrafikPakan />
                </div>
                <div className="w-full">
                  <PendapatanBulanan />
                </div>
                <div className="w-full">
                  <PenugasanHarian />
                </div>
              </div>

          </WhiteSection>
        </MainPanel>
      </div>
    </section>
  );
};

export default Dashboard;
