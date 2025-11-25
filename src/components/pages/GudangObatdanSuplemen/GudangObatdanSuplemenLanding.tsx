import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import GudangObatdanSuplemen from "../../molecules/GudangObatdanSuplemen";
const GudangObatdanSuplemenLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <GudangObatdanSuplemen />
                </HomeTemplate>
            </PortalShell>
    )
}

export default GudangObatdanSuplemenLanding;