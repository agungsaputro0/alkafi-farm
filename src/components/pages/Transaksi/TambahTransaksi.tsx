import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import TambahDataPenjualan from "../../molecules/TambahDataPenjualan";
const TambahDataTransaksi = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <TambahDataPenjualan />
                </HomeTemplate>
            </HomeShell>
    )
}

export default TambahDataTransaksi;