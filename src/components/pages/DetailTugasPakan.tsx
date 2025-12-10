import HomeTemplate from "../templates/HomeTemplate";
import PekerjaShell from "../shell/PekerjaShell";
import PakanDetail from "../molecules/TugasPakanDetail";
const DetailTugasPakan = () => {
    return (
             <PekerjaShell>
                <HomeTemplate>
                    <PakanDetail />
                </HomeTemplate>
            </PekerjaShell>
    )
}

export default DetailTugasPakan;