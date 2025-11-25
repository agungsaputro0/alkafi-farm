import Homeshell from "../shell/HomeShell";
import HomeTemplate from "../templates/HomeTemplate";
import ApbnPengeluaran from "../molecules/ApbnPengeluaran";
const ApbnPengeluaranPage = () => {
    return (
             <Homeshell>
                <HomeTemplate>
                    <ApbnPengeluaran />
                </HomeTemplate>
            </Homeshell>
    )
}

export default ApbnPengeluaranPage;