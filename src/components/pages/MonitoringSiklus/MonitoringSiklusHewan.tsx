import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import MonitoringSiklusHewan from "../../molecules/MonitoringSiklusHewan";
const MonitoringSiklusHewanLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <MonitoringSiklusHewan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default MonitoringSiklusHewanLanding;