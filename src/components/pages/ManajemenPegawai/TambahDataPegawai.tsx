import HomeTemplate from "../../templates/HomeTemplate";
import HomeShell from "../../shell/HomeShell";
import TambahPegawai from "../../molecules/TambahPegawai";
const TambahDataPegawai = () => {
    return (
             <HomeShell>
                <HomeTemplate>
                    <TambahPegawai />
                </HomeTemplate>
            </HomeShell>
    )
}

export default TambahDataPegawai;