import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahHewanTernak from "../../molecules/TambahHewanTernak";
const TambahHewan = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahHewanTernak />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahHewan;