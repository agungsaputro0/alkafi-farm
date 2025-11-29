import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import TambahDetailPenjualanProduk from "../../molecules/TambahDetailPenjualanProduk";
const TambahDetailTransaksi = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <TambahDetailPenjualanProduk />
                </HomeTemplate>
            </HomeShell>
    )
}

export default TambahDetailTransaksi;