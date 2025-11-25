import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahPerolehanPakan from "../../molecules/TambahPerolehanPakan";
const TambahPerolehanPakanForm = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahPerolehanPakan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahPerolehanPakanForm;