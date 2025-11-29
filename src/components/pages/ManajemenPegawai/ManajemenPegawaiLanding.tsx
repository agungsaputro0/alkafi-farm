import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import ManajemenPegawai from "../../molecules/ManajemenPegawai";
const ManajemenPegawaiLanding = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <ManajemenPegawai />
                </HomeTemplate>
            </HomeShell>
    )
}

export default ManajemenPegawaiLanding;