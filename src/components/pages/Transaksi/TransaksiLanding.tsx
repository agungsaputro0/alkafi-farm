import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import Transaksi from "../../molecules/Transaksi";
const TransaksiLanding = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <Transaksi />
                </HomeTemplate>
            </HomeShell>
    )
}

export default TransaksiLanding;