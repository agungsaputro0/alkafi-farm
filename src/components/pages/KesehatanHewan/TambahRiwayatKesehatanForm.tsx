import PortalShell from "../../shell/PortalShell";
import HomeTemplate from "../../templates/HomeTemplate";
import TambahRiwayatKesehatan from "../../molecules/TambahRiwayatKesehatan";
const TambahRiwayatKesehatanForm = () => {
    return (
             <PortalShell>
                <HomeTemplate>
                    <TambahRiwayatKesehatan />
                </HomeTemplate>
            </PortalShell>
    )
}

export default TambahRiwayatKesehatanForm;