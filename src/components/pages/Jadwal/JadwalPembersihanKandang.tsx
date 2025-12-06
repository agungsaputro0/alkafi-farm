import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import JadwalPembersihanKandang from "../../molecules/JadwalPembersihanKandang";
const JadwalPembersihanKandangLanding = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <JadwalPembersihanKandang />
                </HomeTemplate>
            </PortalShell>
    )
}

export default JadwalPembersihanKandangLanding;