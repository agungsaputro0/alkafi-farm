import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import GudangPakan from "../../molecules/GudangPakan";
const GudangPakanLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <GudangPakan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default GudangPakanLanding;