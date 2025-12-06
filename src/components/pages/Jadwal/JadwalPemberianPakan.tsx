import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import JadwalPemberianPakan from "../../molecules/JadwalPemberianPakan";
const JadwalPemberianPakanLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <JadwalPemberianPakan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default JadwalPemberianPakanLanding;