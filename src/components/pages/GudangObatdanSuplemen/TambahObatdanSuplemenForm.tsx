import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahObatdanSuplemen from "../../molecules/TambahObatdanSuplemen";
const TambahObatdanSuplemenForm = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahObatdanSuplemen />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahObatdanSuplemenForm;