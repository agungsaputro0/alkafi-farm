import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import RiwayatKesehatanHewan from "../../molecules/RiwayatKesehatanHewan";
const RiwayatKesehatanHewanLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <RiwayatKesehatanHewan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default RiwayatKesehatanHewanLanding;