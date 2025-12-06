import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahJadwalPembersihanKandang from "../../molecules/TambahJadwalPembersihanKandang";
const TambahJadwalPembersihanKandangPage = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahJadwalPembersihanKandang />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahJadwalPembersihanKandangPage;