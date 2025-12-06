import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import DetailJadwalPakan from "../../molecules/TambahDetailJadwalPakan";
const TambahDetailJadwalPenugasanPakan = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <DetailJadwalPakan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahDetailJadwalPenugasanPakan;