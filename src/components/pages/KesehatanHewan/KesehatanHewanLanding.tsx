import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import StatusKesehatanHewan from "../../molecules/StatusKesehatanHewan";
const KesehatanHewanLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <StatusKesehatanHewan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default KesehatanHewanLanding;