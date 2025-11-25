import PortalShell from "../shell/PortalShell";
import HomeTemplate from "../templates/HomeTemplate";
import Dashboard from "../molecules/Dashboard";
const Portal = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <Dashboard />
                </HomeTemplate>
            </PortalShell>
    )
}

export default Portal;