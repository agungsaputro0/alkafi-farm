import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingSpinner from './components/atoms/LoadingSpinner';
import StakeholderRoute from './components/hooks/StakeholderRoute';
import RedirectIfLoggedIn from './components/hooks/RedirectIfLoggedIn';
import AdminRoute from './components/hooks/AdminRoute';


const Welcome = lazy(() => import('./components/pages/Welcome'));
const LoginPage = lazy(() => import('./components/pages/Login'));
const Home = lazy(() => import('./components/pages/Home'));
const AboutUs = lazy(() => import('./components/pages/AboutUs'));
const Catalog = lazy(() => import('./components/pages/CatalogPage'));
const Profil = lazy(() => import('./components/pages/Profil'));
const SignUpPage = lazy(() => import('./components/pages/SignUp'));
const ResendActivationPage = lazy(() => import('./components/pages/ResendActivation'));
const ForgotPasswordPage = lazy(() => import('./components/pages/ForgotPassword'));
const ChangePasswordPage = lazy(() => import('./components/pages/ChangePassword'));
const RepositoryHewanTernak = lazy(() => import('./components/pages/HewanTernak/RepositoryHewanTernak'));
const TambahHewanTernak = lazy(() => import('./components/pages/HewanTernak/TambahHewan'));
const GudangObatdanSuplemen = lazy(() => import('./components/pages/GudangObatdanSuplemen/GudangObatdanSuplemenLanding'));
const TambahObatdanSuplemen = lazy(() => import('./components/pages/GudangObatdanSuplemen/TambahObatdanSuplemenForm'));
const GudangPakan = lazy(() => import('./components/pages/GudangPakan/GudangPakanLanding'));
const TambahPerolehanPakan = lazy(() => import('./components/pages/GudangPakan/TambahPerolehanPakanForm'));
const RiwayatPenimbangan = lazy(() => import('./components/pages/RiwayatPenimbangan/RiwayatPenimbanganLanding'));
const KesehatanHewan = lazy(() => import('./components/pages/KesehatanHewan/KesehatanHewanLanding'));
const RiwayatKesehatanHewan = lazy(() => import('./components/pages/KesehatanHewan/RiwayatKesehatanHewanLanding'));
const TambahRiwayatKesehatanHewan = lazy(() => import('./components/pages/KesehatanHewan/TambahRiwayatKesehatanForm'));
const MonitoringSiklusHewan = lazy(() => import('./components/pages/MonitoringSiklus/MonitoringSiklusHewan'));
const DetailMonitoringSiklus = lazy(() => import('./components/pages/MonitoringSiklus/DetailMonitoringSiklusHewanTernak'));
const TambahRiwayatSiklus = lazy(() => import('./components/pages/MonitoringSiklus/TambahRiwayatSiklusHewanTernak'));
const EKatalog = lazy(() => import('./components/pages/EKatalog/EKatalogLanding'));
const TambahEKatalog = lazy(() => import('./components/pages/EKatalog/TambahKatalog'));
const Transaksi = lazy(() => import('./components/pages/Transaksi/TransaksiLanding'));
const TambahTransaksi = lazy(() => import('./components/pages/Transaksi/TambahTransaksi'));
const TambahDetailTransaksi = lazy(() => import('./components/pages/Transaksi/TambahDetailTransaksi')); 
const ManajemenPegawai = lazy(() => import('./components/pages/ManajemenPegawai/ManajemenPegawaiLanding')); 
const TambahPegawai = lazy(() => import('./components/pages/ManajemenPegawai/TambahDataPegawai')); 
const Report = lazy(() => import('./components/pages/Report/DownloadReportPage')); 
const JadwalPembersihanKandang = lazy(() => import('./components/pages/Jadwal/JadwalPembersihanKandang')); 
const TambahJadwalPembersihanKandang = lazy(() => import('./components/pages/Jadwal/TambahJadwalPembersihanKandang')); 
const JadwalPemberianPakan = lazy(() => import('./components/pages/Jadwal/JadwalPemberianPakan')); 
const TambahJadwalPemberianPakan = lazy(() => import('./components/pages/Jadwal/TambahJadwalPemberianPakan')); 
const TambahDetailJadwalPemberianPakan = lazy(() => import('./components/pages/Jadwal/TambahDetailJadwalPakan')); 
const TambahPenugasanPakan = lazy(() => import('./components/pages/Jadwal/TambahPenugasanPakan')); 
const TaskList = lazy(() => import('./components/pages/TaskList')); 
const DetailTugasPakan = lazy(() => import('./components/pages/DetailTugasPakan')); 


const Users = lazy(() => import('./components/pages/Users'));
const AddUser = lazy(() => import('./components/pages/AddUser'));
const UpdateUser = lazy(() => import('./components/pages/UpdateUser'));
const ActivateUser = lazy(() => import('./components/pages/ActivateUser'));
const Portal = lazy(() => import('./components/pages/Portal'));
const ApbnPendapatan = lazy(() => import('./components/pages/ApbnPendapatanPage'));
const ApbnPengeluaran = lazy(() => import('./components/pages/ApbnPengeluaranPage'));
const ApbdPendapatan = lazy(() => import('./components/pages/ApbdPendapatanPage'));
const ApbdPengeluaran = lazy(() => import('./components/pages/ApbdPengeluaranPage'));
const ApbdPembiayaan = lazy(() => import('./components/pages/ApbdPembiayaanPage'));
const Pdrb = lazy(() => import('./components/pages/EkonomiRegionalPdrbPage'));
const Inflasi = lazy(() => import('./components/pages/EkonomiRegionalInflasiPage'));
const Tpt = lazy(() => import('./components/pages/EkonomiRegionalTptPage'));
const Ntp = lazy(() => import('./components/pages/EkonomiRegionalNtpPage'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/Welcome" />} />
        <Route path="/Welcome" element={<RedirectIfLoggedIn><Welcome /></RedirectIfLoggedIn>} />
        <Route path="/AboutUs" element={<RedirectIfLoggedIn><AboutUs /></RedirectIfLoggedIn>} />
        <Route path="/Catalog" element={<RedirectIfLoggedIn><Catalog /></RedirectIfLoggedIn>} />
        <Route path="/Login" element={<RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>} />
        <Route path="/SignUp" element={<RedirectIfLoggedIn><SignUpPage /></RedirectIfLoggedIn>} />
        <Route path="/ResendAktivasi" element={<RedirectIfLoggedIn><ResendActivationPage /></RedirectIfLoggedIn>} />
        <Route path="/ForgotPassword" element={<RedirectIfLoggedIn><ForgotPasswordPage /></RedirectIfLoggedIn>} />
        <Route path="/ChangePassword" element={<RedirectIfLoggedIn><ChangePasswordPage /></RedirectIfLoggedIn>} />
        <Route path="/Home" element={<StakeholderRoute><Home /></StakeholderRoute>} />
        <Route path="/e-katalog" element={<AdminRoute><EKatalog /></AdminRoute>} />
        <Route path="/tambahKatalog" element={<AdminRoute><TambahEKatalog /></AdminRoute>} />
        <Route path="/transaksi" element={<AdminRoute><Transaksi /></AdminRoute>} />
        <Route path="/tambahtransaksi" element={<AdminRoute><TambahTransaksi /></AdminRoute>} />
        <Route path="/tambahdetailTransaksi/:idTransaksi" element={<AdminRoute><TambahDetailTransaksi /></AdminRoute>} />
        <Route path="/hris" element={<AdminRoute><ManajemenPegawai /></AdminRoute>} />
        <Route path="/tambahPegawai" element={<AdminRoute><TambahPegawai /></AdminRoute>} />
        <Route path="/report" element={<AdminRoute><Report /></AdminRoute>} />
        <Route path="/Profil" element={<StakeholderRoute><Profil /></StakeholderRoute>} />
        <Route path="/Users" element={<StakeholderRoute><Users /></StakeholderRoute>} />
        <Route path="/jadwal/kandang" element={<StakeholderRoute><JadwalPembersihanKandang /></StakeholderRoute>} />
        <Route path="/tambahJadwalKandang" element={<StakeholderRoute><TambahJadwalPembersihanKandang /></StakeholderRoute>} />
        <Route path="/jadwal/pakan" element={<StakeholderRoute><JadwalPemberianPakan /></StakeholderRoute>} />
        <Route path="/tambahJadwalPakan" element={<StakeholderRoute><TambahJadwalPemberianPakan /></StakeholderRoute>} />
        <Route path="/jadwal/pakan/:idJadwal" element={<StakeholderRoute><TambahDetailJadwalPemberianPakan /></StakeholderRoute>} />
        <Route path="/tambahPenugasanPakan/:idJadwal" element={<StakeholderRoute><TambahPenugasanPakan /></StakeholderRoute>} />
        <Route path="/ternak/repository" element={<StakeholderRoute><RepositoryHewanTernak /></StakeholderRoute>} />
        <Route path="/ternak/tambahHewan" element={<StakeholderRoute><TambahHewanTernak /></StakeholderRoute>} />
        <Route path="/ternak/penimbangan" element={<StakeholderRoute><RiwayatPenimbangan /></StakeholderRoute>} />
        <Route path="/ternak/kesehatan" element={<StakeholderRoute><KesehatanHewan /></StakeholderRoute>} />
        <Route path="/ternak/kesehatan" element={<StakeholderRoute><KesehatanHewan /></StakeholderRoute>} />
        <Route path="/ternak/kesehatan/:neckTag" element={<StakeholderRoute><RiwayatKesehatanHewan /></StakeholderRoute>} />
        <Route path="/ternak/kesehatan/tambahriwayatkesehatan/:neckTag" element={<StakeholderRoute><TambahRiwayatKesehatanHewan /></StakeholderRoute>} />
        <Route path="/ternak/monitoring" element={<StakeholderRoute><MonitoringSiklusHewan /></StakeholderRoute>} />
        <Route path="/ternak/monitoring/:neckTag" element={<StakeholderRoute><DetailMonitoringSiklus /></StakeholderRoute>} />
        <Route path="/ternak/monitoring/tambahriwayatsiklus/:neckTag" element={<StakeholderRoute><TambahRiwayatSiklus /></StakeholderRoute>} />
        <Route path="/GudangObat" element={<StakeholderRoute><GudangObatdanSuplemen /></StakeholderRoute>} />
        <Route path="/GudangObat/tambahDataObatdanSuplemen" element={<StakeholderRoute><TambahObatdanSuplemen /></StakeholderRoute>} />
        <Route path="/StokPakan" element={<StakeholderRoute><GudangPakan /></StakeholderRoute>} />
        <Route path="/StokPakan/tambahPerolehanPakan" element={<StakeholderRoute><TambahPerolehanPakan /></StakeholderRoute>} />
        <Route path="/TaskList" element={<StakeholderRoute><TaskList /></StakeholderRoute>} />
        <Route path="/detailTugasPakan/:id" element={<StakeholderRoute><DetailTugasPakan /></StakeholderRoute>} />

        <Route path="/TambahUser" element={<StakeholderRoute><AddUser /></StakeholderRoute>} />
        <Route path="/UpdateUser/:tipe/:uid" element={<StakeholderRoute><UpdateUser /></StakeholderRoute>} />
        <Route path="/AktivasiAkun/:uid" element={<RedirectIfLoggedIn><ActivateUser /></RedirectIfLoggedIn>} />
        <Route path="/Portal" element={<StakeholderRoute><Portal /></StakeholderRoute>} />
        <Route path="/APBN/Pendapatan" element={<StakeholderRoute><ApbnPendapatan /></StakeholderRoute>} />
        <Route path="/APBN/Pengeluaran" element={<StakeholderRoute><ApbnPengeluaran /></StakeholderRoute>} />
        <Route path="/APBD/Pendapatan" element={<StakeholderRoute><ApbdPendapatan /></StakeholderRoute>} />
        <Route path="/APBD/Pengeluaran" element={<StakeholderRoute><ApbdPengeluaran /></StakeholderRoute>} />
        <Route path="/APBD/Pembiayaan" element={<StakeholderRoute><ApbdPembiayaan /></StakeholderRoute>} />
        <Route path="/Ekonomi/Pdrb" element={<StakeholderRoute><Pdrb /></StakeholderRoute>} />
        <Route path="/Ekonomi/Inflasi" element={<StakeholderRoute><Inflasi /></StakeholderRoute>} />
        <Route path="/Ekonomi/Tpt" element={<StakeholderRoute><Tpt /></StakeholderRoute>} />
        <Route path="/Ekonomi/Ntp" element={<StakeholderRoute><Ntp /></StakeholderRoute>} />
      </Routes>

      {/* Tambahkan container di sini */}
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </Suspense>
  );
};

export default App;
