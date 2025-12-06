import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahJadwalPemberianPakan from "../../molecules/TambahJadwalPemberianPakan";
const TambahJadwalPemberianPakanPage = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahJadwalPemberianPakan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahJadwalPemberianPakanPage;