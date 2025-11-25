import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import RiwayatPenimbangan from "../../molecules/RiwayatPenimbangan";
const RiwayatPenimbanganLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <RiwayatPenimbangan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default RiwayatPenimbanganLanding;