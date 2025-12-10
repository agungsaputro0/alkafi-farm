import PortalShell from "../shell/PortalShell";
import HomeTemplate from "../templates/HomeTemplate";
import Dashboard from "../molecules/Dashboard";
import WarningPanel from "../atoms/WarningPanel";
const Portal = () => {
    return (
             <PortalShell>
                <WarningPanel />
                <HomeTemplate>
                    <Dashboard />
                </HomeTemplate>
            </PortalShell>
    )
}

export default Portal;