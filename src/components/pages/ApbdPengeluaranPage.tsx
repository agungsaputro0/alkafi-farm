import Homeshell from "../shell/HomeShell";
import HomeTemplate from "../templates/HomeTemplate";
import ApbdPengeluaran from "../molecules/ApbdPengeluaran";
const ApbdPengeluaranPage = () => {
    return (
             <Homeshell>
                <HomeTemplate>
                    <ApbdPengeluaran />
                </HomeTemplate>
            </Homeshell>
    )
}

export default ApbdPengeluaranPage;