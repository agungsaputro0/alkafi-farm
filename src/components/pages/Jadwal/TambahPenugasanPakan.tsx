import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahPenugasanPakan from "../../molecules/TambahPenugasanPakan";
const TambahPenugasanPakanPage = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahPenugasanPakan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahPenugasanPakanPage;